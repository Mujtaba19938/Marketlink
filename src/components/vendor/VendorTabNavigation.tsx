import React from 'react';
import {
  PackageCheck,
  Package,
  Store,
  Star,
} from 'lucide-react';

export type VendorTabKey = 'fulfillment' | 'catalog' | 'stall' | 'reviews';

interface VendorTabNavigationProps {
  activeTab: VendorTabKey;
  onSelectTab: (tab: VendorTabKey) => void;
}

export const VendorTabNavigation: React.FC<VendorTabNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectTab('fulfillment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'fulfillment'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Pre-Order Fulfillment</span>
        </button>

        <button
          onClick={() => onSelectTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory & Catalog Manager</span>
        </button>

        <button
          onClick={() => onSelectTab('stall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stall'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Stall & GPS Map Settings</span>
        </button>

        <button
          onClick={() => onSelectTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Customer Review Center</span>
        </button>
      </div>
    </div>
  );
};
