import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { CategoryBar } from '../../components/CategoryBar';
import { VendorHeroBanner } from '../../components/vendor/VendorHeroBanner';
import { VendorPopularProducts } from '../../components/vendor/VendorPopularProducts';
import { VendorTabNavigation, VendorTabKey } from '../../components/vendor/VendorTabNavigation';
import { PreOrderFulfillment } from '../../components/vendor/PreOrderFulfillment';
import { InventoryCatalog } from '../../components/vendor/InventoryCatalog';
import { StallProfileSettings } from '../../components/vendor/StallProfileSettings';
import { VendorReviewCenter } from '../../components/vendor/VendorReviewCenter';
import { initialCategories, popularProducts as initialPopular } from '../../data/marketData';
import { ProductItem } from '../../types/market';

export interface VendorDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

/**
 * Vendor Dashboard Page
 * Central layout and data orchestration page for stall inventory, fulfillment, and catalog.
 */
export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { stallSettings, triggerToast } = useMarketData();
  const [selectedCategory, setSelectedCategory] = useState('veggies');
  const [internalTab, setInternalTab] = useState<VendorTabKey>('fulfillment');
  const [popularProductsList, setPopularProductsList] = useState<ProductItem[]>(initialPopular);

  const validTabs: VendorTabKey[] = ['fulfillment', 'catalog', 'stall', 'reviews'];
  const activeOperationalTab: VendorTabKey = currentTab && validTabs.includes(currentTab as VendorTabKey)
    ? (currentTab as VendorTabKey)
    : internalTab;

  const handleSelectTab = (tab: VendorTabKey) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

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

  const handleSortByStock = (asc: boolean) => {
    setPopularProductsList((prev) =>
      [...prev].sort((a, b) => (asc ? a.stock - b.stock : b.stock - a.stock))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Card */}
      <VendorHeroBanner
        stallName={stallSettings.stallName}
        onReviewOrders={() => handleSelectTab('fulfillment')}
      />

      {/* 2. Categories and Stock Bar */}
      <CategoryBar
        categories={initialCategories}
        selectedCategoryId={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSortByStock={handleSortByStock}
      />

      {/* 3. Popular Product 4-Card Grid */}
      <VendorPopularProducts
        products={popularProductsList}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        onSeeAll={() => handleSelectTab('catalog')}
      />

      {/* 4. Operational Stall Sub-Panels with MarketEase tabs */}
      <div className="space-y-4 pt-2">
        <VendorTabNavigation
          activeTab={activeOperationalTab}
          onSelectTab={handleSelectTab}
        />

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
