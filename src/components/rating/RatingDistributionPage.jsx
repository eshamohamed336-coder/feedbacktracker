import React, { useMemo } from 'react';
import { BarChart2, Star } from 'lucide-react';
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

export default function RatingDistributionPage({
  ratings,
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
}) {
  const distData = useMemo(() => {
    const total = ratings.length || 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = ratings.filter((r) => r.rating === star).length;
      const pct = Math.round((count / total) * 100);
      return { star, count, pct };
    });
  }, [ratings]);

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#94a3b8', '#ef4444'];
  const maxCount = Math.max(...distData.map((d) => d.count), 1);
  const W = 460, H = 160, barW = 48, gap = 24;
  const totalW = distData.length * (barW + gap) - gap;
  const startX = (W - totalW) / 2;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Single Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Rating Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-600" />
            Rating Distribution
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown across 1-star, 2-star, 3-star, 4-star, and 5-star customer ratings.
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

      {/* Main Distribution Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Distribution Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Star Rating Frequency Chart</h3>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              {ratings.length} Total Submissions
            </span>
          </div>

          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg" style={{ height: 180 }}>
              {distData.map((d, i) => {
                const x = startX + i * (barW + gap);
                const barH = Math.max((d.count / maxCount) * 95, 6);
                const y = 115 - barH;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={barW} height={barH} rx="10" fill={COLORS[i]} />
                    <text
                      x={x + barW / 2}
                      y={y - 8}
                      fontSize="11"
                      fill={COLORS[i]}
                      textAnchor="middle"
                      fontWeight="800"
                    >
                      {d.pct}%
                    </text>
                    <text
                      x={x + barW / 2}
                      y={134}
                      fontSize="11"
                      fill="#1e293b"
                      textAnchor="middle"
                      fontWeight="800"
                    >
                      {5 - i}★
                    </text>
                    <text
                      x={x + barW / 2}
                      y={148}
                      fontSize="9"
                      fill="#94a3b8"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {d.count} reviews
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Detailed Horizontal Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900">Percentage &amp; Volume Metrics</h3>

          <div className="space-y-4">
            {distData.map((d, i) => (
              <div key={d.star} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Stars rating={d.star} />
                    <span className="font-bold text-slate-800">{d.star} Stars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">{d.count}</span>
                    <span className="font-semibold text-slate-400">({d.pct}%)</span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${d.pct}%`, background: COLORS[i] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl text-xs text-slate-600 leading-relaxed mt-4">
            <span className="font-bold text-purple-900 block mb-0.5">Distribution Analysis</span>
            The bulk of your customer base leaves 4 &amp; 5-star ratings, demonstrating consistent service standards.
          </div>
        </div>
      </div>
    </div>
  );
}

