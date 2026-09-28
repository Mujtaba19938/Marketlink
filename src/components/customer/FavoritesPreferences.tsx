import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProduceArt } from '../ProduceArt';
import { Badge } from '../common/Badge';
import { ProductItem } from '../../types/market';
import { formatPrice } from '../../services/mappers';
import {
  Heart,
  Star,
  MapPin,
  Clock,
  Bell,
  Building2,
  Navigation,
  CheckCircle,
  AlertCircle,
  Tractor,
  ExternalLink,
} from 'lucide-react';

export const FavoritesPreferences: React.FC<{
  onSelectMarketMap?: (marketId: string) => void;
  onOpenProduct?: (product: ProductItem) => void;
}> = ({ onSelectMarketMap, onOpenProduct }) => {
  const { customerFavorites, toggleFavorite, savedMarkets, toggleSavedMarket, marketProducts, addToCart } = useMarketData();

  const emptyState = (text: string) => (
    <div className="col-span-full text-center py-10 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">{text}</div>
  );
  const [activeTab, setActiveTab] = useState<'products' | 'farmers' | 'markets'>('products');

  const favoriteProducts = customerFavorites.filter((f) => f.type === 'product');
  const favoriteFarmers = customerFavorites.filter((f) => f.type === 'farmer');

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Favorites & Saved Preferences</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Saved products get restock alerts. Save farmers and markets for quick access.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Favorite Products ({favoriteProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('farmers')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'farmers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Favorite Farmers ({favoriteFarmers.length})
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'markets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Markets ({savedMarkets.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Favorite Products Grid */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteProducts.length === 0 && emptyState('No favorite products yet. Tap the heart on any product to save it.')}
          {favoriteProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/30 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 text-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white">
                    {prod.imageType ? (
                      <ProduceArt type={prod.imageType as any} src={prod.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        {prod.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(prod.id, 'product')}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4
                      className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer"
                      onClick={() => {
                        const item = marketProducts.find((p) => p.id === prod.id);
                        if (item) onOpenProduct?.(item);
                      }}
                    >
                      {prod.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">{prod.subtitle}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatPrice(prod.price)} <span className="text-slate-400 font-normal text-xs">/ {prod.unit}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {prod.rating ? prod.rating.toFixed(1) : 'New'}
                  </span>
                </div>
              </div>

              {/* Restock Notification Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Bell className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span className="text-emerald-700 font-semibold">{prod.restockStatus}</span>
                </div>

                {prod.inStock ? (
                  <button
                    type="button"
                    onClick={() => {
                      const item = marketProducts.find((p) => p.id === prod.id);
                      if (item) addToCart(item, 1);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                  >
                    + Basket
                  </button>
                ) : (
                  <Badge variant="error">Sold Out</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Favorite Farmers Grid */}
      {activeTab === 'farmers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteFarmers.length === 0 && emptyState('No favorite farmers yet. Save a stall from the Markets & Farmers tab.')}
          {favoriteFarmers.map((farm) => (
            <div
              key={farm.id}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{farm.name}</h4>
                    <span className="text-slate-500 text-[11px] block">{farm.subtitle}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-[10px] mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {farm.rating ? `${farm.rating.toFixed(1)} Rating` : 'New farmer'}
                    </span>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                  {farm.tag}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/70 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  {farm.restockStatus}
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(farm.id, 'farmer')}
                  className="text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Saved Market Locations */}
      {activeTab === 'markets' && (
        <div className="space-y-3">
          {savedMarkets.length === 0 && emptyState('No saved markets yet. Save one from the Markets & Farmers tab.')}
          {savedMarkets.map((mkt) => (
            <div
              key={mkt.id}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{mkt.name}</h4>
                  {mkt.isOpen ? (
                    <Badge variant="success">Open Today</Badge>
                  ) : (
                    <Badge variant="neutral">Closed today</Badge>
                  )}
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    {mkt.distance}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{mkt.address}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{mkt.schedule}</span>
                  <span>•</span>
                  <span>{mkt.activeStalls} stalls participating</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleSavedMarket(mkt.id)}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs cursor-pointer"
                >
                  Remove
                </button>
                <button
                  onClick={() => onSelectMarketMap && onSelectMarketMap(mkt.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Route on Map</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
