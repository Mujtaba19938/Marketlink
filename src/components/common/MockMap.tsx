import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

// Convert geographic coordinates to Web Mercator world pixel coordinates at given zoom
function latLngToWorld(lat: number, lng: number, zoom: number) {
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.max(-0.9999, Math.min(0.9999, sinLat));
  const y = (0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI)) * scale;
  return { x, y };
}

// Convert Web Mercator world pixel coordinates back to geographic coordinates
function worldToLatLng(x: number, y: number, zoom: number) {
  const scale = 256 * Math.pow(2, zoom);
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

/**
 * GoogleMarketMap / MockMap (SRS Section 1.6 & 1.8 Compliant)
 * Real Google Maps Engine:
 * - Karachi Default Coordinates: DHA Phase 6, Empress Market Saddar, Gulshan, Hydri, Malir.
 * - Map Pan & Drag: Panning the map moves the map smoothly, while all stall indicators
 *   stay firmly locked to their exact street coordinates.
 * - Marker Click Stability: Clicking an indicator selects that stall, opens the detail card,
 *   and DOES NOT move or reload the map.
 * - Pure Google Maps Engine: Uses official Google Maps tiles & services with zero extra npm packages.
 */
export const MockMap: React.FC<MockMapProps> = ({
  lat = 24.8015,
  lng = 67.0682,
  onCoordinatesChange,
  isInteractivePicker = false,
  marketName = 'DHA & Clifton Fresh Pavilion',
  stallName = 'Green Valley Organic Stall #14',
  stallNumber = 'Stall #14',
  address = 'Khayaban-e-Shahbaz, Phase 6, DHA, Karachi',
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
  const [travelMode, setTravelMode] = useState<'driving' | 'walking'>('driving');
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Map viewport dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 420 });

  // Map center coordinates state (only updated by dragging/zooming, NOT by clicking indicators)
  const [viewCenter, setViewCenter] = useState<{ lat: number; lng: number }>({ lat, lng });

  // Track parent market lat/lng changes
  useEffect(() => {
    setViewCenter({ lat, lng });
  }, [lat, lng]);

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 420,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Dragging state for map canvas
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startCenter: { lat: number; lng: number } }>({
    clientX: 0,
    clientY: 0,
    startCenter: { lat, lng },
  });

  // Effective stalls fallback
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
            phone: '(021) 3584-8901',
            description: `Express Pickup Desk at ${marketName}. Located in Phase 6 DHA Pavilion, Booth 14.`,
            specialtyItems: ['Sindh Fresh Carrots', 'Crisp Cabbage', 'Organic Palak'],
            pickupWindows: ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM'],
          },
        ];

  // Currently focused stall
  const [focusedStall, setFocusedStall] = useState<StallLocation | null>(() => {
    if (selectedStallId) {
      return effectiveStalls.find((s) => s.id === selectedStallId) || null;
    }
    return null;
  });

  // Sync selectedStallId from props without moving the map
  useEffect(() => {
    if (selectedStallId) {
      const match = effectiveStalls.find((s) => s.id === selectedStallId);
      if (match) {
        setFocusedStall(match);
      }
    }
  }, [selectedStallId, effectiveStalls]);

  // STALL SELECTION: Updates selected stall state and opens card WITHOUT moving the map!
  const handleSelectStall = useCallback((stall: StallLocation) => {
    setFocusedStall(stall);
    onSelectStall?.(stall);
    // Crucially: DOES NOT call setViewCenter or pan the map. The map stays in place!
  }, [onSelectStall]);

  const handleClearFocusedStall = () => {
    setFocusedStall(null);
  };

  // Center map on the default market coordinates if user explicitly clicks reset
  const handleResetMapCenter = () => {
    setViewCenter({ lat, lng });
  };

  // Drag Handlers for Panning the Map
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startCenter: { ...viewCenter },
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    const startWorld = latLngToWorld(
      dragStartRef.current.startCenter.lat,
      dragStartRef.current.startCenter.lng,
      zoom
    );

    // Moving mouse to right (dx > 0) means map shifts right, so center moves left (worldX decreases)
    const newWorldX = startWorld.x - dx;
    const newWorldY = startWorld.y - dy;

    const newCenter = worldToLatLng(newWorldX, newWorldY, zoom);
    setViewCenter(newCenter);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }
  };

  // Interactive picker click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractivePicker || !onCoordinatesChange || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    const centerWorld = latLngToWorld(viewCenter.lat, viewCenter.lng, zoom);
    const clickWorldX = centerWorld.x + (clickScreenX - dimensions.width / 2);
    const clickWorldY = centerWorld.y + (clickScreenY - dimensions.height / 2);

    const picked = worldToLatLng(clickWorldX, clickWorldY, zoom);
    const newLat = Number(picked.lat.toFixed(6));
    const newLng = Number(picked.lng.toFixed(6));
    onCoordinatesChange(newLat, newLng);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(19, z + 1));
  const handleZoomOut = () => setZoom((z) => Math.max(13, z - 1));

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else if (e.deltaY > 0) {
      handleZoomOut();
    }
  };

  // Geolocate Handler
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
        setViewCenter({ lat: userLat, lng: userLng });
        if (isInteractivePicker) {
          onCoordinatesChange?.(userLat, userLng);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation access denied or timed out:', err);
        // Default to Karachi DHA coordinates
        setUserLocation({ lat: 24.8015, lng: 67.0682 });
        setViewCenter({ lat: 24.8015, lng: 67.0682 });
      },
      { timeout: 8000 }
    );
  };

  // Google Maps Directions & Link
  const destinationQuery = focusedStall
    ? `${focusedStall.stallName}, ${marketName}, Karachi`
    : `${marketName}, Karachi`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destinationQuery
  )}&travelmode=${travelMode}`;

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    focusedStall ? `${focusedStall.lat},${focusedStall.lng}` : `${lat},${lng}`
  )}`;

  // Calculate Google Maps visible tile grid
  const centerWorld = useMemo(() => latLngToWorld(viewCenter.lat, viewCenter.lng, zoom), [viewCenter, zoom]);

  const minX = centerWorld.x - dimensions.width / 2;
  const maxX = centerWorld.x + dimensions.width / 2;
  const minY = centerWorld.y - dimensions.height / 2;
  const maxY = centerWorld.y + dimensions.height / 2;

  const tileMinX = Math.floor(minX / 256);
  const tileMaxX = Math.floor(maxX / 256);
  const tileMinY = Math.floor(minY / 256);
  const tileMaxY = Math.floor(maxY / 256);

  // Google Maps tile layer parameter
  // 'm' = Standard Road Map, 'y' = Hybrid Satellite with Street Labels, 'p' = Terrain
  const googleTileLayer = mapStyle === 'satellite' ? 'y' : mapStyle === 'terrain' ? 'p' : 'm';

  const visibleTiles: { x: number; y: number; left: number; top: number; key: string }[] = [];
  const maxTile = Math.pow(2, zoom);

  for (let ty = tileMinY; ty <= tileMaxY; ty++) {
    for (let tx = tileMinX; tx <= tileMaxX; tx++) {
      if (ty >= 0 && ty < maxTile) {
        const wrappedTx = ((tx % maxTile) + maxTile) % maxTile;
        visibleTiles.push({
          x: wrappedTx,
          y: ty,
          left: tx * 256 - minX,
          top: ty * 256 - minY,
          key: `${zoom}-${wrappedTx}-${ty}`,
        });
      }
    }
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm bg-slate-900 ${className}`}
    >
      {/* 1. Top Unified Google Maps Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Toolbar: Engine & Layer Selectors */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-white/10 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Google Maps</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">• Karachi Live</span>
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
              Interactive Map
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
              Pavilion Booths
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
            <button
              type="button"
              onClick={() => setMapStyle('terrain')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapStyle === 'terrain'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Terrain
            </button>
          </div>
        </div>

        {/* Right Toolbar: Zoom In/Out, Reset Center, Geolocation, Open in Google Maps */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Zoom Buttons */}
          <div className="flex bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-[1px] bg-slate-200 dark:bg-white/10" />
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Map Center */}
          <button
            type="button"
            onClick={handleResetMapCenter}
            className="p-2 bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md rounded-xl text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-xs hover:text-[#22c55e] transition cursor-pointer"
            title="Re-center map on market"
            aria-label="Re-center map on market"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Locate GPS */}
          <button
            type="button"
            onClick={handleGeolocate}
            disabled={isLocating}
            className="p-2 bg-white/95 dark:bg-[#1e1b18]/95 backdrop-blur-md rounded-xl text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-xs hover:text-[#22c55e] transition cursor-pointer"
            title="Locate my position (GPS)"
            aria-label="Locate my position"
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
        </div>
      </div>

      {/* 2. Horizontal Stalls Quick Selector Bar (Top of Map) */}
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
            <span>All Karachi Stalls ({effectiveStalls.length})</span>
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
                title={`Click to view ${s.stallName} details`}
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

      {/* 3. Main Map Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className={`w-full ${height} relative overflow-hidden select-none bg-slate-900 cursor-grab active:cursor-grabbing`}
      >
        {mapEngine === 'google-live' ? (
          <div
            className="w-full h-full relative overflow-hidden touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={handleCanvasClick}
          >
            {/* Real Google Maps Raster Tiles: Smoothly Pan with Drag */}
            <div className="absolute inset-0 pointer-events-none">
              {visibleTiles.map((tile) => (
                <img
                  key={tile.key}
                  src={`https://mt1.google.com/vt/lyrs=${googleTileLayer}&x=${tile.x}&y=${tile.y}&z=${zoom}`}
                  alt=""
                  className="absolute w-[256px] h-[256px] select-none pointer-events-none"
                  style={{
                    left: `${tile.left}px`,
                    top: `${tile.top}px`,
                  }}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    // Fallback to OSM tiles if Google tile service is blocked
                    const target = e.currentTarget;
                    if (!target.src.includes('openstreetmap')) {
                      target.src = `https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`;
                    }
                  }}
                />
              ))}
            </div>

            {/* Google Watermark & Attributions */}
            <div className="absolute bottom-2 right-2 pointer-events-none z-10 flex items-center gap-1.5 text-[10px] text-white/80 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
              <span className="font-bold tracking-tight">Google</span>
              <span className="text-[9px] text-white/60">Imagery & Maps © Google</span>
            </div>

            {/* Market Center Anchor Pin (Karachi Market Entrance) */}
            {(() => {
              const marketWorld = latLngToWorld(lat, lng, zoom);
              const marketScreenX = marketWorld.x - minX;
              const marketScreenY = marketWorld.y - minY;

              // Only render if in visible buffer
              if (
                marketScreenX < -60 ||
                marketScreenX > dimensions.width + 60 ||
                marketScreenY < -60 ||
                marketScreenY > dimensions.height + 60
              ) {
                return null;
              }

              return (
                <div
                  key="market-center-marker"
                  style={{
                    left: `${marketScreenX}px`,
                    top: `${marketScreenY}px`,
                    transform: 'translate(-50%, -100%)',
                  }}
                  className="absolute pointer-events-auto z-20 cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedStall(null);
                  }}
                  title={`${marketName} (Main Entrance)`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[11px] shadow-lg border-2 border-white ring-2 ring-blue-400/50">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">{marketName.split(' ')[0]}</span>
                    </div>
                    <div className="w-2.5 h-2.5 bg-blue-600 rotate-45 -mt-1 shadow-sm border-r border-b border-white" />
                  </div>
                </div>
              );
            })()}

            {/* Interactive Stall Markers: Pinned Strictly to Coordinates (Only map moves during drag!) */}
            <div className="absolute inset-0 pointer-events-none">
              {effectiveStalls.map((stall) => {
                const isSelected = focusedStall?.id === stall.id;

                // Calculate exact pixel position relative to current map viewport
                const stallWorld = latLngToWorld(stall.lat, stall.lng, zoom);
                const screenX = stallWorld.x - minX;
                const screenY = stallWorld.y - minY;

                // If far outside screen view, don't render to optimize DOM
                if (
                  screenX < -100 ||
                  screenX > dimensions.width + 100 ||
                  screenY < -100 ||
                  screenY > dimensions.height + 100
                ) {
                  return null;
                }

                return (
                  <div
                    key={stall.id}
                    style={{
                      left: `${screenX}px`,
                      top: `${screenY}px`,
                      transform: 'translate(-50%, -100%)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStall(stall);
                    }}
                    className={`absolute pointer-events-auto cursor-pointer group transition-transform ${
                      isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                    }`}
                    title={`Click to view ${stall.stallName} (${stall.stallNumber})`}
                  >
                    {/* Marker Pin Badge */}
                    <div
                      className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#22c55e] text-white border-white ring-4 ring-emerald-400/60 shadow-xl'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Store className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#22c55e]'}`} />
                      <span className="text-[11px] whitespace-nowrap">{stall.stallNumber}</span>

                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded-md font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
                        {stall.stallName}
                      </div>
                    </div>

                    {/* Marker Pin Point */}
                    <div
                      className={`w-2 h-2 rotate-45 mx-auto -mt-1 shadow-sm ${
                        isSelected ? 'bg-[#22c55e]' : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Draggable Coordinate Picker Pin (For Admin/Farmer Coordinate Editing) */}
            {isInteractivePicker && (
              <div
                style={{
                  left: `${latLngToWorld(lat, lng, zoom).x - minX}px`,
                  top: `${latLngToWorld(lat, lng, zoom).y - minY}px`,
                  transform: 'translate(-50%, -100%)',
                }}
                className="absolute pointer-events-none z-40"
              >
                <div className="flex flex-col items-center animate-bounce">
                  <div className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] shadow-md">
                    Selected Stall Pin
                  </div>
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-300" />
                  <div className="w-1.5 h-1.5 bg-amber-500 rotate-45 -mt-1" />
                </div>
              </div>
            )}

            {/* 4. Floating Stall Info Card (Opens when an indicator is clicked) */}
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
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition cursor-pointer"
                    title="Close stall detail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Farmer & Rating */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    Grower: <strong className="text-slate-700 dark:text-slate-300">{focusedStall.farmerName}</strong>
                  </span>
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
                    📍 Karachi ({focusedStall.lat.toFixed(4)}, {focusedStall.lng.toFixed(4)})
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 text-[11px] transition shadow-xs cursor-pointer"
                      title="Open Google Maps Route"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </a>

                    {onPreOrderStall && (
                      <button
                        type="button"
                        onClick={() => onPreOrderStall(focusedStall)}
                        className="px-2.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center gap-1 text-[11px] transition hover:opacity-90 cursor-pointer"
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
                    {effectiveStalls.length} Karachi Stalls
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-tight">
                  {address}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium">
                  <span>📍 Drag map to pan • Click stall pins</span>
                  <span className="text-[#22c55e] font-bold">Google Maps Live</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Pavilion Booth Layout Mode (Architectural Booth Grid) */
          <div className="w-full h-full relative bg-[#f8fafc] dark:bg-[#121110] flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-lg bg-white dark:bg-[#1e1b18] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#22c55e]" />
                  <span>{marketName} — Pavilion Aisle Map</span>
                </div>
                <span className="text-[11px] text-slate-400">Karachi Indoor Hall</span>
              </div>

              {/* Grid of Market Stalls with Click Action */}
              <div className="grid grid-cols-4 gap-2.5 text-center text-[11px]">
                {[
                  'Stall #14',
                  'Stall #04',
                  'Stall #07',
                  'Stall #19',
                  'Stall #23',
                  'Stall #08',
                  'Stall #12',
                  'Stall #16',
                  'Stall #03',
                  'Stall #11',
                  'Stall #22',
                  'Stall #05',
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
                  <span>Karachi Pavilion Customer Parking Gate 2</span>
                </div>
                <p>
                  Designated pre-order customer parking at Gate 2. The express pickup desk is marked with the MarketLink green flag.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Direction Step Guidance */}
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
                  : `Route Guidance: ${marketName}, Karachi`}
              </p>
              <p className="text-[11px] text-slate-400">
                {focusedStall
                  ? `Located at ${address}. Proceed to ${focusedStall.stallNumber} express counter.`
                  : `Direct route to ${marketName} • Follow Shahbaz / Khayaban commercial lane into Gate 2.`}
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
              <span>Launch Live Google Maps GPS</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export const GoogleMarketMap = MockMap;
