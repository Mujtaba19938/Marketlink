import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { CustomerPopularProducts } from '../../components/customer/CustomerPopularProducts';
import { CustomerTabNavigation, CustomerTabKey } from '../../components/customer/CustomerTabNavigation';
import { ActiveOrdersHistory } from '../../components/customer/ActiveOrdersHistory';
import { FavoritesPreferences } from '../../components/customer/FavoritesPreferences';
import { MapPickupNavigation } from '../../components/customer/MapPickupNavigation';
import { NotificationCenter } from '../../components/customer/NotificationCenter';
import { MarketFarmerDirectory } from '../../components/customer/MarketFarmerDirectory';
import { FourDimensionFilterBar } from '../../components/customer/FourDimensionFilterBar';
import { useCatalogFilters } from '../../components/customer/useCatalogFilters';
import { ProductDetailModal } from '../../components/customer/ProductDetailModal';
import { CompleteCustomerFlowModal } from '../../components/customer/CompleteCustomerFlowModal';
import { AnnouncementBanner } from '../../components/common/AnnouncementBanner';
import { ProductItem } from '../../types/market';
import { formatPrice } from '../../services/mappers';
import { SettingsPage } from '../settings/SettingsPage';
import { AboutUsPage } from '../common/AboutUsPage';
import { ContactUsPage } from '../common/ContactUsPage';
import { FeedbackPage } from '../common/FeedbackPage';

export interface CustomerDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

/**
 * Customer Dashboard Page (SRS 1.6 customer features)
 * Produce catalog with 4-dimension search, markets & farmers, pickup pre-orders,
 * order history, favorites, map navigation and notifications - all backed by MongoDB.
 */
export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ currentTab, onSelectTab }) => {
  const { customerOrders, cartItems, addToCart, favoriteProductIds, toggleFavorite, loading } = useMarketData();
  const { filters, setFilters, filteredProducts, options, reset } = useCatalogFilters();

  const [internalTab, setInternalTab] = useState<CustomerTabKey>('market');
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mapMarketId, setMapMarketId] = useState<string | undefined>();

  const validOperationalTabs: CustomerTabKey[] = ['market', 'orders', 'markets', 'favorites', 'map', 'notifs'];
  const activeCustomerTab: CustomerTabKey =
    currentTab && validOperationalTabs.includes(currentTab as CustomerTabKey) ? (currentTab as CustomerTabKey) : internalTab;

  const handleSelectTab = (tab: CustomerTabKey) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

  const openMap = (marketId?: string) => {
    setMapMarketId(marketId);
    handleSelectTab('map');
  };

  const productsWithFav = filteredProducts.map((p) => ({ ...p, isFavorite: favoriteProductIds.includes(p.id) }));

  const activeOrdersCount = customerOrders.filter((o) => ['placed', 'accepted', 'ready_for_pickup'].includes(o.status)).length;
  const totalCartCount = cartItems.length;
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Common platform pages
  if (currentTab === 'settings') return <SettingsPage />;
  if (currentTab === 'about') return <AboutUsPage />;
  if (currentTab === 'contact') return <ContactUsPage />;
  if (currentTab === 'feedback') return <FeedbackPage />;

  return (
    <div className="space-y-6">
      <CustomerTabNavigation
        activeTab={activeCustomerTab}
        onSelectTab={handleSelectTab}
        activeOrdersCount={activeOrdersCount}
        cartCount={totalCartCount}
        onOpenCart={() => setCheckoutOpen(true)}
      />

      {activeCustomerTab === 'market' && (
        <div className="space-y-6">
          <AnnouncementBanner />

          <FourDimensionFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={reset}
            totalResultsCount={filteredProducts.length}
            {...options}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">
                {loading && filteredProducts.length === 0 ? 'Loading produce…' : `Available Produce (${filteredProducts.length} items)`}
              </span>
              <span className="text-[11px] text-slate-400">Click any item to see details, reviews and the farmer</span>
            </div>

            <CustomerPopularProducts
              products={productsWithFav}
              onAddToCart={(p) => addToCart(p, 1)}
              onToggleFavorite={(id) => toggleFavorite(id, 'product')}
              onSeeAll={reset}
              onOpenDetails={(p) => setSelectedProductForModal(p)}
            />
          </div>
        </div>
      )}

      {activeCustomerTab === 'orders' && (
        <ActiveOrdersHistory
          onNavigateToMap={(order) => openMap(order.marketId)}
          onStartNewOrder={() => handleSelectTab('market')}
          onOpenCart={() => setCheckoutOpen(true)}
        />
      )}
      {activeCustomerTab === 'markets' && (
        <MarketFarmerDirectory onNavigateToMap={openMap} onSelectProductForOrder={() => setCheckoutOpen(true)} />
      )}
      {activeCustomerTab === 'favorites' && <FavoritesPreferences onSelectMarketMap={openMap} onOpenProduct={setSelectedProductForModal} />}
      {activeCustomerTab === 'map' && <MapPickupNavigation key={mapMarketId || 'default'} initialMarketId={mapMarketId} />}
      {activeCustomerTab === 'notifs' && <NotificationCenter />}

      {/* Floating basket button */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-24 right-6 z-40 animate-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="px-5 py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs cursor-pointer active:scale-95 transition"
          >
            <div className="w-6 h-6 rounded-full bg-white text-emerald-700 text-xs font-black flex items-center justify-center shadow-xs">
              {totalCartCount}
            </div>
            <span>Review &amp; Place Pre-Order</span>
            <span className="font-mono bg-emerald-700/60 px-2 py-0.5 rounded-lg text-white">{formatPrice(cartSubtotal)}</span>
          </button>
        </div>
      )}

      <ProductDetailModal
        product={selectedProductForModal ? { ...selectedProductForModal, isFavorite: favoriteProductIds.includes(selectedProductForModal.id) } : null}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={(p, q) => addToCart(p, q)}
        onInstantBuy={async (p, q) => {
          if (await addToCart(p, q)) setCheckoutOpen(true);
        }}
        onToggleFavorite={(id) => toggleFavorite(id, 'product')}
      />

      <CompleteCustomerFlowModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onNavigateToDashboard={() => handleSelectTab('orders')}
      />
    </div>
  );
};
