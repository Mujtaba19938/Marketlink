import React from 'react';
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
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  orderCount?: number;
  cartCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  orderCount = 3,
  cartCount = 8,
}) => {
  const mainNavItems = [
    { id: 'market', label: 'Market', icon: LayoutGrid },
    { id: 'categories', label: 'Categories', icon: Shapes },
    { id: 'order', label: 'Order', icon: ClipboardList, badge: orderCount },
    { id: 'favourite', label: 'Favourite', icon: Heart },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { id: 'message', label: 'Message', icon: MessageSquare },
  ];

  const secondaryNavItems = [
    { id: 'feedback', label: 'Feedback', icon: Smile },
    { id: 'help', label: 'Help', icon: CircleHelp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col py-6 px-4 select-none min-h-screen">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
          {/* Custom shopping basket icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10h16l-1.5 10.5a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5L4 10z" />
            <path d="M8 10V6a4 4 0 0 1 8 0v4" />
            <line x1="9" y1="14" x2="9" y2="18" />
            <line x1="15" y1="14" x2="15" y2="18" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-800">
          MarketLink
        </span>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 space-y-1.5">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
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
                <span>{item.label}</span>
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
          <div className="h-px bg-slate-100 mx-2" />
        </div>

        {/* Secondary Navigation */}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#ecfbf2] text-[#22c55e] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#22c55e]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1.5 bg-[#22c55e] rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
