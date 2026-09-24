export interface CategoryItem {
  id: string;
  name: string;
  stock: string;
  count: number;
  icon: 'veggies' | 'tubers' | 'fish' | 'fruits' | 'meat';
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  unit: string;
  imageType: 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom';
  hasRedDot?: boolean;
  isFavorite?: boolean;
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
