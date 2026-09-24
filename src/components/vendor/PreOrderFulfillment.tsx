import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { VendorOrder, VendorOrderStatus } from '../../types/vendor';
import { Badge } from '../common/Badge';
import {
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Search,
  Sliders,
  Calendar,
  Phone,
  User,
  ShoppingBag,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';

export const PreOrderFulfillment: React.FC = () => {
  const { vendorOrders, updateVendorOrderStatus, stallSettings, updateStallSettings } = useMarketData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Operating window controls state
  const [cutoffHours, setCutoffHours] = useState(stallSettings.cutoffHoursBeforePickup || 12);
  const [pickupSlots, setPickupSlots] = useState<string[]>([...stallSettings.pickupWindows]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [isWindowSaved, setIsWindowSaved] = useState(false);

  const handleAddSlot = () => {
    if (!newSlotInput.trim() || pickupSlots.includes(newSlotInput.trim())) return;
    setPickupSlots((prev) => [...prev, newSlotInput.trim()]);
    setNewSlotInput('');
  };

  const handleRemoveSlot = (index: number) => {
    setPickupSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveWindows = () => {
    updateStallSettings({
      cutoffHoursBeforePickup: cutoffHours,
      pickupWindows: pickupSlots,
    });
    setIsWindowSaved(true);
    setTimeout(() => setIsWindowSaved(false), 2000);
  };

  const filteredOrders = vendorOrders.filter((order) => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((it) => it.name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Operating Window Controls Accordion / Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Operating Window & Pickup Slot Controls</h3>
              <p className="text-xs text-slate-500">
                Configure order placement cutoff rules and scheduled customer pickup windows.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveWindows}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isWindowSaved ? 'Saved Settings!' : 'Save Window Rules'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 text-xs">
          {/* Cut-off Input */}
          <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
            <label className="block font-bold text-slate-800">Order Cut-off Buffer Time</label>
            <p className="text-slate-500 text-[11px]">
              Lock pre-orders this many hours prior to market pickup so harvest can be prepared:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="48"
                value={cutoffHours}
                onChange={(e) => setCutoffHours(parseInt(e.target.value) || 12)}
                className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="font-semibold text-slate-700">Hours before pickup slot</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              Default: Friday 8:00 PM for Saturday morning pickup
            </span>
          </div>

          {/* Configured Pickup Slots */}
          <div className="md:col-span-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
            <label className="block font-bold text-slate-800">Stall Pickup Time Slots</label>
            <div className="flex flex-wrap gap-2">
              {pickupSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-2 text-xs"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{slot}</span>
                  <button
                    onClick={() => handleRemoveSlot(idx)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Remove Slot"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Slot */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newSlotInput}
                onChange={(e) => setNewSlotInput(e.target.value)}
                placeholder="e.g. 02:00 PM - 03:30 PM"
                className="flex-1 max-w-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={!newSlotInput.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Orders Fulfillment Queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* Queue Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Incoming Pre-Orders Queue</h3>
            <p className="text-xs text-slate-500 mt-1">
              Transition pre-orders through fulfillment states and trigger pickup ready notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID, customer, item..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-52 sm:w-60"
              />
            </div>

            <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'accepted', label: 'Accepted' },
                { id: 'ready_for_pickup', label: 'Ready' },
                { id: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all whitespace-nowrap ${
                    filterStatus === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Cards List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                {/* Left: Customer & Slot Info */}
                <div className="space-y-2 lg:max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded text-xs">
                      #{order.id}
                    </span>
                    {order.status === 'pending' && <Badge variant="warning">Action Needed</Badge>}
                    {order.status === 'accepted' && <Badge variant="info">In Preparation</Badge>}
                    {order.status === 'ready_for_pickup' && <Badge variant="success">Ready at Stall</Badge>}
                    {order.status === 'completed' && <Badge variant="neutral">Completed</Badge>}
                    {order.status === 'declined' && <Badge variant="error">Declined</Badge>}
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
                    <span className="font-semibold text-slate-800">{order.pickupSlot}</span>
                  </div>
                </div>

                {/* Center: Produce Items Breakdown */}
                <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Reserved Produce Basket
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-slate-50 text-slate-800 border border-slate-200/70 px-2 py-1 rounded-lg text-xs font-medium"
                      >
                        <ShoppingBag className="w-3 h-3 text-emerald-600" />
                        <strong className="text-slate-900">{it.name}</strong>
                        <span className="text-slate-500 font-bold">({it.quantity} {it.unit})</span>
                      </span>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="text-[11px] text-amber-700 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-200/50 mt-1">
                      Note from customer: "{order.notes}"
                    </p>
                  )}
                </div>

                {/* Right: Total Price & Status Transition Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Order Total</span>
                    <span className="text-base font-extrabold text-slate-900">${order.totalAmount.toFixed(2)}</span>
                  </div>

                  {/* Status Transition Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateVendorOrderStatus(order.id, 'accepted')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => updateVendorOrderStatus(order.id, 'declined')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateVendorOrderStatus(order.id, 'ready_for_pickup')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer animate-pulse"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Mark as Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'ready_for_pickup' && (
                      <button
                        onClick={() => updateVendorOrderStatus(order.id, 'completed')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Complete Order</span>
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <span className="text-slate-400 font-semibold text-xs italic">
                        Order Fulfilled
                      </span>
                    )}

                    {order.status === 'declined' && (
                      <span className="text-rose-500 font-semibold text-xs italic">
                        Declined
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
