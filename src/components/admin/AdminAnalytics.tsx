import React from 'react';
import { BarChart3, Award, Star, Building2 } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { Badge } from '../common/Badge';
import { formatPrice } from '../../services/mappers';

/** SRS: platform-wide reports - total orders, revenue summary across markets and the most active farmers */
export const AdminAnalytics: React.FC = () => {
  const { adminOverview } = useMarketData();

  if (!adminOverview) {
    return <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center text-xs text-slate-500">Loading reports…</div>;
  }

  const { ordersByDay, revenueByMarket, topFarmers, revenue, completedOrders, counts } = adminOverview;
  const maxOrders = Math.max(1, ...ordersByDay.map((d) => d.orders));
  const weekOrders = ordersByDay.reduce((s, d) => s + d.orders, 0);
  const weekRevenue = ordersByDay.reduce((s, d) => s + d.revenue, 0);
  const avgBasket = completedOrders ? revenue / completedOrders : 0;
  const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-indigo-500', 'bg-rose-500'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders per day - last 7 days */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Orders - Last 7 Days</h3>
              <p className="text-xs text-slate-500">Pre-orders placed per day across all stalls</p>
            </div>
          </div>

          <div className="pt-2 pb-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-52 px-2">
              {ordersByDay.map((item) => {
                const heightPercent = Math.round((item.orders / maxOrders) * 100);
                return (
                  <div key={item.date} className="flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none mb-1 shadow-lg">
                      {item.orders} orders ({formatPrice(item.revenue)})
                    </div>
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-xl relative overflow-hidden flex items-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-xl transition-all duration-500 bg-gradient-to-t from-emerald-600 to-emerald-400"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-slate-500 block">{item.day}</span>
                      <span className="text-[10px] text-slate-400">{item.orders}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Orders this week</span>
              <span className="font-bold text-slate-800 text-sm">{weekOrders}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">Value this week</span>
              <span className="font-bold text-emerald-600 text-sm">{formatPrice(weekRevenue)}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">All-time orders</span>
              <span className="font-bold text-slate-800 text-sm">{counts.orders}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">Avg completed basket</span>
              <span className="font-bold text-slate-800 text-sm">{formatPrice(avgBasket)}</span>
            </div>
          </div>
        </div>

        {/* Revenue across markets */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Revenue Across Markets</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">Total: {formatPrice(revenue)}</span>
          </div>
          <p className="text-xs text-slate-500 mb-5">Completed (picked up and paid) orders only</p>

          <div className="space-y-4">
            {revenueByMarket.length === 0 && <p className="text-xs text-slate-400">No completed orders yet.</p>}
            {revenueByMarket.map((market, idx) => (
              <div key={market.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate">{market.name}</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(market.revenue)} ({market.share}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${market.share}%` }} className={`h-full rounded-full ${colors[idx % colors.length]}`} />
                </div>
                <div className="text-[10px] text-slate-400">{market.orders} completed orders</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most active farmers */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Most Active Farmers</h3>
            <p className="text-xs text-slate-500">Ranked by number of active and completed orders</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Rank &amp; Stall</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold text-center">Rating</th>
                <th className="pb-3 font-semibold text-center">Orders</th>
                <th className="pb-3 font-semibold text-right">Revenue</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topFarmers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No orders yet.
                  </td>
                </tr>
              )}
              {topFarmers.map((farmer, index) => (
                <tr key={farmer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs bg-slate-100 text-slate-600">#{index + 1}</div>
                      <div className="font-bold text-slate-900">{farmer.stallName}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-600">
                    <span className="truncate max-w-[200px] block">{farmer.location}</span>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {farmer.rating ? farmer.rating.toFixed(1) : '—'}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center font-bold text-slate-800">{farmer.orders}</td>
                  <td className="py-3.5 px-2 text-right font-bold text-emerald-600">{formatPrice(farmer.revenue)}</td>
                  <td className="py-3.5 pl-2 text-center">
                    <Badge variant="success">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
