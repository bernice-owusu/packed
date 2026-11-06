import React from 'react';
import { ShieldCheck, CreditCard, Award, CheckCircle } from 'lucide-react';

export const BrandCarousel: React.FC = () => {
  const partners = [
    { name: 'MTN Mobile Money', badge: 'MoMo Accepted' },
    { name: 'Telecel Cash', badge: 'Fast Transfer' },
    { name: 'AT Money', badge: 'Direct Wallet' },
    { name: 'Paystack Secured', badge: 'Visa & MasterCard' },
    { name: 'Pure Northern Shea', badge: '100% Organic Grade-A' },
    { name: 'Ghana Courier Network', badge: 'Nationwide Delivery' }
  ];

  return (
    <section className="py-6 sm:py-8 bg-purple-50/50 border-y border-purple-100">
      <div className="pls-container">
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-widest">
            Trusted Payment & Fulfillment Partners
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-center">
          {partners.map(p => (
            <div
              key={p.name}
              className="bg-white rounded-xl p-3 border border-purple-100 shadow-2xs flex flex-col items-center text-center hover:border-purple-300 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#581C87] mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#1D395F]">{p.name}</span>
              <span className="text-[10px] text-gray-500 font-medium">{p.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
