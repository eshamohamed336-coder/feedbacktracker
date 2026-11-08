import React, { useState } from 'react';
import {
  MessageSquare, Star, CheckCircle, Clock, Eye,
  ThumbsUp, ThumbsDown, Minus, ShieldCheck, ChevronRight
} from 'lucide-react';
import DateRangePicker from '../DateRangePicker';

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
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
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold ${cfg.cls}`}>
      <Icon className="w-3.5 h-3.5" /> {status}
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
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold ${cfg.cls}`}>
      <Icon className="w-3.5 h-3.5" /> {type} Sentiment
    </span>
  );
}

export default function FeedbackDetailsPage({
  feedbackList,
  selectedFeedback,
  onSelectFeedback,
  onStatusChange,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
}) {
  const activeItem = selectedFeedback || feedbackList[0] || null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Single Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Feedback Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Feedback Details
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect individual customer feedback, review comment history &amp; adjust status.
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

      {!activeItem ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-14 text-center">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Feedback Available to Inspect</h3>
          <p className="text-xs text-slate-400 mt-1">Select a broader date range to inspect feedback records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Quick Selector List */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Customer Record
              </h3>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {feedbackList.length} Total
              </span>
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {feedbackList.map((item) => {
                const isCurrent = activeItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectFeedback(item)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-100 shadow-xs'
                        : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: item.avatarBg }}
                      >
                        {item.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.customer}</p>
                        <p className="text-[11px] text-slate-400 truncate">{item.date}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-purple-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Inspector Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header / Customer Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-base font-black shadow-md shrink-0"
                  style={{ background: activeItem.avatarBg }}
                >
                  {activeItem.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeItem.customer}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Source: <span className="text-slate-700 font-semibold">{activeItem.source}</span> • Date:{' '}
                    <span className="text-slate-700 font-semibold">{activeItem.date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={activeItem.feedbackType} />
                <StatusBadge status={activeItem.status} />
              </div>
            </div>

            {/* Rating Stars & Subject */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Stars rating={activeItem.rating} />
                <span className="text-xs font-bold text-slate-700">{activeItem.rating} out of 5 Stars</span>
              </div>
              {activeItem.subject && (
                <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl">
                  {activeItem.subject}
                </span>
              )}
            </div>

            {/* Full Comment */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Customer Comment Text
              </label>
              <div className="p-5 rounded-2xl bg-purple-50/30 border border-purple-100 text-sm text-slate-800 leading-relaxed font-medium">
                "{activeItem.comment}"
              </div>
            </div>

            {/* Tags */}
            {activeItem.tags?.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Category Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeItem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Status Management */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Update Review Status</span>
                <span className="text-xs text-slate-400">Owner action</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Pending', 'Reviewed', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => onStatusChange(activeItem.id, st)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      activeItem.status === st
                        ? st === 'Resolved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : st === 'Reviewed'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                    {st === 'Reviewed' && <Eye className="w-3.5 h-3.5" />}
                    {st === 'Resolved' && <CheckCircle className="w-3.5 h-3.5" />}
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing Owner Reply if present */}
            {activeItem.ownerReply && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4" /> Recorded Owner Response
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">{activeItem.ownerReply}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

