export interface VendorOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export type VendorOrderStatus = 'pending' | 'accepted' | 'ready_for_pickup' | 'completed' | 'declined';

export interface VendorOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: VendorOrderItem[];
  totalAmount: number;
  pickupSlot: string;
  orderDate: string;
  cutoffTime: string;
  status: VendorOrderStatus;
  notes?: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  imageType?: string;
  status: 'in_stock' | 'sold_out' | 'temporarily_unavailable';
  weeklyRecurringStock: number;
  description?: string;
}

export interface StallSettings {
  stallName: string;
  contactPerson: string;
  phone: string;
  email: string;
  operationalDays: string[];
  pickupWindows: string[];
  locationName: string;
  marketName: string;
  lat: number;
  lng: number;
  cutoffHoursBeforePickup: number;
  autoResetWeeklyStock: boolean;
}

export interface VendorReview {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  reply?: {
    text: string;
    date: string;
  };
}
