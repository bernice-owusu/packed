import React from 'react';
import { ArrowRight } from 'lucide-react';
import { c8Banners } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const TripleBanners: React.FC = () => {
  const { setSelectedCategory, addToast } = useApp();

  const handleBannerClick = (index: number) => {
    const cats = ['Pharmacy & Drugs', 'Shea Butter & Cosmetics', 'Household & Sanitary'];
    const chosen = cats[index] || 'Shea Butter & Cosmetics';
    setSelectedCategory(chosen);
    document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    addToast(`Filtered by ${chosen}`);
  };

  return (
    <section className="py-6 bg-white">
      <div className="pls-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {c8Banners.map((banner, index) => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(index)}
              className="relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[220px] p-5 sm:p-7 flex flex-col justify-center cursor-pointer group shadow-sm border border-purple-100 hover:border-purple-300 transition-all duration-300 active:scale-[0.99]"
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-900/75 to-transparent max-w-xs" />

              {/* Content */}
              <div className="relative z-10 space-y-2 max-w-[210px] sm:max-w-[240px] text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {banner.subtitle}
                </span>

                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {banner.title}
                </h3>

                <div className="pt-1.5">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                    <span>{banner.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
