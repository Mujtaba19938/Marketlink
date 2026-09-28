import React, { useState } from 'react';
import { MockMap } from '../common/MockMap';
import { useMarketData } from '../../context/MarketDataContext';
import {
  Navigation,
  MapPin,
  Clock,
  Compass,
  Phone,
  Car,
  Store,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const MapPickupNavigation: React.FC<{ initialMarketId?: string; initialStallId?: string }> = ({
  initialMarketId,
  initialStallId,
}) => {
  const { markets, getStallsForMarket, customerOrders } = useMarketData();

  // default: market of the next upcoming pickup, otherwise the first market
  const upcoming = customerOrders.find((o) => ['placed', 'accepted', 'ready_for_pickup'].includes(o.status));
  const [selectedMarketId, setSelectedMarketId] = useState(initialMarketId || upcoming?.marketId || markets[0]?.id || '');

  // markets load asynchronously: fall back to the first one until the chosen id exists
  const effectiveMarketId = markets.some((m) => m.id === selectedMarketId) ? selectedMarketId : markets[0]?.id || '';
  const marketStalls = getStallsForMarket(effectiveMarketId);
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>(
    initialStallId || marketStalls[0]?.id
  );

  const currentMarket = markets.find((m) => m.id === effectiveMarketId);
  const currentStall = marketStalls.find((s) => s.id === selectedStallId) || marketStalls[0];

  if (!currentMarket) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center text-xs text-slate-500">
        No markets have been added yet.
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentStall?.lat ?? currentMarket.lat},${currentStall?.lng ?? currentMarket.lng}`;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Map & Pickup Navigation Guide</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Market and stall locations with directions to your pickup point.
          </p>
        </div>

        {/* Market Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Select Market:</span>
          <select
            value={effectiveMarketId}
            onChange={(e) => {
              setSelectedMarketId(e.target.value);
              const newStalls = getStallsForMarket(e.target.value);
              setSelectedStallId(newStalls[0]?.id);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Embedded Map Component with Dynamic Stall Markers & Directions */}
      <MockMap
        lat={currentMarket.lat}
        lng={currentMarket.lng}
        marketName={currentMarket.name}
        address={currentMarket.address}
        showDirections={true}
        height="h-96"
        stalls={marketStalls}
        selectedStallId={selectedStallId}
        onSelectStall={(stall) => {
          setSelectedStallId(stall.id);
        }}
      />

      {/* Destination Details & Parking Guidance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
        {/* Stall Booth Information (Dynamically updates when user clicks any stall on map) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Selected Pickup Stall</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              {currentStall ? currentStall.stallNumber : '—'}
            </span>
          </div>
          <p className="text-slate-800 font-bold text-xs">
            {currentStall ? currentStall.stallName : 'No stalls at this market yet'}
          </p>
          <p className="text-slate-500 text-[11px] leading-tight">
            {currentStall ? currentStall.description || currentStall.category : 'Farmers appear here once they add this market to their schedule.'}
          </p>
          <div className="pt-1 flex items-center justify-between text-slate-500 text-[11px]">
            <span>Grower: <strong className="text-slate-700">{currentStall ? currentStall.farmerName : '—'}</strong></span>
            <span>★ {currentStall && currentStall.rating ? currentStall.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>

        {/* Curbside Parking & Gate */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Directions</span>
          </div>
          <p className="text-slate-600 font-semibold">{currentMarket.address}</p>
          <p className="text-slate-500 text-[11px]">
            Pickup windows: {currentStall && currentStall.pickupWindows.length ? currentStall.pickupWindows.join(', ') : '—'}
          </p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="pt-1 inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] hover:underline"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open route in Google Maps</span>
          </a>
        </div>

        {/* Operating Window & Hours */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Market Hours</span>
          </div>
          <p className="text-slate-600 font-semibold">{currentMarket.timings}</p>
          <p className="text-slate-500 text-[11px]">
            Operating on: <strong className="text-slate-700">{currentMarket.operatingDays.join(', ')}</strong>
          </p>
          <div className="pt-1">
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize">
              {currentMarket.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
