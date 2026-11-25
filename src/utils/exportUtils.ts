import { Order, Product, MediaItem, Coupon, Category } from '../types';

/**
 * Downloads a string content as a file in the browser.
 */
function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports store customer orders to CSV format for bookkeeping and courier audits.
 */
export function exportOrdersToCSV(orders: Order[]): void {
  const headers = [
    'Order ID',
    'Date Created',
    'Customer Name',
    'Customer Phone',
    'Delivery Region',
    'Delivery Address',
    'Delivery Type',
    'Payment Method',
    'Payment Status',
    'Total (GHS)',
    'Order Status',
    'Items Summary',
    'Custom Notes'
  ];

  const rows = orders.map(order => {
    const itemsSummary = order.items
      .map(i => `${i.quantity}x ${i.product.title}`)
      .join('; ');

    return [
      `"${order.id}"`,
      `"${order.createdAt}"`,
      `"${(order.customerName || '').replace(/"/g, '""')}"`,
      `"${order.customerPhone || ''}"`,
      `"${(order.deliveryRegion || '').replace(/"/g, '""')}"`,
      `"${(order.deliveryAddress || '').replace(/"/g, '""')}"`,
      `"${order.deliveryType}"`,
      `"${order.paymentMethod}"`,
      `"${order.paymentStatus}"`,
      order.total.toFixed(2),
      `"${order.status}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      `"${(order.customNotes || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `packed_by_dolyn_orders_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports catalog products to CSV format for inventory tracking.
 */
export function exportProductsToCSV(products: Product[]): void {
  const headers = [
    'ID',
    'SKU',
    'Title',
    'Category',
    'Price (GHS)',
    'Original Price (GHS)',
    'Stock Count',
    'In Stock',
    'Pre-Order',
    'Is Drug / Pharmacy',
    'Dosage Instructions'
  ];

  const rows = products.map(p => {
    return [
      p.id,
      `"${p.sku || `DOLYN-${p.id}`}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.numericPrice ? p.numericPrice.toFixed(2) : p.price.replace(/[^\d.]/g, ''),
      p.originalPrice ? p.originalPrice.replace(/[^\d.]/g, '') : '',
      p.stockCount ?? 20,
      p.inStock ? 'Yes' : 'No',
      p.isPreOrder ? 'Yes' : 'No',
      p.isDrugOrHealthcare ? 'Yes' : 'No',
      `"${(p.dosageOrUsage || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `packed_by_dolyn_products_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Creates a complete JSON backup of the store state (products, media, orders, coupons).
 */
export function exportFullStoreBackup(data: {
  products: Product[];
  orders: Order[];
  media: MediaItem[];
  coupons?: Coupon[];
  categories?: Category[];
}): void {
  const backupObject = {
    version: '1.0',
    store: 'Packed by Dolyn (Ghana)',
    exportedAt: new Date().toISOString(),
    owner: 'Gwendolyn Barnie Boahen',
    data
  };

  const jsonString = JSON.stringify(backupObject, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(jsonString, `packed_by_dolyn_backup_${dateStr}.json`, 'application/json');
}

/**
 * Validates and parses an uploaded JSON store backup file.
 */
export function parseStoreBackupFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.data || !Array.isArray(parsed.data.products)) {
          throw new Error('Invalid store backup format. Missing products data.');
        }
        resolve(parsed.data);
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to parse JSON backup file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
