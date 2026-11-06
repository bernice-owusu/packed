import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, CheckCircle, MapPin, Truck, Smartphone, CreditCard, Calendar, Clock, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { deliveryRates } from '../../data/mockData';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    currencySymbol,
    createOrder,
    setActiveReceiptOrder,
    addToast
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');

  // Guest details tailored for Ghana
  const [guestName, setGuestName] = useState('Abena Osei');
  const [guestPhone, setGuestPhone] = useState('0244123456');
  const [guestEmail, setGuestEmail] = useState('abena.osei@gmail.com');
  const [deliveryRegion, setDeliveryRegion] = useState('Greater Accra (Same-day Express)');
  const [deliveryAddress, setGuestAddress] = useState('Plot 8, Boundary Road, East Legon, Accra');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('Afternoon (1:00 PM - 5:00 PM)');
  const [customGiftNote, setCustomGiftNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MTN MoMo' | 'Telecel Cash' | 'AT Money' | 'Card (Paystack)'>('MTN MoMo');
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  if (!isCartOpen) return null;

  const currentRate = deliveryRates.find(r => r.region === deliveryRegion) || deliveryRates[0];
  const deliveryFee = currentRate ? currentRate.fee : 35;
  const grandTotal = cartTotal + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  const handlePlaceOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!guestName || !guestPhone || !deliveryAddress) {
      addToast('Please complete name, phone, and address', 'warning');
      return;
    }

    const order = createOrder({
      customerName: guestName,
      customerPhone: guestPhone,
      customerEmail: guestEmail,
      deliveryRegion: currentRate.region,
      deliveryAddress,
      deliveryType: deliveryRegion.includes('Same-day')
        ? 'Same-day'
        : deliveryRegion.includes('Pickup')
        ? 'Customer Pickup'
        : deliveryRegion.includes('Standard')
        ? 'Scheduled'
        : 'Express',
      preferredDeliveryDate: preferredDate,
      preferredDeliveryTime: preferredTime,
      deliveryFee,
      paymentMethod,
      momoNumber: paymentMethod.includes('MoMo') || paymentMethod.includes('Telecel') || paymentMethod.includes('AT') ? momoNumber : undefined,
      paymentStatus: 'Paid',
      items: [...cart],
      subtotal: cartTotal + discount,
      discount,
      total: grandTotal,
      status: 'Confirmed',
      customNotes: customGiftNote
    });

    setCreatedOrder(order);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    setCheckoutStep('success');
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#581C87]" />
            <h3 className="text-base font-bold text-[#1E0B36]">
              {checkoutStep === 'details' ? 'Guest Checkout (No Account Needed)' : checkoutStep === 'success' ? 'Order Confirmed!' : 'Your Shopping Bag'}
            </h3>
            {checkoutStep === 'cart' && (
              <span className="bg-purple-100 text-[#581C87] text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((c, i) => c + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {checkoutStep === 'success' && createdOrder ? (
          /* Checkout Completed View */
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-[#1E0B36]">Medaase! Order Received</h4>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
              Your guest order <strong className="text-[#581C87]">{createdOrder.id}</strong> has been registered. A payment confirmation SMS/email is sent to <strong>{createdOrder.customerPhone}</strong>.
            </p>

            {/* Quick Summary Card */}
            <div className="w-full bg-purple-50/70 p-4 rounded-2xl text-left border border-purple-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Order Number:</span>
                <span className="font-bold text-[#1E0B36]">{createdOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Tracking Number:</span>
                <span className="font-bold text-[#581C87]">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Method:</span>
                <span className="font-bold text-emerald-700">{createdOrder.paymentMethod} (Paid)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Delivery:</span>
                <span className="font-bold text-[#1E0B36]">{createdOrder.deliveryRegion}</span>
              </div>
              <div className="flex justify-between border-t border-purple-200/60 pt-2 font-bold text-sm">
                <span>Total Paid:</span>
                <span className="text-[#581C87]">{currencySymbol} {createdOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Electronic Receipt Button */}
            <div className="w-full pt-2 space-y-2">
              <button
                onClick={() => {
                  setActiveReceiptOrder(createdOrder);
                  handleClose();
                }}
                className="w-full py-3 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>View & Print Electronic Receipt</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : checkoutStep === 'details' ? (
          /* Step 2: Guest Checkout Details Form */
          <form onSubmit={handlePlaceOrder} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs pb-16 sm:pb-8">
            <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-100 text-purple-950 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#581C87] shrink-0" />
              <div>
                <p className="font-bold">Instant Guest Checkout</p>
                <p className="text-[11px] text-purple-800">No account or password needed to complete purchase.</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1E0B36] uppercase tracking-wider text-[11px]">
                1. Recipient Information
              </h4>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                  placeholder="e.g. Abena Osei"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Phone Number (MoMo) *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={e => {
                      setGuestPhone(e.target.value);
                      setMomoNumber(e.target.value);
                    }}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                    placeholder="0244..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Email (for Receipt) *</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                    placeholder="you@gmail.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Destination & Date */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="font-bold text-[#1E0B36] uppercase tracking-wider text-[11px]">
                2. Delivery in Ghana
              </h4>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Delivery Region / Destination *</label>
                <select
                  value={deliveryRegion}
                  onChange={e => setDeliveryRegion(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs font-medium"
                >
                  {deliveryRates.map(r => (
                    <option key={r.id} value={r.region}>
                      {r.region} - {r.fee === 0 ? 'FREE' : `GH₵ ${r.fee.toFixed(2)}`} ({r.time})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Street Address / Landmark *</label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={e => setGuestAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                  placeholder="House number, Street name, Digital Address (e.g. GA-183-9201), Area, Accra"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Preferred Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs"
                  >
                    <option>Morning (9:00 AM - 12:00 PM)</option>
                    <option>Afternoon (1:00 PM - 5:00 PM)</option>
                    <option>Evening Express (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Customization Note (Ribbon Color / Card Message)
                </label>
                <input
                  type="text"
                  value={customGiftNote}
                  onChange={e => setCustomGiftNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs"
                  placeholder="e.g. Royal Purple ribbon, write 'Happy Birthday Kofi' on note card"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="font-bold text-[#1E0B36] uppercase tracking-wider text-[11px]">
                3. Payment Method
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'MTN MoMo', label: 'MTN MoMo', icon: <Smartphone className="w-4 h-4 text-amber-500" /> },
                  { id: 'Telecel Cash', label: 'Telecel Cash', icon: <Smartphone className="w-4 h-4 text-rose-500" /> },
                  { id: 'AT Money', label: 'AT Money', icon: <Smartphone className="w-4 h-4 text-blue-500" /> },
                  { id: 'Card (Paystack)', label: 'Card (Paystack)', icon: <CreditCard className="w-4 h-4 text-emerald-500" /> }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === p.id
                        ? 'border-[#581C87] bg-purple-50 font-bold text-[#581C87]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {p.icon}
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod !== 'Card (Paystack)' && (
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <label className="block text-[10.5px] font-bold text-amber-900 mb-1">
                    Enter {paymentMethod} Number:
                  </label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={e => setMomoNumber(e.target.value)}
                    className="w-full p-2 rounded border border-amber-300 bg-white text-xs font-bold"
                    placeholder="e.g. 0244123456"
                  />
                  <p className="text-[10px] text-amber-800 mt-1">
                    An authorization prompt will be pushed directly to your phone. Approve with your 4-digit PIN.
                  </p>
                </div>
              )}
            </div>

            {/* Total Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{currencySymbol} {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery ({currentRate.region.split('(')[0]}):</span>
                <span>{deliveryFee === 0 ? 'FREE' : `${currencySymbol} ${deliveryFee.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount:</span>
                  <span>-{currencySymbol} {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#1E0B36] pt-1 border-t border-gray-200">
                <span>Grand Total:</span>
                <span className="text-[#581C87]">{currencySymbol} {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit & Back buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                <span>Authorize & Complete Guest Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-xs cursor-pointer text-center"
              >
                ← Back to Cart
              </button>
            </div>
          </form>
        ) : (
          /* Step 1: Standard Cart View */
          <>
            {cart.length === 0 ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-300 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[#1E0B36]">Your Shopping Bag is Empty</h4>
                <p className="text-xs text-gray-400 max-w-xs">
                  Discover our pure Northern Ghana shea butter, fine fragrances, custom gift hampers, and essential health items.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Item List */}
                <div className="divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.isWholesaleBox}`} className="py-3.5 flex items-start space-x-3 group">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-xl bg-purple-50 shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-[#1D395F] leading-tight line-clamp-2">
                            {item.isWholesaleBox ? `Wholesale Box: ${item.product.title}` : item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-gray-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedSize && (
                          <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                            Size: {item.selectedSize}
                          </span>
                        )}

                        {item.customizationNote && (
                          <span className="text-[10px] text-gray-500 italic block mt-0.5">
                            Note: {item.customizationNote}
                          </span>
                        )}

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#581C87] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center text-[#1D395F]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#581C87] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-extrabold text-[#1E0B36]">
                            {currencySymbol}{' '}
                            {(
                              (item.isWholesaleBox && item.product.wholesaleBoxPrice
                                ? parseFloat(item.product.wholesaleBoxPrice.match(/[\d\.]+/)?.[0] || '400')
                                : (item.product.numericPrice || 45)) * item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Promo code (DOLYN10)"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#581C87]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-50 hover:bg-[#581C87] text-[#581C87] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg mt-2">
                      <span>10% discount ({appliedCoupon})</span>
                      <button onClick={removeCoupon} className="font-bold hover:underline cursor-pointer">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-purple-100 bg-purple-50/30 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{currencySymbol} {cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount:</span>
                      <span>-{currencySymbol} {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-[#1E0B36] pt-1 border-t border-purple-100">
                    <span>Estimated Total:</span>
                    <span className="text-[#581C87]">{currencySymbol} {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('details')}
                  className="w-full py-3.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <span>Proceed to Guest Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-gray-500">
                  🔒 Fast & secure guest checkout via Paystack / Mobile Money
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
