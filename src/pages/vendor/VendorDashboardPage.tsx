import React, { useMemo, useState } from 'react';
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
import { AnnouncementBanner } from '../../components/common/AnnouncementBanner';
import { CategoryItem, ProductItem } from '../../types/market';
import { SettingsPage } from '../settings/SettingsPage';
import { AboutUsPage } from '../common/AboutUsPage';
import { ContactUsPage } from '../common/ContactUsPage';
import { FeedbackPage } from '../common/FeedbackPage';
import { AlertTriangle } from 'lucide-react';

export interface VendorDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

const iconFor = (name: string): CategoryItem['icon'] => {
  const n = name.toLowerCase();
  if (n.includes('fruit')) return 'fruits';
  if (n.includes('root') || n.includes('tuber') || n.includes('grain')) return 'tubers';
  if (n.includes('fish')) return 'fish';
  if (n.includes('meat') || n.includes('dairy') || n.includes('egg')) return 'meat';
  return 'veggies';
};

/**
 * Farmer dashboard (SRS 1.6 farmer features): stock, pre-orders, pickup slots, stall profile, reviews, insights.
 */
export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({ currentTab, onSelectTab }) => {
  const { stallSettings, vendorProducts, vendorOrders } = useMarketData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [internalTab, setInternalTab] = useState<VendorTabKey>('market');
  const [stockSort, setStockSort] = useState<'none' | 'asc' | 'desc'>('none');

  const validTabs: VendorTabKey[] = ['market', 'fulfillment', 'catalog', 'stall', 'reviews', 'insights'];
  const activeOperationalTab: VendorTabKey =
    currentTab && validTabs.includes(currentTab as VendorTabKey) ? (currentTab as VendorTabKey) : internalTab;

  const handleSelectTab = (tab: VendorTabKey) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

  // stock per category of this farmer's own products
  const categoryItems: CategoryItem[] = useMemo(() => {
    const groups: Record<string, number> = {};
    vendorProducts.forEach((p) => {
      groups[p.categoryId] = (groups[p.categoryId] || 0) + p.stock;
    });
    return Object.entries(groups).map(([id, count]) => {
      const name = vendorProducts.find((p) => p.categoryId === id)?.category || 'Other';
      return { id, name, count, stock: `${count} in stock`, icon: iconFor(name) };
    });
  }, [vendorProducts]);

  const overviewProducts: ProductItem[] = useMemo(() => {
    const list = vendorProducts
      .filter((p) => selectedCategory === 'all' || p.categoryId === selectedCategory)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        categoryId: p.categoryId,
        stock: p.stock,
        price: p.price,
        unit: p.unit,
        imageType: (p.imageType as ProductItem['imageType']) || 'cabbage',
        imageUrl: p.imageUrl,
        availability: p.status === 'in_stock' ? ('AVAILABLE' as const) : p.status === 'sold_out' ? ('SOLD_OUT' as const) : ('UNAVAILABLE' as const),
        hasRedDot: p.stock > 0 && p.stock < 5,
      }));
    if (stockSort === 'asc') list.sort((a, b) => a.stock - b.stock);
    if (stockSort === 'desc') list.sort((a, b) => b.stock - a.stock);
    return list.slice(0, 8);
  }, [vendorProducts, selectedCategory, stockSort]);

  const pendingCount = vendorOrders.filter((o) => o.status === 'pending').length;

  // Common platform views
  if (currentTab === 'settings') return <SettingsPage />;
  if (currentTab === 'about') return <AboutUsPage />;
  if (currentTab === 'contact') return <ContactUsPage />;
  if (currentTab === 'feedback') return <FeedbackPage />;

  return (
    <div className="space-y-6">
      {stallSettings.farmerId && stallSettings.approvalStatus !== 'approved' && (
        <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <div>
            <div className="font-bold text-sm capitalize">Stall {stallSettings.approvalStatus}</div>
            <p className="mt-0.5">
              {stallSettings.approvalStatus === 'pending' &&
                'An admin is reviewing your registration. You can complete your stall profile now; products and market schedules unlock once you are approved.'}
              {stallSettings.approvalStatus === 'suspended' && `Your stall is suspended${stallSettings.statusReason ? `: ${stallSettings.statusReason}` : ''}. Contact the MarketLink team.`}
              {stallSettings.approvalStatus === 'rejected' && `Your registration was rejected${stallSettings.statusReason ? `: ${stallSettings.statusReason}` : ''}.`}
            </p>
          </div>
        </div>
      )}

      <VendorTabNavigation activeTab={activeOperationalTab} onSelectTab={handleSelectTab} />

      {activeOperationalTab === 'market' && (
        <div className="space-y-6">
          <VendorHeroBanner
            stallName={stallSettings.stallName || 'Your stall'}
            onReviewOrders={() => handleSelectTab('fulfillment')}
          />

          <AnnouncementBanner />

          {pendingCount > 0 && (
            <button
              type="button"
              onClick={() => handleSelectTab('fulfillment')}
              className="w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-left cursor-pointer hover:bg-emerald-100"
            >
              You have {pendingCount} new pre-order{pendingCount > 1 ? 's' : ''} waiting to be accepted →
            </button>
          )}

          {categoryItems.length > 0 && (
            <CategoryBar
              categories={categoryItems}
              selectedCategoryId={selectedCategory}
              onSelectCategory={(id) => setSelectedCategory((cur) => (cur === id ? 'all' : id))}
              onSortByStock={(asc) => setStockSort(asc ? 'asc' : 'desc')}
            />
          )}

          {overviewProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No products yet.{' '}
              <button type="button" onClick={() => handleSelectTab('catalog')} className="text-emerald-700 font-bold hover:underline cursor-pointer">
                Add your first product
              </button>
            </div>
          ) : (
            <VendorPopularProducts
              products={overviewProducts}
              onAddToCart={() => handleSelectTab('catalog')}
              onToggleFavorite={() => {}}
              onSeeAll={() => handleSelectTab('catalog')}
            />
          )}
        </div>
      )}

      {activeOperationalTab === 'fulfillment' && <PreOrderFulfillment />}
      {activeOperationalTab === 'catalog' && <InventoryCatalog />}
      {activeOperationalTab === 'stall' && <StallProfileSettings />}
      {activeOperationalTab === 'reviews' && <VendorReviewCenter />}
      {activeOperationalTab === 'insights' && <VendorSalesInsights onManageStock={() => handleSelectTab('catalog')} />}
    </div>
  );
};
