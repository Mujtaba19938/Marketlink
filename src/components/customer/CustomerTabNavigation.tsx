import React from 'react';
import {
  Package,
  Heart,
  Navigation,
  Bell,
} from 'lucide-react';

export type CustomerTabKey = 'orders' | 'favorites' | 'map' | 'notifs';

interface CustomerTabNavigationProps {
  activeTab: CustomerTabKey;
  onSelectTab: (tab: CustomerTabKey) => void;
  activeOrdersCount: number;
}

export const CustomerTabNavigation: React.FC<CustomerTabNavigationProps> = ({
  activeTab,
  onSelectTab,
  activeOrdersCount,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Pre-Orders & History</span>
          {activeOrdersCount > 0 && (
            <span className="bg-[#22c55e] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites & Preferences</span>
        </button>

        <button
          onClick={() => onSelectTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Pickup Route Navigation</span>
        </button>

        <button
          onClick={() => onSelectTab('notifs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notifs'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>
    </div>
  );
};
