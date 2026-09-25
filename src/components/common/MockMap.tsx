import React, { useState, useEffect, useRef } from 'react';
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
  KeyRound,
  ShieldCheck,
  LocateFixed,
  Car,
  Footprints,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export interface MockMapProps {
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

/**
 * GoogleMarketMap / MockMap (SRS Section 1.6 & 1.8 Compliant)
 * Dual-Engine Map Component:
 * 1. Live Google Maps Engine (Satellite, Terrain, and Road views with live tiles & directions).
 * 2. Real Google Maps JavaScript API support with custom stall pins and InfoWindows.
 * 3. Native turn-by-turn Google Maps navigation launcher (driving & walking).
 * 4. Geolocation "Locate Me" GPS discovery.
 * 5. Farmer/Admin interactive pin placement for stall coordinates.
 */
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
  height = 'h-96',
}) => {
  const [mapEngine, setMapEngine] = useState<'google-live' | 'pavilion-layout'>('google-live');
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [zoom, setZoom] = useState<number>(16);
  const [markerPos, setMarkerPos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<'map' | 'directions'>(showDirections ? 'directions' : 'map');
  const [travelMode, setTravelMode] = useState<'driving' | 'walking'>('driving');
  const [isLocating, setIsLocating] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return (
      (typeof window !== 'undefined' && localStorage.getItem('marketlink_google_maps_api_key')) ||
      (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
      ''
    );
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const googleMapDivRef = useRef<HTMLDivElement>(null);
  const [googleJsApiLoaded, setGoogleJsApiLoaded] = useState(false);

  // Dynamic Google Maps JS API script loader when apiKey is present
  useEffect(() => {
    if (!apiKey) return;
    if ((window as any).google?.maps) {
      setGoogleJsApiLoaded(true);
      return;
    }

    const scriptId = 'google-maps-api-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,directions`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleJsApiLoaded(true);
      script.onerror = () => {
        console.warn('Failed to load Google Maps JS API, falling back to Live Embed engine.');
        setGoogleJsApiLoaded(false);
      };
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // Mount Google Maps JS instance when loaded
  useEffect(() => {
    if (!googleJsApiLoaded || !googleMapDivRef.current || mapEngine !== 'google-live') return;

    try {
      const google = (window as any).google;
      if (!google?.maps) return;

      const mapType =
        mapStyle === 'satellite'
          ? google.maps.MapTypeId.HYBRID
          : mapStyle === 'terrain'
          ? google.maps.MapTypeId.TERRAIN
          : google.maps.MapTypeId.ROADMAP;

      const map = new google.maps.Map(googleMapDivRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: false,
      });

      // Market Center Marker
      const marketMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: marketName,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: sans-serif; padding: 6px; color: #1e293b; max-width: 220px;">
            <div style="font-size: 11px; font-weight: bold; color: #22c55e;">${marketName}</div>
            <div style="font-size: 12px; font-weight: 700; margin-top: 2px;">${stallName} (${stallNumber})</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">${address}</div>
            <div style="font-size: 10px; color: #059669; font-weight: 600; margin-top: 4px;">✓ Express Pre-Order Pickup Desk</div>
          </div>
        `,
      });

      marketMarker.addListener('click', () => {
        infoWindow.open(map, marketMarker);
      });

      // Interactive Picker for Farmers / Admins
      if (isInteractivePicker) {
        const pickerMarker = new google.maps.Marker({
          position: { lat, lng },
          map,
          draggable: true,
          title: 'Drag to set stall location',
        });

        pickerMarker.addListener('dragend', (e: any) => {
          const newLat = Number(e.latLng.lat().toFixed(6));
          const newLng = Number(e.latLng.lng().toFixed(6));
          onCoordinatesChange?.(newLat, newLng);
        });

        map.addListener('click', (e: any) => {
          const newLat = Number(e.latLng.lat().toFixed(6));
          const newLng = Number(e.latLng.lng().toFixed(6));
          pickerMarker.setPosition(e.latLng);
          onCoordinatesChange?.(newLat, newLng);
        });
      }
    } catch (err) {
      console.error('Error initializing Google Maps JS instance:', err);
    }
  }, [googleJsApiLoaded, lat, lng, mapStyle, zoom, mapEngine, isInteractivePicker, marketName, stallName, stallNumber, address, onCoordinatesChange]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketlink_google_maps_api_key', key);
    }
    setShowKeyConfig(false);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        if (isInteractivePicker) {
          onCoordinatesChange?.(userLat, userLng);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation access denied or timed out:', err);
        // Fallback default coordinates
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
      },
      { timeout: 8000 }
    );
  };

  // Google Maps Native Directions URL (Works everywhere: mobile app + desktop web)
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${marketName}, ${address}`
  )}&travelmode=${travelMode}`;

  // Live Embed URL for Real Google Maps satellite & street view
  const embedGoogleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${marketName}, ${address}`
  )}&t=${mapStyle === 'satellite' ? 'k' : mapStyle === 'terrain' ? 'p' : 'm'}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-black/20 ${className}`}>
      {/* 1. Top Unified Google Maps Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Toolbar: Engine & Layer Selectors */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-white/10 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="hidden sm:inline">Google Maps</span>
            <span className="sm:hidden">Maps</span>
          </div>

          {/* Engine Selector */}
          <div className="flex bg-slate-100 dark:bg-white/10 p-0.5 rounded-xl text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMapEngine('google-live')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapEngine === 'google-live'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Live Map
            </button>
            <button
              type="button"
              onClick={() => setMapEngine('pavilion-layout')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapEngine === 'pavilion-layout'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Stall Booths
            </button>
          </div>

          {/* Map Layer Style Selector */}
          <div className="flex bg-slate-100 dark:bg-white/10 p-0.5 rounded-xl text-[11px] font-semibold ml-1">
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapStyle === 'streets'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Road
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Right Toolbar: Directions Toggle, Geolocation & Open in Google Maps App */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Locate My Current Position */}
          <button
            type="button"
            onClick={handleGeolocate}
            disabled={isLocating}
            className="p-2 bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md rounded-xl text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-xs hover:text-[#22c55e] transition cursor-pointer"
            title="Locate my position (GPS)"
            aria-label="Locate my current position"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin text-[#22c55e]' : ''}`} />
          </button>

          {/* Turn-by-Turn Navigation Launcher */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer active:scale-95 whitespace-nowrap"
            title="Open turn-by-turn route directly in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directions in Google Maps</span>
            <span className="sm:hidden">Route</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>

          {/* Configure Google Maps API Key Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="p-2 bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 shadow-xs transition cursor-pointer"
            title="Configure Google Maps API Key"
            aria-label="Configure Google Maps API Key"
          >
            <KeyRound className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* 2. Google Maps API Key Configuration Banner (Collapsible) */}
      {showKeyConfig && (
        <div className="absolute top-16 left-3 right-3 z-40 bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
              <KeyRound className="w-4 h-4 text-[#22c55e]" />
              <span>Google Maps JavaScript API Key (SRS Requirement)</span>
            </div>
            <button
              onClick={() => setShowKeyConfig(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            MarketLink uses the Google Maps JavaScript API for dynamic stall markers and directions. You can enter your Google Cloud API key below or use the integrated live map engine.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your AIzaSy... Google Maps API Key"
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSaveApiKey(apiKey)}
              className="px-4 py-1.5 bg-[#22c55e] text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-600 transition"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Map Canvas Area */}
      <div className={`w-full ${height} relative overflow-hidden select-none`}>
        {mapEngine === 'google-live' ? (
          <>
            {/* If Google Maps JS API is loaded with API Key */}
            {googleJsApiLoaded && apiKey ? (
              <div ref={googleMapDivRef} className="w-full h-full" />
            ) : (
              /* Live Google Maps Embed Engine (Accurate Satellite & Road Views of actual market address) */
              <iframe
                title={`Google Maps - ${marketName}`}
                src={embedGoogleMapsUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}

            {/* Live Stall Pin & Info Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 pointer-events-auto bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-lg text-xs max-w-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#22c55e]" />
                  <span>{stallName}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ecfbf2] text-[#22c55e] font-bold text-[10px]">
                  {stallNumber}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-tight">
                {marketName} • {address}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium">
                <span>📍 Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
                <span className="text-[#22c55e] font-bold">Pickup Desk Active</span>
              </div>
            </div>
          </>
        ) : (
          /* Pavilion Layout Mode (Architectural Booth Layout matching North Shed A, Booth 14) */
          <div className="w-full h-full relative bg-[#f8fafc] dark:bg-[#121110] flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white dark:bg-[#1e1b18] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#22c55e]" />
                  <span>{marketName} — Pavilion Aisle Map</span>
                </div>
                <span className="text-[11px] text-slate-400">Indoor Shed A</span>
              </div>

              {/* Grid of Market Stalls with Stall #14 Highlighted */}
              <div className="grid grid-cols-4 gap-2.5 text-center text-[11px]">
                {['Stall #1', 'Stall #2', 'Stall #3', 'Stall #4', 'Stall #11', 'Stall #12', 'Stall #13', 'Stall #14', 'Stall #21', 'Stall #22', 'Stall #23', 'Stall #24'].map((s) => {
                  const isTargetStall = s === stallNumber || s === 'Stall #14';
                  return (
                    <div
                      key={s}
                      className={`p-2.5 rounded-xl border font-bold transition-all ${
                        isTargetStall
                          ? 'bg-[#22c55e] text-white border-emerald-600 shadow-md scale-105 animate-pulse'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div>{s}</div>
                      <div className="text-[9px] font-normal opacity-90">
                        {isTargetStall ? 'Your Pickup Stall' : 'Produce Vendor'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Entrance & Parking guidance */}
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Designated Customer Parking Gate 2</span>
                </div>
                <p>
                  Park at North Lot Gate 2, enter Pavilion Shed A. The express pre-order counter is marked with the MarketLink green banner at Booth 14.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Direction Step Guidance (When showDirections is requested) */}
      {showDirections && (
        <div className="bg-white dark:bg-[#1e1b18] border-t border-slate-100 dark:border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#22c55e] flex items-center justify-center shrink-0">
              <CornerDownRight className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">
                Turn-by-Turn Pickup Route Guidance
              </p>
              <p className="text-[11px] text-slate-400">
                Direct route to {marketName} • Follow Market Street into Gate 2 North Lot.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-1.5 transition hover:opacity-90 cursor-pointer text-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Launch Live GPS Navigation</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export const GoogleMarketMap = MockMap;
