import React, { useEffect, useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { VendorOrderStatus } from '../../types/vendor';
import { Badge } from '../common/Badge';
import { DAY_CODES, dayCodeToName, formatPrice } from '../../services/mappers';
import { Clock, CheckCircle2, XCircle, PackageCheck, Search, Sliders, Phone, User, ShoppingBag, Plus, Trash2, Save, MapPin, Pause, Play } from 'lucide-react';

/**
 * Farmer pre-order management (SRS 1.6): incoming orders queue with accept / decline / ready / complete,
 * plus per-market cutoff hours and pickup slots (day, time, capacity).
 */
export const PreOrderFulfillment: React.FC = () => {
  const { vendorOrders, updateVendorOrderStatus, assignments, vendorSlots, addSlot, updateSlot, deleteSlot, updateAssignment, stallSettings } =
    useMarketData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const approved = stallSettings.approvalStatus === 'approved';
  const activeAssignments = assignments.filter((a) => a.isActive);
  const [fmId, setFmId] = useState('');
  const assignment = activeAssignments.find((a) => a.id === fmId) || activeAssignments[0];

  const [cutoffHours, setCutoffHours] = useState(12);
  useEffect(() => {
    if (assignment) setCutoffHours(assignment.cutoffHours);
  }, [assignment?.id, assignment?.cutoffHours]);

  const [newSlot, setNewSlot] = useState({ dayOfWeek: '', startTime: '09:00', endTime: '10:00', capacity: 10 });
  useEffect(() => {
    if (assignment && !assignment.operatingDays.includes(newSlot.dayOfWeek)) {
      setNewSlot((s) => ({ ...s, dayOfWeek: assignment.operatingDays[0] || '' }));
    }
  }, [assignment?.id]);

  const slotsForMarket = assignment
    ? vendorSlots
        .filter((s) => s.farmerMarketId === assignment.id)
        .sort((a, b) => DAY_CODES.indexOf(a.dayOfWeek as any) - DAY_CODES.indexOf(b.dayOfWeek as any) || a.startTime.localeCompare(b.startTime))
    : [];

  const handleAddSlot = async () => {
    if (!assignment || !newSlot.dayOfWeek) return;
    await addSlot({ farmerMarketId: assignment.id, ...newSlot, capacity: Number(newSlot.capacity) });
  };

  const handleSaveCutoff = () => {
    if (assignment) updateAssignment(assignment.id, { cutoffHours: Number(cutoffHours) });
  };

  // decline / cancel need a reason (the customer sees it)
  const changeStatus = (orderId: string, status: VendorOrderStatus) => {
    if (status === 'declined' || status === 'cancelled') {
      const reason = window.prompt(status === 'declined' ? 'Reason for declining (shown to the customer):' : 'Reason for cancelling (shown to the customer):');
      if (!reason || !reason.trim()) return;
      updateVendorOrderStatus(orderId, status, reason.trim());
      return;
    }
    updateVendorOrderStatus(orderId, status);
  };

  const filteredOrders = vendorOrders.filter((order) => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      order.code.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.items.some((it) => it.name.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Cutoff + pickup slots */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Order Cutoff &amp; Pickup Slots</h3>
              <p className="text-xs text-slate-500">Customers can only book the slots you create here, up to the slot capacity.</p>
            </div>
          </div>

          {activeAssignments.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={assignment?.id}
                onChange={(e) => setFmId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
              >
                {activeAssignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.marketName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!assignment ? (
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            {approved
              ? 'Add a market in the Stall Profile tab first. Pickup slots belong to a market.'
              : 'Once your stall is approved you can add markets and pickup slots.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 text-xs">
            <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
              <label className="block font-bold text-slate-800">Order cutoff at {assignment.marketName}</label>
              <p className="text-slate-500 text-[11px]">Customers can place, modify or cancel orders until this many hours before their slot starts.</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="72"
                  value={cutoffHours}
                  onChange={(e) => setCutoffHours(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-center text-sm focus:outline-none"
                />
                <span className="font-semibold text-slate-700">hours before pickup</span>
              </div>
              <button
                onClick={handleSaveCutoff}
                disabled={cutoffHours === assignment.cutoffHours}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold disabled:opacity-40 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save cutoff
              </button>
              <p className="text-[10px] text-slate-400">
                Days at this market: {assignment.operatingDays.map((d) => dayCodeToName(d).slice(0, 3)).join(', ')}
              </p>
            </div>

            <div className="md:col-span-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-3">
              <label className="block font-bold text-slate-800">Pickup slots</label>
              <div className="space-y-1.5">
                {slotsForMarket.length === 0 && <p className="text-slate-400">No slots yet - customers can't book this market until you add one.</p>}
                {slotsForMarket.map((slot) => (
                  <div
                    key={slot.id}
                    className={`bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center justify-between gap-2 ${slot.isActive ? '' : 'opacity-50'}`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="w-10">{dayCodeToName(slot.dayOfWeek).slice(0, 3)}</span>
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">cap.</span>
                      <input
                        type="number"
                        min="1"
                        defaultValue={slot.capacity}
                        onBlur={(e) => {
                          const v = parseInt(e.target.value);
                          if (v >= 1 && v !== slot.capacity) updateSlot(slot.id, { capacity: v });
                        }}
                        className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center"
                      />
                      <button
                        onClick={() => updateSlot(slot.id, { isActive: !slot.isActive })}
                        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                        title={slot.isActive ? 'Pause slot' : 'Re-open slot'}
                      >
                        {slot.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => deleteSlot(slot.id)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" title="Remove slot">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                <select
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                  className="px-2 py-1.5 bg-white border border-slate-200 rounded-xl"
                >
                  {assignment.operatingDays.map((d) => (
                    <option key={d} value={d}>
                      {dayCodeToName(d)}
                    </option>
                  ))}
                </select>
                <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} className="px-2 py-1.5 bg-white border border-slate-200 rounded-xl" />
                <span>to</span>
                <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} className="px-2 py-1.5 bg-white border border-slate-200 rounded-xl" />
                <input
                  type="number"
                  min="1"
                  value={newSlot.capacity}
                  onChange={(e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) || 1 })}
                  className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-xl"
                  title="Max orders in this slot"
                />
                <button
                  type="button"
                  onClick={handleAddSlot}
                  disabled={!newSlot.dayOfWeek}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slot</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pre-Orders queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Incoming Pre-Orders</h3>
            <p className="text-xs text-slate-500 mt-1">Accept or decline new orders, then mark them ready and completed at pickup. The customer is notified at each step.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order #, customer, item..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-52 sm:w-60"
              />
            </div>

            <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'New' },
                { id: 'accepted', label: 'Accepted' },
                { id: 'ready_for_pickup', label: 'Ready' },
                { id: 'completed', label: 'Completed' },
                { id: 'declined', label: 'Declined' },
                { id: 'cancelled', label: 'Cancelled' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all whitespace-nowrap ${
                    filterStatus === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'pending' && vendorOrders.some((o) => o.status === 'pending') && (
                    <span className="ml-1 text-emerald-600">({vendorOrders.filter((o) => o.status === 'pending').length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredOrders.length === 0 && <p className="text-center text-xs text-slate-400 py-8">No orders here yet.</p>}
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-2 lg:max-w-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded text-xs">#{order.code}</span>
                  {order.status === 'pending' && <Badge variant="warning">Action Needed</Badge>}
                  {order.status === 'accepted' && <Badge variant="info">In Preparation</Badge>}
                  {order.status === 'ready_for_pickup' && <Badge variant="success">Ready at Stall</Badge>}
                  {order.status === 'completed' && <Badge variant="neutral">Completed</Badge>}
                  {order.status === 'declined' && <Badge variant="error">Declined</Badge>}
                  {order.status === 'cancelled' && <Badge variant="neutral">Cancelled</Badge>}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {order.customerName}
                  </h4>
                  <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {order.customerPhone}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200/70 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {order.pickupSlot} • {order.marketName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">Placed {order.orderDate} • cutoff {order.cutoffTime}</span>
              </div>

              <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reserved items</span>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((it, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-slate-50 text-slate-800 border border-slate-200/70 px-2 py-1 rounded-lg text-xs font-medium">
                      <ShoppingBag className="w-3 h-3 text-emerald-600" />
                      <strong className="text-slate-900">{it.name}</strong>
                      <span className="text-slate-500 font-bold">
                        ({it.quantity} {it.unit})
                      </span>
                    </span>
                  ))}
                </div>
                {order.notes && (
                  <p className="text-[11px] text-amber-700 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-200/50 mt-1">Note from customer: "{order.notes}"</p>
                )}
                {order.statusReason && <p className="text-[11px] text-rose-600 mt-1">Reason: {order.statusReason}</p>}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Collect at pickup</span>
                  <span className="text-base font-extrabold text-slate-900">{formatPrice(order.totalAmount)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => changeStatus(order.id, 'accepted')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => changeStatus(order.id, 'declined')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <>
                      <button
                        onClick={() => changeStatus(order.id, 'ready_for_pickup')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                      <button
                        onClick={() => changeStatus(order.id, 'cancelled')}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <button
                      onClick={() => changeStatus(order.id, 'completed')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Picked up &amp; paid</span>
                    </button>
                  )}

                  {order.status === 'completed' && <span className="text-slate-400 font-semibold text-xs italic">Order fulfilled</span>}
                  {order.status === 'declined' && <span className="text-rose-500 font-semibold text-xs italic">Declined</span>}
                  {order.status === 'cancelled' && <span className="text-slate-400 font-semibold text-xs italic">{order.rawStatus === 'CANCELLED_BY_CUSTOMER' ? 'Cancelled by customer' : 'Cancelled'}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
