import React from 'react';
import { Truck, Smartphone, ShieldCheck, Gift } from 'lucide-react';

export const InfoBoxes: React.FC = () => {
  const items = [
    {
      title: 'Nationwide Delivery',
      desc: 'Same-day in Accra, express dispatch across Ghana',
      icon: <Truck className="w-5 h-5 text-[#581C87]" />
    },
    {
      title: 'Mobile Money & Cards',
      desc: 'Pay with MTN MoMo, Telecel, AT Money or Paystack',
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />
    },
    {
      title: '100% Authentic Quality',
      desc: 'Pure Grade-A raw shea, approved drugs & cosmetics',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />
    },
    {
      title: 'Custom Gift Packaging',
      desc: 'Tailored hampers, corporate branding & ribbons',
      icon: <Gift className="w-5 h-5 text-purple-600" />
    }
  ];

  return (
    <div className="bg-white border-t border-purple-100 py-8">
      <div className="pls-container">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2.5 sm:space-x-4 p-3 sm:p-4 rounded-xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-200 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 group-hover:bg-white flex items-center justify-center p-2 sm:p-2.5 shrink-0 border border-purple-100 transition-all shadow-xs">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#1D395F] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
