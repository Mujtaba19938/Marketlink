import React from 'react';
import {
  Package,
  Heart,
  Navigation,
  Bell,
  Store,
} from 'lucide-react';

export type CustomerTabKey = 'market' | 'orders' | 'markets' | 'favorites' | 'map' | 'notifs';

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
    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectTab('market')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'market'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Market & Produce</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Pre-Orders & History</span>
          {activeOrdersCount > 0 && (
            <span className="bg-[var(--color-primary)] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeOrdersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('markets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'markets'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Browse Markets & Farmers</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites & Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Pickup Route Navigation</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('notifs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notifs'
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>
    </div>
  );
};
