import React, { useState, useMemo, useCallback } from 'react';
import { authService } from '../services/authService';
import {
  Star, Search, Filter, Calendar, MessageSquare, ChevronDown,
  X, RefreshCw, CheckCircle, Clock,
  ThumbsUp, ThumbsDown, Minus, Eye, Users, FileText
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
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
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.cls}`}>
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

// ── Overview Stat Card ─────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Feedback Detail View Panel (View-Only / Status Management) ─────────────────
function FeedbackDetailPanel({ feedback, onClose, onStatusChange }) {
  const [localStatus, setLocalStatus] = useState(feedback.status);

  function handleStatusChange(newStatus) {
    setLocalStatus(newStatus);
    onStatusChange(feedback.id, newStatus);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden border border-slate-100 animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-purple-50/60">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm font-bold text-slate-900">Feedback Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-purple-100 flex items-center justify-center transition-colors text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Customer info */}
          <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
              style={{ background: feedback.avatarBg }}
            >
              {feedback.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-base">{feedback.customer}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {feedback.source} • {feedback.date}
              </p>
              <div className="flex gap-2 mt-2 items-center flex-wrap">
                <Stars rating={feedback.rating} />
                <TypeBadge type={feedback.feedbackType} />
              </div>
            </div>
          </div>

          {/* Subject */}
          {feedback.subject && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subject</p>
              <p className="text-sm font-bold text-slate-800">{feedback.subject}</p>
            </div>
          )}

          {/* Full Customer Comment */}
          <div className="bg-purple-50/40 rounded-2xl p-4 border border-purple-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-2">Customer Comment</p>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">{feedback.comment}</p>
          </div>

          {/* Tags */}
          {feedback.tags?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Category Tags</p>
              <div className="flex flex-wrap gap-2">
                {feedback.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review Status Management */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Manage Status</span>
              <StatusBadge status={localStatus} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Pending', 'Reviewed', 'Resolved'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                    localStatus === s
                      ? s === 'Resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : s === 'Reviewed'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s === 'Pending' && <Clock className="w-3 h-3" />}
                  {s === 'Reviewed' && <Eye className="w-3 h-3" />}
                  {s === 'Resolved' && <CheckCircle className="w-3 h-3" />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Owner Reply Note if already present */}
          {feedback.ownerReply && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-3.5 h-3.5" /> Owner Response Recorded
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">{feedback.ownerReply}</p>
            </div>
          )}

          {/* Notice: View Only Mode */}
          <div className="bg-slate-100 rounded-xl p-3 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              👁️ View-only feedback portal for Store Owner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Feedback View Component ───────────────────────────────────────────────
export default function FeedbackDashboardView({ onOpenReports }) {
  const [feedbackList, setFeedbackList] = useState(() => authService.getFeedback());
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');
  const [dateError, setDateError] = useState('');
  const [starFilter, setStarFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered List
  const filtered = useMemo(() => {
    return feedbackList.filter((f) => {
      if (search) {
        const q = search.toLowerCase();
        if (!f.customer.toLowerCase().includes(q) && !f.comment.toLowerCase().includes(q)) return false;
      }
      if (appliedStart && f.date < appliedStart) return false;
      if (appliedEnd && f.date > appliedEnd) return false;
      if (starFilter !== 'all' && f.rating !== Number(starFilter)) return false;
      if (typeFilter !== 'all' && f.feedbackType !== typeFilter) return false;
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      return true;
    });
  }, [feedbackList, search, appliedStart, appliedEnd, starFilter, typeFilter, statusFilter]);

  // Overview Stats
  const stats = useMemo(() => ({
    total: filtered.length,
    positive: filtered.filter((f) => f.feedbackType === 'Positive').length,
    negative: filtered.filter((f) => f.feedbackType === 'Negative').length,
    pending: filtered.filter((f) => f.status === 'Pending').length,
  }), [filtered]);

  function applyDateFilter() {
    if (startDate && endDate && startDate > endDate) {
      setDateError('Start date must be before end date.');
      return;
    }
    setDateError('');
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  }

  function clearDateFilter() {
    setStartDate('');
    setEndDate('');
    setAppliedStart('');
    setAppliedEnd('');
    setDateError('');
  }

  const handleStatusChange = useCallback((id, newStatus) => {
    const updated = authService.updateFeedbackStatus(id, newStatus);
    setFeedbackList(updated);
    if (selectedFeedback?.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
    }
  }, [selectedFeedback]);

  function clearAllFilters() {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setAppliedStart('');
    setAppliedEnd('');
    setStarFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateError('');
  }

  const hasActiveFilters =
    search ||
    appliedStart ||
    appliedEnd ||
    starFilter !== 'all' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* ── Heading Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Customer Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View customer feedback, manage review status, and inspect detailed reviews.
          </p>
        </div>

        {onOpenReports && (
          <button
            onClick={onOpenReports}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-2xl border border-purple-200 transition active:scale-98"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            Generate Feedback Report
          </button>
        )}
      </div>

      {/* ── Feedback Overview Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageSquare}
          iconBg="bg-purple-50 text-purple-600"
          label="Total Feedback"
          value={stats.total}
          sub="Filtered records"
        />
        <StatCard
          icon={ThumbsUp}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Positive Feedback"
          value={stats.positive}
          sub={`${stats.total ? Math.round((stats.positive / stats.total) * 100) : 0}% of total`}
        />
        <StatCard
          icon={ThumbsDown}
          iconBg="bg-rose-50 text-rose-600"
          label="Negative Feedback"
          value={stats.negative}
          sub={`${stats.total ? Math.round((stats.negative / stats.total) * 100) : 0}% of total`}
        />
        <StatCard
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          label="Pending Review"
          value={stats.pending}
          sub="Requires attention"
        />
      </div>

      {/* ── Search & Filter Panel ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            Feedback Filters
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 border border-rose-200 px-3 py-1 rounded-xl hover:bg-rose-50 transition"
            >
              <X className="w-3 h-3" /> Clear All Filters
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, comment keywords..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/70"
          />
        </div>

        {/* Date range & dropdowns */}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Start Date</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 bg-slate-50 focus-within:ring-2 focus-within:ring-purple-400 transition">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">End Date</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 bg-slate-50 focus-within:ring-2 focus-within:ring-purple-400 transition">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <button
            onClick={applyDateFilter}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-sm transition active:scale-95"
          >
            <Filter className="w-3.5 h-3.5" /> Apply Date Filter
          </button>

          {(appliedStart || appliedEnd) && (
            <button
              onClick={clearDateFilter}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-2xl transition"
            >
              <RefreshCw className="w-3 h-3" /> Reset Dates
            </button>
          )}

          {/* Star Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Rating</label>
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>{s}★ Stars</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Types</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {dateError && <p className="text-xs text-rose-500 font-semibold">{dateError}</p>}

        {hasActiveFilters && (
          <p className="text-xs text-purple-700 font-semibold">
            Showing <strong>{filtered.length}</strong> matching feedback items out of <strong>{feedbackList.length}</strong> total.
          </p>
        )}
      </div>

      {/* ── Feedback List ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Feedback Records Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting the search keywords or date range filters.</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-2xl transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filtered.map((fb) => (
            <div
              key={fb.id}
              onClick={() => setSelectedFeedback(fb)}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-5 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                  style={{ background: fb.avatarBg }}
                >
                  {fb.avatar}
                </div>

                {/* Content */}
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

                  {/* Category Tags */}
                  {fb.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {fb.tags.map((tag, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inspect Button */}
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors shrink-0 self-center">
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Detail Inspection Panel ── */}
      {selectedFeedback && (
        <FeedbackDetailPanel
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
