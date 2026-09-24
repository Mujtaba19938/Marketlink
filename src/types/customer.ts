export type CustomerOrderStatus = 'placed' | 'accepted' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface CustomerOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  imageType?: string;
}

export interface CustomerPreOrder {
  id: string;
  marketName: string;
  marketAddress: string;
  stallName: string;
  stallNumber: string;
  stallLat: number;
  stallLng: number;
  pickupSlot: string;
  cutoffTime: string;
  orderPlacedAt: string;
  status: CustomerOrderStatus;
  items: CustomerOrderItem[];
  total: number;
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
  id: string;
  type: 'farmer' | 'product';
  name: string;
  subtitle: string;
  rating: number;
  tag: string;
  isRestocked?: boolean;
  restockStatus?: string;
  imageType?: string;
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
