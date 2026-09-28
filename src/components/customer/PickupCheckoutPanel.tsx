import React, { useEffect, useMemo, useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAuth } from '../../context/AuthContext';
import { CustomerPreOrder, PickupSlotOption } from '../../types/customer';
import { ProduceArt } from '../ProduceArt';
import { DAY_CODES, dayCodeToName, formatPrice, toDateKey } from '../../services/mappers';
import { AlertCircle, Calendar, Clock, LogIn, MapPin, Minus, Plus, ShoppingBag, Store, Trash2 } from 'lucide-react';

interface PickupCheckoutPanelProps {
  variant?: 'dark' | 'light';
  onPlaced: (order: CustomerPreOrder) => void;
  onRequireLogin: () => void;
  onBrowse?: () => void;
}

const THEMES = {
  dark: {
    card: 'bg-[#0c1b14] border border-emerald-900/60 text-white',
    inner: 'bg-[#0e241b] border border-emerald-900/60',
    muted: 'text-slate-400',
    strong: 'text-white',
    input: 'bg-[#132c20] border border-emerald-800/80 text-white focus:border-[#def54d]',
    accent: 'bg-[#def54d] hover:bg-[#e8fa79] text-[#0c1b14]',
    chip: 'bg-[#132c20] border-emerald-800/80 text-slate-200',
    chipActive: 'bg-[#def54d] border-[#def54d] text-[#0c1b14]',
    price: 'text-[#def54d]',
  },
  light: {
    card: 'bg-white border border-slate-200 text-slate-800',
    inner: 'bg-slate-50 border border-slate-200',
    muted: 'text-slate-500',
    strong: 'text-slate-900',
    input: 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-emerald-500',
    accent: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    chip: 'bg-white border-slate-200 text-slate-700',
    chipActive: 'bg-emerald-600 border-emerald-600 text-white',
    price: 'text-emerald-700',
  },
};

/**
 * Cart + pickup checkout (SRS 1.6 "Place Pre-Orders for Pickup").
 * Pay at pickup only - no payment gateway, no delivery.
 */
