import React from 'react';
import { Sparkles } from 'lucide-react';

interface VendorHeroBannerProps {
  stallName: string;
  onReviewOrders: () => void;
}

export const VendorHeroBanner: React.FC<VendorHeroBannerProps> = ({
  stallName,
  onReviewOrders,
}) => {
  return (
    <div className="hero-banner relative overflow-hidden bg-[#22c55e] rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>{stallName} • Active Stall</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-white">
          Weekend Harvest Pre-Orders<br className="hidden sm:inline" /> Open for Customers
        </h2>
        <p className="mt-1 text-sm text-white/90 font-medium">
          Pre-order cut-off is Friday at 8:00 PM for Saturday morning market pickup.
        </p>
      </div>

      <div className="relative z-10 shrink-0">
        <button
          onClick={onReviewOrders}
          className="hero-cta-btn w-full sm:w-auto px-6 py-2.5 bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer preserve-white"
        >
          Review Orders
        </button>
      </div>
    </div>
  );
};
