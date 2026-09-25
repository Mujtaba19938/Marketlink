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
  initialMarketId = 'mkt-1',
  initialStallId,
}) => {
  const { markets, stallSettings, getStallsForMarket } = useMarketData();
  const [selectedMarketId, setSelectedMarketId] = useState(initialMarketId);

  const marketStalls = getStallsForMarket(selectedMarketId);
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>(
    initialStallId || marketStalls[0]?.id
  );

  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const currentStall = marketStalls.find((s) => s.id === selectedStallId) || marketStalls[0];

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
            Real-time Google Maps directions to your pre-order pickup stall, designated parking gates, and pavilion aisles.
          </p>
        </div>

        {/* Market Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Select Market:</span>
          <select
            value={selectedMarketId}
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
              {currentStall ? currentStall.stallNumber : 'Stall #14'}
            </span>
          </div>
          <p className="text-slate-800 font-bold text-xs">
            {currentStall ? currentStall.stallName : stallSettings.stallName}
          </p>
          <p className="text-slate-500 text-[11px] leading-tight">
            {currentStall ? currentStall.description : 'Express pre-order pickup desk marked with green banner.'}
          </p>
          <div className="pt-1 flex items-center justify-between text-slate-500 text-[11px]">
            <span>Grower: <strong className="text-slate-700">{currentStall ? currentStall.farmerName : 'Marcus Vance'}</strong></span>
            <span>★ {currentStall ? currentStall.rating : 4.9}</span>
          </div>
        </div>

        {/* Curbside Parking & Gate */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Designated Pre-Order Parking</span>
          </div>
          <p className="text-slate-600 font-semibold">Civic Center Gate 2 • Lot B</p>
          <p className="text-slate-500 text-[11px]">
            First 30 minutes are complimentary for MarketLink pre-order badge holders. Present order QR code.
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EV Charging Stations Available</span>
          </div>
        </div>

        {/* Operating Window & Hours */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Stall Pickup Hours</span>
          </div>
          <p className="text-slate-600 font-semibold">{currentMarket.timings}</p>
          <p className="text-slate-500 text-[11px]">
            Operating on: <strong className="text-slate-700">{currentMarket.operatingDays.join(', ')}</strong>
          </p>
          <div className="pt-1">
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              Weekend Harvest Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
