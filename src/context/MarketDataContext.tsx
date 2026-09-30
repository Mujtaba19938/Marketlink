import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdminOverview,
  CategoryMasterItem,
  ContactMessage,
  CustomerRecord,
  FarmerRecord,
  MarketRecord,
  ModerationItem,
  SystemAnnouncement,
} from '../types/admin';
import {
  FarmerAssignment,
  StallSettings,
  VendorInsights,
  VendorOrder,
  VendorOrderStatus,
  VendorPickupSlot,
  VendorProduct,
  VendorReview,
} from '../types/vendor';
import {
  CustomerFavorite,
  CustomerNotification,
  CustomerPreOrder,
  OrderFeedback,
  PickupSlotOption,
  SavedMarket,
} from '../types/customer';
import { ProductItem, StallLocation } from '../types/market';
import { useAuth } from './AuthContext';
import { api, errorMessage, imageUrl, toFormData } from '../services/api';
import {
  DirectoryFarmer,
  PRODUCE_TYPES,
  buildStalls,
  dayCodeToName,
  dayNameToCode,
  formatPrice,
  mapAdminCustomer,
  mapAdminFarmer,
  mapAnnouncement,
  mapAssignment,
  mapCatalogProduct,
  mapCategory,
  mapContactMessage,
  mapCustomerOrder,
  mapDirectoryFarmer,
  mapMarket,
  mapModerationItem,
  mapNotification,
  mapOverview,
  mapSlot,
  mapStallSettings,
  mapVendorOrder,
  mapVendorProduct,
  mapVendorReview,
} from '../services/mappers';

export interface ToastAlert {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface CartLine {
  product: ProductItem;
  quantity: number;
}

type ProductInput = Omit<VendorProduct, 'id' | 'imageUrl' | 'isBlocked'>;
type MarketInput = Omit<MarketRecord, 'id' | 'activeVendorsCount'>;

const EMPTY_STALL: StallSettings = {
  farmerId: '',
  approvalStatus: 'pending',
  stallName: '',
  description: '',
  contactPerson: '',
  phone: '',
  email: '',
  operationalDays: [],
  pickupWindows: [],
  locationName: '',
  city: '',
  marketName: '',
  lat: 24.8607,
  lng: 67.0011,
  cutoffHoursBeforePickup: 12,
  autoResetWeeklyStock: false,
};

const GUEST_CART_KEY = 'marketlink_guest_cart';
const REFRESH_MS = 20000; // signed-in dashboards re-sync every 20s so status changes by other users show up

interface MarketDataContextType {
  loading: boolean;
  // Toast notifications
  toastList: ToastAlert[];
  triggerToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Shared catalog (public)
  markets: MarketRecord[];
  categories: CategoryMasterItem[];
  farmers: FarmerRecord[]; // admin: every farmer; others: approved farmers
  directory: DirectoryFarmer[];
  marketProducts: ProductItem[];
  marketStalls: Record<string, StallLocation[]>;
  getStallsForMarket: (marketId: string) => StallLocation[];
  findStallById: (stallId: string) => StallLocation | undefined;
  announcements: SystemAnnouncement[];
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAll: () => Promise<void>;
  getProductReviews: (productId: string) => Promise<{ id: string; customerName: string; rating: number; comment: string; date: string; reply?: string }[]>;
  sendContactMessage: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) => Promise<boolean>;
  askAssistant: (message: string) => Promise<string>;

  // Admin
  approveFarmer: (id: string) => Promise<void>;
  rejectFarmer: (id: string, reason: string) => Promise<void>;
  suspendFarmer: (id: string, reason?: string) => Promise<void>;
  customers: CustomerRecord[];
  toggleCustomerStatus: (id: string) => Promise<void>;
  addMarket: (market: MarketInput) => Promise<void>;
  updateMarket: (id: string, updates: Partial<MarketRecord>) => Promise<void>;
  deleteMarket: (id: string) => Promise<void>;
  moderationItems: ModerationItem[];
  removeModeratedItem: (id: string) => Promise<void>;
  dismissModeratedItem: (id: string) => Promise<void>;
  addCategory: (item: { name: string; badgeColor: string; iconName: string; description?: string }) => Promise<void>;
  updateCategory: (id: string, updates: Partial<CategoryMasterItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  broadcastAnnouncement: (item: { title: string; message: string; targetAudience: 'all' | 'vendors' | 'customers'; priority: 'normal' | 'important' | 'urgent' }) => Promise<void>;
  toggleAnnouncement: (id: string) => Promise<void>;
  adminOverview: AdminOverview | null;
  contactMessages: ContactMessage[];
  markContactRead: (id: string) => Promise<void>;

  // Farmer / vendor
  vendorOrders: VendorOrder[];
  updateVendorOrderStatus: (orderId: string, status: VendorOrderStatus, reason?: string, pickupCode?: string) => Promise<boolean>;
  verifyPickup: (code: string) => Promise<{ msg: string; order: VendorOrder }>;
  loadVendorInsights: (days: number) => Promise<VendorInsights>;
  vendorProducts: VendorProduct[];
  addProduct: (product: ProductInput, imageFile?: File | null) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<ProductInput>, imageFile?: File | null) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  applyWeeklyStock: () => Promise<void>;
  stallSettings: StallSettings;
  updateStallSettings: (settings: Partial<StallSettings>, imageFile?: File | null) => Promise<boolean>;
  assignments: FarmerAssignment[];
  addAssignment: (data: { marketId: string; operatingDays: string[]; pickupStart: string; pickupEnd: string; cutoffHours: number; stallNumber?: string }) => Promise<boolean>;
  updateAssignment: (id: string, data: Partial<{ operatingDays: string[]; pickupStart: string; pickupEnd: string; cutoffHours: number; stallNumber: string; isActive: boolean; latitude: number; longitude: number }>) => Promise<boolean>;
  vendorSlots: VendorPickupSlot[];
  addSlot: (data: { farmerMarketId: string; dayOfWeek: string; startTime: string; endTime: string; capacity: number }) => Promise<boolean>;
  updateSlot: (id: string, data: Partial<{ startTime: string; endTime: string; capacity: number; isActive: boolean }>) => Promise<boolean>;
  deleteSlot: (id: string) => Promise<void>;
  vendorReviews: VendorReview[];
  vendorReviewStats: { average: number; count: number };
  replyToReview: (reviewId: string, replyText: string) => Promise<void>;
  vendorInsights: VendorInsights | null;

