import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, Product, Category, Coupon, MediaItem } from '../types';

/**
 * Supabase Cloud Database Client & Realtime Sync Engine for Packed by Dolyn
 * Enables multi-device real-time sync across mobile, desktop, and client storefronts.
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

// =========================================================================
// ORDERS CLOUD SYNC
// =========================================================================

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

    return data.map((row: any) => ({
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
    }));
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

// =========================================================================
// REALTIME SUBSCRIPTION FOR ORDERS (MULTI-DEVICE LIVE NOTIFICATIONS)
// =========================================================================

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

          const mappedOrder: Order = {
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
          };

          onOrderChange(mappedOrder);
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
