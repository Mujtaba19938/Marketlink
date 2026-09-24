import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Star, MessageSquare, Send, CheckCircle, ThumbsUp, Store, ShieldCheck } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { farmers, submitFeedback, feedbacks, triggerToast } = useMarketData();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || 'f-1');
  const [comments, setComments] = useState('');
  const [orderReference, setOrderReference] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedFarmer = farmers.find((f) => f.id === selectedFarmerId);
    submitFeedback({
      orderId: orderReference.trim() || 'ORD-GEN-01',
      farmerName: matchedFarmer ? matchedFarmer.farmName : 'Green Valley Stall',
      rating,
      tags: ['Verified Organic', 'Pre-Order Pickup'],
      comment: comments.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    triggerToast('Thank you for your rating! Your review was submitted successfully.');
    setSubmitted(true);
    setComments('');
    setOrderReference('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
          Farmer & Product Reviews & Feedback
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Share your experience with local growers, produce quality, and pickup convenience to support community agriculture.
        </p>
      </div>

      {/* Main Review Form Card */}
      <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-main)]">
              Submit Farmer Rating & Product Review (SRS)
            </h3>
            <p className="text-xs text-slate-400">
              Your feedback is published to the Farmer's stall review center.
            </p>
          </div>
        </div>

        {submitted && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
            <div>
              <strong>Review Recorded!</strong> The farmer will be able to view and respond to your review.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Rating Selector */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Overall Experience & Freshness Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 transition hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-white/20'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-500 ml-2">
                {rating === 5 ? 'Exceptional Harvest' : rating === 4 ? 'Very Fresh' : rating === 3 ? 'Satisfactory' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Farmer / Stall *
              </label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.farmName} ({f.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Order Reference Number (Optional)
              </label>
              <input
                type="text"
                value={orderReference}
                onChange={(e) => setOrderReference(e.target.value)}
                placeholder="e.g. #ORD-2024-001"
                className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Comments & Review *
            </label>
            <textarea
              required
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell other shoppers about produce flavor, crispness, stall pickup experience, and farmer communication..."
              className="w-full px-3 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-main)] focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Verified patron reviews help maintain high market standards.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>

      {/* Community Reviews Showcase */}
      <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 border border-[var(--color-border)] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-main)]">
          Recent Community Produce Reviews
        </h3>

        <div className="space-y-3">
          {feedbacks.slice(0, 3).map((fb, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border)] space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-main)]">Order #{fb.orderId}</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{fb.rating}.0 / 5.0</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{fb.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
