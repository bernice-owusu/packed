import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, BlogPost, Order, MediaItem, Coupon, Category, SiteContent } from '../types';
import { products as initialProducts, initialOrders, categories as initialCategories } from '../data/mockData';
import { initialMediaItems } from '../data/initialMedia';
import { initialSiteContent, normalizeSiteContent } from '../data/siteContent';
import {
  isSupabaseConfigured,
  saveRuntimeSupabaseConfig,
  clearRuntimeSupabaseConfig,
  fetchOrdersFromCloud,
  saveOrderToCloud,
  updateOrderStatusInCloud,
  subscribeToCloudOrders,
  fetchProductsFromCloud,
  saveProductToCloud,
  deleteProductFromCloud,
  seedProductsToCloud,
  fetchCategoriesFromCloud,
  saveCategoryToCloud,
  deleteCategoryFromCloud,
  seedCategoriesToCloud,
  fetchCouponsFromCloud,
  saveCouponToCloud,
  deleteCouponFromCloud,
  seedCouponsToCloud,
  fetchMediaFromCloud,
  saveMediaToCloud,
  deleteMediaFromCloud,
  seedMediaToCloud,
  pushStoreDataToCloud,
  subscribeToCloudTable,
  fetchSiteContentFromCloud,
  saveSiteContentToCloud
} from '../services/supabase';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Products & Inventory
  productList: Product[];
  addProduct: (newProd: Partial<Product>) => void;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Shopping Cart & Guest Checkout
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    options?: {
      selectedSize?: string;
      selectedVariety?: string;
      customizationNote?: string;
      isWholesaleBox?: boolean;
    }
  ) => void;
  removeFromCart: (productId: number, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  discount: number;
  discountPercent: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Quick View & Blog Modals
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  selectedArticle: BlogPost | null;
  openArticleModal: (post: BlogPost) => void;
  closeArticleModal: () => void;

  // Drawers & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;

  // Active Electronic Receipt
  activeReceiptOrder: Order | null;
  setActiveReceiptOrder: (order: Order | null) => void;

  // Policy Modal
  isPolicyModalOpen: boolean;
  setIsPolicyModalOpen: (open: boolean) => void;

  // Currency & Language
  currency: string;
  setCurrency: (curr: string) => void;
  currencySymbol: string;
  exchangeRate: number;

  // Navigation & Search
  activePage: string;
  setActivePage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Orders & Admin Management
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Media & Picture Library
  mediaItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;

  // Dynamic Categories Management
  categories: Category[];
  addCategory: (newCategory: Omit<Category, 'id' | 'count'>) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Editable Website Content
  siteContent: SiteContent;
  updateSiteContent: (patch: Partial<SiteContent>) => void;

  // Coupons & Promo Codes
  coupons: Coupon[];
  addCoupon: (newCoupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;

  // Backup & Restore
  restoreStoreData: (data: {
    products?: Product[];
    media?: MediaItem[];
    orders?: Order[];
    coupons?: Coupon[];
    categories?: Category[];
    siteContent?: SiteContent;
  }) => void;

  // Cloud Database Sync
  isCloudSyncActive: boolean;
  connectCloudDatabase: (url: string, anonKey: string) => Promise<void>;
  disconnectCloudDatabase: () => void;
  refreshCloudData: () => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CATALOG_VERSION = 'v6_paystack_live_test_max5cedis';
const MAX_TEST_PRICE = 5.0;

const sanitizeCatalogPrices = (prods: Product[]): Product[] => {
  return prods.map(p => {
    const numPrice = typeof p.numericPrice === 'number' && p.numericPrice > 0 ? p.numericPrice : 5.0;
    const cappedPrice = Math.min(numPrice, MAX_TEST_PRICE);
    return {
      ...p,
      numericPrice: cappedPrice,
      price: cappedPrice < numPrice || !p.price ? `GH₵ ${cappedPrice.toFixed(2)}` : p.price,
      wholesaleBoxPrice: 'GH₵ 5.00',
    };
  });
};

// Seeded catalog IDs are treated as legacy; anything above the seed max is a new upload
// and is shown first (newest upload first), while the original catalog order is preserved.
const INITIAL_CATALOG_MAX_ID = initialProducts.reduce((max, p) => Math.max(max, p.id), 0);

const sortProductsLatestFirst = (prods: Product[]): Product[] => {
  return [...prods].sort((a, b) => {
    const aIsNew = a.id > INITIAL_CATALOG_MAX_ID;
    const bIsNew = b.id > INITIAL_CATALOG_MAX_ID;
    if (aIsNew && bIsNew) return b.id - a.id;
    if (aIsNew) return -1;
    if (bIsNew) return 1;
    return a.id - b.id;
  });
};

const initialCoupons: Coupon[] = [
  { id: 'c1', code: 'DOLYN10', discountPercent: 10, isActive: true, usageCount: 42, description: '10% Welcome Discount for Packed by Dolyn' },
  { id: 'c2', code: 'WELCOMEGH', discountPercent: 10, isActive: true, usageCount: 18, description: 'New Customer Ghana Promo' },
  { id: 'c3', code: 'VALENTINE15', discountPercent: 15, isActive: true, usageCount: 9, description: 'Gift Hamper & Fragrance Special' },
  { id: 'c4', code: 'VIP20', discountPercent: 20, isActive: true, usageCount: 5, description: 'Corporate & VIP Bulk Buyers' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state (persisted with catalog version check)
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const savedVersion = localStorage.getItem('dolyn_catalog_version');
      const saved = localStorage.getItem('dolyn_products');
      if (saved && savedVersion === CATALOG_VERSION) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return sortProductsLatestFirst(sanitizeCatalogPrices(parsed));
        }
      }
      // Force refresh catalog to include all 38 newly added category products and capped 5 cedis test pricing
      const freshCatalog = sortProductsLatestFirst(sanitizeCatalogPrices(initialProducts));
      localStorage.setItem('dolyn_catalog_version', CATALOG_VERSION);
      localStorage.setItem('dolyn_products', JSON.stringify(freshCatalog));
      return freshCatalog;
    } catch {
      return sortProductsLatestFirst(sanitizeCatalogPrices(initialProducts));
    }
  });

  // Cart state (persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dolyn_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state (persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('dolyn_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // Media items state (persisted)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('dolyn_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialMediaItems;
    } catch {
      return initialMediaItems;
    }
  });

  // Coupons state (persisted)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('dolyn_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialCoupons;
    } catch {
      return initialCoupons;
    }
  });

  // Categories state (persisted)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('dolyn_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialCategories;
    } catch {
      return initialCategories;
    }
  });

  // Editable website content (hero slides, banners, about & contact)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('dolyn_site_content');
      return saved ? normalizeSiteContent(JSON.parse(saved)) : initialSiteContent;
    } catch {
      return initialSiteContent;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCloudSyncActive, setIsCloudSyncActive] = useState<boolean>(() => isSupabaseConfigured());
  const [cloudSyncNonce, setCloudSyncNonce] = useState<number>(0);

  // Cloud Database Initial Sync & Realtime Subscription (all collections)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    setIsCloudSyncActive(true);
    let cancelled = false;
    const unsubscribers: Array<() => void> = [];

    const hydrate = async () => {
      // Orders: merge cloud + local so offline orders are never lost
      const cloudOrders = await fetchOrdersFromCloud();
      if (!cancelled && cloudOrders && cloudOrders.length > 0) {
        setOrders(prev => {
          const existingIds = new Set(cloudOrders.map(o => o.id));
          const uniqueLocal = prev.filter(o => !existingIds.has(o.id));
          const merged = [...cloudOrders, ...uniqueLocal];
          localStorage.setItem('dolyn_orders', JSON.stringify(merged));
          return merged;
        });
      }

      // Products: cloud wins, seed local catalog if cloud is empty
      const cloudProducts = await fetchProductsFromCloud();
      if (!cancelled && cloudProducts) {
        if (cloudProducts.length > 0) {
          setProductList(sortProductsLatestFirst(cloudProducts));
        } else {
          await seedProductsToCloud(productList);
        }
      }

      // Categories
      const cloudCategories = await fetchCategoriesFromCloud();
      if (!cancelled && cloudCategories) {
        if (cloudCategories.length > 0) {
          setCategories(cloudCategories);
        } else {
          await seedCategoriesToCloud(categories);
        }
      }

      // Coupons
      const cloudCoupons = await fetchCouponsFromCloud();
      if (!cancelled && cloudCoupons) {
        if (cloudCoupons.length > 0) {
          setCoupons(cloudCoupons);
        } else {
          await seedCouponsToCloud(coupons);
        }
      }

      // Media / picture library
      const cloudMedia = await fetchMediaFromCloud();
      if (!cancelled && cloudMedia) {
        if (cloudMedia.length > 0) {
          setMediaItems(cloudMedia);
        } else {
          await seedMediaToCloud(mediaItems);
        }
      }

      // Editable website content
      const cloudSiteContent = await fetchSiteContentFromCloud();
      if (!cancelled) {
        if (cloudSiteContent) {
          setSiteContent(cloudSiteContent);
        } else {
          await saveSiteContentToCloud(siteContent);
        }
      }
    };

    const startRealtime = () => {
      if (cancelled) return;

      // Incoming orders from other devices
      unsubscribers.push(
        subscribeToCloudOrders(incomingOrder => {
          setOrders(prev => {
            const index = prev.findIndex(o => o.id === incomingOrder.id);
            let updated: Order[];
            if (index >= 0) {
              updated = [...prev];
              updated[index] = incomingOrder;
            } else {
              updated = [incomingOrder, ...prev];
              addToast(`🔔 Live Cloud Alert: New order #${incomingOrder.id} received!`, 'success');
            }
            localStorage.setItem('dolyn_orders', JSON.stringify(updated));
            return updated;
          });
        })
      );

      unsubscribers.push(
        subscribeToCloudTable('products', () => {
          fetchProductsFromCloud().then(cloud => {
            if (!cancelled && cloud) setProductList(sortProductsLatestFirst(cloud));
          });
        })
      );

      unsubscribers.push(
        subscribeToCloudTable('categories', () => {
          fetchCategoriesFromCloud().then(cloud => {
            if (!cancelled && cloud) setCategories(cloud);
          });
        })
      );

      unsubscribers.push(
        subscribeToCloudTable('coupons', () => {
          fetchCouponsFromCloud().then(cloud => {
            if (!cancelled && cloud) setCoupons(cloud);
          });
        })
      );

      unsubscribers.push(
        subscribeToCloudTable('media', () => {
          fetchMediaFromCloud().then(cloud => {
            if (!cancelled && cloud) setMediaItems(cloud);
          });
        })
      );

      unsubscribers.push(
        subscribeToCloudTable('site_content', () => {
          fetchSiteContentFromCloud().then(cloud => {
            if (!cancelled && cloud) setSiteContent(cloud);
          });
        })
      );
    };

    hydrate().then(startRealtime);

    return () => {
      cancelled = true;
      unsubscribers.forEach(unsub => unsub());
    };
  }, [cloudSyncNonce]);

  const connectCloudDatabase = async (url: string, anonKey: string) => {
    saveRuntimeSupabaseConfig(url, anonKey);
    setIsCloudSyncActive(true);
    addToast('Supabase credentials saved! Connecting and syncing store data...', 'success');
    setCloudSyncNonce(n => n + 1);
    await refreshCloudData();
  };

  const disconnectCloudDatabase = () => {
    clearRuntimeSupabaseConfig();
    setIsCloudSyncActive(false);
    setCloudSyncNonce(n => n + 1);
    addToast('Supabase disconnected. Operating in local-first storage mode.', 'info');
  };

  const refreshCloudData = async () => {
    if (!isSupabaseConfigured()) {
      addToast('Supabase is not configured yet. Add your Project URL & Anon Key in settings.', 'warning');
      return;
    }
    addToast('Syncing store data from Supabase Cloud Database...', 'info');

    const [cloudOrders, cloudProducts, cloudCategories, cloudCoupons, cloudMedia, cloudSiteContent] = await Promise.all([
      fetchOrdersFromCloud(),
      fetchProductsFromCloud(),
      fetchCategoriesFromCloud(),
      fetchCouponsFromCloud(),
      fetchMediaFromCloud(),
      fetchSiteContentFromCloud(),
    ]);

    let collectionsSynced = 0;

    // Orders: pull cloud orders when present, otherwise keep local orders intact
    if (cloudOrders) {
      if (cloudOrders.length > 0) {
        setOrders(cloudOrders);
        localStorage.setItem('dolyn_orders', JSON.stringify(cloudOrders));
      }
      collectionsSynced++;
    }

    // Products: pull when present, otherwise seed the local catalog up to the cloud
    if (cloudProducts) {
      if (cloudProducts.length > 0) {
        setProductList(sortProductsLatestFirst(cloudProducts));
      } else if (productList.length > 0) {
        await seedProductsToCloud(productList);
      }
      collectionsSynced++;
    }

    // Categories
    if (cloudCategories) {
      if (cloudCategories.length > 0) {
        setCategories(cloudCategories);
      } else if (categories.length > 0) {
        await seedCategoriesToCloud(categories);
      }
      collectionsSynced++;
    }

    // Coupons
    if (cloudCoupons) {
      if (cloudCoupons.length > 0) {
        setCoupons(cloudCoupons);
      } else if (coupons.length > 0) {
        await seedCouponsToCloud(coupons);
      }
      collectionsSynced++;
    }

    // Media / picture library
    if (cloudMedia) {
      if (cloudMedia.length > 0) {
        setMediaItems(cloudMedia);
      } else if (mediaItems.length > 0) {
        await seedMediaToCloud(mediaItems);
      }
      collectionsSynced++;
    }

    // Editable website content
    if (cloudSiteContent) {
      setSiteContent(cloudSiteContent);
      collectionsSynced++;
    } else {
      await saveSiteContentToCloud(siteContent);
      collectionsSynced++;
    }

    if (collectionsSynced > 0) {
      setIsCloudSyncActive(true);
      const productCount = cloudProducts?.length || productList.length;
      const categoryCount = cloudCategories?.length || categories.length;
      const couponCount = cloudCoupons?.length || coupons.length;
      const mediaCount = cloudMedia?.length || mediaItems.length;
      const orderCount = cloudOrders?.length || orders.length;
      addToast(
        `Synced ${productCount} products, ${categoryCount} categories, ${couponCount} coupons, ${mediaCount} photos, ${orderCount} orders and website content with the Cloud Database!`,
        'success'
      );
    } else {
      addToast('Could not fetch store data from Supabase. Check credentials or network.', 'warning');
    }
  };

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // Currency: Default is Ghana Cedi (GH₵)
  const [currency, setCurrency] = useState('GH₵ Ghana Cedi (GHS)');
  const [activePage, setActivePage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_products', JSON.stringify(productList));
    } catch { }
  }, [productList]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_cart', JSON.stringify(cart));
    } catch { }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_orders', JSON.stringify(orders));
    } catch { }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_media', JSON.stringify(mediaItems));
    } catch { }
  }, [mediaItems]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_coupons', JSON.stringify(coupons));
    } catch { }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_categories', JSON.stringify(categories));
    } catch { }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_site_content', JSON.stringify(siteContent));
    } catch { }
  }, [siteContent]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    options?: {
      selectedSize?: string;
      selectedVariety?: string;
      customizationNote?: string;
      isWholesaleBox?: boolean;
    }
  ) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === options?.selectedSize &&
          item.isWholesaleBox === options?.isWholesaleBox
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        if (options?.customizationNote) {
          next[existingIndex].customizationNote = options.customizationNote;
        }
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: options?.selectedSize || (product.sizes ? product.sizes[0] : undefined),
          selectedVariety: options?.selectedVariety || (product.varieties ? product.varieties[0] : undefined),
          customizationNote: options?.customizationNote,
          isWholesaleBox: options?.isWholesaleBox || false
        }
      ];
    });

    const label = options?.isWholesaleBox ? `Wholesale Box of ${product.title}` : product.title;
    addToast(`Added "${label}" to cart!`, 'success');
  };

  const removeFromCart = (productId: number, size?: string) => {
    setCart(prev =>
      prev.filter(item => !(item.product.id === productId && (!size || item.selectedSize === size)))
    );
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && (!size || item.selectedSize === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    const existingCoupon = coupons.find(c => c.code === cleaned);

    if (existingCoupon) {
      if (!existingCoupon.isActive) {
        addToast(`Promo code "${cleaned}" is currently inactive.`, 'warning');
        return false;
      }
      setAppliedCoupon(cleaned);
      setDiscountPercent(existingCoupon.discountPercent);
      const updatedCoupon: Coupon = {
        ...existingCoupon,
        usageCount: existingCoupon.usageCount + 1
      };
      setCoupons(prev => prev.map(c => (c.id === updatedCoupon.id ? updatedCoupon : c)));
      if (isSupabaseConfigured()) {
        saveCouponToCloud(updatedCoupon).catch(err => {
          console.warn('Cloud coupon update error:', err);
        });
      }
      addToast(`Promo code "${cleaned}" applied! ${existingCoupon.discountPercent}% discount activated.`, 'success');
      return true;
    }

    if (cleaned === 'DOLYN10' || cleaned === 'FIRST10' || cleaned === 'WELCOMEGH') {
      setAppliedCoupon(cleaned);
      setDiscountPercent(10);
      addToast(`Promo code ${cleaned} applied! 10% discount added.`, 'success');
      return true;
    }

    addToast('Invalid or inactive promo code. Use DOLYN10 for 10% off', 'warning');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    addToast('Promo discount removed', 'info');
  };

  // Price calculations in Ghana Cedis
  const parseProductPrice = (item: CartItem): number => {
    if (item.isWholesaleBox && item.product.wholesaleBoxPrice) {
      const match = item.product.wholesaleBoxPrice.match(/[\d\.]+/);
      return match ? parseFloat(match[0]) : (item.product.numericPrice || 45) * 10;
    }
    if (typeof item.product.numericPrice === 'number') {
      return item.product.numericPrice;
    }
    const match = item.product.price.match(/[\d\.]+/);
    return match ? parseFloat(match[0]) : 45.0;
  };

  const rawSubtotal = cart.reduce((sum, item) => {
    return sum + parseProductPrice(item) * item.quantity;
  }, 0);

  const discount = (rawSubtotal * discountPercent) / 100;
  const cartTotal = Math.max(0, rawSubtotal - discount);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const currencySymbol = currency.includes('Dollar') ? '$' : 'GH₵';
  const exchangeRate = currency.includes('Dollar') ? 0.065 : 1.0;

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openArticleModal = (post: BlogPost) => setSelectedArticle(post);
  const closeArticleModal = () => setSelectedArticle(null);

  // Order creation for Guest Shoppers
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `DOLYN-GH-${randomNum}`;
    const newTracking = `TRK-GH-${randomNum}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: formattedDate,
      trackingNumber: newTracking
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveReceiptOrder(newOrder);
    addToast(`Order ${newId} confirmed successfully!`, 'success');

    // Push to Supabase Cloud Database if configured
    if (isSupabaseConfigured()) {
      saveOrderToCloud(newOrder).catch(err => {
        console.warn('Cloud order background push error:', err);
      });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} status updated to: ${status}`, 'info');

    if (isSupabaseConfigured()) {
      updateOrderStatusInCloud(orderId, status).catch(err => {
        console.warn('Cloud order status update error:', err);
      });
    }
  };

  // Product management for Admin Dashboard
  const addProduct = (newProd: Partial<Product>) => {
    const nextId = Math.max(0, ...productList.map(p => p.id)) + 1;
    const fullProduct: Product = {
      id: nextId,
      title: newProd.title || 'New Product',
      category: newProd.category || 'Shea Butter & Cosmetics',
      price: newProd.price || 'GH₵ 40.00',
      numericPrice: newProd.numericPrice || 40.0,
      originalPrice: newProd.originalPrice || null,
      rating: 5.0,
      reviewCount: 1,
      badges: newProd.badges || ['New'],
      image: newProd.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
      description: newProd.description || 'Handcrafted and packaged with care by Packed by Dolyn Ghana.',
      sku: `DOLYN-PR-${nextId}`,
      inStock: newProd.inStock ?? true,
      stockCount: newProd.stockCount ?? 20,
      sizes: newProd.sizes || ['Standard'],
      varieties: newProd.varieties,
      wholesaleBoxQuantity: newProd.wholesaleBoxQuantity || 12,
      wholesaleBoxPrice: newProd.wholesaleBoxPrice || 'GH₵ 400.00',
      isCustomizable: newProd.isCustomizable,
      customizationOptions: newProd.customizationOptions,
      isDrugOrHealthcare: newProd.isDrugOrHealthcare,
      dosageOrUsage: newProd.dosageOrUsage
    };

    setProductList(prev => sortProductsLatestFirst([fullProduct, ...prev]));
    if (isSupabaseConfigured()) {
      saveProductToCloud(fullProduct).catch(err => {
        console.warn('Cloud product save error:', err);
      });
    }
    addToast(`Product "${fullProduct.title}" added to catalog!`, 'success');
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    const existing = productList.find(p => p.id === id);
    const merged = existing ? { ...existing, ...updated } : null;

    setProductList(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    if (merged && isSupabaseConfigured()) {
      saveProductToCloud(merged).catch(err => {
        console.warn('Cloud product update error:', err);
      });
    }
    addToast(`Product #${id} updated successfully`, 'info');
  };

  const deleteProduct = (id: number) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    if (isSupabaseConfigured()) {
      deleteProductFromCloud(id).catch(err => {
        console.warn('Cloud product delete error:', err);
      });
    }
    addToast(`Product #${id} removed from catalog`, 'warning');
  };

  // Media Library actions
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `med-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      isCustom: true
    };
    setMediaItems(prev => [newItem, ...prev]);
    if (isSupabaseConfigured()) {
      saveMediaToCloud(newItem).catch(err => {
        console.warn('Cloud media save error:', err);
      });
    }
    addToast(`Photo "${newItem.title}" added to ${newItem.category}!`, 'success');
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    if (isSupabaseConfigured()) {
      deleteMediaFromCloud(id).catch(err => {
        console.warn('Cloud media delete error:', err);
      });
    }
    addToast('Picture removed from library', 'info');
  };

  // Coupons management
  const addCoupon = (newCoupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const coupon: Coupon = {
      ...newCoupon,
      id: `coup-${Date.now()}`,
      code: newCoupon.code.trim().toUpperCase(),
      usageCount: 0
    };
    setCoupons(prev => [coupon, ...prev]);
    if (isSupabaseConfigured()) {
      saveCouponToCloud(coupon).catch(err => {
        console.warn('Cloud coupon save error:', err);
      });
    }
    addToast(`Promo code "${coupon.code}" created!`, 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    if (isSupabaseConfigured()) {
      deleteCouponFromCloud(id).catch(err => {
        console.warn('Cloud coupon delete error:', err);
      });
    }
    addToast('Coupon deleted', 'info');
  };

  const toggleCouponStatus = (id: string) => {
    const existing = coupons.find(c => c.id === id);
    const updated = existing ? { ...existing, isActive: !existing.isActive } : null;

    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    if (updated && isSupabaseConfigured()) {
      saveCouponToCloud(updated).catch(err => {
        console.warn('Cloud coupon status update error:', err);
      });
    }
    addToast('Coupon status updated', 'info');
  };

  // Categories management
  const addCategory = (newCategory: Omit<Category, 'id' | 'count'>) => {
    const slug =
      newCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `cat-${Date.now()}`;
    const newCat: Category = {
      ...newCategory,
      id: slug,
      count: '0 Products'
    };
    setCategories(prev => [...prev, newCat]);
    if (isSupabaseConfigured()) {
      saveCategoryToCloud(newCat).catch(err => {
        console.warn('Cloud category save error:', err);
      });
    }
    addToast(`Category "${newCat.title}" created successfully!`, 'success');
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    const existing = categories.find(c => c.id === id);
    const merged = existing ? { ...existing, ...updated } : null;

    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    if (merged && isSupabaseConfigured()) {
      saveCategoryToCloud(merged).catch(err => {
        console.warn('Cloud category update error:', err);
      });
    }
    addToast('Category updated', 'info');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (isSupabaseConfigured()) {
      deleteCategoryFromCloud(id).catch(err => {
        console.warn('Cloud category delete error:', err);
      });
    }
    addToast('Category removed from store', 'warning');
  };

  // Editable website content management
  const updateSiteContent = (patch: Partial<SiteContent>) => {
    const next: SiteContent = { ...siteContent, ...patch };
    setSiteContent(next);
    localStorage.setItem('dolyn_site_content', JSON.stringify(next));
    if (isSupabaseConfigured()) {
      saveSiteContentToCloud(next).catch(err => {
        console.warn('Cloud site content save error:', err);
      });
    }
    addToast('Website content updated successfully!', 'success');
  };

  // Store data restore from JSON backup
  const restoreStoreData = (data: {
    products?: Product[];
    media?: MediaItem[];
    orders?: Order[];
    coupons?: Coupon[];
    categories?: Category[];
    siteContent?: SiteContent;
  }) => {
    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
      const restoredProducts = sortProductsLatestFirst(data.products);
      setProductList(restoredProducts);
      localStorage.setItem('dolyn_products', JSON.stringify(restoredProducts));
    }
    if (data.media && Array.isArray(data.media)) {
      setMediaItems(data.media);
      localStorage.setItem('dolyn_media', JSON.stringify(data.media));
    }
    if (data.orders && Array.isArray(data.orders)) {
      setOrders(data.orders);
      localStorage.setItem('dolyn_orders', JSON.stringify(data.orders));
    }
    if (data.coupons && Array.isArray(data.coupons)) {
      setCoupons(data.coupons);
      localStorage.setItem('dolyn_coupons', JSON.stringify(data.coupons));
    }
    if (data.categories && Array.isArray(data.categories)) {
      setCategories(data.categories);
      localStorage.setItem('dolyn_categories', JSON.stringify(data.categories));
    }
    if (data.siteContent) {
      const restoredSiteContent = normalizeSiteContent(data.siteContent);
      setSiteContent(restoredSiteContent);
      localStorage.setItem('dolyn_site_content', JSON.stringify(restoredSiteContent));
    }
    if (isSupabaseConfigured()) {
      pushStoreDataToCloud(data).catch(err => {
        console.warn('Cloud store restore push error:', err);
      });
    }
    addToast('Store data successfully restored from backup!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        productList,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        discount,
        discountPercent,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        selectedArticle,
        openArticleModal,
        closeArticleModal,
        isCartOpen,
        setIsCartOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        activeReceiptOrder,
        setActiveReceiptOrder,
        isPolicyModalOpen,
        setIsPolicyModalOpen,
        currency,
        setCurrency,
        currencySymbol,
        exchangeRate,
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        orders,
        createOrder,
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
        siteContent,
        updateSiteContent,
        restoreStoreData,
        isCloudSyncActive,
        connectCloudDatabase,
        disconnectCloudDatabase,
        refreshCloudData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
