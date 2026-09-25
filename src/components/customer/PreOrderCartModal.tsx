import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProductItem } from '../../types/market';
import { ProduceArt } from '../ProduceArt';
import { X, Trash2, Calendar, Clock, MapPin, Store, CheckCircle, AlertCircle, ShoppingBag, Plus, Minus } from 'lucide-react';

import { CustomerPreOrder } from '../../types/customer';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface PreOrderCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigateToMap?: () => void;
  onNavigateToOrders?: () => void;
  onOrderSuccessRedirect?: (order: CustomerPreOrder) => void;
}

export const PreOrderCartModal: React.FC<PreOrderCartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToMap,
  onNavigateToOrders,
  onOrderSuccessRedirect,
}) => {
  const { markets, stallSettings, triggerToast, placeNewCustomerOrder } = useMarketData();

  const [selectedMarketId, setSelectedMarketId] = useState('mkt-1');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [pickupSlot, setPickupSlot] = useState('09:30 AM - 11:00 AM');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CustomerPreOrder | null>(null);

  if (!isOpen) return null;

  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = placeNewCustomerOrder({
        marketId: selectedMarketId,
        pickupDate,
        pickupSlot,
        notes: orderNotes,
        items: cartItems.map((ci) => ({
          id: ci.product.id,
          name: ci.product.name,
          price: ci.product.price,
          quantity: ci.quantity,
          unit: 'kg',
        })),
      });

      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setIsSuccess(true);
      onClearCart();
      triggerToast(
        onOrderSuccessRedirect
          ? `Order #${newOrder.id} reserved! Redirecting to Customer Dashboard Login...`
          : `Order #${newOrder.id} reserved! View in Active Orders.`,
        'success'
      );

      // Auto-redirect to customer dashboard login after 1.8s if redirect handler is provided
      if (onOrderSuccessRedirect) {
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          onOrderSuccessRedirect(newOrder);
        }, 1800);
      }
    }, 600);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  const mapProduceType = (cat: string): 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom' => {
    const c = cat.toLowerCase();
    if (['cabbage', 'kale', 'broccoli', 'celery', 'carrot', 'tomato', 'pepper', 'mushroom'].includes(c)) {
      return c as any;
    }
    if (c === 'tubers') return 'carrot';
    if (c === 'fruits') return 'tomato';
    return 'broccoli';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--color-surface-card)] text-[var(--color-text-main)] w-full max-w-xl rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Pre-Order Pickup Basket
              </h3>
              <p className="text-[11px] text-slate-400">
                SRS Specification 1.6: Pre-order against stall stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                  {createdOrder?.id ? `Order #${createdOrder.id}` : 'Order Confirmed'}
                </span>
                <h4 className="text-xl font-bold text-[var(--color-text-main)]">
                  Pre-Order Successfully Reserved!
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {onOrderSuccessRedirect
                    ? `Your harvest allocation has been forwarded to ${stallSettings.stallName}. Redirecting you to Customer Dashboard Log In...`
                    : `Your harvest allocation has been forwarded to ${stallSettings.stallName}. Please show your order reference badge at the stall counter during pickup.`}
                </p>
              </div>

              <div className="bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)] text-xs text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pickup Counter:</span>
                  <span className="font-bold text-[var(--color-primary)]">Stall #14 • North Shed A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Pavilion:</span>
                  <span className="font-bold text-[var(--color-text-main)]">{currentMarket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Date:</span>
                  <span className="font-bold text-[var(--color-text-main)]">{pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Window:</span>
                  <span className="font-bold text-[var(--color-text-main)]">{pickupSlot}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                  <span className="text-slate-400">Total Due at Pickup:</span>
                  <span className="font-black text-base text-[var(--color-primary)]">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Call to Actions: Direct Customer Dashboard Login Navigation & Map Route */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDone();
                    if (onOrderSuccessRedirect && createdOrder) {
                      onOrderSuccessRedirect(createdOrder);
                    } else {
                      onNavigateToOrders?.();
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <span>
                    {onOrderSuccessRedirect
                      ? 'Go to Customer Dashboard Login →'
                      : 'View in Active Orders →'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDone();
                    onNavigateToMap?.();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-[#22c55e]" />
                  <span>Find Stall on Map</span>
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[var(--color-text-main)]">Your basket is empty</h4>
                <p className="text-xs text-slate-400">
                  Select fresh organic produce items from the market catalog to schedule your pickup.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 pb-1">
                  <span>Harvest Items ({cartItems.length})</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl overflow-hidden bg-[var(--color-surface)]">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                          <ProduceArt type={mapProduceType(item.product.category)} className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[var(--color-text-main)] truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            ${item.product.price.toFixed(2)} / {item.product.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 bg-[var(--color-surface-muted)] p-1 rounded-xl border border-[var(--color-border)]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-[var(--color-surface)] flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 rounded-md bg-[var(--color-surface)] flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[var(--color-text-main)] tabular-nums w-14 text-right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Market, Date, and Time Slot Selection (SRS Section 1.6 Requirement) */}
              <div className="bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)] space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-main)]">
                  <Store className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Pickup Stall & Window Selection (SRS)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Farmers Market Location
                    </label>
                    <select
                      value={selectedMarketId}
                      onChange={(e) => setSelectedMarketId(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-main)] focus:outline-none"
                    >
                      {markets.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Designated Stall
                    </label>
                    <div className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {stallSettings.stallName} • Stall #14
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pickup Date</span>
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-main)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pickup Time Window</span>
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-medium text-[var(--color-text-main)] focus:outline-none"
                    >
                      <option value="08:00 AM - 09:30 AM">08:00 AM – 09:30 AM (Early Harvest)</option>
                      <option value="09:30 AM - 11:00 AM">09:30 AM – 11:00 AM (Mid-Morning)</option>
                      <option value="11:00 AM - 12:30 PM">11:00 AM – 12:30 PM (Midday)</option>
                      <option value="12:30 PM - 02:00 PM">12:30 PM – 02:00 PM (Afternoon)</option>
                    </select>
                  </div>
                </div>

                {/* In-Person Payment Clause Notice */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>SRS Policy Notice:</strong> Payment is settled in-person directly at the farmer's stall upon order pickup. No online payment gateways are integrated.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Bar */}
        {!isSuccess && cartItems.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Total Due at Pickup</span>
              <span className="text-xl font-black text-[var(--color-primary)] tabular-nums">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Reserving...' : 'Place Pre-Order (SRS)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
