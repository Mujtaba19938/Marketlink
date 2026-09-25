import React from 'react';
import {
  LayoutGrid,
  PackageCheck,
  Package,
  Store,
  Star,
  TrendingUp,
} from 'lucide-react';

export type VendorTabKey = 'market' | 'fulfillment' | 'catalog' | 'stall' | 'reviews' | 'insights';

interface VendorTabNavigationProps {
  activeTab: VendorTabKey;
  onSelectTab: (tab: VendorTabKey) => void;
}

export const VendorTabNavigation: React.FC<VendorTabNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="border-b border-[var(--color-border)] pb-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <button
          type="button"
          onClick={() => onSelectTab('market')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === 'market'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Market & Stall Overview</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('fulfillment')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
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
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Order History & Insights</span>
        </button>
      </div>
    </div>
  );
};
