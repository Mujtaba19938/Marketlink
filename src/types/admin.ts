export interface FarmerRecord {
  id: string;
  userId?: string;
  name: string; // contact person
  farmName: string; // stall / business name
  email: string;
  phone: string;
  location: string;
  status: 'approved' | 'pending' | 'suspended' | 'rejected';
  statusReason?: string;
  joinDate: string;
  rating: number;
  totalOrders: number;
  revenue: number;
  productCount: number;
  categories: string[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'deactivated';
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastOrderDate: string;
}

export interface MarketRecord {
  id: string;
  name: string;
  address: string;
  city?: string;
  description?: string;
  operatingDays: string[];
  timings: string;
  lat: number;
  lng: number;
  activeVendorsCount: number;
  status: 'open' | 'closed' | 'seasonal';
}

export interface ModerationItem {
  id: string;
  type: 'product' | 'review';
  targetName: string;
  authorName: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  contentPreview: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'vendors' | 'customers';
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  active: boolean;
}

export interface CategoryMasterItem {
  id: string;
  name: string;
  itemCount: number;
  badgeColor: string;
  iconName: string;
  description?: string;
  isActive?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminOverview {
  counts: { farmers: number; pendingFarmers: number; customers: number; markets: number; orders: number };
  revenue: number;
  completedOrders: number;
  ordersByDay: { date: string; day: string; orders: number; revenue: number }[];
  revenueByMarket: { name: string; revenue: number; orders: number; share: number }[];
  topFarmers: { id: string; stallName: string; location: string; orders: number; revenue: number; rating: number }[];
}
