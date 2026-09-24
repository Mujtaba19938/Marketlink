export interface FarmerRecord {
  id: string;
  name: string;
  farmName: string;
  email: string;
  phone: string;
  location: string;
  status: 'approved' | 'pending' | 'suspended';
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
}
