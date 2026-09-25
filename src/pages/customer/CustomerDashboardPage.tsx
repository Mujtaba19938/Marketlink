import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { DiscountBanner } from '../../components/DiscountBanner';
import { CustomerPopularProducts } from '../../components/customer/CustomerPopularProducts';
import { CustomerTabNavigation, CustomerTabKey } from '../../components/customer/CustomerTabNavigation';
import { ActiveOrdersHistory } from '../../components/customer/ActiveOrdersHistory';
import { FavoritesPreferences } from '../../components/customer/FavoritesPreferences';
import { MapPickupNavigation } from '../../components/customer/MapPickupNavigation';
import { NotificationCenter } from '../../components/customer/NotificationCenter';
import { MarketFarmerDirectory } from '../../components/customer/MarketFarmerDirectory';
import { FourDimensionFilterBar, FourDimensionFilters } from '../../components/customer/FourDimensionFilterBar';
import { ProductDetailModal } from '../../components/customer/ProductDetailModal';
import { CompleteCustomerFlowModal, CustomerFlowStep } from '../../components/customer/CompleteCustomerFlowModal';
import { PreOrderCartModal, CartItem } from '../../components/customer/PreOrderCartModal';
import { allMarketProducts } from '../../data/marketData';
import { ProductItem } from '../../types/market';
import { CustomerPreOrder } from '../../types/customer';
import { SettingsPage } from '../settings/SettingsPage';
import { AboutUsPage } from '../common/AboutUsPage';
import { ContactUsPage } from '../common/ContactUsPage';
import { FeedbackPage } from '../common/FeedbackPage';
import { ShoppingBag } from 'lucide-react';

export interface CustomerDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

/**
 * Customer Dashboard Page (SRS Compliant)
 * Personalized portal for shoppers: produce catalog, 4-dimension search,
 * market & farmer directory, complete checkout flow with Stripe & delivery tracking.
 */
