import React, { useState, useRef } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { FarmerRecord, MarketRecord } from '../../types/admin';
import { MockMap } from '../common/MockMap';
import { Store, MapPin, Calendar, Clock, Star, Search, ChevronRight, Navigation, Phone, ShieldCheck, Check, ShoppingBag } from 'lucide-react';

interface MarketFarmerDirectoryProps {
  onNavigateToMap?: (marketId: string) => void;
  onSelectProductForOrder?: (productName: string) => void;
}

export const MarketFarmerDirectory: React.FC<MarketFarmerDirectoryProps> = ({
  onNavigateToMap,
  onSelectProductForOrder,
}) => {
  const { markets, farmers, vendorProducts, triggerToast, getStallsForMarket } = useMarketData();

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarketId, setActiveMarketId] = useState<string>(markets[0]?.id || 'mkt-1');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(null);
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const daysOfWeek = ['all', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];

  const filteredMarkets = markets.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay =
      selectedDay === 'all' ||
      m.operatingDays.some((d) => d.toLowerCase().includes(selectedDay.toLowerCase()));
    return matchesSearch && matchesDay;
  });

  const currentMarket = markets.find((m) => m.id === activeMarketId) || markets[0];

  // Approved farmers at current selected market
  const activeFarmersAtMarket = farmers.filter((f) => f.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 border border-[var(--color-border)] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Browse Farmers Markets & Local Stalls (SRS)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Explore participating regional farmers markets by operating day, discover verified growers, and view weekly stock.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search markets or locations..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Filter by Day:</span>
          {daysOfWeek.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer capitalize shrink-0 ${
                selectedDay === day
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'bg-[var(--color-surface-muted)] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {day === 'all' ? 'All Operating Days' : day}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Market Listings & Interactive OpenStreetMap View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Markets Directory List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between px-1">
            <span>Markets Found ({filteredMarkets.length})</span>
            <span className="text-[11px] text-slate-400">Click a market to inspect stalls & map</span>
          </div>

          <div className="space-y-3">
            {filteredMarkets.map((market) => {
              const isSelected = market.id === activeMarketId;

              return (
                <div
                  key={market.id}
                  onClick={() => setActiveMarketId(market.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-surface-card)] shadow-md ring-2 ring-[var(--color-primary)]/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                          {market.name}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{market.address}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shrink-0">
                      {market.activeVendorsCount} Stalls
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{market.operatingDays.join(', ')} • {market.timings}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToMap?.(market.id);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)] hover:underline"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Embedded Google Maps with Stall Markers + Active Stalls at Market */}
        <div className="lg:col-span-6 space-y-4">
          {/* Map Preview Card */}
          <div
            ref={mapContainerRef}
            className="bg-[var(--color-surface-card)] rounded-3xl p-5 border border-[var(--color-border)] shadow-xs space-y-3 scroll-mt-20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-xs font-bold text-[var(--color-text-main)]">
                  {currentMarket.name} • Stall Locations on Google Maps
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {getStallsForMarket(currentMarket.id).length} Stalls on Map
              </span>
            </div>

            <MockMap
              lat={currentMarket.lat}
              lng={currentMarket.lng}
              marketName={currentMarket.name}
              address={currentMarket.address}
              showDirections={true}
              height="h-80"
              stalls={getStallsForMarket(currentMarket.id)}
              selectedStallId={selectedStallId}
              onSelectStall={(stall) => {
                setSelectedStallId(stall.id);
              }}
              onPreOrderStall={() => {
                onSelectProductForOrder?.('');
              }}
            />
          </div>

          {/* Farmers & Stalls Present at this Market */}
          <div className="bg-[var(--color-surface-card)] rounded-3xl p-5 border border-[var(--color-border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-main)]">
                  Farmers Present at {currentMarket.name}
                </h4>
                <p className="text-[10px] text-slate-400">
                  Click &quot;Locate on Map&quot; to pan & zoom Google Maps to that stall
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {activeFarmersAtMarket.length} verified growers
              </span>
            </div>

            <div className="space-y-2.5">
              {activeFarmersAtMarket.map((farmer) => {
                const currentMarketStalls = getStallsForMarket(currentMarket.id);
                const matchedStall =
                  currentMarketStalls.find(
                    (s) =>
                      s.farmerName.toLowerCase() === farmer.name.toLowerCase() ||
                      farmer.location.toLowerCase().includes(s.stallNumber.toLowerCase())
                  ) || currentMarketStalls[0];

                const isStallSelected = matchedStall && selectedStallId === matchedStall.id;

                return (
                  <div
                    key={farmer.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      isStallSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20'
                        : 'bg-[var(--color-surface-muted)] border-[var(--color-border)] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                        {farmer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[var(--color-text-main)] truncate">
                            {farmer.farmName}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Farmer: {farmer.name} • {matchedStall ? matchedStall.stallNumber : farmer.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Locate on Map Button: pans & zooms Google Maps directly to this stall */}
                      {matchedStall && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStallId(matchedStall.id);
                            mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            triggerToast(
                              `Focused on ${matchedStall.stallNumber} (${matchedStall.stallName}) on map`,
                              'info'
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isStallSelected
                              ? 'bg-[#22c55e] text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-[#22c55e] hover:text-[#22c55e]'
                          }`}
                          title={`View ${matchedStall.stallNumber} location on Google Maps`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span className="hidden sm:inline">Locate on Map</span>
                          <span className="sm:hidden">Map</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedFarmer(farmer)}
                        className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-xs font-bold text-[var(--color-text-main)] rounded-xl transition cursor-pointer"
                      >
                        View Stall
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Stall Profile & Weekly Stock Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--color-surface-card)] text-[var(--color-text-main)] w-full max-w-lg rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  {selectedFarmer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-main)]">
                    {selectedFarmer.farmName}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Verified Organic Producer • Stall Profile
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Profile Details */}
              <div className="bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)] space-y-2">
                <div className="grid grid-cols-2 gap-2 text-slate-500">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Contact Person</span>
                    <span className="font-bold text-[var(--color-text-main)]">{selectedFarmer.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Phone</span>
                    <span className="font-bold text-[var(--color-text-main)]">{selectedFarmer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Email</span>
                    <span className="font-bold text-[var(--color-text-main)]">{selectedFarmer.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedFarmer.rating} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Stock Showcase */}
              <div className="space-y-3">
                <h4 className="font-bold text-[var(--color-text-main)]">Current Weekly Stock Catalog</h4>
                <div className="space-y-2">
                  {vendorProducts.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-[var(--color-text-main)]">{p.name}</div>
                        <span className="text-[11px] text-slate-400">
                          ${p.price.toFixed(2)} / {p.unit} • {p.stock} in stock
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProductForOrder?.(p.name);
                          triggerToast(`Added ${p.name} to pre-order selection`);
                          setSelectedFarmer(null);
                        }}
                        className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer hover:opacity-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Pre-Order</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] text-right">
              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="px-5 py-2 bg-slate-100 dark:bg-white/10 text-[var(--color-text-main)] rounded-xl font-bold text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
