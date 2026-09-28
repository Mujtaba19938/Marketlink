import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketData } from '../../context/MarketDataContext';
import { ChevronRight, Check, Package, TrendingUp, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../services/mappers';

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
    approveFarmer,
    adminOverview,
    vendorInsights,
  } = useMarketData();

  const [selectedNotif, setSelectedNotif] = useState<string | null>(null);

  // three live figures per role, each with a share (0-100) for the donut
  const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
  const pendingFarmers = farmers.filter((f) => f.status === 'pending');

  const currentMetrics: { period: string; display: string; percentage: number }[] =
    currentRole === 'admin'
      ? [
          { period: 'Orders', display: String(adminOverview?.counts.orders ?? 0), percentage: pct(adminOverview?.completedOrders ?? 0, adminOverview?.counts.orders ?? 0) },
          { period: 'Revenue', display: formatPrice(adminOverview?.revenue ?? 0), percentage: 100 },
          { period: 'Pending', display: String(pendingFarmers.length), percentage: pct(pendingFarmers.length, farmers.length) },
        ]
      : currentRole === 'customer'
      ? (() => {
          const active = customerOrders.filter((o) => ['placed', 'accepted', 'ready_for_pickup'].includes(o.status));
          return [
            { period: 'Placed', display: String(active.filter((o) => o.status === 'placed').length), percentage: pct(active.filter((o) => o.status === 'placed').length, active.length) },
            { period: 'Accepted', display: String(active.filter((o) => o.status === 'accepted').length), percentage: pct(active.filter((o) => o.status === 'accepted').length, active.length) },
            { period: 'Ready', display: String(active.filter((o) => o.status === 'ready_for_pickup').length), percentage: pct(active.filter((o) => o.status === 'ready_for_pickup').length, active.length) },
          ];
        })()
      : [
          { period: 'New', display: String(vendorInsights?.pendingOrders ?? 0), percentage: pct(vendorInsights?.pendingOrders ?? 0, vendorInsights?.totalOrders ?? 0) },
          { period: 'Ready', display: String(vendorInsights?.readyOrders ?? 0), percentage: pct(vendorInsights?.readyOrders ?? 0, vendorInsights?.totalOrders ?? 0) },
          { period: 'Revenue', display: formatPrice(vendorInsights?.revenue ?? 0), percentage: pct(vendorInsights?.completedOrders ?? 0, vendorInsights?.totalOrders ?? 0) },
        ];

  const metricHeaderTitle = currentRole === 'admin' ? 'Platform' : currentRole === 'customer' ? 'Active Pre-Orders' : 'Orders & Income';

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
                {metric.display}
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
            {customerNotifications.filter((n) => !n.read).length} unread
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {currentRole === 'admin' ? (
            <>
              <div className="py-3 -mx-2 px-2">
                <p className="text-xs font-semibold text-slate-700 leading-snug">{pendingFarmers.length} farmer registration(s) waiting for approval</p>
              </div>
              <div className="py-3 -mx-2 px-2">
                <p className="text-xs font-semibold text-slate-700 leading-snug">{moderationItems.length} listing(s) / review(s) to moderate</p>
              </div>
            </>          ) : (
            customerNotifications.length === 0 ? (
              <p className="py-3 text-xs text-slate-400">No notifications yet.</p>
            ) : customerNotifications.slice(0, 4).map((item) => {
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
          {currentRole === 'customer' ? 'My Recent Orders' : currentRole === 'admin' ? 'Pending Farmer Approvals' : 'Latest orders'}
        </h3>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
          <div className="col-span-5">{currentRole === 'customer' ? 'Stall' : currentRole === 'admin' ? 'Stall' : 'Name'}</div>
          <div className="col-span-4">{currentRole === 'admin' ? 'Contact' : 'Goods'}</div>
          <div className="col-span-3 text-right">{currentRole === 'admin' ? 'Action' : 'Status'}</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-50">
          {currentRole === 'admin' ? (
            pendingFarmers.length === 0 ? (
              <p className="py-3 text-xs text-slate-400">No registrations waiting.</p>
            ) : (
              pendingFarmers.slice(0, 4).map((f) => (
                <div key={f.id} className="grid grid-cols-12 items-center py-2.5 gap-2">
                  <div className="col-span-5 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate leading-tight">{f.farmName}</div>
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{f.joinDate}</div>
                  </div>
                  <div className="col-span-4 text-xs font-semibold text-slate-700 truncate">{f.name}</div>
                  <div className="col-span-3 flex justify-end">
                    <button
                      onClick={() => approveFarmer(f.id)}
                      className="px-2.5 py-1 bg-[#22c55e] hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )
          ) : currentRole === 'customer' ? (
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
                      #{order.code}
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
                    ) : isPlaced || order.status === 'accepted' ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-lg text-center capitalize">
                        {order.status}
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
              const isPending = order.status === 'pending';

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
                    {!isPending ? (
                      <span className="px-2.5 py-1 bg-[#ecfbf2] text-[#22c55e] border border-emerald-100 text-[11px] font-semibold rounded-lg leading-tight capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </span>
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
