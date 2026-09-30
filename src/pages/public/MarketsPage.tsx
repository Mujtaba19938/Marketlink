import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MockMap } from '../../components/common/MockMap';
import { StallLocation } from '../../types/market';
import { useNearbyMarkets, formatDistance } from '../../components/customer/useNearbyMarkets';
import {
  LocateFixed,
  Loader2,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Store,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Star,
  CheckCircle2,
  Calendar,
  Car,
} from 'lucide-react';

interface MarketsPageProps {
  onPreOrderStall?: (stall: StallLocation) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ onPreOrderStall }) => {
  const { markets: allMarkets, getStallsForMarket } = useMarketData();
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');

  // "Markets near me": once located, markets are sorted nearest first with their distance
  const near = useNearbyMarkets();
  const located = near.status === 'ready';
  const markets = located
    ? [...allMarkets].sort((a, b) => (near.distances[a.id] ?? Infinity) - (near.distances[b.id] ?? Infinity))
    : allMarkets;

  // select the nearest market as soon as the location arrives
  useEffect(() => {
    if (!located) return;
    const nearest = Object.entries(near.distances).sort((a, b) => a[1] - b[1])[0];
    if (nearest) {
      setSelectedMarketId(nearest[0]);
      setSelectedStallId(undefined);
      stripRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [located, near.distances]);
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>();

  // market strip scroll arrows: each arrow shows only when there is more to scroll that way
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const updateArrows = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScroll({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows, markets.length, located]);
  const scrollStrip = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  // markets arrive from the API after first render, so fall back to the first one
  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const currentMarketStalls = currentMarket ? getStallsForMarket(currentMarket.id) : [];

  if (!currentMarket) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        No markets have been published yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[#def54d] text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Market &amp; stall locator</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
          Karachi Farmers Markets &amp; Stall Locator
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Choose a market to see its location, opening days and the farmers' stalls. Click a stall pin for details
          and pre-order from that farmer for pickup.
        </p>
      </div>

      {/* Markets near me */}
      <div className="flex flex-wrap items-center gap-3 -mb-6">
        {located ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <LocateFixed className="w-4 h-4 text-[#def54d]" />
            <span>
              Sorted by distance from you
              {markets[0] && near.distances[markets[0].id] !== undefined && ` • nearest: ${markets[0].name} (${formatDistance(near.distances[markets[0].id])})`}
            </span>
            <button type="button" onClick={near.clear} aria-label="Clear location" className="ml-1 p-0.5 rounded-full hover:bg-white/10 cursor-pointer">
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={near.locate}
            disabled={near.status === 'locating'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] text-xs font-black shadow-lg transition cursor-pointer disabled:opacity-60 active:scale-95"
          >
            {near.status === 'locating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
            <span>{near.status === 'locating' ? 'Finding your location…' : 'Markets near me'}</span>
          </button>
        )}
        {near.message && <span className="text-xs text-amber-300">{near.message}</span>}
      </div>

      {/* District Selector Tabs */}
      <div className="relative">
        {canScroll.left && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-[#07130e] to-transparent z-10" />
            <button
              type="button"
              onClick={() => scrollStrip(-1)}
              aria-label="Scroll markets left"
              className="absolute left-0 top-1/2 -translate-y-[calc(50%+4px)] z-20 w-9 h-9 rounded-full bg-[#def54d] text-[#0c1b14] shadow-lg flex items-center justify-center hover:bg-[#e8fa79] active:scale-95 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          </>
        )}
        {canScroll.right && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[#07130e] to-transparent z-10" />
            <button
              type="button"
              onClick={() => scrollStrip(1)}
              aria-label="Scroll markets right"
              className="absolute right-0 top-1/2 -translate-y-[calc(50%+4px)] z-20 w-9 h-9 rounded-full bg-[#def54d] text-[#0c1b14] shadow-lg flex items-center justify-center hover:bg-[#e8fa79] active:scale-95 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </>
        )}
      <div ref={stripRef} onScroll={updateArrows} className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {markets.map((m) => {
          const isSelected = m.id === currentMarket.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedMarketId(m.id);
                setSelectedStallId(undefined);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#22c55e] text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0c1b14] text-slate-300 border-emerald-900/40 hover:bg-[#122b1e] hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{m.name}</span>
              {located && near.distances[m.id] !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#0c1b14]/30 text-white' : 'bg-[#def54d]/15 text-[#def54d]'}`}>
                  {formatDistance(near.distances[m.id])}
                </span>
              )}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                {m.activeVendorsCount} {m.activeVendorsCount === 1 ? 'Stall' : 'Stalls'}
              </span>
            </button>
          );
        })}
      </div>
      </div>

      {/* Active Market Info Header Bar */}
      <div className="bg-[#0c1b14] border border-emerald-900/50 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              {currentMarket.name}
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">• {currentMarket.address}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentMarket.operatingDays.join(', ')}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentMarket.timings}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Car className="w-3.5 h-3.5" />
              <span className="capitalize">{currentMarket.status}</span>
            </div>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${currentMarket.name}, ${currentMarket.address}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Launch Turn-by-Turn GPS</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>
      </div>

      {/* Embedded Google Maps Canvas with Coordinate-Pinned Markers */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/60">
        <MockMap
          lat={currentMarket.lat}
          lng={currentMarket.lng}
          marketName={currentMarket.name}
          address={currentMarket.address}
          showDirections={true}
          height="h-[480px]"
          stalls={currentMarketStalls}
          selectedStallId={selectedStallId}
          onSelectStall={(stall) => {
            setSelectedStallId(stall.id);
          }}
          onPreOrderStall={onPreOrderStall}
        />
      </div>

      {/* Stalls Directory Grid at this Selected Karachi Market */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
          <h3 className="text-xl font-black text-white font-['Outfit',sans-serif] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#22c55e]" />
            <span>Active Stalls at {currentMarket.name} ({currentMarketStalls.length} Booths)</span>
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any stall card to view its live position
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMarketStalls.length === 0 && <p className="text-xs text-slate-400">No farmers have joined this market yet.</p>}
          {currentMarketStalls.map((stall) => {
            const isSelected = selectedStallId === stall.id;

            return (
              <div
                key={stall.id}
                onClick={() => setSelectedStallId(stall.id)}
                className={`bg-[#0c1b14] rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                    : 'border-emerald-900/40 hover:border-emerald-500/50 hover:bg-[#10241b]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-[#def54d] text-xs font-bold">
                      {stall.stallNumber}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{stall.rating ? stall.rating.toFixed(1) : 'New'} ({stall.ordersCount} pickups)</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                      {stall.stallName}
                    </h4>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Farmer: <strong className="text-slate-200">{stall.farmerName}</strong>
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {stall.description}
                  </p>

                  {/* Specialty Produce Badges */}
                  {stall.specialtyItems && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stall.specialtyItems.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-800/40 text-[10px] text-emerald-300 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    📍 {stall.lat.toFixed(4)}, {stall.lng.toFixed(4)}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreOrderStall?.(stall);
                    }}
                    className="px-3 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop this stall</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
