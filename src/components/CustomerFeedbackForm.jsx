import React, { useState, useEffect } from 'react';
import {
  Star, ThumbsUp, Sparkles, CheckCircle2, MessageSquare,
  Send, ArrowLeft, Heart, RotateCcw, ShieldCheck, Building2, Phone
} from 'lucide-react';
import { authService } from '../services/authService';

export default function CustomerFeedbackForm({ onBackToLogin }) {
  // Brand name (can be customized)
  const brandName = "BizFeedback Store #9042";

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rating, setRating] = useState(0); // 0 = unselected, 1 to 5 mandatory
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedPositives, setSelectedPositives] = useState([]);
  const [selectedImprovements, setSelectedImprovements] = useState([]);
  const [comment, setComment] = useState('');

  // Read URL query parameters if opened via link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlPhone = params.get('phone');
      const urlName = params.get('name');
      if (urlPhone) setCustomerPhone(urlPhone);
      if (urlName) setCustomerName(urlName);
    } catch {}
  }, []);
  
  // Validation & Submission State
  const [ratingError, setRatingError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Experience Options: Positive Highlights
  const positiveOptions = [
    '⚡ Fast & Prompt Service',
    '😊 Friendly & Courteous Staff',
    '🧼 Spotless & Clean Store',
    '💎 Premium Product Quality',
    '💰 Great Value for Money',
    '📦 Excellent Packaging'
  ];

  // Experience Options: Improvement Suggestions
  const improvementOptions = [
    '⏳ Faster Checkout Queue',
    '💳 More Payment Methods',
    '🛍️ Wider Variety of Items',
    '📱 Better Mobile Ordering',
    '🅿️ Easier Parking Space',
    '📞 Faster Phone Support'
  ];

  const ratingDescriptions = {
    1: '1 Star — Very Dissatisfied (Terrible)',
    2: '2 Stars — Dissatisfied (Needs Improvement)',
    3: '3 Stars — Neutral (Average Experience)',
    4: '4 Stars — Satisfied (Good & Pleasant)',
    5: '5 Stars — Highly Satisfied (Outstanding!)'
  };

  const togglePositive = (option) => {
    setSelectedPositives(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const toggleImprovement = (option) => {
    setSelectedImprovements(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1 to 5 Star Rating is MANDATORY
    if (rating === 0) {
      setRatingError(true);
      const ratingElement = document.getElementById('star-rating-section');
      if (ratingElement) {
        ratingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setRatingError(false);
    setIsSubmitting(true);

    setTimeout(() => {
      const name = customerName.trim() || 'Verified Customer';
      const allTags = [...selectedPositives, ...selectedImprovements];

      // Save into both Ratings & Feedback datasets in authService
      const newFeedback = authService.addFeedback({
        customer: name,
        rating: rating,
        subject: rating >= 4 ? 'Positive Store Experience' : 'Customer Feedback & Suggestions',
        source: 'Customer Feedback Portal',
        tags: allTags.length > 0 ? allTags.slice(0, 4) : ['Customer Submitted'],
        comment: comment.trim() || (rating >= 4 ? 'Great overall experience!' : 'Provided rating and suggestions.'),
        date: new Date().toISOString().split('T')[0]
      });

      authService.addRating({
        customer: name,
        rating: rating,
        comment: comment.trim() || (rating >= 4 ? 'Satisfied customer rating' : 'Feedback submitted'),
        source: 'Customer Feedback Portal',
        date: new Date().toISOString().split('T')[0]
      });

      setSubmittedData({
        customer: name,
        rating,
        positives: selectedPositives,
        improvements: selectedImprovements,
        comment: comment.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setCustomerName('');
    setSelectedPositives([]);
    setSelectedImprovements([]);
    setComment('');
    setRatingError(false);
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ── THANK YOU PAGE VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-[#f3f7fd] flex flex-col justify-between py-8 px-4 sm:px-6">
        {/* Top Navbar */}
        <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">{brandName}</span>
          </div>
          {onBackToLogin && (
            <button
              onClick={onBackToLogin}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs transition"
            >
              Owner Portal
            </button>
          )}
        </header>

        {/* Thank You Card */}
        <main className="max-w-xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 text-center animate-fadeIn space-y-6">
          {/* Animated Celebration Badge */}
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-2">
              Submission Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Thank You for Your Feedback!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Your response has been delivered directly to <strong className="text-slate-800">{brandName}</strong>. 
              We appreciate your time in helping us elevate our customer experience!
            </p>
          </div>

          {/* Submission Recap Box */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 text-left space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= submittedData.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-black text-slate-800 ml-1.5">
                  {submittedData.rating} / 5
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Customer:</span>
              <span className="font-bold text-slate-800">{submittedData.customer}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Date Submitted:</span>
              <span className="font-semibold text-slate-600">{submittedData.date}</span>
            </div>

            {submittedData.positives.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] font-bold text-emerald-700 block mb-1">What you loved:</span>
                <div className="flex flex-wrap gap-1.5">
                  {submittedData.positives.map((p, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {submittedData.improvements.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] font-bold text-amber-700 block mb-1">Suggestions shared:</span>
                <div className="flex flex-wrap gap-1.5">
                  {submittedData.improvements.map((imp, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {imp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {submittedData.comment && (
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Written Feedback:</span>
                <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200">
                  "{submittedData.comment}"
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={resetForm}
              className="flex-1 py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              Submit Another Feedback
            </button>
            {onBackToLogin && (
              <button
                onClick={onBackToLogin}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                Owner Login
              </button>
            )}
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-4">
          Powered by BizFeedback Ratings &amp; Experience Engine • &copy; {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── CUSTOMER FEEDBACK FORM VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f3f7fd] flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Brand Bar */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 block">
              Official Feedback Portal
            </span>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {brandName}
            </h2>
          </div>
        </div>

        {onBackToLogin && (
          <button
            onClick={onBackToLogin}
            className="text-xs font-bold text-slate-600 hover:text-purple-700 bg-white border border-slate-200 hover:border-purple-200 px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Owner Login
          </button>
        )}
      </header>

      {/* Main Feedback Card */}
      <main className="max-w-2xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 space-y-8 animate-fadeIn">
        {/* Welcome Header */}
        <div className="text-center space-y-1.5 border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-1">
            <Heart className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            We Value Your Voice
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Share Your Store Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Please rate your visit and tell us what you enjoyed or what we can improve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* ── 1. CUSTOMER NAME (Optional) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-slate-400">Can be left blank</span>
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe / Priya Kumar"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/60 transition"
            />
          </div>

          {/* ── 2. STAR RATING (1 to 5 MANDATORY) ── */}
          <div
            id="star-rating-section"
            className={`p-5 rounded-2xl border transition-all text-center space-y-3 ${
              ratingError
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                : 'bg-slate-50/70 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Overall Rating
              </span>
              <span className="text-rose-500 font-black text-sm">*</span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full ml-1">
                Mandatory
              </span>
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const active = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => {
                      setRating(starValue);
                      setRatingError(false);
                    }}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-xl transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                    aria-label={`Rate ${starValue} stars`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-200 ${
                        active
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                          : 'text-slate-300 fill-slate-100 hover:text-amber-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating Level Helper Text */}
            <p className="text-xs font-bold text-slate-700 min-h-[18px]">
              {ratingDescriptions[hoverRating || rating] || 'Tap a star to rate from 1 to 5'}
            </p>

            {ratingError && (
              <p className="text-xs font-bold text-rose-600 animate-shake">
                ⚠️ Please select a star rating (1 to 5) before submitting.
              </p>
            )}
          </div>

          {/* ── 3. EXPERIENCE: POSITIVE HIGHLIGHTS ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                What went well? <span className="text-slate-400 font-normal lowercase">(select all that apply)</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {positiveOptions.map((opt) => {
                const isSelected = selectedPositives.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => togglePositive(opt)}
                    className={`p-3 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 3. EXPERIENCE: IMPROVEMENT SUGGESTIONS ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Areas for Improvement <span className="text-slate-400 font-normal lowercase">(suggestions)</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {improvementOptions.map((opt) => {
                const isSelected = selectedImprovements.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleImprovement(opt)}
                    className={`p-3 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-100 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. FEEDBACK TEXT BOX (Optional Written Feedback) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                Additional Written Feedback <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-slate-400">{comment.length} / 500 characters</span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your visit, staff interactions, or anything we can do better next time..."
              className="w-full p-4 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/60 resize-none transition"
            />
          </div>

          {/* ── 5. SUBMIT FEEDBACK BUTTON ── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Your Feedback...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Customer Feedback</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified feedback goes directly to business management.
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4">
        {brandName} • Powered by BizFeedback • &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

