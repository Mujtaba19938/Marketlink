import React, { useState, useRef } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MockMap } from '../common/MockMap';
import { DirectoryFarmer, DAY_NAMES, dayCodeToName, formatPrice } from '../../services/mappers';
import { Store, MapPin, Calendar, Star, Search, Navigation, ShieldCheck, ShoppingBag, Heart, Clock } from 'lucide-react';

interface MarketFarmerDirectoryProps {
  onNavigateToMap?: (marketId: string) => void;
  onSelectProductForOrder?: (productName: string) => void;
}

/** SRS: browse markets by location and day, see the farmers at each market and their weekly stock */
export const MarketFarmerDirectory: React.FC<MarketFarmerDirectoryProps> = ({ onNavigateToMap, onSelectProductForOrder }) => {
  const {
    markets,
    directory,
    marketProducts,
    triggerToast,
    getStallsForMarket,
    addToCart,
    savedMarketIds,
    toggleSavedMarket,
    favoriteFarmerIds,
    toggleFavorite,
  } = useMarketData();

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarketId, setActiveMarketId] = useState<string>('');
  const [selectedFarmer, setSelectedFarmer] = useState<DirectoryFarmer | null>(null);
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const daysOfWeek = ['all', ...DAY_NAMES];

  const filteredMarkets = markets.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q) || (m.city || '').toLowerCase().includes(q);
    const matchesDay = selectedDay === 'all' || m.operatingDays.includes(selectedDay);
    return matchesSearch && matchesDay;
  });

  const currentMarket = markets.find((m) => m.id === activeMarketId) || filteredMarkets[0] || markets[0];

  if (!currentMarket) {
    return (
      <div className="bg-[var(--color-surface-card)] rounded-3xl p-10 border border-[var(--color-border)] text-center text-xs text-slate-500">
        No markets have been added yet.
      </div>
    );
  }

  const stalls = getStallsForMarket(currentMarket.id);
  // approved farmers who sell at this market
  const farmersAtMarket = directory.filter((f) => f.markets.some((a) => a.market?._id === currentMarket.id));
  const isSaved = savedMarketIds.includes(currentMarket.id);

  const selectedFarmerProducts = selectedFarmer ? marketProducts.filter((p) => p.farmerId === selectedFarmer._id) : [];
  const selectedAssignment = selectedFarmer?.markets.find((a) => a.market?._id === currentMarket.id);

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
              <h3 className="text-base font-bold text-[var(--color-text-main)]">Browse Farmers Markets &amp; Stalls</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Find markets by day and location, see which farmers are there and what they have this week.</p>
          </div>

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
              {day === 'all' ? 'All Days' : day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Markets list */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between px-1">
            <span>Markets Found ({filteredMarkets.length})</span>
            <span className="text-[11px] text-slate-400">Click a market to see its stalls</span>
          </div>

          <div className="space-y-3">
            {filteredMarkets.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-[var(--color-border)] rounded-2xl">
                No market operates on that day.
              </div>
            )}
            {filteredMarkets.map((market) => {
              const isSelected = market.id === currentMarket.id;
              return (
                <div
                  key={market.id}
                  onClick={() => {
                    setActiveMarketId(market.id);
                    setSelectedStallId(undefined);
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-surface-card)] shadow-md ring-2 ring-[var(--color-primary)]/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">{market.name}</h4>
                        {market.status !== 'open' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">{market.status}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {market.address}
                          {market.city ? `, ${market.city}` : ''}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)] shrink-0">
                      {market.activeVendorsCount} Stalls
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {market.operatingDays.map((d) => d.slice(0, 3)).join(', ')} • {market.timings}
                      </span>
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

        {/* Right: Map + farmers at this market */}
        <div className="lg:col-span-6 space-y-4">
          <div ref={mapContainerRef} className="bg-[var(--color-surface-card)] rounded-3xl p-5 border border-[var(--color-border)] shadow-xs space-y-3 scroll-mt-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-xs font-bold text-[var(--color-text-main)]">{currentMarket.name} • Stall Locations</span>
              </div>
              <button
                type="button"
                onClick={() => toggleSavedMarket(currentMarket.id)}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                  isSaved ? 'bg-rose-50 text-rose-700 border-rose-200' : 'border-[var(--color-border)] text-slate-500 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3 h-3 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isSaved ? 'Saved market' : 'Save market'}
              </button>
            </div>

            <MockMap
              lat={currentMarket.lat}
              lng={currentMarket.lng}
              marketName={currentMarket.name}
              address={currentMarket.address}
              showDirections={true}
              height="h-80"
              stalls={stalls}
              selectedStallId={selectedStallId}
              onSelectStall={(stall) => setSelectedStallId(stall.id)}
              onPreOrderStall={(stall) => {
                const farmer = directory.find((f) => f._id === stall.farmerId);
                if (farmer) setSelectedFarmer(farmer);
              }}
            />
          </div>

          <div className="bg-[var(--color-surface-card)] rounded-3xl p-5 border border-[var(--color-border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-main)]">Farmers at {currentMarket.name}</h4>
                <p className="text-[10px] text-slate-400">&quot;Locate&quot; pans the map to that stall</p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{farmersAtMarket.length} farmers</span>
            </div>

            <div className="space-y-2.5">
              {farmersAtMarket.length === 0 && <p className="text-xs text-slate-400 py-4 text-center">No farmers have joined this market yet.</p>}
              {farmersAtMarket.map((farmer) => {
                const stall = stalls.find((s) => s.farmerId === farmer._id);
                const isStallSelected = stall && selectedStallId === stall.id;

                return (
                  <div
                    key={farmer._id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      isStallSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20'
                        : 'bg-[var(--color-surface-muted)] border-[var(--color-border)] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                        {farmer.stallName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[var(--color-text-main)] truncate">{farmer.stallName}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {farmer.contactPerson} • {stall?.stallNumber || farmer.city} • ★ {farmer.rating ? farmer.rating.toFixed(1) : 'New'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {stall && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStallId(stall.id);
                            mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            triggerToast(`Showing ${stall.stallNumber} (${stall.stallName}) on the map`, 'info');
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isStallSelected
                              ? 'bg-[#22c55e] text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-[#22c55e] hover:text-[#22c55e]'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span className="hidden sm:inline">Locate</span>
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

      {/* Farmer profile + weekly stock */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--color-surface-card)] text-[var(--color-text-main)] w-full max-w-lg rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">{selectedFarmer.stallName.charAt(0)}</div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-main)]">{selectedFarmer.stallName}</h3>
                  <span className="text-[11px] text-slate-400">Approved farmer • stall profile</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedFarmer._id, 'farmer')}
                  className="p-1.5 rounded-xl hover:bg-rose-50 cursor-pointer"
                  title={favoriteFarmerIds.includes(selectedFarmer._id) ? 'Remove from favorites' : 'Save farmer'}
                >
                  <Heart className={`w-4 h-4 ${favoriteFarmerIds.includes(selectedFarmer._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                </button>
                <button type="button" onClick={() => setSelectedFarmer(null)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition cursor-pointer">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)] space-y-2">
                <div className="grid grid-cols-2 gap-2 text-slate-500">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Contact Person</span>
                    <span className="font-bold text-[var(--color-text-main)]">{selectedFarmer.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedFarmer.rating ? `${selectedFarmer.rating.toFixed(1)} / 5 (${selectedFarmer.reviewCount})` : 'No reviews yet'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Location</span>
                    <span className="font-bold text-[var(--color-text-main)]">{[selectedFarmer.address, selectedFarmer.city].filter(Boolean).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">At {currentMarket.name}</span>
                    <span className="font-bold text-[var(--color-text-main)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedAssignment
                        ? `${selectedAssignment.operatingDays.map((d) => dayCodeToName(d).slice(0, 3)).join(', ')} ${selectedAssignment.pickupStart || ''}-${selectedAssignment.pickupEnd || ''}`
                        : '—'}
                    </span>
                  </div>
                </div>
                {selectedFarmer.description && <p className="text-slate-500 pt-1">{selectedFarmer.description}</p>}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[var(--color-text-main)]">This week&apos;s stock</h4>
                <div className="space-y-2">
                  {selectedFarmerProducts.length === 0 && <p className="text-slate-400">No products listed this week.</p>}
                  {selectedFarmerProducts.map((p) => {
                    const available = p.availability === 'AVAILABLE' && p.stock > 0;
                    return (
                      <div key={p.id} className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-[var(--color-text-main)]">{p.name}</div>
                          <span className="text-[11px] text-slate-400">
                            {formatPrice(p.price)} / {p.unit} • {available ? `${p.stock} in stock` : 'sold out'}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={!available}
                          onClick={async () => {
                            if (await addToCart(p, 1)) {
                              setSelectedFarmer(null);
                              onSelectProductForOrder?.(p.name);
                            }
                          }}
                          className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Pre-Order</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] text-right">
              <button type="button" onClick={() => setSelectedFarmer(null)} className="px-5 py-2 bg-slate-100 dark:bg-white/10 text-[var(--color-text-main)] rounded-xl font-bold text-xs cursor-pointer">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
