import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { CategoryBar } from '../CategoryBar';
import { ProductCard } from '../ProductCard';
import { PreOrderFulfillment } from './PreOrderFulfillment';
import { InventoryCatalog } from './InventoryCatalog';
import { StallProfileSettings } from './StallProfileSettings';
import { VendorReviewCenter } from './VendorReviewCenter';
import { initialCategories, popularProducts as initialPopular } from '../../data/marketData';
import { ProductItem } from '../../types/market';
import { Sparkles, PackageCheck, Package, Store, Star, ArrowRight } from 'lucide-react';

interface VendorDashboardProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { vendorProducts, stallSettings, triggerToast } = useMarketData();
  const [selectedCategory, setSelectedCategory] = useState('veggies');
  const [internalTab, setInternalTab] = useState<'fulfillment' | 'catalog' | 'stall' | 'reviews'>('fulfillment');
  
  const validTabs = ['fulfillment', 'catalog', 'stall', 'reviews'];
  const activeOperationalTab = currentTab && validTabs.includes(currentTab)
    ? (currentTab as 'fulfillment' | 'catalog' | 'stall' | 'reviews')
    : internalTab;

  const setActiveOperationalTab = (tab: 'fulfillment' | 'catalog' | 'stall' | 'reviews') => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };
  const [popularProductsList, setPopularProductsList] = useState<ProductItem[]>(initialPopular);

  const handleAddToCart = (product: ProductItem) => {
    triggerToast(`Quick allocation: 1 kg of ${product.name} prepared`);
  };

  const handleToggleFavorite = (productId: string) => {
    setPopularProductsList((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Card matching screenshot green banner */}
      <div className="relative overflow-hidden bg-[#22c55e] rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{stallSettings.stallName} • Active Stall</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-white">
            Weekend Harvest Pre-Orders<br className="hidden sm:inline" /> Open for Customers
          </h2>
          <p className="mt-1 text-sm text-white/90 font-medium">
            Pre-order cut-off is Friday at 8:00 PM for Saturday morning market pickup.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setActiveOperationalTab('fulfillment')}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            Review Orders
          </button>
        </div>
      </div>

      {/* 2. Categories and Stock Bar matching screenshot */}
      <CategoryBar
        categories={initialCategories}
        selectedCategoryId={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSortByStock={(asc) => {
          setPopularProductsList((prev) =>
            [...prev].sort((a, b) => (asc ? a.stock - b.stock : b.stock - a.stock))
          );
        }}
      />

      {/* 3. Popular Product 4-Card Grid matching screenshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Popular Product
          </h3>
          <button
            onClick={() => setActiveOperationalTab('catalog')}
            className="text-xs font-semibold text-[#22c55e] hover:underline cursor-pointer"
          >
            See All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {popularProductsList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>

      {/* 4. Operational Stall Sub-Panels with clean MarketEase tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveOperationalTab('fulfillment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeOperationalTab === 'fulfillment'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Pre-Order Fulfillment</span>
            </button>

            <button
              onClick={() => setActiveOperationalTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeOperationalTab === 'catalog'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventory & Catalog Manager</span>
            </button>

            <button
              onClick={() => setActiveOperationalTab('stall')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeOperationalTab === 'stall'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Stall & GPS Map Settings</span>
            </button>

            <button
              onClick={() => setActiveOperationalTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeOperationalTab === 'reviews'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Customer Review Center</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeOperationalTab === 'fulfillment' && <PreOrderFulfillment />}
          {activeOperationalTab === 'catalog' && <InventoryCatalog />}
          {activeOperationalTab === 'stall' && <StallProfileSettings />}
          {activeOperationalTab === 'reviews' && <VendorReviewCenter />}
        </div>
      </div>
    </div>
  );
};
