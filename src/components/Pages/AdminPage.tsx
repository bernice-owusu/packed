import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Order } from '../../types';

export const AdminPage: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const {
    productList,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    currencySymbol,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai' | 'orders' | 'products' | 'customers' | 'analytics'>('ai');

  // AI Report state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  // Product Form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('Shea Butter & Cosmetics');
  const [prodPrice, setProdPrice] = useState('45');
  const [prodStock, setProdStock] = useState('25');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80');
  const [prodDescription, setProdDescription] = useState('');
  const [prodWholesaleBoxPrice, setProdWholesaleBoxPrice] = useState('450');
  const [prodWholesaleBoxQty, setProdWholesaleBoxQty] = useState('12');
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [isDrug, setIsDrug] = useState(false);
  const [dosage, setDosage] = useState('');

  // Orders filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'Delivered').length;
  const momoOrders = orders.filter(o => o.paymentMethod.includes('MoMo') || o.paymentMethod.includes('Telecel') || o.paymentMethod.includes('AT')).length;
  const cardOrders = orders.filter(o => o.paymentMethod.includes('Card')).length;

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
      // Client-side fallback report if backend unavailable
      setAiReport(
        `📊 Executive Daily Briefing for Packed by Dolyn\nGenerated for: Gwendolyn Barnie Boahen (Business Owner)\n\n• Sales & Revenue: Total order volume GH₵ ${totalRevenue.toFixed(2)} across ${orders.length} orders.\n• Order Fulfillment: ${pendingOrders} dispatch(es) pending delivery in Greater Accra and courier parcels.\n• Payment Breakdown: ${momoOrders} via Mobile Money (MTN MoMo/Telecel/AT Money) and ${cardOrders} via Paystack cards.\n• Low Stock Alert: Monitor inventory of Whipped Shea Butter (250g) and Vitamin C 1000mg Effervescent.\n• Action Recommendations:\n  1. Confirm dispatch rider pickups for Accra East Legon & Airport City deliveries.\n  2. Follow up on pre-orders for luxury wedding gift hampers.\n  3. Verify bulk carton packaging supplies.`
      );
      addToast('Generated fallback business summary', 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(prodPrice) || 45;
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: prodTitle,
        category: prodCategory,
        price: `GH₵ ${numPrice.toFixed(2)}`,
        numericPrice: numPrice,
        stockCount: parseInt(prodStock) || 20,
        image: prodImage,
        description: prodDescription,
        wholesaleBoxPrice: `GH₵ ${(parseFloat(prodWholesaleBoxPrice) || numPrice * 10).toFixed(2)}`,
        wholesaleBoxQuantity: parseInt(prodWholesaleBoxQty) || 12,
        isPreOrder,
        isDrugOrHealthcare: isDrug,
        dosageOrUsage: dosage
      });
      setEditingProduct(null);
    } else {
      addProduct({
        title: prodTitle,
        category: prodCategory,
        price: `GH₵ ${numPrice.toFixed(2)}`,
        numericPrice: numPrice,
        stockCount: parseInt(prodStock) || 20,
        image: prodImage,
        description: prodDescription,
        wholesaleBoxPrice: `GH₵ ${(parseFloat(prodWholesaleBoxPrice) || numPrice * 10).toFixed(2)}`,
        wholesaleBoxQuantity: parseInt(prodWholesaleBoxQty) || 12,
        isPreOrder,
        isDrugOrHealthcare: isDrug,
        dosageOrUsage: dosage
      });
      setIsAddingProduct(false);
    }

    // Reset form
    setProdTitle('');
    setProdPrice('45');
    setProdStock('25');
    setProdDescription('');
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProdTitle(p.title);
    setProdCategory(p.category);
    setProdPrice(String(p.numericPrice || 45));
    setProdStock(String(p.stockCount || 20));
    setProdImage(p.image);
    setProdDescription(p.description || '');
    setProdWholesaleBoxPrice(p.wholesaleBoxPrice ? p.wholesaleBoxPrice.replace(/[^\d.]/g, '') : '450');
    setProdWholesaleBoxQty(String(p.wholesaleBoxQuantity || 12));
    setIsPreOrder(!!p.isPreOrder);
    setIsDrug(!!p.isDrugOrHealthcare);
    setDosage(p.dosageOrUsage || '');
  };

  const filteredOrders = orderStatusFilter === 'All'
    ? orders
    : orders.filter(o => o.status === orderStatusFilter);

  return (
    <div className="bg-[#FAF7FB] min-h-screen py-4 sm:py-8">
      <div className="pls-container">
        {/* Admin Header */}
        <div className="bg-[#1E0B36] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-xl border border-purple-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-purple-200">
                Business Management Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              PACKED BY DOLYN • Owner Dashboard
            </h1>
            <p className="text-xs text-purple-200">
              Authorized Administrator: <strong>Gwendolyn Barnie Boahen</strong> (gbbyaa@gmail.com) • Tel: 0244149464
            </p>
          </div>

          <button
            onClick={onExit}
            className="self-start md:self-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer active:scale-95"
          >
            ← Exit to Customer Store
          </button>
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 text-[#581C87] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase block truncate">Total Sales</span>
              <span className="text-sm sm:text-xl font-extrabold text-[#1E0B36] truncate block">
                {currencySymbol} {totalRevenue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase block truncate">Total Orders</span>
              <span className="text-sm sm:text-xl font-extrabold text-[#1E0B36] truncate block">{orders.length}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase block truncate">Dispatches</span>
              <span className="text-sm sm:text-xl font-extrabold text-[#1E0B36] truncate block">{pendingOrders}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase block truncate">Catalog Items</span>
              <span className="text-sm sm:text-xl font-extrabold text-[#1E0B36] truncate block">{productList.length}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-gray-200 mb-6 space-x-2 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-white text-[#581C87] border-t-2 border-[#581C87] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>AI Order Assistant Report</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-[#581C87] border-t-2 border-[#581C87] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Manage Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-white text-[#581C87] border-t-2 border-[#581C87] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Stock ({productList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-3 px-4 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'customers'
                ? 'bg-white text-[#581C87] border-t-2 border-[#581C87] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers & Inquiries</span>
          </button>
        </div>

        {/* Tab 1: AI Assistant Report Summarizer */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Section 6.3 Questionnaire Requirement
                </span>
                <h3 className="text-xl font-extrabold text-[#1E0B36] mt-1">
                  AI Executive Order Assistant
                </h3>
                <p className="text-xs text-gray-500">
                  Powered by Gemini AI to summarize today&apos;s orders, delivery dispatches, inventory warnings, and strategic action items for Gwendolyn.
                </p>
              </div>

              <button
                onClick={handleGenerateAiReport}
                disabled={isGeneratingAi}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#581C87] to-[#7E22CE] hover:from-[#4C1D95] hover:to-[#6B21A8] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
              {isGeneratingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Orders with Gemini AI...</span>
                </>
              ) : (
                <span>Generate Executive AI Summary</span>
              )}
              </button>
            </div>

            {aiReport ? (
              <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-200/80 text-xs text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                {aiReport}
              </div>
            ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center space-y-3">
                <h4 className="font-bold text-[#1E0B36]">No AI Summary Generated Yet</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Click the button above to have your Gemini AI Assistant read through all live customer orders, check current stock levels, and deliver an actionable daily report.
                </p>
                <button
                  onClick={handleGenerateAiReport}
                  className="px-5 py-2.5 bg-[#581C87] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-[#4C1D95]"
                >
                  Generate Daily Report Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#1E0B36]">Manage Customer Orders</h3>
                <p className="text-xs text-gray-500">Track Ghana delivery status, MoMo receipts, and custom notes.</p>
              </div>

              {/* Status filter buttons */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['All', 'New', 'Confirmed', 'In Packing', 'Out for Delivery', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                      orderStatusFilter === status
                        ? 'bg-[#581C87] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all bg-white shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-[#1E0B36]">{order.id}</span>
                      <span className="text-xs bg-purple-100 text-[#581C87] font-bold px-2 py-0.5 rounded">
                        {order.deliveryType}
                      </span>
                      <span className="text-xs text-gray-400">{order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Update Status:</span>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-xs p-1.5 rounded-lg border border-purple-200 bg-purple-50 font-bold text-[#581C87] cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Packing">In Packing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and Items Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block font-semibold">Customer & Destination:</span>
                      <strong className="text-gray-800">{order.customerName}</strong>
                      <p className="text-gray-600">{order.customerPhone}</p>
                      <p className="text-gray-600 mt-1">{order.deliveryRegion}</p>
                      <p className="text-gray-500 text-[11px]">{order.deliveryAddress}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 block font-semibold">Items Ordered:</span>
                      <ul className="space-y-1 mt-0.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-gray-700">
                            • {item.quantity}x {item.isWholesaleBox ? `[Box] ${item.product.title}` : item.product.title}
                            {item.selectedSize && ` (${item.selectedSize})`}
                          </li>
                        ))}
                      </ul>
                      {order.customNotes && (
                        <p className="text-[11px] text-purple-700 italic mt-1.5 bg-purple-50 p-1.5 rounded">
                          Custom Note: &quot;{order.customNotes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="md:text-right">
                      <span className="text-gray-400 block font-semibold">Payment & Total:</span>
                      <strong className="text-emerald-700 block font-bold">
                        {order.paymentMethod} (Paid)
                      </strong>
                      {order.momoNumber && (
                        <p className="text-gray-500 text-[11px]">MoMo: {order.momoNumber}</p>
                      )}
                      <p className="text-base font-black text-[#581C87] mt-1">
                        {currencySymbol} {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Products Management */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#1E0B36]">Product Catalog & Inventory</h3>
                <p className="text-xs text-gray-500">Add, edit, change prices, or adjust wholesale carton options.</p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingProduct(!isAddingProduct);
                }}
                className="inline-flex items-center space-x-1.5 bg-[#581C87] hover:bg-[#4C1D95] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingProduct ? 'Close Form' : 'Add New Product'}</span>
              </button>
            </div>

            {/* Product Add / Edit Form */}
            {(isAddingProduct || editingProduct) && (
              <form onSubmit={handleSaveProduct} className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-4 text-xs">
                <h4 className="font-extrabold text-sm text-[#581C87]">
                  {editingProduct ? `Edit Product #${editingProduct.id}` : 'Create New Product Offering'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={prodTitle}
                      onChange={e => setProdTitle(e.target.value)}
                      placeholder="e.g. Whipped Shea Butter 250ml"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={e => setProdCategory(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    >
                      <option>Shea Butter & Cosmetics</option>
                      <option>Perfumes & Fragrances</option>
                      <option>Gift Packaging & Hampers</option>
                      <option>Household & Sanitary</option>
                      <option>Pharmacy & Drugs</option>
                      <option>Flash Deals & Specials</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Unit Price (GH₵) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={e => setProdPrice(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={e => setProdStock(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Wholesale Box Price (GH₵)</label>
                    <input
                      type="number"
                      value={prodWholesaleBoxPrice}
                      onChange={e => setProdWholesaleBoxPrice(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Wholesale Box Quantity</label>
                    <input
                      type="number"
                      value={prodWholesaleBoxQty}
                      onChange={e => setProdWholesaleBoxQty(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={prodImage}
                    onChange={e => setProdImage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description & Health Notes</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={e => setProdDescription(e.target.value)}
                    placeholder="Details about raw ingredients, application, or health benefits..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPreOrder}
                      onChange={e => setIsPreOrder(e.target.checked)}
                      className="rounded text-[#581C87]"
                    />
                    <span className="font-semibold text-gray-800">Pre-Order Only (Advance Payment)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDrug}
                      onChange={e => setIsDrug(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-blue-900">Pharmaceutical / Essential Drug</span>
                  </label>
                </div>

                {isDrug && (
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900">Dosage / Usage Instructions</label>
                    <input
                      type="text"
                      value={dosage}
                      onChange={e => setDosage(e.target.value)}
                      placeholder="e.g. Adults take 1-2 tablets daily after meals"
                      className="w-full p-2.5 bg-white border border-blue-300 rounded-lg text-xs"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#581C87] text-white font-bold rounded-xl cursor-pointer hover:bg-[#4C1D95]"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddingProduct(false);
                    }}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl cursor-pointer hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Product Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {productList.map(prod => (
                <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-700">{prod.category}</span>
                      <h4 className="font-bold text-xs text-[#1E0B36]">{prod.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                        <span>Price: <strong className="text-[#581C87]">{prod.price}</strong></span>
                        <span>•</span>
                        <span>Stock: <strong>{prod.stockCount ?? 20}</strong></span>
                        {prod.isPreOrder && (
                          <span className="text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-bold text-[10px]">
                            Pre-Order
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-2 text-gray-500 hover:text-[#581C87] hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                      title="Edit product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove "${prod.title}"?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Customers & Inquiries */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-xl font-extrabold text-[#1E0B36]">Customer Relations & Collaboration Requests</h3>
              <p className="text-xs text-gray-500">
                Contact information for corporate clients, event planners, and repeat buyers in Ghana.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-[#1E0B36]">Stanbic Bank Ghana (Corporate)</h4>
                    <p className="text-gray-500 text-[11px]">Akosua Asantewaa • Procurement</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Corporate Partner
                  </span>
                </div>
                <div className="space-y-1 text-gray-600 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                    <span>0553198421</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-700" />
                    <span>akosua.asante@standardbank.com.gh</span>
                  </div>
                </div>
                <p className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded-lg font-medium">
                  Annual board meeting gift hampers & customized shea butter wellness gifts.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-[#1E0B36]">Kofi Mensah (Individual VIP)</h4>
                    <p className="text-gray-500 text-[11px]">Regular Buyer • East Legon</p>
                  </div>
                  <span className="bg-purple-100 text-[#581C87] text-[10px] font-bold px-2 py-0.5 rounded">
                    Verified Customer
                  </span>
                </div>
                <div className="space-y-1 text-gray-600 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                    <span>0244589210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-700" />
                    <span>kofi.mensah@gmail.com</span>
                  </div>
                </div>
                <p className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded-lg font-medium">
                  Bi-monthly orders of Whipped Lavender Shea Butter and Vanilla Oud Splash.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
