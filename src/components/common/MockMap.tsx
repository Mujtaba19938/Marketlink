import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Store,
  Clock,
  CornerDownRight,
  ExternalLink,
} from 'lucide-react';

interface MockMapProps {
  lat: number;
  lng: number;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  isInteractivePicker?: boolean;
  marketName?: string;
  stallName?: string;
  stallNumber?: string;
  address?: string;
  showDirections?: boolean;
  className?: string;
  height?: string;
}

export const MockMap: React.FC<MockMapProps> = ({
  lat,
  lng,
  onCoordinatesChange,
  isInteractivePicker = false,
  marketName = 'Downtown Fresh Pavilion',
  stallName = 'Green Valley Organic Stall #14',
  stallNumber = 'Stall #14',
  address = '400 Civic Center Plaza, Metro City',
  showDirections = false,
  className = '',
  height = 'h-72',
}) => {
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [zoom, setZoom] = useState<number>(15);
  const [markerPos, setMarkerPos] = useState({ x: 50, y: 48 });
  const [activeTab, setActiveTab] = useState<'map' | 'directions'>(showDirections ? 'directions' : 'map');

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractivePicker) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMarkerPos({ x, y });

    // Derive mock delta coordinates around base lat/lng
    const deltaLat = ((50 - y) / 1000).toFixed(4);
    const deltaLng = ((x - 50) / 1000).toFixed(4);
    const newLat = Number((lat + parseFloat(deltaLat)).toFixed(4));
    const newLng = Number((lng + parseFloat(deltaLng)).toFixed(4));

    if (onCoordinatesChange) {
      onCoordinatesChange(newLat, newLng);
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 ${className}`}>
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Provider Tag & Style Selector */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xs border border-slate-200/80 pointer-events-auto">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-semibold text-slate-700 mr-1">OpenStreetMap / Google Maps</span>
          <div className="flex rounded-md bg-slate-100 p-0.5 text-[10px]">
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-1.5 py-0.5 rounded ${
                mapStyle === 'streets' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Road
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-1.5 py-0.5 rounded ${
                mapStyle === 'satellite' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('terrain')}
              className={`px-1.5 py-0.5 rounded ${
                mapStyle === 'terrain' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Terrain
            </button>
          </div>
        </div>

        {/* Directions / Map Toggle for Customer View */}
        {showDirections && (
          <div className="flex bg-white/90 backdrop-blur-md p-0.5 rounded-xl shadow-xs border border-slate-200/80 pointer-events-auto text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'map' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map Pin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('directions')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'directions' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Directions (ETA 8m)
            </button>
          </div>
        )}
      </div>

      {/* Map Surface / Canvas */}
      <div
        onClick={handleMapClick}
        className={`w-full ${height} relative overflow-hidden select-none ${
          isInteractivePicker ? 'cursor-crosshair' : 'cursor-grab'
        } ${
          mapStyle === 'satellite'
            ? 'bg-[#1e293b]'
            : mapStyle === 'terrain'
            ? 'bg-[#edf3e8]'
            : 'bg-[#f1f5f9]'
        }`}
      >
        {/* SVG Vector Map Rendering */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover transition-opacity duration-300"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="streetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="100%" stopColor="#bbf7d0" />
            </linearGradient>
          </defs>

          {/* Background Grid Base */}
          <rect width="800" height="500" fill={mapStyle === 'satellite' ? '#1a2233' : '#f8fafc'} />
          <rect width="800" height="500" fill="url(#streetGrid)" opacity={mapStyle === 'satellite' ? 0.2 : 0.7} />

          {/* Green Park Areas */}
          <path
            d="M 60 120 C 140 100, 220 160, 280 140 C 340 120, 360 220, 310 280 C 260 340, 120 300, 80 240 Z"
            fill={mapStyle === 'satellite' ? '#143823' : 'url(#parkGrad)'}
            opacity="0.8"
          />
          <path
            d="M 520 40 C 620 50, 720 110, 750 190 C 700 240, 600 200, 560 140 Z"
            fill={mapStyle === 'satellite' ? '#143823' : 'url(#parkGrad)'}
            opacity="0.6"
          />

          {/* River Stream */}
          <path
            d="M -20 380 Q 200 320, 420 360 T 820 310"
            fill="none"
            stroke={mapStyle === 'satellite' ? '#0f314d' : 'url(#riverGrad)'}
            strokeWidth="38"
            strokeLinecap="round"
          />

          {/* City Road Network */}
          <g stroke={mapStyle === 'satellite' ? '#475569' : '#cbd5e1'} strokeWidth="12" strokeLinecap="round" fill="none">
            {/* Major Arteries */}
            <path d="M -20 180 L 820 180" stroke={mapStyle === 'satellite' ? '#64748b' : '#fdba74'} strokeWidth="14" />
            <path d="M 400 -20 L 400 520" stroke={mapStyle === 'satellite' ? '#64748b' : '#fdba74'} strokeWidth="14" />
            <path d="M 120 -20 L 120 520" />
            <path d="M 640 -20 L 640 520" />
            <path d="M -20 320 L 820 320" strokeWidth="8" />
            <path d="M 220 80 Q 340 40, 460 80 T 680 80" strokeWidth="8" />
          </g>

          {/* Downtown Market Pavilion Building Outline */}
          <rect
            x="360"
            y="200"
            width="120"
            height="85"
            rx="10"
            fill={mapStyle === 'satellite' ? '#334155' : '#fef08a'}
            stroke={mapStyle === 'satellite' ? '#059669' : '#ca8a04'}
            strokeWidth="3"
            opacity="0.9"
          />
          <text
            x="420"
            y="248"
            textAnchor="middle"
            fill={mapStyle === 'satellite' ? '#f8fafc' : '#713f12'}
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {marketName}
          </text>

          {/* Route Directions Polyline (Customer Navigation) */}
          {showDirections && (
            <g>
              {/* User Starting Point */}
              <circle cx="160" cy="180" r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="3" />
              {/* Animated Dashed Route */}
              <path
                d="M 160 180 L 400 180 L 400 240 L 420 240"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
              {/* Route Pulsing Pulse */}
              <circle cx="420" cy="240" r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
            </g>
          )}
        </svg>

        {/* Interactive Pin Marker */}
        <div
          style={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-full z-10 transition-transform duration-150 pointer-events-none group"
        >
          <div className="flex flex-col items-center">
            {/* Tooltip Card */}
            <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xl mb-1.5 whitespace-nowrap flex items-center gap-1.5 animate-in fade-in">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>{stallName}</span>
              <span className="text-emerald-400 font-bold">({stallNumber})</span>
            </div>

            {/* Glowing Map Pin Icon */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/30 animate-ping absolute inset-0 -m-1" />
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Click Tip Overlay */}
        {isInteractivePicker && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Click anywhere on the map to set your stall GPS coordinates</span>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 1, 18))}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 1, 10))}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Coordinate & Directions Info Footer */}
      <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">{address}</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
          >
            Open in Google Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Turn-by-turn Step Drawer when in Directions Mode */}
      {showDirections && activeTab === 'directions' && (
        <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Pickup Route Guide (Civic Plaza Gate 2)
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">
              Est. Arrival: 8 mins • 1.2 mi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-600">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-800">Enter Civic Plaza</p>
                <p className="text-[11px] text-slate-500">Free 30-min curbside pre-order parking at Lot B.</p>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-800">Walk into North Shed</p>
                <p className="text-[11px] text-slate-500">Follow the green banners toward Aisle 3.</p>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-800">Arrive at {stallNumber}</p>
                <p className="text-[11px] text-slate-500">Show Order QR / ID at express counter.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
