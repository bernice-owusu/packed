import React from 'react';
import { partnerBrands } from '../../data/brandsData';
import { Award, ShieldCheck, Truck } from 'lucide-react';

export const BrandCarousel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  // Split the 55 brands into two rows for dual-direction continuous movement
  const row1 = partnerBrands.slice(0, 28);
  const row2 = partnerBrands.slice(28);

  if (compact) {
    return (
      <div className="py-4 bg-white border-y border-purple-100/70 overflow-hidden relative select-none">
        {/* Left and right gradient fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="pls-container mb-2 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Authorized Retailer & Wholesaler for 50+ Global Brands</span>
        </div>

        {/* Continuous Single-Track Moving Marquee */}
        <div className="flex overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-1">
            {[...partnerBrands, ...partnerBrands].map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                className="shrink-0 w-28 sm:w-36 h-14 sm:h-16 bg-white hover:bg-white rounded-xl border border-slate-200/80 hover:border-purple-300 p-2 sm:p-2.5 flex items-center justify-center transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <img
                  src={brand.image}
                  alt={`Partner Brand ${brand.id}`}
                  className="max-h-10 sm:max-h-12 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF7FB] via-white to-[#FAF7FB] border-y border-purple-100/80 overflow-hidden relative select-none">
      {/* Left and right gradient edge masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-[#FAF7FB] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-[#FAF7FB] to-transparent z-10" />

      <div className="pls-container mb-8 sm:mb-10 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#581C87] text-[11px] font-black uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-[#581C87]" />
          <span>Authentic Partner Brands & Suppliers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Over 50+ Trusted Global Brands We Work With
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          From internationally certified personal care, French & Arabian perfumery, to essential pharmaceutical health supplies — all 100% genuine and available for retail and bulk carton supply.
        </p>
      </div>

      {/* Track 1: Moving Right-to-Left (Continuously) */}
      <div className="flex overflow-hidden relative mb-4">
        <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-1">
          {[...row1, ...row1].map((brand, idx) => (
            <div
              key={`r1-${brand.id}-${idx}`}
              className="shrink-0 w-32 sm:w-44 h-16 sm:h-22 bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-3 sm:p-4 flex items-center justify-center transition-all duration-300 shadow-2xs hover:shadow-md group cursor-pointer hover:-translate-y-1"
            >
              <img
                src={brand.image}
                alt={`Partner Brand ${brand.id}`}
                className="max-h-12 sm:max-h-16 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Track 2: Moving Left-to-Right (Reverse Continuous) */}
      <div className="flex overflow-hidden relative">
        <div className="animate-marquee-reverse flex items-center gap-4 sm:gap-6 py-1">
          {[...row2, ...row2].map((brand, idx) => (
            <div
              key={`r2-${brand.id}-${idx}`}
              className="shrink-0 w-32 sm:w-44 h-16 sm:h-22 bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-3 sm:p-4 flex items-center justify-center transition-all duration-300 shadow-2xs hover:shadow-md group cursor-pointer hover:-translate-y-1"
            >
              <img
                src={brand.image}
                alt={`Partner Brand ${brand.id}`}
                className="max-h-12 sm:max-h-16 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Guarantee Banner */}
      <div className="pls-container mt-8 sm:mt-10">
        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Genuine Manufacturer Packaging</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Master Wholesale Cartons for Traders</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Nationwide Ghana Courier Dispatch</span>
          </div>
        </div>
      </div>
    </section>
  );
};
