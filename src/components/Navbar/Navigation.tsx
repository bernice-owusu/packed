import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronRight, Truck, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/mockData';

export const Navigation: React.FC<{
  activeLayout: string;
  setActiveLayout: (l: string) => void;
}> = ({ activeLayout, setActiveLayout }) => {
  const {
    setSelectedCategory,
    setIsOrderTrackingOpen,
    setIsPolicyModalOpen,
    addToast
  } = useApp();

  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const navCategories = [
    { title: 'Shea Butter & Cosmetics', badge: 'Organic', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { title: 'Perfumes & Fragrances', badge: 'Popular', badgeColor: 'bg-purple-100 text-purple-800' },
    { title: 'Gift Packaging & Hampers', badge: 'Custom', badgeColor: 'bg-amber-100 text-amber-800' },
    { title: 'Household & Sanitary', badge: null, badgeColor: '' },
    { title: 'Pharmacy & Drugs', badge: 'Essential', badgeColor: 'bg-blue-100 text-blue-800' },
    { title: 'Flash Deals & Specials', badge: 'Sale', badgeColor: 'bg-rose-100 text-rose-800' }
  ];

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setCategoriesOpen(false);
    if (activeLayout !== 'home2' && activeLayout !== 'shop') {
      setActiveLayout('shop');
    } else {
      const target = document.getElementById('featured-products-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
    addToast(`Filtered by ${catName}`);
  };

  return (
    <div className="hidden md:block bg-white border-b border-[#E4E4E4] relative z-20 text-[#1D395F] font-medium text-[13px] shadow-xs">
      <div className="pls-container flex items-center justify-between h-[50px] sm:h-[54px] overflow-x-auto no-scrollbar">
        {/* Left: Shop By Categories Button */}
        <div className="relative shrink-0">
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex items-center justify-between w-44 sm:w-56 lg:w-60 bg-[#581C87] hover:bg-[#4C1D95] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors cursor-pointer select-none font-semibold text-xs sm:text-sm shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />
              <span className="truncate">All Categories</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Categories Dropdown */}
          {categoriesOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#E4E4E4] rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
              {navCategories.map(cat => (
                <button
                  key={cat.title}
                  onClick={() => handleCategorySelect(cat.title)}
                  className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-purple-50 hover:text-[#581C87] text-left transition-colors cursor-pointer text-xs font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <span className="truncate">{cat.title}</span>
                    {cat.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Streamlined Navigation Links */}
        <nav className="flex items-center space-x-3 sm:space-x-5 lg:space-x-7 shrink-0 pl-2 sm:pl-4">
          {/* Home */}
          <button
            onClick={() => {
              setActiveLayout('home2');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-[#581C87] transition-colors py-2 text-xs sm:text-sm cursor-pointer font-medium ${
              activeLayout === 'home2' ? 'text-[#581C87] font-bold border-b-2 border-[#581C87]' : ''
            }`}
          >
            Home
          </button>

          {/* Shop */}
          <button
            onClick={() => {
              setActiveLayout('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-[#581C87] transition-colors py-2 text-xs sm:text-sm cursor-pointer font-medium ${
              activeLayout === 'shop' ? 'text-[#581C87] font-bold border-b-2 border-[#581C87]' : ''
            }`}
          >
            Shop
          </button>

          {/* Gift Hampers */}
          <button
            onClick={() => {
              setSelectedCategory('Gift Packaging & Hampers');
              setActiveLayout('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#581C87] transition-colors py-2 text-xs sm:text-sm cursor-pointer font-medium whitespace-nowrap"
          >
            Gift Hampers
          </button>

          {/* Pharmacy & Health */}
          <button
            onClick={() => {
              setSelectedCategory('Pharmacy & Drugs');
              setActiveLayout('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-[#581C87] transition-colors py-2 text-xs sm:text-sm cursor-pointer font-medium flex items-center gap-1 text-blue-900 whitespace-nowrap"
          >
            <span>Pharmacy</span>
            <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded">Rx</span>
          </button>

          {/* About Us */}
          <button
            onClick={() => {
              setActiveLayout('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-[#581C87] transition-colors py-2 text-xs sm:text-sm cursor-pointer font-medium hidden md:inline-block ${
              activeLayout === 'about' ? 'text-[#581C87] font-bold border-b-2 border-[#581C87]' : ''
            }`}
          >
            About
          </button>

          {/* Contact Us */}
          <button
            onClick={() => {
              setActiveLayout('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hover:text-[#581C87] transition-colors py-2 text-xs sm:text-sm cursor-pointer font-medium hidden md:inline-block ${
              activeLayout === 'contact' ? 'text-[#581C87] font-bold border-b-2 border-[#581C87]' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right: Quick Direct WhatsApp Callout */}
        <div className="hidden lg:flex items-center text-xs text-[#1D395F] shrink-0">
          <a
            href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20have%20an%20inquiry%20regarding%20products/orders"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-800 transition-colors font-semibold"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp 0244149464</span>
          </a>
        </div>
      </div>
    </div>
  );
};
