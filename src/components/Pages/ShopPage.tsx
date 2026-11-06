import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { categories } from '../../data/mockData';
import { ProductCard } from '../Products/ProductCard';
import { useApp } from '../../context/AppContext';

export const ShopPage: React.FC = () => {
  const { productList, selectedCategory, setSelectedCategory, searchQuery, currencySymbol, exchangeRate } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [onlyWholesale, setOnlyWholesale] = useState(false);
  const [onlyDrugs, setOnlyDrugs] = useState(false);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);

  const parsePrice = (p: any): number => {
    if (typeof p.numericPrice === 'number') return p.numericPrice;
    const num = p.price.match(/[\d\.]+/);
    return num ? parseFloat(num[0]) : 45.0;
  };

  const filtered = useMemo(() => {
    return productList.filter(p => {
      // Category filter with alias tolerance
      if (selectedCategory !== 'All') {
        const sel = selectedCategory.toLowerCase();
        const pCat = p.category.toLowerCase();
        const match =
          pCat.includes(sel) ||
          sel.includes(pCat) ||
          (sel.includes('gift') && pCat.includes('gift')) ||
          (sel.includes('pharmacy') && pCat.includes('pharmacy')) ||
          (sel.includes('shea') && pCat.includes('shea')) ||
          (sel.includes('fragrance') && pCat.includes('fragrance')) ||
          (sel.includes('perfume') && pCat.includes('perfume')) ||
          (sel.includes('sanitary') && pCat.includes('sanitary')) ||
          (sel.includes('flash') && pCat.includes('flash'));
        if (!match) return false;
      }
      // Search filter
      if (
        searchQuery.trim() &&
        !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      // Price filter
      const pVal = parsePrice(p);
      if (pVal > maxPrice) return false;

      // Filter flags
      if (onlyWholesale && !p.wholesaleBoxPrice) return false;
      if (onlyDrugs && !p.isDrugOrHealthcare) return false;
      if (onlyCustomizable && !p.isCustomizable) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return parsePrice(a) - parsePrice(b);
      if (sortBy === 'price-desc') return parsePrice(b) - parsePrice(a);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [productList, selectedCategory, searchQuery, maxPrice, onlyWholesale, onlyDrugs, onlyCustomizable, sortBy]);

  return (
    <div className="bg-[#FAF7FB] py-6 sm:py-10 min-h-screen">
      <div className="pls-container">
        {/* Breadcrumbs & Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 mb-6 border border-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
              <span
                onClick={() => setSelectedCategory('All')}
                className="hover:text-[#581C87] cursor-pointer"
              >
                Store Home
              </span>
              <span>/</span>
              <span className="text-[#581C87] font-semibold">Catalog</span>
              {selectedCategory !== 'All' && (
                <>
                  <span>/</span>
                  <span className="text-gray-800 font-bold">{selectedCategory}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E0B36]">
              {selectedCategory === 'All' ? 'All Packed by Dolyn Offerings' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {filtered.length} products • Handcrafted & Shipped from Accra, Ghana
            </p>
          </div>

          {/* Quick Category Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full sm:flex-wrap">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-[#581C87] text-white shadow-sm'
                  : 'bg-gray-100 text-[#1D395F] hover:bg-purple-100'
              }`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.title)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedCategory === c.title
                    ? 'bg-[#581C87] text-white shadow-sm'
                    : 'bg-gray-100 text-[#1D395F] hover:bg-purple-100'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-purple-100 shadow-sm">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center space-x-2 text-xs font-bold text-[#581C87] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Filters & Sort'}</span>
            </button>
            <span className="text-xs text-gray-500 font-semibold">{filtered.length} products</span>
          </div>

          {/* Sidebar Filters */}
          <div className={`space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-[#1E0B36] uppercase tracking-wider pb-2 border-b border-gray-100">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs font-medium">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`flex items-center justify-between w-full py-1.5 text-left hover:text-[#581C87] transition-colors cursor-pointer ${
                    selectedCategory === 'All' ? 'text-[#581C87] font-bold' : 'text-gray-600'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-gray-400">({productList.length})</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.title)}
                    className={`flex items-center justify-between w-full py-1.5 text-left hover:text-[#581C87] transition-colors cursor-pointer ${
                      selectedCategory === cat.title ? 'text-[#581C87] font-bold' : 'text-gray-600'
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span className="text-gray-400">({cat.count.replace(' Products', '')})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-[#1E0B36] uppercase tracking-wider pb-2 border-b border-gray-100">
                Max Price in Cedis
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="20"
                  max="1200"
                  step="20"
                  value={maxPrice}
                  onChange={e => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full accent-[#581C87] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>GH₵ 20</span>
                  <span className="text-[#581C87]">Up to GH₵ {maxPrice}</span>
                  <span>GH₵ 1,200</span>
                </div>
              </div>
            </div>

            {/* Special Filters */}
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-[#1E0B36] uppercase tracking-wider pb-2 border-b border-gray-100">
                Specific Offerings
              </h3>
              <div className="space-y-2.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-purple-900">
                  <input
                    type="checkbox"
                    checked={onlyWholesale}
                    onChange={e => setOnlyWholesale(e.target.checked)}
                    className="rounded text-[#581C87] focus:ring-[#581C87]"
                  />
                  <span>Wholesale Cartons Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-purple-900">
                  <input
                    type="checkbox"
                    checked={onlyCustomizable}
                    onChange={e => setOnlyCustomizable(e.target.checked)}
                    className="rounded text-[#581C87] focus:ring-[#581C87]"
                  />
                  <span>Customizable Gift Hampers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-blue-900 font-semibold">
                  <input
                    type="checkbox"
                    checked={onlyDrugs}
                    onChange={e => setOnlyDrugs(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Pharmacy & Essential Drugs (Rx)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Product Grid */}
          <div className="lg:col-span-3 space-y-5">
            {/* Sorting & View Controls */}
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-gray-500">
                Showing <strong className="text-gray-900">{filtered.length}</strong> items
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-purple-50/70 border border-purple-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#581C87] focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured Favorites</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-[#581C87] text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-[#581C87] text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                    title="Compact view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Render */}
            {filtered.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
                <h3 className="font-bold text-gray-800">No products match your current filters</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your price range or clearing category filters to explore more items.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setMaxPrice(1000);
                    setOnlyWholesale(false);
                    setOnlyDrugs(false);
                    setOnlyCustomizable(false);
                  }}
                  className="px-4 py-2 bg-[#581C87] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-[#4C1D95]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
