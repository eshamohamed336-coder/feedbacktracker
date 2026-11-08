import React, { useState, useMemo } from 'react';
import { List, Star, ChevronDown } from 'lucide-react';
import DateRangePicker from '../DateRangePicker';

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
          }`}
        />
      ))}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Neutral: 'bg-amber-50 text-amber-700 border-amber-200',
    Negative: 'bg-rose-50 text-rose-600 border-rose-200',
  };
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
        map[status] || 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
}

export default function RatingHistoryPage({
  ratings,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
}) {
  const [starFilter, setStarFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredRatings = useMemo(() => {
    let list = ratings;
    if (starFilter !== 'all') {
      list = list.filter((r) => r.rating === Number(starFilter));
    }
    return sortOrder === 'desc'
      ? [...list].sort((a, b) => b.date.localeCompare(a.date))
      : [...list].sort((a, b) => a.date.localeCompare(b.date));
  }, [ratings, starFilter, sortOrder]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Single Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Rating Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <List className="w-5 h-5 text-purple-600" />
            Rating History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full chronological archive of all verified customer rating submissions.
          </p>
        </div>

        {/* Single Date Range Selector */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onApply={onApplyDateRange}
          onReset={onResetDateRange}
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Controls Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Displaying Records:</span>
            <span className="text-xs font-black text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
              {filteredRatings.length} of {ratings.length} Entries
            </span>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Stars</option>
              <option value="5">5★ Stars Only</option>
              <option value="4">4★ Stars Only</option>
              <option value="3">3★ Stars Only</option>
              <option value="2">2★ Stars Only</option>
              <option value="1">1★ Star Only</option>
            </select>

            <button
              onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5 text-left w-12">#</th>
                <th className="px-6 py-3.5 text-left">Customer</th>
                <th className="px-6 py-3.5 text-left">Rating</th>
                <th className="px-6 py-3.5 text-left">Comment / Review</th>
                <th className="px-6 py-3.5 text-left">Date</th>
                <th className="px-6 py-3.5 text-left">Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRatings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400 text-sm">
                    No ratings found matching the selected date range and star filter.
                  </td>
                </tr>
              ) : (
                filteredRatings.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-xs font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                          style={{ background: r.avatarBg }}
                        >
                          {r.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{r.customer}</p>
                          <p className="text-[11px] text-slate-400">{r.source}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Stars rating={r.rating} />
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-xs text-slate-700 font-normal leading-relaxed">{r.comment || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.feedbackStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

