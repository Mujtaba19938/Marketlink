import React, { useEffect, useState } from 'react';
import { CustomerPreOrder } from '../../types/customer';
import { PickupCheckoutPanel } from './PickupCheckoutPanel';
import { formatPrice } from '../../services/mappers';
import { CheckCircle, Clock, MapPin, Store, X } from 'lucide-react';

interface CompleteCustomerFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDashboard?: () => void;
  onRequireLogin?: () => void;
}

/**
 * Dashboard basket + pickup checkout modal (light theme).
 * Same flow as the website cart page: basket -> market / date / slot -> confirmation.
 */
export const CompleteCustomerFlowModal: React.FC<CompleteCustomerFlowModalProps> = ({
  isOpen,
  onClose,
  onNavigateToDashboard,
  onRequireLogin,
}) => {
  const [placedOrder, setPlacedOrder] = useState<CustomerPreOrder | null>(null);

  useEffect(() => {
    if (isOpen) setPlacedOrder(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-800">{placedOrder ? 'Pre-order confirmed' : 'Review basket & choose pickup'}</h3>
            <p className="text-xs text-slate-500">Pay in person at pickup • no delivery • no online payment</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          {placedOrder ? (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-mono font-black text-sm text-slate-900">Order #{placedOrder.code}</div>
                  <div className="text-slate-500">Placed • the farmer has been notified</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Store className="w-3.5 h-3.5 text-emerald-600" /> {placedOrder.stallName} {placedOrder.stallNumber && `• ${placedOrder.stallNumber}`}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> {placedOrder.marketName}, {placedOrder.marketAddress}
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> {placedOrder.pickupSlot}
                </div>
              </div>
              <div className="space-y-1">
                {placedOrder.items.map((it) => (
                  <div key={it.orderItemId} className="flex justify-between text-slate-700">
                    <span>
                      {it.name} × {it.quantity} {it.unit}
                    </span>
                    <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Pay at pickup</span>
                  <span className="text-emerald-700">{formatPrice(placedOrder.total)}</span>
                </div>
              </div>
              <p className="text-slate-500">You can modify or cancel until {placedOrder.cutoffTime}.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToDashboard?.();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  View my orders
                </button>
                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <PickupCheckoutPanel
              variant="light"
              onPlaced={setPlacedOrder}
              onRequireLogin={() => {
                onClose();
                onRequireLogin?.();
              }}
              onBrowse={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
