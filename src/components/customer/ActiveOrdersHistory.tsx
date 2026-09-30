import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { CustomerPreOrder } from '../../types/customer';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { FeedbackRatingModal } from './FeedbackRatingModal';
import { PickupPass } from './PickupPass';
import { formatPrice } from '../../services/mappers';
import {
  Clock,
  CheckCircle2,
  Package,
  Store,
  MapPin,
  RefreshCw,
  Edit3,
  XCircle,
  Star,
  ShoppingBag,
  AlertTriangle,
  Lock,
  ChevronRight,
  Plus,
  QrCode,
} from 'lucide-react';

export const ActiveOrdersHistory: React.FC<{
  onNavigateToMap?: (order: CustomerPreOrder) => void;
  onStartNewOrder?: () => void;
  onOpenCart?: () => void;
}> = ({
  onNavigateToMap,
  onStartNewOrder,
  onOpenCart,
}) => {
  const { customerOrders, cancelCustomerOrder, modifyCustomerOrder, quickReorder } = useMarketData();
  const [saving, setSaving] = useState(false);

  // Modals state
  const [modifyingOrder, setModifyingOrder] = useState<CustomerPreOrder | null>(null);
  const [modifiedQuantities, setModifiedQuantities] = useState<Record<string, number>>({});
  const [ratingOrder, setRatingOrder] = useState<CustomerPreOrder | null>(null);
  const [passOrder, setPassOrder] = useState<CustomerPreOrder | null>(null);

  const activeOrders = customerOrders.filter(
    (o) => o.status === 'placed' || o.status === 'accepted' || o.status === 'ready_for_pickup'
  );
  const pastOrders = customerOrders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled' || o.status === 'declined'
  );

  // quantities are keyed by order item id; 0 removes the line
  const handleOpenModifyModal = (order: CustomerPreOrder) => {
    setModifyingOrder(order);
    const initialMap: Record<string, number> = {};
    order.items.forEach((it) => {
      initialMap[it.orderItemId] = it.quantity;
    });
    setModifiedQuantities(initialMap);
  };

  const handleSaveModifiedOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyingOrder) return;

    const payload = Object.entries(modifiedQuantities).map(([orderItemId, quantity]) => ({ orderItemId, quantity }));
    setSaving(true);
    const ok = await modifyCustomerOrder(modifyingOrder.id, payload);
    setSaving(false);
    if (ok) setModifyingOrder(null);
  };

  const handleCancel = (order: CustomerPreOrder) => {
    if (window.confirm(`Cancel order #${order.code}? The reserved stock goes back to ${order.stallName}.`)) {
      cancelCustomerOrder(order.id, 'Cancelled by customer');
    }
  };

  const handleReorder = async (order: CustomerPreOrder) => {
    if (await quickReorder(order.id)) onOpenCart?.();
  };

  return (
    <div className="space-y-8">
      {/* Active Pre-Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Active Pre-Orders ({activeOrders.length})
            </h3>
            <p className="text-xs text-slate-500">
              Status updates from the farmer appear here automatically
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onStartNewOrder && (
              <button
                type="button"
                onClick={onStartNewOrder}
                className="px-3.5 py-1.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Place New Pre-Order</span>
              </button>
            )}
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pay at pickup
            </span>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No Active Pre-Orders</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You have no upcoming pickups. Browse the produce catalog and place a pre-order.
            </p>
            {onStartNewOrder && (
              <button
                type="button"
                onClick={onStartNewOrder}
                className="px-4 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Browse Produce & Place Pre-Order</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => {
              // Stepper progress index: 0 = placed, 1 = accepted, 2 = ready_for_pickup, 3 = completed
              const stepIndex =
                order.status === 'placed'
                  ? 0
                  : order.status === 'accepted'
                  ? 1
                  : order.status === 'ready_for_pickup'
                  ? 2
                  : 3;

              const isLocked = !order.canModify && !order.canCancel;
              const lockReason = order.status === 'ready_for_pickup' ? 'Packed and waiting for you - changes are closed' : 'Locked: pre-order cutoff time has passed';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5 text-xs"
                >
                  {/* Top Bar: Order ID, Stall & Slot */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          #{order.code}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{order.stallName}</span>
                        {order.stallNumber && (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            {order.stallNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>
                          {order.marketName} • {order.marketAddress}
                        </span>
                        <span>•</span>
                        <span>Placed on {order.orderPlacedAt}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1.5 text-slate-800 font-bold text-xs">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>{order.pickupSlot}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Changes allowed until: {order.cutoffTime}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Step Real-Time State Progress Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {/* Step 1: Placed */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                            stepIndex >= 0
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          ✓
                        </div>
                        <span className="font-bold text-[11px] text-slate-800">Order Placed</span>
                        <span className="text-[10px] text-slate-400">Reserved in basket</span>
                      </div>

                      {/* Step 2: Accepted */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                            stepIndex >= 1
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {stepIndex >= 1 ? '✓' : '2'}
                        </div>
                        <span className="font-bold text-[11px] text-slate-800">Accepted by Farmer</span>
                        <span className="text-[10px] text-slate-400">Harvest assigned</span>
                      </div>

                      {/* Step 3: Ready for Pickup */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                            stepIndex >= 2
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 animate-pulse'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {stepIndex >= 2 ? '✓' : '3'}
                        </div>
                        <span className="font-bold text-[11px] text-slate-800">Ready at Stall!</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Packed & waiting</span>
                      </div>

                      {/* Step 4: Completed */}
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                            stepIndex >= 3
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          4
                        </div>
                        <span className="font-bold text-[11px] text-slate-800">Completed</span>
                        <span className="text-[10px] text-slate-400">Handover done</span>
                      </div>
                    </div>
                  </div>

                  {/* Itemized Produce List */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Included Items ({order.items.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-slate-200 text-slate-800 font-semibold px-2.5 py-1 rounded-lg text-xs"
                          >
                            {it.name} <span className="text-emerald-700 font-bold">({it.quantity} {it.unit})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-slate-400 text-[10px] block">Order Total</span>
                      <span className="text-base font-extrabold text-slate-900">{formatPrice(order.total)}</span>
                      <span className="text-[10px] text-slate-400 block">Pay at pickup</span>
                    </div>
                  </div>

                  {/* Action Buttons: Modify, Cancel, Directions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-medium">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lockReason}</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenModifyModal(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Modify Order</span>
                          </button>

                          <button
                            onClick={() => handleCancel(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Pickup pass: the farmer scans this QR / code at handover */}
                      {order.pickupCode && order.status !== 'placed' && (
                        <button
                          onClick={() => setPassOrder(order)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                            order.status === 'ready_for_pickup' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
                          }`}
                        >
                          <QrCode className={`w-3.5 h-3.5 ${order.status === 'ready_for_pickup' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          <span>Show Pickup QR</span>
                        </button>
                      )}
                      {/* Navigation Trigger Button */}
                      {onNavigateToMap && (
                        <button
                          onClick={() => onNavigateToMap(order)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Navigate to Stall &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order History Table with 1-Click Quick Reorder */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-800">Order History & 1-Click Reorder</h3>
          <p className="text-xs text-slate-500 mt-1">
            Review past market pickups and instantly reserve duplicate harvest baskets with one click.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order Details</th>
                <th className="pb-3 font-semibold">Stall & Market</th>
                <th className="pb-3 font-semibold">Produce Items</th>
                <th className="pb-3 font-semibold text-center">Total</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No past orders yet.
                  </td>
                </tr>
              )}
              {pastOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 pr-3">
                    <span className="font-mono font-bold text-slate-800 block text-xs">#{order.code}</span>
                    <span className="text-[10px] text-slate-400">{order.orderPlacedAt}</span>
                  </td>

                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-900">{order.stallName}</div>
                    <div className="text-[11px] text-slate-500">{order.marketName}</div>
                  </td>

                  <td className="py-4 px-2 max-w-[200px]">
                    <span className="text-slate-700 block truncate">
                      {order.items.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                    </span>
                  </td>

                  <td className="py-4 px-2 text-center font-bold text-slate-900">
                    {formatPrice(order.total)}
                  </td>

                  <td className="py-4 px-2 text-center">
                    {order.status === 'completed' ? (
                      <Badge variant="success">Completed</Badge>
                    ) : order.status === 'declined' ? (
                      <Badge variant="error">Declined</Badge>
                    ) : (
                      <Badge variant="neutral">Cancelled</Badge>
                    )}
                    {order.statusReason && (
                      <span className="block text-[10px] text-slate-400 mt-1 max-w-[140px] mx-auto truncate" title={order.statusReason}>
                        {order.statusReason}
                      </span>
                    )}
                  </td>

                  <td className="py-4 pl-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Feedback Button */}
                      {order.status === 'completed' && !order.hasFeedback && (
                        <button
                          onClick={() => setRatingOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>Rate Pickup</span>
                        </button>
                      )}

                      {order.status === 'completed' && order.hasFeedback && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Rated
                        </span>
                      )}

                      {/* 1-Click Quick Reorder */}
                      <button
                        onClick={() => handleReorder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Quick Reorder</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modify Order Quantities Modal */}
      {modifyingOrder && (
        <Modal
          isOpen={!!modifyingOrder}
          onClose={() => setModifyingOrder(null)}
          title={`Modify Pre-Order #${modifyingOrder.code}`}
          subtitle={`Adjust quantities before cutoff: ${modifyingOrder.cutoffTime}. Set 0 to remove an item.`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveModifiedOrder} className="space-y-4 text-xs">
            <div className="space-y-3">
              {modifyingOrder.items.map((it) => (
                <div
                  key={it.orderItemId}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{it.name}</span>
                    <span className="text-[11px] text-slate-500">{formatPrice(it.price)} / {it.unit}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setModifiedQuantities((prev) => ({
                          ...prev,
                          [it.orderItemId]: Math.max(0, (prev[it.orderItemId] ?? it.quantity) - 1),
                        }))
                      }
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-6 text-center text-slate-900">
                      {modifiedQuantities[it.orderItemId] ?? it.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setModifiedQuantities((prev) => ({
                          ...prev,
                          [it.orderItemId]: (prev[it.orderItemId] ?? it.quantity) + 1,
                        }))
                      }
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModifyingOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Updated Quantities'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Feedback Modal */}
      <Modal isOpen={Boolean(passOrder)} onClose={() => setPassOrder(null)} title={passOrder ? `Pickup pass • #${passOrder.code}` : 'Pickup pass'} maxWidth="sm">
        {passOrder && <PickupPass order={passOrder} />}
      </Modal>

      {ratingOrder && (
        <FeedbackRatingModal
          orderId={ratingOrder.id}
          orderCode={ratingOrder.code}
          farmerName={ratingOrder.stallName}
          onClose={() => setRatingOrder(null)}
        />
      )}
    </div>
  );
};
