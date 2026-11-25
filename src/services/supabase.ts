import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, Product, Category, Coupon, MediaItem, SiteContent } from '../types';
import { normalizeSiteContent } from '../data/siteContent';

/**
 * Supabase Cloud Database Client & Realtime Sync Engine for Packed by Dolyn
 * Enables multi-device real-time sync across mobile, desktop, and client storefronts.
 *
 * The app is local-first: when Supabase is not configured every helper below
 * returns null/false and the app keeps working from localStorage.
 */

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Retrieve credentials from environment variables or runtime settings in localStorage
export const getSupabaseConfig = (): SupabaseConfig => {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  try {
    const saved = localStorage.getItem('dolyn_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch {
    // Ignore parse error
  }

  return { url: '', anonKey: '' };
};

export const saveRuntimeSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem(
    'dolyn_supabase_config',
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  // Re-initialize client
  cachedClient = null;
};

export const clearRuntimeSupabaseConfig = () => {
  localStorage.removeItem('dolyn_supabase_config');
  cachedClient = null;
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
};

export type CloudTable = 'orders' | 'products' | 'categories' | 'coupons' | 'media' | 'site_content';

// =========================================================================
// GENERIC HELPERS
// =========================================================================

const fetchRows = async (table: CloudTable): Promise<any[] | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.warn(`Supabase fetch ${table} error:`, error.message);
      return null;
    }
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`Failed to fetch ${table} from Supabase:`, err);
    return null;
  }
};

const upsertRows = async (table: CloudTable, rows: any[]): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase || rows.length === 0) return false;

  try {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn(`Supabase upsert ${table} error:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Failed to save ${table} to Supabase:`, err);
    return false;
  }
};

const deleteRow = async (table: CloudTable, id: string | number): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`Supabase delete ${table} error:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Failed to delete ${table} from Supabase:`, err);
    return false;
  }
};

export const subscribeToCloudTable = (
  table: Exclude<CloudTable, 'orders'>,
  onChange: () => void
): (() => void) => {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => onChange()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn(`Failed to subscribe to Supabase ${table} realtime:`, err);
    return () => {};
  }
};

// =========================================================================
// ORDERS CLOUD SYNC
// =========================================================================

const rowToOrder = (row: any): Order => ({
  id: row.id,
  createdAt: row.created_at,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerEmail: row.customer_email || '',
  deliveryRegion: row.delivery_region,
  deliveryAddress: row.delivery_address,
  deliveryType: row.delivery_type,
  preferredDeliveryDate: row.preferred_delivery_date || '',
  preferredDeliveryTime: row.preferred_delivery_time || '',
  deliveryFee: Number(row.delivery_fee) || 0,
  paymentMethod: row.payment_method,
  paymentRef: row.payment_ref || undefined,
  momoNumber: row.momo_number || undefined,
  paymentStatus: row.payment_status,
  items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
  subtotal: Number(row.subtotal) || 0,
  discount: Number(row.discount) || 0,
  total: Number(row.total) || 0,
  status: row.status,
  customNotes: row.custom_notes || undefined,
  trackingNumber: row.tracking_number,
});

export const fetchOrdersFromCloud = async (): Promise<Order[] | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error.message);
      return null;
    }

    if (!Array.isArray(data)) return [];

    return data.map(rowToOrder);
  } catch (err) {
    console.warn('Failed to fetch cloud orders:', err);
    return null;
  }
};

export const saveOrderToCloud = async (order: Order): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: order.id,
      created_at: order.createdAt,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,
      delivery_region: order.deliveryRegion,
      delivery_address: order.deliveryAddress,
      delivery_type: order.deliveryType,
      preferred_delivery_date: order.preferredDeliveryDate,
      preferred_delivery_time: order.preferredDeliveryTime,
      delivery_fee: order.deliveryFee,
      payment_method: order.paymentMethod,
      payment_ref: order.paymentRef || null,
      momo_number: order.momoNumber || null,
      payment_status: order.paymentStatus,
      items: JSON.stringify(order.items),
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      status: order.status,
      custom_notes: order.customNotes || null,
      tracking_number: order.trackingNumber,
    };

    const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase saveOrder error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to save order to Supabase:', err);
    return false;
  }
};

export const updateOrderStatusInCloud = async (
  orderId: string,
  status: Order['status']
): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.warn('Supabase updateOrderStatus error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to update status in Supabase:', err);
    return false;
  }
};

