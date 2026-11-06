import React from "react";
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" />
  </svg>
);

const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      fill="currentColor"
    />
  </svg>
);

export const Footer: React.FC<{
  onNavigatePage?: (page: string) => void;
}> = ({ onNavigatePage }) => {
  const { setIsOrderTrackingOpen, setIsPolicyModalOpen } = useApp();

  const handleLink = (page: string) => {
    if (onNavigatePage) {
      onNavigatePage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      id="footer-section"
      className="bg-[#1E0B36] text-white pt-10 pb-8 border-t border-purple-900/60"
    >
      <div className="pls-container">
        {/* WhatsApp Concierge Banner (Replaces standard generic newsletter) */}
        <div className="bg-gradient-to-r from-[#3B0764] via-[#581C87] to-[#3B0764] rounded-2xl p-6 sm:p-8 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-purple-400/30 shadow-xl">
          <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                <span>Personalized Packaging & Collaborations</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Need Custom Event Hampers or Bulk Wholesale?
            </h3>
            <p className="text-xs sm:text-sm text-purple-100">
              Speak directly with Gwendolyn Barnie Boahen for custom branding,
              wedding souvenirs, and corporate bulk box orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20have%20an%20inquiry%20regarding%20custom%20gift%20packaging/bulk%20orders"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (0244149464)</span>
            </a>
            <a
              href="tel:0244149464"
              className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-purple-200" />
              <span>Call Direct</span>
            </a>
          </div>
        </div>

        {/* 4 Column Links & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-purple-900/40 text-xs">
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4">
            <img
              src="/src/assets/logo.png"
              alt="Packed by Dolyn Logo"
              className="h-10 sm:h-12 w-auto object-contain shrink-0"
            />

            <p className="text-purple-200/80 leading-relaxed text-xs">
              Registered Ghanaian enterprise dedicated to pure shea butter
              products, handcrafted cosmetics, custom event gift packaging,
              household sanitary supplies, and essential pharmaceuticals.
            </p>

            <div className="space-y-2 text-purple-200/90">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Call & WhatsApp:{" "}
                  <strong className="text-white">0244149464</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Email:{" "}
                  <strong className="text-white">gbbyaa@gmail.com</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Hub: Accra, Ghana (Nationwide Courier Dispatch)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-purple-200">
              Product Categories
            </h4>
            <ul className="space-y-2.5 text-purple-200/80">
              <li>
                <button
                  onClick={() => handleLink("shop")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Shea Butter & Natural Cosmetics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("shop")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Vanilla Oud & Body Splashes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("shop")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Custom Event & Corporate Hampers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("shop")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Household & Sanitary Cleaners
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("shop")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer font-semibold text-blue-200"
                >
                  Pharmacy & Essential Drugs (Rx)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("shop")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Flash Promos & Special Bundles
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-purple-200">
              Customer Support & Policy
            </h4>
            <ul className="space-y-2.5 text-purple-200/80">
              <li>
                <button
                  onClick={() => setIsOrderTrackingOpen(true)}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-amber-300" />
                  <span>Track Guest Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("about")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  About Packed by Dolyn
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("contact")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Contact Us & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("blog")}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Health & Gifting Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Delivery & Returns Policy (No Return Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="hover:text-amber-200 transition-colors text-left cursor-pointer"
                >
                  Terms of Service & Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments & Administration */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-purple-200">
              Payments & Social
            </h4>
            <p className="text-purple-200/80 leading-relaxed text-xs">
              Secure payments powered by Paystack. We accept all Ghanaian Mobile
              Money wallets (MTN MoMo, Telecel Cash, AT Money) and debit/credit
              cards.
            </p>

            {/* Social media icons */}
            <div className="flex items-center space-x-2.5 pt-1">
              <a
                href="https://wa.me/233244149464"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
                title="WhatsApp Business"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center text-white transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center text-white transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Payment Gateways */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/70 gap-3">
          <p className="text-center sm:text-left">
            © 2026 Packed by Dolyn. Registered in Ghana. All Rights Reserved.
            Managed by Gwendolyn Barnie Boahen.
          </p>
        </div>
      </div>
    </footer>
  );
};
