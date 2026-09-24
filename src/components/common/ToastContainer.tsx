import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toastList, removeToast } = useMarketData();

  if (toastList.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toastList.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';
        let borderColor = 'border-emerald-500/30';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
          borderColor = 'border-rose-500/30';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
          borderColor = 'border-amber-500/30';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-sky-400';
          borderColor = 'border-sky-500/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border ${borderColor} flex items-center justify-between gap-3 text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in duration-200`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
