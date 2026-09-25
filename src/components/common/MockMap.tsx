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
  X,
  Star,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { StallLocation } from '../../types/market';

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
  // Enhanced Stall Markers & Selection (SRS Section 1.6 & 1.8)
  stalls?: StallLocation[];
  selectedStallId?: string;
  onSelectStall?: (stall: StallLocation) => void;
  onPreOrderStall?: (stall: StallLocation) => void;
}

/**
 * GoogleMarketMap / MockMap (SRS Section 1.6 & 1.8 Compliant)
 * Dual-Engine Map Component:
 * 1. Live Google Maps Engine (Satellite, Terrain, and Road views with live tiles & directions).
 * 2. Real Google Maps JavaScript API support with interactive stall pins and InfoWindows.
 * 3. Clickable stall markers on the map: clicking a marker takes you to that stall's location on the map.
 * 4. Native turn-by-turn Google Maps navigation launcher (driving & walking).
 * 5. Geolocation "Locate Me" GPS discovery.
 * 6. Farmer/Admin interactive pin placement for stall coordinates.
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
  stalls = [],
  selectedStallId,
  onSelectStall,
  onPreOrderStall,
}) => {
  const [mapEngine, setMapEngine] = useState<'google-live' | 'pavilion-layout'>('google-live');
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [zoom, setZoom] = useState<number>(16);
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

  // Fallback stall list if none provided
  const effectiveStalls: StallLocation[] =
    stalls && stalls.length > 0
      ? stalls
      : [
          {
            id: 'stall-default',
            stallNumber: stallNumber || 'Stall #14',
            stallName: stallName || 'Green Valley Organic Stall',
            farmerName: 'Marcus Vance',
            marketId: 'mkt-1',
            marketName,
            category: 'Fresh Produce',
            lat,
            lng,
            rating: 4.9,
            ordersCount: 642,
            phone: '(555) 234-8901',
            description: `Express Pickup Desk at ${marketName}. Located in North Shed A, Booth 14.`,
            specialtyItems: ['Fresh Veggies', 'Organic Harvest', 'Greens'],
            pickupWindows: ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM'],
          },
        ];

  // Currently focused stall (clicking marker pans & zooms directly to that stall)
  const [focusedStall, setFocusedStall] = useState<StallLocation | null>(() => {
    if (selectedStallId) {
      return effectiveStalls.find((s) => s.id === selectedStallId) || null;
    }
    return null;
  });

  // Sync when selectedStallId changes from parent component
  useEffect(() => {
    if (selectedStallId) {
      const match = effectiveStalls.find((s) => s.id === selectedStallId);
      if (match) {
        setFocusedStall(match);
        setZoom(18);
      }
    }
  }, [selectedStallId, effectiveStalls]);

  const googleMapDivRef = useRef<HTMLDivElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const markersMapRef = useRef<Record<string, any>>({});
  const infoWindowRef = useRef<any>(null);
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

      const targetLat = focusedStall ? focusedStall.lat : lat;
      const targetLng = focusedStall ? focusedStall.lng : lng;

      const map = new google.maps.Map(googleMapDivRef.current, {
        center: { lat: targetLat, lng: targetLng },
        zoom: focusedStall ? 18 : zoom,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: false,
      });

      googleMapInstanceRef.current = map;

      // Market Center / Information Entrance Marker
      const marketMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: `${marketName} (Main Entrance)`,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;

      marketMarker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="font-family: sans-serif; padding: 6px; color: #1e293b; max-width: 220px;">
            <div style="font-size: 11px; font-weight: bold; color: #3b82f6;">${marketName}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${address}</div>
            <div style="font-size: 10px; color: #059669; font-weight: 600; margin-top: 4px;">✓ Main Market Entrance & Parking</div>
          </div>
        `);
        infoWindow.open(map, marketMarker);
      });

      // Clear previous markers map
      markersMapRef.current = {};

      // Place each Stall Marker on Google Maps
      effectiveStalls.forEach((stall) => {
        const isSelected = focusedStall?.id === stall.id;

        const stallMarker = new google.maps.Marker({
          position: { lat: stall.lat, lng: stall.lng },
          map,
          title: `${stall.stallName} (${stall.stallNumber})`,
          animation: isSelected ? google.maps.Animation.BOUNCE : google.maps.Animation.DROP,
          label: {
            text: stall.stallNumber.replace('Stall #', '#'),
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 'bold',
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 15 : 12,
            fillColor: isSelected ? '#15803d' : '#22c55e',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: isSelected ? 3 : 2,
          },
        });

        stallMarker.addListener('click', () => {
          // Pan and zoom directly to this stall's location on the map
          map.panTo({ lat: stall.lat, lng: stall.lng });
          map.setZoom(18);
          setFocusedStall(stall);
          onSelectStall?.(stall);

          infoWindow.setContent(`
            <div style="font-family: sans-serif; padding: 6px; color: #1e293b; max-width: 240px;">
              <div style="font-size: 10px; font-weight: bold; color: #22c55e;">${stall.stallNumber} • ${stall.marketName}</div>
              <div style="font-size: 12px; font-weight: 700; margin-top: 2px;">${stall.stallName}</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Farmer: ${stall.farmerName} • ★ ${stall.rating}</div>
              <div style="font-size: 10px; color: #475569; margin-top: 4px; font-weight: 500;">${stall.category}</div>
              <div style="font-size: 10px; color: #059669; font-weight: 600; margin-top: 4px;">✓ Express Pre-Order Pickup Desk</div>
            </div>
          `);
          infoWindow.open(map, stallMarker);
        });

        markersMapRef.current[stall.id] = stallMarker;
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
  }, [
    googleJsApiLoaded,
    lat,
    lng,
    mapStyle,
    mapEngine,
    isInteractivePicker,
    marketName,
    address,
    effectiveStalls,
    onCoordinatesChange,
  ]);

  // Handle stall click: centers map on that stall's location, zooms in, and opens card
  const handleSelectStall = (stall: StallLocation) => {
    setFocusedStall(stall);
    setZoom(18);

    if (googleMapInstanceRef.current && (window as any).google?.maps) {
      googleMapInstanceRef.current.panTo({ lat: stall.lat, lng: stall.lng });
      googleMapInstanceRef.current.setZoom(18);

      const marker = markersMapRef.current[stall.id];
      if (marker && infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="font-family: sans-serif; padding: 6px; color: #1e293b; max-width: 240px;">
            <div style="font-size: 10px; font-weight: bold; color: #22c55e;">${stall.stallNumber} • ${stall.marketName}</div>
            <div style="font-size: 12px; font-weight: 700; margin-top: 2px;">${stall.stallName}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Farmer: ${stall.farmerName} • ★ ${stall.rating}</div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px; font-weight: 500;">${stall.category}</div>
            <div style="font-size: 10px; color: #059669; font-weight: 600; margin-top: 4px;">✓ Express Pre-Order Pickup Desk</div>
          </div>
        `);
        infoWindowRef.current.open(googleMapInstanceRef.current, marker);
      }
    }

    onSelectStall?.(stall);
  };

  const handleClearFocusedStall = () => {
    setFocusedStall(null);
    setZoom(16);
    if (googleMapInstanceRef.current && (window as any).google?.maps) {
      googleMapInstanceRef.current.panTo({ lat, lng });
      googleMapInstanceRef.current.setZoom(16);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    }
  };

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
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
      },
      { timeout: 8000 }
    );
  };

  // Google Maps Native Directions URL (driving/walking to focused stall or market)
  const destinationQuery = focusedStall
    ? `${focusedStall.stallName} (${focusedStall.stallNumber}), ${marketName}, ${address}`
    : `${marketName}, ${address}`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destinationQuery
  )}&travelmode=${travelMode}`;

  // Live Embed URL for Real Google Maps (centers directly on focused stall when selected)
  const embedTarget = focusedStall
    ? `${focusedStall.stallName}, ${marketName}, ${address}`
    : `${marketName}, ${address}`;

  const embedGoogleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    embedTarget
  )}&t=${mapStyle === 'satellite' ? 'k' : mapStyle === 'terrain' ? 'p' : 'm'}&z=${
    focusedStall ? 18 : zoom
  }&ie=UTF8&iwloc=&output=embed`;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-black/20 ${className}`}
    >
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

      {/* 2. Google Maps API Key Configuration Banner */}
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
            MarketLink uses Google Maps JavaScript API for dynamic stall markers and directions. You can enter your Google Cloud API key below or use the integrated live map engine.
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

      {/* 3. Horizontal Stalls Quick Selector Bar (Top of Map) */}
      {effectiveStalls.length > 1 && (
        <div className="absolute top-14 left-3 right-3 z-20 pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={handleClearFocusedStall}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer backdrop-blur-md shadow-xs flex items-center gap-1 ${
              !focusedStall
                ? 'bg-[#22c55e] text-white'
                : 'bg-white/90 dark:bg-black/70 text-slate-700 dark:text-slate-300 hover:bg-white border border-slate-200/60 dark:border-white/10'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>All Stalls ({effectiveStalls.length})</span>
          </button>

          {effectiveStalls.map((s) => {
            const isSelected = focusedStall?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStall(s)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#22c55e] text-white ring-2 ring-emerald-400/60 shadow-md scale-105'
                    : 'bg-white/90 dark:bg-black/70 text-slate-700 dark:text-slate-300 hover:bg-white border border-slate-200/60 dark:border-white/10'
                }`}
                title={`Click to zoom and take map to ${s.stallName}`}
              >
                <Store className="w-3 h-3" />
                <span>
                  {s.stallNumber}: {s.stallName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Main Map Canvas Area */}
      <div className={`w-full ${height} relative overflow-hidden select-none`}>
        {mapEngine === 'google-live' ? (
          <>
            {/* If Google Maps JS API is loaded with API Key */}
            {googleJsApiLoaded && apiKey ? (
              <div ref={googleMapDivRef} className="w-full h-full" />
            ) : (
              /* Live Google Maps Embed Engine (Centers on market or selected stall) */
              <div className="w-full h-full relative">
                <iframe
                  title={`Google Maps - ${marketName}`}
                  src={embedGoogleMapsUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Interactive Stall Markers Overlay Placed Over Live Google Map */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {effectiveStalls.map((stall, idx) => {
                    const isSelected = focusedStall?.id === stall.id;

                    // Compute relative viewport percentage based on coordinate offsets
                    const dLat = stall.lat - lat;
                    const dLng = stall.lng - lng;
                    const scale = focusedStall ? 0.0012 : 0.003;
                    const left = Math.max(10, Math.min(90, 50 + (dLng / scale) * 45));
                    const top = Math.max(22, Math.min(80, 50 - (dLat / scale) * 38));

                    return (
                      <div
                        key={stall.id}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: 'translate(-50%, -100%)',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectStall(stall);
                        }}
                        className={`absolute pointer-events-auto cursor-pointer group transition-all duration-300 ${
                          isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-110'
                        }`}
                        title={`Click to focus on ${stall.stallName} (${stall.stallNumber})`}
                      >
                        {/* Marker Pin Head */}
                        <div
                          className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-white ring-4 ring-emerald-400/60 animate-bounce'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-emerald-500/80 hover:bg-emerald-50'
                          }`}
                        >
                          <Store className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#22c55e]'}`} />
                          <span className="text-[11px] whitespace-nowrap">{stall.stallNumber}</span>

                          {/* Hover Tooltip */}
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded-md font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
                            {stall.stallName}
                          </div>
                        </div>

                        {/* Marker Pin Point */}
                        <div className="w-2 h-2 bg-emerald-600 rotate-45 mx-auto -mt-1 shadow-sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Floating Stall Info Card Overlay (When clicked or focused) */}
            {focusedStall ? (
              <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto z-30 pointer-events-auto bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md p-4 rounded-3xl border border-emerald-500/30 shadow-2xl text-xs max-w-sm space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#ecfbf2] text-[#22c55e] font-bold text-[10px]">
                        {focusedStall.stallNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {focusedStall.marketName}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {focusedStall.stallName}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearFocusedStall}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition"
                    title="Close stall detail & return to overview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Farmer & Rating */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Grower: <strong className="text-slate-700 dark:text-slate-300">{focusedStall.farmerName}</strong></span>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{focusedStall.rating} ({focusedStall.ordersCount} orders)</span>
                  </div>
                </div>

                {/* Description & Category */}
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                  {focusedStall.description}
                </p>

                {/* Specialty Produce Tags */}
                {focusedStall.specialtyItems && focusedStall.specialtyItems.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {focusedStall.specialtyItems.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Coordinates & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
                  <span className="text-[10px] text-slate-400">
                    📍 {focusedStall.lat.toFixed(4)}, {focusedStall.lng.toFixed(4)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 text-[11px] transition shadow-xs"
                      title="Navigate directly to this stall in Google Maps"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </a>

                    {onPreOrderStall && (
                      <button
                        type="button"
                        onClick={() => onPreOrderStall(focusedStall)}
                        className="px-2.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center gap-1 text-[11px] transition hover:opacity-90"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Pre-Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Overview Badge when no single stall is focused */
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 pointer-events-auto bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-lg text-xs max-w-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-[#22c55e]" />
                    <span>{marketName}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ecfbf2] text-[#22c55e] font-bold text-[10px]">
                    {effectiveStalls.length} Active Stalls
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-tight">
                  {address}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium">
                  <span>📍 Click any stall pin on map to view location</span>
                  <span className="text-[#22c55e] font-bold">Live GPS Active</span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Pavilion Booth Layout Mode (Architectural Booth Grid) */
          <div className="w-full h-full relative bg-[#f8fafc] dark:bg-[#121110] flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-lg bg-white dark:bg-[#1e1b18] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#22c55e]" />
                  <span>{marketName} — Pavilion Aisle Map</span>
                </div>
                <span className="text-[11px] text-slate-400">Indoor Shed A</span>
              </div>

              {/* Grid of Market Stalls with Click Action */}
              <div className="grid grid-cols-4 gap-2.5 text-center text-[11px]">
                {[
                  'Stall #1',
                  'Stall #2',
                  'Stall #04',
                  'Stall #07',
                  'Stall #11',
                  'Stall #12',
                  'Stall #14',
                  'Stall #16',
                  'Stall #19',
                  'Stall #21',
                  'Stall #22',
                  'Stall #23',
                ].map((s) => {
                  const matchingStall = effectiveStalls.find(
                    (st) =>
                      st.stallNumber.toLowerCase() === s.toLowerCase() ||
                      st.stallNumber.replace('Stall #0', 'Stall #') === s
                  );
                  const isSelected = focusedStall?.stallNumber.toLowerCase() === s.toLowerCase();

                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        if (matchingStall) {
                          handleSelectStall(matchingStall);
                        }
                      }}
                      className={`p-2.5 rounded-xl border font-bold transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#22c55e] text-white border-emerald-600 shadow-md scale-105 ring-2 ring-emerald-400/60'
                          : matchingStall
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-white hover:border-emerald-400'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
                      }`}
                    >
                      <div className="truncate">{s}</div>
                      <div className="text-[9px] font-normal opacity-90 truncate">
                        {matchingStall ? matchingStall.stallName.split(' ')[0] : 'Open Booth'}
                      </div>
                    </button>
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

      {/* 6. Bottom Direction Step Guidance */}
      {showDirections && (
        <div className="bg-white dark:bg-[#1e1b18] border-t border-slate-100 dark:border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#22c55e] flex items-center justify-center shrink-0">
              <CornerDownRight className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">
                {focusedStall
                  ? `Route to ${focusedStall.stallName} (${focusedStall.stallNumber})`
                  : `Turn-by-Turn Route Guidance: ${marketName}`}
              </p>
              <p className="text-[11px] text-slate-400">
                {focusedStall
                  ? `Located at ${address}. Proceed to ${focusedStall.stallNumber} express pickup.`
                  : `Direct route to ${marketName} • Follow Market Street into Gate 2 North Lot.`}
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
