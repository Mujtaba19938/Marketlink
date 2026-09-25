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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h16l-1.5 10.5a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5L4 10z" />
              <path d="M8 10V6a4 4 0 0 1 8 0v4" />
              <line x1="9" y1="14" x2="9" y2="18" />
              <line x1="15" y1="14" x2="15" y2="18" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[var(--color-text-main)] block leading-none">
              MarketLink
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-primary)]">
              Farm Fresh Just a Click Away
            </span>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Light/Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleMode}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl transition cursor-pointer"
            title={`Switch to ${resolvedMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {resolvedMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Quick Palette Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPaletteOpen(!paletteOpen)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl transition cursor-pointer flex items-center gap-1"
              title="Change Theme Palette"
            >
              <Palette className="w-4 h-4 text-[var(--color-primary)]" />
            </button>

            {paletteOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-bold text-[var(--color-text-main)] mb-1.5 px-1.5 flex items-center justify-between">
                  <span>Theme Palette</span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">{resolvedMode}</span>
                </div>
                <div className="space-y-1">
                  {availablePalettes.map((p) => {
                    const isSelected = palette === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPalette(p.id);
                          setPaletteOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected ? 'bg-slate-200/40 text-[var(--color-primary)] font-bold' : 'hover:bg-slate-100/50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full overflow-hidden flex border border-black/10 shrink-0">
                            <div className="w-1/2 h-full" style={{ backgroundColor: p.swatch.dark }} />
                            <div className="w-1/2 h-full" style={{ backgroundColor: p.swatch.light }} />
                          </div>
                          <span className="truncate text-[11px]">{p.name.split('&')[0]}</span>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-[var(--color-primary)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Return to Public Website Storefront */}
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Store className="w-3.5 h-3.5" />
              <span>← Back to Website</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Authentication Center Box */}
      <main className="w-full max-w-2xl mx-auto my-6 space-y-6">
        {/* Banner if redirected from placing an order */}
        {redirectedOrder && (
          <div className="p-4 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 text-left flex items-start gap-3.5 shadow-sm animate-in fade-in slide-in-from-top-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  Pre-Order #{redirectedOrder.id} Reserved!
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  Pay at Pickup (${redirectedOrder.total})
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Customer Dashboard Log In
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Your pre-order for <strong>{redirectedOrder.stall}</strong> has been received. Please log in below to access your Customer Dashboard, view your order badge, track pickup, and place further orders.
              </p>
            </div>
          </div>
        )}

        {/* Title & Introduction */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary-border)] mb-1">
            <span>SRS Specification 1.6: Role-Based Authentication</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
            Select Your Role Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Choose whether to log in as a SuperAdmin, local Farmer/Vendor, or Fresh Produce Shopper.
          </p>
        </div>

        {/* 3-Way Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isSelected = activeAuthPortal === portal.id;

            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => setActiveAuthPortal(portal.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? `${portal.borderActive} shadow-sm`
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${portal.accentColor}`} />
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {portal.badgeText}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[var(--color-text-main)]">
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
        <div className="bg-[var(--color-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-md">
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
