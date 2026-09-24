import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { DiscountBanner } from '../../components/DiscountBanner';
import { CategoryBar } from '../../components/CategoryBar';
import { CustomerPopularProducts } from '../../components/customer/CustomerPopularProducts';
import { CustomerTabNavigation, CustomerTabKey } from '../../components/customer/CustomerTabNavigation';
import { ActiveOrdersHistory } from '../../components/customer/ActiveOrdersHistory';
import { FavoritesPreferences } from '../../components/customer/FavoritesPreferences';
import { MapPickupNavigation } from '../../components/customer/MapPickupNavigation';
import { NotificationCenter } from '../../components/customer/NotificationCenter';
import { initialCategories, popularProducts as initialPopular } from '../../data/marketData';
import { ProductItem } from '../../types/market';
import { CustomerPreOrder } from '../../types/customer';

export interface CustomerDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

/**
 * Customer Dashboard Page
 * Central layout and data orchestration page for customer produce browsing, orders, and pickup navigation.
 */
export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { customerOrders, triggerToast } = useMarketData();
  const [selectedCategory, setSelectedCategory] = useState('veggies');
  const [internalTab, setInternalTab] = useState<CustomerTabKey>('orders');
  const [popularProductsList, setPopularProductsList] = useState<ProductItem[]>(initialPopular);

  const validTabs: CustomerTabKey[] = ['orders', 'favorites', 'map', 'notifs'];
  const activeCustomerTab: CustomerTabKey = currentTab && validTabs.includes(currentTab as CustomerTabKey)
    ? (currentTab as CustomerTabKey)
    : internalTab;

  const handleSelectTab = (tab: CustomerTabKey) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

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

  const handleSortByStock = (asc: boolean) => {
    setPopularProductsList((prev) =>
      [...prev].sort((a, b) => (asc ? a.stock - b.stock : b.stock - a.stock))
    );
  };

  const handleNavigateToMap = (_order: CustomerPreOrder) => {
    handleSelectTab('map');
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Promo Card */}
      <DiscountBanner onApplyDiscount={() => triggerToast('Promo voucher VEGGIE45 applied!')} />

      {/* 2. Categories and Stock Bar */}
      <CategoryBar
        categories={initialCategories}
        selectedCategoryId={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSortByStock={handleSortByStock}
      />

      {/* 3. Popular Product 4-Card Grid */}
      <CustomerPopularProducts
        products={popularProductsList}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        onSeeAll={() => handleSelectTab('favorites')}
      />

      {/* 4. Customer Pre-Order Sub-Panels with MarketEase Tabs */}
      <div className="space-y-4 pt-2">
        <CustomerTabNavigation
          activeTab={activeCustomerTab}
          onSelectTab={handleSelectTab}
          activeOrdersCount={activeOrdersCount}
        />

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
