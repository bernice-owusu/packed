import React, { useState, useEffect } from 'react';
import { Clock, Flame, Star, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BestDealsCountdown: React.FC = () => {
  const { productList, addToCart, openQuickView, currencySymbol, exchangeRate } = useApp();

  // Ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 11,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 3, hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flash deal products from productList
  const flashDeals = [
    { ...productList.find(p => p.id === 21) || productList[0], stockSold: 36, stockTotal: 50 },
    { ...productList.find(p => p.id === 9) || productList[1], stockSold: 12, stockTotal: 20 },
    { ...productList.find(p => p.id === 22) || productList[2], stockSold: 28, stockTotal: 40 },
    { ...productList.find(p => p.id === 16) || productList[3], stockSold: 41, stockTotal: 55 }
  ];

  return (
    <section id="deals-section" className="py-8 md:py-12 bg-gradient-to-b from-purple-50/70 via-white to-purple-50/40">
      <div className="pls-container">
        {/* Header with Title & Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-purple-100 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#581C87] flex items-center justify-center text-amber-300 shadow-md">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Limited Time Offers
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E0B36] tracking-tight mt-1">
                Flash Deals & Weekly Specials!
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Exclusive bundle discounts on pure shea butter, luxury hampers, and health essentials.
              </p>
            </div>
          </div>

          {/* Countdown timer blocks */}
          <div className="flex flex-wrap items-center space-x-1.5 sm:space-x-2 text-center self-start md:self-auto bg-white p-1.5 sm:p-2 rounded-2xl shadow-sm border border-purple-100">
            <span className="text-[11px] sm:text-xs font-bold text-purple-900 mr-1 sm:mr-2 flex items-center gap-1 sm:gap-1.5 pl-1">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#581C87]" /> Ends In:
            </span>

            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((unit, i) => (
              <React.Fragment key={unit.label}>
                <div className="bg-[#1E0B36] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl min-w-[42px] sm:min-w-[50px] shadow-sm">
                  <span className="text-sm sm:text-lg font-black block leading-none text-amber-300">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-purple-200 block mt-0.5 font-medium">
                    {unit.label}
                  </span>
                </div>
                {i < 3 && <span className="text-purple-900 font-bold text-xs sm:text-sm">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 4 Deal Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {flashDeals.map(deal => {
            const percent = Math.round((deal.stockSold / deal.stockTotal) * 100);
            const priceVal = typeof deal.numericPrice === 'number'
              ? `${currencySymbol} ${(deal.numericPrice * exchangeRate).toFixed(2)}`
              : deal.price;

            const origVal = deal.originalPrice
              ? (deal.originalPrice.match(/[\d\.]+/)
                  ? `${currencySymbol} ${(parseFloat(deal.originalPrice.match(/[\d\.]+/)?.[0] || '0') * exchangeRate).toFixed(2)}`
                  : deal.originalPrice)
              : null;

            return (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wide">
                      Flash Promo
                    </span>
                    <span className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wide">
                      Save GH₵ 25+
                    </span>
                  </div>

                  {/* Image */}
                  <div
                    onClick={() => openQuickView(deal)}
                    className="w-full aspect-square max-h-48 rounded-xl overflow-hidden bg-purple-50/50 flex items-center justify-center p-2 cursor-pointer"
                  >
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Title & Category */}
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mt-3">
                    {deal.category}
                  </span>
                  <h3
                    onClick={() => openQuickView(deal)}
                    className="text-xs sm:text-sm font-bold text-[#1D395F] group-hover:text-[#581C87] transition-colors mt-1 line-clamp-2 min-h-[38px] cursor-pointer leading-snug"
                  >
                    {deal.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mt-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(deal.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">({deal.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-base font-extrabold text-[#1E0B36]">
                      {priceVal}
                    </span>
                    {origVal && (
                      <span className="text-xs text-gray-400 line-through">
                        {origVal}
                      </span>
                    )}
                  </div>

                  {/* Stock progress bar */}
                  <div className="mt-4 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1.5 font-semibold">
                      <span>Claimed: <strong className="text-purple-900">{deal.stockSold}</strong></span>
                      <span>Left: <strong className="text-rose-600">{deal.stockTotal - deal.stockSold}</strong></span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#581C87] to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Add */}
                <button
                  onClick={() => addToCart(deal, 1)}
                  className="mt-4 w-full py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Claim Flash Deal</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