export const PickupCheckoutPanel: React.FC<PickupCheckoutPanelProps> = ({ variant = 'light', onPlaced, onRequireLogin, onBrowse }) => {
  const t = THEMES[variant];
  const { isAuthenticated, currentRole } = useAuth();
  const { cartItems, updateCartQuantity, removeCartItem, clearCart, directory, getPickupSlots, placeOrder } = useMarketData();

  const farmerId = cartItems[0]?.product.farmerId;
  const farmer = directory.find((f) => f._id === farmerId);
  const assignments = farmer?.markets || [];

  const [assignmentId, setAssignmentId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<PickupSlotOption[]>([]);
  const [slotId, setSlotId] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const assignment = assignments.find((a) => a._id === assignmentId);

  // default to the farmer's first market
  useEffect(() => {
    if (!assignments.some((a) => a._id === assignmentId)) setAssignmentId(assignments[0]?._id || '');
  }, [assignments, assignmentId]);

  // next 14 days on which the farmer is at the selected market
  const dateOptions = useMemo(() => {
    if (!assignment) return [];
    const out: { key: string; label: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const code = DAY_CODES[(d.getDay() + 6) % 7];
      if (assignment.operatingDays.includes(code)) {
        out.push({ key: toDateKey(d), label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) });
      }
    }
    return out;
  }, [assignment]);

  useEffect(() => {
    if (!dateOptions.some((d) => d.key === date)) setDate(dateOptions[0]?.key || '');
  }, [dateOptions, date]);

  // live slot availability for the chosen date
  useEffect(() => {
    let cancelled = false;
    setSlots([]);
    setSlotId('');
    if (!assignmentId || !date) return;
    setLoadingSlots(true);
    getPickupSlots(assignmentId, date).then((list) => {
      if (cancelled) return;
      setSlots(list);
      const first = list.find((s) => s.remaining > 0 && !s.cutoffPassed);
      setSlotId(first?.id || '');
      setLoadingSlots(false);
    });
    return () => {
      cancelled = true;
    };
  }, [assignmentId, date, getPickupSlots]);

  const subtotal = cartItems.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const isCustomer = isAuthenticated && currentRole === 'customer';

  const handlePlace = async () => {
    if (!assignmentId || !date || !slotId) return;
    setSubmitting(true);
    const order = await placeOrder({ farmerMarketId: assignmentId, pickupSlotId: slotId, pickupDate: date, notes: notes.trim() || undefined });
    setSubmitting(false);
    if (order) {
      setNotes('');
      onPlaced(order);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={`${t.card} rounded-3xl p-10 text-center space-y-4`}>
        <ShoppingBag className={`w-10 h-10 mx-auto ${t.muted}`} />
        <h3 className={`text-lg font-bold ${t.strong}`}>Your basket is empty</h3>
        <p className={`text-xs ${t.muted}`}>Add fresh produce from a farmer's stall, then choose a pickup slot.</p>
        {onBrowse && (
          <button type="button" onClick={onBrowse} className={`px-5 py-2.5 rounded-xl text-xs font-bold ${t.accent} cursor-pointer`}>
            Browse produce
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
      {/* Basket */}
      <div className={`lg:col-span-7 ${t.card} rounded-3xl p-5 sm:p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold ${t.strong}`}>Your basket</h3>
            <p className={t.muted}>
              From <strong className={t.strong}>{cartItems[0].product.farmName || farmer?.stallName || 'farmer stall'}</strong> • one stall per pre-order
            </p>
          </div>
          <button type="button" onClick={() => clearCart()} className="text-rose-500 hover:underline font-semibold cursor-pointer">
            Clear basket
          </button>
        </div>

        <div className="space-y-2.5">
          {cartItems.map((line) => (
            <div key={line.product.id} className={`${t.inner} rounded-2xl p-3 flex items-center gap-3`}>
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <ProduceArt type={line.product.imageType} src={line.product.imageUrl} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold truncate ${t.strong}`}>{line.product.name}</div>
                <div className={t.muted}>
                  {formatPrice(line.product.price)} / {line.product.unit} • {line.product.stock} left
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => updateCartQuantity(line.product.id, line.quantity - 1)} className={`w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer ${t.chip}`}>
                  <Minus className="w-3 h-3" />
                </button>
                <span className={`w-8 text-center font-bold ${t.strong}`}>{line.quantity}</span>
                <button
                  type="button"
                  disabled={line.quantity >= line.product.stock}
                  onClick={() => updateCartQuantity(line.product.id, line.quantity + 1)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer disabled:opacity-40 ${t.chip}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className={`w-20 text-right font-bold ${t.strong}`}>{formatPrice(line.product.price * line.quantity)}</div>
              <button type="button" onClick={() => removeCartItem(line.product.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer" title="Remove">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className={`flex items-center justify-between pt-3 border-t ${variant === 'dark' ? 'border-emerald-900/60' : 'border-slate-200'}`}>
          <span className={t.muted}>Total (pay in person at pickup)</span>
          <span className={`text-xl font-black ${t.price}`}>{formatPrice(subtotal)}</span>
        </div>
      </div>

      {/* Pickup details */}
      <div className={`lg:col-span-5 ${t.card} rounded-3xl p-5 sm:p-6 space-y-4`}>
        <h3 className={`text-base font-bold ${t.strong}`}>Pickup details</h3>

        {!farmer || assignments.length === 0 ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>This farmer has no active market schedule yet, so pre-orders can't be placed right now.</span>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <label className={`font-bold flex items-center gap-1.5 ${t.strong}`}>
                <MapPin className="w-3.5 h-3.5" /> Market
              </label>
              <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} className={`w-full px-3 py-2 rounded-xl focus:outline-none ${t.input}`}>
                {assignments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.market.name} {a.stallNumber ? `(${a.stallNumber})` : ''}
                  </option>
                ))}
              </select>
              {assignment && (
                <p className={t.muted}>
                  {assignment.market.address} • {assignment.operatingDays.map((d) => dayCodeToName(d).slice(0, 3)).join(', ')} • orders close {assignment.cutoffHours}h before pickup
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={`font-bold flex items-center gap-1.5 ${t.strong}`}>
                <Calendar className="w-3.5 h-3.5" /> Pickup date
              </label>
              {dateOptions.length === 0 ? (
                <p className={t.muted}>No market days in the next two weeks.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {dateOptions.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDate(d.key)}
                      className={`px-3 py-1.5 rounded-xl border font-bold cursor-pointer ${date === d.key ? t.chipActive : t.chip}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={`font-bold flex items-center gap-1.5 ${t.strong}`}>
                <Clock className="w-3.5 h-3.5" /> Time slot
              </label>
              {loadingSlots ? (
                <p className={t.muted}>Checking availability…</p>
              ) : slots.length === 0 ? (
                <p className={t.muted}>The farmer has no pickup slots on this day.</p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {slots.map((s) => {
                    const disabled = s.remaining <= 0 || s.cutoffPassed;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSlotId(s.id)}
                        className={`px-3 py-2 rounded-xl border text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${slotId === s.id ? t.chipActive : t.chip}`}
                      >
                        <div className="font-bold">
                          {s.startTime} - {s.endTime}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {s.cutoffPassed ? 'Cutoff passed' : s.remaining <= 0 ? 'Full' : `${s.remaining} of ${s.capacity} spots left`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={`font-bold ${t.strong}`}>Note for the farmer (optional)</label>
              <textarea
                rows={2}
                value={notes}
                maxLength={500}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. please pack the tomatoes separately"
                className={`w-full px-3 py-2 rounded-xl resize-none focus:outline-none ${t.input}`}
              />
            </div>
          </>
        )}

        <div className={`${t.inner} rounded-2xl p-3 flex items-start gap-2`}>
          <Store className={`w-4 h-4 shrink-0 ${t.price}`} />
          <p className={t.muted}>
            No online payment. Pay the farmer in person when you collect your order. You can modify or cancel until the cutoff time.
          </p>
        </div>

        {isCustomer ? (
          <button
            type="button"
            onClick={handlePlace}
            disabled={submitting || !slotId || !date}
            className={`w-full py-3 rounded-xl font-black text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${t.accent}`}
          >
            {submitting ? 'Placing pre-order…' : `Place pre-order • ${formatPrice(subtotal)}`}
          </button>
        ) : isAuthenticated ? (
          <p className="text-rose-500 font-semibold">Only customer accounts can place pre-orders. Sign out and use a customer account.</p>
        ) : (
          <button type="button" onClick={onRequireLogin} className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer ${t.accent}`}>
            <LogIn className="w-4 h-4" />
            Sign in or register to place your pre-order
          </button>
        )}
      </div>
    </div>
  );
};
