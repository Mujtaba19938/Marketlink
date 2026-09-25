import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  FarmerRecord,
  CustomerRecord,
  MarketRecord,
  ModerationItem,
  SystemAnnouncement,
  CategoryMasterItem,
} from '../types/admin';
import {
  VendorOrder,
  VendorProduct,
  StallSettings,
  VendorReview,
  VendorOrderStatus,
} from '../types/vendor';
import {
  CustomerPreOrder,
  CustomerOrderStatus,
  SavedMarket,
  CustomerFavorite,
  CustomerNotification,
  OrderFeedback,
} from '../types/customer';
import {
  mockAdminFarmers,
  mockAdminCustomers,
  mockAdminMarkets,
  mockAdminModeration,
  mockAdminCategories,
  mockAdminAnnouncements,
  mockVendorOrders,
  mockVendorProducts,
  mockStallSettings,
  mockVendorReviews,
  mockCustomerOrders,
  mockSavedMarkets,
  mockCustomerFavorites,
  mockCustomerNotifications,
  mockMarketStalls,
} from '../data/mockAppData';
import { StallLocation } from '../types/market';

export interface ToastAlert {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface MarketDataContextType {
  // Toast notifications
  toastList: ToastAlert[];
  triggerToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Admin state & actions
  farmers: FarmerRecord[];
  approveFarmer: (id: string) => void;
  suspendFarmer: (id: string) => void;
  customers: CustomerRecord[];
  toggleCustomerStatus: (id: string) => void;
  markets: MarketRecord[];
  addMarket: (market: Omit<MarketRecord, 'id' | 'activeVendorsCount'>) => void;
  updateMarket: (id: string, updates: Partial<MarketRecord>) => void;
  deleteMarket: (id: string) => void;
  moderationItems: ModerationItem[];
  removeModeratedItem: (id: string) => void;
  dismissModeratedItem: (id: string) => void;
  categories: CategoryMasterItem[];
  addCategory: (item: { name: string; badgeColor: string; iconName: string }) => void;
  announcements: SystemAnnouncement[];
  broadcastAnnouncement: (item: { title: string; message: string; targetAudience: 'all' | 'vendors' | 'customers'; priority: 'normal' | 'important' | 'urgent' }) => void;

  // Vendor state & actions
  vendorOrders: VendorOrder[];
  updateVendorOrderStatus: (orderId: string, status: VendorOrderStatus) => void;
  vendorProducts: VendorProduct[];
  addProduct: (product: Omit<VendorProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<VendorProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  stallSettings: StallSettings;
  updateStallSettings: (settings: Partial<StallSettings>) => void;
  vendorReviews: VendorReview[];
  replyToReview: (reviewId: string, replyText: string) => void;

  // Customer state & actions
  customerOrders: CustomerPreOrder[];
  placeNewCustomerOrder: (data: {
    marketId?: string;
    pickupDate?: string;
    pickupSlot?: string;
    notes?: string;
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      unit: string;
      imageType?: string;
    }[];
    paymentMethod?: 'stripe' | 'pickup' | 'cod';
    paymentStatus?: 'paid' | 'pending';
    stripeChargeId?: string;
    deliveryType?: 'delivery' | 'pickup';
    deliveryAddress?: string;
    deliveryArea?: string;
    status?: CustomerOrderStatus;
  }) => CustomerPreOrder;
  advanceOrderDeliveryStep: (orderId: string) => void;
  cancelCustomerOrder: (orderId: string) => void;
  modifyCustomerOrder: (orderId: string, updatedItems: { name: string; quantity: number }[]) => void;
  quickReorder: (orderId: string) => void;
  savedMarkets: SavedMarket[];
  toggleSavedMarket: (marketId: string) => void;
  customerFavorites: CustomerFavorite[];
  toggleFavorite: (favoriteId: string) => void;
  customerNotifications: CustomerNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  feedbacks: OrderFeedback[];
  submitFeedback: (feedback: OrderFeedback) => void;

