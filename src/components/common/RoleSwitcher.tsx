import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { ShieldCheck, Tractor, ShoppingCart, LogOut } from 'lucide-react';
import { UserAvatar } from '../ProduceArt';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, currentUser, logout } = useAuth();

  const roleDetails: Record<
    UserRole,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badgeClass: string;
    }
  > = {
    admin: {
      label: 'Admin',
      icon: ShieldCheck,
      badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25',
    },
    vendor: {
      label: 'Farmer / Vendor',
      icon: Tractor,
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    },
    customer: {
      label: 'Customer Area',
      icon: ShoppingCart,
      badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25',
    },
  };

  const currentRoleInfo = roleDetails[currentRole] || roleDetails.customer;
  const CurrentIcon = currentRoleInfo.icon;

  return (
    <div className="top-persona-bar bg-[var(--color-surface)] border-b border-[var(--color-border)] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 text-xs shadow-2xs">
      {/* Current Active User Profile */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <UserAvatar className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-emerald-300 dark:border-emerald-600" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#22c55e] rounded-full border-2 border-[var(--color-surface)]" />
        </div>
        <div className="min-w-0 truncate">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-[var(--color-text-main)] text-xs sm:text-sm truncate">{currentUser.name}</span>
            <span className="bg-[#ecfbf2] dark:bg-emerald-950/60 text-[#22c55e] border border-emerald-200/80 dark:border-emerald-800 font-bold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
              {currentUser.badge || currentUser.role.toUpperCase()}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] truncate hidden xs:block">
            Logged in as: <strong className="text-[var(--color-text-main)] capitalize">{currentRole}</strong>
            {currentUser.stallName ? ` • ${currentUser.stallName}` : ''}
          </p>
        </div>
      </div>

      {/* Role Display Badge & Sign Out Button */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 justify-end">
        {/* Dedicated Role Badge: Admin on admin, Farmer / Vendor on vendor, Customer Area on customer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${currentRoleInfo.badgeClass}`}>
          <CurrentIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{currentRoleInfo.label}</span>
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

