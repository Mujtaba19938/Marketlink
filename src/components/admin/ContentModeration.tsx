import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ContentModeration: React.FC = () => {
  const { moderationItems, removeModeratedItem, dismissModeratedItem } = useMarketData();
  const [filterType, setFilterType] = useState<'all' | 'product' | 'review'>('all');

  const filteredItems = moderationItems.filter(
    (item) => filterType === 'all' || item.type === filterType
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Content Moderation & Flagged Queue</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review reported customer comments, pricing anomalies, and unverified bio claims with 1-click takedowns.
          </p>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Flags ({moderationItems.length})
          </button>
          <button
            onClick={() => setFilterType('product')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'product' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setFilterType('review')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'review' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Flagged Items Feed */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">Moderation Queue Clear</h4>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no flagged listings or reported reviews pending action.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full border ${
                      item.type === 'product'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}
                  >
                    {item.type === 'product' ? <FileText className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                    {item.type.toUpperCase()}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.severity === 'high'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : item.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.severity.toUpperCase()} PRIORITY
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm">{item.targetName}</div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {item.reason}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Author: {item.authorName}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 font-mono text-[11px] text-slate-700 italic">
                  {item.contentPreview}
                </div>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 md:self-center">
                <button
                  onClick={() => dismissModeratedItem(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
                  title="Dismiss flag and keep content live"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dismiss Flag</span>
                </button>

                <button
                  onClick={() => removeModeratedItem(item.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                  title="Remove this item immediately"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>1-Click Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
