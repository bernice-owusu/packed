import React, { useState } from 'react';
import { Calendar, User, Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { blogPosts } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const BlogPage: React.FC = () => {
  const { openArticleModal } = useApp();
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');

  const blogCategories = ['All', 'Skincare Wisdom', 'Gifting & Events', 'Health & Pharmacy', 'Fragrance Tips'];

  const filtered = blogPosts.filter(p => {
    if (filterCat !== 'All' && p.category !== filterCat) return false;
    if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#FAF7FB] py-8 sm:py-12 min-h-screen">
      <div className="pls-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            Dolyn Journal & Advice
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E0B36] mt-2.5 tracking-tight">
            Health, Beauty & Gifting Insights
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Practical guides on raw Ghanaian shea butter, fragrance layering, corporate gifting, and home healthcare.
          </p>

          {/* Search bar & filter pills */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & guides..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#581C87]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    filterCat === cat
                      ? 'bg-[#581C87] text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(post => (
            <article
              key={post.id}
              onClick={() => openArticleModal(post)}
              className="group bg-white rounded-2xl overflow-hidden border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-purple-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-[#581C87] text-white text-[9.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center space-x-3 text-[11px] text-gray-400 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-purple-900">
                      <User className="w-3 h-3 text-[#581C87]" />
                      {post.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#1D395F] group-hover:text-[#581C87] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {post.snippet}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#581C87] group-hover:text-purple-700 transition-colors">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
