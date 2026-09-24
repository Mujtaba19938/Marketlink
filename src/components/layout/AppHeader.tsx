import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import { useTheme } from '../../theme';
import { Search, Mail, Bell, Sun, Moon, Palette, Check, LogOut } from 'lucide-react';


interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const { currentRole, logout } = useAuth();
  const { customerNotifications } = useMarketData();
  const { mode, resolvedMode, palette, setPalette, toggleMode, availablePalettes } = useTheme();
  const [mailOpen, setMailOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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
      <div className="flex items-center gap-2.5 sm:gap-3.5 self-end sm:self-auto">
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

        {/* Quick Light/Dark Mode Switcher */}
        <button
          onClick={toggleMode}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          title={`Switch to ${resolvedMode === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle theme mode"
        >
          {resolvedMode === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Quick Palette Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer flex items-center gap-1"
            title="Choose Color Palette"
            aria-label="Choose Color Palette"
          >
            <Palette className="w-5 h-5 text-[#22c55e]" />
          </button>

          {paletteOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-bold text-slate-800 mb-2 px-1 flex items-center justify-between">
                <span>Color Theme</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{resolvedMode}</span>
              </div>
              <div className="space-y-1">
                {availablePalettes.map((p) => {
                  const isSelected = palette === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPalette(p.id);
                        setPaletteOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isSelected ? 'bg-slate-100/90 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full overflow-hidden flex border border-black/10 shrink-0">
                          <div className="w-1/2 h-full" style={{ backgroundColor: p.swatch.dark }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: p.swatch.light }} />
                        </div>
                        <span className="truncate">{p.name.split('&')[0]}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition cursor-pointer"
          title="Sign Out to Role Login Portal"
          aria-label="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
