import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { c6Banner } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const WideBanner: React.FC<{ onNavigateContact?: () => void }> = ({ onNavigateContact }) => {
  const { setSelectedCategory, addToast } = useApp();

  const handleClick = () => {
    setSelectedCategory('Gift Packaging & Hampers');
    document.getElementById('featured-products-section')?.scrollIntoView({ behavior: 'smooth' });
    addToast('Filtered by Gift Packaging & Hampers');
  };

  return (
    <section className="py-6 bg-white">
      <div className="pls-container">
        <div className="relative rounded-3xl overflow-hidden min-h-[210px] sm:min-h-[270px] md:min-h-[330px] p-5 sm:p-10 md:p-14 flex flex-col justify-center shadow-lg border border-purple-200">
          {/* Background Image */}
          <img
            src={c6Banner.image}
            alt={c6Banner.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-900/85 to-transparent max-w-2xl" />

          {/* Text Content */}
          <div className="relative z-10 space-y-3 max-w-lg text-white">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
              {c6Banner.subtitle}
            </span>

            <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {c6Banner.title}
            </h3>

            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-md">
              {c6Banner.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleClick}
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-purple-950 px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <span>Browse Gift Packaging</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="https://wa.me/233244149464?text=Hello%20Gwendolyn,%20I%20would%20like%20to%20request%20a%20quote%20for%20custom%20gift%20packaging/event%20hampers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer backdrop-blur-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp Custom Quote</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