  // Stalls on Map (SRS Section 1.6 & 1.8)
  marketStalls: Record<string, StallLocation[]>;
  getStallsForMarket: (marketId: string) => StallLocation[];
  findStallById: (stallId: string) => StallLocation | undefined;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Toasts
  const [toastList, setToastList] = useState<ToastAlert[]>([]);

  const triggerToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      setToastList((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToastList((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToastList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Admin Data State
  const [farmers, setFarmers] = useState<FarmerRecord[]>(mockAdminFarmers);
  const [customers, setCustomers] = useState<CustomerRecord[]>(mockAdminCustomers);
  const [markets, setMarkets] = useState<MarketRecord[]>(mockAdminMarkets);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(mockAdminModeration);
  const [categories, setCategories] = useState<CategoryMasterItem[]>(mockAdminCategories);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(mockAdminAnnouncements);

  // Vendor Data State
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>(mockVendorOrders);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>(mockVendorProducts);
  const [stallSettings, setStallSettingsState] = useState<StallSettings>(mockStallSettings);
  const [vendorReviews, setVendorReviews] = useState<VendorReview[]>(mockVendorReviews);

  // Customer Data State
  const [customerOrders, setCustomerOrders] = useState<CustomerPreOrder[]>(mockCustomerOrders);
  const [savedMarkets, setSavedMarkets] = useState<SavedMarket[]>(mockSavedMarkets);
  const [customerFavorites, setCustomerFavorites] = useState<CustomerFavorite[]>(mockCustomerFavorites);
  const [customerNotifications, setCustomerNotifications] = useState<CustomerNotification[]>(mockCustomerNotifications);
  const [feedbacks, setFeedbacks] = useState<OrderFeedback[]>([]);

  // Stalls on Map State (SRS Section 1.6 & 1.8)
  const [marketStalls, setMarketStalls] = useState<Record<string, StallLocation[]>>(mockMarketStalls);

  const getStallsForMarket = useCallback((marketId: string): StallLocation[] => {
    return marketStalls[marketId] || mockMarketStalls[marketId] || [];
  }, [marketStalls]);

  const findStallById = useCallback((stallId: string): StallLocation | undefined => {
    for (const key of Object.keys(marketStalls)) {
      const match = marketStalls[key].find((s) => s.id === stallId);
      if (match) return match;
    }
    return undefined;
  }, [marketStalls]);

  // Admin Actions
  const approveFarmer = (id: string) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'approved' as const } : f))
    );
    const farmer = farmers.find((f) => f.id === id);
    triggerToast(`Approved registration for ${farmer ? farmer.name : 'Farmer'}`, 'success');
  };

