import React from 'react';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { blogPosts } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const BlogSection: React.FC<{ onNavigateBlog?: () => void }> = ({ onNavigateBlog }) => {
  const { openArticleModal } = useApp();

  return (
    <section id="blog-section" className="py-8 md:py-14 bg-white scroll-mt-20">
      <div className="pls-container">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-purple-100 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 uppercase bg-purple-50 px-2.5 py-0.5 rounded-md mb-1.5">
              <BookOpen className="w-3 h-3 text-[#581C87]" />
              <span>Dolyn Wellness & Gifting Journal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E0B36] tracking-tight">
              Health, Beauty & Gifting Insights
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              Expert advice on shea butter skincare, corporate hamper etiquette, fragrance longevity, and home pharmacy.
            </p>
          </div>
          {onNavigateBlog && (
            <button
              onClick={onNavigateBlog}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#581C87] hover:text-purple-700 transition-colors group cursor-pointer"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* 4 Blog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map(post => (
            <article
              key={post.id}
              onClick={() => openArticleModal(post)}
              className="group bg-white rounded-2xl overflow-hidden border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Thumbnail image with zoom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-purple-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-[#581C87] text-white text-[9.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    {post.category}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-4 sm:p-5">
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

                  <h3 className="text-xs sm:text-sm font-bold text-[#1D395F] group-hover:text-[#581C87] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {post.snippet}
                  </p>
                </div>
              </div>

              {/* Read more button link */}
              <div className="px-4 sm:px-5 pb-5 pt-0">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#581C87] group-hover:text-purple-700 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
