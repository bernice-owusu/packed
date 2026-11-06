import React, { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
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

export const Topbar: React.FC = () => {
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText("DOLYN10");
    setCopied(true);
    addToast("Coupon code DOLYN10 copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#3B0764] text-white text-[11px] sm:text-xs border-b border-white/10 relative z-40 select-none">
      <div className="pls-container px-2 sm:px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-1.5 py-1 sm:py-1.5">
        {/* Left: WhatsApp quick access (desktop only) */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="https://wa.me/233244149464?text=Hello%20Packed%20by%20Dolyn,%20I%20would%20like%20to%20inquire%20about%20your%20products"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline-block">WhatsApp:</span>
            <span className="font-medium">0244149464</span>
          </a>
        </div>

        {/* Center: Promo code */}
        <div className="flex items-center justify-center gap-1 w-full sm:w-auto order-none sm:order-none shrink-0">
          <span className="text-white/95 text-[9px] sm:text-[10px]">
            10% Off Your Purchase! Use Code:{" "}
          </span>
          <button
            onClick={copyCode}
            title="Click to copy code"
            className="inline-flex items-center space-x-1 font-bold text-white bg-[#581C87] hover:bg-[#6B21A8] px-2 py-0.5 rounded transition-colors cursor-pointer border border-purple-400/30"
          >
            <span className="font-bold text-[10px] sm:text-xs">DOLYN10</span>
            {copied ? (
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
            ) : (
              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70" />
            )}
          </button>
        </div>

        {/* Right: Socials (desktop only) */}
        <div className="hidden sm:flex items-center gap-1">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="TikTok"
          >
            <span className="text-[9px] sm:text-[10px] font-bold">TT</span>
          </a>
        </div>
      </div>
    </div>
  );
};