  const suspendFarmer = (id: string) => {
    setFarmers((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'suspended' ? ('approved' as const) : ('suspended' as const) }
          : f
      )
    );
    const farmer = farmers.find((f) => f.id === id);
    const isNowSuspended = farmer?.status !== 'suspended';
    triggerToast(
      isNowSuspended
        ? `Suspended account for ${farmer?.name}`
        : `Re-activated account for ${farmer?.name}`,
      isNowSuspended ? 'warning' : 'success'
    );
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? ('deactivated' as const) : ('active' as const) }
          : c
      )
    );
    const cust = customers.find((c) => c.id === id);
    const nextStatus = cust?.status === 'active' ? 'deactivated' : 'active';
    triggerToast(`Customer ${cust?.name} set to ${nextStatus}`, 'info');
  };

  const addMarket = (marketData: Omit<MarketRecord, 'id' | 'activeVendorsCount'>) => {
    const newMarket: MarketRecord = {
      ...marketData,
      id: 'mkt-' + (markets.length + 1),
      activeVendorsCount: 0,
    };
    setMarkets((prev) => [newMarket, ...prev]);
    triggerToast(`Added new market: ${newMarket.name}`, 'success');
  };

  const updateMarket = (id: string, updates: Partial<MarketRecord>) => {
    setMarkets((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    triggerToast('Market location updated successfully', 'success');
  };

  const deleteMarket = (id: string) => {
    const market = markets.find((m) => m.id === id);
    setMarkets((prev) => prev.filter((m) => m.id !== id));
    triggerToast(`Removed market: ${market?.name || id}`, 'warning');
  };

  const removeModeratedItem = (id: string) => {
    const item = moderationItems.find((m) => m.id === id);
    setModerationItems((prev) => prev.filter((m) => m.id !== id));
    triggerToast(`Removed flagged item: "${item?.targetName}"`, 'warning');
  };

  const dismissModeratedItem = (id: string) => {
    const item = moderationItems.find((m) => m.id === id);
    setModerationItems((prev) => prev.filter((m) => m.id !== id));
    triggerToast(`Dismissed flag for "${item?.targetName}"`, 'info');
  };

  const addCategory = (item: { name: string; badgeColor: string; iconName: string }) => {
    const newCat: CategoryMasterItem = {
      id: 'cat-' + item.name.toLowerCase().replace(/\s+/g, '-'),
      name: item.name,
      itemCount: 0,
      badgeColor: item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200',
      iconName: item.iconName || 'veggies',
    };
    setCategories((prev) => [...prev, newCat]);
    triggerToast(`Created category: ${item.name}`, 'success');
  };

  const broadcastAnnouncement = (item: {
    title: string;
    message: string;
    targetAudience: 'all' | 'vendors' | 'customers';
    priority: 'normal' | 'important' | 'urgent';
  }) => {
    const newAnn: SystemAnnouncement = {
      id: 'ann-' + Date.now(),
      ...item,
      createdAt: 'Just now',
      active: true,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Also add to customer notifications if relevant
    if (item.targetAudience === 'all' || item.targetAudience === 'customers') {
      const newNotif: CustomerNotification = {
        id: 'notif-' + Date.now(),
        title: item.title,
        message: item.message,
        time: 'Just now',
        read: false,
        type: 'announcement',
      };
      setCustomerNotifications((prev) => [newNotif, ...prev]);
    }

    triggerToast(`Broadcasted announcement to ${item.targetAudience}`, 'success');
  };

  // Vendor Actions
  const updateVendorOrderStatus = (orderId: string, status: VendorOrderStatus) => {
    setVendorOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    // Synchronize customer order status real-time!
    setCustomerOrders((prev) =>
      prev.map((co) => {
        if (co.id === orderId) {
          let custStatus: CustomerPreOrder['status'] = 'placed';
          if (status === 'accepted') custStatus = 'accepted';
          if (status === 'ready_for_pickup') custStatus = 'ready_for_pickup';
          if (status === 'completed') custStatus = 'completed';
          if (status === 'declined') custStatus = 'cancelled';
          return {
            ...co,
            status: custStatus,
            canModify: custStatus === 'placed',
            canCancel: custStatus === 'placed',
          };
        }
        return co;
      })
    );

    // If marked ready for pickup, generate notification
    if (status === 'ready_for_pickup') {
      const targetOrder = vendorOrders.find((o) => o.id === orderId);
      const newNotif: CustomerNotification = {
        id: 'notif-ready-' + Date.now(),
        title: `Order ${orderId} Ready for Pickup! 🥬`,
        message: `Your pre-order has been packaged and is waiting at Green Valley Stall #14.`,
        time: 'Just now',
        read: false,
        type: 'order_status',
      };
      setCustomerNotifications((prev) => [newNotif, ...prev]);
      triggerToast(`Order ${orderId} marked as Ready for Pickup`, 'success');
    } else if (status === 'accepted') {
      triggerToast(`Pre-order ${orderId} accepted`, 'success');
    } else if (status === 'declined') {
      triggerToast(`Pre-order ${orderId} declined`, 'warning');
    } else if (status === 'completed') {
      triggerToast(`Order ${orderId} marked fulfilled`, 'success');
    }
  };

  const addProduct = (product: Omit<VendorProduct, 'id'>) => {
    const newProd: VendorProduct = {
      ...product,
      id: 'prod-' + Date.now().toString(36),
    };
    setVendorProducts((prev) => [newProd, ...prev]);
    triggerToast(`Added product: ${newProd.name}`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<VendorProduct>) => {
    setVendorProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    triggerToast('Product details updated', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = vendorProducts.find((p) => p.id === id);
    setVendorProducts((prev) => prev.filter((p) => p.id !== id));
    triggerToast(`Deleted ${prod?.name || 'product'}`, 'info');
  };

  const toggleProductStatus = (id: string) => {
    setVendorProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus =
            p.status === 'in_stock' ? 'sold_out' : 'in_stock';
          return {
            ...p,
            status: nextStatus,
            stock: nextStatus === 'sold_out' ? 0 : p.weeklyRecurringStock || 25,
          };
        }
        return p;
      })
    );
    const prod = vendorProducts.find((p) => p.id === id);
    const isNowSoldOut = prod?.status === 'in_stock';
    triggerToast(
      isNowSoldOut ? `Marked ${prod?.name} as Sold Out` : `Marked ${prod?.name} as In Stock`,
      isNowSoldOut ? 'warning' : 'success'
    );
  };

  const updateStallSettings = (settings: Partial<StallSettings>) => {
    setStallSettingsState((prev) => ({ ...prev, ...settings }));
    triggerToast('Stall settings & map coordinates saved!', 'success');
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setVendorReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: {
                text: replyText,
                date: 'Just now',
              },
            }
          : r
      )
    );
    triggerToast('Reply posted to customer review', 'success');
  };

  // Customer Actions
  const placeNewCustomerOrder = (data: {
    marketId?: string;
    pickupDate?: string;
    pickupSlot?: string;
    notes?: string;
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      unit: string;
      imageType?: string;
    }[];
    paymentMethod?: 'stripe' | 'pickup' | 'cod';
    paymentStatus?: 'paid' | 'pending';
    stripeChargeId?: string;
    deliveryType?: 'delivery' | 'pickup';
    deliveryAddress?: string;
    deliveryArea?: string;
    status?: CustomerOrderStatus;
  }): CustomerPreOrder => {
    const market = (data.marketId ? markets.find((m) => m.id === data.marketId) : null) || markets[0];
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ORD-${orderNum}`;
    const total = data.items.reduce((acc, it) => acc + it.price * it.quantity, 0);

    const initialStatus: CustomerOrderStatus =
      data.status || (data.paymentMethod === 'stripe' ? 'payment_confirmed' : 'placed');
    const initialStep = initialStatus === 'payment_confirmed' ? 1 : 0;

    const newOrder: CustomerPreOrder = {
      id: newOrderId,
      marketName: market?.name || 'Downtown Fresh Pavilion',
      marketAddress: market?.address || '400 Civic Center Plaza, Metro City',
      stallName: stallSettings.stallName || 'Green Valley Organic Stall #14',
      stallNumber: 'Stall #14',
      stallLat: market?.lat || 37.7749,
      stallLng: market?.lng || -122.4194,
      pickupSlot:
        data.pickupDate && data.pickupSlot
          ? `${data.pickupDate} • ${data.pickupSlot}`
          : 'Express Delivery • Within 45 mins',
      cutoffTime: 'Friday, 08:00 PM',
      orderPlacedAt: 'Just now',
      status: initialStatus,
      paymentMethod: data.paymentMethod || 'stripe',
      paymentStatus: data.paymentStatus || 'paid',
      stripeChargeId: data.stripeChargeId || `ch_test_${Math.random().toString(36).substring(2, 10)}`,
      deliveryType: data.deliveryType || 'delivery',
      deliveryAddress: data.deliveryAddress || '1048 Market St, Downtown Metro',
      deliveryArea: data.deliveryArea || 'Downtown Metro',
      deliveryEstimatedTime: '35 - 45 mins',
      deliveryStep: initialStep,
      courierName: 'Alex Morales (Eco-Courier)',
      courierPhone: '+1 (555) 438-9210',
      items: data.items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        unit: it.unit || 'kg',
        imageType: it.imageType,
      })),
      total: Number((total + (data.deliveryType === 'pickup' ? 0 : 3.5)).toFixed(2)),
      canCancel: initialStatus === 'placed' || initialStatus === 'payment_confirmed',
      canModify: initialStatus === 'placed',
      hasFeedback: false,
    };

    setCustomerOrders((prev) => [newOrder, ...prev]);

    // Also inject into vendor orders for fulfillment
    const newVendorOrder: VendorOrder = {
      id: newOrderId,
      customerName: 'Customer (Order Placed)',
      customerPhone: '+1 (555) 234-8901',
      items: data.items.map((it) => ({
        productId: it.id,
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.price,
        unit: it.unit || 'kg',
      })),
      totalAmount: newOrder.total,
      pickupSlot: newOrder.pickupSlot,
      orderDate: 'Today',
      cutoffTime: 'Friday, 08:00 PM',
      status: 'pending',
      notes: data.notes || (data.deliveryType === 'delivery' ? `Delivery to: ${data.deliveryAddress}` : 'Market Stall Pickup'),
    };
    setVendorOrders((prev) => [newVendorOrder, ...prev]);

    // Decrement stock for ordered items
    data.items.forEach((orderedItem) => {
      setVendorProducts((prev) =>
        prev.map((vp) =>
          vp.name.toLowerCase() === orderedItem.name.toLowerCase()
            ? { ...vp, stock: Math.max(0, vp.stock - orderedItem.quantity) }
            : vp
        )
      );
    });

    // Send confirmation notification
    const newNotif: CustomerNotification = {
      id: 'notif-order-' + Date.now(),
      title: `Order #${newOrderId} Confirmed! 🎉`,
      message: `Your order for ${data.items.length} item(s) has been confirmed ($${newOrder.total}). Tracking is active.`,
      time: 'Just now',
      read: false,
      type: 'order_status',
    };
    setCustomerNotifications((prev) => [newNotif, ...prev]);

    triggerToast(`Order #${newOrderId} created with confirmed payment!`, 'success');
    return newOrder;
  };

  const advanceOrderDeliveryStep = (orderId: string) => {
    // 6-step lifecycle:
    // 0: Placed -> 1: Payment Confirmed -> 2: Processing -> 3: Dispatched -> 4: Out for Delivery -> 5: Delivered
    const stepMap: { step: number; status: CustomerOrderStatus; eta: string; label: string }[] = [
      { step: 0, status: 'placed', eta: '50-60 mins', label: 'Order Placed' },
      { step: 1, status: 'payment_confirmed', eta: '45-50 mins', label: 'Payment Confirmed' },
      { step: 2, status: 'processing', eta: '35-40 mins', label: 'Processing at Stall' },
      { step: 3, status: 'dispatched', eta: '25-30 mins', label: 'Dispatched to Courier' },
      { step: 4, status: 'out_for_delivery', eta: '10-15 mins', label: 'Out for Delivery' },
      { step: 5, status: 'delivered', eta: 'Delivered', label: 'Order Delivered!' },
    ];

    setCustomerOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const currentStep = o.deliveryStep ?? (o.status === 'payment_confirmed' ? 1 : 0);
          const nextStep = Math.min(5, currentStep + 1);
          const stage = stepMap[nextStep];
          triggerToast(`Order #${orderId} status updated: ${stage.label}`, 'info');
          return {
            ...o,
            deliveryStep: nextStep,
            status: stage.status,
            deliveryEstimatedTime: stage.eta,
            canCancel: nextStep <= 1,
            canModify: nextStep === 0,
          };
        }
        return o;
      })
    );
  };

  const cancelCustomerOrder = (orderId: string) => {
    setCustomerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const, canCancel: false, canModify: false } : o))
    );
    setVendorOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'declined' as const } : o))
    );
    triggerToast(`Order ${orderId} cancelled`, 'warning');
  };

  const modifyCustomerOrder = (orderId: string, updatedItems: { name: string; quantity: number }[]) => {
    setCustomerOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newItems = o.items.map((it) => {
            const match = updatedItems.find((u) => u.name === it.name);
            return match ? { ...it, quantity: match.quantity } : it;
          });
          const newTotal = newItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
          return { ...o, items: newItems, total: Number(newTotal.toFixed(2)) };
        }
        return o;
      })
    );
    triggerToast(`Order ${orderId} quantities updated successfully`, 'success');
  };

  const quickReorder = (orderId: string) => {
    const pastOrder = customerOrders.find((o) => o.id === orderId);
    if (!pastOrder) return;
    const newOrderId = 'ORD-' + Math.floor(9500 + Math.random() * 500);
    const newOrder: CustomerPreOrder = {
      ...pastOrder,
      id: newOrderId,
      status: 'placed',
      orderPlacedAt: 'Just now',
      canModify: true,
      canCancel: true,
      hasFeedback: false,
      pickupSlot: 'Next Saturday • 08:30 AM - 09:30 AM',
      cutoffTime: 'Friday, 08:00 PM',
    };
    setCustomerOrders((prev) => [newOrder, ...prev]);

    // Also inject into vendor orders
    const newVendorOrder: VendorOrder = {
      id: newOrderId,
      customerName: 'Clara Higgins',
      customerPhone: '(555) 312-8874',
      items: pastOrder.items.map((it) => ({
        productId: it.id,
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.price,
        unit: it.unit,
      })),
      totalAmount: pastOrder.total,
      pickupSlot: 'Saturday, 08:30 AM - 09:30 AM',
      cutoffTime: 'Friday, 08:00 PM',
      orderDate: 'Just now',
      status: 'pending',
    };
    setVendorOrders((prev) => [newVendorOrder, ...prev]);

    triggerToast(`Re-ordered successfully! New pre-order: #${newOrderId}`, 'success');
  };

  const toggleSavedMarket = (marketId: string) => {
    triggerToast('Updated market bookmark preference', 'info');
  };

  const toggleFavorite = (favoriteId: string) => {
    setCustomerFavorites((prev) =>
      prev.map((fav) =>
        fav.id === favoriteId ? { ...fav, isRestocked: !fav.isRestocked } : fav
      )
    );
    triggerToast('Updated restock alert notification', 'info');
  };

  const markNotificationRead = (id: string) => {
    setCustomerNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setCustomerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('All notifications marked as read', 'info');
  };

  const submitFeedback = (feedback: OrderFeedback) => {
    setFeedbacks((prev) => [feedback, ...prev]);
    setCustomerOrders((prev) =>
      prev.map((o) => (o.id === feedback.orderId ? { ...o, hasFeedback: true } : o))
    );

    // Also push to vendor reviews
    const newReview: VendorReview = {
      id: 'rev-' + Date.now(),
      customerName: 'Clara Higgins',
      productName: 'Farmers Choice Basket',
      rating: feedback.rating,
      date: 'Today',
      comment: feedback.comment,
      verifiedPurchase: true,
    };
    setVendorReviews((prev) => [newReview, ...prev]);

    triggerToast('Thank you for rating your pickup experience!', 'success');
  };

  return (
    <MarketDataContext.Provider
      value={{
        toastList,
        triggerToast,
        removeToast,
        farmers,
        approveFarmer,
        suspendFarmer,
        customers,
        toggleCustomerStatus,
        markets,
        addMarket,
        updateMarket,
        deleteMarket,
        moderationItems,
        removeModeratedItem,
        dismissModeratedItem,
        categories,
        addCategory,
        announcements,
        broadcastAnnouncement,
        vendorOrders,
        updateVendorOrderStatus,
        vendorProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        stallSettings,
        updateStallSettings,
        vendorReviews,
        replyToReview,
        customerOrders,
        placeNewCustomerOrder,
        advanceOrderDeliveryStep,
        cancelCustomerOrder,
        modifyCustomerOrder,
        quickReorder,
        savedMarkets,
        toggleSavedMarket,
        customerFavorites,
        toggleFavorite,
        customerNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        feedbacks,
        submitFeedback,
        marketStalls,
        getStallsForMarket,
        findStallById,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};
