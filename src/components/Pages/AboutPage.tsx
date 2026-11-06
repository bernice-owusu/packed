import React from 'react';
import { Gift, ShieldCheck, HeartHandshake, CheckCircle2, Phone, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FAF7FB] py-8 sm:py-14 min-h-screen">
      <div className="pls-container">
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 mb-10 border border-purple-100 shadow-md text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            About Packed by Dolyn
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1E0B36] mt-3 sm:mt-4 tracking-tight leading-tight">
            Packaging Excellence, Pure Shea Wellness & Event Celebrations in Ghana
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Packed by Dolyn is a registered Ghanaian company specializing in bespoke gift packaging, event management, premium Grade-A shea butter cosmetics, household sanitary essentials, and verified pharmaceuticals.
          </p>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-purple-100">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#581C87]">100%</span>
              <p className="text-xs text-gray-500 mt-0.5 font-semibold">Grade-A Raw Shea</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1E0B36]">16</span>
              <p className="text-xs text-gray-500 mt-0.5 font-semibold">Regions in Ghana Delivered</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#581C87]">Corporate</span>
              <p className="text-xs text-gray-500 mt-0.5 font-semibold">& Bridal Packages</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1E0B36]">0244149464</span>
              <p className="text-xs text-gray-500 mt-0.5 font-semibold">Direct Owner Hotline</p>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#581C87] flex items-center justify-center">
            </div>
            <h3 className="text-lg font-bold text-[#1E0B36]">Shea Butter & Cosmetics</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We source unrefined ivory and yellow shea nuts directly from women&apos;s farming cooperatives in Northern Ghana. Our whipped butters, glow oils, and black soaps preserve pure botanical nutrients for radiant skin.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E0B36]">Event Packaging & Hampers</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              From executive corporate gift hampers to personalized wedding keepsakes and bridal party favors, our packaging brings sophistication with royal purple ribbons, luxury boxes, and bespoke cards.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E0B36]">Pharmacy & Sanitary Essentials</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We provide essential over-the-counter pain relief, immune multivitamins, syrups, and hospital-grade sanitizing detergents, ensuring wholesome family wellness delivered right to your doorstep.
            </p>
          </div>
        </div>

        {/* Business Leadership Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#581C87] to-purple-900 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
            GB
          </div>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Business Owner & Founder</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E0B36]">
              Gwendolyn Barnie Boahen
            </h3>
            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              &quot;At Packed by Dolyn, our driving mission is delivering extraordinary value for money, convenience, and distinct packaging quality. Whether you need a single bottle of whipped lavender shea butter or 500 customized corporate gift hampers, we handle every detail with personal care.&quot;
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-gray-700 font-semibold">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#581C87]" /> 0244149464</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#581C87]" /> Accra, Ghana</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
