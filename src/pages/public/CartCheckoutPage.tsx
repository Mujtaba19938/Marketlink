import React, { useState } from 'react';
import { useAppRouter } from '../../routes/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { CustomerPreOrder } from '../../types/customer';
import { PickupCheckoutPanel } from '../../components/customer/PickupCheckoutPanel';
import { formatPrice } from '../../services/mappers';
import { CheckCircle, Clock, LayoutDashboard, MapPin, ShoppingBag, Store } from 'lucide-react';

export const AFTER_LOGIN_KEY = 'marketlink_after_login';

/**
 * Website basket + pickup checkout (dark storefront theme).
 * Orders are saved to MongoDB through POST /api/customer/orders.
 */
export const CartCheckoutPage: React.FC = () => {
  const { navigateWebsite, openLogin, openDashboard } = useAppRouter();
  const { setActiveAuthPortal } = useAuth();
  const [placedOrder, setPlacedOrder] = useState<CustomerPreOrder | null>(null);

  const handleRequireLogin = () => {
    try {
      sessionStorage.setItem(AFTER_LOGIN_KEY, 'cart');
    } catch {
      // ignore
    }
    setActiveAuthPortal('customer');
    openLogin();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button type="button" onClick={() => navigateWebsite('home')} className="hover:text-emerald-400 transition cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button type="button" onClick={() => navigateWebsite('shop')} className="hover:text-emerald-400 transition cursor-pointer">
            Produce Shop
          </button>
          <span>/</span>
          <span className="text-[#def54d] font-bold">{placedOrder ? 'Pre-order confirmed' : 'Basket & pickup'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
          {placedOrder ? 'Your pre-order is reserved' : 'Basket & Pickup Checkout'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {placedOrder
            ? 'The farmer has been notified. You will get a notification when it is accepted and when it is ready.'
            : 'Choose your market, pickup day and time slot. Payment is made in person at pickup.'}
        </p>
      </div>

      {placedOrder ? (
        <div className="max-w-2xl bg-[#0c1b14] border border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-5 text-white text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-[#def54d]" />
            <div>
              <div className="font-mono font-black text-sm text-[#def54d]">Order #{placedOrder.code}</div>
              <div className="text-slate-400">Status: placed • waiting for the farmer to accept</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0e241b] border border-emerald-900/60 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Store className="w-3.5 h-3.5 text-[#def54d]" /> {placedOrder.stallName} {placedOrder.stallNumber && `• ${placedOrder.stallNumber}`}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5" /> {placedOrder.marketName}, {placedOrder.marketAddress}
              </div>
            </div>
            <div className="bg-[#0e241b] border border-emerald-900/60 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-[#def54d]" /> {placedOrder.pickupSlot}
              </div>
              <div className="text-slate-400">Modify or cancel until {placedOrder.cutoffTime}</div>
            </div>
          </div>
          <div className="space-y-1">
            {placedOrder.items.map((it) => (
              <div key={it.orderItemId} className="flex justify-between">
                <span>
                  {it.name} × {it.quantity} {it.unit}
                </span>
                <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-emerald-900/60 text-sm font-black">
              <span>Pay at pickup</span>
              <span className="text-[#def54d]">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openDashboard} className="px-5 py-2.5 rounded-xl bg-[#def54d] text-[#0c1b14] font-black flex items-center gap-2 cursor-pointer">
              <LayoutDashboard className="w-4 h-4" /> Track in my dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setPlacedOrder(null);
                navigateWebsite('shop');
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-emerald-800/40 font-bold flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" /> Keep shopping
            </button>
          </div>
        </div>
      ) : (
        <PickupCheckoutPanel
          variant="dark"
          onPlaced={setPlacedOrder}
          onRequireLogin={handleRequireLogin}
          onBrowse={() => navigateWebsite('shop')}
        />
      )}
    </div>
  );
};
