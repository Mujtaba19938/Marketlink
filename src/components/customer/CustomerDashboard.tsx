import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { DiscountBanner } from '../DiscountBanner';
import { CategoryBar } from '../CategoryBar';
import { ProductCard } from '../ProductCard';
import { ActiveOrdersHistory } from './ActiveOrdersHistory';
import { FavoritesPreferences } from './FavoritesPreferences';
import { MapPickupNavigation } from './MapPickupNavigation';
import { NotificationCenter } from './NotificationCenter';
import { initialCategories, popularProducts as initialPopular } from '../../data/marketData';
import { ProductItem } from '../../types/market';
import { CustomerPreOrder } from '../../types/customer';
import { Package, Heart, Navigation, Bell, Sparkles } from 'lucide-react';

interface CustomerDashboardProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { customerOrders, customerFavorites, triggerToast } = useMarketData();
  const [selectedCategory, setSelectedCategory] = useState('veggies');
  const [internalTab, setInternalTab] = useState<'orders' | 'favorites' | 'map' | 'notifs'>('orders');
  
  const validTabs = ['orders', 'favorites', 'map', 'notifs'];
  const activeCustomerTab = currentTab && validTabs.includes(currentTab)
    ? (currentTab as 'orders' | 'favorites' | 'map' | 'notifs')
    : internalTab;

  const setActiveCustomerTab = (tab: 'orders' | 'favorites' | 'map' | 'notifs') => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };
  const [popularProductsList, setPopularProductsList] = useState<ProductItem[]>(initialPopular);

  const activeOrdersCount = customerOrders.filter(
    (o) => o.status === 'placed' || o.status === 'accepted' || o.status === 'ready_for_pickup'
  ).length;

  const handleAddToCart = (product: ProductItem) => {
    triggerToast(`Added 1 kg of ${product.name} to pre-order basket`);
  };

  const handleToggleFavorite = (productId: string) => {
    setPopularProductsList((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleNavigateToMap = (order: CustomerPreOrder) => {
    setActiveCustomerTab('map');
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Card matching screenshot green banner */}
      <DiscountBanner onApplyDiscount={() => triggerToast('Promo voucher VEGGIE45 applied!')} />

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
            onClick={() => setActiveCustomerTab('favorites')}
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

      {/* 4. Customer Pre-Order Sub-Panels with MarketEase Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCustomerTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCustomerTab === 'orders'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Active Pre-Orders & History</span>
              {activeOrdersCount > 0 && (
                <span className="bg-[#22c55e] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCustomerTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCustomerTab === 'favorites'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorites & Preferences</span>
            </button>

            <button
              onClick={() => setActiveCustomerTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCustomerTab === 'map'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Pickup Route Navigation</span>
            </button>

            <button
              onClick={() => setActiveCustomerTab('notifs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCustomerTab === 'notifs'
                  ? 'bg-[#ecfbf2] text-[#22c55e] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Panel View */}
        <div>
          {activeCustomerTab === 'orders' && (
            <ActiveOrdersHistory onNavigateToMap={handleNavigateToMap} />
          )}
          {activeCustomerTab === 'favorites' && <FavoritesPreferences />}
          {activeCustomerTab === 'map' && <MapPickupNavigation />}
          {activeCustomerTab === 'notifs' && <NotificationCenter />}
        </div>
      </div>
    </div>
  );
};
