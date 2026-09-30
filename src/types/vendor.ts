export interface VendorOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export type VendorOrderStatus = 'pending' | 'accepted' | 'ready_for_pickup' | 'completed' | 'declined' | 'cancelled';

export interface VendorOrder {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  marketName: string;
  items: VendorOrderItem[];
  totalAmount: number;
  pickupSlot: string;
  orderDate: string;
  createdAt: string; // ISO
  pickupDate: string; // YYYY-MM-DD
  cutoffTime: string;
  status: VendorOrderStatus;
  rawStatus: string;
  statusReason?: string;
  notes?: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  category: string; // category name
  categoryId: string;
  price: number;
  unit: string;
  stock: number;
  imageType?: string;
  imageUrl?: string;
  status: 'in_stock' | 'sold_out' | 'temporarily_unavailable';
  isBlocked?: boolean;
  weeklyRecurringStock: number;
  description?: string;
}

export interface StallSettings {
  farmerId: string;
  approvalStatus: 'approved' | 'pending' | 'suspended' | 'rejected';
  statusReason?: string;
  stallName: string;
  description: string;
  contactPerson: string;
  phone: string;
  email: string;
  operationalDays: string[];
  pickupWindows: string[];
  locationName: string; // farm / stall address
  city: string;
  marketName: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  cutoffHoursBeforePickup: number;
  autoResetWeeklyStock: boolean;
  lastStockResetAt?: string;
}

/** one farmer <-> market assignment (backend: farmerMarket) */
export interface FarmerAssignment {
  id: string;
  marketId: string;
  marketName: string;
  marketAddress: string;
  marketLat: number;
  marketLng: number;
  operatingDays: string[]; // MON..SUN
  pickupStart: string;
  pickupEnd: string;
  cutoffHours: number;
  stallNumber: string;
  lat?: number;
  lng?: number;
  isActive: boolean;
}

export interface VendorPickupSlot {
  id: string;
  farmerMarketId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
}

export interface VendorReview {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  hidden?: boolean;
  reply?: {
    text: string;
    date: string;
  };
}

export interface VendorInsights {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  readyOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  revenue: number;
  bestSellers: { name: string; unit: string; quantity: number; revenue: number; image?: string; imageType?: string }[];
  slots: { label: string; count: number; share: number }[];
  days?: number; // 7 | 30 | 90, 0 = all time
  cancellationRate?: number;
  averageOrderValue?: number;
  customers?: number;
  repeatCustomers?: number;
  trend?: { unit: 'day' | 'week'; points: { label: string; revenue: number; orders: number }[] };
  rating?: { average: number; count: number; distribution: number[] }; // distribution[0] = 1 star
  lowStock?: { _id: string; name: string; quantity: number; unit: string; weeklyStock?: number; image?: string; imageType?: string }[];
}
