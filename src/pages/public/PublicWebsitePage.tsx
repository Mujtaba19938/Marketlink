import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAuth } from '../../context/AuthContext';
import { useAppRouter } from '../../routes/RouterContext';
import { PublicWebsiteNavbar } from './PublicWebsiteNavbar';
import { PublicWebsiteFooter } from './PublicWebsiteFooter';
import { HomePage } from './HomePage';
import { MarketsPage } from './MarketsPage';
import { ShopPage } from './ShopPage';
import { FarmersPage } from './FarmersPage';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';
import { CartCheckoutPage } from './CartCheckoutPage';
import { ProductDetailModal } from '../../components/customer/ProductDetailModal';
import { ToastContainer } from '../../components/common/ToastContainer';
import { ProductItem, StallLocation } from '../../types/market';
import { formatPrice } from '../../services/mappers';

interface PublicWebsitePageProps {
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
}

export const PublicWebsitePage: React.FC<PublicWebsitePageProps> = ({ onOpenLogin, onOpenDashboard }) => {
  const { isAuthenticated, currentRole, setActiveAuthPortal } = useAuth();
  const { cartItems, addToCart, favoriteProductIds, toggleFavorite, triggerToast } = useMarketData();
  const { websitePage, navigateWebsite } = useAppRouter();

  // Selected product for Product Detail Modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);

  // Filter pass-through (clicking a farmer on FarmersPage filters ShopPage to that farmer)
  const [selectedFarmerForShop, setSelectedFarmerForShop] = useState<string>('all');

  const handleAddToCart = (product: ProductItem, quantity = 1) => {
    addToCart(product, quantity);
  };

  // favorites live in MongoDB, so they need a customer account
  const handleToggleFavorite = (productId: string) => {
    if (!isAuthenticated) {
      triggerToast('Sign in as a customer to save favorites.', 'info');
      setActiveAuthPortal('customer');
      onOpenLogin();
      return;
    }
    if (currentRole !== 'customer') {
      triggerToast('Favorites are available for customer accounts.', 'info');
      return;
    }
    toggleFavorite(productId, 'product');
  };

  // "Pre-order from this stall" on the map -> show that farmer's produce in the shop
  const handlePreOrderStall = (stall: StallLocation) => {
    setSelectedFarmerForShop(stall.farmerId || 'all');
    navigateWebsite('shop');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="theme-vezzole min-h-screen bg-[#07130e] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#def54d]/20 selection:text-[#def54d] flex flex-col justify-between">
      {/* 1. Shared Sticky Navigation Header */}
      <PublicWebsiteNavbar
        cartItemCount={totalCartCount}
        onOpenCart={() => navigateWebsite('cart')}
        onOpenLogin={onOpenLogin}
        onOpenDashboard={onOpenDashboard}
      />

      {/* 2. Main Body */}
      <main className="flex-1">
        {websitePage === 'home' && (
          <HomePage
            onAddToCart={handleAddToCart}
            onOpenProductModal={setSelectedProductForModal}
            favoriteProductIds={favoriteProductIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {websitePage === 'markets' && <MarketsPage onPreOrderStall={handlePreOrderStall} />}

        {websitePage === 'shop' && (
          <ShopPage
            key={selectedFarmerForShop}
            onAddToCart={handleAddToCart}
            onOpenProductModal={setSelectedProductForModal}
            favoriteProductIds={favoriteProductIds}
            onToggleFavorite={handleToggleFavorite}
            initialFarmer={selectedFarmerForShop}
          />
        )}

        {websitePage === 'farmers' && (
          <FarmersPage
            onSelectFarmerForShop={(farmerId) => {
              setSelectedFarmerForShop(farmerId);
              navigateWebsite('shop');
            }}
          />
        )}

        {websitePage === 'about' && <AboutPage />}

        {websitePage === 'contact' && <ContactPage />}

        {(websitePage === 'cart' || websitePage === 'checkout') && <CartCheckoutPage />}
      </main>

      {/* 3. Shared Website Footer */}
      <PublicWebsiteFooter />

      {/* 4. Floating basket pill */}
      {totalCartCount > 0 && websitePage !== 'cart' && websitePage !== 'checkout' && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => navigateWebsite('cart')}
            className="px-5 py-3.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] rounded-full shadow-2xl flex items-center gap-3 font-black text-xs cursor-pointer active:scale-95 transition border border-white/20 font-['Outfit',sans-serif]"
          >
            <div className="w-6 h-6 rounded-full bg-[#0c1b14] text-[#def54d] text-xs font-black flex items-center justify-center shadow-xs">
              {cartItems.length}
            </div>
            <span>View Basket &amp; Pickup</span>
            <span className="font-mono bg-[#0c1b14]/15 px-2 py-0.5 rounded-lg text-[#0c1b14] font-bold">{formatPrice(cartSubtotal)}</span>
          </button>
        </div>
      )}

      {/* API success / error messages */}
      <ToastContainer />

      {/* 5. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={async (prod, qty) => {
          if (await addToCart(prod, qty)) navigateWebsite('cart');
        }}
      />
    </div>
  );
};
