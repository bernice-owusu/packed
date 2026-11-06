import React from 'react';
import { X, Printer, CheckCircle2, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ElectronicReceiptModal: React.FC = () => {
  const { activeReceiptOrder, setActiveReceiptOrder, currencySymbol } = useApp();

  if (!activeReceiptOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top actions */}
        <div className="p-4 bg-purple-950 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Official Electronic Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setActiveReceiptOrder(null)}
              className="p-1 rounded-full text-white/70 hover:text-white cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#1D395F]" id="printable-receipt">
          {/* Header */}
          <div className="text-center pb-4 border-b border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#581C87] flex items-center justify-center text-white">
              </div>
              <h2 className="text-xl font-black text-[#1E0B36] tracking-tight">
                PACKED BY DOLYN
              </h2>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              Registered Packaging, Event Management, Cosmetics & Pharmacy
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Accra, Ghana • Phone: 0244149464 • Email: gbbyaa@gmail.com
            </p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 bg-purple-50/60 p-4 rounded-xl border border-purple-100 text-[11px]">
            <div>
              <span className="text-gray-500 block">Receipt / Order No:</span>
              <strong className="text-purple-950 text-xs font-black">{activeReceiptOrder.id}</strong>
              <span className="text-gray-500 block mt-1">Date & Time:</span>
              <strong className="text-gray-800">{activeReceiptOrder.createdAt}</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block">Payment Method:</span>
              <strong className="text-emerald-700 font-extrabold">{activeReceiptOrder.paymentMethod}</strong>
              <span className="text-gray-500 block mt-1">Status:</span>
              <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                {activeReceiptOrder.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Destination */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1 text-[11px]">
            <span className="font-bold text-[#1E0B36] block">Customer & Delivery:</span>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold text-gray-900">{activeReceiptOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-semibold text-gray-900">{activeReceiptOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Region:</span>
              <span className="font-semibold text-gray-900">{activeReceiptOrder.deliveryRegion}</span>
            </div>
            <div className="pt-1 text-gray-600">
              Address: <span className="font-medium text-gray-800">{activeReceiptOrder.deliveryAddress}</span>
            </div>
            {activeOrderScheduledSlot(activeReceiptOrder) && (
              <div className="pt-1 text-purple-900 font-semibold">
                Scheduled Slot: {activeReceiptOrder.preferredDeliveryDate} ({activeReceiptOrder.preferredDeliveryTime})
              </div>
            )}
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-[#1E0B36] mb-2 uppercase text-[10.5px] tracking-wider">
              Purchased Items
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
              <div className="bg-gray-100 px-3 py-2 flex justify-between font-bold text-[11px] text-gray-700">
                <span className="flex-1">Description</span>
                <span className="w-12 text-center">Qty</span>
                <span className="w-20 text-right">Amount</span>
              </div>
              {activeReceiptOrder.items.map((item: any, i: number) => {
                const itemPrice = item.isWholesaleBox && item.product.wholesaleBoxPrice
                  ? parseFloat(item.product.wholesaleBoxPrice.match(/[\d\.]+/)?.[0] || '400')
                  : (item.product.numericPrice || 45);
                return (
                  <div key={i} className="px-3 py-2.5 flex justify-between items-center text-[11px]">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-gray-900 leading-tight">
                        {item.isWholesaleBox ? `Wholesale Box: ${item.product.title}` : item.product.title}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[10px] text-purple-700">Size: {item.selectedSize}</p>
                      )}
                      {item.customizationNote && (
                        <p className="text-[10px] text-gray-500 italic">Note: {item.customizationNote}</p>
                      )}
                    </div>
                    <span className="w-12 text-center text-gray-700 font-semibold">{item.quantity}</span>
                    <span className="w-20 text-right font-extrabold text-[#1E0B36]">
                      {currencySymbol} {(itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-2 border-t border-gray-200 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>{currencySymbol} {activeReceiptOrder.subtotal.toFixed(2)}</span>
            </div>
            {activeReceiptOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied:</span>
                <span>-{currencySymbol} {activeReceiptOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee ({activeReceiptOrder.deliveryType}):</span>
              <span>{activeReceiptOrder.deliveryFee === 0 ? 'FREE' : `${currencySymbol} ${activeReceiptOrder.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-[#1E0B36] pt-1.5 border-t border-gray-200">
              <span>Grand Total:</span>
              <span className="text-[#581C87]">{currencySymbol} {activeReceiptOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Policy footer */}
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[10px] text-gray-500 text-center leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#581C87] inline mr-1" />
            <span>
              This serves as an authentic electronic proof of purchase for Packed by Dolyn. In compliance with Ghanaian sanitary standards, items are non-refundable once dispatched. For inquiries, contact 0244149464.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function activeOrderScheduledSlot(o: any) {
  return o && o.preferredDeliveryDate && o.preferredDeliveryTime;
}
