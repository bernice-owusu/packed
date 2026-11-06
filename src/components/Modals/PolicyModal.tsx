import React, { useState } from 'react';
import { X, ShieldAlert, Truck, FileText, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PolicyModal: React.FC = () => {
  const { isPolicyModalOpen, setIsPolicyModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'returns' | 'delivery' | 'terms'>('returns');

  if (!isPolicyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#581C87]" />
            <h3 className="text-base font-bold text-[#1E0B36]">
              Store Policies & Terms
            </h3>
          </div>
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 text-xs font-bold bg-white">
          <button
            onClick={() => setActiveTab('returns')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'returns'
                ? 'border-b-2 border-[#581C87] text-[#581C87] bg-purple-50/40'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Returns & Cancellations</span>
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'delivery'
                ? 'border-b-2 border-[#581C87] text-[#581C87] bg-purple-50/40'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-b-2 border-[#581C87] text-[#581C87] bg-purple-50/40'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Terms & Privacy</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-xs text-gray-700 leading-relaxed space-y-4">
          {activeTab === 'returns' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-bold">
                ⚠️ Strict No-Returns / No-Refund Policy After Dispatch
              </div>
              <p>
                As outlined in the Packed by Dolyn client discovery agreement, <strong>customers are NOT allowed to cancel orders or request returns and refunds once an order has been prepared and dispatched.</strong>
              </p>
              <h4 className="font-bold text-[#1E0B36] pt-1">Reasons for Policy:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>
                  <strong>Hygiene & Sanitary Standards:</strong> Handcrafted shea butter, body creams, soaps, and sanitary cleaners cannot be restocked once handled or shipped.
                </li>
                <li>
                  <strong>Pharmaceutical & Drug Safety:</strong> Certified pharmaceuticals, syrups, and medical items cannot be accepted back under Ghanaian public health and safety protocols.
                </li>
                <li>
                  <strong>Customized Offerings:</strong> Gift packages, customized ribbons, monogrammed wedding keepsakes, and corporate hampers are personalized to specific client preferences and cannot be repurposed.
                </li>
              </ul>
              <h4 className="font-bold text-[#1E0B36] pt-1">Damages During Transit:</h4>
              <p>
                In the rare instance an item is physically damaged during courier transit, please notify Gwendolyn Barnie Boahen via WhatsApp on <strong>0244149464</strong> within 24 hours of delivery with photographic evidence for a free replacement.
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E0B36]">Nationwide Delivery Coverage in Ghana:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <h5 className="font-bold text-[#581C87]">Greater Accra (Same-Day Express)</h5>
                  <p className="text-[11px] text-gray-600 mt-1">Dispatched within 3–6 hours for orders placed before 2:00 PM. Fee: GH₵ 35.00.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <h5 className="font-bold text-[#581C87]">Greater Accra (Standard Next-Day)</h5>
                  <p className="text-[11px] text-gray-600 mt-1">Scheduled next-business-day delivery. Fee: GH₵ 25.00.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <h5 className="font-bold text-[#581C87]">Kumasi & Ashanti Region</h5>
                  <p className="text-[11px] text-gray-600 mt-1">24–48 hours delivery via VIP express parcel dispatch. Fee: GH₵ 45.00.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <h5 className="font-bold text-[#581C87]">Central, Western & Northern Regions</h5>
                  <p className="text-[11px] text-gray-600 mt-1">Cape Coast, Takoradi, Tamale, Sunyani, Koforidua. Fee: GH₵ 45.00 – GH₵ 60.00.</p>
                </div>
              </div>
              <h4 className="font-bold text-[#1E0B36] pt-2">Free Customer Pickup:</h4>
              <p>
                Customers in Accra may select <strong>Free Customer Pickup</strong> at the Packed by Dolyn Hub. You will receive an SMS and WhatsApp notification when your package is ready.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E0B36]">Terms & Conditions of Service:</h4>
              <p>
                By placing an order on Packed by Dolyn, you agree to these operational terms. All prices are listed in Ghana Cedis (GH₵) and include applicable packaging costs.
              </p>
              <h4 className="font-bold text-[#1E0B36] pt-1">Pre-Orders & Advance Payment:</h4>
              <p>
                Products marked as &quot;Pre-Order&quot; require payment in advance. Orders are scheduled for production and fulfillment upon payment confirmation.
              </p>
              <h4 className="font-bold text-[#1E0B36] pt-1">Privacy & Data Handling:</h4>
              <p>
                We respect your personal privacy. Customer recipient names, delivery addresses, and phone numbers are strictly used for courier fulfillment and order confirmation. We do not sell or distribute customer data.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="px-5 py-2 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
