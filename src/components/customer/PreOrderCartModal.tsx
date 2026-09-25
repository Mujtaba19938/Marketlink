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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0b1a13] text-white w-full max-w-xl rounded-[32px] border border-emerald-900/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#0e241b]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#def54d] text-[#0c1b14] flex items-center justify-center shadow-xs font-bold">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-['Outfit',sans-serif]">
                Pre-Order Pickup Basket
              </h3>
              <p className="text-[11px] text-slate-400">
                SRS Specification 1.6: Pre-order against stall stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#132c20] text-[#def54d] border border-emerald-800/80 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#132c20] text-[#def54d] font-mono font-bold text-xs border border-emerald-800/80">
                  {createdOrder?.id ? `Order #${createdOrder.id}` : 'Order Confirmed'}
                </span>
                <h4 className="text-2xl font-black text-white font-['Outfit',sans-serif]">
                  Pre-Order Successfully Reserved!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  {onOrderSuccessRedirect
                    ? `Your harvest allocation has been forwarded to ${stallSettings.stallName}. Redirecting you to Customer Dashboard Log In...`
                    : `Your harvest allocation has been forwarded to ${stallSettings.stallName}. Please show your order reference badge at the stall counter during pickup.`}
                </p>
              </div>

              <div className="bg-[#0e241b] p-5 rounded-2xl border border-emerald-900/60 text-xs text-left max-w-sm mx-auto space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pickup Counter:</span>
                  <span className="font-bold text-[#def54d]">Stall #14 • North Shed A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Pavilion:</span>
                  <span className="font-bold text-white">{currentMarket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Date:</span>
                  <span className="font-bold text-white">{pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Window:</span>
                  <span className="font-bold text-white">{pickupSlot}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-900/60 pt-2.5">
                  <span className="text-slate-400">Total Due at Pickup:</span>
                  <span className="font-black text-lg text-[#def54d] font-['Outfit',sans-serif]">${subtotal.toFixed(2)}</span>
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
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] text-xs font-black rounded-full shadow-lg cursor-pointer flex items-center justify-center gap-2 transition active:scale-95 font-['Outfit',sans-serif]"
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
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#132c20] hover:bg-[#1a382a] text-slate-200 hover:text-white border border-emerald-800/80 text-xs font-bold rounded-full transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-[#def54d]" />
                  <span>Find Stall on Map</span>
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0e241b] text-[#def54d] border border-emerald-900/60 flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white font-['Outfit',sans-serif]">Your basket is empty</h4>
                <p className="text-xs text-slate-400">
                  Select fresh organic produce items from the market catalog to schedule your pickup.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-1 font-['Outfit',sans-serif]">
                  <span>Harvest Items ({cartItems.length})</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-emerald-900/60 border border-emerald-900/60 rounded-2xl overflow-hidden bg-[#0e241b]">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#132c20] flex items-center justify-center shrink-0 border border-emerald-800/60">
                          <ProduceArt type={mapProduceType(item.product.category)} className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate font-['Outfit',sans-serif]">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            ${item.product.price.toFixed(2)} / {item.product.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 bg-[#132c20] p-1 rounded-xl border border-emerald-800/70">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-[#0e241b] flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 rounded-md bg-[#0e241b] flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#def54d] tabular-nums w-14 text-right font-['Outfit',sans-serif]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Market, Date, and Time Slot Selection (SRS Section 1.6 Requirement) */}
              <div className="bg-[#0e241b] p-4 rounded-2xl border border-emerald-900/60 space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-white font-['Outfit',sans-serif]">
                  <Store className="w-4 h-4 text-[#def54d]" />
                  <span>Pickup Stall &amp; Window Selection (SRS)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 font-['Outfit',sans-serif]">
                      Farmers Market Location
                    </label>
                    <select
                      value={selectedMarketId}
                      onChange={(e) => setSelectedMarketId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30"
                    >
                      {markets.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#0b1a13] text-white">
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 font-['Outfit',sans-serif]">
                      Designated Stall
                    </label>
                    <div className="px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-semibold text-slate-200">
                      {stallSettings.stallName} • Stall #14
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1 font-['Outfit',sans-serif]">
                      <Calendar className="w-3.5 h-3.5 text-[#def54d]" />
                      <span>Pickup Date</span>
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1 font-['Outfit',sans-serif]">
                      <Clock className="w-3.5 h-3.5 text-[#def54d]" />
                      <span>Pickup Time Window</span>
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-[#132c20] border border-emerald-800/80 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#def54d]/30"
                    >
                      <option value="08:00 AM - 09:30 AM" className="bg-[#0b1a13] text-white">08:00 AM – 09:30 AM (Early Harvest)</option>
                      <option value="09:30 AM - 11:00 AM" className="bg-[#0b1a13] text-white">09:30 AM – 11:00 AM (Mid-Morning)</option>
                      <option value="11:00 AM - 12:30 PM" className="bg-[#0b1a13] text-white">11:00 AM – 12:30 PM (Midday)</option>
                      <option value="12:30 PM - 02:00 PM" className="bg-[#0b1a13] text-white">12:30 PM – 02:00 PM (Afternoon)</option>
                    </select>
                  </div>
                </div>

                {/* In-Person Payment Clause Notice */}
                <div className="p-3 bg-[#132c20] border border-emerald-800/80 rounded-xl flex items-start gap-2.5 text-[11px] text-emerald-200">
                  <AlertCircle className="w-4 h-4 text-[#def54d] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#def54d]">SRS Policy Notice:</strong> Payment is settled in-person directly at the farmer&apos;s stall upon order pickup. No online payment gateways are integrated.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Bar */}
        {!isSuccess && cartItems.length > 0 && (
          <div className="px-6 py-4 border-t border-emerald-900/60 bg-[#0e241b]/70 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Total Due at Pickup</span>
              <span className="text-xl font-black text-[#def54d] tabular-nums font-['Outfit',sans-serif]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-emerald-800/80 bg-[#132c20] hover:bg-[#1a382a] text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer active:scale-95"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14] text-xs font-black rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition active:scale-95 disabled:opacity-50 font-['Outfit',sans-serif]"
              >
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Reserving...' : 'Place Pre-Order (SRS)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
