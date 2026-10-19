import React, { useState } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  ThumbsUp,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  MessageSquare
} from 'lucide-react';
import { Booking, Review } from '../types';

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
}

const REVIEW_TAG_OPTIONS = [
  '⚡ Super Punctual (15 Min Arrival)',
  '✨ Spotless & Deep Cleaning',
  '🤝 Extremely Polite & Courteous',
  '🛡️ Verified & Trusted Behavior',
  '🧼 Hygienic (Clean Apron & Gloves)',
  '🍲 Delicious Home Cooked Taste',
  '💯 Exceeded Expectations',
  '🏢 Highly Recommend for Society'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '⚡ Super Punctual (15 Min Arrival)',
    '✨ Spotless & Deep Cleaning'
  ]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5: return '⭐⭐⭐⭐⭐ Outstanding Service! Loved it.';
      case 4: return '⭐⭐⭐⭐ Very Good, timely and efficient.';
      case 3: return '⭐⭐⭐ Decent service, satisfactory.';
      case 2: return '⭐⭐ Needs improvement.';
      case 1: return '⭐ Unsatisfactory.';
      default: return 'Rate your experience';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: booking.id,
      helperId: booking.helper?.id || 'hlp-general',
      helperName: booking.helper?.name || 'hommlyn247 Professional',
      customerName: booking.customer?.name || 'Resident Customer',
      customerCity: booking.customer?.city || 'Bangalore',
      serviceTitle: booking.serviceTitle,
      category: booking.category,
      rating,
      comment: comment.trim() || 'Prompt, verified, and thoroughly professional work. Very satisfied with hommlyn247 service!',
      tags: selectedTags,
      createdAt: new Date().toISOString(),
      verifiedBooking: true,
      isFeaturedHomepage: rating >= 4
    };

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    }).catch(err => console.warn('Review API save note:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitReview(newReview);
      setTimeout(() => {
        onClose();
      }, 1400);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C356A] to-[#0E7490] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cyan-200 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-cyan-200 bg-cyan-900/60 px-2 py-0.5 rounded-md">
                Verified Service Review
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Rate & Review Your Helper
              </h2>
              <p className="text-xs text-cyan-100">
                Order #{booking.id} • {booking.serviceTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Thank You For Your Review!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your feedback helps {booking.helper?.name || 'our domestic partner'} earn incentives and assists fellow residents in choosing trusted domestic help.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Helper Card Brief */}
            {booking.helper && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={booking.helper.photoUrl}
                  alt={booking.helper.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{booking.helper.name}</h4>
                    {booking.helper.policeVerified && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{booking.helper.categoryTitle}</p>
                </div>
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="text-center space-y-2 py-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Overall Satisfaction
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(starVal)}
                      className="p-1 focus:outline-hidden transition-transform hover:scale-115 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-300 stroke-1'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-cyan-900">
                {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
              </p>
            </div>

            {/* Quick Compliment Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                What went great? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {REVIEW_TAG_OPTIONS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-900 text-white border-cyan-900 shadow-2xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/60'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Feedback / Notes for Neighbors
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience (e.g., Arrived exactly in 12 mins, cleaned the entire 3BHK thoroughly and spotless, very polite)."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0C356A] to-[#0E7490] hover:from-[#082245] hover:to-[#085a70] text-white font-black text-xs shadow-md shadow-cyan-950/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing Review...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Submit Verified Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
