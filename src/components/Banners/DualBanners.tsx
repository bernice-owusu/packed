import React from 'react';
import { ArrowRight } from 'lucide-react';
import { c4Banners } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const DualBanners: React.FC = () => {
  const { setSelectedCategory, addToast } = useApp();

  const handleBannerClick = (index: number) => {
    const category = index === 0 ? 'Perfumes & Fragrances' : 'Shea Butter & Cosmetics';
    setSelectedCategory(category);
    document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    addToast(`Filtered by ${category}`);
  };

  return (
    <section className="py-6 bg-white">
      <div className="pls-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {c4Banners.map((banner, index) => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(index)}
              className="relative rounded-2xl overflow-hidden min-h-[190px] sm:min-h-[250px] p-5 sm:p-8 md:p-10 flex flex-col justify-center cursor-pointer group shadow-md border border-purple-100 hover:border-purple-300 transition-all duration-300 active:scale-[0.99]"
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-900/75 to-transparent max-w-lg" />

              {/* Text content */}
              <div className="relative z-10 space-y-2 max-w-xs sm:max-w-sm text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                  {banner.subtitle}
                </span>

                <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
                  {banner.title}
                </h3>

                <p className="text-xs text-purple-200 line-clamp-2">
                  {banner.description}
                </p>

                <div className="pt-2">
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
