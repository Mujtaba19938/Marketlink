/**
 * Converts raw backend documents (Mongo shapes) into the view models the UI components use.
 * Keeping this in one place means the components never need to know backend field names.
 */
import { imageUrl } from './api';
import { UserProfile, UserRole } from '../types/auth';
import { ProductItem, ProduceImageType, StallLocation } from '../types/market';
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
  VendorOrder,
  VendorOrderStatus,
  VendorPickupSlot,
  VendorProduct,
  VendorReview,
} from '../types/vendor';
import { CustomerNotification, CustomerOrderStatus, CustomerPreOrder } from '../types/customer';

// ---------- small helpers ----------

export const DAY_CODES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const dayCodeToName = (code: string) => DAY_NAMES[DAY_CODES.indexOf(code as any)] || code;
export const dayNameToCode = (name: string) => DAY_CODES[DAY_NAMES.indexOf(name)] || name.slice(0, 3).toUpperCase();

export const PRODUCE_TYPES: ProduceImageType[] = ['cabbage', 'kale', 'broccoli', 'celery', 'carrot', 'tomato', 'pepper', 'mushroom'];
const asImageType = (t?: string): ProduceImageType => (PRODUCE_TYPES.includes(t as ProduceImageType) ? (t as ProduceImageType) : 'cabbage');

