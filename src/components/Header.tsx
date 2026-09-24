import React, { useState } from 'react';
import { Search, Mail, Bell, ChevronDown, Check, User, LogOut } from 'lucide-react';
import { UserAvatar } from './ProduceArt';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  unreadCount = 2,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 sm:px-8 border-b border-slate-100 bg-white">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#22c55e]">
        Welcome to Market
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-5 self-end sm:self-auto">
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
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition"
            title="Messages"
            aria-label="Messages"
          >
            <Mail className="w-5 h-5" />
          </button>
          {mailOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-semibold text-slate-500 mb-2">Recent Messages</div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-slate-800">Fresh Farm Direct</div>
                  <div>Weekly harvest delivery scheduled tomorrow at 7:00 AM.</div>
                </div>
                <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div className="font-semibold text-slate-800">Wholesale Organics</div>
                  <div>Invoice #4829 confirmed and paid.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 pl-1.5 rounded-full hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            <UserAvatar className="w-8 h-8" />
            <span className="text-sm font-semibold text-slate-700 hidden md:inline">
              Angie Howell
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Angie Howell</p>
                <p className="text-[11px] text-slate-400 truncate">Store Manager</p>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Store Preferences</span>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
