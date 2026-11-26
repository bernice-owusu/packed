import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSlide } from '../../types';

export const HeroSlider: React.FC<{ onNavigateShop?: () => void }> = ({ onNavigateShop }) => {
  const { siteContent } = useApp();
  const { heroSlides, contact } = siteContent;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isPaused || heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, heroSlides.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
    touchStart.current = null;
  };

  const handleAction = (slide: HeroSlide) => {
    const link = slide.buttonLink?.trim();
    if (!link || link === '/shop' || link === 'shop') {
      if (onNavigateShop) {
        onNavigateShop();
      } else {
        const el = document.getElementById('featured-products-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (link.startsWith('#')) {
      document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = link;
  };

  if (heroSlides.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-b from-purple-50/60 to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="pls-container py-2.5 sm:py-5">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[340px] xs:min-h-[380px] sm:min-h-[440px] md:min-h-[480px] shadow-lg border border-purple-100 touch-pan-y">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
                  style={{
                    backgroundImage: `url(${slide.image})`
                  }}
                />

                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-purple-950/95 via-purple-900/85 to-purple-950/50 sm:to-transparent sm:max-w-2xl" />

                {/* Content */}
                <div className="relative h-full flex items-center z-10 px-5 sm:px-12 md:px-14 max-w-xl text-white">
                  <div className="space-y-3 sm:space-y-4 py-6 sm:py-8">
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-200 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-purple-300/30">
                      <span>{slide.tag || 'Packed by Dolyn • Ghana'}</span>
                    </div>

                    <h1 className="text-[22px] xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.15] tracking-tight line-clamp-3 sm:line-clamp-none">
                      {slide.title}
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-purple-100/90 font-normal leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none">
                      {slide.description}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <button
                        onClick={() => handleAction(slide)}
                        className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-purple-950 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <a
                        href={`https://wa.me/${contact.whatsapp}?text=Hello%20Packed%20by%20Dolyn,%20I%20would%20like%20to%20order`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer backdrop-blur-xs"
                      >
                        <span>WhatsApp Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows (Visible on Tablets & Desktops) */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-purple-950 shadow-lg items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-purple-950 shadow-lg items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