export const subscribeToCloudOrders = (
  onOrderChange: (order: Order) => void
): (() => void) => {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload: any) => {
          const row = payload.new;
          if (!row || !row.id) return;
          onOrderChange(rowToOrder(row));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Failed to subscribe to Supabase orders realtime:', err);
    return () => {};
  }
};

// =========================================================================
// PRODUCTS CLOUD SYNC
// =========================================================================

const rowToProduct = (row: any): Product => ({
  id: Number(row.id),
  title: row.title,
  category: row.category,
  price: row.price,
  numericPrice: Number(row.numeric_price) || 0,
  originalPrice: row.original_price ?? null,
  rating: Number(row.rating) || 5,
  reviewCount: Number(row.review_count) || 0,
  badges: Array.isArray(row.badges) ? row.badges : [],
  image: row.image,
  description: row.description || undefined,
  sku: row.sku || undefined,
  inStock: row.in_stock ?? true,
  isPreOrder: row.is_pre_order ?? false,
  stockCount: Number(row.stock_count) || 0,
  sizes: Array.isArray(row.sizes) ? row.sizes : [],
  varieties: Array.isArray(row.varieties) ? row.varieties : [],
  isCustomizable: row.is_customizable ?? false,
  customizationOptions: Array.isArray(row.customization_options) ? row.customization_options : [],
  isDrugOrHealthcare: row.is_drug_or_healthcare ?? false,
  dosageOrUsage: row.dosage_or_usage || undefined,
  ingredients: row.ingredients || undefined,
});

const productToRow = (product: Product) => ({
  id: product.id,
  title: product.title,
  category: product.category,
  price: product.price,
  numeric_price: product.numericPrice ?? 0,
  original_price: product.originalPrice ?? null,
  rating: product.rating ?? 5,
  review_count: product.reviewCount ?? 0,
  badges: product.badges ?? [],
  image: product.image,
  description: product.description ?? null,
  sku: product.sku ?? null,
  in_stock: product.inStock ?? true,
  is_pre_order: product.isPreOrder ?? false,
  stock_count: product.stockCount ?? 0,
  sizes: product.sizes ?? [],
  varieties: product.varieties ?? [],
  is_customizable: product.isCustomizable ?? false,
  customization_options: product.customizationOptions ?? [],
  is_drug_or_healthcare: product.isDrugOrHealthcare ?? false,
  dosage_or_usage: product.dosageOrUsage ?? null,
  ingredients: product.ingredients ?? null,
});

export const fetchProductsFromCloud = async (): Promise<Product[] | null> => {
  const rows = await fetchRows('products');
  if (!rows) return null;
  return rows.map(rowToProduct).sort((a, b) => a.id - b.id);
};

export const saveProductToCloud = (product: Product): Promise<boolean> =>
  upsertRows('products', [productToRow(product)]);

export const deleteProductFromCloud = (id: number): Promise<boolean> =>
  deleteRow('products', id);

export const seedProductsToCloud = (products: Product[]): Promise<boolean> =>
  upsertRows('products', products.map(productToRow));

// =========================================================================
// CATEGORIES CLOUD SYNC
// =========================================================================

const rowToCategory = (row: any): Category => ({
  id: row.id,
  title: row.title,
  count: row.count ?? '0 Products',
  icon: row.icon ?? 'Package',
  description: row.description || undefined,
});

const categoryToRow = (category: Category) => ({
  id: category.id,
  title: category.title,
  count: category.count ?? '0 Products',
  icon: category.icon ?? 'Package',
  description: category.description ?? null,
});

export const fetchCategoriesFromCloud = async (): Promise<Category[] | null> => {
  const rows = await fetchRows('categories');
  if (!rows) return null;
  return rows.map(rowToCategory);
};

export const saveCategoryToCloud = (category: Category): Promise<boolean> =>
  upsertRows('categories', [categoryToRow(category)]);

export const deleteCategoryFromCloud = (id: string): Promise<boolean> =>
  deleteRow('categories', id);

export const seedCategoriesToCloud = (categories: Category[]): Promise<boolean> =>
  upsertRows('categories', categories.map(categoryToRow));

// =========================================================================
// COUPONS CLOUD SYNC
// =========================================================================

const rowToCoupon = (row: any): Coupon => ({
  id: row.id,
  code: row.code,
  discountPercent: Number(row.discount_percent) || 0,
  minSpend: row.min_spend == null ? undefined : Number(row.min_spend),
  isActive: row.is_active ?? true,
  description: row.description || undefined,
  usageCount: Number(row.usage_count) || 0,
});

