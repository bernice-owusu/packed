import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, Check, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    currencySymbol,
    exchangeRate
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariety, setSelectedVariety] = useState<string>('');
  const [customizationNote, setCustomizationNote] = useState<string>('');
  const [isWholesaleBox, setIsWholesaleBox] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || (quickViewProduct.sizes ? quickViewProduct.sizes[0] : '');
  const currentVariety = selectedVariety || (quickViewProduct.varieties ? quickViewProduct.varieties[0] : '');

  const displayPrice = () => {
    if (isWholesaleBox && quickViewProduct.wholesaleBoxPrice) {
      return quickViewProduct.wholesaleBoxPrice;
    }
    if (typeof quickViewProduct.numericPrice === 'number') {
      return `${currencySymbol} ${(quickViewProduct.numericPrice * exchangeRate).toFixed(2)}`;
    }
    return quickViewProduct.price;
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, {
      selectedSize: currentSize,
      selectedVariety: currentVariety,
      customizationNote: customizationNote.trim() || undefined,
      isWholesaleBox
    });
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 hover:bg-[#581C87] text-gray-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Left: Product Image & Badges */}
            <div className="relative rounded-2xl bg-purple-50/50 border border-purple-100 p-4 flex flex-col items-center justify-center">
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {quickViewProduct.badges.map(b => (
                  <span
                    key={b}
                    className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 uppercase border border-purple-200"
                  >
                    {b}
                  </span>
                ))}
                {quickViewProduct.isPreOrder && (
                  <span className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 uppercase shadow">
                    Pre-Order
                  </span>
                )}
              </div>
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full aspect-square max-h-72 object-cover rounded-xl shadow-xs"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-900 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Packed by Dolyn Authenticity Verified</span>
              </div>
            </div>

            {/* Right: Info & Controls */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                  {quickViewProduct.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E0B36] mt-1 leading-snug">
                  {quickViewProduct.title}
                </h2>

                <div className="flex items-center space-x-2 mt-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(quickViewProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">
                    {quickViewProduct.rating} ({quickViewProduct.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price & Stock status */}
              <div className="flex items-baseline space-x-3 pb-3 border-b border-gray-100">
                <span className="text-2xl font-black text-[#581C87]">
                  {displayPrice()}
                </span>
                {quickViewProduct.originalPrice && !isWholesaleBox && (
                  <span className="text-sm text-gray-400 line-through">
                    {quickViewProduct.originalPrice}
                  </span>
                )}
                <span className={`text-[10.5px] px-2.5 py-0.5 rounded-full font-bold ${
                  quickViewProduct.inStock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {quickViewProduct.inStock ? 'Ready for Dispatch' : 'Pre-Order Confirmation'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Size Selector */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1E0B36] mb-1">Select Size / Volume:</label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-semibold border cursor-pointer transition-all ${
                          currentSize === size
                            ? 'border-[#581C87] bg-purple-50 text-[#581C87]'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scent Variety Selector */}
              {quickViewProduct.varieties && quickViewProduct.varieties.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1E0B36] mb-1">Fragrance / Variety:</label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.varieties.map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSelectedVariety(v)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-semibold border cursor-pointer transition-all ${
                          currentVariety === v
                            ? 'border-[#581C87] bg-purple-50 text-[#581C87]'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wholesale Box Option */}
              {quickViewProduct.wholesaleBoxPrice && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWholesaleBox}
                      onChange={e => setIsWholesaleBox(e.target.checked)}
                      className="rounded text-[#581C87] focus:ring-[#581C87]"
                    />
                    <span className="text-xs font-bold text-amber-950">
                      Buy Wholesale Carton ({quickViewProduct.wholesaleBoxQuantity || 12} pcs) at {quickViewProduct.wholesaleBoxPrice}
                    </span>
                  </label>
                  <p className="text-[10px] text-amber-800 pl-6 mt-0.5">
                    Save 15% - 25% with factory-direct bulk box pricing.
                  </p>
                </div>
              )}

              {/* Customization Note */}
              {quickViewProduct.isCustomizable && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1E0B36] mb-1">
                    Custom Packaging Preferences (Ribbon / Card Message):
                  </label>
                  <input
                    type="text"
                    value={customizationNote}
                    onChange={e => setCustomizationNote(e.target.value)}
                    placeholder="e.g. Royal purple satin ribbon, write 'Best Wishes' on card"
                    className="w-full p-2 border border-purple-200 rounded-lg text-xs focus:outline-none focus:border-[#581C87]"
                  />
                </div>
              )}

              {/* Quantity & Add to Cart button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-200 transition-colors cursor-pointer text-gray-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-[#1D395F] min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-gray-200 transition-colors cursor-pointer text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-3 px-6 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{quickViewProduct.isPreOrder ? 'Pre-Order Now' : 'Add to Bag'}</span>
                </button>

                <a
                  href={`https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20have%20questions%20about%20${encodeURIComponent(quickViewProduct.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
                  title="Ask on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Tabs */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex space-x-6 border-b border-gray-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === 'desc'
                    ? 'border-b-2 border-[#581C87] text-[#581C87]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description & Benefits
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-[#581C87] text-[#581C87]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {quickViewProduct.isDrugOrHealthcare ? 'Dosage & Health Guide' : 'Ingredients & Packaging'}
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === 'delivery'
                    ? 'border-b-2 border-[#581C87] text-[#581C87]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ghana Delivery & Returns Policy
              </button>
            </div>

            <div className="py-4 text-xs text-gray-600 leading-relaxed">
              {activeTab === 'desc' && (
                <p>
                  {quickViewProduct.description} Each item is thoughtfully produced, hygienically prepared, and packaged in Accra, Ghana by Packed by Dolyn.
                </p>
              )}
              {activeTab === 'specs' && (
                <div>
                  {quickViewProduct.dosageOrUsage && (
                    <div className="mb-2">
                      <strong className="text-purple-900 block mb-0.5">Recommended Usage / Dosage:</strong>
                      <p>{quickViewProduct.dosageOrUsage}</p>
                    </div>
                  )}
                  {quickViewProduct.ingredients && (
                    <div className="mb-2">
                      <strong className="text-purple-900 block mb-0.5">Active Ingredients:</strong>
                      <p>{quickViewProduct.ingredients}</p>
                    </div>
                  )}
                  <p>SKU: {quickViewProduct.sku || 'DOLYN-PR-01'}</p>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div className="space-y-1.5">
                  <p><strong>Accra Delivery:</strong> Same-day express dispatch available (3–6 hours) or standard next-day.</p>
                  <p><strong>Nationwide Regions:</strong> VIP parcel and express couriers to Kumasi, Takoradi, Cape Coast, Tamale, and all 16 regions.</p>
                  <p><strong>Returns Policy:</strong> Due to hygiene safety standards and customized gift packaging, all sales are final upon dispatch.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
