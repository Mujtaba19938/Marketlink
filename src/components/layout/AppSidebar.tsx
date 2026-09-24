import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import {
  LayoutGrid,
  Shapes,
  ClipboardList,
  Heart,
  ShoppingCart,
  MessageSquare,
  Smile,
  CircleHelp,
  Settings,
  Tractor,
  Users,
  Store,
  ShieldAlert,
  Sliders,
  PackageCheck,
  TrendingUp,
  Package,
  Star,
  Navigation,
  Bell,
  LogOut,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface AppSidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { currentRole, setRole, logout } = useAuth();
  const { vendorOrders, customerOrders, moderationItems, farmers, customerNotifications } = useMarketData();

  const pendingOrdersCount = vendorOrders.filter((o) => o.status === 'pending').length;
  const activeCustomerOrdersCount = customerOrders.filter(
    (o) => o.status === 'placed' || o.status === 'accepted' || o.status === 'ready_for_pickup'
  ).length;
  const pendingApprovalsCount = farmers.filter((f) => f.status === 'pending').length;
  const unreadNotifsCount = customerNotifications.filter((n) => !n.read).length;

  // Role-Specific primary menu items matching MarketEase visual styling
  const vendorNavItems: NavItem[] = [
    { id: 'market', label: 'Market & Stall', icon: LayoutGrid },
    { id: 'fulfillment', label: 'Pre-Order Fulfillment', icon: ClipboardList, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'catalog', label: 'Inventory & Catalog', icon: Package },
    { id: 'stall', label: 'Stall & Map Settings', icon: Store },
    { id: 'reviews', label: 'Review Center', icon: Star },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'analytics', label: 'Reports & Analytics', icon: LayoutGrid },
    { id: 'farmers', label: 'Farmers & Stalls', icon: Tractor, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'markets', label: 'Market Locations', icon: Store },
    { id: 'moderation', label: 'Content Moderation', icon: ShieldAlert, badge: moderationItems.length > 0 ? moderationItems.length : undefined },
    { id: 'config', label: 'System Configuration', icon: Sliders },
  ];

  const customerNavItems: NavItem[] = [
    { id: 'market', label: 'Market & Produce', icon: LayoutGrid },
    { id: 'orders', label: 'Active Pre-Orders', icon: ClipboardList, badge: activeCustomerOrdersCount > 0 ? activeCustomerOrdersCount : undefined },
    { id: 'favorites', label: 'Favorites & Stalls', icon: Heart },
    { id: 'map', label: 'Pickup Navigation', icon: Navigation },
    { id: 'notifs', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
  ];

  const mainNavItems =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'customer'
      ? customerNavItems
      : vendorNavItems;

  const secondaryNavItems = [
    { id: 'feedback', label: 'Feedback', icon: Smile },
    { id: 'help', label: 'Help & AI', icon: CircleHelp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col py-6 px-4 select-none min-h-screen">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-none stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h16l-1.5 10.5a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5L4 10z" />
            <path d="M8 10V6a4 4 0 0 1 8 0v4" />
            <line x1="9" y1="14" x2="9" y2="18" />
            <line x1="15" y1="14" x2="15" y2="18" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-slate-800 leading-none">
            MarketLink
          </span>
          <span className="text-[10px] font-semibold text-[#22c55e] mt-1 capitalize">
            {currentRole} Mode
          </span>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 space-y-1.5">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#ecfbf2] text-[#22c55e] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#22c55e]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Badges or Active right bar */}
              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span className="bg-[#22c55e] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full leading-none min-w-[20px] text-center shadow-xs">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#22c55e] rounded-l-full" />
                )}
              </div>
            </button>
          );
        })}

        {/* Divider / spacing */}
        <div className="pt-6 pb-2">
          <div className="h-px bg-slate-100" />
        </div>

        {/* Secondary Navigation Menu */}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#ecfbf2] text-[#22c55e] font-semibold'
                  : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#22c55e]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#22c55e] rounded-l-full" />
              )}
            </button>
          );
        })}

        {/* Sign Out / Switch Portal Option */}
        <div className="pt-4 border-t border-[var(--color-border)] mt-4">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition group cursor-pointer"
            title="Sign out and return to role login portal"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
