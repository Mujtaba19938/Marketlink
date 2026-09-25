import React, { useState, useRef } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme';
import { MockMap } from '../../components/common/MockMap';
import { PreOrderCartModal, CartItem } from '../../components/customer/PreOrderCartModal';
import { CustomerPreOrder } from '../../types/customer';
import { ProduceArt, UserAvatar } from '../../components/ProduceArt';
import { popularProducts as initialPopular, topItems as initialTop } from '../../data/marketData';
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

  // Market & Map state
  const [selectedMarketId, setSelectedMarketId] = useState<string>(markets[0]?.id || 'mkt-1');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedStallId, setSelectedStallId] = useState<string | undefined>();

  // Produce catalog state
  const [productsList, setProductsList] = useState<ProductItem[]>([
    ...initialPopular,
    ...initialTop,
    {
      id: 'prod-peppers',
      name: 'Crisp Bell Peppers',
      category: 'veggies',
      stock: 145,
      price: 4.5,
      unit: 'pre kg',
      imageType: 'pepper',
    },
    {
      id: 'prod-mushroom',
      name: 'Organic Hardwood Mushrooms',
      category: 'veggies',
      stock: 80,
      price: 12.0,
      unit: 'pre kg',
      imageType: 'mushroom',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'stock'>('popular');

  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const currentMarketStalls = getStallsForMarket(selectedMarketId);

  // Filtered produce
  const filteredProducts = productsList
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0;
    });

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

  const handleToggleFavorite = (productId: string) => {
    setProductsList((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#121110] text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#22c55e]/20 selection:text-emerald-700">
      {/* 1. Top Announcement Header Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-900/50 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="font-semibold text-white">This Weekend&apos;s Harvest Active:</span>
            <span className="hidden sm:inline text-emerald-300">
              Fresh produce pre-orders open for {currentMarket.name}. Zero online payment required!
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:inline text-emerald-400">
              📍 Pickup Window: {currentMarket.timings}
            </span>
            <button
              type="button"
              onClick={isAuthenticated ? onOpenDashboard : onOpenLogin}
              className="text-white hover:text-[#22c55e] font-bold underline transition cursor-pointer"
            >
              {isAuthenticated ? `Go to ${currentRole.toUpperCase()} Dashboard →` : 'Farmer & Admin Portal →'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Glassmorphic Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#181614]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  MarketLink
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#22c55e] font-bold text-[9px] border border-emerald-200 dark:border-emerald-800">
                  SRS v1.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Farm Fresh Just a Click Away
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollTo(mapSectionRef)}
              className="hover:text-[#22c55e] transition cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Markets & Stalls</span>
            </button>
            <button
              onClick={() => scrollTo(produceSectionRef)}
              className="hover:text-[#22c55e] transition cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Fresh Harvest</span>
            </button>
            <button
              onClick={() => scrollTo(howItWorksRef)}
              className="hover:text-[#22c55e] transition cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo(whyUsRef)}
              className="hover:text-[#22c55e] transition cursor-pointer"
            >
              Why MarketLink
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {resolvedMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Pre-Order Basket Trigger Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-[#22c55e] border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Pre-Order Basket</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#22c55e] text-white text-[10px] font-black">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Sign In / Dashboard Access CTA */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
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
                className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <span>Dashboard Portals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section: "Skip the Store. Taste the Morning Harvest." */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-emerald-50/50 via-white to-[#fafaf9] dark:from-emerald-950/20 dark:via-[#151413] dark:to-[#121110]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, SRS Value Prop & Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>100% Certified Local Growers • Pay at Market Pickup</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Skip the Store. <br />
                <span className="text-[#22c55e] bg-gradient-to-r from-[#22c55e] to-emerald-600 bg-clip-text text-transparent">
                  Taste the Harvest.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Connect directly with verified local farmers in your city. Discover market stalls on Google
                Maps, check real-time stock, and pre-order seasonal morning harvests for easy weekend pickup
                with <strong>zero online payment fees</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => scrollTo(mapSectionRef)}
                  className="px-6 py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Find Stalls on Google Maps</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo(produceSectionRef)}
                  className="px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-xs shadow-xs flex items-center gap-2.5 transition active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#22c55e]" />
                  <span>Browse Fresh Produce</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-4 py-3.5 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Dashboard Login</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10 text-xs">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-lg">38+</div>
                  <div className="text-slate-500 text-[11px]">Regional Stalls</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#22c55e] text-lg">$0.00</div>
                  <div className="text-slate-500 text-[11px]">Pay at Pickup</div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-lg">5 Markets</div>
                  <div className="text-slate-500 text-[11px]">Active in City</div>
                </div>
                <div>
                  <div className="font-extrabold text-amber-500 text-lg flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 / 5</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">Freshness Rating</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Interactive Produce Spotlight */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white dark:bg-[#1b1917] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#22c55e]" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Featured Harvest of the Week
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#22c55e] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                    Harvested 5 AM Today
                  </span>
                </div>

                {/* 3 Quick Product Showcase Cards */}
                <div className="space-y-2.5">
                  {initialPopular.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 hover:border-emerald-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center border border-slate-100 dark:border-white/10">
                          <ProduceArt type={prod.imageType} className="w-9 h-9" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] font-bold text-[#22c55e]">
                            ${prod.price.toFixed(2)} /{prod.unit}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(prod, 1)}
                        className="px-3 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pre-Order</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Stall location badge */}
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#22c55e]" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block text-[11px]">
                        Stall #14 • Green Valley Organics
                      </span>
                      <span className="text-[10px] text-slate-400">Downtown Fresh Pavilion (North Shed A)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMarketId('mkt-1');
                      setSelectedStallId('stl-101');
                      scrollTo(mapSectionRef);
                    }}
                    className="text-[#22c55e] hover:underline font-bold text-[11px] whitespace-nowrap"
                  >
                    View on Map →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Google Maps Interactive Stall Discovery Section */}
      <section ref={mapSectionRef} id="markets-map" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps API Integration (SRS Section 1.6)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              Find Stalls & Markets on Google Maps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Explore regional farmers markets across the metro area. Click any stall marker on the map to
              zoom into that stall booth, inspect weekly organic stock, and launch GPS route directions.
            </p>
          </div>

          {/* Market Selector Dropdown */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Choose Market:</span>
            <select
              value={selectedMarketId}
              onChange={(e) => {
                setSelectedMarketId(e.target.value);
                const stalls = getStallsForMarket(e.target.value);
                setSelectedStallId(stalls[0]?.id);
              }}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.activeVendorsCount} Stalls)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Embedded Real Google Maps Component with Dynamic Stalls */}
        <div className="bg-white dark:bg-[#181614] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#22c55e]" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {currentMarket.name}
              </span>
              <span className="text-slate-400 hidden sm:inline">• {currentMarket.address}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
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
              const matchingProd = productsList[0];
              if (matchingProd) handleAddToCart(matchingProd, 1);
              setCartOpen(true);
            }}
          />
        </div>

        {/* Featured Stalls Present at this Market Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Stalls at {currentMarket.name} ({currentMarketStalls.length} Booths)
            </h3>
            <span className="text-xs text-slate-400">Click &quot;Locate on Map&quot; to pan directly to booth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMarketStalls.map((stall) => {
              const isSelected = selectedStallId === stall.id;

              return (
                <div
                  key={stall.id}
                  className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white dark:bg-[#181614] border-slate-200/80 dark:border-white/10 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                        {stall.stallNumber}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{stall.rating}</span>
                        <span className="text-slate-400 font-normal">({stall.ordersCount})</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {stall.stallName}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {stall.description}
                    </p>

                    {/* Produce tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {stall.specialtyItems.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStallId(stall.id);
                        scrollTo(mapSectionRef);
                        triggerToast(`Focused on ${stall.stallNumber} on Google Maps`, 'info');
                      }}
                      className="inline-flex items-center gap-1.5 font-bold text-[#22c55e] hover:underline cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Locate on Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStallId(stall.id);
                        scrollTo(produceSectionRef);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-[11px] transition cursor-pointer"
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
      <section ref={produceSectionRef} id="fresh-produce" className="py-16 sm:py-20 bg-white dark:bg-[#151413] border-y border-slate-200/80 dark:border-white/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Morning Farm Harvest (Pay at Pickup)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
                Shop This Week&apos;s Fresh Harvest
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Add fresh produce to your basket, choose your pickup window at the stall, and pay in-person
                upon collection. Zero middleman markup.
              </p>
            </div>

            {/* Quick Basket Button */}
            {totalCartCount > 0 && (
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="px-4 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Review Cart ({totalCartCount} items)</span>
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded-lg">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </button>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search carrots, cabbage, kale, honey..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
              {[
                { id: 'all', label: 'All Produce' },
                { id: 'veggies', label: 'Veggies' },
                { id: 'tubers', label: 'Tubers & Roots' },
                { id: 'fruits', label: 'Fruits' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#22c55e] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="stock">Highest Stock</option>
              </select>
            </div>
          </div>

          {/* Produce Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#181614] rounded-2xl p-3.5 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Art Box */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 dark:bg-white/5 mb-3 select-none flex items-center justify-center">
                      <ProduceArt type={product.imageType} className="transition-transform duration-300 group-hover:scale-105" />

                      {product.hasRedDot && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-xs" />
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(product.id);
                        }}
                        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-red-500 transition shadow-2xs cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            product.isFavorite ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white text-xs leading-snug truncate" title={product.name}>
                      {product.name}
                    </h4>

                    <p className="text-slate-400 text-[11px] mt-0.5 font-medium">
                      {product.stock} in harvest stock
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[#22c55e] font-extrabold text-sm tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-slate-400 text-[10px]">/{product.unit}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, 1)}
                      className="w-7 h-7 rounded-xl bg-[#22c55e] hover:bg-emerald-600 text-white flex items-center justify-center transition active:scale-90 shadow-xs cursor-pointer"
                      title="Add to pre-order basket"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. How It Works Section (SRS 1.5 & 1.6 Compliant) */}
      <section ref={howItWorksRef} id="how-it-works" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Seamless 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How MarketLink Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Per SRS Section 1.5 & 1.6: Pre-orders are reserved online and settled in-person at the market
            booth. No upfront credit card charges or delivery fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#181614] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] flex items-center justify-center font-extrabold text-lg">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Discover Stalls on Google Maps
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore your regional market on our interactive Google Map. Click any stall marker to zoom
              directly into their pavilion booth (e.g. Stall #14) and view weekly inventory.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#181614] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] flex items-center justify-center font-extrabold text-lg">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Reserve Online (No Payment Card)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add freshly harvested items to your pre-order basket. Pick your convenient pickup time window
              before the weekly Friday cutoff. You receive a unique order reference badge.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#181614] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#22c55e] flex items-center justify-center font-extrabold text-lg">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Pick Up & Pay at the Booth
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use Google Maps GPS directions to navigate to the stall counter. Inspect your fresh harvest,
              present your order code, and pay in person (cash or card) directly to the grower.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Why MarketLink (Farmer Support & Benefits) */}
      <section ref={whyUsRef} id="why-us" className="py-16 sm:py-20 bg-emerald-950 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold">
              The Local Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Why Conscious Shoppers Choose MarketLink
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300">
              Transforming how urban communities access regenerative, locally grown food.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
              <Award className="w-8 h-8 text-[#22c55e]" />
              <h4 className="font-bold text-sm text-white">Morning Fresh Harvest</h4>
              <p className="text-emerald-300/80 leading-relaxed">
                Produce is picked at 5:00 AM on market day, not weeks ago in cold industrial warehouses.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
              <DollarSign className="w-8 h-8 text-[#22c55e]" />
              <h4 className="font-bold text-sm text-white">100% Direct Farmer Revenue</h4>
              <p className="text-emerald-300/80 leading-relaxed">
                Every dollar stays with local family farms. Zero wholesale distributors taking 60% markups.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
              <MapPin className="w-8 h-8 text-[#22c55e]" />
              <h4 className="font-bold text-sm text-white">Google Maps Stall Pins</h4>
              <p className="text-emerald-300/80 leading-relaxed">
                Never wander crowded market sheds guessing booth numbers. Navigate directly with live turn-by-turn routes.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
              <Leaf className="w-8 h-8 text-[#22c55e]" />
              <h4 className="font-bold text-sm text-white">Zero Food Waste</h4>
              <p className="text-emerald-300/80 leading-relaxed">
                Farmers only harvest what shoppers pre-order, eliminating surplus landfill waste entirely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to taste authentic local harvests this weekend?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100">
              Browse market stalls on Google Maps, build your fresh produce basket, or access your role
              dashboard portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollTo(produceSectionRef)}
              className="px-6 py-3.5 bg-white text-emerald-900 rounded-2xl font-bold text-xs shadow-md hover:bg-slate-50 transition cursor-pointer active:scale-95"
            >
              Order Fresh Produce Now
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-6 py-3.5 bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-400/30 rounded-2xl font-bold text-xs transition cursor-pointer active:scale-95"
            >
              Dashboard Login Portal
            </button>
          </div>
        </div>
      </section>

      {/* 9. Website Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#121110] text-slate-500 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#22c55e] flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                MarketLink
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Connecting local farmers with local shoppers to eliminate wasted market trips and stock unpredictability.
            </p>
            <div className="text-[10px] text-slate-400">
              SRS v1.0 • Category: End-to-End Web Solutions
            </div>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3">Participating Markets</h5>
            <ul className="space-y-1.5 text-[11px]">
              {markets.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMarketId(m.id);
                      scrollTo(mapSectionRef);
                    }}
                    className="hover:text-[#22c55e] transition text-left"
                  >
                    {m.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3">Quick Links</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => scrollTo(mapSectionRef)} className="hover:text-[#22c55e]">
                  Google Maps Stall Locator
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo(produceSectionRef)} className="hover:text-[#22c55e]">
                  Fresh Harvest Catalog
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo(howItWorksRef)} className="hover:text-[#22c55e]">
                  How Pre-Orders Work
                </button>
              </li>
              <li>
                <button onClick={() => setCartOpen(true)} className="hover:text-[#22c55e]">
                  Review Active Basket
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3">Dashboard Portals</h5>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-300 transition text-[11px] font-bold text-slate-800 dark:text-white"
              >
                🔐 SuperAdmin Governance Hub
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-300 transition text-[11px] font-bold text-slate-800 dark:text-white"
              >
                🚜 Farmer / Stall Operations
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-300 transition text-[11px] font-bold text-slate-800 dark:text-white"
              >
                🛒 Customer Market Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} MarketLink (eGreen Basket). Built in strict compliance with the Software Requirements Specification v1.0.
        </div>
      </footer>

      {/* 10. Floating Pre-Order Cart Trigger (Bottom-Right) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="px-5 py-3.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs cursor-pointer active:scale-95 transition"
          >
            <div className="w-6 h-6 rounded-full bg-white text-emerald-700 text-xs font-black flex items-center justify-center shadow-xs">
              {totalCartCount}
            </div>
            <span>View Pre-Order Basket</span>
            <span className="font-mono bg-emerald-700/60 px-2 py-0.5 rounded-lg text-white">
              ${cartSubtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* 11. Pre-Order Cart Modal with Pickup Date/Slot Selection */}
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
