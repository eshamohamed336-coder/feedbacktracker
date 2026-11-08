import React, { useState, useMemo } from 'react';
import { Filter, Search, RotateCcw, MessageSquare, Star, Eye, ThumbsUp, ThumbsDown, Minus, Clock, CheckCircle } from 'lucide-react';
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
    Pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    Reviewed: { cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Eye },
    Resolved: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  };
  const cfg = map[status] || { cls: 'bg-slate-50 text-slate-600 border-slate-200', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-semibold ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {status}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    Positive: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ThumbsUp },
    Negative: { cls: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown },
    Neutral: { cls: 'bg-slate-100 text-slate-700 border-slate-200', icon: Minus },
  };
  const cfg = map[type] || map.Neutral;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-semibold ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {type}
    </span>
  );
}

export default function FeedbackFilterPage({
  feedbackList,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
  onSelectFeedback,
}) {
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return feedbackList.filter((f) => {
      if (search) {
        const q = search.toLowerCase();
        if (!f.customer.toLowerCase().includes(q) && !f.comment.toLowerCase().includes(q)) return false;
      }
      if (starFilter !== 'all' && f.rating !== Number(starFilter)) return false;
      if (typeFilter !== 'all' && f.feedbackType !== typeFilter) return false;
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      return true;
    });
  }, [feedbackList, search, starFilter, typeFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setStarFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    onResetDateRange();
  };

  const hasActiveFilters =
    search || starFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Feedback Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Feedback Filter &amp; Search Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query feedback by keywords, rating scale, review status, and single date range picker.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-2xl border border-rose-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        )}
      </div>

      {/* Filter Control Box */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
        {/* Keyword Search */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
            Search Customer or Keywords
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, comment words..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-50/70"
            />
          </div>
        </div>

        {/* Multi-Select Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Single Date Range Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
              Date Range Selector
            </label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onApply={onApplyDateRange}
              onReset={onResetDateRange}
            />
          </div>

          {/* Star Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
              Rating Level
            </label>
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5★ Stars Only</option>
              <option value="4">4★ Stars Only</option>
              <option value="3">3★ Stars Only</option>
              <option value="2">2★ Stars Only</option>
              <option value="1">1★ Star Only</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
              Sentiment Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Sentiments</option>
              <option value="Positive">Positive Praise</option>
              <option value="Neutral">Neutral Remarks</option>
              <option value="Negative">Negative Concerns</option>
            </select>
          </div>

          {/* Review Status Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
              Review Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Review Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Status Counter */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>
            Matched <strong>{filtered.length}</strong> of <strong>{feedbackList.length}</strong> total records
          </span>
          {hasActiveFilters && (
            <span className="text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full">
              Filters Active
            </span>
          )}
        </div>
      </div>

      {/* Filtered Results Output Feed */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Query Results ({filtered.length})
        </h3>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-14 text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Matching Feedback Records</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the keyword search or broadening the filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-2xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((fb) => (
            <div
              key={fb.id}
              onClick={() => onSelectFeedback(fb)}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                  style={{ background: fb.avatarBg }}
                >
                  {fb.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                        {fb.customer}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {fb.source} • {fb.date}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <TypeBadge type={fb.feedbackType} />
                      <StatusBadge status={fb.status} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Stars rating={fb.rating} />
                    {fb.subject && (
                      <span className="text-xs font-bold text-slate-700 truncate">— {fb.subject}</span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {fb.comment}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors shrink-0 self-center">
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

