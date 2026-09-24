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
import { VendorSalesInsights } from '../../components/vendor/VendorSalesInsights';
import { initialCategories, popularProducts as initialPopular } from '../../data/marketData';
import { ProductItem } from '../../types/market';
import { SettingsPage } from '../settings/SettingsPage';
import { AboutUsPage } from '../common/AboutUsPage';
import { ContactUsPage } from '../common/ContactUsPage';
import { FeedbackPage } from '../common/FeedbackPage';

export interface VendorDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

/**
 * Vendor Dashboard Page (SRS Compliant)
 * Personalized portal for Farmers/Vendors:
 * When on 'market' (Market & Stall): Shows Hero Banner, Categories & Stock, and Popular Products.
 * When on other operational tabs (Fulfillment, Catalog, Stall Settings, Reviews, Insights):
 * Shows dedicated clean operational view without top banners.
 */
export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { stallSettings, triggerToast } = useMarketData();
  const [selectedCategory, setSelectedCategory] = useState('veggies');
  const [internalTab, setInternalTab] = useState<VendorTabKey>('market');
  const [popularProductsList, setPopularProductsList] = useState<ProductItem[]>(initialPopular);

  const validTabs: VendorTabKey[] = ['market', 'fulfillment', 'catalog', 'stall', 'reviews', 'insights'];
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

  // Common platform views
  if (currentTab === 'settings') return <SettingsPage />;
  if (currentTab === 'about') return <AboutUsPage />;
  if (currentTab === 'contact') return <ContactUsPage />;
  if (currentTab === 'feedback') return <FeedbackPage />;

  return (
    <div className="space-y-6">
      {/* Tab Navigation is ALWAYS accessible at top so farmer can switch views */}
      <VendorTabNavigation
        activeTab={activeOperationalTab}
        onSelectTab={handleSelectTab}
      />

      {/* ONLY show Hero Banner, CategoryBar, and Popular Products on 'market' (Market & Stall Overview) */}
      {activeOperationalTab === 'market' && (
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
        </div>
      )}

      {/* Dedicated Operational Views (Clean, full page, no banners stuck on top) */}
      {activeOperationalTab === 'fulfillment' && <PreOrderFulfillment />}
      {activeOperationalTab === 'catalog' && <InventoryCatalog />}
      {activeOperationalTab === 'stall' && <StallProfileSettings />}
      {activeOperationalTab === 'reviews' && <VendorReviewCenter />}
      {activeOperationalTab === 'insights' && <VendorSalesInsights />}
    </div>
  );
};
