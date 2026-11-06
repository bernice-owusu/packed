import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useApp } from '../../context/AppContext';

export const TopPicks: React.FC<{ onNavigateShop?: () => void }> = ({ onNavigateShop }) => {
  const { productList } = useApp();
  const topPickProducts = productList.slice(4, 9);

  return (
    <section className="py-8 md:py-12 bg-purple-50/30">
      <div className="pls-container">
        {/* Section Heading Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-purple-100 gap-3">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-md mb-1.5 border border-amber-200">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Highest Rated by Ghanaian Shoppers</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E0B36] tracking-tight">
              Top Picks This Week
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              Most loved whipped shea creams, long-lasting fragrances, and essential first aid supplies.
            </p>
          </div>
          <button
            onClick={onNavigateShop}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#581C87] hover:text-purple-700 transition-colors group cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {topPickProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
