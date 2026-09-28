import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProduceArt } from '../../components/ProduceArt';
import { FourDimensionFilterBar } from '../../components/customer/FourDimensionFilterBar';
import { useCatalogFilters } from '../../components/customer/useCatalogFilters';
import { formatPrice } from '../../services/mappers';
import { ProductItem } from '../../types/market';
import {
  ShoppingBag,
  Star,
  Search,
  SlidersHorizontal,
  Sparkles,
  Check,
  ChevronDown,
  Filter,
} from 'lucide-react';

interface ShopPageProps {
  onAddToCart: (product: ProductItem, quantity?: number) => void;
  onOpenProductModal: (product: ProductItem) => void;
  favoriteProductIds: string[];
  onToggleFavorite: (id: string) => void;
  initialCategory?: string;
  initialFarmer?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onAddToCart,
  onOpenProductModal,
  favoriteProductIds,
  onToggleFavorite,
  initialCategory = 'all',
  initialFarmer = 'all',
}) => {
  const { loading } = useMarketData();
  const { filters, setFilters, sortBy, setSortBy, filteredProducts, options, reset } = useCatalogFilters({
    farmer: initialFarmer,
    category: initialCategory,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[#def54d] text-xs font-bold">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>4-Dimensional Harvest Marketplace • Karachi Stalls</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Fresh Produce Marketplace
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Live stock from local farmers. Filter by farmer, price, category and area, then pre-order for pickup at the market.
            </p>
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-slate-400 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 bg-[#0c1b14] border border-emerald-900/60 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="popular">Top Rated &amp; Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock">Highest Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4-Dimensional Filter Bar Component */}
      <div className="bg-[#0c1b14] border border-emerald-900/50 rounded-3xl p-5 shadow-lg">
        <FourDimensionFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={reset}
          totalResultsCount={filteredProducts.length}
          {...options}
        />
      </div>

      {/* Products Grid */}
      {loading && filteredProducts.length === 0 ? (
        <div className="bg-[#0c1b14] border border-emerald-900/40 rounded-3xl p-12 text-center text-slate-400 text-sm">
          Loading fresh produce…
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#0c1b14] border border-emerald-900/40 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-950 flex items-center justify-center mx-auto text-emerald-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Produce Matches Your Selected Filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your price boundaries, clearing the keyword search, or choosing a different Karachi district.
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
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

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[10px] text-white font-semibold shadow-md">
                        Click for Details
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{product.area || 'Karachi'}</span>
                      {product.availability === 'AVAILABLE' && product.stock > 0 ? (
                        <span className="text-emerald-400 font-semibold">{product.stock} {product.unit} left</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">{product.availability === 'UNAVAILABLE' ? 'Unavailable' : 'Sold out'}</span>
                      )}
                    </div>

                    <h4
                      onClick={() => onOpenProductModal(product)}
                      className="font-bold text-white text-sm hover:text-emerald-400 transition cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h4>

                    <span className="text-[11px] text-slate-400 block truncate">
                      Grown by: <strong className="text-slate-200">{product.farmName}</strong>{product.farmerName ? ` • ${product.farmerName}` : ''}
                    </span>

                    <p className="text-slate-400 text-[11px] line-clamp-2 leading-tight pt-0.5">
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
                    disabled={product.availability !== 'AVAILABLE' || product.stock <= 0}
                    onClick={() => onAddToCart(product, 1)}
                    className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Basket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
