import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Star, MessageSquare, Reply, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

export const VendorReviewCenter: React.FC = () => {
  const { vendorReviews, replyToReview } = useMarketData();
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleSendReply = (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;
    replyToReview(reviewId, text.trim());
    setReplyInputs((prev) => ({ ...prev, [reviewId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Customer Review Center</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build buyer loyalty and respond directly to customer reviews on pre-order freshness and pickup experience.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-2xl text-xs font-semibold text-amber-900">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>4.9 Stall Average • 64 Verified Reviews</span>
        </div>
      </div>

      {/* Review Feed */}
      <div className="space-y-4">
        {vendorReviews.map((rev) => {
          const isReplying = activeReplyId === rev.id;

          return (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/30 hover:bg-white transition-all space-y-3 text-xs"
            >
              {/* Top Row: Customer & Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Reviewed for <strong className="text-slate-700">{rev.productName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 text-[11px]">• {rev.date}</span>
                </div>
              </div>

              {/* Customer Comment Text */}
              <p className="text-slate-700 leading-relaxed text-xs pl-1">{rev.comment}</p>

              {/* Existing Vendor Reply (if present) */}
              {rev.reply && (
                <div className="ml-4 pl-4 border-l-2 border-emerald-500 bg-emerald-50/60 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <Reply className="w-3.5 h-3.5 text-emerald-600 rotate-180" />
                      Green Valley Stall Response
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">{rev.reply.date}</span>
                  </div>
                  <p className="text-emerald-900 text-[11px] leading-relaxed">{rev.reply.text}</p>
                </div>
              )}

              {/* Inline Reply Form / Button */}
              {!rev.reply && (
                <div className="pt-1">
                  {!isReplying ? (
                    <button
                      onClick={() => setActiveReplyId(rev.id)}
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-xs cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5 rotate-180" />
                      <span>Reply to Customer</span>
                    </button>
                  ) : (
                    <div className="bg-white p-3 rounded-2xl border border-emerald-200 space-y-2 mt-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Write Response to {rev.customerName}:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyInputs[rev.id] || ''}
                          onChange={(e) =>
                            setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })
                          }
                          placeholder="Thank customer or clarify stall pickup instructions..."
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(rev.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Publish Reply</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
