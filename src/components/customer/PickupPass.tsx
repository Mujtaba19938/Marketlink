import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';
import { CustomerPreOrder } from '../../types/customer';

/**
 * The customer's pickup pass: a QR code plus the 6-digit code. The farmer scans it (or types the digits)
 * before handing the order over, so only the person who placed the order can collect it.
 * QR text format matches the backend: MLPICKUP:<orderId>:<code>
 */
export const PickupPass: React.FC<{ order: CustomerPreOrder }> = ({ order }) => {
  if (!order.pickupCode) return null;
  const digits = `${order.pickupCode.slice(0, 3)} ${order.pickupCode.slice(3)}`;

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <QRCodeSVG value={`MLPICKUP:${order.id}:${order.pickupCode}`} size={208} level="M" marginSize={0} />
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pickup code</span>
        <span className="font-mono text-3xl font-black tracking-[0.2em] text-slate-900">{digits}</span>
      </div>
      <div className="text-xs text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">
          {order.stallName} • {order.marketName}
        </p>
        <p>{order.pickupSlot}</p>
      </div>
      <p className="flex items-start gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/70 rounded-xl px-3 py-2 text-left">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
        Show this at the stall. The farmer scans it (or types the code) before handing over your order. Don't share it with anyone else.
      </p>
    </div>
  );
};
