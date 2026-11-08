import React, { useState } from 'react';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { MONTHLY_TREND_DATA } from '../../services/authService';
import DateRangePicker from '../DateRangePicker';

export default function RatingTrendsPage({
  startDate,
  endDate,
  onApplyDateRange,
  onResetDateRange,
}) {
  const [trendKey, setTrendKey] = useState('6months');

  const trendOptions = [
    { value: '1month', label: 'Last 1 Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last 1 Year' },
  ];

  const data = MONTHLY_TREND_DATA[trendKey] || MONTHLY_TREND_DATA['6months'];
  const { labels, values } = data;
  const validVals = values.filter((v) => v !== null);
  const minV = Math.min(...validVals) - 0.3;
  const maxV = Math.max(...validVals) + 0.3;
  const W = 620, H = 180, padL = 36, padR = 20, padT = 20, padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const toX = (i) => padL + (i / (labels.length - 1)) * plotW;
  const toY = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;
  const pts = values.map((v, i) => (v !== null ? `${toX(i)},${toY(v)}` : null)).filter(Boolean);
  const polyline = pts.join(' ');
  const area =
    `M${toX(0)},${toY(values[0])} ` +
    pts.slice(1).map((p) => `L${p}`).join(' ') +
    ` L${toX(labels.length - 1)},${padT + plotH} L${toX(0)},${padT + plotH} Z`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header & Single Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
            Rating Module
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Rating Trends
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor rating velocity, monthly trajectories &amp; performance milestones.
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

      {/* Main Trends Visual Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historical Rating Curve</h3>
            <p className="text-xs text-slate-400">Interactive trend curve for the selected period</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {trendOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => setTrendKey(o.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  trendKey === o.value
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]" style={{ height: 220 }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = padT + plotH * (1 - p);
              const val = (minV + (maxV - minV) * p).toFixed(1);
              return (
                <g key={i}>
                  <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={padL - 8} y={y + 3} fontSize="9" fill="#94a3b8" textAnchor="end" fontWeight="600">
                    {val}
                  </text>
                </g>
              );
            })}
            {/* Area fill */}
            <path d={area} fill="url(#trendGradBig)" opacity="0.4" />
            {/* Line */}
            <polyline
              points={polyline}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Dots + labels */}
            {values.map((v, i) =>
              v !== null ? (
                <g key={i}>
                  <circle cx={toX(i)} cy={toY(v)} r="5" fill="#7c3aed" stroke="white" strokeWidth="3" />
                  <text x={toX(i)} y={toY(v) - 10} fontSize="10" fill="#6d28d9" textAnchor="middle" fontWeight="800">
                    {v}
                  </text>
                </g>
              ) : null
            )}
            {/* X labels */}
            {labels.map((l, i) => (
              <text key={i} x={toX(i)} y={H - 8} fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="600">
                {l}
              </text>
            ))}
            <defs>
              <linearGradient id="trendGradBig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-100 text-center">
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
              Peak Recorded Rating
            </span>
            <span className="text-2xl font-black text-purple-900">4.6★</span>
            <p className="text-[11px] text-purple-600/80 mt-1">High satisfaction level</p>
          </div>

          <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 text-center">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Average Over Period
            </span>
            <span className="text-2xl font-black text-indigo-900">4.4★</span>
            <p className="text-[11px] text-indigo-600/80 mt-1">Consistently above 4.0 threshold</p>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 text-center">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Growth Trajectory
            </span>
            <span className="text-2xl font-black text-emerald-900">+12%</span>
            <p className="text-[11px] text-emerald-600/80 mt-1">Steady upward momentum</p>
          </div>
        </div>
      </div>
    </div>
  );
}

