import React from 'react';
import {
  BarChart3,
  Tractor,
  Users,
  Store,
  ShieldAlert,
  Sliders,
} from 'lucide-react';

export type AdminTabKey = 'analytics' | 'farmers' | 'customers' | 'markets' | 'moderation' | 'config';

interface AdminTabNavigationProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  pendingFarmersCount: number;
  moderationItemsCount: number;
}

export const AdminTabNavigation: React.FC<AdminTabNavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingFarmersCount,
  moderationItemsCount,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reports & Analytics</span>
        </button>

        <button
          onClick={() => onSelectTab('farmers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'farmers'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Tractor className="w-4 h-4" />
          <span>Farmer Approvals</span>
          {pendingFarmersCount > 0 && (
            <span className="bg-[#22c55e] text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {pendingFarmersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('customers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Accounts</span>
        </button>

        <button
          onClick={() => onSelectTab('markets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'markets'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Market Locations</span>
        </button>

        <button
          onClick={() => onSelectTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Content Moderation</span>
          {moderationItemsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {moderationItemsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>System Configuration</span>
        </button>
      </div>
    </div>
  );
};
