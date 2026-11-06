import React from 'react';
import { categories } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const TopCategories: React.FC = () => {
  const { selectedCategory, setSelectedCategory, addToast } = useApp();

  const handleCategoryClick = (title: string) => {
    setSelectedCategory(title);
    const el = document.getElementById('featured-products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    addToast(`Viewing category: ${title}`);
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="pls-container">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold tracking-wider text-purple-700 uppercase bg-purple-50 px-3 py-1 rounded-full">
            Featured Collections
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E0B36] tracking-tight mt-2">
            Explore Packed by Dolyn
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-normal max-w-lg mx-auto">
            From raw Grade-A Ghanaian shea butter & perfumes to custom event gift hampers, sanitary items, and verified pharmaceuticals.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.title;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.title)}
                className={`group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'border-[#581C87] bg-purple-50/70 shadow-md -translate-y-1'
                    : 'border-transparent hover:border-purple-200 hover:bg-purple-50/40 hover:-translate-y-1 hover:shadow-xs'
                }`}
              >
                {/* Round Thumbnail Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center mb-2 sm:mb-3 border-2 border-purple-200 group-hover:border-[#581C87] transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <img
                    src={cat.icon}
                    alt={cat.title}
                    className="w-full h-full object-cover transform group-hover:scale-115 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Category Title */}
                <h3 className="text-xs sm:text-sm font-bold text-[#1D395F] group-hover:text-[#581C87] transition-colors leading-tight">
                  {cat.title}
                </h3>

                {/* Product Count */}
                <span className="text-[11px] text-gray-500 mt-1 font-medium">
                  {cat.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
