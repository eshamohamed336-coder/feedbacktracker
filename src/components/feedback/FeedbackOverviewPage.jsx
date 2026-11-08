import React, { useMemo } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock, CheckCircle, Eye } from 'lucide-react';
import DateRangePicker from '../DateRangePicker';

export default function FeedbackOverviewPage({
  feedbackList,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
}) {
  const stats = useMemo(() => {
    const total = feedbackList.length;
    const positive = feedbackList.filter((f) => f.feedbackType === 'Positive').length;
    const negative = feedbackList.filter((f) => f.feedbackType === 'Negative').length;
    const neutral = feedbackList.filter((f) => f.feedbackType === 'Neutral').length;

    const pending = feedbackList.filter((f) => f.status === 'Pending').length;
    const reviewed = feedbackList.filter((f) => f.status === 'Reviewed').length;
    const resolved = feedbackList.filter((f) => f.status === 'Resolved').length;

    return { total, positive, negative, neutral, pending, reviewed, resolved };
  }, [feedbackList]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Single Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Feedback Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Feedback Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic view of all customer sentiment, resolution statuses &amp; feedback volume.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Feedback</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          <p className="text-xs font-semibold text-purple-600 mt-1">Submitted in period</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Positive Feedback</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.positive}</p>
          <p className="text-xs font-semibold text-emerald-600 mt-1">
            {stats.total ? Math.round((stats.positive / stats.total) * 100) : 0}% of total
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <ThumbsDown className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Negative Feedback</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats.negative}</p>
          <p className="text-xs font-semibold text-rose-600 mt-1">
            {stats.total ? Math.round((stats.negative / stats.total) * 100) : 0}% of total
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
          <p className="text-xs font-semibold text-amber-600 mt-1">Awaiting owner review</p>
        </div>
      </div>

      {/* Status Breakdown & Sentiment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900">Feedback Review Statuses</h3>

          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Pending Review</h4>
                  <p className="text-[11px] text-amber-700">Needs owner inspection</p>
                </div>
              </div>
              <span className="text-lg font-black text-amber-800">{stats.pending}</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Reviewed</h4>
                  <p className="text-[11px] text-blue-700">Inspected by management</p>
                </div>
              </div>
              <span className="text-lg font-black text-blue-800">{stats.reviewed}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Resolved</h4>
                  <p className="text-[11px] text-emerald-700">Resolved / Customer addressed</p>
                </div>
              </div>
              <span className="text-lg font-black text-emerald-800">{stats.resolved}</span>
            </div>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Customer Sentiment Ratio</h3>
            <p className="text-xs text-slate-500">
              Aggregated distribution of positive praise, neutral remarks, and constructive critiques.
            </p>
          </div>

          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700">Positive ({stats.positive})</span>
                <span className="text-emerald-700">
                  {stats.total ? Math.round((stats.positive / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${stats.total ? (stats.positive / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Neutral ({stats.neutral})</span>
                <span className="text-slate-700">
                  {stats.total ? Math.round((stats.neutral / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${stats.total ? (stats.neutral / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-700">Negative ({stats.negative})</span>
                <span className="text-rose-700">
                  {stats.total ? Math.round((stats.negative / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${stats.total ? (stats.negative / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-100 rounded-2xl text-[11px] text-slate-500 text-center font-medium">
            👁️ Feedback is restricted to Owner View-Only mode. Customer submissions are pulled automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

