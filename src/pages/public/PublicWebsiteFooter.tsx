import React from 'react';
import { useAppRouter } from '../../routes/RouterContext';
import { WebsitePageId } from '../../routes/routes.types';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const PublicWebsiteFooter: React.FC = () => {
  const { navigateWebsite } = useAppRouter();

  return (
    <footer className="bg-[#050e0a] border-t border-emerald-950/80 text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigateWebsite('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#00a859] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Store className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit',sans-serif] block leading-tight">
                  MarketLink
                </span>
                <span className="text-[11px] font-medium text-emerald-400 block leading-tight">
                  Karachi Farmers Market Platform
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Connecting Karachi households directly with verified organic growers across Sindh.
              Browse live stall positions on Google Maps, check morning harvests, and pre-order with zero middleman fees.
            </p>

            <div className="flex items-center gap-3 text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Verified Growers</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fresh Harvest Daily</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Pages */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-['Outfit',sans-serif]">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateWebsite('home')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Home Overview</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateWebsite('markets')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Karachi Markets & Map</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateWebsite('shop')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Shop Fresh Produce</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateWebsite('farmers')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Meet Our Farmers</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateWebsite('about')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>How It Works</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateWebsite('contact')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Contact & Support</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Active Karachi Hubs */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-['Outfit',sans-serif]">
              Karachi Market Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">DHA Phase 6 & Clifton</strong>
                  <span className="text-[10px] text-slate-500">Khayaban-e-Shahbaz</span>
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Empress Market Saddar</strong>
                  <span className="text-[10px] text-slate-500">Preedy Street Heritage Hall</span>
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Gulshan-e-Iqbal</strong>
                  <span className="text-[10px] text-slate-500">Hassan Square Pavilion</span>
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Hydri North Nazimabad</strong>
                  <span className="text-[10px] text-slate-500">Block H Market Area</span>
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#def54d] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Malir Cantonment Hub</strong>
                  <span className="text-[10px] text-slate-500">Super Highway Farm Center</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Hotline & Customer Care */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-['Outfit',sans-serif]">
              Customer Hotline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-200 font-mono font-bold">(021) 3584-8901</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">support@marketlink.org</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Mon - Sun • 07:00 AM - 08:00 PM PKT. Order support & inquiries answered within 15 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MarketLink Pakistan. All Rights Reserved. Engineered for Sindh Farmers.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateWebsite('about')}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateWebsite('about')}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => navigateWebsite('contact')}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Help Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
