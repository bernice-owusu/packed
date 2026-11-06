import React from 'react';
import { Eye, ShoppingBag, Star, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

export const ProductCard: React.FC<{
  product: Product;
  compact?: boolean;
}> = ({ product, compact = false }) => {
  const {
    addToCart,
    openQuickView,
    currencySymbol,
    exchangeRate
  } = useApp();

  const displayPrice = () => {
    if (typeof product.numericPrice === 'number') {
      return `${currencySymbol} ${(product.numericPrice * exchangeRate).toFixed(2)}`;
    }
    return product.price;
  };

  const displayOriginalPrice = () => {
    if (!product.originalPrice) return null;
    const match = product.originalPrice.match(/[\d\.]+/);
    if (match) {
      const orig = parseFloat(match[0]);
      return `${currencySymbol} ${(orig * exchangeRate).toFixed(2)}`;
    }
    return product.originalPrice;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-white hover:bg-purple-50/50 rounded-xl border border-gray-100 hover:border-purple-200 transition-all group">
        <div
          onClick={() => openQuickView(product)}
          className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-purple-50 flex items-center justify-center p-1 cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-purple-700 font-bold block truncate uppercase">{product.category}</span>
          <h4
            onClick={() => openQuickView(product)}
            className="text-xs font-bold text-[#1D395F] group-hover:text-[#581C87] truncate cursor-pointer transition-colors"
          >
            {product.title}
          </h4>
          <div className="flex items-center space-x-1 mt-0.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs font-extrabold text-[#581C87]">
              {displayPrice()}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {displayOriginalPrice()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Card Header & Badges */}
      <div className="relative p-2.5 sm:p-4 pb-0 flex flex-col items-center">
        {/* Badges Left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 max-w-[62%] sm:max-w-[65%] pointer-events-none">
          {product.badges.map(badge => {
            let color = 'bg-purple-100 text-purple-800 border-purple-200';
            if (badge.includes('Flash') || badge === 'Sale') color = 'bg-rose-100 text-rose-800 border-rose-200';
            if (badge === 'Bestseller' || badge === 'Popular') color = 'bg-amber-100 text-amber-900 border-amber-200';
            if (badge === 'Rx' || badge.includes('Pharmacy')) color = 'bg-blue-100 text-blue-900 border-blue-200';
            if (badge.includes('Pre-Order')) color = 'bg-amber-500 text-white border-amber-600';
            return (
              <span
                key={badge}
                className={`text-[9px] sm:text-[9.5px] font-extrabold px-2 py-0.5 rounded-full tracking-wide border shadow-2xs truncate ${color}`}
              >
                {badge}
              </span>
            );
          })}
          {product.isCustomizable && (
            <span className="text-[8.5px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 truncate">
              Customizable Pack
            </span>
          )}
        </div>

        {/* Action Buttons Right */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => openQuickView(product)}
            className="hidden sm:flex w-8 h-8 rounded-full bg-white text-gray-700 hover:text-[#581C87] hover:bg-purple-50 items-center justify-center shadow-md transition-all cursor-pointer border border-gray-100 active:scale-95 opacity-0 group-hover:opacity-100"
            title="Quick view product details"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}`}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center shadow-md transition-all cursor-pointer border border-gray-100 active:scale-95"
            title="Inquire on WhatsApp"
            aria-label="WhatsApp Inquiry"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>

        {/* Product Image */}
        <div
          onClick={() => openQuickView(product)}
          className="w-full aspect-square max-h-52 rounded-xl overflow-hidden bg-purple-50/50 flex items-center justify-center p-2 cursor-pointer relative"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg group-hover:scale-106 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
            }}
          />
          {product.isPreOrder && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center rounded-lg">
              <span className="bg-amber-400 text-purple-950 font-extrabold text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Pre-Order
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 pt-2 flex flex-col justify-between flex-1">
        <div>
          {/* Category */}
          <span className="text-[10.5px] font-bold text-purple-700 uppercase tracking-wider block">
            {product.category}
          </span>

          {/* Title */}
          <h3
            onClick={() => openQuickView(product)}
            className="text-xs sm:text-sm font-bold text-[#1D395F] group-hover:text-[#581C87] transition-colors mt-1 line-clamp-2 min-h-[38px] cursor-pointer leading-snug"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-sm sm:text-base font-extrabold text-[#1E0B36]">
              {displayPrice()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {displayOriginalPrice()}
              </span>
            )}
          </div>

          {/* Wholesale Box Price Notice */}
          {product.wholesaleBoxPrice && (
            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
              Box Carton: {product.wholesaleBoxPrice} ({product.wholesaleBoxQuantity || 12} pcs)
            </p>
          )}
        </div>

        {/* Add to Cart button */}
        <div className="mt-3.5 pt-2 border-t border-gray-100">
          <button
            onClick={() => addToCart(product, 1)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-98 select-none touch-manipulation ${
              product.isPreOrder
                ? 'bg-amber-400 hover:bg-amber-500 text-purple-950'
                : 'bg-purple-50 hover:bg-[#581C87] text-[#581C87] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.isPreOrder ? 'Pre-Order Now' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
