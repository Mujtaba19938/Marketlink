import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme';
import { useAppRouter } from '../../routes/RouterContext';
import { WebsitePageId } from '../../routes/routes.types';
import {
  Store,
  MapPin,
  ShoppingBag,
  Sun,
  Moon,
  User,
  Menu,
  X,
  Compass,
  Sparkles,
  Phone,
  Info,
  Layers,
} from 'lucide-react';

interface PublicWebsiteNavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
}

export const PublicWebsiteNavbar: React.FC<PublicWebsiteNavbarProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenLogin,
  onOpenDashboard,
}) => {
  const { isAuthenticated, currentUser, currentRole, logout } = useAuth();
  const { resolvedMode, toggleMode } = useTheme();
  const { websitePage, navigateWebsite } = useAppRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: WebsitePageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'markets', label: 'Markets & Map', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'shop', label: 'Shop Harvest', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'farmers', label: 'Our Farmers', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'How It Works', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact Us', icon: <Phone className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (pageId: WebsitePageId) => {
    navigateWebsite(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0c1b14]/95 backdrop-blur-md border-b border-emerald-900/50 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-[14px] bg-[#00a859] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Store className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit',sans-serif] leading-tight">
                MarketLink
              </span>
              <span className="px-2 py-0.5 rounded-full border border-emerald-700/60 bg-emerald-950/60 text-emerald-400 text-[10px] font-bold tracking-wide hidden sm:inline">
                Karachi Fresh
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Farm Fresh Just a Click Away
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = websitePage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/15 text-[#def54d] font-bold border border-emerald-500/30 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleMode}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {resolvedMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Pre-Order Basket Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-3.5 py-1.5 bg-[#fcf5ed] hover:bg-white text-[#6f401f] rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="View pre-order basket"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#6f401f] stroke-[2.2]" />
            <span className="hidden sm:inline">Basket</span>
            {cartItemCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#6f401f] text-white text-[10px] font-black animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Dashboard / Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{currentUser?.name?.split(' ')[0] || 'My'} Dashboard</span>
                <span className="md:hidden">Portal</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c1b14] border-b border-emerald-900/60 px-4 pt-2 pb-4 space-y-1.5 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = websitePage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold transition flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-emerald-500/20 text-[#def54d] border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
