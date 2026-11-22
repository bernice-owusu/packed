/**
 * Official Paystack Gateway Integration for Packed by Dolyn Ghana
 * Supports: GHS (Ghana Cedis), MTN Mobile Money, Telecel/Vodafone Cash, AT Money, and Visa/Mastercard.
 */

export const PAYSTACK_PUBLIC_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) ||
  'pk_live_60d89b07b32902dcabf51dfc064aa4af9db102a3';

export interface PaystackCheckoutOptions {
  email: string;
  amount: number; // in GH₵ (Cedis)
  customerName?: string;
  phone?: string;
  orderId?: string;
  channels?: ('card' | 'mobile_money')[];
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Ensure the Paystack inline.js script is loaded in the DOM
 */
export const loadPaystackInline = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      resolve(true);
      return;
    }

    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    const existing = document.querySelector('script[src*="js.paystack.co"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiate live payment through Paystack Ghana modal
 */
export const processPaystackPayment = async (options: PaystackCheckoutOptions) => {
  await loadPaystackInline();

  const PaystackPop = (window as any).PaystackPop;
  if (!PaystackPop) {
    if (options.onError) {
      options.onError(new Error('Paystack inline SDK is not available. Check your internet connection.'));
    }
    return;
  }

  // Paystack expects amount in the lowest subunit: 1 GHS = 100 pesewas
  const amountInPesewas = Math.round(options.amount * 100);
  const paymentRef = `DOLYN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  // Ensure valid email for Paystack receipt
  let cleanEmail = (options.email || '').trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    const cleanPhone = (options.phone || 'customer').replace(/\D/g, '') || 'guest';
    cleanEmail = `${cleanPhone}@packedbydolyn.com`;
  }

  try {
    if (typeof PaystackPop.setup === 'function') {
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: cleanEmail,
        amount: amountInPesewas,
        currency: 'GHS',
        ref: paymentRef,
        channels: options.channels || ['card', 'mobile_money'],
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: options.customerName || 'Valued Customer',
            },
            {
              display_name: 'Mobile / MoMo Number',
              variable_name: 'customer_phone',
              value: options.phone || '',
            },
            {
              display_name: 'Order Reference',
              variable_name: 'order_id',
              value: options.orderId || paymentRef,
            },
          ],
        },
        callback: (response: any) => {
          const verifiedRef = response.reference || response.trxref || paymentRef;
          options.onSuccess(verifiedRef);
        },
        onClose: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      });

      handler.openIframe();
    } else if (typeof PaystackPop === 'function') {
      const popup = new PaystackPop();
      popup.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: cleanEmail,
        amount: amountInPesewas,
        currency: 'GHS',
        ref: paymentRef,
        channels: options.channels || ['card', 'mobile_money'],
        onSuccess: (transaction: any) => {
          const verifiedRef = transaction.reference || transaction.trxref || paymentRef;
          options.onSuccess(verifiedRef);
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
        },
      });
    }
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    if (options.onError) {
      options.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
};
