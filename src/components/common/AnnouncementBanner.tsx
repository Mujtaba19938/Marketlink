import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';

const STYLES = {
  urgent: 'bg-rose-50 border-rose-200 text-rose-900',
  important: 'bg-amber-50 border-amber-200 text-amber-900',
  normal: 'bg-sky-50 border-sky-200 text-sky-900',
};

/** Active platform announcements published by the admin (SRS: publish platform-wide announcements) */
export const AnnouncementBanner: React.FC = () => {
  const { announcements } = useMarketData();
  const [hidden, setHidden] = useState<string[]>([]);

  const visible = announcements.filter((a) => a.active && !hidden.includes(a.id)).slice(0, 3);
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((a) => (
        <div key={a.id} className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${STYLES[a.priority]}`}>
          <Megaphone className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-sm">{a.title}</div>
            <p className="mt-0.5 leading-relaxed">{a.message}</p>
            <span className="text-[10px] opacity-70">{a.createdAt}</span>
          </div>
          <button type="button" onClick={() => setHidden((h) => [...h, a.id])} className="p-1 rounded-lg hover:bg-black/5 cursor-pointer" title="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
