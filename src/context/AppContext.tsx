import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, BlogPost, Order } from '../types';
import { products as initialProducts, initialOrders } from '../data/mockData';

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

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CATALOG_VERSION = 'v5_packed_by_dolyn_verified_images';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state (persisted with catalog version check)
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const savedVersion = localStorage.getItem('dolyn_catalog_version');
      const saved = localStorage.getItem('dolyn_products');
      if (saved && savedVersion === CATALOG_VERSION) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialProducts.length) {
          return parsed;
        }
      }
      // Force refresh catalog to include all 38 newly added category products
      localStorage.setItem('dolyn_catalog_version', CATALOG_VERSION);
      localStorage.setItem('dolyn_products', JSON.stringify(initialProducts));
      return initialProducts;
    } catch {
      return initialProducts;
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

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

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
    } catch {}
  }, [productList]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('dolyn_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

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
    if (cleaned === 'DOLYN10' || cleaned === 'FIRST10' || cleaned === 'WELCOMEGH') {
      setAppliedCoupon(cleaned);
      setDiscountPercent(10);
      addToast(`Promo code ${cleaned} applied! 10% discount added.`, 'success');
      return true;
    }
    addToast('Invalid promo code. Use DOLYN10 for 10% off', 'warning');
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
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} status updated to: ${status}`, 'info');
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

    setProductList(prev => [fullProduct, ...prev]);
    addToast(`Product "${fullProduct.title}" added to catalog!`, 'success');
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    setProductList(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    addToast(`Product #${id} updated successfully`, 'info');
  };

  const deleteProduct = (id: number) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    addToast(`Product #${id} removed from catalog`, 'warning');
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
