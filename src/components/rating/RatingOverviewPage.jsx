import React, { useMemo } from 'react';
import { Star, Users, ThumbsUp, Clock, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import DateRangePicker from '../DateRangePicker';

export default function RatingOverviewPage({
  ratings,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
}) {
  const stats = useMemo(() => {
    const total = ratings.length;
    const avg = total
      ? (ratings.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
      : '0.0';
    const positiveCount = ratings.filter((r) => r.rating >= 4).length;
    const positivePct = total ? Math.round((positiveCount / total) * 100) : 0;
    const prevAvg = '4.2';

    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: ratings.filter((r) => r.rating === star).length,
    }));

    return { total, avg, positivePct, prevAvg, dist };
  }, [ratings]);

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#94a3b8', '#ef4444'];
  const radius = 54, cx = 70, cy = 70, circumference = 2 * Math.PI * radius;
  let offset = 0;
  const slices = stats.dist.map((d, i) => {
    const pct = d.count / (stats.total || 1);
    const dash = pct * circumference;
    const slice = { ...d, dash, offset, color: COLORS[i] };
    offset += dash;
    return slice;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Single Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Rating Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Rating Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key summary metrics, overall score &amp; customer satisfaction index.
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

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating Average</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.avg} / 5</p>
          <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +0.2 positive trend
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating Total</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total.toLocaleString()}</p>
          <p className="text-xs font-semibold text-indigo-600 mt-1">Total customer records</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating Positive</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.positivePct}%</p>
          <p className="text-xs font-semibold text-emerald-600 mt-1">4 &amp; 5 star ratings</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Previous Month Rating</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.prevAvg} / 5</p>
          <p className="text-xs font-semibold text-purple-600 mt-1">+0.1 month-over-month</p>
        </div>
      </div>

      {/* Main Overview Visual Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Rating Composition</h3>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              {stats.total} Total Ratings
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
            <svg width={140} height={140} viewBox="0 0 140 140" className="shrink-0">
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={20} />
              {stats.total > 0 &&
                slices.map((s, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={20}
                    strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                    strokeDashoffset={-s.offset}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
                  />
                ))}
              <text x={cx} y={cy - 5} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">
                {stats.avg}
              </text>
              <text x={cx} y={cy + 13} textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">
                Out of 5
              </text>
            </svg>

            <div className="space-y-2.5 w-full">
              {stats.dist.map((d, i) => {
                const pct = Math.round((d.count / (stats.total || 1)) * 100);
                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-slate-800 font-bold w-7">{5 - i}★</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: COLORS[i] }}
                      />
                    </div>
                    <span className="text-slate-700 font-bold w-8 text-right">{pct}%</span>
                    <span className="text-slate-400 w-10 text-right">({d.count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Business Insights Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Executive Summary</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on the currently selected date range{' '}
              <strong className="text-slate-800">
                {startDate ? `${startDate} to ${endDate || 'Today'}` : 'All Time'}
              </strong>
              , your store holds an average score of <strong className="text-purple-700">{stats.avg} / 5</strong>.
              Over <strong className="text-slate-800">{stats.positivePct}%</strong> of customer evaluations are positive
              (4-5 stars).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">5-Star Customer Loyalty</span>
              <span className="text-xs font-black text-emerald-700">
                {stats.dist.find((d) => d.star === 5)?.count || 0} Customers
              </span>
            </div>
            <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800">Positive Feedback Ratio</span>
              <span className="text-xs font-black text-indigo-700">{stats.positivePct}% Total</span>
            </div>
            <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800">Owner Status</span>
              <span className="text-xs font-black text-purple-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High Satisfaction
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

