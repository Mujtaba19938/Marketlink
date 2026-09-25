import React, { useState, useRef, useEffect } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme';
import { MockMap } from '../../components/common/MockMap';
import { PreOrderCartModal, CartItem } from '../../components/customer/PreOrderCartModal';
import { FourDimensionFilterBar, FourDimensionFilters } from '../../components/customer/FourDimensionFilterBar';
import { ProductDetailModal } from '../../components/customer/ProductDetailModal';
import { CompleteCustomerFlowModal, CustomerFlowStep } from '../../components/customer/CompleteCustomerFlowModal';
import { CustomerPreOrder } from '../../types/customer';
import { ProduceArt, UserAvatar } from '../../components/ProduceArt';
import { popularProducts as initialPopular, topItems as initialTop, allMarketProducts } from '../../data/marketData';
import { ProductItem, StallLocation } from '../../types/market';
import {
  Store,
  MapPin,
  Navigation,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Heart,
  Star,
  Sparkles,
  Check,
  Clock,
  Phone,
  Calendar,
  Search,
  ExternalLink,
  Leaf,
  Award,
  Truck,
  DollarSign,
  ChevronRight,
  X,
  User,
  Sun,
  Moon,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';

interface PublicWebsitePageProps {
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
}

export const PublicWebsitePage: React.FC<PublicWebsitePageProps> = ({
  onOpenLogin,
  onOpenDashboard,
}) => {
  const { isAuthenticated, currentUser, currentRole, setActiveAuthPortal, logout } = useAuth();
  const { markets, getStallsForMarket, triggerToast } = useMarketData();
  const { mode, resolvedMode, toggleMode } = useTheme();

  // Navigation scroll refs
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const produceSectionRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);

  // Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Sticky header scroll detection
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 180);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Market & Map state
  const [selectedMarketId, setSelectedMarketId] = useState<string>(markets[0]?.id || 'mkt-1');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>();

  // 4 Dimensions Filters State (Farmer-wise, Price-wise, Category-wise, Area-wise)
  const [filters, setFilters] = useState<FourDimensionFilters>({
    searchQuery: '',
    farmer: 'all',
    category: 'all',
    area: 'all',
    minPrice: 0,
    maxPrice: 25,
  });

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'stock'>('popular');

  // Selected product for Step 2 Product Detail Modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);

  // Complete Customer Flow Modal State (Cart -> Auth Check -> Register -> OTP Verify -> Login -> Checkout -> Stripe -> Delivery Tracking)
  const [customerFlowOpen, setCustomerFlowOpen] = useState(false);
  const [flowInitialStep, setFlowInitialStep] = useState<CustomerFlowStep>('cart');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<CustomerPreOrder | null>(null);

  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const currentMarketStalls = getStallsForMarket(selectedMarketId);

  // 4-Dimensional Filter Logic
  const filteredProducts = allMarketProducts
    .filter((p) => {
      // 1. Keyword search (Name, farm, farmer, area, or description)
      const q = filters.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.farmerName && p.farmerName.toLowerCase().includes(q)) ||
        (p.farmName && p.farmName.toLowerCase().includes(q)) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      // 2. Dimension 1: Farmer-wise
      const matchFarmer = filters.farmer === 'all' || p.farmerName === filters.farmer;

      // 3. Dimension 2: Price-wise (min & max bounds)
      const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;

      // 4. Dimension 3: Category-wise
      const matchCategory = filters.category === 'all' || p.category === filters.category;

      // 5. Dimension 4: Area-wise
      const matchArea = filters.area === 'all' || p.area === filters.area;

      return matchSearch && matchFarmer && matchPrice && matchCategory && matchArea;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0;
    });

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

  const openCustomerFlow = (step: CustomerFlowStep = 'cart', order: CustomerPreOrder | null = null) => {
    setSelectedOrderForTracking(order);
    setFlowInitialStep(step);
    setCustomerFlowOpen(true);
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
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderSuccessRedirect = (order: CustomerPreOrder) => {
    setCartOpen(false);
    setActiveAuthPortal('customer');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('marketlink_last_order_id', order.id);
      sessionStorage.setItem('marketlink_last_order_stall', order.stallName);
      sessionStorage.setItem('marketlink_last_order_total', order.total.toString());
      sessionStorage.setItem('marketlink_last_order_slot', order.pickupSlot);
    }
    // If logged in as another role (e.g. admin or vendor), log out so customer login is clean
    if (isAuthenticated && currentRole !== 'customer') {
      logout();
    }
    onOpenLogin();
  };

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([
    'prod-carrot',
    'prod-tomato',
    'prod-pepper',
    'prod-mushroom',
    'prod-honey',
  ]);

  const handleToggleFavorite = (productId: string) => {
    setFavoriteProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    triggerToast('Updated produce favorite state', 'info');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="theme-vezzole min-h-screen bg-[#07130e] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#def54d]/20 selection:text-[#def54d]">


      {/* 2. Glassmorphic Main Navigation Bar (Visible when scrolled past hero) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[#0c1b14]/95 backdrop-blur-md border-b border-emerald-900/50 transition-all duration-300 ${
          isScrolled ? 'translate-y-0 opacity-100 shadow-xl' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-[14px] bg-[#00a859] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Store className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit',sans-serif] leading-tight">
                  MarketLink
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-[#6b4724] bg-[#0c1811] text-[#c27c3e] text-[10px] font-bold tracking-wide">
                  SRS v1.0
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 block leading-tight">
                Farm Fresh Just a Click Away
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <button
              onClick={() => scrollTo(whyUsRef)}
              className="hover:text-white transition cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => scrollTo(produceSectionRef)}
              className="hover:text-white transition cursor-pointer"
            >
              Vegetables
            </button>
            <button
              onClick={() => scrollTo(mapSectionRef)}
              className="hover:text-white transition cursor-pointer"
            >
              Markets &amp; Stalls
            </button>
            <button
              onClick={() => scrollTo(howItWorksRef)}
              className="hover:text-white transition cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleMode}
              className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
              title="Toggle theme"
            >
              {resolvedMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Pre-Order Basket Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="px-3.5 py-1.5 bg-[#fcf5ed] hover:bg-white text-[#6f401f] rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#6f401f] stroke-[2.2]" />
              <span className="hidden sm:inline">Pre-Order Basket</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#6f401f] text-white text-[10px] font-black">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Sign In / Dashboard CTA */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-[#0c1b14] rounded-full text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 font-['Outfit',sans-serif]"
              >
                <div className="w-4 h-4 rounded-full overflow-hidden">
                  <UserAvatar className="w-full h-full" />
                </div>
                <span>Dashboard ({currentRole})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-1.5 bg-[#0a1c14] hover:bg-[#122b20] text-white border border-emerald-700/60 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 font-['Outfit',sans-serif] group shadow-xs"
              >
                <span>Dashboard Portals</span>
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section: Full Width Vezzole Layout */}
      <section className="relative overflow-hidden bg-[#0b1a13] w-full pt-6 pb-16 sm:pb-24 border-b border-emerald-950/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Top Navigation Bar inside Hero Frame */}
            <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
              {/* Brand Logo: MarketLink with Green Store Icon & SRS v1.0 Badge */}
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
              >
                <div className="w-11 h-11 rounded-[14px] bg-[#00a859] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
                  <Store className="w-6 h-6 text-white stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif] leading-tight">
                      MarketLink
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-[#6b4724] bg-[#0c1811] text-[#c27c3e] text-[10px] font-bold tracking-wide">
                      SRS v1.0
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 block leading-tight mt-0.5">
                    Farm Fresh Just a Click Away
                  </span>
                </div>
              </div>

              {/* Center Navigation Links */}
              <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-xs sm:text-sm font-semibold text-slate-300">
                <button
                  type="button"
                  onClick={() => scrollTo(whyUsRef)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(produceSectionRef)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vegetables
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast('Weekly seasonal harvest boxes opening this weekend!', 'info');
                    scrollTo(produceSectionRef);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Subscription
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(howItWorksRef)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </nav>

              {/* Right Action Pill Group */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Theme Toggle */}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Toggle Theme"
                >
                  {resolvedMode === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-300" />
                  )}
                </button>

                {/* Pre-Order Basket Pill Button */}
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="px-3.5 sm:px-4 py-2 bg-[#fcf5ed] hover:bg-white text-[#6f401f] rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#6f401f] stroke-[2.2]" />
                  <span>Pre-Order Basket</span>
                  {totalCartCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#6f401f] text-white text-[10px] font-black">
                      {totalCartCount}
                    </span>
                  )}
                </button>

                {/* Dashboard Portals Pill Button */}
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="px-4 sm:px-5 py-2 bg-white hover:bg-slate-100 text-[#0c1b14] rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 font-['Outfit',sans-serif]"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                      <UserAvatar className="w-full h-full" />
                    </div>
                    <span>Dashboard ({currentRole})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="bg-[#0a1c14] hover:bg-[#122b20] text-white px-5 py-2.5 rounded-full border border-emerald-700/60 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 group shadow-sm font-['Outfit',sans-serif]"
                  >
                    <span>Dashboard Portals</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Top Banner Card: "Guaranteed Freshness with Every Order!" */}
            <div
              className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[350px] sm:min-h-[410px] lg:min-h-[440px] flex items-center border border-emerald-700/30 shadow-2xl"
              style={{
                background:
                  'radial-gradient(circle at 35% 90%, rgba(222, 245, 77, 0.42) 0%, rgba(35, 78, 52, 0.38) 45%, rgba(13, 33, 23, 0.95) 75%), linear-gradient(125deg, #0e271c 0%, #153927 40%, #304e20 80%, #46621b 100%)',
              }}
            >
              {/* Floating Leaf Outline SVG */}
              <div className="absolute left-[44%] top-[45%] -translate-y-1/2 pointer-events-none hidden md:block opacity-35">
                <svg className="w-16 h-16 stroke-[#def54d] stroke-[1.4] fill-none -rotate-12" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.5 9.1 8.2 9.9.5.1.8-.3.8-.7v-3.5c0-.4-.3-.8-.7-.9C6.6 16 6 13.9 6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 1.9-.6 3.8-1.7 5.2-.2.3-.1.7.2.9.3.2.7.1.9-.2C18.6 16.2 19.3 14.2 19.3 12c0-5.5-4.5-10-10.3-10z" />
                  <path d="M12 6v12M12 10l4-2M12 14l-4-2" />
                </svg>
              </div>

              {/* Left Content Area */}
              <div className="relative z-10 p-6 sm:p-9 lg:p-12 max-w-xl">
                {/* 100% Certified Local Growers • Pay at Market Pickup Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15]/85 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-sm backdrop-blur-xs">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400 stroke-[2.2]" />
                  <span>100% Certified Local Growers • Pay at Market Pickup</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-black leading-[1.04] tracking-tight font-['Outfit',sans-serif] drop-shadow-sm mb-4">
                  <span className="text-white block">Skip the Store.</span>
                  <span className="text-[#b8733e] block">Taste the Harvest.</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-200/90 max-w-md lg:max-w-lg leading-relaxed">
                  Connect directly with verified local farmers in your city. Discover market stalls on Google Maps, check real-time stock, and pre-order seasonal morning harvests for easy weekend pickup with <strong className="text-white font-bold">zero online payment fees</strong>.
                </p>
              </div>

              {/* Right Model Photo: Woman holding Tomato and Wicker Basket of Produce */}
              <img
                src="/hero/hero-woman.png"
                alt="Smiling farmer holding basket of organic vegetables and fresh red tomato"
                className="absolute right-0 sm:right-4 lg:right-10 bottom-0 h-[88%] sm:h-[102%] lg:h-[106%] max-h-[460px] object-contain object-bottom pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] z-10"
              />
            </div>

            {/* Bottom 3-Card Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 mt-6 sm:mt-8 items-stretch">
              
              {/* Card 1 (Left): Diagonal Ribbons & Customer Reviews */}
              <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between py-2 relative">
                {/* Overlapping Diagonal Ribbon Stickers */}
                <div className="relative pl-1 pt-1 pb-4">
                  {/* Top Lime Ribbon */}
                  <div className="inline-block bg-[#def54d] text-[#0c1b14] text-[11px] font-black tracking-wider px-3.5 py-1 -rotate-6 shadow-md uppercase rounded-[2px] transform origin-left">
                    healthy food Every time
                  </div>
                  {/* Bottom Orange Ribbon */}
                  <div className="inline-block bg-[#ea580c] text-white text-[11px] font-black tracking-wider px-4 py-1 rotate-45 shadow-md uppercase rounded-[2px] transform origin-top-left -mt-1 ml-1">
                    healthy food Every time 🛍️ Market...
                  </div>
                </div>

                {/* Social Proof Metric & Overlapping Avatars */}
                <div className="pt-4">
                  <div className="text-4xl sm:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight leading-none">
                    2k+
                  </div>
                  <div className="text-slate-400 font-medium text-xs sm:text-sm mt-1.5 mb-4">
                    Review Customer
                  </div>

                  {/* Overlapping 4 Customer Avatars */}
                  <div className="flex items-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Review Customer 1"
                      className="w-10 h-10 rounded-full ring-2 ring-[#0c1b14] object-cover shadow-sm"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Review Customer 2"
                      className="w-10 h-10 rounded-full ring-2 ring-[#0c1b14] object-cover -ml-2.5 shadow-sm"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                      alt="Review Customer 3"
                      className="w-10 h-10 rounded-full ring-2 ring-[#0c1b14] object-cover -ml-2.5 shadow-sm"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      alt="Review Customer 4"
                      className="w-10 h-10 rounded-full ring-2 ring-[#0c1b14] object-cover -ml-2.5 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 (Center): Fresh & Organic Vegetable Bright Lime Card */}
              <div
                onClick={() => scrollTo(produceSectionRef)}
                className="md:col-span-5 lg:col-span-5 bg-[#def54d] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-xl hover:shadow-[#def54d]/25 transition-all duration-300 group cursor-pointer"
              >
                {/* Top Row: Title + Circle Arrow Button */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-black text-2xl sm:text-3xl text-[#0c1b14] leading-[1.1] font-['Outfit',sans-serif]">
                    Fresh &amp; Organic<br />Vegetable
                  </h3>

                  <div className="w-10 h-10 rounded-full bg-white text-[#0c1b14] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Bottom Visual: Paper Bag Brimming with Fresh Produce */}
                <div className="relative mt-2 -mb-2 flex justify-center">
                  <img
                    src="/hero/hero-bag.png"
                    alt="Fresh organic vegetables, baguettes, and farm eggs in paper grocery bag"
                    className="w-full h-48 sm:h-56 object-contain object-bottom drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Card 3 (Right): Category Pills & Fresh Broccoli */}
              <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-between relative pl-0 sm:pl-2">
                {/* Top Heading */}
                <div>
                  <h4 className="text-[#def54d] font-bold text-base sm:text-lg leading-snug font-['Outfit',sans-serif] max-w-xs mb-4">
                    More than just a provider of fresh, organic product
                  </h4>

                  {/* Produce Filter Badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-2.5 max-w-sm">
                    {['Cauliflower', 'Brinjal', 'Cabbage', 'Tomato', 'Lettuce', 'Broccoli'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, searchQuery: item }));
                          triggerToast(`Filtered catalog for ${item}`, 'info');
                          scrollTo(produceSectionRef);
                        }}
                        className="bg-[#12281e] hover:bg-[#1a382a] border border-emerald-800/80 hover:border-[#def54d] text-slate-200 hover:text-[#def54d] text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom-Right Corner Visual: Fresh Green Broccoli */}
                <div className="relative flex justify-end mt-4 -mr-3 -mb-3 pointer-events-none">
                  <img
                    src="/hero/hero-broccoli.png"
                    alt="Crisp fresh green broccoli crowns"
                    className="w-52 sm:w-60 h-40 sm:h-44 object-contain object-bottom-right drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* 4. Google Maps Interactive Stall Discovery Section */}
      <section ref={mapSectionRef} id="markets-map" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20 text-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12281e] text-[#def54d] text-xs font-bold border border-emerald-800/80 shadow-xs font-['Outfit',sans-serif]">
              <Navigation className="w-3.5 h-3.5 text-[#def54d]" />
              <span>Google Maps API Integration • SRS Section 1.6</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Find Stalls &amp; Markets on Google Maps
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore regional farmers markets across the metro area. Click any stall marker on the map to
              zoom into that stall booth, inspect weekly organic stock, and launch GPS route directions.
            </p>
          </div>

          {/* Market Selector Dropdown */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Choose Market:</span>
            <select
              value={selectedMarketId}
              onChange={(e) => {
                setSelectedMarketId(e.target.value);
                const stalls = getStallsForMarket(e.target.value);
                setSelectedStallId(stalls[0]?.id);
              }}
              className="px-4 py-2.5 bg-[#0e241b] border border-emerald-800/70 rounded-2xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30 shadow-md cursor-pointer"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0b1a13] text-white">
                  {m.name} ({m.activeVendorsCount} Stalls)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Embedded Real Google Maps Component with Dynamic Stalls */}
        <div className="bg-[#0b1a13] rounded-[30px] p-5 sm:p-6 border border-emerald-900/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-emerald-900/50 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#def54d]" />
              <span className="font-bold text-white text-sm font-['Outfit',sans-serif]">
                {currentMarket.name}
              </span>
              <span className="text-slate-400 hidden sm:inline">• {currentMarket.address}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#def54d]" />
              <span>{currentMarket.operatingDays.join(', ')}: {currentMarket.timings}</span>
            </div>
          </div>

          <MockMap
            lat={currentMarket.lat}
            lng={currentMarket.lng}
            marketName={currentMarket.name}
            address={currentMarket.address}
            showDirections={true}
            height="h-[460px]"
            stalls={currentMarketStalls}
            selectedStallId={selectedStallId}
            onSelectStall={(stall) => {
              setSelectedStallId(stall.id);
            }}
            onPreOrderStall={(stall) => {
              // Add first specialty item if possible
              const matchingProd = allMarketProducts[0];
              if (matchingProd) handleAddToCart(matchingProd, 1);
              openCustomerFlow('cart');
            }}
          />
        </div>

        {/* Featured Stalls Present at this Market Grid */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white font-['Outfit',sans-serif]">
              Stalls at {currentMarket.name} ({currentMarketStalls.length} Booths)
            </h3>
            <span className="text-xs text-slate-400">Click &quot;Locate on Map&quot; to pan directly to booth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentMarketStalls.map((stall) => {
              const isSelected = selectedStallId === stall.id;

              return (
                <div
                  key={stall.id}
                  className={`p-6 rounded-[26px] border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-[#122d21] border-[#def54d] ring-2 ring-[#def54d]/30 shadow-xl'
                      : 'bg-[#0e241b] border-emerald-900/60 hover:border-emerald-700/80 shadow-md hover:shadow-xl'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#def54d] text-[#0c1b14] font-black text-[10px] tracking-wider uppercase font-['Outfit',sans-serif]">
                        {stall.stallNumber}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{stall.rating}</span>
                        <span className="text-slate-400 font-normal">({stall.ordersCount})</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-base text-white leading-snug font-['Outfit',sans-serif]">
                      {stall.stallName}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {stall.description}
                    </p>

                    {/* Produce tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stall.specialtyItems.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-xl bg-[#132c20] text-[10px] text-slate-200 font-medium border border-emerald-800/60"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-900/60 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStallId(stall.id);
                        scrollTo(mapSectionRef);
                        triggerToast(`Focused on ${stall.stallNumber} on Google Maps`, 'info');
                      }}
                      className="inline-flex items-center gap-1.5 font-bold text-[#def54d] hover:underline cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#def54d]" />
                      <span>Locate on Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStallId(stall.id);
                        scrollTo(produceSectionRef);
                      }}
                      className="px-4 py-2 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] rounded-full font-black text-xs transition cursor-pointer active:scale-95 shadow-sm font-['Outfit',sans-serif]"
                    >
                      Pre-Order Harvest
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Fresh Produce Catalog & Pre-Order Marketplace */}
      <section ref={produceSectionRef} id="fresh-produce" className="py-16 sm:py-24 bg-[#0b1a13] border-y border-emerald-950/80 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12281e] text-[#def54d] text-xs font-bold border border-emerald-800/80 shadow-xs font-['Outfit',sans-serif]">
                <ShoppingBag className="w-3.5 h-3.5 text-[#def54d]" />
                <span>Complete Customer Flow • 4-Dimension Produce Discovery</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
                Shop This Week&apos;s Fresh Harvest
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Filter across 4 dimensions: Farmer, Price, Category, and Area. Click any produce to view
                detailed farmer specs, adjust quantity, add to cart, and experience our zero-fee morning pickup.
              </p>
            </div>

            {/* Quick Basket Button */}
            {totalCartCount > 0 && (
              <button
                type="button"
                onClick={() => openCustomerFlow('cart')}
                className="px-5 py-3 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] rounded-full font-black text-xs shadow-lg transition flex items-center gap-2.5 cursor-pointer active:scale-95 shrink-0 font-['Outfit',sans-serif]"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Review Cart ({totalCartCount} items)</span>
                <span className="font-mono bg-[#0c1b14] text-[#def54d] px-2 py-0.5 rounded-md font-bold text-xs">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </button>
            )}
          </div>

          {/* 4-Dimensional Filter Bar */}
          <div className="space-y-4">
            <FourDimensionFilterBar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResultsCount={filteredProducts.length}
            />

            {/* Sort Bar */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400 font-medium">
                Showing <strong className="text-[#def54d]">{filteredProducts.length}</strong> matching organic products
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300 font-bold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-1.5 bg-[#0e241b] border border-emerald-800/70 rounded-xl text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="popular" className="bg-[#0b1a13]">Most Popular</option>
                  <option value="price_asc" className="bg-[#0b1a13]">Price: Low to High</option>
                  <option value="price_desc" className="bg-[#0b1a13]">Price: High to Low</option>
                  <option value="stock" className="bg-[#0b1a13]">Highest Harvest Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Produce Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[#0e241b] rounded-3xl border border-emerald-900/60">
              <div className="w-14 h-14 rounded-full bg-[#132c21] flex items-center justify-center mx-auto text-[#def54d]">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-white font-['Outfit',sans-serif]">
                No produce found matching your filter
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Try widening your price range, choosing another farmer or area, or clearing active filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] rounded-full text-xs font-black cursor-pointer transition shadow-md font-['Outfit',sans-serif]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {filteredProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProductForModal(product)}
                    className="bg-[#0e241b] rounded-[24px] p-4 border border-emerald-900/60 hover:border-[#def54d]/70 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Art Box */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#132c21] mb-3 select-none flex items-center justify-center">
                        <ProduceArt type={product.imageType} className="transition-transform duration-300 group-hover:scale-110" />

                        {product.hasRedDot && (
                          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-xs" />
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(product.id);
                          }}
                          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs flex items-center justify-center text-slate-300 hover:text-red-400 transition shadow-xs cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              product.isFavorite ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#132c20] text-[#def54d] text-[9px] font-bold border border-emerald-800/70 truncate max-w-[120px]">
                          👨‍🌾 {product.farmerName || 'Marcus Vance'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-white text-xs sm:text-sm leading-snug truncate font-['Outfit',sans-serif]" title={product.name}>
                        {product.name}
                      </h4>

                      <div className="flex items-center justify-between text-slate-400 text-[10px] mt-1 font-medium">
                        <span className="truncate">📍 {product.area || 'Downtown'}</span>
                        <span className="shrink-0 text-emerald-300/80">{product.stock} left</span>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-emerald-900/60">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[#def54d] font-black text-base tabular-nums font-['Outfit',sans-serif]">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-slate-400 text-[10px]">/{product.unit}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product, 1);
                        }}
                        className="w-8 h-8 rounded-full bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] flex items-center justify-center transition-transform active:scale-90 shadow-md cursor-pointer font-bold"
                        title="Add to cart"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20 text-white">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12281e] text-[#def54d] text-xs font-bold border border-emerald-800/80 shadow-xs font-['Outfit',sans-serif]">
            <Clock className="w-3.5 h-3.5 text-[#def54d]" />
            <span>Seamless 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
            How MarketLink Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Per SRS Section 1.5 &amp; 1.6: Pre-orders are reserved online and settled in-person at the market
            booth. Zero upfront charges, zero delivery markup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="bg-[#0e241b] rounded-[28px] p-7 border border-emerald-900/60 shadow-xl space-y-4 hover:border-[#def54d]/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center font-black text-xl font-['Outfit',sans-serif] shadow-md shadow-[#def54d]/20 group-hover:scale-105 transition-transform">
              1
            </div>
            <h3 className="font-extrabold text-lg text-white font-['Outfit',sans-serif]">
              Discover Stalls on Google Maps
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore your regional market on our interactive Google Map. Click any stall marker to zoom
              directly into their pavilion booth (e.g. Stall #14) and inspect weekly inventory.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0e241b] rounded-[28px] p-7 border border-emerald-900/60 shadow-xl space-y-4 hover:border-[#def54d]/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center font-black text-xl font-['Outfit',sans-serif] shadow-md shadow-[#def54d]/20 group-hover:scale-105 transition-transform">
              2
            </div>
            <h3 className="font-extrabold text-lg text-white font-['Outfit',sans-serif]">
              Reserve Online (No Payment Card)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Add freshly harvested items to your pre-order basket. Pick your convenient pickup time window
              before the weekly cutoff. You receive a verified pickup QR badge.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0e241b] rounded-[28px] p-7 border border-emerald-900/60 shadow-xl space-y-4 hover:border-[#def54d]/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center font-black text-xl font-['Outfit',sans-serif] shadow-md shadow-[#def54d]/20 group-hover:scale-105 transition-transform">
              3
            </div>
            <h3 className="font-extrabold text-lg text-white font-['Outfit',sans-serif]">
              Pick Up &amp; Pay at the Booth
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use Google Maps GPS directions to navigate straight to the booth. Inspect your fresh harvest,
              present your order code, and pay in person (cash or card) directly to the grower.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Why MarketLink (Farmer Support & Benefits) */}
      <section ref={whyUsRef} id="why-us" className="py-16 sm:py-24 bg-[#0b1a13] border-y border-emerald-950/80 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-[#12281e] text-[#def54d] text-xs font-bold border border-emerald-800/80 shadow-xs font-['Outfit',sans-serif]">
              The Organic Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Why Conscious Shoppers Choose MarketLink
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Transforming how urban communities access regenerative, locally grown food.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 p-7 rounded-[26px] space-y-3.5 shadow-xl transition-all group">
              <Award className="w-8 h-8 text-[#def54d] group-hover:scale-110 transition-transform" />
              <h4 className="font-black text-base text-white font-['Outfit',sans-serif]">Morning Fresh Harvest</h4>
              <p className="text-slate-300 leading-relaxed">
                Produce is picked at 5:00 AM on market day, not weeks ago in cold industrial warehouses.
              </p>
            </div>

            <div className="bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 p-7 rounded-[26px] space-y-3.5 shadow-xl transition-all group">
              <DollarSign className="w-8 h-8 text-[#def54d] group-hover:scale-110 transition-transform" />
              <h4 className="font-black text-base text-white font-['Outfit',sans-serif]">100% Direct Farmer Revenue</h4>
              <p className="text-slate-300 leading-relaxed">
                Every dollar stays with local family farms. Zero wholesale distributors taking 60% markups.
              </p>
            </div>

            <div className="bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 p-7 rounded-[26px] space-y-3.5 shadow-xl transition-all group">
              <MapPin className="w-8 h-8 text-[#def54d] group-hover:scale-110 transition-transform" />
              <h4 className="font-black text-base text-white font-['Outfit',sans-serif]">Google Maps Stall Pins</h4>
              <p className="text-slate-300 leading-relaxed">
                Never wander crowded market sheds guessing booth numbers. Navigate directly with live turn-by-turn routes.
              </p>
            </div>

            <div className="bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 p-7 rounded-[26px] space-y-3.5 shadow-xl transition-all group">
              <Leaf className="w-8 h-8 text-[#def54d] group-hover:scale-110 transition-transform" />
              <h4 className="font-black text-base text-white font-['Outfit',sans-serif]">Zero Food Waste</h4>
              <p className="text-slate-300 leading-relaxed">
                Farmers only harvest what shoppers pre-order, eliminating surplus landfill waste entirely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-700/40 relative overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 35% 85%, rgba(222, 245, 77, 0.35) 0%, rgba(35, 78, 52, 0.4) 45%, rgba(13, 33, 23, 0.95) 75%), linear-gradient(125deg, #0e271c 0%, #153927 40%, #304e20 80%, #46621b 100%)',
          }}
        >
          <div className="space-y-3 max-w-xl z-10">
            <span className="text-[#def54d] font-black tracking-wider text-xs uppercase font-['Outfit',sans-serif]">
              #PEOPLE&apos;S CHOICE FOR ORGANIC PRODUCE
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-['Outfit',sans-serif] leading-tight">
              Ready to taste authentic local harvests this weekend?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Browse market stalls on Google Maps, build your fresh produce basket, or access your role
              dashboard portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0 z-10">
            <button
              type="button"
              onClick={() => scrollTo(produceSectionRef)}
              className="px-7 py-3.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] rounded-full font-black text-xs shadow-xl transition cursor-pointer active:scale-95 font-['Outfit',sans-serif]"
            >
              Order Fresh Produce Now
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-6 py-3.5 bg-[#12281e] hover:bg-[#1a382a] text-white border border-emerald-700/60 rounded-full font-bold text-xs transition cursor-pointer active:scale-95"
            >
              Dashboard Login Portal
            </button>
          </div>
        </div>
      </section>

      {/* 9. Website Footer */}
      <footer className="border-t border-emerald-950/90 bg-[#050d09] text-slate-400 text-xs py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#00a859] flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
                <Store className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit',sans-serif]">
                    MarketLink
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-[#6b4724] bg-[#0c1811] text-[#c27c3e] text-[10px] font-bold tracking-wide">
                    SRS v1.0
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400 block leading-tight mt-0.5">
                  Farm Fresh Just a Click Away
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Connecting local farmers with local shoppers to eliminate wasted market trips and stock unpredictability.
            </p>
            <div className="text-[10px] text-emerald-400/80 font-medium">
              SRS v1.0 • Guaranteed Freshness with Every Order
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 font-['Outfit',sans-serif]">Participating Markets</h5>
            <ul className="space-y-2 text-xs">
              {markets.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMarketId(m.id);
                      scrollTo(mapSectionRef);
                    }}
                    className="hover:text-[#def54d] transition text-left"
                  >
                    {m.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 font-['Outfit',sans-serif]">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo(mapSectionRef)} className="hover:text-[#def54d] transition">
                  Google Maps Stall Locator
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo(produceSectionRef)} className="hover:text-[#def54d] transition">
                  Fresh Harvest Catalog
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo(howItWorksRef)} className="hover:text-[#def54d] transition">
                  How Pre-Orders Work
                </button>
              </li>
              <li>
                <button onClick={() => setCartOpen(true)} className="hover:text-[#def54d] transition">
                  Review Active Basket
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 font-['Outfit',sans-serif]">Dashboard Portals</h5>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full text-left p-3 rounded-2xl bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 transition text-xs font-bold text-white flex items-center justify-between group"
              >
                <span>🔐 SuperAdmin Hub</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#def54d] group-hover:translate-x-0.5 transition" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full text-left p-3 rounded-2xl bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 transition text-xs font-bold text-white flex items-center justify-between group"
              >
                <span>🚜 Farmer Operations</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#def54d] group-hover:translate-x-0.5 transition" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full text-left p-3 rounded-2xl bg-[#0e241b] border border-emerald-900/60 hover:border-[#def54d]/60 transition text-xs font-bold text-white flex items-center justify-between group"
              >
                <span>🛒 Customer Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#def54d] group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-emerald-950/80 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} MarketLink. Built in strict compliance with the Software Requirements Specification v1.0.
        </div>
      </footer>

      {/* 10. Floating Pre-Order Cart Trigger */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => openCustomerFlow('cart')}
            className="px-5 py-3.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] rounded-full shadow-2xl flex items-center gap-3 font-black text-xs cursor-pointer active:scale-95 transition border border-white/20 font-['Outfit',sans-serif]"
          >
            <div className="w-6 h-6 rounded-full bg-[#0c1b14] text-[#def54d] text-xs font-black flex items-center justify-center shadow-xs">
              {totalCartCount}
            </div>
            <span>View Cart &amp; Checkout</span>
            <span className="font-mono bg-[#0c1b14]/15 px-2 py-0.5 rounded-lg text-[#0c1b14] font-bold">
              ${cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Step 2: Product Detail Modal (SRS & User Specification) */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={(prod, qty) => {
          handleAddToCart(prod, qty);
          openCustomerFlow('cart');
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
        onNavigateToDashboard={onOpenDashboard}
      />

      {/* Fallback Legacy Cart Modal */}
      <PreOrderCartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onNavigateToMap={() => {
          setCartOpen(false);
          scrollTo(mapSectionRef);
        }}
        onNavigateToOrders={() => {
          setCartOpen(false);
          onOpenDashboard();
        }}
        onOrderSuccessRedirect={handleOrderSuccessRedirect}
      />
    </div>
  );
};
