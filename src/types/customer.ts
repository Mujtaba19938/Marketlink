export type CustomerOrderStatus =
  | 'placed'
  | 'accepted'
  | 'ready_for_pickup'
  | 'completed'
  | 'declined'
  | 'cancelled';

export interface CustomerOrderItem {
  id: string; // product id
  orderItemId: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  imageType?: string;
  reviewed?: boolean;
}

export interface CustomerPreOrder {
  id: string; // mongo _id
  code: string; // short display code, e.g. 3F9A21
  farmerId: string;
  marketId: string;
  marketName: string;
  marketAddress: string;
  stallName: string;
  stallNumber: string;
  stallLat: number;
  stallLng: number;
  pickupDate: string; // YYYY-MM-DD
  pickupSlot: string; // human readable date + window
  cutoffTime: string; // human readable
  cutoffAt: string; // ISO
  orderPlacedAt: string;
  status: CustomerOrderStatus;
  rawStatus: string; // backend status, e.g. CANCELLED_BY_FARMER
  statusReason?: string;
  items: CustomerOrderItem[];
  total: number;
  notes?: string;
  paymentStatus: 'paid' | 'pending';
  canModify: boolean;
  canCancel: boolean;
  hasFeedback?: boolean;
}

export interface SavedMarket {
  id: string;
  name: string;
  address: string;
  schedule: string;
  lat: number;
  lng: number;
  distance: string;
  isOpen: boolean;
  activeStalls: number;
}

export interface CustomerFavorite {
  id: string; // target id (product / farmer id)
  type: 'farmer' | 'product';
  name: string;
  subtitle: string;
  rating: number;
  tag: string;
  isRestocked?: boolean;
  restockStatus?: string;
  imageType?: string;
  imageUrl?: string;
  inStock?: boolean;
  price?: number;
  unit?: string;
}

export interface OrderFeedback {
  orderId: string;
  farmerName: string;
  rating: number;
  tags: string[];
  comment: string;
  date: string;
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order_status' | 'restock' | 'announcement' | 'reminder';
}

export interface PickupSlotOption {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  remaining: number;
  cutoffPassed: boolean;
}
