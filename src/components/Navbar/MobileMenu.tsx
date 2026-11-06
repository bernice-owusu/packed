import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { X, ChevronRight, ShoppingBag, Truck, Info, PhoneCall, MessageCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/mockData';

export const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activeLayout: string;
  setActiveLayout: (l: string) => void;
}> = ({ isOpen, onClose, activeLayout, setActiveLayout }) => {
  const {
    setSelectedCategory,
    setIsCartOpen,
    setIsOrderTrackingOpen,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');

  if (!isOpen) return null;

  const handleCategorySelect = (title: string) => {
    setSelectedCategory(title);
    onClose();
    if (activeLayout !== 'home2' && activeLayout !== 'shop') {
      setActiveLayout('shop');
    } else {
      const el = document.getElementById('featured-products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    addToast(`Filtered by ${title}`);
  };

  const handleNavigate = (page: string) => {
    setActiveLayout(page);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div>
          {/* Top Bar with Brand and Close button */}
          <div className="bg-[#1E0B36] text-white p-4 flex items-center justify-between border-b border-purple-900/50">
            <img src={logo} alt="Packed by Dolyn Logo" className="h-10 sm:h-12 w-auto object-contain shrink-0" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close Mobile Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation / Categories tab buttons */}
          <div className="flex border-b border-gray-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'menu'
                  ? 'border-b-2 border-[#581C87] text-[#581C87] bg-purple-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Main Menu
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'border-b-2 border-[#581C87] text-[#581C87] bg-purple-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'menu' ? (
            <div className="p-4 space-y-1 text-xs font-medium text-[#1D395F]">
              {/* Home */}
              <button
                onClick={() => handleNavigate('home2')}
                className={`flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer ${
                  activeLayout === 'home2' ? 'text-[#581C87] font-bold bg-purple-50' : 'text-gray-700'
                }`}
              >
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Shop */}
              <button
                onClick={() => handleNavigate('shop')}
                className={`flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer ${
                  activeLayout === 'shop' ? 'text-[#581C87] font-bold bg-purple-50' : 'text-gray-700'
                }`}
              >
                <span>Shop Catalog</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Gift Packaging & Hampers */}
              <button
                onClick={() => {
                  setSelectedCategory('Gift Packaging & Hampers');
                  handleNavigate('shop');
                }}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer text-[#581C87] font-semibold"
              >
                <span>Gift Hampers</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Pharmacy & Drugs */}
              <button
                onClick={() => {
                  setSelectedCategory('Pharmacy & Drugs');
                  handleNavigate('shop');
                }}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer text-blue-900 font-semibold"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Pharmacy & Essential Drugs</span>
                  <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded">Rx</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* About Us */}
              <button
                onClick={() => handleNavigate('about')}
                className={`flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer ${
                  activeLayout === 'about' ? 'text-[#581C87] font-bold bg-purple-50' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-[#581C87]" />
                  <span>About Dolyn</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNavigate('contact')}
                className={`flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer ${
                  activeLayout === 'contact' ? 'text-[#581C87] font-bold bg-purple-50' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-[#581C87]" />
                  <span>Contact</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Order Tracking */}
              <button
                onClick={() => {
                  onClose();
                  setIsOrderTrackingOpen(true);
                }}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-gray-700 text-left cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#581C87]" />
                  <span>Track Guest Order</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.title)}
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-purple-50 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <img src={cat.icon} alt={cat.title} className="w-6 h-6 object-cover rounded-md" />
                    <span className="font-semibold text-[#1D395F]">{cat.title}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 bg-purple-50/40 space-y-2">
          <button
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            className="w-full py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Bag & Guest Checkout</span>
          </button>

          <a
            href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20have%20an%20order%20inquiry"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Order: 0244149464</span>
          </a>
        </div>
      </div>
    </div>
  );
};
