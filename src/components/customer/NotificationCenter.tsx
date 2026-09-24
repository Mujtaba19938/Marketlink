import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import {
  Bell,
  CheckCircle2,
  Package,
  Sparkles,
  Clock,
  Check,
  Megaphone,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { customerNotifications, markNotificationRead, markAllNotificationsRead } = useMarketData();

  const unreadCount = customerNotifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Notification Center</h3>
            {unreadCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with real-time pre-order packaging statuses, restock alerts, and pavilion notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {customerNotifications.map((notif) => {
          return (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 text-xs ${
                notif.read
                  ? 'bg-white border-slate-100 opacity-80'
                  : 'bg-emerald-50/40 border-emerald-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.type === 'order_status'
                      ? 'bg-emerald-100 text-emerald-700'
                      : notif.type === 'restock'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {notif.type === 'order_status' && <Package className="w-4 h-4" />}
                  {notif.type === 'restock' && <Sparkles className="w-4 h-4" />}
                  {notif.type === 'announcement' && <Megaphone className="w-4 h-4" />}
                  {notif.type === 'reminder' && <Clock className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">{notif.time}</span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(notif.id);
                  }}
                  className="text-emerald-700 hover:text-emerald-800 text-[11px] font-bold shrink-0 hover:underline"
                >
                  Mark Read
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
