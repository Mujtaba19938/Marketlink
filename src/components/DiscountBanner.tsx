import React, { useState } from 'react';
import { Sparkles, Check, Copy, X } from 'lucide-react';

interface DiscountBannerProps {
  onApplyDiscount?: () => void;
}

export const DiscountBanner: React.FC<DiscountBannerProps> = ({ onApplyDiscount }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const couponCode = 'VEGGIE45';

  const handleCopy = () => {
    navigator.clipboard?.writeText(couponCode);
    setCopied(true);
    if (onApplyDiscount) onApplyDiscount();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="hero-banner relative overflow-hidden bg-[#22c55e] rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Soft background glow accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-white">
            Get special discounts<br className="hidden sm:inline" /> up to 45%
          </h2>
          <p className="mt-2 text-sm text-white/90 font-medium">
            Enjoy our vegetables at a discount price
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="hero-cta-btn w-full sm:w-auto px-6 py-2.5 bg-white text-slate-800 hover:bg-slate-50 font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-95 preserve-white cursor-pointer"
          >
            Use Now
          </button>
        </div>
      </div>

      {/* Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22c55e] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">45% Special Harvest Discount</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apply this voucher at checkout to redeem 45% off on all organic fresh vegetables and produce.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-dashed border-emerald-300 flex items-center justify-between">
              <span className="font-mono font-bold text-base text-emerald-700 tracking-wider">
                {couponCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Applied!' : 'Copy Code'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Back to Market
            </button>
          </div>
        </div>
      )}
    </>
  );
};
