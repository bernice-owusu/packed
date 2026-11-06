import React, { useState } from "react";
import logo from "../../assets/logo.png";
import {
  Search,
  Phone,
  ShoppingBag,
  ChevronDown,
  PackageCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { categories } from "../../data/mockData";

export const Header: React.FC<{
  onToggleMobileMenu?: () => void;
  onLogoClick?: () => void;
}> = ({ onToggleMobileMenu, onLogoClick }) => {
  const {
    cartCount,
    cartTotal,
    setIsCartOpen,
    setIsOrderTrackingOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currencySymbol,
  } = useApp();

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.getElementById("featured-products-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-[#1E0B36] text-white py-3.5 sm:py-4 relative z-30 shadow-md border-b border-purple-900/40">
      <div className="pls-container flex items-center justify-between gap-3 sm:gap-4 lg:gap-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-white hover:text-purple-200 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onLogoClick) onLogoClick();
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src={logo}
              alt="Packed by Dolyn Logo"
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
            />
          </a>
        </div>

        {/* Central Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full bg-white rounded-full overflow-visible border-2 border-transparent focus-within:border-[#7E22CE] transition-all shadow-md relative text-[#1D395F]"
          >
            {/* Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#1D395F] hover:text-[#6B21A8] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span className="truncate max-w-[130px]">
                  {selectedCategory === "All"
                    ? "All Categories"
                    : selectedCategory}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50 text-xs font-normal animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-purple-50 hover:text-[#6B21A8] transition-colors ${
                      selectedCategory === "All"
                        ? "text-[#6B21A8] font-bold bg-purple-50"
                        : ""
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.title);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-purple-50 hover:text-[#6B21A8] transition-colors ${
                        selectedCategory === c.title
                          ? "text-[#6B21A8] font-bold bg-purple-50"
                          : ""
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-gray-200"></div>

            {/* Input */}
            <input
              type="text"
              placeholder="Search shea butter, gift hampers, perfumes, pharmacy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 text-xs text-[#1D395F] placeholder-gray-400 focus:outline-none bg-transparent"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-[#6B21A8] hover:bg-[#581C87] text-white px-5 py-2.5 rounded-full m-1 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Action Icons & Support */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* Direct Support Helpline */}
          <div className="hidden xl:flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-white">
              <Phone className="w-4 h-4 text-amber-200" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10.5px] text-purple-200/80 font-normal leading-tight">
                Order Line:
              </span>
              <a
                href="tel:0244149464"
                className="text-xs font-bold text-white hover:text-amber-200 transition-colors"
              >
                0244149464
              </a>
            </div>
          </div>

          <div className="hidden xl:block h-7 w-[1px] bg-white/15"></div>

          {/* Track Order Button (Desktop & Tablet) */}
          <button
            onClick={() => setIsOrderTrackingOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer transition-all active:scale-95"
            title="Track Guest Order"
          >
            <PackageCheck className="w-4 h-4 text-purple-200" />
            <span>Track Order</span>
          </button>

          {/* Cart with GH₵ Value */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 sm:space-x-2.5 bg-[#6B21A8] hover:bg-[#581C87] text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all shadow-md group cursor-pointer border border-purple-400/30 active:scale-95 touch-manipulation"
            aria-label="Shopping Cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-purple-950 text-[10px] sm:text-[10.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9.5px] sm:text-[10px] text-purple-200 font-medium leading-none">
                Bag
              </span>
              <span className="text-xs font-bold text-white leading-tight mt-0.5">
                {currencySymbol} {cartTotal.toFixed(2)}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 mt-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white rounded-full overflow-hidden p-1 shadow"
        >
          <input
            type="text"
            placeholder="Search products, hampers, drugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-xs text-[#1D395F] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#6B21A8] text-white p-2 rounded-full flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
};
