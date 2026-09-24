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
import { CustomerProductFilterBar } from '../../components/customer/CustomerProductFilterBar';
import { ProductDetailModal } from '../../components/customer/ProductDetailModal';
import { PreOrderCartModal, CartItem } from '../../components/customer/PreOrderCartModal';
import { popularProducts as initialPopular } from '../../data/marketData';
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
 * Personalized portal for shoppers: produce catalog, multi-filter search,
 * market & farmer directory, pre-order cart with pickup time slots, and order history.
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

  // Filter Bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [maxPrice, setMaxPrice] = useState(25);
  const [sortBy, setSortBy] = useState('popular');

  const [productsList, setProductsList] = useState<ProductItem[]>(initialPopular);

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
    setProductsList((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMarket('all');
    setSelectedDay('all');
    setMaxPrice(25);
    setSortBy('popular');
  };

  // Filtered produce list
  const filteredProducts = productsList
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCat && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0; // 'popular'
    });

  const activeOrdersCount = customerOrders.filter(
    (o) => o.status === 'placed' || o.status === 'accepted' || o.status === 'ready_for_pickup'
  ).length;

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
                onClick={() => setCartOpen(true)}
                className="absolute top-4 right-4 z-20 px-4 py-2 bg-white text-slate-800 rounded-2xl shadow-xl border border-black/10 flex items-center gap-2 font-bold text-xs hover:bg-slate-50 transition cursor-pointer active:scale-95"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[11px] flex items-center justify-center font-bold">
                  {totalCartCount}
                </div>
                <span>Review Pre-Order Basket</span>
              </button>
            )}
          </div>

          {/* 2. Multi-Filter Produce Bar (SRS Section 1.6 Requirement) */}
          <CustomerProductFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedMarket={selectedMarket}
            onMarketChange={setSelectedMarket}
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />

          {/* 3. Fresh Harvest Product Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">
                Available Produce ({filteredProducts.length} items)
              </span>
              <span className="text-[11px] text-slate-400">
                Click any item to view details & farmer info
              </span>
            </div>

            <CustomerPopularProducts
              products={filteredProducts}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleFavorite={handleToggleFavorite}
              onSeeAll={() => setSelectedCategory('all')}
            />
          </div>
        </div>
      )}

      {/* Dedicated Operational Views (Clean, full page, no banners stuck on top) */}
      {activeCustomerTab === 'orders' && (
        <ActiveOrdersHistory onNavigateToMap={() => handleSelectTab('map')} />
      )}
      {activeCustomerTab === 'markets' && (
        <MarketFarmerDirectory
          onNavigateToMap={() => handleSelectTab('map')}
          onSelectProductForOrder={() => setCartOpen(true)}
        />
      )}
      {activeCustomerTab === 'favorites' && <FavoritesPreferences />}
      {activeCustomerTab === 'map' && <MapPickupNavigation />}
      {activeCustomerTab === 'notifs' && <NotificationCenter />}

      {/* SRS Product Details Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* SRS Pre-Order Cart Modal with Pickup Date/Slot Selection */}
      <PreOrderCartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
};
