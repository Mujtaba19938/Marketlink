import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { ShoppingBag, Clock, Banknote, Award } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProduceArt } from '../ProduceArt';
import { PRODUCE_TYPES, formatPrice } from '../../services/mappers';

/** SRS: farmers see past sales, best-selling products, total orders, pending orders and a revenue summary */
export const VendorSalesInsights: React.FC = () => {
  const { vendorInsights } = useMarketData();

  if (!vendorInsights) {
    return <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center text-xs text-slate-500">Loading insights…</div>;
  }

  const i = vendorInsights;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Orders"
          value={i.totalOrders}
          subtext={`${i.completedOrders} completed • ${i.cancelledOrders} declined / cancelled`}
          change={`${i.acceptedOrders} in preparation`}
          isPositive={true}
          icon={ShoppingBag}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Pending Pre-Orders"
          value={i.pendingOrders}
          subtext={`${i.readyOrders} packed & ready for pickup`}
          change={i.pendingOrders > 0 ? 'Action required' : 'All clear'}
          isPositive={i.pendingOrders === 0}
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MetricCard
          title="Revenue (completed orders)"
          value={formatPrice(i.revenue)}
          subtext="Paid in person at pickup"
          change={`${i.completedOrders} pickups`}
          isPositive={true}
          icon={Banknote}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Best-Selling Products</h3>
              <p className="text-xs text-slate-500">By quantity reserved (excludes declined / cancelled orders)</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {i.bestSellers.length === 0 && <p className="text-xs text-slate-400 py-4">No sales yet.</p>}
            {i.bestSellers.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80">
                    <ProduceArt type={PRODUCE_TYPES.includes(item.imageType as any) ? (item.imageType as any) : 'cabbage'} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      #{idx + 1} {item.name}
                    </h4>
                    <span className="text-slate-400 text-[11px]">
                      {item.quantity} {item.unit} sold
                    </span>
                  </div>
                </div>
                <div className="font-bold text-slate-900">{formatPrice(item.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-1">Busiest Pickup Slots</h3>
          <p className="text-xs text-slate-500 mb-4">Share of your orders per pickup time</p>

          <div className="space-y-3.5 text-xs">
            {i.slots.length === 0 && <p className="text-slate-400">No orders yet.</p>}
            {i.slots.map((slot) => (
              <div key={slot.label}>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>{slot.label}</span>
                  <span className="font-bold text-emerald-700">
                    {slot.share}% ({slot.count})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${slot.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
