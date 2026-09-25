import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme';
import { UserRole } from '../../types/auth';
import { AdminLoginForm } from '../../components/auth/AdminLoginForm';
import { FarmerLoginForm } from '../../components/auth/FarmerLoginForm';
import { CustomerLoginForm } from '../../components/auth/CustomerLoginForm';
import { DemoCredentialsHelper } from '../../components/auth/DemoCredentialsHelper';
import { ShieldCheck, Tractor, ShoppingBag, Sun, Moon, Palette, Check, Store, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onBackToWebsite?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const { activeAuthPortal, setActiveAuthPortal } = useAuth();
  const { mode, resolvedMode, toggleMode, palette, setPalette, availablePalettes } = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  const [redirectedOrder, setRedirectedOrder] = React.useState<{
    id: string;
    stall: string;
    total: string;
    slot: string;
  } | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem('marketlink_last_order_id');
      if (id) {
        setRedirectedOrder({
          id,
          stall: sessionStorage.getItem('marketlink_last_order_stall') || 'Green Valley Organic Stall #14',
          total: sessionStorage.getItem('marketlink_last_order_total') || '0.00',
          slot: sessionStorage.getItem('marketlink_last_order_slot') || 'Weekend Pickup Window',
        });
        setActiveAuthPortal('customer');
      }
    }
  }, [setActiveAuthPortal]);

  const portals: {
    id: UserRole;
    label: string;
    tagline: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderActive: string;
    badgeText: string;
  }[] = [
    {
      id: 'admin',
      label: 'SuperAdmin Portal',
      tagline: 'Governance & Telemetry',
      icon: ShieldCheck,
      accentColor: 'text-amber-600',
      borderActive: 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/50',
      badgeText: 'SRS Admin Login',
    },
    {
      id: 'vendor',
      label: 'Farmer / Stall Vendor',
      tagline: 'Produce Stock & Orders',
      icon: Tractor,
      accentColor: 'text-[#22c55e]',
      borderActive: 'border-[#22c55e] ring-2 ring-[#22c55e]/20 bg-[#ecfbf2]/50',
      badgeText: 'SRS Farmer Login',
    },
    {
      id: 'customer',
      label: 'Customer Marketplace',
      tagline: 'Fresh Pre-Orders & Pickup',
      icon: ShoppingBag,
      accentColor: 'text-sky-600',
      borderActive: 'border-sky-600 ring-2 ring-sky-500/20 bg-sky-50/50',
      badgeText: 'SRS Customer Login',
    },
  ];

  const handleSuccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('marketlink_last_order_id');
      sessionStorage.removeItem('marketlink_last_order_stall');
      sessionStorage.removeItem('marketlink_last_order_total');
      sessionStorage.removeItem('marketlink_last_order_slot');
    }
    onLoginSuccess?.();
  };

  return (
    <div className="min-h-screen bg-[#07130e] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-[#def54d]/20 selection:text-[#def54d]">
      {/* Top Navbar */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-emerald-950/80">
        {/* Logo */}
        <div
          onClick={onBackToWebsite}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-11 h-11 rounded-[14px] bg-[#00a859] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Store className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-xl tracking-tight text-white block leading-none font-['Outfit',sans-serif]">
                MarketLink
              </span>
              <span className="px-2.5 py-0.5 rounded-full border border-[#6b4724] bg-[#0c1811] text-[#c27c3e] text-[10px] font-bold tracking-wide">
                SRS v1.0
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400 mt-1 block leading-tight">
              Farm Fresh Just a Click Away
            </span>
          </div>
        </div>

        {/* Theme & Back Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Light/Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleMode}
            className="p-2.5 text-slate-400 hover:text-white bg-[#0e241b] border border-emerald-800/80 rounded-2xl transition cursor-pointer"
            title={`Switch to ${resolvedMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {resolvedMode === 'dark' ? (
              <Sun className="w-4 h-4 text-[#def54d]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Return to Public Website Storefront */}
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="px-5 py-2.5 rounded-full bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 font-['Outfit',sans-serif]"
            >
              <Store className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>← Back to Storefront</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Authentication Center Box */}
      <main className="w-full max-w-2xl mx-auto my-6 space-y-6">
        {/* Banner if redirected from placing an order */}
        {redirectedOrder && (
          <div className="p-5 rounded-3xl bg-[#0e241b] border-2 border-[#def54d]/50 text-left flex items-start gap-4 shadow-xl animate-in fade-in slide-in-from-top-3">
            <div className="w-10 h-10 rounded-2xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center shrink-0 shadow-md">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-[#0c1b14] bg-[#def54d] px-3 py-0.5 rounded-lg">
                  Pre-Order #{redirectedOrder.id} Reserved!
                </span>
                <span className="text-xs font-bold text-[#def54d]">
                  Pay at Pickup (${redirectedOrder.total})
                </span>
              </div>
              <h4 className="text-sm font-black text-white font-['Outfit',sans-serif]">
                Customer Dashboard Log In
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your pre-order for <strong className="text-white">{redirectedOrder.stall}</strong> has been received. Please log in below to access your Customer Dashboard, view your order badge, track pickup, and place further orders.
              </p>
            </div>
          </div>
        )}

        {/* Title & Introduction */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#12281e] text-[#def54d] text-xs font-bold border border-emerald-800/80 mb-1 font-['Outfit',sans-serif]">
            <span>SRS Specification 1.6: Role-Based Authentication</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            Select Your Role Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Choose whether to log in as a SuperAdmin, local Farmer/Vendor, or Fresh Produce Shopper.
          </p>
        </div>

        {/* 3-Way Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isSelected = activeAuthPortal === portal.id;

            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => setActiveAuthPortal(portal.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#122d21] border-[#def54d] ring-2 ring-[#def54d]/30 shadow-xl'
                    : 'bg-[#0e241b] border-emerald-900/60 hover:border-emerald-700/80 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#def54d] text-[#0c1b14]' : 'bg-[#132c20] text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-[#def54d] text-[#0c1b14]' : 'bg-[#132c20] text-slate-400'
                  }`}>
                    {portal.badgeText.replace('SRS ', '')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-white font-['Outfit',sans-serif]">
                    {portal.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {portal.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Role Form Card */}
        <div className="bg-[#0b1a13] rounded-[32px] p-6 sm:p-8 border border-emerald-900/70 shadow-2xl">
          {activeAuthPortal === 'admin' && <AdminLoginForm onSuccess={handleSuccess} />}
          {activeAuthPortal === 'vendor' && <FarmerLoginForm onSuccess={handleSuccess} />}
          {activeAuthPortal === 'customer' && <CustomerLoginForm onSuccess={handleSuccess} />}
        </div>

        {/* SRS Deliverable 1.9 Test Credentials Drawer */}
        <DemoCredentialsHelper
          onSelectRole={(r) => setActiveAuthPortal(r)}
          onInstantLogin={() => handleSuccess()}
        />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto pt-6 border-t border-[var(--color-border)] text-center text-xs text-slate-400 space-y-1">
        <div>
          MarketLink • End-to-End Web Solutions • Theme: eGreen Basket • Aptech TechWiz 7
        </div>
        <div className="text-[11px] text-slate-400">
          Built strictly according to Software Requirements Specification Version 1.0
        </div>
      </footer>
    </div>
  );
};
