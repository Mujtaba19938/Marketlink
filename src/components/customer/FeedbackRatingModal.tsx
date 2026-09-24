import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Star, CheckCircle2, Heart } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { OrderFeedback } from '../../types/customer';

interface FeedbackRatingModalProps {
  orderId: string | null;
  farmerName: string;
  onClose: () => void;
}

export const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({
  orderId,
  farmerName,
  onClose,
}) => {
  const { submitFeedback } = useMarketData();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Ultra Fresh', 'Eco Packaging']);

  const availableTags = [
    'Ultra Fresh',
    'Eco Packaging',
    'Fast Stall Handover',
    'Sweet & Juicy',
    'Friendly Farmer',
    'Blemish Free',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    const feedbackData: OrderFeedback = {
      orderId,
      farmerName,
      rating,
      tags: selectedTags,
      comment: comment.trim() || 'Produce was wonderfully fresh and pickup was effortless!',
      date: 'Today',
    };

    submitFeedback(feedbackData);
    onClose();
  };

  if (!orderId) return null;

  return (
    <Modal
      isOpen={!!orderId}
      onClose={onClose}
      title="Rate Your Fresh Pickup Experience"
      subtitle={`Order #${orderId} from ${farmerName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Star Rating Selector */}
        <div className="text-center py-2">
          <label className="block font-bold text-slate-700 text-sm mb-2">
            How was the freshness and pickup speed?
          </label>
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 cursor-pointer"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 font-semibold">
            {rating === 5
              ? 'Outstanding Freshness!'
              : rating === 4
              ? 'Great Harvest'
              : rating === 3
              ? 'Average'
              : 'Could be Better'}
          </span>
        </div>

        {/* Compliment Tags */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5">What did you love most?</label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Feedback Comments (Optional)</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share notes on flavor, crispness, or stall greeting..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none text-xs"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
          >
            Skip
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </Modal>
  );
};
