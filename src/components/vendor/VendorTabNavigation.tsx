import React from 'react';
import {
  PackageCheck,
  Package,
  Store,
  Star,
  TrendingUp,
} from 'lucide-react';

export type VendorTabKey = 'fulfillment' | 'catalog' | 'stall' | 'reviews' | 'insights';

interface VendorTabNavigationProps {
  activeTab: VendorTabKey;
  onSelectTab: (tab: VendorTabKey) => void;
}

export const VendorTabNavigation: React.FC<VendorTabNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectTab('fulfillment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'fulfillment'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Pre-Order Fulfillment</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Weekly Stock & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('stall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stall'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Stall & GPS Map Profile</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Customer Reviews & Responses</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'insights'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Order History & Insights (SRS)</span>
        </button>
      </div>
    </div>
  );
};
