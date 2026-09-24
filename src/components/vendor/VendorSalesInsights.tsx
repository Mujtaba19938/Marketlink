import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { ShoppingBag, Clock, DollarSign, TrendingUp, Sparkles, Award } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { ProduceArt } from '../ProduceArt';

export const VendorSalesInsights: React.FC = () => {
  const { vendorOrders, vendorProducts } = useMarketData();

  const totalOrdersCount = vendorOrders.length + 280; // Total including historical
  const pendingOrdersCount = vendorOrders.filter((o) => o.status === 'pending').length;
  const readyOrdersCount = vendorOrders.filter((o) => o.status === 'ready_for_pickup').length;
  const totalRevenue = vendorOrders
    .filter((o) => o.status !== 'declined')
    .reduce((sum, o) => sum + o.totalAmount, 0) + 4820; // plus historical base

  // Best selling products mock snapshot
  const bestSellers = [
    { name: 'Savoy Crisp Cabbage', sales: '142 heads', revenue: 681.60, imageType: 'cabbage' as const, growth: '+28%' },
    { name: 'Organic Heirloom Carrots', sales: '230 kg', revenue: 793.50, imageType: 'carrot' as const, growth: '+34%' },
    { name: 'Crown Fresh Broccoli', sales: '115 kg', revenue: 448.50, imageType: 'broccoli' as const, growth: '+15%' },
    { name: 'Tuscan Lacinato Kale', sales: '88 bunches', revenue: 308.00, imageType: 'kale' as const, growth: '+19%' },
  ];

  return (
    <div className="space-y-6">
      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Orders"
          value={totalOrdersCount}
          subtext="284 completed this season"
          change="+18.4%"
          isPositive={true}
          icon={ShoppingBag}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Pending Pre-Orders"
          value={pendingOrdersCount}
          subtext={`${readyOrdersCount} packed & ready for pickup`}
          change={pendingOrdersCount > 0 ? 'Action required' : 'All clear'}
          isPositive={pendingOrdersCount === 0}
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MetricCard
          title="Total Gross Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtext="Direct stall & pre-order earnings"
          change="+14.2% this week"
          isPositive={true}
          icon={DollarSign}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
        />
      </div>

      {/* Best-Selling Products List & Historical Sales Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Best Selling Products */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Best-Selling Harvest Items</h3>
                <p className="text-xs text-slate-500">Highest volume produce reserved through pre-orders</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Autumn Peak
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {bestSellers.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80">
                    <ProduceArt type={item.imageType} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <span className="text-slate-400 text-[11px]">{item.sales} sold</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900">${item.revenue.toFixed(2)}</div>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {item.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Sales Snapshot by Day & Pickup Window */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Peak Pickup Time Slots</h3>
              <span className="text-xs text-slate-500 font-semibold">Saturday Traffic</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Pre-order distribution across configured pickup windows
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>08:00 AM - 09:30 AM (Early Bird)</span>
                  <span className="font-bold text-emerald-700">42% (High)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[42%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>09:30 AM - 11:00 AM (Mid-Morning)</span>
                  <span className="font-bold text-emerald-700">38% (Peak)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[38%] h-full bg-emerald-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>11:00 AM - 12:30 PM (Midday)</span>
                  <span className="font-bold text-slate-600">14%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[14%] h-full bg-slate-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-700">
                  <span>12:30 PM - 02:00 PM (Late Pickup)</span>
                  <span className="font-bold text-slate-600">6%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[6%] h-full bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
            <span>Average fulfillment speed: <strong>4.2 minutes</strong></span>
            <span className="text-emerald-700 font-semibold">99.4% on-time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