export const formatDate = (iso?: string | Date | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (iso?: string | Date | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

/** "5 min ago", "2 h ago", "3 d ago" */
export const timeAgo = (iso?: string) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} d ago`;
  return formatDate(iso);
};

/** local YYYY-MM-DD (what the backend expects for pickupDate) */
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const orderCode = (id: string) => String(id).slice(-6).toUpperCase();

/** prices are stored in Pakistani Rupees */
export const formatPrice = (n?: number | null) =>
  `Rs ${Number(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

// ---------- auth ----------

const ROLE_MAP: Record<string, UserRole> = { CUSTOMER: 'customer', FARMER: 'vendor', ADMIN: 'admin' };
const AVATARS: Record<UserRole, string> = {
  admin: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  vendor: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  customer: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
};

export const farmerStatus = (s?: string): FarmerRecord['status'] =>
  (({ APPROVED: 'approved', PENDING: 'pending', SUSPENDED: 'suspended', REJECTED: 'rejected' } as const)[s as 'APPROVED'] || 'pending');

export const mapUser = (u: any, farmer?: any): UserProfile => {
  const role = ROLE_MAP[u.role] || 'customer';
  const badge =
    role === 'admin'
      ? 'Platform Administrator'
      : role === 'vendor'
      ? farmer
        ? `Farmer • ${farmer.approvalStatus}`
        : 'Farmer'
      : 'Registered Customer';
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role,
    avatar: AVATARS[role],
    badge,
    phone: u.phone,
    address: u.address,
    city: u.city,
    contactPerson: role === 'vendor' ? u.name : undefined,
    stallName: farmer?.stallName,
    farmerId: farmer?._id,
    farmerStatus: farmer ? farmerStatus(farmer.approvalStatus) : undefined,
  };
};

// ---------- catalog ----------

export interface DirectoryFarmer {
  _id: string;
  stallName: string;
  description?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  contactPerson: string;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  productCount: number;
  categories: string[];
  markets: {
    _id: string;
    market: any;
    operatingDays: string[];
    pickupStart?: string;
    pickupEnd?: string;
    cutoffHours: number;
    stallNumber?: string;
    latitude?: number;
    longitude?: number;
  }[];
  createdAt?: string;
}

const statusFromAvailability = (a?: string): VendorProduct['status'] =>
  a === 'SOLD_OUT' ? 'sold_out' : a === 'UNAVAILABLE' ? 'temporarily_unavailable' : 'in_stock';

export const mapCatalogProduct = (p: any, directory: DirectoryFarmer[]): ProductItem => {
  const farmerId = p.farmer?._id || p.farmer;
  const df = directory.find((f) => f._id === farmerId);
  return {
    id: p._id,
    name: p.name,
    category: p.category?.name || 'Other',
    categoryId: p.category?._id || p.category,
    stock: p.quantity,
    price: p.price,
    unit: p.unit,
    imageType: asImageType(p.imageType),
    imageUrl: imageUrl(p.image),
    availability: p.availability,
    farmerId,
    farmerName: df?.contactPerson || p.farmer?.stallName,
    farmName: p.farmer?.stallName || df?.stallName,
    farmerRating: df?.rating || 0,
    area: p.farmer?.city || df?.city || '',
    marketName: df?.markets.map((m) => m.market?.name).filter(Boolean).join(', ') || '',
    marketIds: df?.markets.map((m) => m.market?._id).filter(Boolean) || [],
    operatingDays: df ? [...new Set(df.markets.flatMap((m) => m.operatingDays))] : [],
    description: p.description || '',
    origin: p.farmer?.address || df?.address || '',
  };
};

export const mapVendorProduct = (p: any): VendorProduct => ({
  id: p._id,
  name: p.name,
  category: p.category?.name || 'Other',
  categoryId: p.category?._id || p.category,
  price: p.price,
  unit: p.unit,
  stock: p.quantity,
  imageType: asImageType(p.imageType),
  imageUrl: imageUrl(p.image),
  status: statusFromAvailability(p.availability),
  isBlocked: Boolean(p.isBlocked),
  weeklyRecurringStock: p.weeklyStock || 0,
  description: p.description || '',
});

export const mapMarket = (m: any): MarketRecord => ({
  id: m._id,
  name: m.name,
  address: m.address,
  city: m.city,
  description: m.description,
  operatingDays: (m.operatingDays || []).map(dayCodeToName),
  timings: m.timings || 'Hours not set',
  lat: typeof m.latitude === 'number' ? m.latitude : 24.8607,
  lng: typeof m.longitude === 'number' ? m.longitude : 67.0011,
  activeVendorsCount: m.activeVendorsCount || 0,
  status: m.status || 'open',
});

export const mapCategory = (c: any): CategoryMasterItem => ({
  id: c._id,
  name: c.name,
  itemCount: c.itemCount || 0,
  badgeColor: c.badgeColor || 'bg-emerald-50 text-emerald-700 border-emerald-200',
  iconName: c.iconName || 'veggies',
  description: c.description,
  isActive: c.isActive !== false,
});

/** every farmer-market assignment becomes one stall pin on the map */
export const buildStalls = (directory: DirectoryFarmer[]): Record<string, StallLocation[]> => {
  const byMarket: Record<string, StallLocation[]> = {};
  directory.forEach((f) => {
    f.markets.forEach((a, idx) => {
      const m = a.market;
      if (!m) return;
      const list = (byMarket[m._id] = byMarket[m._id] || []);
      // no stall pin set -> spread stalls slightly around the market centre so they don't overlap
      const offset = (list.length + 1) * 0.00025;
      list.push({
        id: a._id,
        farmerId: f._id,
        stallNumber: a.stallNumber || `Stall ${list.length + 1}`,
        stallName: f.stallName,
        farmerName: f.contactPerson,
        marketId: m._id,
        marketName: m.name,
        category: f.categories.join(', ') || 'Fresh produce',
        lat: typeof a.latitude === 'number' ? a.latitude : (m.latitude || 24.86) + offset * (idx % 2 ? 1 : -1),
        lng: typeof a.longitude === 'number' ? a.longitude : (m.longitude || 67.0) + offset,
        rating: f.rating,
        ordersCount: f.completedOrders,
        phone: '',
        description: f.description || '',
        specialtyItems: f.categories,
        pickupWindows: a.pickupStart && a.pickupEnd ? [`${a.pickupStart} - ${a.pickupEnd}`] : [],
      });
    });
  });
  return byMarket;
};

export const mapDirectoryFarmer = (f: DirectoryFarmer): FarmerRecord => ({
  id: f._id,
  name: f.contactPerson,
  farmName: f.stallName,
  email: '',
  phone: '',
  location: [f.address, f.city].filter(Boolean).filter((v, i, arr) => i === 0 || !arr[0]?.includes(v as string)).join(', '),
  status: 'approved',
  joinDate: formatDate(f.createdAt),
  rating: f.rating,
  totalOrders: f.completedOrders,
  revenue: 0,
  productCount: f.productCount,
  categories: f.categories,
});

// ---------- orders ----------

const CUSTOMER_STATUS: Record<string, CustomerOrderStatus> = {
  PLACED: 'placed',
  ACCEPTED: 'accepted',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  DECLINED: 'declined',
  CANCELLED_BY_CUSTOMER: 'cancelled',
  CANCELLED_BY_FARMER: 'cancelled',
  EXPIRED: 'cancelled',
};

const VENDOR_STATUS: Record<string, VendorOrderStatus> = {
  PLACED: 'pending',
  ACCEPTED: 'accepted',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  DECLINED: 'declined',
  CANCELLED_BY_CUSTOMER: 'cancelled',
  CANCELLED_BY_FARMER: 'cancelled',
  EXPIRED: 'cancelled',
};

const pickupLabel = (o: any) =>
  `${o.pickupDate ? new Date(o.pickupDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} • ${o.pickupStart || ''} - ${o.pickupEnd || ''}`;

export const mapCustomerOrder = (o: any, stalls: Record<string, StallLocation[]>): CustomerPreOrder => {
  const marketId = o.market?._id || o.market;
  const farmerId = o.farmer?._id || o.farmer;
  const stall = (stalls[marketId] || []).find((s) => s.farmerId === farmerId);
  const beforeCutoff = o.cutoffAt ? new Date() < new Date(o.cutoffAt) : false;
  const editable = ['PLACED', 'ACCEPTED'].includes(o.status) && beforeCutoff;
  const items = (o.items || []).map((i: any) => ({
    id: i.product,
    orderItemId: i._id,
    name: i.productName,
    quantity: i.quantity,
    price: i.price,
    unit: i.unit,
    reviewed: Boolean(i.reviewed),
  }));
  return {
    id: o._id,
    code: orderCode(o._id),
    farmerId,
    marketId,
    marketName: o.market?.name || 'Market',
    marketAddress: [o.market?.address, o.market?.city].filter(Boolean).join(', '),
    stallName: o.farmer?.stallName || 'Farmer stall',
    stallNumber: stall?.stallNumber || '',
    stallLat: stall?.lat ?? o.market?.latitude ?? 24.86,
    stallLng: stall?.lng ?? o.market?.longitude ?? 67.0,
    pickupDate: o.pickupDate ? toDateKey(new Date(o.pickupDate)) : '',
    pickupSlot: pickupLabel(o),
    cutoffTime: formatDateTime(o.cutoffAt),
    cutoffAt: o.cutoffAt,
    orderPlacedAt: formatDateTime(o.createdAt),
    status: CUSTOMER_STATUS[o.status] || 'placed',
    rawStatus: o.status,
    statusReason: o.declineReason || o.cancelReason || undefined,
    items,
    total: o.totalAmount,
    notes: o.notes,
    paymentStatus: o.paymentStatus === 'PAID' ? 'paid' : 'pending',
    canModify: editable,
    canCancel: editable,
    hasFeedback: items.length > 0 && items.every((i: any) => i.reviewed),
    pickupCode: o.pickupCode,
  };
};

export const mapVendorOrder = (o: any): VendorOrder => ({
  id: o._id,
  code: orderCode(o._id),
  customerName: o.customer?.name || 'Customer',
  customerPhone: o.customer?.phone || '—',
  marketName: o.market?.name || '',
  items: (o.items || []).map((i: any) => ({
    productId: i.product,
    name: i.productName,
    quantity: i.quantity,
    unitPrice: i.price,
    unit: i.unit,
  })),
  totalAmount: o.totalAmount,
  pickupSlot: pickupLabel(o),
  orderDate: formatDateTime(o.createdAt),
  createdAt: o.createdAt,
  pickupDate: o.pickupDate ? toDateKey(new Date(o.pickupDate)) : '',
  cutoffTime: formatDateTime(o.cutoffAt),
  status: VENDOR_STATUS[o.status] || 'pending',
  rawStatus: o.status,
  statusReason: o.declineReason || o.cancelReason || undefined,
  notes: o.notes,
});

// ---------- farmer side ----------

export const mapAssignment = (a: any): FarmerAssignment => ({
  id: a._id,
  marketId: a.market?._id || a.market,
  marketName: a.market?.name || 'Market',
  marketAddress: a.market?.address || '',
  marketLat: a.market?.latitude ?? 24.86,
  marketLng: a.market?.longitude ?? 67.0,
  operatingDays: a.operatingDays || [],
  pickupStart: a.pickupStart || '',
  pickupEnd: a.pickupEnd || '',
  cutoffHours: a.cutoffHours ?? 12,
  stallNumber: a.stallNumber || '',
  lat: a.latitude,
  lng: a.longitude,
  isActive: a.isActive !== false,
});

export const mapSlot = (s: any): VendorPickupSlot => ({
  id: s._id,
  farmerMarketId: s.farmerMarket?._id || s.farmerMarket,
  dayOfWeek: s.dayOfWeek,
  startTime: s.startTime,
  endTime: s.endTime,
  capacity: s.capacity,
  isActive: s.isActive !== false,
});

export const mapStallSettings = (farmer: any, user: any, assignments: FarmerAssignment[], slots: VendorPickupSlot[]): StallSettings => {
  const active = assignments.filter((a) => a.isActive);
  return {
    farmerId: farmer._id,
    approvalStatus: farmerStatus(farmer.approvalStatus),
    statusReason: farmer.statusReason,
    stallName: farmer.stallName,
    description: farmer.description || '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    operationalDays: [...new Set(active.flatMap((a) => a.operatingDays))].map(dayCodeToName),
    pickupWindows: slots.filter((s) => s.isActive).map((s) => `${dayCodeToName(s.dayOfWeek).slice(0, 3)} ${s.startTime} - ${s.endTime}`),
    locationName: farmer.address || '',
    city: farmer.city || '',
    marketName: active.map((a) => a.marketName).join(', '),
    lat: typeof farmer.latitude === 'number' ? farmer.latitude : 24.8607,
    lng: typeof farmer.longitude === 'number' ? farmer.longitude : 67.0011,
    imageUrl: imageUrl(farmer.image),
    cutoffHoursBeforePickup: active[0]?.cutoffHours ?? 12,
    autoResetWeeklyStock: Boolean(farmer.autoResetWeeklyStock),
    lastStockResetAt: farmer.lastStockResetAt,
  };
};

export const mapVendorReview = (r: any): VendorReview => ({
  id: r._id,
  customerName: r.customer?.name || 'Customer',
  productName: r.product?.name || 'Product',
  rating: r.rating,
  date: formatDate(r.createdAt),
  comment: r.comment || '',
  verifiedPurchase: true, // reviews can only be left on completed orders
  hidden: r.status === 'HIDDEN',
  reply: r.farmerResponse ? { text: r.farmerResponse, date: formatDate(r.updatedAt) } : undefined,
});

// ---------- admin side ----------

export const mapAdminFarmer = (f: any): FarmerRecord => ({
  id: f._id,
  userId: f.user?._id,
  name: f.user?.name || '—',
  farmName: f.stallName,
  email: f.user?.email || '',
  phone: f.user?.phone || '',
  location: [f.address, f.city].filter(Boolean).filter((v, i, arr) => i === 0 || !arr[0]?.includes(v as string)).join(', '),
  status: farmerStatus(f.approvalStatus),
  statusReason: f.statusReason,
  joinDate: formatDate(f.createdAt),
  rating: f.rating || 0,
  totalOrders: f.totalOrders || 0,
  revenue: f.revenue || 0,
  productCount: f.productCount || 0,
  categories: f.categories || [],
});

export const mapAdminCustomer = (c: any): CustomerRecord => ({
  id: c._id,
  name: c.name,
  email: c.email,
  phone: c.phone || '',
  address: [c.address, c.city].filter(Boolean).join(', '),
  status: c.status === 'ACTIVE' ? 'active' : 'deactivated',
  totalOrders: c.totalOrders || 0,
  totalSpent: c.totalSpent || 0,
  joinDate: formatDate(c.createdAt),
  lastOrderDate: c.lastOrderAt ? formatDate(c.lastOrderAt) : 'No orders yet',
});

export const mapModerationItem = (m: any): ModerationItem => ({ ...m, date: timeAgo(m.date), status: 'pending' });

export const mapAnnouncement = (a: any): SystemAnnouncement => ({
  id: a._id,
  title: a.title,
  message: a.message,
  targetAudience: a.targetAudience || 'all',
  priority: a.priority || 'normal',
  createdAt: timeAgo(a.createdAt),
  active: a.isActive !== false,
});

export const mapContactMessage = (m: any): ContactMessage => ({
  id: m._id,
  name: m.name,
  email: m.email,
  phone: m.phone,
  subject: m.subject,
  message: m.message,
  isRead: Boolean(m.isRead),
  createdAt: timeAgo(m.createdAt),
});

export const mapOverview = (o: any): AdminOverview => ({
  counts: o.counts,
  revenue: o.revenue,
  completedOrders: o.completedOrders,
  ordersByDay: o.ordersByDay,
  revenueByMarket: o.revenueByMarket,
  topFarmers: o.topFarmers,
});

// ---------- notifications ----------

export const mapNotification = (n: any): CustomerNotification => {
  const lower = `${n.title} ${n.message || ''}`.toLowerCase();
  const type: CustomerNotification['type'] =
    n.type === 'ORDER' ? 'order_status' : lower.includes('back in stock') ? 'restock' : n.type === 'SYSTEM' ? 'announcement' : 'reminder';
  return {
    id: n._id,
    title: n.title,
    message: n.message || '',
    time: timeAgo(n.createdAt),
    read: Boolean(n.isRead),
    type,
  };
};
