import React, { useState } from 'react';
import { useAppRouter } from '../../routes/RouterContext';
import { useMarketData } from '../../context/MarketDataContext';
import { UserAvatar } from '../../components/ProduceArt';
import {
  Store,
  MapPin,
  Star,
  ShieldCheck,
  Award,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Phone,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface FarmersPageProps {
  onSelectFarmerForShop?: (farmerId: string) => void;
}

export const FarmersPage: React.FC<FarmersPageProps> = ({ onSelectFarmerForShop }) => {
  const { navigateWebsite } = useAppRouter();
  const [search, setSearch] = useState('');
  const { farmers, directory } = useMarketData();

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[#def54d] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin-approved local farmers</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Our Local Farmers &amp; Producers
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Meet the independent growers harvesting daily across Sindh for Karachi's regional farmers markets.
              Every stall is reviewed and approved by the MarketLink admin team before it can sell.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by farmer or crop..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0c1b14] border border-emerald-900/60 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.length === 0 && <p className="text-xs text-slate-400">No farmers found.</p>}
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="bg-[#0c1b14] border border-emerald-900/50 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Farmer Profile Head */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-700/60 overflow-hidden shrink-0 flex items-center justify-center">
                  <UserAvatar className="w-full h-full" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-base font-['Outfit',sans-serif] truncate">
                      {farmer.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" aria-label="Approved farmer" />
                  </div>

                  <p className="text-xs text-emerald-400 font-semibold truncate">{farmer.farmName}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {farmer.rating ? farmer.rating.toFixed(1) : 'New'}
                    </span>
                    <span>•</span>
                    <span>{farmer.totalOrders} completed pickups</span>
                  </div>
                </div>
              </div>

              {/* Stall Location in Karachi */}
              <div className="p-3 bg-[#07130e] rounded-2xl border border-emerald-950 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#def54d]" />
                  <span>Farm location &amp; markets:</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-5">{farmer.location}</p>
                <p className="text-emerald-400/80 text-[11px] pl-5">
                  {directory.find((d) => d._id === farmer.id)?.markets.map((m) => `${m.market?.name}${m.stallNumber ? ` (${m.stallNumber})` : ''}`).join(', ') || 'No market scheduled yet'}
                </p>
              </div>

              {/* Produce Specialties */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Grown Specialties:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {farmer.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/40 text-[11px] text-emerald-300 font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{farmer.productCount} products</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  onSelectFarmerForShop?.(farmer.id);
                  navigateWebsite('shop');
                }}
                className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Harvest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
