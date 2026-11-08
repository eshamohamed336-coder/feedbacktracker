import React, { useState } from 'react';
import { MessageSquare, Star, Eye, ThumbsUp, ThumbsDown, Minus, Clock, CheckCircle } from 'lucide-react';
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

export default function FeedbackListPage({
  feedbackList,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
  onSelectFeedback,
}) {
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
            Feedback List
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured customer feedback feed with sentiment indicators and review statuses.
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

      {/* Structured Feedback Feed */}
      <div className="space-y-3.5">
        {feedbackList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-14 text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Feedback Records Found</h3>
            <p className="text-xs text-slate-400 mt-1">There are no feedback submissions recorded for this period.</p>
          </div>
        ) : (
          feedbackList.map((fb) => (
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

                  {fb.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {fb.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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

