import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { ShieldCheck, Tractor, ShoppingCart, UserCheck, LogOut } from 'lucide-react';
import { UserAvatar } from '../ProduceArt';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setRole, currentUser, logout } = useAuth();

  const rolesConfig: {
    role: UserRole;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      role: 'admin',
      label: 'Admin Dashboard',
      description: 'Platform Oversight, Moderation & Markets',
      icon: ShieldCheck,
    },
    {
      role: 'vendor',
      label: 'Farmer / Vendor',
      description: 'Stall Fulfillment, Catalog & Sales',
      icon: Tractor,
    },
    {
      role: 'customer',
      label: 'Customer Area',
      description: 'Pre-Orders, Pickup Map & Favorites',
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="top-persona-bar bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
      {/* Current Active Persona Chip */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <UserAvatar className="w-8 h-8 rounded-full border border-emerald-300" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">{currentUser.name}</span>
              <span className="bg-[#ecfbf2] text-[#22c55e] border border-emerald-200/80 font-bold text-[10px] px-2 py-0.5 rounded-full">
                {currentUser.badge || currentUser.role.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active Persona: <strong className="text-slate-700 capitalize">{currentRole}</strong>
              {currentUser.stallName ? ` • ${currentUser.stallName}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Pill Role Switcher Navigation & Sign Out */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <div className="flex items-center bg-[#f4f6f8] p-1 rounded-xl border border-slate-200/60 overflow-x-auto no-scrollbar">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setRole(item.role)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#22c55e] text-white shadow-sm shadow-emerald-500/20 font-bold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {isActive && <UserCheck className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Sign Out Button to return to SRS Role Login */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition cursor-pointer shrink-0"
          title="Sign out and return to role login portal"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

