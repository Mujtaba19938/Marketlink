export interface CategoryItem {
  id: string;
  name: string;
  stock: string;
  count: number;
  icon: 'veggies' | 'tubers' | 'fish' | 'fruits' | 'meat';
}

export type ProduceImageType = 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom';

export interface ProductItem {
  id: string;
  name: string;
  category: string; // category name
  categoryId?: string;
  stock: number;
  price: number;
  unit: string;
  imageType: ProduceImageType;
  imageUrl?: string;
  availability?: 'AVAILABLE' | 'SOLD_OUT' | 'UNAVAILABLE';
  hasRedDot?: boolean;
  isFavorite?: boolean;
  farmerName?: string; // contact person
  farmerId?: string;
  farmName?: string; // stall name
  farmerRating?: number;
  area?: string;
  marketName?: string;
  marketIds?: string[];
  operatingDays?: string[]; // MON..SUN across the farmer's markets
  description?: string;
  origin?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  isRead?: boolean;
}

export interface OrderItem {
  id: string;
  customerName: string;
  time: string;
  goods: string;
  status: 'pending' | 'accepted';
}

export interface IncomeMetric {
  period: 'Daily' | 'Weekly' | 'Monthly';
  amount: number;
  percentage: number;
}

export interface StallLocation {
  id: string; // farmerMarket id
  farmerId?: string;
  stallNumber: string;
  stallName: string;
  farmerName: string;
  marketId: string;
  marketName: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  ordersCount: number;
  phone: string;
  description: string;
  specialtyItems: string[];
  pickupWindows: string[];
}
