import React from 'react';
import { Home, Grid, ShoppingBag, Truck, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomBar: React.FC<{
  activeLayout: string;
  setActiveLayout: (l: string) => void;
  onOpenMobileMenu: () => void;
}> = ({ activeLayout, setActiveLayout, onOpenMobileMenu }) => {
  const { cartCount, setIsCartOpen, setIsOrderTrackingOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-xl px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around select-none">
      {/* Home */}
      <button
        onClick={() => {
          setActiveLayout('home2');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation ${
          activeLayout === 'home2' ? 'text-[#581C87]' : 'text-gray-500 hover:text-[#581C87]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Home</span>
      </button>

      {/* Shop / Catalog */}
      <button
        onClick={() => {
          setActiveLayout('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
          activeLayout === 'shop' ? 'text-[#581C87]' : 'text-gray-500 hover:text-[#581C87]'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Shop</span>
      </button>

      {/* Categories Menu */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center p-1.5 text-gray-500 hover:text-[#581C87] transition-colors cursor-pointer"
      >
        <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#581C87] flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Menu</span>
      </button>

      {/* WhatsApp Help */}
      <a
        href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20would%20like%20to%20order"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center justify-center p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
      </a>

      {/* Cart with badge */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center p-1.5 text-gray-500 hover:text-[#581C87] transition-colors cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-2 bg-[#581C87] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-semibold mt-0.5">Bag</span>
      </button>

      {/* Order Tracking */}
      <button
        onClick={() => setIsOrderTrackingOpen(true)}
        className="flex flex-col items-center justify-center p-1.5 text-gray-500 hover:text-[#581C87] transition-colors cursor-pointer"
      >
        <Truck className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Track</span>
      </button>
    </div>
  );
};
