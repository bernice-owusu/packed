import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useApp } from '../../context/AppContext';

export const MultiColumnShowcase: React.FC<{ onNavigateShop?: () => void }> = ({ onNavigateShop }) => {
  const { productList, setSelectedCategory, addToast } = useApp();

  const recentProducts = productList.slice(0, 3);
  const saleProducts = productList.filter(p => p.originalPrice).slice(0, 3);

  const handleBannerClick = () => {
    setSelectedCategory('Shea Butter & Cosmetics');
    document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    addToast('Filtered by Shea Butter & Cosmetics');
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="pls-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Column 1: Recent Additions */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-base sm:text-lg font-bold text-[#1E0B36]">New Handcrafted Products</h3>
              <button
                onClick={onNavigateShop}
                className="text-xs font-bold text-[#581C87] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentProducts.map(p => (
                <ProductCard key={`recent-${p.id}`} product={p} compact />
              ))}
            </div>
          </div>

          {/* Column 2: Center Banner */}
          <div
            onClick={handleBannerClick}
            className="rounded-2xl overflow-hidden relative group shadow-md border border-purple-200 min-h-[300px] sm:min-h-[340px] p-8 flex flex-col justify-end cursor-pointer bg-gradient-to-b from-purple-900 to-purple-950"
          >
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
              alt="Shea Butter Promo"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E0B36] via-[#1E0B36]/60 to-transparent"></div>
            <div className="relative z-10 text-white space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                VALUE FOR MONEY & QUALITY
              </span>
              <h4 className="text-2xl font-extrabold leading-tight text-white">
                Unique Products You Can Rely On
              </h4>
              <p className="text-xs text-purple-200">
                Direct packaging of Northern Ghana shea butter, fine perfumes, and verified pharmaceuticals.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center space-x-1.5 bg-amber-400 text-purple-950 text-xs font-bold px-4 py-2 rounded-full transition-colors">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Special Promos */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-base sm:text-lg font-bold text-[#1E0B36]">Special Promotional Discounts</h3>
              <button
                onClick={onNavigateShop}
                className="text-xs font-bold text-[#581C87] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {saleProducts.map(p => (
                <ProductCard key={`sale-${p.id}`} product={p} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
