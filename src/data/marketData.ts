import { CategoryItem, ProductItem, NotificationItem, OrderItem, IncomeMetric } from '../types/market';

export const initialCategories: CategoryItem[] = [
  {
    id: 'veggies',
    name: 'Veggies',
    stock: '1.890 stock',
    count: 1890,
    icon: 'veggies',
  },
  {
    id: 'tubers',
    name: 'Tubers',
    stock: '2.040 stock',
    count: 2040,
    icon: 'tubers',
  },
  {
    id: 'fish',
    name: 'Fish',
    stock: '548 stock',
    count: 548,
    icon: 'fish',
  },
  {
    id: 'fruits',
    name: 'Fruits',
    stock: '300 stock',
    count: 300,
    icon: 'fruits',
  },
  {
    id: 'meat',
    name: 'Meat',
    stock: '236 stock',
    count: 236,
    icon: 'meat',
  },
];

export const popularProducts: ProductItem[] = [
  {
    id: 'prod-cabbage',
    name: 'Cabbage',
    category: 'veggies',
    stock: 210,
    price: 15.10,
    unit: 'pre kg',
    imageType: 'cabbage',
    hasRedDot: true,
  },
  {
    id: 'prod-kale',
    name: 'Kale vegetables',
    category: 'veggies',
    stock: 129,
    price: 8.34,
    unit: 'pre kg',
    imageType: 'kale',
  },
  {
    id: 'prod-broccoli',
    name: 'Brocoly',
    category: 'veggies',
    stock: 450,
    price: 5.60,
    unit: 'pre kg',
    imageType: 'broccoli',
  },
  {
    id: 'prod-celery',
    name: 'Celery',
    category: 'veggies',
    stock: 890,
    price: 4.80,
    unit: 'pre kg',
    imageType: 'celery',
  },
];

export const topItems: ProductItem[] = [
  {
    id: 'prod-carrot',
    name: 'Organic Carrots',
    category: 'tubers',
    stock: 310,
    price: 3.45,
    unit: 'pre kg',
    imageType: 'carrot',
    isFavorite: true,
  },
  {
    id: 'prod-tomato',
    name: 'Vine Tomatoes',
    category: 'fruits',
    stock: 185,
    price: 6.20,
    unit: 'pre kg',
    imageType: 'tomato',
    isFavorite: true,
  },
  {
    id: 'prod-pepper',
    name: 'Sweet Bell Pepper',
    category: 'veggies',
    stock: 92,
    price: 7.50,
    unit: 'pre kg',
    imageType: 'pepper',
    isFavorite: true,
  },
  {
    id: 'prod-mushroom',
    name: 'White Mushrooms',
    category: 'veggies',
    stock: 140,
    price: 9.15,
    unit: 'pre kg',
    imageType: 'mushroom',
    isFavorite: true,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'The fruit is almost finished, quickly refill',
    time: 'Tue, 14 May, 10.00 AM',
  },
  {
    id: 'notif-2',
    title: 'Vegetable stocks have been filled',
    time: 'Wed, 15 May, 09.00 AM',
  },
  {
    id: 'notif-3',
    title: 'Fish stock has been reordered',
    time: 'Fri, 17 May, 10.00 AM',
  },
  {
    id: 'notif-4',
    title: 'Fish orders have been refilled',
    time: 'Fri, 17 May, 18.00 PM',
  },
];

export const initialOrders: OrderItem[] = [
  {
    id: 'ord-1',
    customerName: 'Raya Reese',
    time: 'Sun, 19 May, 06.56 AM',
    goods: 'Carrot ( 5 )',
    status: 'pending',
  },
  {
    id: 'ord-2',
    customerName: 'Asher Stanley',
    time: 'Sun, 19 May, 06.52 AM',
    goods: 'Celery ( 2 )',
    status: 'pending',
  },
  {
    id: 'ord-3',
    customerName: 'Arianna',
    time: 'Sun, 19 May, 06.48 AM',
    goods: 'Brocoly ( 4 )',
    status: 'accepted',
  },
  {
    id: 'ord-4',
    customerName: 'Lyra Lane',
    time: 'Sun, 19 May, 06.30 AM',
    goods: 'Cabbage ( 3 )',
    status: 'accepted',
  },
];

export const incomeMetrics: IncomeMetric[] = [
  {
    period: 'Daily',
    amount: 129.80,
    percentage: 30,
  },
  {
    period: 'Weekly',
    amount: 347.62,
    percentage: 55,
  },
  {
    period: 'Monthly',
    amount: 897.66,
    percentage: 80,
  },
];