  // Customer
  cartItems: CartLine[];
  addToCart: (product: ProductItem, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getPickupSlots: (farmerMarketId: string, date: string) => Promise<PickupSlotOption[]>;
  placeOrder: (data: { farmerMarketId: string; pickupSlotId: string; pickupDate: string; notes?: string }) => Promise<CustomerPreOrder | null>;
  customerOrders: CustomerPreOrder[];
  cancelCustomerOrder: (orderId: string, reason?: string) => Promise<void>;
  modifyCustomerOrder: (orderId: string, items: { orderItemId: string; quantity: number }[]) => Promise<boolean>;
  quickReorder: (orderId: string) => Promise<boolean>;
  savedMarkets: SavedMarket[];
  savedMarketIds: string[];
  toggleSavedMarket: (marketId: string) => Promise<void>;
  customerFavorites: CustomerFavorite[];
  favoriteProductIds: string[];
  favoriteFarmerIds: string[];
  toggleFavorite: (targetId: string, type?: 'product' | 'farmer') => Promise<void>;
  submitReview: (orderItemId: string, rating: number, comment: string) => Promise<boolean>;
  submitFeedback: (feedback: OrderFeedback) => Promise<void>;
  feedbacks: OrderFeedback[];

  // Notifications (every signed-in role)
  customerNotifications: CustomerNotification[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

const readGuestCart = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentRole, currentUser, authReady, refreshUser } = useAuth();
  const role = isAuthenticated ? currentRole : null;

  // ---------------- toasts ----------------
  const [toastList, setToastList] = useState<ToastAlert[]>([]);
  const triggerToast = useCallback((message: string, type: ToastAlert['type'] = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setToastList((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToastList((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id: string) => setToastList((prev) => prev.filter((t) => t.id !== id)), []);

  /** runs an API call, shows the backend's message on failure, returns null when it failed */
  const run = useCallback(
    async <T,>(fn: () => Promise<T>, successMsg?: string | ((r: T) => string)): Promise<T | null> => {
      try {
        const result = await fn();
        if (successMsg) triggerToast(typeof successMsg === 'function' ? successMsg(result) : successMsg, 'success');
        return result;
      } catch (err) {
        triggerToast(errorMessage(err), 'error');
        return null;
      }
    },
    [triggerToast]
  );

  const [loading, setLoading] = useState(true);

  // ---------------- public catalog ----------------
  const [markets, setMarkets] = useState<MarketRecord[]>([]);
  const [categories, setCategories] = useState<CategoryMasterItem[]>([]);
  const [directory, setDirectory] = useState<DirectoryFarmer[]>([]);
  const [rawCatalog, setRawCatalog] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);

  const marketProducts = useMemo(() => rawCatalog.map((p) => mapCatalogProduct(p, directory)), [rawCatalog, directory]);
  const marketStalls = useMemo(() => buildStalls(directory), [directory]);

  const loadMarkets = useCallback(async () => {
    const res = await api.get('/getAllMarket');
    setMarkets(res.markets.map(mapMarket));
  }, []);

  const loadCategories = useCallback(async () => {
    const res = await api.get(role === 'admin' ? '/admin/categories' : '/getAllCategory');
    setCategories(res.categories.map(mapCategory));
  }, [role]);

  const loadCatalog = useCallback(async () => {
    const [dir, cat] = await Promise.all([api.get('/getFarmerDirectory'), api.get('/getCatalog')]);
    setDirectory(dir.farmers);
    setRawCatalog(cat.products);
  }, []);

  const loadAnnouncements = useCallback(async () => {
    if (role === 'admin') {
      const res = await api.get('/admin/announcements');
      setAnnouncements(res.announcements.map(mapAnnouncement));
    } else {
      const audience = role === 'vendor' ? 'vendors' : 'customers';
      const res = await api.get(`/getAnnouncements?audience=${audience}`);
      setAnnouncements(res.announcements.map(mapAnnouncement));
    }
  }, [role]);

  const refreshProducts = useCallback(async () => {
    await run(loadCatalog);
  }, [run, loadCatalog]);

  const refreshCategories = useCallback(async () => {
    await run(loadCategories);
  }, [run, loadCategories]);

  const getStallsForMarket = useCallback((marketId: string) => marketStalls[marketId] || [], [marketStalls]);
  const findStallById = useCallback(
    (stallId: string) => Object.values(marketStalls).flat().find((s) => s.id === stallId),
    [marketStalls]
  );

  // ---------------- admin state ----------------
  const [adminFarmers, setAdminFarmers] = useState<FarmerRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [adminOverview, setAdminOverview] = useState<AdminOverview | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const loadAdmin = useCallback(async () => {
    const [f, c, m, o, cm] = await Promise.all([
      api.get('/admin/getFarmers/all'),
      api.get('/admin/customers'),
      api.get('/admin/moderation'),
      api.get('/admin/overview'),
      api.get('/admin/contactmessages'),
    ]);
    setAdminFarmers(f.farmers.map(mapAdminFarmer));
    setCustomers(c.customers.map(mapAdminCustomer));
    setModerationItems(m.items.map(mapModerationItem));
    setAdminOverview(mapOverview(o));
    setContactMessages(cm.messages.map(mapContactMessage));
  }, []);

  const farmers = useMemo(
    () => (role === 'admin' ? adminFarmers : directory.map(mapDirectoryFarmer)),
    [role, adminFarmers, directory]
  );

  // ---------------- vendor state ----------------
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
  const [stallSettings, setStallSettings] = useState<StallSettings>(EMPTY_STALL);
  const [assignments, setAssignments] = useState<FarmerAssignment[]>([]);
  const [vendorSlots, setVendorSlots] = useState<VendorPickupSlot[]>([]);
  const [vendorReviews, setVendorReviews] = useState<VendorReview[]>([]);
  const [vendorReviewStats, setVendorReviewStats] = useState({ average: 0, count: 0 });
  const [vendorInsights, setVendorInsights] = useState<VendorInsights | null>(null);

  const loadVendor = useCallback(async () => {
    const [profile, products, orders, fms, slots, reviews, insights] = await Promise.all([
      api.get('/farmer/getprofile'),
      api.get('/farmer/getMyProducts'),
      api.get('/farmer/orders/all'),
      api.get('/farmer/getMyMarkets'),
      api.get('/farmer/getMySlots'),
      api.get('/farmer/reviews'),
      api.get('/farmer/insights'),
    ]);
    const a = fms.farmerMarkets.map(mapAssignment);
    const s = slots.slots.map(mapSlot);
    setAssignments(a);
    setVendorSlots(s);
    setStallSettings(mapStallSettings(profile.farmer, profile.user, a, s));
    setVendorProducts(products.products.map(mapVendorProduct));
    setVendorOrders(orders.orders.map(mapVendorOrder));
    setVendorReviews(reviews.reviews.map(mapVendorReview));
    setVendorReviewStats({ average: reviews.average, count: reviews.count });
    setVendorInsights(insights);
  }, []);

  // ---------------- customer state ----------------
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [rawCart, setRawCart] = useState<any>(null);
  const [guestCart, setGuestCart] = useState<CartLine[]>(readGuestCart);
  const [rawFavorites, setRawFavorites] = useState<{ farmers: any[]; products: any[]; markets: any[] }>({ farmers: [], products: [], markets: [] });
  const [feedbacks, setFeedbacks] = useState<OrderFeedback[]>([]);

  const customerOrders = useMemo(() => rawOrders.map((o) => mapCustomerOrder(o, marketStalls)), [rawOrders, marketStalls]);

  const loadCustomer = useCallback(async () => {
    const [orders, cart, favs] = await Promise.all([
      api.get('/customer/orders'),
      api.get('/customer/cart'),
      api.get('/customer/favorites'),
    ]);
    setRawOrders(orders.orders);
    setRawCart(cart.cart);
    setRawFavorites({ farmers: favs.farmers, products: favs.products, markets: favs.markets });
  }, []);

  // ---------------- notifications ----------------
  const [customerNotifications, setNotifications] = useState<CustomerNotification[]>([]);
  const loadNotifications = useCallback(async () => {
    const res = await api.get('/notifications');
    setNotifications(res.notifications.map(mapNotification));
  }, []);

  // ---------------- loading orchestration ----------------
  const loadRoleData = useCallback(async () => {
    if (!role) return;
    const jobs: Promise<unknown>[] = [loadNotifications()];
    if (role === 'admin') jobs.push(loadAdmin());
    if (role === 'vendor') jobs.push(loadVendor());
    if (role === 'customer') jobs.push(loadCustomer());
    await Promise.all(jobs);
  }, [role, loadNotifications, loadAdmin, loadVendor, loadCustomer]);

  const refreshAll = useCallback(async () => {
    await run(() => Promise.all([loadMarkets(), loadCategories(), loadCatalog(), loadAnnouncements(), loadRoleData()]));
  }, [run, loadMarkets, loadCategories, loadCatalog, loadAnnouncements, loadRoleData]);

  // clear per-user data whenever the signed-in user changes
  useEffect(() => {
    setAdminFarmers([]);
    setCustomers([]);
    setModerationItems([]);
    setAdminOverview(null);
    setContactMessages([]);
    setVendorProducts([]);
    setVendorOrders([]);
    setStallSettings(EMPTY_STALL);
    setAssignments([]);
    setVendorSlots([]);
    setVendorReviews([]);
    setVendorInsights(null);
    setRawOrders([]);
    setRawCart(null);
    setRawFavorites({ farmers: [], products: [], markets: [] });
    setNotifications([]);
  }, [currentUser.id]);

  useEffect(() => {
    if (!authReady) return;
    setLoading(true);
    refreshAll().finally(() => setLoading(false));
  }, [authReady, currentUser.id, refreshAll]);

  // keep dashboards in sync with changes made by other users (farmer accepts an order, admin approves, ...)
  const refreshRef = useRef(loadRoleData);
  refreshRef.current = loadRoleData;
  useEffect(() => {
    if (!role) return;
    const timer = setInterval(() => {
      refreshRef.current().catch(() => {});
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [role]);

  // ---------------- shared actions ----------------
  const getProductReviews = useCallback(async (productId: string) => {
    try {
      const res = await api.get(`/getProductReviews/${productId}`);
      return res.reviews.map((r: any) => ({
        id: r._id,
        customerName: r.customer?.name || 'Customer',
        rating: r.rating,
        comment: r.comment || '',
        date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        reply: r.farmerResponse,
      }));
    } catch {
      return [];
    }
  }, []);

  const sendContactMessage = async (data: { name: string; email: string; phone?: string; subject?: string; message: string }) => {
    const res = await run(() => api.post('/contact', data), (r: any) => r.msg);
    return Boolean(res);
  };

  const askAssistant = async (message: string) => {
    try {
      const res = await api.post('/ai/chat', { message });
      return res.answer as string;
    } catch (err) {
      return `Sorry, I could not answer that right now (${errorMessage(err)}).`;
    }
  };

  // ---------------- admin actions ----------------
  const afterAdminChange = async () => {
    await Promise.all([loadAdmin(), loadCatalog(), loadMarkets()]);
  };

  const approveFarmer = async (id: string) => {
    if (await run(() => api.post('/admin/approvefarmer', { farmerId: id }), (r: any) => r.msg)) await afterAdminChange();
  };

  const rejectFarmer = async (id: string, reason: string) => {
    if (await run(() => api.post('/admin/rejectfarmer', { farmerId: id, reason }), (r: any) => r.msg)) await afterAdminChange();
  };

  // suspended -> reinstated (approved); approved -> suspended (reason required by the backend)
  const suspendFarmer = async (id: string, reason?: string) => {
    const farmer = adminFarmers.find((f) => f.id === id);
    if (farmer?.status === 'suspended') return approveFarmer(id);
    if (await run(() => api.post('/admin/suspendfarmer', { farmerId: id, reason: reason || 'Suspended by admin' }), (r: any) => r.msg)) {
      await afterAdminChange();
    }
  };

  const toggleCustomerStatus = async (id: string) => {
    const cust = customers.find((c) => c.id === id);
    const status = cust?.status === 'active' ? 'INACTIVE' : 'ACTIVE';
    if (await run(() => api.post('/admin/updateuserstatus', { userId: id, status }), (r: any) => r.msg)) await loadAdmin();
  };

  const marketPayload = (m: Partial<MarketRecord>) => ({
    name: m.name,
    address: m.address,
    city: m.city,
    description: m.description,
    operatingDays: m.operatingDays?.map(dayNameToCode),
    timings: m.timings,
    latitude: m.lat,
    longitude: m.lng,
    status: m.status,
  });

  const addMarket = async (m: MarketInput) => {
    if (await run(() => api.post('/admin/addmarket', marketPayload(m)), `Market "${m.name}" added`)) await afterAdminChange();
  };

  const updateMarket = async (id: string, updates: Partial<MarketRecord>) => {
    if (await run(() => api.post('/admin/updatemarket', { marketId: id, ...marketPayload(updates) }), 'Market updated')) await afterAdminChange();
  };

  const deleteMarket = async (id: string) => {
    if (await run(() => api.post('/admin/deletemarket', { marketId: id }), (r: any) => r.msg)) await afterAdminChange();
  };

  const moderate = async (id: string, action: 'dismiss' | 'remove') => {
    const item = moderationItems.find((m) => m.id === id);
    if (!item) return;
    const ok = await run(
      () => api.post(`/admin/moderation/${action}`, { type: item.type, id }),
      action === 'remove' ? `Removed "${item.targetName}"` : `Kept "${item.targetName}" live`
    );
    if (ok) await Promise.all([loadAdmin(), loadCatalog()]);
  };
  const removeModeratedItem = (id: string) => moderate(id, 'remove');
  const dismissModeratedItem = (id: string) => moderate(id, 'dismiss');

  const addCategory = async (item: { name: string; badgeColor: string; iconName: string; description?: string }) => {
    if (await run(() => api.post('/admin/addcategory', item), `Category "${item.name}" added`)) await loadCategories();
  };

  const updateCategory = async (id: string, updates: Partial<CategoryMasterItem>) => {
    const ok = await run(
      () => api.post('/admin/updatecategory', {
        categoryId: id,
        name: updates.name,
        badgeColor: updates.badgeColor,
        iconName: updates.iconName,
        description: updates.description,
        isActive: updates.isActive,
      }),
      'Category updated'
    );
    if (ok) await Promise.all([loadCategories(), loadCatalog()]);
  };

  const deleteCategory = async (id: string) => {
    if (await run(() => api.post('/admin/deletecategory', { categoryId: id }), 'Category deleted')) await loadCategories();
  };

  const broadcastAnnouncement = async (item: { title: string; message: string; targetAudience: 'all' | 'vendors' | 'customers'; priority: 'normal' | 'important' | 'urgent' }) => {
    if (await run(() => api.post('/admin/addannouncement', item), (r: any) => r.msg)) await loadAnnouncements();
  };

  const toggleAnnouncement = async (id: string) => {
    if (await run(() => api.post('/admin/toggleannouncement', { announcementId: id }), (r: any) => r.msg)) await loadAnnouncements();
  };

  const markContactRead = async (id: string) => {
    if (await run(() => api.post('/admin/contactmessages/read', { messageId: id }))) await loadAdmin();
  };

  // ---------------- vendor actions ----------------
  const afterVendorChange = async () => {
    await Promise.all([loadVendor(), loadCatalog()]);
  };

  const ORDER_ACTION: Partial<Record<VendorOrderStatus, string>> = {
    accepted: 'accept',
    declined: 'decline',
    ready_for_pickup: 'ready',
    completed: 'complete',
    cancelled: 'cancel',
  };

  const updateVendorOrderStatus = async (orderId: string, status: VendorOrderStatus, reason?: string, pickupCode?: string) => {
    const action = ORDER_ACTION[status];
    if (!action) return false;
    const ok = await run(() => api.post(`/farmer/orders/${action}`, { orderId, reason, pickupCode }), (r: any) => r.msg);
    if (ok) await afterVendorChange();
    return Boolean(ok);
  };

  // scanned QR text or the 6 digits the customer reads out -> the matching order (throws ApiError if none)
  const verifyPickup = async (code: string) => {
    const res = await api.post('/farmer/orders/verifypickup', { code });
    return { msg: res.msg as string, order: mapVendorOrder(res.order) };
  };

  const loadVendorInsights = async (days: number): Promise<VendorInsights> => api.get(`/farmer/insights${days ? `?days=${days}` : ''}`);

  const categoryIdFor = (p: Partial<ProductInput>) =>
    p.categoryId || categories.find((c) => c.name === p.category)?.id;

  const productFields = (p: Partial<ProductInput>) => ({
    name: p.name,
    categoryId: categoryIdFor(p),
    price: p.price,
    unit: p.unit,
    quantity: p.stock,
    weeklyStock: p.weeklyRecurringStock,
    description: p.description,
    imageType: p.imageType && PRODUCE_TYPES.includes(p.imageType as any) ? p.imageType : undefined,
    availability:
      p.status === undefined ? undefined : p.status === 'sold_out' ? 'SOLD_OUT' : p.status === 'temporarily_unavailable' ? 'UNAVAILABLE' : 'AVAILABLE',
  });

  const addProduct = async (product: ProductInput, imageFile?: File | null) => {
    const ok = await run(() => api.post('/farmer/addproduct', toFormData(productFields(product), imageFile)), `Added ${product.name}`);
    if (ok) await afterVendorChange();
    return Boolean(ok);
  };

  const updateProduct = async (id: string, updates: Partial<ProductInput>, imageFile?: File | null) => {
    const ok = await run(
      () => api.post('/farmer/updateproduct', toFormData({ productId: id, ...productFields(updates) }, imageFile)),
      'Product updated'
    );
    if (ok) await afterVendorChange();
    return Boolean(ok);
  };

  const deleteProduct = async (id: string) => {
    const prod = vendorProducts.find((p) => p.id === id);
    if (await run(() => api.post('/farmer/deleteproduct', { productId: id }), `Removed ${prod?.name || 'product'}`)) await afterVendorChange();
  };

  const toggleProductStatus = async (id: string) => {
    const prod = vendorProducts.find((p) => p.id === id);
    if (!prod) return;
    const soldOut = prod.status !== 'in_stock' || prod.stock === 0;
    const availability = soldOut ? 'AVAILABLE' : 'SOLD_OUT';
    const ok = await run(
      () => api.post('/farmer/setavailability', { productId: id, availability }),
      soldOut ? `${prod.name} is back in stock` : `${prod.name} marked sold out`
    );
    if (ok) await afterVendorChange();
  };

  const applyWeeklyStock = async () => {
    if (await run(() => api.post('/farmer/applyweeklystock'), (r: any) => r.msg)) await afterVendorChange();
  };

  const updateStallSettings = async (settings: Partial<StallSettings>, imageFile?: File | null) => {
    const ok = await run(
      () => api.post('/farmer/updateprofile', toFormData({
        stallName: settings.stallName,
        description: settings.description,
        contactPerson: settings.contactPerson,
        phone: settings.phone,
        address: settings.locationName,
        city: settings.city,
        latitude: settings.lat,
        longitude: settings.lng,
        autoResetWeeklyStock: settings.autoResetWeeklyStock,
      }, imageFile)),
      'Stall profile saved'
    );
    if (ok) {
      await Promise.all([afterVendorChange(), refreshUser()]);
    }
    return Boolean(ok);
  };

  const addAssignment = async (data: { marketId: string; operatingDays: string[]; pickupStart: string; pickupEnd: string; cutoffHours: number; stallNumber?: string }) => {
    const ok = await run(() => api.post('/farmer/assignmarket', data), 'Market added to your stall');
    if (ok) await Promise.all([afterVendorChange(), loadMarkets()]);
    return Boolean(ok);
  };

  const updateAssignment = async (id: string, data: Record<string, unknown>) => {
    const ok = await run(() => api.post('/farmer/updateassignment', { farmerMarketId: id, ...data }), 'Market schedule saved');
    if (ok) await Promise.all([afterVendorChange(), loadMarkets()]);
    return Boolean(ok);
  };

  const addSlot = async (data: { farmerMarketId: string; dayOfWeek: string; startTime: string; endTime: string; capacity: number }) => {
    const ok = await run(() => api.post('/farmer/addslot', data), 'Pickup slot added');
    if (ok) await loadVendor();
    return Boolean(ok);
  };

  const updateSlot = async (id: string, data: Partial<{ startTime: string; endTime: string; capacity: number; isActive: boolean }>) => {
    const ok = await run(() => api.post('/farmer/updateslot', { slotId: id, ...data }), 'Pickup slot updated');
    if (ok) await loadVendor();
    return Boolean(ok);
  };

  const deleteSlot = async (id: string) => {
    if (await run(() => api.post('/farmer/deleteslot', { slotId: id }), (r: any) => r.msg)) await loadVendor();
  };

  const replyToReview = async (reviewId: string, replyText: string) => {
    if (await run(() => api.post('/farmer/reviews/respond', { reviewId, response: replyText }), 'Reply posted')) await loadVendor();
  };

  // ---------------- customer: cart ----------------
  // guests keep a local cart; signed-in customers use the server cart (one farmer per cart)
  const cartItems: CartLine[] = useMemo(() => {
    if (role !== 'customer') return guestCart;
    if (!rawCart) return [];
    return rawCart.items
      .filter((i: any) => i.product)
      .map((i: any) => {
        const fromCatalog = marketProducts.find((p) => p.id === i.product._id);
        const product: ProductItem = fromCatalog || {
          id: i.product._id,
          name: i.product.name,
          category: '',
          stock: i.product.quantity,
          price: i.product.price,
          unit: i.product.unit,
          imageType: PRODUCE_TYPES.includes(i.product.imageType) ? i.product.imageType : 'cabbage',
          imageUrl: imageUrl(i.product.image),
          availability: i.product.availability,
          farmerId: i.product.farmer,
          farmName: rawCart.farmer?.stallName,
        };
        return { product, quantity: i.quantity };
      });
  }, [role, guestCart, rawCart, marketProducts]);

  const saveGuestCart = (lines: CartLine[]) => {
    setGuestCart(lines);
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  };

  // once a guest signs in as a customer, move their local basket into the server cart
  useEffect(() => {
    if (role !== 'customer' || guestCart.length === 0) return;
    const lines = guestCart;
    saveGuestCart([]);
    (async () => {
      for (const line of lines) {
        try {
          await api.post('/customer/cart/additem', { productId: line.product.id, quantity: line.quantity });
        } catch (err) {
          triggerToast(`${line.product.name}: ${errorMessage(err)}`, 'warning');
        }
      }
      await run(loadCustomer);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const addToCart = async (product: ProductItem, quantity = 1) => {
    if (isAuthenticated && role !== 'customer') {
      triggerToast('Only customer accounts can place pre-orders.', 'warning');
      return false;
    }
    const existing = cartItems.find((l) => l.product.id === product.id);
    const total = (existing?.quantity || 0) + quantity;

    if (role !== 'customer') {
      if (cartItems.length > 0 && cartItems[0].product.farmerId !== product.farmerId) {
        triggerToast('Your basket has items from a different farmer. Each pre-order is picked up from one stall - clear the basket first.', 'warning');
        return false;
      }
      if (total > product.stock) {
        triggerToast(`Only ${product.stock} ${product.unit} of ${product.name} left`, 'warning');
        return false;
      }
      saveGuestCart(existing ? cartItems.map((l) => (l.product.id === product.id ? { ...l, quantity: total } : l)) : [...cartItems, { product, quantity }]);
      triggerToast(`Added ${quantity} ${product.unit} of ${product.name} to your basket`);
      return true;
    }

    const res = await run(
      () => api.post('/customer/cart/additem', { productId: product.id, quantity: total }),
      `Added ${quantity} ${product.unit} of ${product.name} to your basket`
    );
    if (res) setRawCart(res.cart);
    return Boolean(res);
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return removeCartItem(productId);
    if (role !== 'customer') {
      saveGuestCart(cartItems.map((l) => (l.product.id === productId ? { ...l, quantity: Math.min(quantity, l.product.stock) } : l)));
      return;
    }
    const res = await run(() => api.post('/customer/cart/updateitem', { productId, quantity }));
    if (res) setRawCart(res.cart);
  };

  const removeCartItem = async (productId: string) => {
    if (role !== 'customer') {
      saveGuestCart(cartItems.filter((l) => l.product.id !== productId));
      return;
    }
    const res = await run(() => api.post('/customer/cart/removeitem', { productId }));
    if (res) setRawCart(res.cart);
  };

  const clearCart = async () => {
    if (role !== 'customer') {
      saveGuestCart([]);
      return;
    }
    const res = await run(() => api.post('/customer/cart/clear'));
    if (res) setRawCart({ ...res.cart, items: [] });
  };

  // ---------------- customer: orders ----------------
  const getPickupSlots = useCallback(async (farmerMarketId: string, date: string): Promise<PickupSlotOption[]> => {
    try {
      const res = await api.get(`/getPickupSlots/${farmerMarketId}?date=${date}`);
      return res.slots.map((s: any) => ({
        id: s._id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        capacity: s.capacity,
        remaining: s.remaining,
        cutoffPassed: Boolean(s.cutoffPassed),
      }));
    } catch (err) {
      triggerToast(errorMessage(err), 'error');
      return [];
    }
  }, [triggerToast]);

  const placeOrder = async (data: { farmerMarketId: string; pickupSlotId: string; pickupDate: string; notes?: string }) => {
    const res = await run(() => api.post('/customer/orders', data), (r: any) => `Pre-order #${String(r.order._id).slice(-6).toUpperCase()} placed. Pay at pickup: ${formatPrice(r.order.totalAmount)}`);
    if (!res) return null;
    await Promise.all([loadCustomer(), loadCatalog(), loadNotifications()]);
    return mapCustomerOrder(res.order, marketStalls);
  };

  const cancelCustomerOrder = async (orderId: string, reason?: string) => {
    const ok = await run(() => api.post('/customer/orders/cancel', { orderId, reason }), 'Order cancelled, stock returned to the farmer');
    if (ok) await Promise.all([loadCustomer(), loadCatalog()]);
  };

  const modifyCustomerOrder = async (orderId: string, items: { orderItemId: string; quantity: number }[]) => {
    const ok = await run(() => api.post('/customer/orders/modify', { orderId, items }), (r: any) => r.msg);
    if (ok) await Promise.all([loadCustomer(), loadCatalog()]);
    return Boolean(ok);
  };

  const quickReorder = async (orderId: string) => {
    const res = await run(() => api.post(`/customer/orders/${orderId}/reorder`), (r: any) => r.msg);
    if (res) setRawCart(res.cart);
    return Boolean(res);
  };

  // ---------------- customer: favorites ----------------
  const favoriteProductIds = useMemo(() => rawFavorites.products.map((p) => p._id), [rawFavorites]);
  const favoriteFarmerIds = useMemo(() => rawFavorites.farmers.map((f) => f._id), [rawFavorites]);
  const savedMarketIds = useMemo(() => rawFavorites.markets.map((m) => m._id), [rawFavorites]);

  const customerFavorites: CustomerFavorite[] = useMemo(() => {
    const products = rawFavorites.products.map((p) => {
      const item = marketProducts.find((mp) => mp.id === p._id);
      const inStock = p.isActive && !p.isBlocked && p.availability === 'AVAILABLE' && p.quantity > 0;
      return {
        id: p._id,
        type: 'product' as const,
        name: p.name,
        subtitle: item?.farmName || 'Farmer stall',
        rating: item?.farmerRating || 0,
        tag: item?.category || '',
        imageType: PRODUCE_TYPES.includes(p.imageType) ? p.imageType : 'cabbage',
        imageUrl: imageUrl(p.image),
        inStock,
        restockStatus: !p.isActive || p.isBlocked ? 'No longer listed' : inStock ? `${p.quantity} ${p.unit} available` : 'Restock alert on - we will notify you',
        price: p.price,
        unit: p.unit,
      };
    });
    const farmersFav = rawFavorites.farmers.map((f) => {
      const df = directory.find((d) => d._id === f._id);
      return {
        id: f._id,
        type: 'farmer' as const,
        name: f.stallName,
        subtitle: df?.contactPerson ? `${df.contactPerson} • ${f.city || ''}` : f.city || '',
        rating: df?.rating || 0,
        tag: df?.categories[0] || 'Farmer',
        restockStatus: df ? `${df.productCount} products listed` : 'Stall not active',
      };
    });
    return [...products, ...farmersFav];
  }, [rawFavorites, marketProducts, directory]);

  const savedMarkets: SavedMarket[] = useMemo(() => {
    const todayCode = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()];
    return rawFavorites.markets.map((m) => ({
      id: m._id,
      name: m.name,
      address: [m.address, m.city].filter(Boolean).join(', '),
      schedule: `${(m.operatingDays || []).map(dayCodeToName).join(', ')}${m.timings ? ` • ${m.timings}` : ''}`,
      lat: m.latitude,
      lng: m.longitude,
      distance: m.city || '',
      isOpen: (m.operatingDays || []).includes(todayCode) && m.status !== 'closed',
      activeStalls: (marketStalls[m._id] || []).length,
    }));
  }, [rawFavorites, marketStalls]);

  const requireCustomer = () => {
    if (role !== 'customer') {
      triggerToast('Sign in with a customer account to save favorites.', 'info');
      return false;
    }
    return true;
  };

  const toggleTarget = async (targetType: 'PRODUCT' | 'FARMER' | 'MARKET', target: string, isOn: boolean, label: string) => {
    if (!requireCustomer()) return;
    const ok = await run(
      () => api.post(isOn ? '/customer/favorites/remove' : '/customer/favorites', { targetType, target }),
      isOn ? `Removed ${label} from favorites` : `Saved ${label} to favorites`
    );
    if (ok) {
      const favs = await api.get('/customer/favorites');
      setRawFavorites({ farmers: favs.farmers, products: favs.products, markets: favs.markets });
    }
  };

  const toggleFavorite = async (targetId: string, type?: 'product' | 'farmer') => {
    const kind = type || (favoriteFarmerIds.includes(targetId) || directory.some((d) => d._id === targetId) ? 'farmer' : 'product');
    if (kind === 'farmer') {
      const name = directory.find((d) => d._id === targetId)?.stallName || 'farmer';
      return toggleTarget('FARMER', targetId, favoriteFarmerIds.includes(targetId), name);
    }
    const name = marketProducts.find((p) => p.id === targetId)?.name || 'product';
    return toggleTarget('PRODUCT', targetId, favoriteProductIds.includes(targetId), name);
  };

  const toggleSavedMarket = async (marketId: string) => {
    const name = markets.find((m) => m.id === marketId)?.name || 'market';
    return toggleTarget('MARKET', marketId, savedMarketIds.includes(marketId), name);
  };

  // ---------------- customer: reviews ----------------
  const submitReview = async (orderItemId: string, rating: number, comment: string) => {
    const ok = await run(() => api.post('/customer/reviews', { orderItemId, rating, comment }), 'Review submitted');
    if (ok) await Promise.all([loadCustomer(), loadCatalog()]);
    return Boolean(ok);
  };

  // rates every not-yet-reviewed item of a completed order with the same stars + comment
  const submitFeedback = async (feedback: OrderFeedback) => {
    const order = customerOrders.find((o) => o.id === feedback.orderId);
    if (!order) return;
    const comment = [feedback.tags.length ? feedback.tags.join(', ') : '', feedback.comment].filter(Boolean).join(' - ');
    let count = 0;
    for (const item of order.items.filter((i) => !i.reviewed)) {
      try {
        await api.post('/customer/reviews', { orderItemId: item.orderItemId, rating: feedback.rating, comment });
        count++;
      } catch (err) {
        triggerToast(`${item.name}: ${errorMessage(err)}`, 'error');
      }
    }
    if (count) {
      setFeedbacks((prev) => [feedback, ...prev]);
      triggerToast(`Thank you! ${count} item review(s) published to ${order.stallName}.`, 'success');
    }
    await Promise.all([loadCustomer(), loadCatalog()]);
  };

  // ---------------- notifications ----------------
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await run(() => api.post('/notifications/markread', { notificationId: id }));
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await run(() => api.post('/notifications/markallread'), 'All notifications marked as read');
  };

  return (
    <MarketDataContext.Provider
      value={{
        loading,
        toastList,
        triggerToast,
        removeToast,
        markets,
        categories,
        farmers,
        directory,
        marketProducts,
        marketStalls,
        getStallsForMarket,
        findStallById,
        announcements,
        refreshProducts,
        refreshCategories,
        refreshAll,
        getProductReviews,
        sendContactMessage,
        askAssistant,
        approveFarmer,
        rejectFarmer,
        suspendFarmer,
        customers,
        toggleCustomerStatus,
        addMarket,
        updateMarket,
        deleteMarket,
        moderationItems,
        removeModeratedItem,
        dismissModeratedItem,
        addCategory,
        updateCategory,
        deleteCategory,
        broadcastAnnouncement,
        toggleAnnouncement,
        adminOverview,
        contactMessages,
        markContactRead,
        vendorOrders,
        updateVendorOrderStatus,
        verifyPickup,
        loadVendorInsights,
        vendorProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        applyWeeklyStock,
        stallSettings,
        updateStallSettings,
        assignments,
        addAssignment,
        updateAssignment,
        vendorSlots,
        addSlot,
        updateSlot,
        deleteSlot,
        vendorReviews,
        vendorReviewStats,
        replyToReview,
        vendorInsights,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        clearCart,
        getPickupSlots,
        placeOrder,
        customerOrders,
        cancelCustomerOrder,
        modifyCustomerOrder,
        quickReorder,
        savedMarkets,
        savedMarketIds,
        toggleSavedMarket,
        customerFavorites,
        favoriteProductIds,
        favoriteFarmerIds,
        toggleFavorite,
        submitReview,
        submitFeedback,
        feedbacks,
        customerNotifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};