export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { customerOrders, triggerToast } = useMarketData();

  // Internal tab state
  const [internalTab, setInternalTab] = useState<CustomerTabKey>('market');
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 4 Dimensions Filters State (Farmer-wise, Price-wise, Category-wise, Area-wise)
  const [filters, setFilters] = useState<FourDimensionFilters>({
    searchQuery: '',
    farmer: 'all',
    category: 'all',
    area: 'all',
    minPrice: 0,
    maxPrice: 25,
  });
  const [sortBy, setSortBy] = useState('popular');

  // Complete Customer Flow Modal State
  const [customerFlowOpen, setCustomerFlowOpen] = useState(false);
  const [flowInitialStep, setFlowInitialStep] = useState<CustomerFlowStep>('cart');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<CustomerPreOrder | null>(null);

  const validOperationalTabs: CustomerTabKey[] = ['market', 'orders', 'markets', 'favorites', 'map', 'notifs'];
  const activeCustomerTab: CustomerTabKey = currentTab && validOperationalTabs.includes(currentTab as CustomerTabKey)
    ? (currentTab as CustomerTabKey)
    : internalTab;

  const handleSelectTab = (tab: CustomerTabKey) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

  // Cart operations
  const handleAddToCart = (product: ProductItem, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    triggerToast(`Added ${quantity} kg of ${product.name} to pickup basket`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleFavorite = (productId: string) => {
    // toggle favorite feedback
    triggerToast('Updated produce favorite state', 'info');
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      farmer: 'all',
      category: 'all',
      area: 'all',
      minPrice: 0,
      maxPrice: 25,
    });
    setSortBy('popular');
  };

  // 4-Dimensional Filtered produce list
  const filteredProducts = allMarketProducts
    .filter((p) => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.farmerName && p.farmerName.toLowerCase().includes(q)) ||
        (p.farmName && p.farmName.toLowerCase().includes(q)) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchesFarmer = filters.farmer === 'all' || p.farmerName === filters.farmer;
      const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const matchesCat = filters.category === 'all' || p.category === filters.category;
      const matchesArea = filters.area === 'all' || p.area === filters.area;

      return matchesSearch && matchesFarmer && matchesPrice && matchesCat && matchesArea;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0; // 'popular'
    });

  const activeOrdersCount = customerOrders.filter(
    (o) =>
      o.status === 'placed' ||
      o.status === 'accepted' ||
      o.status === 'ready_for_pickup' ||
      o.status === 'payment_confirmed' ||
      o.status === 'processing' ||
      o.status === 'dispatched' ||
      o.status === 'out_for_delivery'
  ).length;

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const openFlowModal = (step: CustomerFlowStep = 'cart', order: CustomerPreOrder | null = null) => {
    setSelectedOrderForTracking(order);
    setFlowInitialStep(step);
    setCustomerFlowOpen(true);
  };

  // Common platform pages
  if (currentTab === 'settings') return <SettingsPage />;
  if (currentTab === 'about') return <AboutUsPage />;
  if (currentTab === 'contact') return <ContactUsPage />;
  if (currentTab === 'feedback') return <FeedbackPage />;

  return (
    <div className="space-y-6">
      {/* Customer Tab Navigation - Always accessible at the top */}
      <CustomerTabNavigation
        activeTab={activeCustomerTab}
        onSelectTab={handleSelectTab}
        activeOrdersCount={activeOrdersCount}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* ONLY show Promo Banner, Filter Bar, and Produce Grid on 'market' (Market & Produce) */}
      {activeCustomerTab === 'market' && (
        <div className="space-y-6">
          {/* 1. Hero Promo Card with Cart Trigger */}
          <div className="relative">
            <DiscountBanner onApplyDiscount={() => triggerToast('Promo voucher VEGGIE45 applied!')} />

            {/* Floating Quick Basket Status Button */}
            {totalCartCount > 0 && (
              <button
                type="button"
                onClick={() => openFlowModal('cart')}
                className="absolute top-4 right-4 z-20 px-4 py-2 bg-white text-slate-800 rounded-2xl shadow-xl border border-black/10 flex items-center gap-2 font-bold text-xs hover:bg-slate-50 transition cursor-pointer active:scale-95"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[11px] flex items-center justify-center font-bold">
                  {totalCartCount}
                </div>
                <span>Review Cart &amp; Checkout</span>
              </button>
            )}
          </div>

          {/* 2. 4-Dimension Produce Discovery Bar (Farmer, Price, Category, Area) */}
          <FourDimensionFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalResultsCount={filteredProducts.length}
          />

          {/* 3. Fresh Harvest Product Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">
                Available Produce ({filteredProducts.length} items)
              </span>
              <span className="text-[11px] text-slate-400">
                Click any item to view Step 2 product &amp; farmer details
              </span>
            </div>

            <CustomerPopularProducts
              products={filteredProducts}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleFavorite={handleToggleFavorite}
              onSeeAll={() => setFilters((f) => ({ ...f, category: 'all' }))}
              onOpenDetails={(p) => setSelectedProductForModal(p)}
            />
          </div>
        </div>
      )}

      {/* Dedicated Operational Views (Clean, full page, no banners stuck on top) */}
      {activeCustomerTab === 'orders' && (
        <ActiveOrdersHistory
          onNavigateToMap={() => handleSelectTab('map')}
          onStartNewOrder={() => handleSelectTab('market')}
          onOpenDeliveryTracking={(order) => openFlowModal('delivery_tracking', order)}
        />
      )}
      {activeCustomerTab === 'markets' && (
        <MarketFarmerDirectory
          onNavigateToMap={() => handleSelectTab('map')}
          onSelectProductForOrder={() => openFlowModal('cart')}
        />
      )}
      {activeCustomerTab === 'favorites' && <FavoritesPreferences />}
      {activeCustomerTab === 'map' && <MapPickupNavigation />}
      {activeCustomerTab === 'notifs' && <NotificationCenter />}

      {/* Persistent Floating Cart Button (Accessible across all tabs and produce browsing) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => openFlowModal('cart')}
            className="px-5 py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs cursor-pointer active:scale-95 transition"
          >
            <div className="w-6 h-6 rounded-full bg-white text-emerald-700 text-xs font-black flex items-center justify-center shadow-xs">
              {totalCartCount}
            </div>
            <span>Review &amp; Place Pre-Order</span>
            <span className="font-mono bg-emerald-700/60 px-2 py-0.5 rounded-lg text-white">
              ${cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* SRS Product Details Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={(p, q) => {
          handleAddToCart(p, q);
          openFlowModal('cart');
        }}
      />

      {/* Complete Customer Flow Modal (Cart -> Auth -> Reg -> OTP Verify -> Login -> Checkout -> Stripe -> Delivery Tracking) */}
      <CompleteCustomerFlowModal
        isOpen={customerFlowOpen}
        onClose={() => setCustomerFlowOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        initialStep={flowInitialStep}
        selectedOrderForTracking={selectedOrderForTracking}
        onNavigateToDashboard={() => handleSelectTab('orders')}
      />
    </div>
  );
};
