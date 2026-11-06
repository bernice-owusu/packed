import React, { useState } from 'react';
import { X, Truck, CheckCircle2, Clock, Search, MapPin, Package, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderTrackingModal: React.FC = () => {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, orders, currencySymbol } = useApp();
  const [orderQuery, setOrderQuery] = useState('DOLYN-GH-8291');
  const [searched, setSearched] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const foundOrder = orders.find(
    o =>
      o.id.toLowerCase() === orderQuery.trim().toLowerCase() ||
      o.trackingNumber.toLowerCase() === orderQuery.trim().toLowerCase() ||
      (orderQuery.length > 5 && o.customerPhone.includes(orderQuery.trim()))
  );

  const activeOrder = foundOrder || orders[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-5 sm:p-7 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOrderTrackingOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#581C87] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E0B36]">Guest Order Tracking</h3>
            <p className="text-xs text-gray-500">Track Ghana delivery status by Order ID or Phone</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. DOLYN-GH-8291) or Phone"
            value={orderQuery}
            onChange={e => {
              setOrderQuery(e.target.value);
              setSearched(true);
            }}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#581C87]"
          />
          <button
            onClick={() => setSearched(true)}
            className="px-5 py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track</span>
          </button>
        </div>

        {activeOrder ? (
          <div className="space-y-5">
            {/* Order status banner */}
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Current Status</span>
                <strong className="text-purple-900 font-extrabold flex items-center gap-1.5 mt-0.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {activeOrder.status}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block text-[11px]">Order & Tracking</span>
                <strong className="text-[#1E0B36] font-bold mt-0.5 block">{activeOrder.id}</strong>
                <span className="text-[10px] text-gray-500">{activeOrder.trackingNumber}</span>
              </div>
            </div>

            {/* Recipient & Destination Box */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#581C87] shrink-0" />
                <span className="font-semibold text-gray-800">{activeOrder.deliveryRegion}</span>
              </div>
              <p className="text-gray-600 pl-6 text-[11px]">{activeOrder.deliveryAddress}</p>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200 pl-6 text-[11px]">
                <span className="text-gray-500">Recipient: <strong>{activeOrder.customerName}</strong> ({activeOrder.customerPhone})</span>
                <span className="font-bold text-[#581C87]">{currencySymbol} {activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Timeline steps */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-100">
              {[
                { title: 'Order Placed & Payment Confirmed', desc: `Via ${activeOrder.paymentMethod} • Ref: ${activeOrder.id}`, done: true },
                { title: 'Hygiene Packaging & Quality Check', desc: 'Handcrafted items carefully packed at Dolyn Accra Hub', done: activeOrder.status !== 'New' },
                { title: 'Dispatched with Courier', desc: `Assigned for ${activeOrder.deliveryType} fulfillment`, done: activeOrder.status === 'Out for Delivery' || activeOrder.status === 'Delivered' },
                { title: 'Handed Over to Customer', desc: 'Signature / MoMo verification receipt generated', done: activeOrder.status === 'Delivered' }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.done
                        ? 'bg-[#581C87] text-white ring-4 ring-purple-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </span>
                  <div className="text-xs">
                    <h5 className={`font-bold ${step.done ? 'text-[#1E0B36]' : 'text-gray-400'}`}>
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href={`https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20would%20like%20an%20update%20on%20my%20order%20${activeOrder.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Dispatch Rider via WhatsApp (0244149464)</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-xs">
            No order found matching &quot;{orderQuery}&quot;. Please verify your Order ID or phone number.
          </div>
        )}
      </div>
    </div>
  );
};
