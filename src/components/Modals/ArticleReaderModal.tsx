import React from 'react';
import { X, Calendar, User, Share2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ArticleReaderModal: React.FC = () => {
  const { selectedArticle, closeArticleModal, addToast } = useApp();

  if (!selectedArticle) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Article link copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeArticleModal}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto">
          {/* Cover image */}
          <div className="relative aspect-[16/9] w-full bg-purple-50">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#581C87] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {selectedArticle.category}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-bold text-purple-900">
                <User className="w-3.5 h-3.5 text-[#581C87]" />
                {selectedArticle.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedArticle.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.readTime || '4 min read'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E0B36] leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed whitespace-pre-line pt-2 border-t border-purple-100">
              {selectedArticle.content}
            </div>

            <div className="pt-6 border-t border-purple-100 flex items-center justify-between">
              <span className="text-xs text-purple-900 font-semibold">Packed by Dolyn Journal</span>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 text-xs font-bold text-[#581C87] hover:underline cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
