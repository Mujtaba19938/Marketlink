import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { IncomeMetric, NotificationItem, OrderItem } from '../types/market';

interface RightSidebarProps {
  incomeMetrics: IncomeMetric[];
  notifications: NotificationItem[];
  orders: OrderItem[];
  onAcceptOrder: (orderId: string) => void;
}

/**
 * Donut chart glyph for income widget matching the screenshot
 */
const DonutGlyph: React.FC<{ percentage: number }> = ({ percentage }) => {
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
          stroke="#f1f5f9"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Active progress arc */}
        <circle
          cx="14"
          cy="14"
          r={radius}
          stroke="#22c55e"
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

export const RightSidebar: React.FC<RightSidebarProps> = ({
  incomeMetrics,
  notifications,
  orders,
  onAcceptOrder,
}) => {
  const [selectedNotif, setSelectedNotif] = useState<string | null>(null);

  return (
    <div className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0 space-y-5">
      {/* 1. Income Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <h3 className="font-bold text-slate-800 text-base mb-4">
          Income
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {incomeMetrics.map((metric) => (
            <div
              key={metric.period}
              className="bg-white rounded-xl p-3 border border-slate-100/80 shadow-2xs hover:border-emerald-200 transition-all flex flex-col items-center text-center group"
            >
              {/* Pie/Donut Chart */}
              <div className="mb-2">
                <DonutGlyph percentage={metric.percentage} />
              </div>

              {/* Amount */}
              <div className="font-bold text-slate-800 text-[13px] leading-tight tabular-nums group-hover:text-[#22c55e] transition-colors">
                ${metric.amount.toFixed(2)}
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
        </div>

        <div className="divide-y divide-slate-50">
          {notifications.map((item) => {
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
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.time}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Latest Order Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <h3 className="font-bold text-slate-800 text-base mb-3">
          Latest order
        </h3>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 pb-2 border-b border-slate-100">
          <div className="col-span-5">Name</div>
          <div className="col-span-4">Goods</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-50">
          {orders.map((order) => {
            const isAccepted = order.status === 'accepted';

            return (
              <div key={order.id} className="grid grid-cols-12 items-center py-2.5 gap-2">
                {/* Name & Time */}
                <div className="col-span-5 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {order.customerName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {order.time}
                  </div>
                </div>

                {/* Goods */}
                <div className="col-span-4 text-xs font-semibold text-slate-700 truncate">
                  {order.goods}
                </div>

                {/* Status Action */}
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
                      onClick={() => onAcceptOrder(order.id)}
                      className="px-2.5 py-1 bg-[#22c55e] hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg shadow-2xs hover:shadow-xs active:scale-95 transition leading-tight"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
