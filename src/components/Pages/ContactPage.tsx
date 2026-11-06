import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { dolynFAQs } from '../../data/mockData';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [inquiryType, setInquiryType] = useState('Custom Event Gift Hampers');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    addToast('Thank you! Your inquiry has been forwarded directly to Gwendolyn.', 'success');
  };

  return (
    <div className="bg-[#FAF7FB] py-8 sm:py-14 min-h-screen">
      <div className="pls-container">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            Get in Touch
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E0B36] mt-2.5 tracking-tight">
            Contact Packed by Dolyn
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Have questions about customized event hampers, bulk wholesale cartons, or pharmacy orders? Reach out directly.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#581C87] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E0B36]">Phone & WhatsApp</h4>
                <a href="tel:0244149464" className="text-xs font-bold text-[#581C87] hover:underline mt-1 block">
                  0244149464
                </a>
                <p className="text-[11px] text-gray-500 mt-0.5">Primary Contact: Gwendolyn Barnie Boahen</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E0B36]">WhatsApp Concierge</h4>
                <a
                  href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:underline mt-1 block"
                >
                  Chat: +233 24 414 9464
                </a>
                <p className="text-[11px] text-gray-500 mt-0.5">Direct response for custom gifts & bulk</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#581C87] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E0B36]">Official Email</h4>
                <a href="mailto:gbbyaa@gmail.com" className="text-xs font-bold text-[#581C87] hover:underline mt-1 block">
                  gbbyaa@gmail.com
                </a>
                <p className="text-[11px] text-gray-500 mt-0.5">Corporate quotations & collaborations</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#581C87] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E0B36]">Fulfillment Hub</h4>
                <p className="text-xs text-gray-600 mt-1">Accra, Greater Accra Region, Ghana</p>
                <p className="text-[11px] text-purple-700 font-semibold mt-0.5">Nationwide Courier Shipping</p>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl border border-purple-100 shadow-md">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1E0B36]">Inquiry Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name || 'Valued Customer'}</strong>. Gwendolyn Barnie Boahen has received your request and will reach out via WhatsApp / phone on <strong>{phone || 'your phone number'}</strong> shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 bg-[#581C87] text-white rounded-xl text-xs font-bold hover:bg-[#4C1D95] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1E0B36]">Send Us an Inquiry</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    For corporate gifting, bridal party packages, or bulk box purchases.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Inquiry Purpose</label>
                  <select
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs font-semibold"
                  >
                    <option>Custom Event Gift Hampers & Keepsakes</option>
                    <option>Corporate Branding & Executive Gift Boxes</option>
                    <option>Bulk Wholesale Carton Purchase</option>
                    <option>Shea Butter & Handcrafted Cosmetics Inquiry</option>
                    <option>Pharmacy & Essential Drugs Delivery</option>
                    <option>General Collaboration & Partnership</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Kwesi Frimpong"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0244..."
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Details & Preferences *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Please specify estimated quantity, preferred ribbon color (e.g. royal purple), event date, and recipient location..."
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#581C87] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#581C87] hover:bg-[#4C1D95] text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Send Message to Gwendolyn</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl font-extrabold text-[#1E0B36] mt-2">
              Common Questions About Shopping with Dolyn
            </h2>
          </div>

          <div className="space-y-3">
            {dolynFAQs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-purple-100 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#1E0B36] flex items-center justify-between hover:bg-purple-50/50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#581C87] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-purple-50 pt-2 bg-purple-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
