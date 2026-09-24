import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import { Search, Mail, Bell } from 'lucide-react';

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const { currentRole } = useAuth();
  const { customerNotifications } = useMarketData();
  const [mailOpen, setMailOpen] = useState(false);

  const unreadCount = customerNotifications.filter((n) => !n.read).length;

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 sm:px-8 border-b border-slate-100 bg-white">
      {/* Title matching screenshot */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#22c55e]">
          Welcome to Market
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium hidden sm:block">
          {currentRole === 'admin'
            ? 'Superadmin governance, farmer approvals & markets'
            : currentRole === 'vendor'
            ? 'Produce stall inventory, pre-orders & analytics'
            : 'Organic harvest pre-orders & direct stall pickup'}
        </p>
      </div>

      {/* Right controls matching screenshot */}
      <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-44 sm:w-60 pl-10 pr-4 py-2 bg-[#f4f6f8] text-sm text-slate-800 rounded-xl border border-transparent focus:border-emerald-300 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Mail Icon */}
        <div className="relative">
          <button
            onClick={() => setMailOpen(!mailOpen)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            title="Messages"
            aria-label="Messages"
          >
            <Mail className="w-5 h-5" />
          </button>
          {mailOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-bold text-slate-800 mb-2">Recent Messages & Alerts</div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2.5 bg-[#ecfbf2] rounded-xl border border-emerald-100">
                  <div className="font-bold text-emerald-800">Fresh Farm Direct</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Saturday morning harvest allocation confirmed. Pickup begins at 7:30 AM.
                  </div>
                </div>
                <div className="p-2.5 hover:bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                  <div className="font-semibold text-slate-800">Pavilion Maintenance</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Gate 2 curbside loading bay open for pre-orders.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition relative cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
