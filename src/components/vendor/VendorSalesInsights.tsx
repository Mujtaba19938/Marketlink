import React, { useEffect, useState } from 'react';
import { MetricCard } from '../common/MetricCard';
import { ShoppingBag, Banknote, Award, Users, Star, XCircle, Download, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProduceArt } from '../ProduceArt';
import { PRODUCE_TYPES, formatPrice } from '../../services/mappers';
import { imageUrl } from '../../services/api';
import { VendorInsights } from '../../types/vendor';

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 0, label: 'All time' },
];

const produceType = (t?: string) => (PRODUCE_TYPES.includes(t as any) ? (t as any) : 'cabbage');
const shortDate = (key: string) => new Date(key + 'T00:00:00').toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });

// one CSV cell: quote it and double any quotes inside
const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/**
 * Farmer sales dashboard (SRS: past sales, best sellers, total / pending orders, revenue summary),
 * plus a revenue trend, customer + rating stats, low-stock warnings and a CSV export.
 */
export const VendorSalesInsights: React.FC<{ onManageStock?: () => void }> = ({ onManageStock }) => {
  const { vendorInsights, vendorOrders, loadVendorInsights } = useMarketData();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<VendorInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  // reload when the range changes, and whenever orders change (vendorInsights is refreshed after every order action)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    loadVendorInsights(days)
      .then((res) => alive && setData(res))
      .catch(() => alive && setData(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [days, vendorInsights]);

  const exportCsv = () => {
    const since = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
    const rows = vendorOrders.filter((o) => new Date(o.createdAt).getTime() >= since);
    const header = ['Order', 'Placed', 'Pickup date', 'Pickup slot', 'Market', 'Customer', 'Items', 'Total (PKR)', 'Status', 'Payment'];
    const lines = rows.map((o) =>
      [
        o.code,
        o.orderDate,
        o.pickupDate,
        o.pickupSlot,
        o.marketName,
        o.customerName,
        o.items.map((i) => `${i.name} x${i.quantity} ${i.unit}`).join('; '),
        o.totalAmount,
        o.rawStatus,
        o.rawStatus === 'COMPLETED' ? 'PAID' : 'UNPAID',
      ]
        .map(csvCell)
        .join(',')
    );
    // BOM so Excel opens the file as UTF-8
    const blob = new Blob(['﻿' + [header.map(csvCell).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketlink-orders-${days ? `last-${days}-days` : 'all-time'}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const i = data;
  const points = i?.trend?.points || [];
  const maxRevenue = Math.max(1, ...points.map((p) => p.revenue));
  const labelEvery = Math.ceil(points.length / 7);
  const rating = i?.rating;
  const maxStars = Math.max(1, ...(rating?.distribution || [0]));
  const rangeLabel = RANGES.find((r) => r.days === days)?.label.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Range + export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">Sales Dashboard</h3>
          <p className="text-xs text-slate-500">Orders placed in the selected period. Revenue counts completed pickups only.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  days === r.days ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={exportCsv}
            disabled={vendorOrders.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {!i ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center text-xs text-slate-500">
          {loading ? 'Loading insights…' : 'Could not load insights. Try again in a moment.'}
        </div>
      ) : (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <MetricCard
              title="Revenue"
              value={formatPrice(i.revenue)}
              subtext={`Avg order ${formatPrice(i.averageOrderValue ?? 0)}`}
              change={`${i.completedOrders} pickups`}
              isPositive={true}
              icon={Banknote}
              iconBgColor="bg-sky-50"
              iconColor="text-sky-600"
            />
            <MetricCard
              title="Orders"
              value={i.totalOrders}
              subtext={`${i.pendingOrders} new • ${i.acceptedOrders} preparing • ${i.readyOrders} ready`}
              change={i.pendingOrders > 0 ? 'Action required' : 'All clear'}
              isPositive={i.pendingOrders === 0}
              icon={ShoppingBag}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Customers"
              value={i.customers ?? 0}
              subtext={`${i.repeatCustomers ?? 0} ordered more than once`}
              change={i.customers ? `${Math.round(((i.repeatCustomers ?? 0) / i.customers) * 100)}% repeat` : '—'}
              isPositive={true}
              icon={Users}
              iconBgColor="bg-violet-50"
              iconColor="text-violet-600"
            />
            <MetricCard
              title="Cancellation rate"
              value={`${i.cancellationRate ?? 0}%`}
              subtext={`${i.cancelledOrders} declined / cancelled / expired`}
              change={(i.cancellationRate ?? 0) <= 10 ? 'Healthy' : 'Worth a look'}
              isPositive={(i.cancellationRate ?? 0) <= 10}
              icon={XCircle}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-600"
            />
            <MetricCard
              title="Customer rating"
              value={rating?.count ? `${rating.average.toFixed(1)} / 5` : '—'}
              subtext={rating?.count ? `${rating.count} review${rating.count === 1 ? '' : 's'} ${days ? `in the last ${rangeLabel}` : ''}` : 'No reviews in this period'}
              change={rating?.count ? (rating.average >= 4 ? 'Customers are happy' : 'Room to improve') : '—'}
              isPositive={!rating?.count || rating.average >= 4}
              icon={Star}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-600"
            />
            <MetricCard
              title="Low stock"
              value={i.lowStock?.length ?? 0}
              subtext="Products with 5 or fewer units left"
              change={i.lowStock?.length ? 'Restock soon' : 'Stock looks good'}
              isPositive={!i.lowStock?.length}
              icon={AlertTriangle}
              iconBgColor="bg-orange-50"
              iconColor="text-orange-600"
            />
          </div>

          {/* Revenue trend */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Revenue trend</h3>
                  <p className="text-xs text-slate-500">Completed pickups per {i.trend?.unit === 'day' ? 'day' : 'week'}</p>
                </div>
              </div>
              <div className="text-right text-xs min-h-[34px]">
                {hover !== null && points[hover] ? (
                  <>
                    <span className="block font-extrabold text-slate-900 text-sm">{formatPrice(points[hover].revenue)}</span>
                    <span className="text-slate-500">
                      {i.trend?.unit === 'week' ? 'Week of ' : ''}
                      {shortDate(points[hover].label)} • {points[hover].orders} pickup{points[hover].orders === 1 ? '' : 's'}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">Hover a bar for details</span>
                )}
              </div>
            </div>

            {points.every((p) => p.revenue === 0) ? (
              <p className="text-xs text-slate-400 py-10 text-center">No completed pickups in this period yet.</p>
            ) : (
              <div>
                <div className="flex items-end gap-[3px] h-40" onMouseLeave={() => setHover(null)}>
                  {points.map((p, idx) => (
                    <div
                      key={p.label}
                      onMouseEnter={() => setHover(idx)}
                      onClick={() => setHover(idx)}
                      className="flex-1 h-full flex items-end cursor-pointer"
                      aria-label={`${shortDate(p.label)}: ${formatPrice(p.revenue)}`}
                    >
                      <div
                        className={`w-full rounded-t-md transition-colors ${hover === idx ? 'bg-emerald-600' : 'bg-emerald-400/80'}`}
                        style={{ height: p.revenue ? `${Math.max(4, (p.revenue / maxRevenue) * 100)}%` : '2px', opacity: p.revenue ? 1 : 0.35 }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-[3px] mt-2 text-[10px] text-slate-400">
                  {points.map((p, idx) => (
                    <span key={p.label} className="flex-1 text-center whitespace-nowrap overflow-visible">
                      {idx % labelEvery === 0 ? shortDate(p.label) : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Best sellers */}
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
                {i.bestSellers.length === 0 && <p className="text-xs text-slate-400 py-4">No sales in this period.</p>}
                {i.bestSellers.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80">
                        <ProduceArt type={produceType(item.imageType)} src={imageUrl(item.image)} className="w-full h-full object-cover" />
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

            {/* Ratings breakdown */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 mb-1">Ratings breakdown</h3>
              <p className="text-xs text-slate-500 mb-4">Visible reviews {days ? `from the last ${rangeLabel}` : 'of all time'}</p>
              {!rating?.count ? (
                <p className="text-xs text-slate-400">No reviews in this period. Customers can rate items after a completed pickup.</p>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = rating.distribution[star - 1] || 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-8 font-semibold text-slate-700 flex items-center gap-0.5">
                          {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / maxStars) * 100}%` }} />
                        </div>
                        <span className="w-6 text-right font-bold text-slate-700">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Low stock */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Low stock</h3>
                  <p className="text-xs text-slate-500">Listed products with 5 or fewer units left</p>
                </div>
                {onManageStock && i.lowStock && i.lowStock.length > 0 && (
                  <button onClick={onManageStock} className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer">
                    Update stock &rarr;
                  </button>
                )}
              </div>
              {!i.lowStock?.length ? (
                <p className="text-xs text-slate-400">All listed products have more than 5 units.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {i.lowStock.map((p) => (
                    <div key={p._id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200/80">
                          <ProduceArt type={produceType(p.imageType)} src={imageUrl(p.image)} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-800">{p.name}</span>
                      </div>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${p.quantity === 0 ? 'bg-rose-50 text-rose-700' : 'bg-orange-50 text-orange-700'}`}>
                        {p.quantity === 0 ? 'Sold out' : `${p.quantity} ${p.unit} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Busiest slots */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 mb-1">Busiest Pickup Slots</h3>
              <p className="text-xs text-slate-500 mb-4">Share of your orders per pickup time</p>

              <div className="space-y-3.5 text-xs">
                {i.slots.length === 0 && <p className="text-slate-400">No orders in this period.</p>}
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
      )}
      {loading && i && (
        <div className="fixed bottom-6 right-6 inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl shadow-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating…
        </div>
      )}
    </div>
  );
};
