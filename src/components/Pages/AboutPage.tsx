import React from 'react';
import { Gift, ShieldCheck, HeartHandshake, Phone, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutPage: React.FC = () => {
  const { siteContent } = useApp();
  const { about, contact } = siteContent;

  const pillarIcons = [
    <Sparkles key="shea" className="w-6 h-6 text-[#581C87]" />,
    <Gift key="gift" className="w-6 h-6 text-amber-700" />,
    <ShieldCheck key="pharma" className="w-6 h-6 text-blue-700" />,
    <HeartHandshake key="community" className="w-6 h-6 text-emerald-700" />
  ];

  return (
    <div className="bg-[#FAF7FB] py-8 sm:py-14 min-h-screen">
      <div className="pls-container">
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 mb-10 border border-purple-100 shadow-md text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            {about.badge || 'About Packed by Dolyn'}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1E0B36] mt-3 sm:mt-4 tracking-tight leading-tight">
            {about.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            {about.intro}
          </p>

          {/* Key Stat Cards */}
          {about.stats && about.stats.length > 0 && (
            <div className={`grid grid-cols-2 md:grid-cols-${Math.min(about.stats.length, 4)} gap-4 mt-8 pt-8 border-t border-purple-100`}>
              {about.stats.map((stat, idx) => (
                <div key={idx}>
                  <span className={`text-2xl sm:text-3xl font-extrabold ${idx % 2 === 0 ? 'text-[#581C87]' : 'text-[#1E0B36]'}`}>
                    {stat.value}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Core Pillars */}
        {about.pillars && about.pillars.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(about.pillars.length, 3)} gap-6 mb-12`}>
            {about.pillars.map((pillar, idx) => {
              const bgColors = [
                'bg-purple-100 text-[#581C87]',
                'bg-amber-100 text-amber-800',
                'bg-blue-100 text-blue-800',
                'bg-emerald-100 text-emerald-800'
              ];
              const icon = pillarIcons[idx % pillarIcons.length];
              return (
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-sm space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColors[idx % bgColors.length]}`}>
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E0B36]">{pillar.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Business Leadership Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#581C87] to-purple-900 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
            {about.founderInitials || 'GB'}
          </div>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              {about.founderLabel || 'Business Owner & Founder'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E0B36]">
              {about.founderName || contact.primaryContactName}
            </h3>
            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              &quot;{about.founderQuote}&quot;
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-gray-700 font-semibold">
              <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-[#581C87] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#581C87]" />
                <span>{contact.phone}</span>
              </a>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#581C87]" />
                <span>{contact.addressShort || 'Accra, Ghana'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
