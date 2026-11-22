import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Truck,
  Users,
  Tag,
  RefreshCw,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Search,
  Filter,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Bot,
  Trophy,
  X,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Layers,
  Grid,
  List,
  Settings,
  RotateCcw,
  MessageCircle,
  Lock,
  Unlock,
  Download,
  FileText,
  Printer,
  CheckSquare,
  Square,
  Percent,
  BarChart3,
  Share2,
  SlidersHorizontal,
  ArrowUpRight,
  Activity,
  MapPin,
  CreditCard,
  Smartphone,
  BadgePercent,
  Menu,
  MoreVertical
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo.png';
import logoWhite from '../../assets/logo_white.png';
import { Product, Order, MediaItem, Coupon, Category } from '../../types';
import { compressAndReadImage, formatFileSize, validateImageFile } from '../../utils/imageUtils';
import {
  exportOrdersToCSV,
  exportProductsToCSV,
  exportFullStoreBackup,
  parseStoreBackupFile
} from '../../utils/exportUtils';
import {
  getSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured
} from '../../services/supabase';
import { div } from 'motion/react-client';

export const AdminPage: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const {
    productList,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    restoreStoreData,
    currencySymbol,
    addToast,
    setActiveReceiptOrder,
    connectCloudDatabase,
    disconnectCloudDatabase,
    refreshCloudData,
    isCloudSyncActive
  } = useApp();

  // ==========================================
  // 0. SECURITY & PIN AUTHENTICATION STATE
  // ==========================================
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('dolyn_admin_pin') || '1494';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const sessionAuth = sessionStorage.getItem('dolyn_admin_auth');
    const localAuth = localStorage.getItem('dolyn_admin_auth');
    return sessionAuth === 'true' || localAuth === 'true';
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Supabase Cloud Database Configuration State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestCloudConnection = async () => {
    setIsTestingCloud(true);
    setCloudTestResult(null);
    const res = await testSupabaseConnection(supabaseUrlInput, supabaseKeyInput);
    setIsTestingCloud(false);
    setCloudTestResult(res);
    if (res.success) {
      addToast(res.message, 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  const handleSaveCloudConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      addToast('Please enter both Supabase URL and Anon Key.', 'warning');
      return;
    }
    await connectCloudDatabase(supabaseUrlInput, supabaseKeyInput);
  };

  const handleDisconnectCloud = () => {
    disconnectCloudDatabase();
    setSupabaseUrlInput('');
    setSupabaseKeyInput('');
    setCloudTestResult(null);
  };

  // Handle PIN input
  const handlePinDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setPinError(false);
      if (next.length === 4) {
        verifyPin(next);
      }
    }
  };

  const handlePinBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const verifyPin = (pinToTest: string) => {
    if (pinToTest === adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dolyn_admin_auth', 'true');
      if (rememberDevice) {
        localStorage.setItem('dolyn_admin_auth', 'true');
      }
      setEnteredPin('');
      setPinError(false);
      addToast('Welcome Gwendolyn! Management session unlocked.', 'success');
    } else {
      setPinError(true);
      setEnteredPin('');
      addToast('Incorrect security PIN. Access denied.', 'warning');
    }
  };

  // Keyboard listener for typing PIN on desktop & physical keyboards
  useEffect(() => {
    if (isAuthenticated) return;

    // Focus input on mount so typing works immediately
    pinInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing inside an input/textarea other than the hidden pin input, ignore
      if (e.target instanceof HTMLInputElement && e.target !== pinInputRef.current) {
        if (e.target.type !== 'checkbox') return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        setEnteredPin(prev => {
          if (prev.length < 4) {
            const next = prev + e.key;
            setPinError(false);
            if (next.length === 4) {
              setTimeout(() => verifyPin(next), 20);
            }
            return next;
          }
          return prev;
        });
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        setEnteredPin(prev => prev.slice(0, -1));
        setPinError(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setEnteredPin(curr => {
          if (curr.length === 4) {
            verifyPin(curr);
          }
          return curr;
        });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEnteredPin('');
        setPinError(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, adminPin, rememberDevice]);

  const handleLockPortal = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dolyn_admin_auth');
    localStorage.removeItem('dolyn_admin_auth');
    setEnteredPin('');
    addToast('Management session locked.', 'info');
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      addToast('PIN must be exactly 4 digits.', 'warning');
      return;
    }
    setAdminPin(newPinInput);
    localStorage.setItem('dolyn_admin_pin', newPinInput);
    setIsChangingPin(false);
    setNewPinInput('');
    addToast('Manager security PIN updated successfully!', 'success');
  };

  // ==========================================
  // NAVIGATION & TAB STATE
  // ==========================================
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'media' | 'orders' | 'coupons' | 'ai' | 'settings'
  >('products');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Live Accra GMT Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Africa/Accra',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // 1. CATEGORIES MANAGEMENT STATE
  // ==========================================
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catFormTitle, setCatFormTitle] = useState('');
  const [catFormIcon, setCatFormIcon] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80');
  const [catFormDesc, setCatFormDesc] = useState('');
  const [isUploadingCatIcon, setIsUploadingCatIcon] = useState(false);
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 2. PRODUCTS MANAGEMENT STATE
  // ==========================================
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [productViewMode, setProductViewMode] = useState<'grid' | 'table'>('grid');
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  // Product modal (Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Product form fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Shea Butter & Cosmetics');
  const [formPrice, setFormPrice] = useState('45.00');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('30');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80');
  const [formDescription, setFormDescription] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formWholesaleBoxPrice, setFormWholesaleBoxPrice] = useState('450.00');
  const [formWholesaleBoxQty, setFormWholesaleBoxQty] = useState('12');
  const [formIsPreOrder, setFormIsPreOrder] = useState(false);
  const [formIsDrug, setFormIsDrug] = useState(false);
  const [formDosage, setFormDosage] = useState('');
  const [formBadges, setFormBadges] = useState<string[]>(['Popular']);

  // In-form image picker modal
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isUploadingInForm, setIsUploadingInForm] = useState(false);
  const formFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 3. MEDIA & CATEGORY PICTURES STATE
  // ==========================================
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<string>('All');
  const [mediaSearch, setMediaSearch] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadTargetCategory, setUploadTargetCategory] = useState<string>('Shea Butter & Cosmetics');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFileSize, setUploadFileSize] = useState<string>('');
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [previewLightboxImage, setPreviewLightboxImage] = useState<MediaItem | null>(null);

  // ==========================================
  // 4. ORDERS & DISPATCH WAYBILL STATE
  // ==========================================
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeDispatchOrder, setActiveDispatchOrder] = useState<Order | null>(null);

  // ==========================================
  // 5. COUPONS STATE
  // ==========================================
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState('15');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // ==========================================
  // 6. AI REPORT STATE
  // ==========================================
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  // ==========================================
  // 7. BACKUP & RESTORE FILE INPUT
  // ==========================================
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // CALCULATIONS & METRICS
  // ==========================================
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter(o => o.status !== 'Delivered').length, [orders]);
  const momoOrders = useMemo(
    () => orders.filter(o => o.paymentMethod.includes('MoMo') || o.paymentMethod.includes('Telecel') || o.paymentMethod.includes('AT')).length,
    [orders]
  );
  const cardOrders = useMemo(() => orders.filter(o => o.paymentMethod.includes('Card')).length, [orders]);
  const lowStockCount = useMemo(() => productList.filter(p => (p.stockCount ?? 20) <= 10).length, [productList]);

  const categoryNames = useMemo(() => categories.map(c => c.title), [categories]);

  // Sales by category breakdown
  const categorySalesStats = useMemo(() => {
    const stats: Record<string, { totalRevenue: number; count: number }> = {};
    categoryNames.forEach(c => {
      stats[c] = { totalRevenue: 0, count: 0 };
    });

    orders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.product.category || 'Shea Butter & Cosmetics';
        if (!stats[cat]) stats[cat] = { totalRevenue: 0, count: 0 };
        const price =
          item.isWholesaleBox && item.product.wholesaleBoxPrice
            ? parseFloat(item.product.wholesaleBoxPrice.replace(/[^\d.]/g, '') || '400')
            : item.product.numericPrice || 45;
        stats[cat].totalRevenue += price * item.quantity;
        stats[cat].count += item.quantity;
      });
    });

    return stats;
  }, [orders, categoryNames]);

  // Top 5 Best-Selling Products Leaderboard
  const topProductsLeaderboard = useMemo(() => {
    const productSalesMap: Record<number, { product: Product; unitsSold: number; revenue: number }> = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const pId = item.product.id;
        if (!productSalesMap[pId]) {
          productSalesMap[pId] = { product: item.product, unitsSold: 0, revenue: 0 };
        }
        const unitPrice =
          item.isWholesaleBox && item.product.wholesaleBoxPrice
            ? parseFloat(item.product.wholesaleBoxPrice.replace(/[^\d.]/g, '') || '400')
            : item.product.numericPrice || 45;

        productSalesMap[pId].unitsSold += item.quantity;
        productSalesMap[pId].revenue += unitPrice * item.quantity;
      });
    });

    return Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;

      const stock = p.stockCount ?? 20;
      let matchesStock = true;
      if (productStockFilter === 'in_stock') matchesStock = stock > 10;
      else if (productStockFilter === 'low_stock') matchesStock = stock > 0 && stock <= 10;
      else if (productStockFilter === 'out_of_stock') matchesStock = stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [productList, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered media items
  const filteredMedia = useMemo(() => {
    return mediaItems.filter(m => {
      const matchesCategory = selectedMediaCategory === 'All' || m.category === selectedMediaCategory;
      const matchesSearch =
        m.title.toLowerCase().includes(mediaSearch.toLowerCase()) ||
        m.category.toLowerCase().includes(mediaSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [mediaItems, selectedMediaCategory, mediaSearch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch) ||
        o.deliveryRegion.toLowerCase().includes(orderSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // ==========================================
  // HANDLERS: PRODUCTS
  // ==========================================
  const handleOpenAddModal = (prefillImage?: string, prefillCategory?: string) => {
    setEditingProductId(null);
    setFormTitle('');
    setFormCategory(prefillCategory || 'Shea Butter & Cosmetics');
    setFormPrice('45.00');
    setFormOriginalPrice('');
    setFormStock('30');
    setFormImage(
      prefillImage ||
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    );
    setFormDescription('');
    setFormSku(`DOLYN-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormWholesaleBoxPrice('450.00');
    setFormWholesaleBoxQty('12');
    setFormIsPreOrder(false);
    setFormIsDrug(false);
    setFormDosage('');
    setFormBadges(['New']);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormPrice(p.numericPrice ? p.numericPrice.toFixed(2) : p.price.replace(/[^\d.]/g, '') || '45.00');
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.replace(/[^\d.]/g, '') : '');
    setFormStock(String(p.stockCount ?? 20));
    setFormImage(p.image);
    setFormDescription(p.description || '');
    setFormSku(p.sku || `DOLYN-PR-${p.id}`);
    setFormWholesaleBoxPrice(p.wholesaleBoxPrice ? p.wholesaleBoxPrice.replace(/[^\d.]/g, '') : '450.00');
    setFormWholesaleBoxQty(String(p.wholesaleBoxQuantity || 12));
    setFormIsPreOrder(!!p.isPreOrder);
    setFormIsDrug(!!p.isDrugOrHealthcare);
    setFormDosage(p.dosageOrUsage || '');
    setFormBadges(p.badges || ['Popular']);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(formPrice) || 45.0;
    const numStock = parseInt(formStock) || 20;
    const numBoxPrice = parseFloat(formWholesaleBoxPrice) || numPrice * 10;
    const numBoxQty = parseInt(formWholesaleBoxQty) || 12;

    const productPayload: Partial<Product> = {
      title: formTitle.trim() || 'Custom Product Offering',
      category: formCategory,
      price: `GH₵ ${numPrice.toFixed(2)}`,
      numericPrice: numPrice,
      originalPrice: formOriginalPrice ? `GH₵ ${parseFloat(formOriginalPrice).toFixed(2)}` : null,
      stockCount: numStock,
      inStock: numStock > 0,
      image: formImage,
      description: formDescription.trim(),
      sku: formSku || `DOLYN-${Math.floor(1000 + Math.random() * 9000)}`,
      wholesaleBoxPrice: `GH₵ ${numBoxPrice.toFixed(2)}`,
      wholesaleBoxQuantity: numBoxQty,
      isPreOrder: formIsPreOrder,
      isDrugOrHealthcare: formIsDrug,
      dosageOrUsage: formIsDrug ? formDosage : undefined,
      badges: formBadges
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Partial<Product> = {
      ...p,
      title: `${p.title} (Copy)`,
      sku: `DOLYN-CP-${Math.floor(1000 + Math.random() * 9000)}`,
      stockCount: 20
    };
    delete (duplicated as any).id;
    addProduct(duplicated);
    addToast(`Duplicated "${p.title}"`, 'info');
  };

  // ==========================================
  // HANDLERS: CATEGORIES
  // ==========================================
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCatFormTitle('');
    setCatFormIcon('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80');
    setCatFormDesc('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCatFormTitle(cat.title);
    setCatFormIcon(cat.icon);
    setCatFormDesc(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormTitle.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        title: catFormTitle.trim(),
        icon: catFormIcon,
        description: catFormDesc.trim()
      });
    } else {
      addCategory({
        title: catFormTitle.trim(),
        icon: catFormIcon,
        description: catFormDesc.trim()
      });
    }
    setIsCategoryModalOpen(false);
  };

  const handleCatIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      addToast(validation.error || 'Invalid file', 'warning');
      return;
    }

    setIsUploadingCatIcon(true);
    try {
      const compressedDataUrl = await compressAndReadImage(file, 600, 600, 0.85);
      setCatFormIcon(compressedDataUrl);
      addToast('Category cover photo uploaded & compressed!', 'success');
    } catch {
      addToast('Failed to process image upload', 'warning');
    } finally {
      setIsUploadingCatIcon(false);
      if (catFileInputRef.current) catFileInputRef.current.value = '';
    }
  };

  // Quick file upload inside product form
  const handleProductFormImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      addToast(validation.error || 'Invalid file', 'warning');
      return;
    }

    setIsUploadingInForm(true);
    try {
      const compressedDataUrl = await compressAndReadImage(file, 900, 900, 0.85);
      setFormImage(compressedDataUrl);

      // Automatically add to category media library
      addMediaItem({
        title: formTitle ? `${formTitle} Photo` : file.name.replace(/\.[^/.]+$/, ''),
        category: formCategory,
        url: compressedDataUrl,
        size: formatFileSize(file.size)
      });

      addToast('Picture compressed & saved to Category Media Vault!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to process picture upload.', 'warning');
    } finally {
      setIsUploadingInForm(false);
      if (formFileInputRef.current) formFileInputRef.current.value = '';
    }
  };

  // ==========================================
  // HANDLERS: MEDIA LIBRARY
  // ==========================================
  const handleMediaFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      addToast(validation.error || 'Invalid file', 'warning');
      return;
    }

    setIsUploadingMedia(true);
    try {
      const compressedDataUrl = await compressAndReadImage(file, 1000, 1000, 0.85);
      setUploadPreview(compressedDataUrl);
      setUploadFileSize(formatFileSize(file.size));
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error(err);
      addToast('Error previewing picture.', 'warning');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleConfirmMediaUpload = () => {
    if (!uploadPreview) {
      addToast('Please select a photo first.', 'warning');
      return;
    }

    addMediaItem({
      title: uploadTitle.trim() || `${uploadTargetCategory} Photo`,
      category: uploadTargetCategory,
      url: uploadPreview,
      size: uploadFileSize || '65 KB'
    });

    setUploadPreview(null);
    setUploadTitle('');
    setUploadFileSize('');
    if (mediaFileInputRef.current) mediaFileInputRef.current.value = '';
    addToast(`Added picture to ${uploadTargetCategory}!`, 'success');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    addToast('Picture URL copied to clipboard!', 'info');
  };

  // ==========================================
  // HANDLERS: BATCH ORDER ACTIONS
  // ==========================================
  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const toggleSelectAllOrders = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const handleBatchUpdateStatus = (newStatus: Order['status']) => {
    selectedOrderIds.forEach(id => updateOrderStatus(id, newStatus));
    addToast(`Updated ${selectedOrderIds.length} orders to: ${newStatus}`, 'success');
    setSelectedOrderIds([]);
  };

  // ==========================================
  // HANDLERS: DISPATCH WAYBILL COPY
  // ==========================================
  const handleCopyWaybillForRider = (order: Order) => {
    const itemsText = order.items
      .map(i => `• ${i.quantity}x ${i.product.title}${i.isWholesaleBox ? ' [Carton]' : ''}`)
      .join('\n');

    const message = `🚚 *PACKED BY DOLYN — COURIER DISPATCH MANIFEST*
*Tracking ID:* ${order.id}
*Delivery Zone:* ${order.deliveryRegion}
*Delivery Type:* ${order.deliveryType}

*RECIPIENT DETAILS:*
*Name:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Address / Landmark:* ${order.deliveryAddress}

*PACKAGE ITEMS:*
${itemsText}
${order.customNotes ? `*Special Note:* "${order.customNotes}"\n` : ''}
*PAYMENT STATUS:* ${order.paymentMethod} (PAID IN FULL — DO NOT COLLECT CASH)
*Total Value:* GH₵ ${order.total.toFixed(2)}

*SENDER:* Gwendolyn Barnie Boahen • Packed by Dolyn • Tel: 0244149464 (Accra Hub)`;

    navigator.clipboard?.writeText(message);
    addToast('Dispatch Rider manifest copied to clipboard!', 'success');
  };

  // ==========================================
  // HANDLERS: COUPONS
  // ==========================================
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode,
      discountPercent: parseInt(newCouponPercent) || 10,
      description: newCouponDesc.trim() || 'Store promotional code',
      isActive: true
    });
    setNewCouponCode('');
    setNewCouponDesc('');
    setIsAddingCoupon(false);
  };

  // ==========================================
  // HANDLERS: BACKUP & RESTORE
  // ==========================================
  const handleRestoreFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseStoreBackupFile(file);
      if (confirm(`Restore store data from "${file.name}"? This will sync your products, media library, and orders.`)) {
        restoreStoreData(data);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to parse backup file.', 'warning');
    } finally {
      if (backupFileInputRef.current) backupFileInputRef.current.value = '';
    }
  };

  // ==========================================
  // HANDLERS: AI REPORT
  // ==========================================
  const handleGenerateAiReport = async () => {
    setIsGeneratingAi(true);
    setAiReport('');
    try {
      const response = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders,
          products: productList,
          period: 'today'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setAiReport(data.summary || data.fallback || 'Report generated successfully.');
      addToast('Executive AI report created!', 'success');
    } catch (err: any) {
      console.error(err);
      setAiReport(
        `📊 Executive Daily Briefing for Packed by Dolyn\nGenerated for: Gwendolyn Barnie Boahen (Business Owner)\n\n• Sales & Revenue: Total order volume GH₵ ${totalRevenue.toFixed(2)} across ${orders.length} orders.\n• Order Fulfillment: ${pendingOrders} dispatch(es) pending delivery in Greater Accra and courier parcels.\n• Payment Breakdown: ${momoOrders} via Mobile Money (MTN MoMo/Telecel/AT Money) and ${cardOrders} via Paystack cards.\n• Low Stock Alert: Monitor inventory of Whipped Shea Butter (250g) and Vitamin C 1000mg Effervescent.\n• Action Recommendations:\n  1. Confirm dispatch rider pickups for Accra East Legon & Airport City deliveries.\n  2. Follow up on pre-orders for luxury wedding gift hampers.\n  3. Verify bulk carton packaging supplies.`
      );
      addToast('Generated fallback business summary', 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // =========================================================================
  // RENDER: FINTECH SECURITY PIN LOCK SCREEN (IF NOT AUTHENTICATED)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0418] text-white flex flex-col justify-between font-['Rubik',sans-serif] relative overflow-hidden select-none">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top bar info */}
        <header className="p-6 flex items-center justify-between text-xs text-slate-400 relative z-10 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider text-slate-300 uppercase text-[10.5px]">
              Packed by Dolyn Enterprise Portal
            </span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-300 font-semibold"
          >
            <span>Exit to Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Center Keypad Vault */}
        <main
          className="flex-1 flex items-center justify-center p-4 relative z-10"
          onClick={() => pinInputRef.current?.focus()}
        >
          <div className="max-w-sm w-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-2xl space-y-6 text-center ring-1 ring-white/5 relative">
            {/* Hidden Input for direct typing & mobile keyboards */}
            <input
              ref={pinInputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={enteredPin}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setEnteredPin(val);
                setPinError(false);
                if (val.length === 4) {
                  verifyPin(val);
                }
              }}
              className="sr-only"
              aria-label="Enter 4-digit Management PIN"
              autoFocus
            />

            {/* Crown Shield Header with Official White Logo */}
            <div className="flex flex-col items-center justify-center mb-3">
              <img
                src={logoWhite}
                alt="Packed by Dolyn Official Logo"
                className="h-28 sm:h-32 md:h-36 w-auto object-contain drop-shadow-lg"
              />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Managing Director Clearance
              </span>
              <p className="text-xs text-slate-400 mt-2">
                Authorized Executive: <strong className="text-slate-200">Gwendolyn Barnie Boahen</strong>
              </p>
            </div>

            {/* Masked PIN Indicators */}
            <div className="py-1">
              <div
                className={`flex justify-center items-center gap-3.5 ${pinError ? 'animate-bounce' : ''
                  }`}
              >
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${enteredPin.length > idx
                      ? 'bg-amber-400 border-amber-300 scale-125 shadow-lg shadow-amber-400/60'
                      : 'border-slate-700 bg-slate-800/80'
                      }`}
                  />
                ))}
              </div>
              {pinError && (
                <span className="text-rose-400 text-xs font-bold block mt-3 animate-fade-in">
                  Incorrect security PIN. Access denied.
                </span>
              )}
            </div>

            {/* Numeric Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinDigit(num)}
                  className="h-13 bg-white/5 hover:bg-white/15 active:scale-95 text-white font-bold text-lg rounded-2xl transition-all border border-white/5 hover:border-amber-400/30 flex items-center justify-center cursor-pointer shadow-xs"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePinBackspace}
                className="h-13 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 font-bold text-xs rounded-2xl transition-all border border-white/5 flex items-center justify-center cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-13 bg-white/5 hover:bg-white/15 active:scale-95 text-white font-bold text-lg rounded-2xl transition-all border border-white/5 hover:border-amber-400/30 flex items-center justify-center cursor-pointer shadow-xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => verifyPin(enteredPin)}
                className="h-13 bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center cursor-pointer"
              >
                Unlock
              </button>
            </div>

            {/* Device Memory Toggle */}
            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
              <input
                type="checkbox"
                id="rememberDevice"
                checked={rememberDevice}
                onChange={e => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 cursor-pointer accent-amber-500"
              />
              <label htmlFor="rememberDevice" className="cursor-pointer select-none text-[11px] hover:text-slate-200">
                Stay signed in on this private device
              </label>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Hub: <strong>Accra, Ghana</strong></span>
              <span>PIN: <strong>••••</strong></span>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="p-4 text-center text-[11px] text-slate-600 relative z-10">
          Packed by Dolyn E-Commerce Management Platform • Secured with 256-bit Client Enclave
        </footer>
      </div>
    );
  }

  // =========================================================================
  // =========================================================================
  // =========================================================================
  // MAIN ADMIN DASHBOARD (AUTHENTICATED EXECUTIVE WORKSPACE)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-['Rubik',sans-serif] flex flex-col">
      {/* =========================================================================
          TOP EXECUTIVE COMMAND BAR (STICKY)
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 min-h-18 sm:min-h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Nav Toggle + Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <img src={logo} alt="Packed by Dolyn Logo" className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-purple-100 text-[#581C87] border border-purple-200/60 shrink-0">
                    Enterprise Portal
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ring-2 ring-emerald-200" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 truncate">
                    Live Storefront • Accra: <strong className="text-slate-700">{currentTime || 'GMT'}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenAddModal()}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden font-black">Add</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('media');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden md:flex px-3 py-2 bg-purple-50 hover:bg-purple-100 text-[#581C87] border border-purple-200 rounded-xl text-xs font-bold transition-all items-center gap-1.5 cursor-pointer active:scale-95"
              title="Upload picture to Category Media Vault"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={onExit}
              className="px-2.5 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="View live customer storefront"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
            </button>

            <button
              onClick={handleLockPortal}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              title="Lock Admin Session"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Profile Pill */}
            <div className="hidden lg:flex items-center gap-2.5 pl-2.5 border-l border-slate-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-800 text-white font-black flex items-center justify-center text-xs shadow-xs ring-2 ring-purple-100">
                GB
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-900 block leading-tight">Gwendolyn B.</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Owner / Director</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          WORKSPACE DUAL-PANEL LAYOUT
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1 w-full flex gap-6 pb-8">
        {/* Mobile Navigation Backdrop */}
        {isMobileNavOpen && (
          <div
            className="fixed inset-0 bg-slate-950/50 z-45 lg:hidden backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ==========================================
            DESKTOP & OFF-CANVAS SIDEBAR NAVIGATION
           ========================================== */}
        <aside
          className={`lg:w-64 shrink-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-white lg:bg-transparent border-r lg:border-none border-slate-200 p-4 lg:p-0 w-72 transition-transform duration-300 lg:translate-x-0 ${isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
            }`}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-4 mb-3 border-b border-slate-100">
            <span className="font-extrabold text-sm text-slate-900">Manager Modules</span>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 space-y-4 lg:sticky lg:top-24">
            {/* Nav Group 1: Core Operations */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                Core Operations
              </span>

              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className={`w-4 h-4 ${activeTab === 'overview' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Overview & Analytics</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Products & Stock</span>
                </div>
                <div className="flex items-center gap-1">
                  {lowStockCount > 0 && (
                    <span className="text-[9.5px] px-1.5 py-0.2 rounded-full font-black bg-amber-100 text-amber-800">
                      {lowStockCount} low
                    </span>
                  )}
                  <span className="text-[10px] opacity-75 font-semibold">({productList.length})</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('categories');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'categories'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className={`w-4 h-4 ${activeTab === 'categories' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Categories</span>
                </div>
                <span className="text-[10px] opacity-75 font-semibold">({categories.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('media');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'media'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className={`w-4 h-4 ${activeTab === 'media' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Category Photos</span>
                </div>
                <span className="text-[10px] opacity-75 font-semibold">({mediaItems.length})</span>
              </button>
            </div>

            {/* Nav Group 2: Fulfillment & Sales */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                Fulfillment & Sales
              </span>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Orders & Dispatches</span>
                </div>
                {pendingOrders > 0 && (
                  <span className="text-[9.5px] px-1.5 py-0.2 rounded-full font-black bg-emerald-100 text-emerald-800">
                    {pendingOrders} active
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('coupons');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'coupons'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Percent className={`w-4 h-4 ${activeTab === 'coupons' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Coupons & Promos</span>
                </div>
                <span className="text-[10px] opacity-75 font-semibold">({coupons.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ai');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'ai'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bot className={`w-4 h-4 ${activeTab === 'ai' ? 'text-amber-300' : 'text-purple-600'}`} />
                  <span>AI Operations Briefing</span>
                </div>
                <span className="text-[9.5px] font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  Flash
                </span>
              </button>
            </div>

            {/* Nav Group 3: Clients & Settings */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
                Enterprise & System
              </span>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50/70 hover:text-[#581C87]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>Settings & Backups</span>
                </div>
              </button>
            </div>

            {/* Mini Enterprise Footer Note */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Enterprise Hub</span>
                <strong className="text-slate-800 block text-xs">Accra, Greater Accra</strong>
                <span className="text-slate-600 text-[10.5px]">Tel: 0244149464</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay backdrop for mobile navigation */}
        {isMobileNavOpen && (
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity animate-fade-in"
          />
        )}

        {/* ==========================================
            MAIN CONTENT STAGE
           ========================================== */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* ==========================================
              EXECUTIVE KPI METRICS STRIP
             ========================================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Gross Sales */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Sales</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#581C87] border border-purple-100 flex items-center justify-center transition-transform group-hover:scale-110">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight block">
                  {currencySymbol} {totalRevenue.toFixed(2)}
                </span>
                <span className="text-[10.5px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>MoMo & Card Verified</span>
                </span>
              </div>
            </div>

            {/* 2. Total Orders */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight block">
                  {orders.length} Orders
                </span>
                <span className="text-[10.5px] font-bold text-slate-500 block mt-1">
                  {momoOrders} MoMo • {cardOrders} Card
                </span>
              </div>
            </div>

            {/* 3. Dispatches */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dispatches</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight block">
                  {pendingOrders} Active
                </span>
                <span className="text-[10.5px] font-bold text-sky-700 block mt-1">
                  Courier Manifests Ready
                </span>
              </div>
            </div>

            {/* 4. Products */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Catalog Items</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight block">
                  {productList.length} Items
                </span>
                <span className={`text-[10.5px] font-bold block mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {lowStockCount > 0 ? `${lowStockCount} Low stock alert` : 'Inventory healthy'}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              TAB 0: OVERVIEW & VISUAL ANALYTICS
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Category Revenue Distribution and Best Sellers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Category Sales Distribution */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-black text-base text-slate-950">Sales Revenue by Category</h4>
                      <p className="text-xs text-slate-500">Distribution across Ghanaian cosmetics, fragrances, hampers & healthcare</p>
                    </div>
                    <span className="text-xs font-black text-[#581C87] bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60 self-start sm:self-auto">
                      Total: {currencySymbol} {totalRevenue.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {categoryNames.map(cat => {
                      const catRev = categorySalesStats[cat]?.totalRevenue || 0;
                      const catUnits = categorySalesStats[cat]?.count || 0;
                      const pct = totalRevenue > 0 ? (catRev / totalRevenue) * 100 : 0;

                      return (
                        <div key={cat} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800">{cat}</span>
                            <span className="font-extrabold text-[#581C87]">
                              GH₵ {catRev.toFixed(2)} ({catUnits} units • {pct.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#581C87] to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(pct, 2))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Breakdown Cards */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        <span>Mobile Money (MoMo / Telecel)</span>
                      </div>
                      <strong className="text-xl font-black text-amber-950 mt-1.5 block">
                        {momoOrders} Orders ({orders.length > 0 ? ((momoOrders / orders.length) * 100).toFixed(0) : 0}%)
                      </strong>
                    </div>

                    <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Card Payments (Paystack)</span>
                      </div>
                      <strong className="text-xl font-black text-blue-950 mt-1.5 block">
                        {cardOrders} Orders ({orders.length > 0 ? ((cardOrders / orders.length) * 100).toFixed(0) : 0}%)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right Col: Top 5 Best-Sellers Leaderboard */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="font-black text-base text-slate-950 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Best-Sellers Leaderboard</span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Top 5</span>
                    </div>

                    <div className="divide-y divide-slate-100 mt-2">
                      {topProductsLeaderboard.map((item, idx) => (
                        <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${idx === 0
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : idx === 1
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-purple-100 text-purple-900'
                              }`}
                          >
                            {idx + 1}
                          </span>
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-10 h-10 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200/80"
                          />
                          <div className="min-w-0 flex-1">
                            <h6 className="font-bold text-xs text-slate-900 truncate">{item.product.title}</h6>
                            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-0.5">
                              <span>{item.unitsSold} units</span>
                              <strong className="text-[#581C87]">GH₵ {item.revenue.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleGenerateAiReport()}
                      className="w-full py-2.5 bg-gradient-to-r from-[#1E0B36] to-purple-900 hover:from-purple-950 hover:to-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>Run AI Operations Brief</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 1: PRODUCTS & CATALOG MANAGEMENT
             ========================================================================= */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              {/* Header Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Product Catalog & Stock Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage prices, stock counts, wholesale cartons, and pharmaceutical products.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportProductsToCSV(productList)}
                    className="px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Export products to CSV / Excel"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  {/* Segmented View Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${productViewMode === 'grid'
                        ? 'bg-white text-[#581C87] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                      title="Grid Card View"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${productViewMode === 'table'
                        ? 'bg-white text-[#581C87] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                      title="High-Density Table View"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal()}
                    className="px-4 py-2 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-black transition-all shadow-xs hover:shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                <button
                  onClick={() => setProductCategoryFilter('All')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${productCategoryFilter === 'All'
                    ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
                    }`}
                >
                  All Categories ({productList.length})
                </button>
                {categoryNames.map(cat => {
                  const count = productList.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${productCategoryFilter === cat
                        ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
                        }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search and Stock Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, SKU, or category..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#581C87] transition-all"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar text-xs">
                  {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setProductStockFilter(status)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-[11px] whitespace-nowrap flex items-center gap-1.5 ${productStockFilter === status
                        ? 'bg-[#1E0B36] text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      {status === 'all' && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>All Stock</span>
                        </>
                      )}
                      {status === 'in_stock' && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>In Stock</span>
                        </>
                      )}
                      {status === 'low_stock' && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Low Stock (≤10)</span>
                        </>
                      )}
                      {status === 'out_of_stock' && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Out of Stock</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Empty state if no products match */}
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Package className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-slate-800">No products match your search or filter</h4>
                  <p className="text-xs text-slate-500">Try adjusting your category filter, stock status, or search query.</p>
                  <button
                    onClick={() => {
                      setProductSearch('');
                      setProductCategoryFilter('All');
                      setProductStockFilter('all');
                    }}
                    className="px-4 py-2 bg-[#581C87] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#4C1D95] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Products Display (Grid View) */}
              {productViewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(prod => {
                    const stock = prod.stockCount ?? 20;
                    const isLow = stock > 0 && stock <= 10;
                    const isOut = stock === 0;

                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 transition-all duration-200 hover:-translate-y-0.5 p-3.5 shadow-2xs hover:shadow-md flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image Box */}
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                              <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-950/75 text-white backdrop-blur-xs">
                                {prod.category}
                              </span>
                              {prod.isPreOrder && (
                                <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                                  Pre-Order
                                </span>
                              )}
                              {prod.isDrugOrHealthcare && (
                                <span className="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                                  Rx Healthcare
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-2 right-2">
                              {isOut ? (
                                <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>Out of Stock</span>
                                </span>
                              ) : isLow ? (
                                <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                                  <span>Low: {stock} left</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                  <span>Stock: {stock}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                            {prod.sku || `DOLYN-${prod.id}`}
                          </span>
                          <h4 className="font-bold text-xs text-slate-950 line-clamp-2 mt-0.5" title={prod.title}>
                            {prod.title}
                          </h4>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <span className="text-sm font-black text-[#581C87]">
                              {prod.price}
                            </span>
                            {prod.originalPrice && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {prod.originalPrice}
                              </span>
                            )}
                          </div>

                          {prod.wholesaleBoxPrice && (
                            <p className="text-[10.5px] text-slate-500 mt-1">
                              Carton ({prod.wholesaleBoxQuantity || 12}x):{' '}
                              <strong className="text-slate-800">{prod.wholesaleBoxPrice}</strong>
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="flex-1 py-1.5 px-2.5 bg-purple-50 hover:bg-purple-100 text-[#581C87] border border-purple-200/70 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDuplicateProduct(prod)}
                            className="p-1.5 text-slate-500 hover:text-[#581C87] hover:bg-purple-50 border border-transparent hover:border-purple-200 rounded-xl transition-all cursor-pointer active:scale-95"
                            title="Duplicate product"
                          >
                            <Copy className="w-3.5 h-3.5 text-purple-600" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete "${prod.title}" from store catalog?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all cursor-pointer active:scale-95"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* High-Density Table View */
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Price</th>
                          <th className="p-3.5">Stock Level</th>
                          <th className="p-3.5">Wholesale Box</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map(prod => {
                          const stock = prod.stockCount ?? 20;
                          return (
                            <tr key={prod.id} className="hover:bg-purple-50/20 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prod.image}
                                    alt={prod.title}
                                    className="w-11 h-11 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200/80"
                                  />
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-xs text-slate-900 truncate max-w-xs">{prod.title}</h5>
                                    <span className="text-[10px] text-slate-400 block">{prod.sku || `DOLYN-${prod.id}`}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className="bg-purple-100 text-[#581C87] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200/60">
                                  {prod.category}
                                </span>
                              </td>
                              <td className="p-3.5 font-black text-[#581C87]">
                                {prod.price}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`text-[11px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${stock <= 0
                                    ? 'bg-rose-100 text-rose-800'
                                    : stock <= 10
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${stock <= 0 ? 'bg-rose-600' : stock <= 10 ? 'bg-amber-600' : 'bg-emerald-600'}`} />
                                  <span>{stock} in stock</span>
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-600 text-[11px]">
                                {prod.wholesaleBoxPrice ? `${prod.wholesaleBoxPrice} (${prod.wholesaleBoxQuantity || 12}x)` : '—'}
                              </td>
                              <td className="p-3.5 text-right relative">
                                <div className="relative inline-block text-left">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenuId(openActionMenuId === prod.id ? null : prod.id);
                                    }}
                                    className={`p-2 rounded-xl border transition-all cursor-pointer ${openActionMenuId === prod.id
                                      ? 'bg-purple-100 text-[#581C87] border-purple-300 shadow-xs'
                                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                                      }`}
                                    title="Product actions"
                                    aria-label="Actions"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {openActionMenuId === prod.id && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenActionMenuId(null);
                                        }}
                                      />
                                      <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-left animate-fade-in divide-y divide-slate-100">
                                        <div className="py-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenActionMenuId(null);
                                              handleOpenEditModal(prod);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#581C87] flex items-center gap-2 cursor-pointer transition-colors"
                                          >
                                            <Edit className="w-3.5 h-3.5 text-[#581C87]" />
                                            <span>Edit Details</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenActionMenuId(null);
                                              handleDuplicateProduct(prod);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer transition-colors"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-purple-600" />
                                            <span>Duplicate</span>
                                          </button>
                                        </div>
                                        <div className="py-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenActionMenuId(null);
                                              if (confirm(`Delete "${prod.title}" from store catalog?`)) {
                                                deleteProduct(prod.id);
                                              }
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                            <span>Delete Product</span>
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: CATEGORIES & TAXONOMIES MANAGEMENT
             ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-[#581C87]">
                    Storefront Taxonomy
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">
                    Product Categories & Collections
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create new collections, upload cover photos, or edit descriptions. Newly added categories update the shop and media vault in real time.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Category</span>
                </button>
              </div>

              {/* Categories Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const productCount = productList.filter(p => p.category === cat.title).length;
                  const mediaCount = mediaItems.filter(m => m.category === cat.title).length;

                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 transition-all bg-white shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-purple-100 border border-purple-200 shrink-0">
                          <img
                            src={cat.icon}
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-sm text-slate-950 truncate">{cat.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {cat.description || 'Collection of premium handcrafted Ghanaian enterprise goods.'}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10.5px] font-bold">
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#581C87]">
                              {productCount} Products
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {mediaCount} Pictures
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                        <button
                          onClick={() => {
                            setProductCategoryFilter(cat.title);
                            setActiveTab('products');
                          }}
                          className="flex-1 py-1 px-2 bg-purple-50 hover:bg-purple-100 text-[#581C87] text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                        >
                          View Products
                        </button>

                        <button
                          onClick={() => {
                            setSelectedMediaCategory(cat.title);
                            setActiveTab('media');
                          }}
                          className="flex-1 py-1 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-center"
                        >
                          Pictures
                        </button>

                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-[#581C87] rounded-lg transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete category "${cat.title}"? Products in this category will remain.`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: MEDIA & PICTURE LIBRARY (CATEGORY ASSET MANAGER)
             ========================================================================= */}
          {activeTab === 'media' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-[#581C87]">
                    Category Visual Vault
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">
                    Picture Library & Category Photo Manager
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload pictures from your phone or PC into specific categories. Automatic canvas compression keeps storage lightweight.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#1E0B36] text-white rounded-xl text-xs font-black">
                    {mediaItems.length} Visual Assets
                  </span>
                </div>
              </div>

              {/* Modern Upload Box with Dropzone Feel */}
              <div className="bg-gradient-to-br from-purple-50/70 via-white to-slate-50 p-5 sm:p-6 rounded-2xl border-2 border-dashed border-purple-300 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-950 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#581C87]" />
                      <span>Upload New Picture to Category</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Select target category, upload camera or high-res photos. Automatically compressed to ~65KB.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Assign Category:</span>
                    <select
                      value={uploadTargetCategory}
                      onChange={e => setUploadTargetCategory(e.target.value)}
                      className="p-2 bg-white rounded-xl border border-purple-200 text-xs font-bold text-[#581C87] cursor-pointer"
                    >
                      {categoryNames.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={mediaFileInputRef}
                    onChange={handleMediaFileSelected}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => mediaFileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-purple-50 text-[#581C87] border border-purple-300 rounded-xl text-xs font-black transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Photo from Device / Phone</span>
                  </button>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Picture Title / Label (e.g. 250ml Whipped Shea Amber Jar)"
                      value={uploadTitle}
                      onChange={e => setUploadTitle(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#581C87]"
                    />
                  </div>

                  {uploadPreview && (
                    <button
                      onClick={handleConfirmMediaUpload}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save to {uploadTargetCategory}</span>
                    </button>
                  )}
                </div>

                {uploadPreview && (
                  <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-emerald-200 animate-fade-in">
                    <img
                      src={uploadPreview}
                      alt="Staged Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="min-w-0 text-xs">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Ready to Save ({uploadFileSize})
                      </span>
                      <h5 className="font-bold text-slate-950 truncate mt-1">
                        {uploadTitle || 'Untitled Category Picture'}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Target: <strong>{uploadTargetCategory}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUploadPreview(null);
                        setUploadTitle('');
                        if (mediaFileInputRef.current) mediaFileInputRef.current.value = '';
                      }}
                      className="ml-auto text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Category Filter Tabs for Media Library */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                <button
                  onClick={() => setSelectedMediaCategory('All')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${selectedMediaCategory === 'All'
                    ? 'bg-[#1E0B36] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  All Pictures ({mediaItems.length})
                </button>
                {categoryNames.map(cat => {
                  const count = mediaItems.filter(m => m.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedMediaCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${selectedMediaCategory === cat
                        ? 'bg-[#1E0B36] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Media Search */}
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pictures by title or category..."
                  value={mediaSearch}
                  onChange={e => setMediaSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-[#581C87]"
                />
              </div>

              {/* Pictures Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredMedia.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 transition-all overflow-hidden shadow-2xs hover:shadow-md flex flex-col justify-between group"
                  >
                    <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950/75 text-white backdrop-blur-xs">
                          {item.category.split('&')[0]}
                        </span>
                      </div>

                      <button
                        onClick={() => setPreviewLightboxImage(item)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        title="View Full Size"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="p-3">
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1" title={item.title}>
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        {item.category}
                      </span>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          onClick={() => handleOpenAddModal(item.url, item.category)}
                          className="flex-1 py-1 px-2 bg-purple-50 hover:bg-purple-100 text-[#581C87] text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center truncate"
                        >
                          + Use in Product
                        </button>

                        <button
                          onClick={() => handleCopyUrl(item.url)}
                          className="p-1 text-slate-500 hover:text-purple-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="Copy picture URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {item.isCustom && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove picture "${item.title}"?`)) {
                                deleteMediaItem(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: ORDERS & COURIER DISPATCH WAYBILLS
             ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Customer Orders & Courier Logistics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track delivery dispatches across Greater Accra and regional couriers with Mobile Money verification and printable waybills.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportOrdersToCSV(orders)}
                    className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Export orders to CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-black">
                    {pendingOrders} Pending Dispatch
                  </span>
                </div>
              </div>

              {/* Filter buttons, search, and bulk select */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs w-full md:w-auto">
                  <button
                    onClick={toggleSelectAllOrders}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                  >
                    {selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#581C87]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>Select All</span>
                  </button>

                  {['All', 'New', 'Confirmed', 'In Packing', 'Out for Delivery', 'Delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all active:scale-95 ${orderStatusFilter === status
                        ? 'bg-gradient-to-r from-[#1E0B36] to-purple-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#581C87] transition-all"
                  />
                  {orderSearch && (
                    <button
                      type="button"
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Floating Bulk Action Bar */}
              {selectedOrderIds.length > 0 && (
                <div className="p-3 bg-[#1E0B36] text-white rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>{selectedOrderIds.length} orders selected</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-purple-200">Set Status:</span>
                    <button
                      onClick={() => handleBatchUpdateStatus('Confirmed')}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer"
                    >
                      Confirmed
                    </button>
                    <button
                      onClick={() => handleBatchUpdateStatus('In Packing')}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors cursor-pointer"
                    >
                      In Packing
                    </button>
                    <button
                      onClick={() => handleBatchUpdateStatus('Out for Delivery')}
                      className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Out for Delivery
                    </button>
                    <button
                      onClick={() => handleBatchUpdateStatus('Delivered')}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => setSelectedOrderIds([])}
                      className="px-2 py-1 text-purple-200 hover:text-white cursor-pointer ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Orders list */}
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                    <div
                      key={order.id}
                      className={`p-5 rounded-2xl border transition-all bg-white shadow-2xs space-y-4 ${isSelected ? 'border-[#581C87] ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-300'
                        }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleSelectOrder(order.id)}
                            className="cursor-pointer text-slate-500 hover:text-[#581C87]"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#581C87]" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </button>

                          <span className="font-black text-sm text-slate-950">{order.id}</span>
                          <span className="text-xs bg-purple-100 text-[#581C87] font-bold px-2 py-0.5 rounded">
                            {order.deliveryType}
                          </span>
                          <span className="text-xs text-slate-400">{order.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold">Status:</span>
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                            className={`text-xs p-1.5 rounded-lg border font-bold cursor-pointer ${order.status === 'Delivered'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : order.status === 'Out for Delivery'
                                ? 'bg-blue-50 border-blue-300 text-blue-800'
                                : order.status === 'In Packing'
                                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                                  : 'bg-purple-50 border-purple-300 text-[#581C87]'
                              }`}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Packing">In Packing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-bold uppercase text-[10px]">Customer & Destination</span>
                          <strong className="text-slate-950 block text-sm mt-0.5">{order.customerName}</strong>
                          <div className="flex items-center gap-1.5 mt-1 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-purple-700" />
                            <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
                          </div>
                          <p className="text-slate-700 mt-1 font-bold">{order.deliveryRegion}</p>
                          <p className="text-slate-500 text-[11px]">{order.deliveryAddress}</p>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-bold uppercase text-[10px]">Ordered Items</span>
                          <ul className="space-y-1 mt-1">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="text-slate-800">
                                • {item.quantity}x {item.isWholesaleBox ? `[Carton] ${item.product.title}` : item.product.title}
                                {item.selectedSize && ` (${item.selectedSize})`}
                              </li>
                            ))}
                          </ul>
                          {order.customNotes && (
                            <p className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded-xl mt-2 font-medium border border-purple-100">
                              Note: &quot;{order.customNotes}&quot;
                            </p>
                          )}
                        </div>

                        <div className="md:text-right flex flex-col justify-between">
                          <div>
                            <span className="text-slate-400 block font-bold uppercase text-[10px]">Payment & Total</span>
                            <strong className="text-emerald-700 block font-bold text-sm mt-0.5">
                              {order.paymentMethod} (Verified)
                            </strong>
                            {order.momoNumber && (
                              <span className="text-slate-500 text-[11px] block">MoMo: {order.momoNumber}</span>
                            )}
                            {order.paymentRef && (
                              <span className="text-[#581C87] font-mono text-[10.5px] font-bold block">Ref: {order.paymentRef}</span>
                            )}
                            <span className="text-lg font-black text-[#581C87] block mt-1">
                              {currencySymbol} {order.total.toFixed(2)}
                            </span>
                          </div>

                          {/* Order Action Buttons */}
                          <div className="pt-3 flex flex-wrap md:justify-end gap-2">
                            {/* 1-Click Courier Dispatch Slip */}
                            <button
                              onClick={() => setActiveDispatchOrder(order)}
                              className="px-3 py-2 bg-[#1E0B36] hover:bg-[#2E0F54] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                              title="Generate Printable Courier Waybill"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-300" />
                              <span>Dispatch Slip</span>
                            </button>

                            {/* Quick WhatsApp update */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hello ${order.customerName}, this is Packed by Dolyn. Your order ${order.id} is currently: ${order.status}. Contact 0244149464 for any logistics inquiries. Thank you!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-95 shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              onClick={() => setActiveReceiptOrder(order)}
                              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-[#581C87] border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                            >
                              Receipt
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: COUPONS & PROMO CODES
             ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Store Discount Codes & Promotions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create and manage promo vouchers (e.g. DOLYN10, VALENTINE15) for online customers.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingCoupon(true)}
                  className="px-4 py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Coupon</span>
                </button>
              </div>

              {/* Coupons Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Promo Code</th>
                      <th className="p-3.5">Discount</th>
                      <th className="p-3.5">Campaign Description</th>
                      <th className="p-3.5">Times Used</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-black text-sm text-[#581C87]">
                          <span className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700">
                          {coupon.discountPercent}% OFF
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {coupon.description || 'Promotional coupon'}
                        </td>
                        <td className="p-3.5 text-slate-700 font-bold">
                          {coupon.usageCount} checkouts
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => toggleCouponStatus(coupon.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${coupon.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                              }`}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete coupon "${coupon.code}"?`)) {
                                deleteCoupon(coupon.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Create Coupon Modal */}
              {isAddingCoupon && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                  <form
                    onSubmit={handleCreateCoupon}
                    className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-200 space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-extrabold text-base text-slate-950">Create Promotional Coupon</h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingCoupon(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MOTHERSDAY15"
                        value={newCouponCode}
                        onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase text-[#581C87]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Discount Percentage (%) *</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        required
                        value={newCouponPercent}
                        onChange={e => setNewCouponPercent(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Description / Campaign</label>
                      <input
                        type="text"
                        placeholder="e.g. 15% off Mother's Day wellness gift hampers"
                        value={newCouponDesc}
                        onChange={e => setNewCouponDesc(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddingCoupon(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#581C87] hover:bg-[#4C1D95] text-white font-black rounded-xl cursor-pointer shadow-xs"
                      >
                        Activate Coupon
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 5: EXECUTIVE AI BRIEFING
             ========================================================================= */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    AI Assistant
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">
                    Executive Operational Briefing
                  </h3>
                  <p className="text-xs text-slate-500">
                    AI-driven synthesis of today&apos;s orders, Accra logistics, low stock alerts, and personalized packaging requests for Gwendolyn Barnie Boahen.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAiReport}
                  disabled={isGeneratingAi}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#1E0B36] to-purple-800 hover:from-purple-950 hover:to-purple-900 text-white px-5 py-3 rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Analyzing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>Generate Executive AI Summary</span>
                    </>
                  )}
                </button>
              </div>

              {aiReport ? (
                <div className="bg-purple-50/60 p-6 rounded-2xl border border-purple-200/80 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap shadow-inner">
                  {aiReport}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
                  <Bot className="w-8 h-8 text-purple-600 mx-auto" />
                  <h4 className="font-bold text-slate-900">No AI Briefing Generated Today</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click the button above to run an AI operational brief analyzing your active customer orders, dispatch schedules, and low stock items.
                  </p>
                  <button
                    onClick={handleGenerateAiReport}
                    className="px-5 py-2.5 bg-[#581C87] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-[#4C1D95]"
                  >
                    Generate Daily Briefing Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 6: SETTINGS, BACKUPS & SECURITY
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-8">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-950 tracking-tight">Business Settings & Data Protection</h3>
                <p className="text-xs text-slate-500">
                  Manage owner access credentials, backup and restore your product catalog and pictures.
                </p>
              </div>

              {/* Section A: Security & Passcode */}
              <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#581C87]" />
                      <span>Admin Security & Access PIN</span>
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Current 4-digit PIN is required to unlock this dashboard on new devices.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsChangingPin(!isChangingPin)}
                    className="self-start sm:self-auto px-3.5 py-1.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    {isChangingPin ? 'Cancel' : 'Change Security PIN'}
                  </button>
                </div>

                {isChangingPin && (
                  <form onSubmit={handleSaveNewPin} className="pt-3 border-t border-purple-200/80 flex flex-wrap items-center gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="Enter new 4-digit PIN"
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                      className="p-2 bg-white rounded-xl border border-slate-300 w-full sm:w-44 font-black tracking-widest text-center text-sm"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Save New PIN
                    </button>
                  </form>
                )}
              </div>

              {/* Section B: Cloud Database & Realtime Multi-Device Sync */}
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span>Supabase Cloud Database & Realtime Sync</span>
                      </h4>
                      {isSupabaseConfigured() ? (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Realtime Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          Local-First Standby
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Persists your products, categories, coupons, picture library and orders to the cloud, with real-time sync between customer phones and your executive laptop.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => refreshCloudData()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Sync Now</span>
                    </button>
                    {isSupabaseConfigured() && (
                      <button
                        type="button"
                        onClick={handleDisconnectCloud}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold cursor-pointer transition-colors"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveCloudConfig} className="space-y-3 pt-2 border-t border-blue-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-project.supabase.co"
                        value={supabaseUrlInput}
                        onChange={e => setSupabaseUrlInput(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Supabase Anon / Public API Key
                      </label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={supabaseKeyInput}
                        onChange={e => setSupabaseKeyInput(e.target.value)}
                        className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestCloudConnection}
                        disabled={isTestingCloud}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isTestingCloud ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        Save & Connect Supabase
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      SQL Schema ready in <strong className="text-slate-600 font-mono">supabase/schema.sql</strong>
                    </span>
                  </div>

                  {cloudTestResult && (
                    <div
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${cloudTestResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                    >
                      {cloudTestResult.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{cloudTestResult.message}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Section C: Data Backup & Restore */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[#581C87]" />
                    <span>Store Data Backup & Restoration (JSON / CSV)</span>
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Download a full backup file containing all your custom products, category photos, and orders to keep safely on your computer or phone.
                  </p>
                </div>

                <input
                  type="file"
                  accept=".json"
                  ref={backupFileInputRef}
                  onChange={handleRestoreFileSelected}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    onClick={() =>
                      exportFullStoreBackup({
                        products: productList,
                        orders,
                        media: mediaItems,
                        coupons,
                        categories
                      })
                    }
                    className="px-4 py-2.5 bg-[#1E0B36] hover:bg-[#2E0F54] text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Download Full Store Backup (.json)</span>
                  </button>

                  <button
                    onClick={() => backupFileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-white hover:bg-purple-50 text-[#581C87] border border-purple-300 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Restore from Backup File</span>
                  </button>

                  <button
                    onClick={() => exportOrdersToCSV(orders)}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Orders CSV</span>
                  </button>

                  <button
                    onClick={() => exportProductsToCSV(productList)}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Products CSV</span>
                  </button>
                </div>
              </div>

              {/* Section C: Business & Delivery Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <h4 className="font-bold text-sm text-[#581C87]">Enterprise Profile</h4>
                  <div>
                    <span className="text-slate-400 block font-semibold">Registered Entity</span>
                    <strong className="text-slate-900">Packed by Dolyn</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Authorized Managing Director</span>
                    <strong className="text-slate-900">Gwendolyn Barnie Boahen</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Contact Phone & WhatsApp</span>
                    <strong className="text-slate-900">0244149464</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Official Email</span>
                    <strong className="text-slate-900">gbbyaa@gmail.com</strong>
                  </div>
                </div>

                <div className="space-y-3 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <h4 className="font-bold text-sm text-[#581C87]">Delivery Rates in Ghana</h4>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Greater Accra Same-Day Dispatch</span>
                    <strong className="text-[#581C87]">GH₵ 35.00</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Express Priority Dispatch</span>
                    <strong className="text-[#581C87]">GH₵ 50.00</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Regional Courier (Kumasi, Takoradi, etc.)</span>
                    <strong className="text-[#581C87]">GH₵ 60.00</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Warehouse Customer Pickup</span>
                    <strong className="text-emerald-700">Free (GH₵ 0.00)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL 0: CREATE / EDIT CATEGORY
         ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-200 space-y-4 text-xs"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-base text-slate-950">
                {editingCategoryId ? 'Edit Category' : 'Create New Category'}
              </h4>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-bold mb-1">Category Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Haircare & Scalp Oils"
                value={catFormTitle}
                onChange={e => setCatFormTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-[#581C87]"
              />
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block font-bold mb-1">Category Cover Icon / Photo</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                  <img src={catFormIcon} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={catFileInputRef}
                    onChange={handleCatIconUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => catFileInputRef.current?.click()}
                    disabled={isUploadingCatIcon}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#581C87] border border-purple-200 rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    {isUploadingCatIcon ? 'Compressing...' : 'Upload Cover Photo'}
                  </button>
                  <input
                    type="url"
                    placeholder="Or paste image URL..."
                    value={catFormIcon}
                    onChange={e => setCatFormIcon(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary of products in this collection..."
                value={catFormDesc}
                onChange={e => setCatFormDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#581C87] hover:bg-[#4C1D95] text-white font-black rounded-xl cursor-pointer shadow-xs"
              >
                {editingCategoryId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD / EDIT PRODUCT FORM
         ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-purple-200 my-auto text-xs max-h-[90vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  {editingProductId ? 'Edit Product Offering' : 'Create New Product Offering'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add or update pictures, wholesale options, pricing, and category.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Picture Management Section */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                <span className="block font-bold text-[#581C87]">Product Picture *</span>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-white shadow-md overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={formImage}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      ref={formFileInputRef}
                      onChange={handleProductFormImageUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => formFileInputRef.current?.click()}
                        disabled={isUploadingInForm}
                        className="px-3 py-2 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingInForm ? 'Compressing...' : 'Upload from Device'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsImagePickerOpen(true)}
                        className="px-3 py-2 bg-white hover:bg-purple-100 text-[#581C87] border border-purple-300 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Pick from Category Gallery</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <input
                        type="url"
                        placeholder="Or paste external image URL..."
                        value={formImage}
                        onChange={e => setFormImage(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. 250ml Whipped Shea Butter with Lavender"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#581C87]"
                  >
                    {categoryNames.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold mb-1">Unit Price (GH₵) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-[#581C87]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Original Price (GH₵)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional sale"
                    value={formOriginalPrice}
                    onChange={e => setFormOriginalPrice(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Product SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    placeholder="DOLYN-PR-12"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Wholesale Carton Info */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Wholesale Master Carton Options (Ghana Traders)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Wholesale Box Price (GH₵)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formWholesaleBoxPrice}
                      onChange={e => setFormWholesaleBoxPrice(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Units per Carton</label>
                    <input
                      type="number"
                      value={formWholesaleBoxQty}
                      onChange={e => setFormWholesaleBoxQty(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Special Flags */}
              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPreOrder}
                    onChange={e => setFormIsPreOrder(e.target.checked)}
                    className="rounded text-[#581C87]"
                  />
                  <span className="font-bold text-slate-700">Pre-Order Only (Advance Payment)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsDrug}
                    onChange={e => setFormIsDrug(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-bold text-blue-900">Pharmaceutical / Essential Healthcare Drug</span>
                </label>
              </div>

              {formIsDrug && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <label className="block font-bold text-blue-950">Dosage & Usage Instructions *</label>
                  <input
                    type="text"
                    required={formIsDrug}
                    value={formDosage}
                    onChange={e => setFormDosage(e.target.value)}
                    placeholder="e.g. Dissolve 1 tablet in 200ml cold water once daily after meals."
                    className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold mb-1">Description & Key Ingredients</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Describe natural ingredients, aroma notes, benefits, and packaging..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white font-black rounded-xl shadow-xs cursor-pointer text-center"
                >
                  {editingProductId ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: IN-FORM CATEGORY PICTURE PICKER
         ========================================================================= */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-purple-200 my-auto text-xs max-h-[85vh] overflow-y-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-black text-slate-950">
                  Select Picture for &quot;{formCategory}&quot;
                </h4>
                <p className="text-[11px] text-slate-500">
                  Click any photo to assign it immediately to this product.
                </p>
              </div>
              <button
                onClick={() => setIsImagePickerOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 max-h-96 overflow-y-auto p-1">
              {mediaItems
                .filter(m => m.category === formCategory || formCategory === 'All')
                .map(media => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => {
                      setFormImage(media.url);
                      setIsImagePickerOpen(false);
                      addToast(`Selected "${media.title}"`, 'info');
                    }}
                    className="group text-left border rounded-xl overflow-hidden hover:border-[#581C87] transition-all focus:outline-none focus:ring-2 focus:ring-[#581C87] cursor-pointer"
                  >
                    <div className="aspect-square w-full bg-slate-100 overflow-hidden">
                      <img
                        src={media.url}
                        alt={media.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="p-1.5 block text-[10px] font-bold text-slate-700 truncate">
                      {media.title}
                    </span>
                  </button>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: LIGHTBOX FOR FULL PICTURE VIEW
         ========================================================================= */}
      {previewLightboxImage && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewLightboxImage(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 text-xs space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-sm text-slate-950">{previewLightboxImage.title}</h4>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {previewLightboxImage.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewLightboxImage(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center">
              <img
                src={previewLightboxImage.url}
                alt={previewLightboxImage.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleCopyUrl(previewLightboxImage.url)}
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#581C87] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy URL</span>
              </button>

              <button
                onClick={() => {
                  handleOpenAddModal(previewLightboxImage.url, previewLightboxImage.category);
                  setPreviewLightboxImage(null);
                }}
                className="px-5 py-2 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl font-bold cursor-pointer"
              >
                + Create Product with this Picture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: GHANA COURIER DISPATCH WAYBILL / PARCEL MANIFEST
         ========================================================================= */}
      {activeDispatchOrder && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setActiveDispatchOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 text-slate-900 my-auto space-y-4 print:p-0 print:border-none print:shadow-none"
            onClick={e => e.stopPropagation()}
          >
            {/* Slip Header with authentic Courier look */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Packed by Dolyn Official Logo"
                  className="h-16 sm:h-20 w-auto object-contain print:h-20 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                    Official Courier Dispatch Manifest
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Luxury Handcrafted Shea Butter, Fragrances, Gift Sets & Pharmaceuticals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDispatchOrder(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Waybill Code & Simulated Barcode */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Waybill ID / Tracking</span>
                <strong className="text-base font-mono font-black text-slate-950">{activeDispatchOrder.id}</strong>
                {/* Simulated Courier Barcode */}
                <div className="flex gap-[2px] h-5 mt-1 items-end">
                  {[2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 2, 4, 1, 3, 2, 1, 4, 2].map((w, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Dispatch Priority</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-950 font-black rounded text-[11px]">
                  {activeDispatchOrder.deliveryType}
                </span>
              </div>
            </div>

            {/* SENDER & RECIPIENT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  FROM (SENDER)
                </span>
                <strong className="text-slate-950 block">Gwendolyn Barnie Boahen</strong>
                <p className="text-slate-700">Packed by Dolyn</p>
                <p className="font-bold text-[#581C87]">Tel: 0244149464</p>
                <p className="text-slate-500 text-[10.5px]">Hub: Accra, Greater Accra</p>
              </div>

              <div className="p-3 border-2 border-slate-900 rounded-xl bg-purple-50/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">
                  TO (RECIPIENT)
                </span>
                <strong className="text-slate-950 block text-sm">{activeDispatchOrder.customerName}</strong>
                <p className="font-black text-slate-950 text-sm">Tel: {activeDispatchOrder.customerPhone}</p>
                <p className="font-bold text-purple-900 mt-1">{activeDispatchOrder.deliveryRegion}</p>
                <p className="text-slate-700 text-[11px] leading-tight">{activeDispatchOrder.deliveryAddress}</p>
              </div>
            </div>

            {/* PARCEL CONTENTS BREAKDOWN */}
            <div className="p-3 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Enclosed Items Manifest
              </span>
              <ul className="space-y-1 divide-y divide-slate-100">
                {activeDispatchOrder.items.map((item, idx) => (
                  <li key={idx} className="pt-1 first:pt-0 flex justify-between">
                    <span className="text-slate-800 font-medium">
                      • {item.quantity}x {item.isWholesaleBox ? `[Carton] ${item.product.title}` : item.product.title}
                      {item.selectedSize && ` (${item.selectedSize})`}
                    </span>
                  </li>
                ))}
              </ul>

              {activeDispatchOrder.customNotes && (
                <p className="text-[11px] text-purple-950 bg-purple-50 p-2 rounded-lg font-medium border border-purple-200">
                  Client Custom Note: &quot;{activeDispatchOrder.customNotes}&quot;
                </p>
              )}
            </div>

            {/* PAYMENT VERIFICATION BADGE FOR COURIER */}
            <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl text-center space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                COURIER PAYMENT STATUS
              </span>
              <h4 className="text-sm font-black text-emerald-950">
                PAID IN FULL VIA PAYSTACK / MOMO (DO NOT COLLECT CASH)
              </h4>
              <p className="text-[10px] text-emerald-800">
                Total Order Value: <strong>GH₵ {activeDispatchOrder.total.toFixed(2)}</strong> (Verified Online)
                {activeDispatchOrder.paymentRef && (
                  <span className="block font-mono text-[9px] mt-0.5 text-emerald-900 font-bold">
                    Paystack Ref: {activeDispatchOrder.paymentRef}
                  </span>
                )}
              </p>
            </div>

            {/* Warning Notice */}
            <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>FRAGILE COSMETICS & GLASS ESSENTIALS — HANDLE WITH CARE</span>
            </div>

            {/* Slip Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 print:hidden text-xs font-bold">
              <button
                type="button"
                onClick={() => handleCopyWaybillForRider(activeDispatchOrder)}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Copy for WhatsApp Rider</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#1E0B36] hover:bg-[#2E0F54] text-white rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDispatchOrder(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};
