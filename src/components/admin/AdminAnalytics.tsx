import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Star,
  DollarSign,
  Calendar,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { Badge } from '../common/Badge';

export const AdminAnalytics: React.FC = () => {
  const { farmers, markets } = useMarketData();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Daily order volume mock distribution
  const orderWeeklyData = [
    { day: 'Mon', orders: 142, revenue: 3410 },
    { day: 'Tue', orders: 188, revenue: 4220 },
    { day: 'Wed', orders: 495, revenue: 11400 }, // Market open day
    { day: 'Thu', orders: 210, revenue: 4890 },
    { day: 'Fri', orders: 620, revenue: 14950 }, // Pre-order cutoff peak
    { day: 'Sat', orders: 940, revenue: 23800 }, // Peak market day
    { day: 'Sun', orders: 810, revenue: 19600 },
  ];

  const maxOrders = Math.max(...orderWeeklyData.map((d) => d.orders));

  // Market revenue breakdown
  const marketRevenueBreakdown = [
    { name: 'Downtown Fresh Pavilion', revenue: 78500, share: 42, activeVendors: 38 },
    { name: 'Sunset Farmers Bazaar', revenue: 46200, share: 25, activeVendors: 26 },
    { name: 'Oakwood Organic Pavilion', revenue: 38100, share: 20, activeVendors: 22 },
    { name: 'Harbor Fresh Wharf', revenue: 21450, share: 13, activeVendors: 19 },
  ];

  // Top farmers sorted by total orders & revenue
  const topFarmers = [...farmers]
    .filter((f) => f.status === 'approved')
    .sort((a, b) => b.totalOrders - a.totalOrders);

  return (
    <div className="space-y-6">
      {/* 2-Column Analytics Overview: Platform Orders & Market Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Platform-wide Orders & Revenue Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Platform Order Volume & Velocity</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Aggregated pre-orders across all regional stalls
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                7-Day Curve
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="pt-2 pb-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-52 px-2">
              {orderWeeklyData.map((item, idx) => {
                const heightPercent = Math.round((item.orders / maxOrders) * 100);
                const isPeak = item.day === 'Sat' || item.day === 'Sun';

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none mb-1 shadow-lg">
                      {item.orders} orders (${item.revenue.toLocaleString()})
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-xl relative overflow-hidden flex items-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-700 group-hover:to-emerald-500'
                            : 'bg-gradient-to-t from-slate-300 to-slate-400 group-hover:from-emerald-400 group-hover:to-emerald-300'
                        }`}
                      />
                    </div>

                    <div className="text-center">
                      <span className={`text-[11px] font-bold ${isPeak ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {item.day}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Weekly Total</span>
                <span className="font-bold text-slate-800 text-sm">3,405 orders</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px]">Gross Revenue</span>
                <span className="font-bold text-emerald-600 text-sm">$82,270</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Basket Size</span>
                <span className="font-bold text-slate-800 text-sm">$24.16</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs prev week</span>
            </div>
          </div>
        </div>

        {/* Right: Aggregate Revenue Across Markets */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Revenue Across Markets</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">Gross: $184.2k</span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Market-level fulfillment volume and vendor stall productivity
            </p>

            {/* Market Progress Bars */}
            <div className="space-y-4">
              {marketRevenueBreakdown.map((market, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">{market.name}</span>
                    <span className="font-semibold text-slate-900">${(market.revenue / 1000).toFixed(1)}k ({market.share}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${market.share}%` }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-emerald-500'
                          : idx === 1
                          ? 'bg-teal-500'
                          : idx === 2
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{market.activeVendors} active stalls</span>
                    <span>98.6% pickup rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">All markets certified operational</span>
            <span className="text-emerald-700 font-bold hover:underline cursor-pointer">
              Export Monthly Ledger &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Top Active Farmers Leaderboard */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Top / Most Active Farmers Leaderboard</h3>
              <p className="text-xs text-slate-500">Ranked by pre-order fulfillment volume, customer satisfaction and sales</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
            Top 5 Certified Bio Producers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Rank & Farm</th>
                <th className="pb-3 font-semibold">Stall Location</th>
                <th className="pb-3 font-semibold text-center">Satisfaction</th>
                <th className="pb-3 font-semibold text-center">Total Orders</th>
                <th className="pb-3 font-semibold text-right">Gross GMV</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topFarmers.map((farmer, index) => (
                <tr key={farmer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                          index === 0
                            ? 'bg-amber-100 text-amber-800'
                            : index === 1
                            ? 'bg-slate-200 text-slate-800'
                            : index === 2
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{farmer.farmName}</div>
                        <div className="text-[11px] text-slate-500">{farmer.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-2 text-slate-600">
                    <span className="truncate max-w-[200px] block">{farmer.location}</span>
                  </td>

                  <td className="py-3.5 px-2 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {farmer.rating.toFixed(1)}
                    </span>
                  </td>

                  <td className="py-3.5 px-2 text-center font-bold text-slate-800">
                    {farmer.totalOrders}
                  </td>

                  <td className="py-3.5 px-2 text-right font-bold text-emerald-600">
                    ${farmer.revenue.toLocaleString()}
                  </td>

                  <td className="py-3.5 pl-2 text-center">
                    <Badge variant="success">Verified Active</Badge>
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
