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

export const Topbar: React.FC<{
  onNavigatePage?: (page: string) => void;
}> = ({ onNavigatePage }) => {
  const { addToast, siteContent } = useApp();
  const contact = siteContent.contact;
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText("DOLYN10");
    setCopied(true);
    addToast("Coupon code DOLYN10 copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#059669] text-white text-[11px] sm:text-xs border-b border-white/10 relative z-40 select-none">
      <div className="pls-container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-1.5 py-1.5 sm:py-1.5">
        {/* Left: WhatsApp quick access (desktop only) */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hello Packed by Dolyn, I would like to inquire about your products")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 text-white hover:text-white/80 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline-block">WhatsApp:</span>
            <span className="font-medium">{contact.phone}</span>
          </a>
        </div>

        {/* Center: Promo code */}
        <div className="flex items-center justify-center gap-1 w-full sm:w-auto order-none sm:order-none shrink-0">
          <span className="text-white/95 text-[10px] sm:text-[10px]">
            10% Off Your Purchase! Use Code:{" "}
          </span>
          <button
            onClick={copyCode}
            title="Click to copy code"
            className="inline-flex items-center space-x-1 font-bold text-white bg-[#047857] hover:bg-[#065F46] px-2 py-0.5 rounded transition-colors cursor-pointer border border-emerald-400/30"
          >
            <span className="font-bold text-[10px] sm:text-xs">DOLYN10</span>
            {copied ? (
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
            ) : (
              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70" />
            )}
          </button>
        </div>

        {/* Right: Socials & Owner Portal link */}
        <div className="hidden sm:flex items-center gap-1.5">
          <a
            href="https://www.instagram.com/pack.edproducts?cnvx=N3d1cmFsMXVhdjcw"
            target="_blank"
            rel="noreferrer"
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
          <a
            href="https://www.facebook.com/share/14u1rfSsbTW/"
            target="_blank"
            rel="noreferrer"
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
          <a
            href="https://www.tiktok.com/@packedbydolyn1"
            target="_blank"
            rel="noreferrer"
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            aria-label="TikTok"
          >
            <TikTokIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
