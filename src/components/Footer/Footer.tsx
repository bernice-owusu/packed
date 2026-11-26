import React from "react";
import logoWhite from "../../assets/logo_white.png";
import { Phone, MapPin, Mail, Clock, MessageCircle } from "lucide-react";
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
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      ry="5"
      stroke="currentColor"
      strokeWidth="2"
    />
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

const TikTokIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
      fill="currentColor"
    />
  </svg>
);

export const Footer: React.FC<{
  onNavigatePage?: (page: string) => void;
}> = ({ onNavigatePage }) => {
  const { setIsPolicyModalOpen, siteContent } = useApp();
  const contact = siteContent.contact;

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
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hello Packed by Dolyn, I have an inquiry regarding custom gift packaging/bulk orders")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({contact.phone})</span>
            </a>
            <a
              href={`tel:${contact.phone}`}
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
            <div className="flex items-center gap-2">
              <img
                src={logoWhite}
                alt="Packed by Dolyn Logo"
                className="h-16 sm:h-20 w-auto object-contain shrink-0"
              />
            </div>

            <p className="text-purple-200/80 leading-relaxed text-xs">
              Registered Ghanaian enterprise dedicated to pure shea butter
              products, handcrafted cosmetics, custom event gift packaging,
              household sanitary supplies, and essential pharmaceuticals.
            </p>
          </div>

          {/* Col 2: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-purple-200">
              Contact Us
            </h4>
            <div className="space-y-3 text-purple-200/90">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Call & WhatsApp:{" "}
                  <strong className="text-white">{contact.phone}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Email: <strong className="text-white">{contact.email}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Hub: {contact.addressShort || "Accra, Ghana"} (
                  {contact.addressNote || "Nationwide Courier Dispatch"})
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-purple-200">
              Customer Support & Policy
            </h4>
            <ul className="space-y-2.5 text-purple-200/80">
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
                href="https://www.instagram.com/pack.edproducts?cnvx=N3d1cmFsMXVhdjcw"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center text-white transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/14u1rfSsbTW/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center text-white transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@packedbydolyn1"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center text-white transition-colors"
                title="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/70 gap-3">
          <p className="text-center sm:text-left">
            © 2026 Packed by Dolyn. Registered in Ghana. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
