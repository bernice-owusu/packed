import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useApp } from '../../context/AppContext';

export const FeaturedProducts: React.FC<{ onNavigateShop?: () => void }> = ({ onNavigateShop }) => {
  const { productList, selectedCategory, setSelectedCategory, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showAllInView, setShowAllInView] = useState<boolean>(false);

  const filterTabs = [
    { label: 'All Products', cat: 'All' },
    { label: 'Shea Butter & Cosmetics', cat: 'Shea Butter & Cosmetics' },
    { label: 'Perfumes & Fragrances', cat: 'Perfumes & Fragrances' },
    { label: 'Gift Hampers', cat: 'Gift Packaging & Hampers' },
    { label: 'Household & Sanitary', cat: 'Household & Sanitary' },
    { label: 'Pharmacy & Drugs', cat: 'Pharmacy & Drugs' },
    { label: 'Flash Deals', cat: 'Flash Deals & Specials' }
  ];

  const currentCategory = activeTab !== 'All' ? activeTab : selectedCategory;

  const matchingProducts = productList.filter(p => {
    if (currentCategory === 'All') return true;
    return (
      p.category.toLowerCase().includes(currentCategory.toLowerCase()) ||
      currentCategory.toLowerCase().includes(p.category.toLowerCase())
    );
  });

  // When All is chosen, show 8 by default with toggle to show all; when specific category is chosen, show all products
  const displayProducts =
    currentCategory === 'All' && !showAllInView
      ? matchingProducts.slice(0, 8)
      : matchingProducts;

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setSelectedCategory(cat);
    setShowAllInView(false);
    addToast(cat === 'All' ? 'Showing all featured products' : `Viewing ${cat}`);
  };

  return (
    <section id="featured-products-section" className="py-8 md:py-12 bg-white scroll-mt-16">
      <div className="pls-container">
        {/* Section Heading Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 uppercase bg-purple-50 px-2.5 py-1 rounded-md mb-1.5 border border-purple-200">
              <span>Full Dolyn Product Catalog ({productList.length} Items)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E0B36] tracking-tight">
              Featured Products & Collections
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              Browse our handcrafted shea creams, long-lasting fragrances, custom event hampers, sanitary products, and verified pharmacy drugs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onNavigateShop) {
                  onNavigateShop();
                } else {
                  setSelectedCategory('All');
                }
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#581C87] hover:text-purple-700 transition-colors group cursor-pointer bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl"
            >
              <span>Explore Complete Store Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs font-semibold -mx-4 px-4 sm:mx-0 sm:px-0">
          {filterTabs.map(tab => {
            const isActive = currentCategory === tab.cat;
            const count = tab.cat === 'All'
              ? productList.length
              : productList.filter(p =>
                  p.category.toLowerCase().includes(tab.cat.toLowerCase()) ||
                  tab.cat.toLowerCase().includes(p.category.toLowerCase())
                ).length;

            return (
              <button
                key={tab.cat}
                onClick={() => handleTabChange(tab.cat)}
                className={`px-3.5 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#581C87] text-white shadow-md scale-102 font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout: Left Banner + Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
          {/* Left Promo Card */}
          <div className="lg:col-span-1 rounded-2xl overflow-hidden relative group shadow-md bg-gradient-to-b from-[#3B0764] to-[#1E0B36] min-h-[160px] sm:min-h-[220px] lg:min-h-[380px] flex flex-col justify-end p-4 sm:p-6 lg:p-6 border border-purple-900/40 lg:sticky lg:top-20">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
              alt="Handmade Shea Cosmetics"
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E0B36] via-[#1E0B36]/60 to-transparent"></div>
            <div className="relative z-10 text-white space-y-1.5 sm:space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                Dolyn Handcrafted
              </span>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Authentic Northern Shea Skincare
              </h3>
              <p className="text-xs text-purple-200 line-clamp-2 sm:line-clamp-none">
                Grade-A unrefined whipped butters & natural African black soap made fresh in Ghana.
              </p>
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={() => handleTabChange('Shea Butter & Cosmetics')}
                  className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center text-xs font-bold bg-amber-400 text-purple-950 px-4 py-2 sm:py-2.5 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer shadow-md"
                >
                  View All Shea Items
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Grid showing all matching products */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 font-medium px-1 gap-1.5">
              <span>
                Showing <strong className="text-purple-950">{displayProducts.length}</strong> of{' '}
                <strong className="text-purple-950">{matchingProducts.length}</strong> items in{' '}
                <span className="text-[#581C87] font-bold">
                  {currentCategory === 'All' ? 'All Collections' : currentCategory}
                </span>
              </span>
              {currentCategory === 'All' && matchingProducts.length > 8 && (
                <button
                  onClick={() => setShowAllInView(!showAllInView)}
                  className="text-xs font-bold text-[#581C87] hover:underline cursor-pointer"
                >
                  {showAllInView ? 'Show Top 8 Only' : `View All ${matchingProducts.length} Products`}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Bottom Expansion Bar */}
            {currentCategory === 'All' && !showAllInView && matchingProducts.length > 8 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAllInView(true)}
                  className="px-6 py-2.5 bg-purple-50 hover:bg-[#581C87] hover:text-white text-[#581C87] text-xs font-bold rounded-xl border border-purple-200 transition-all cursor-pointer shadow-xs"
                >
                  Load All {matchingProducts.length} Products on Home Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
