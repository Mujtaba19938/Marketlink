import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import { ChevronRight, Check, Package, TrendingUp, RefreshCw } from 'lucide-react';

/**
 * Donut chart glyph for metrics matching screenshot
 */
const DonutGlyph: React.FC<{ percentage: number; color?: string }> = ({
  percentage,
  color,
}) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 28 28">
        {/* Background track */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          stroke="var(--color-chart-track, #f1f5f9)"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Active progress arc */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          stroke={color || 'var(--color-primary, #22c55e)'}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export const RightSidePanel: React.FC = () => {
  const { currentRole } = useAuth();
  const {
    vendorOrders,
    updateVendorOrderStatus,
    customerOrders,
    quickReorder,
    customerNotifications,
    moderationItems,
    farmers,
  } = useMarketData();

  const [selectedNotif, setSelectedNotif] = useState<string | null>(null);

  // Vendor Metrics matching screenshot
  const vendorIncomeMetrics = [
    { period: 'Daily', amount: 129.80, percentage: 30 },
    { period: 'Weekly', amount: 347.62, percentage: 55 },
    { period: 'Monthly', amount: 897.66, percentage: 80 },
  ];

  // Admin Metrics matching screenshot style
  const adminRevenueMetrics = [
    { period: 'Daily', amount: 4210.00, percentage: 40 },
    { period: 'Weekly', amount: 28450.00, percentage: 65 },
    { period: 'Monthly', amount: 184250.00, percentage: 90 },
  ];

  // Customer Status Metrics
  const customerMetrics = [
    { period: 'Placed', amount: 23.45, percentage: 35 },
    { period: 'In-Prep', amount: 48.90, percentage: 60 },
    { period: 'Ready', amount: 26.25, percentage: 100 },
  ];

  const currentMetrics =
    currentRole === 'admin'
      ? adminRevenueMetrics
      : currentRole === 'customer'
      ? customerMetrics
      : vendorIncomeMetrics;

  const metricHeaderTitle =
    currentRole === 'admin'
      ? 'Platform Gross'
      : currentRole === 'customer'
      ? 'Active Pre-Orders'
      : 'Income';

  return (
    <div className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0 space-y-5">
      {/* 1. Income / Financial Metric Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <h3 className="font-bold text-slate-800 text-base mb-4">
          {metricHeaderTitle}
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {currentMetrics.map((metric) => (
            <div
              key={metric.period}
              className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/60 shadow-2xs hover:border-emerald-400 transition-all flex flex-col items-center text-center group"
            >
              {/* Pie/Donut Chart */}
              <div className="mb-2">
                <DonutGlyph percentage={metric.percentage} />
              </div>

              {/* Amount */}
              <div className="font-bold text-slate-800 text-[13px] leading-tight tabular-nums group-hover:text-[#22c55e] transition-colors">
                ${metric.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              {/* Label */}
              <div className="text-slate-400 text-[11px] font-medium mt-0.5">
                {metric.period}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Notification Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-base">
            Notification
          </h3>
          <span className="text-[10px] text-[#22c55e] font-bold bg-[#ecfbf2] border border-emerald-200/60 px-2 py-0.5 rounded-full">
            Real-time
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {currentRole === 'admin' ? (
            <>
              <div className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-1">
                    {farmers.filter((f) => f.status === 'pending').length} farmers pending license approval
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Today, 09.30 AM</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
              </div>
              <div className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-1">
                    {moderationItems.length} flagged listings require moderation
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Wed, 15 May, 09.00 AM</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
              </div>
            </>
          ) : (
            customerNotifications.slice(0, 4).map((item) => {
              const isExpanded = selectedNotif === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNotif(isExpanded ? null : item.id)}
                  className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">{item.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Latest Order Card matching screenshot */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <h3 className="font-bold text-slate-800 text-base mb-3">
          {currentRole === 'customer' ? 'My Recent Orders' : 'Latest order'}
        </h3>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
          <div className="col-span-5">{currentRole === 'customer' ? 'Stall' : 'Name'}</div>
          <div className="col-span-4">Goods</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-50">
          {currentRole === 'customer' ? (
            customerOrders.slice(0, 4).map((order) => {
              const isReady = order.status === 'ready_for_pickup';
              const isPlaced = order.status === 'placed';

              return (
                <div key={order.id} className="grid grid-cols-12 items-center py-2.5 gap-2">
                  <div className="col-span-5 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                      {order.stallName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      #{order.id}
                    </div>
                  </div>

                  <div className="col-span-4 text-xs font-semibold text-slate-700 truncate">
                    {order.items[0]?.name || 'Produce'} ({order.items.length})
                  </div>

                  <div className="col-span-3 flex justify-end">
                    {isReady ? (
                      <span className="px-2 py-0.5 bg-[#ecfbf2] text-[#22c55e] border border-emerald-100 text-[10px] font-bold rounded-lg text-center">
                        Ready
                      </span>
                    ) : isPlaced ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-lg text-center">
                        Placed
                      </span>
                    ) : (
                      <button
                        onClick={() => quickReorder(order.id)}
                        className="px-2 py-0.5 bg-[#22c55e] hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition"
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            vendorOrders.slice(0, 4).map((order) => {
              const isAccepted = order.status === 'accepted' || order.status === 'ready_for_pickup' || order.status === 'completed';

              return (
                <div key={order.id} className="grid grid-cols-12 items-center py-2.5 gap-2">
                  {/* Name & Time */}
                  <div className="col-span-5 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                      {order.customerName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      {order.orderDate}
                    </div>
                  </div>

                  {/* Goods */}
                  <div className="col-span-4 text-xs font-semibold text-slate-700 truncate">
                    {order.items[0]?.name} ({order.items[0]?.quantity})
                  </div>

                  {/* Status Action Button */}
                  <div className="col-span-3 flex justify-end">
                    {isAccepted ? (
                      <button
                        disabled
                        className="px-2.5 py-1 bg-[#ecfbf2] text-[#22c55e] border border-emerald-100 text-[11px] font-semibold rounded-lg leading-tight cursor-default"
                      >
                        Accepted
                      </button>
                    ) : (
                      <button
                        onClick={() => updateVendorOrderStatus(order.id, 'accepted')}
                        className="px-2.5 py-1 bg-[#22c55e] hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg shadow-2xs hover:shadow-xs active:scale-95 transition leading-tight cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