const couponToRow = (coupon: Coupon) => ({
  id: coupon.id,
  code: coupon.code,
  discount_percent: coupon.discountPercent ?? 0,
  min_spend: coupon.minSpend ?? null,
  is_active: coupon.isActive ?? true,
  description: coupon.description ?? null,
  usage_count: coupon.usageCount ?? 0,
});

export const fetchCouponsFromCloud = async (): Promise<Coupon[] | null> => {
  const rows = await fetchRows('coupons');
  if (!rows) return null;
  return rows.map(rowToCoupon);
};

export const saveCouponToCloud = (coupon: Coupon): Promise<boolean> =>
  upsertRows('coupons', [couponToRow(coupon)]);

export const deleteCouponFromCloud = (id: string): Promise<boolean> =>
  deleteRow('coupons', id);

export const seedCouponsToCloud = (coupons: Coupon[]): Promise<boolean> =>
  upsertRows('coupons', coupons.map(couponToRow));

// =========================================================================
// MEDIA / PICTURE LIBRARY CLOUD SYNC
// =========================================================================

const rowToMediaItem = (row: any): MediaItem => ({
  id: row.id,
  url: row.url,
  title: row.title,
  category: row.category,
  uploadedAt: row.uploaded_at,
  isCustom: row.is_custom ?? false,
  size: row.size || undefined,
});

const mediaToRow = (item: MediaItem) => ({
  id: item.id,
  url: item.url,
  title: item.title,
  category: item.category,
  uploaded_at: item.uploadedAt,
  is_custom: item.isCustom ?? false,
  size: item.size ?? null,
});

export const fetchMediaFromCloud = async (): Promise<MediaItem[] | null> => {
  const rows = await fetchRows('media');
  if (!rows) return null;
  return rows.map(rowToMediaItem);
};

export const saveMediaToCloud = (item: MediaItem): Promise<boolean> =>
  upsertRows('media', [mediaToRow(item)]);

export const deleteMediaFromCloud = (id: string): Promise<boolean> =>
  deleteRow('media', id);

export const seedMediaToCloud = (items: MediaItem[]): Promise<boolean> =>
  upsertRows('media', items.map(mediaToRow));

// =========================================================================
// WEBSITE CONTENT (HERO SLIDES, BANNERS, ABOUT & CONTACT) CLOUD SYNC
// =========================================================================

export const fetchSiteContentFromCloud = async (): Promise<SiteContent | null> => {
  const rows = await fetchRows('site_content');
  if (!rows || rows.length === 0) return null;

  const mainRow = rows.find((row: any) => row.id === 'main') || rows[0];
  if (!mainRow?.data) return null;

  return normalizeSiteContent(mainRow.data);
};

export const saveSiteContentToCloud = (content: SiteContent): Promise<boolean> =>
  upsertRows('site_content', [
    {
      id: 'main',
      data: content,
      updated_at: new Date().toISOString(),
    },
  ]);

// =========================================================================
// FULL STORE SEED (used after a JSON backup restore)
// =========================================================================

export const pushStoreDataToCloud = async (data: {
  products?: Product[];
  categories?: Category[];
  coupons?: Coupon[];
  media?: MediaItem[];
  orders?: Order[];
  siteContent?: SiteContent;
}): Promise<void> => {
  if (!isSupabaseConfigured()) return;

  if (data.products?.length) await seedProductsToCloud(data.products);
  if (data.categories?.length) await seedCategoriesToCloud(data.categories);
  if (data.coupons?.length) await seedCouponsToCloud(data.coupons);
  if (data.media?.length) await seedMediaToCloud(data.media);
  if (data.siteContent) await saveSiteContentToCloud(data.siteContent);
  if (data.orders?.length) {
    for (const order of data.orders) {
      await saveOrderToCloud(order);
    }
  }
};

// =========================================================================
// TEST CONNECTION UTILITY
// =========================================================================

export const testSupabaseConnection = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
  if (!url || !key) {
    return { success: false, message: 'Supabase URL and Anon Key are required.' };
  }

  try {
    const client = createClient(url.trim(), key.trim(), { auth: { persistSession: false } });
    const { error } = await client.from('orders').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, we still know credentials are valid
      if (error.message.includes('relation "public.orders" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Note: Run schema.sql in Supabase SQL Editor to create tables).',
        };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected to Supabase Cloud Database with Realtime enabled!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed. Check URL and Key.' };
  }
};
