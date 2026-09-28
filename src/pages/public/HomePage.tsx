import React from 'react';
import { useAppRouter } from '../../routes/RouterContext';
import { useMarketData } from '../../context/MarketDataContext';
import { ProduceArt } from '../../components/ProduceArt';
import { formatPrice } from '../../services/mappers';
import { ProductItem } from '../../types/market';
import {
  Store,
  MapPin,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  Check,
  Clock,
  Leaf,
  Award,
  Truck,
  DollarSign,
  ChevronRight,
  Navigation,
} from 'lucide-react';

interface HomePageProps {
  onAddToCart: (product: ProductItem, quantity?: number) => void;
  onOpenProductModal: (product: ProductItem) => void;
  favoriteProductIds: string[];
  onToggleFavorite: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  onOpenProductModal,
  favoriteProductIds,
  onToggleFavorite,
}) => {
  const { navigateWebsite } = useAppRouter();
  const { markets, marketProducts, directory, marketStalls } = useMarketData();

  // in-stock products from the best-rated farmers first
  const previewProducts = [...marketProducts]
    .filter((p) => p.availability === 'AVAILABLE' && p.stock > 0)
    .sort((a, b) => (b.farmerRating || 0) - (a.farmerRating || 0))
    .slice(0, 4);
  const stallCount = Object.values(marketStalls).reduce((n, list) => n + list.length, 0);

  return (
    <div className="space-y-20 py-8 sm:py-12">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c2217] via-[#091a12] to-[#050e0a] border border-emerald-900/60 p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#def54d]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#def54d] animate-pulse" />
              <span>Karachi's Official Farm-to-Table Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-[1.1]">
              Farm Fresh Karachi,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] via-[#def54d] to-emerald-400">
                Straight to Your Table
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Connect directly with verified local farmers across Sindh. Explore authentic vendor stalls on Google Maps, check real-time stock, and pre-order seasonal morning harvests with{' '}
              <strong className="text-white font-bold">zero online payment fees</strong>.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigateWebsite('shop')}
                className="px-6 py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Fresh Produce</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => navigateWebsite('markets')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md active:scale-95"
              >
                <MapPin className="w-4 h-4 text-[#def54d]" />
                <span>Find Karachi Stalls on Map</span>
              </button>
            </div>

            {/* Key Statistics */}
            <div className="pt-6 border-t border-emerald-900/60 grid grid-cols-3 gap-6 max-w-lg text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#def54d] font-['Outfit',sans-serif]">{markets.length}</div>
                <div className="text-xs text-slate-400">Farmers Markets</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#def54d] font-['Outfit',sans-serif]">{stallCount}</div>
                <div className="text-xs text-slate-400">Active Vendor Stalls</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#def54d] font-['Outfit',sans-serif]">{directory.length}</div>
                <div className="text-xs text-slate-400">Local Farmers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0c1b14]/70 border border-emerald-900/40 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#22c55e] flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              Google Maps Stall Navigation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find exact booth locations in DHA Phase 6, Empress Market, Gulshan, Hydri, and Malir. Pinpointed GPS guidance right to your grower's counter.
            </p>
          </div>

          <div className="bg-[#0c1b14]/70 border border-emerald-900/40 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#22c55e] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              Harvested Dawn Fresh
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Produce is clipped at 5:00 AM from Malir and Sindh farms. Never held in commercial cold storages or treated with preserving chemicals.
            </p>
          </div>

          <div className="bg-[#0c1b14]/70 border border-emerald-900/40 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#22c55e] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              Zero Online Platform Markup
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pay farm-gate prices in person when you collect. Reserve online, track your order status, and pick up at the stall.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Fresh Produce Preview (With One-Click Add to Cart) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#def54d] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Harvest Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif] mt-1">
              Fresh Arrivals From Local Sindh Farms
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigateWebsite('shop')}
            className="text-xs font-bold text-emerald-400 hover:text-[#def54d] transition flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View Full Catalog ({marketProducts.length} Items)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewProducts.length === 0 && (
            <p className="col-span-full text-xs text-slate-400">No produce listed yet - check back soon.</p>
          )}
          {previewProducts.map((product) => {
            const isFav = favoriteProductIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-[#0c1b14] border border-emerald-900/40 hover:border-emerald-500/50 rounded-3xl p-4 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Art Box */}
                  <div
                    onClick={() => onOpenProductModal(product)}
                    className="relative w-full aspect-square bg-[#07130e] rounded-2xl overflow-hidden flex items-center justify-center p-6 cursor-pointer group-hover:scale-[1.02] transition-transform"
                  >
                    <ProduceArt type={product.imageType || 'cabbage'} src={product.imageUrl} className="w-28 h-28 object-contain" />

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-bold text-emerald-400">
                      ★ {product.farmerRating ? product.farmerRating.toFixed(1) : 'New'}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-slate-300 hover:text-rose-500 transition cursor-pointer"
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="pt-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.area} • {product.farmName}
                    </span>
                    <h4
                      onClick={() => onOpenProductModal(product)}
                      className="font-bold text-white text-sm hover:text-emerald-400 transition cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h4>
                    <p className="text-slate-400 text-[11px] line-clamp-2 leading-tight">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-4 border-t border-emerald-900/40 mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-white font-['Outfit',sans-serif]">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-[10px] text-slate-500">per {product.unit}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddToCart(product, 1)}
                    className="px-3.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Karachi Markets Teaser Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0c2217] to-[#07130e] border border-emerald-900/50 rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[#def54d] text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Interactive Karachi Map Active</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Explore {markets.length} Farmers Markets Near You
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              See every market and its vendor stalls on the map, with operating days, hours and directions to your pickup point.
            </p>

            <button
              type="button"
              onClick={() => navigateWebsite('markets')}
              className="px-6 py-3 bg-[#def54d] hover:bg-lime-400 text-slate-900 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 mx-auto lg:mx-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Markets Map</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Quick List of Karachi Markets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:max-w-md">
            {markets.slice(0, 4).map((m) => (
              <div
                key={m.id}
                onClick={() => navigateWebsite('markets')}
                className="bg-[#0c1b14] hover:bg-[#122b1e] border border-emerald-900/50 p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs group-hover:text-[#def54d] transition line-clamp-1">
                    {m.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400">
                    {m.activeVendorsCount} Stalls
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] mt-1 truncate">{m.address}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400/90 mt-2 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{m.timings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 3-Step Process Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#def54d] uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
            How MarketLink Works
          </h2>
          <p className="text-xs text-slate-400">
            From local Sindh farm harvest to your family's table in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0c1b14] border border-emerald-900/40 p-6 rounded-3xl space-y-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 font-extrabold text-lg flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-white text-base font-['Outfit',sans-serif]">Browse Stalls & Harvest</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore stalls on the Google Map or browse seasonal vegetables and fruits by grower, district, or price point.
            </p>
          </div>

          <div className="bg-[#0c1b14] border border-emerald-900/40 p-6 rounded-3xl space-y-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 font-extrabold text-lg flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-white text-base font-['Outfit',sans-serif]">Pre-Order a Pickup Slot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose a market day and time slot. Stock is reserved with the farmer; modify or cancel until the cutoff time.
            </p>
          </div>

          <div className="bg-[#0c1b14] border border-emerald-900/40 p-6 rounded-3xl space-y-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 font-extrabold text-lg flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-white text-base font-['Outfit',sans-serif]">Collect &amp; Pay at the Stall</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You're notified when your order is ready. Pick it up at the farmer's stall and pay in person - then leave a review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
