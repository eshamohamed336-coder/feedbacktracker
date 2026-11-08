import React, { useState, useMemo } from 'react';
import { authService, MONTHLY_TREND_DATA } from '../services/authService';
import {
  Star, Calendar, Filter, TrendingUp, TrendingDown,
  Users, ThumbsUp, Clock, ChevronDown, BarChart2,
  PieChart, Activity, List, RefreshCw, FileText
} from 'lucide-react';

// ── Star renderer ──────────────────────────────────────────────────────────────
function Stars({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sz} ${
            i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
          }`}
        />
      ))}
    </span>
  );
}

// ── Donut Chart (SVG) ──────────────────────────────────────────────────────────
function DonutChart({ data, avg }) {
  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#94a3b8', '#ef4444'];
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let offset = 0;
  const radius = 54, cx = 70, cy = 70, circumference = 2 * Math.PI * radius;
  const slices = data.map((d, i) => {
    const pct = d.count / total;
    const dash = pct * circumference;
    const slice = { ...d, dash, offset, color: COLORS[i] };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={140} height={140} viewBox="0 0 140 140" className="shrink-0">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={20} />
        {total > 0 &&
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
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">
          {avg}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
          Out of 5
        </text>
      </svg>
      <div className="space-y-2 w-full">
        {data.map((d, i) => {
          const pct = Math.round((d.count / (data.reduce((s, x) => s + x.count, 0) || 1)) * 100);
          return (
            <div key={i} className="flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
              <span className="text-slate-700 font-bold w-6">{5 - i}★</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: COLORS[i] }}
                />
              </div>
              <span className="text-slate-600 font-bold w-9 text-right">{pct}%</span>
              <span className="text-slate-400 w-8 text-right font-medium">({d.count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Line Trend Chart (SVG) ─────────────────────────────────────────────────────
function LineTrendChart({ trendKey }) {
  const data = MONTHLY_TREND_DATA[trendKey] || MONTHLY_TREND_DATA['6months'];
  const { labels, values } = data;
  const validVals = values.filter((v) => v !== null);
  const minV = Math.min(...validVals) - 0.3;
  const maxV = Math.max(...validVals) + 0.3;
  const W = 460, H = 140, padL = 32, padR = 15, padT = 15, padB = 30;
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
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      {/* Grid lines */}
      {[0, 0.33, 0.66, 1].map((p, i) => {
        const y = padT + plotH * (1 - p);
        const val = (minV + (maxV - minV) * p).toFixed(1);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padL - 6} y={y + 3} fontSize="9" fill="#94a3b8" textAnchor="end" fontWeight="600">
              {val}
            </text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={area} fill="url(#trendGrad)" opacity="0.35" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dots + labels */}
      {values.map((v, i) =>
        v !== null ? (
          <g key={i}>
            <circle cx={toX(i)} cy={toY(v)} r="4.5" fill="#7c3aed" stroke="white" strokeWidth="2.5" />
            <text x={toX(i)} y={toY(v) - 9} fontSize="9" fill="#6d28d9" textAnchor="middle" fontWeight="800">
              {v}
            </text>
          </g>
        ) : null
      )}
      {/* X labels */}
      {labels.map((l, i) => (
        <text key={i} x={toX(i)} y={H - 6} fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="600">
          {l}
        </text>
      ))}
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Bar Distribution Chart (SVG) ───────────────────────────────────────────────
function BarChart({ distData }) {
  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#94a3b8', '#ef4444'];
  const maxCount = Math.max(...distData.map((d) => d.count), 1);
  const W = 360, H = 120, barW = 38, gap = 20;
  const totalW = distData.length * (barW + gap) - gap;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
      {distData.map((d, i) => {
        const x = startX + i * (barW + gap);
        const barH = Math.max((d.count / maxCount) * 75, 4);
        const y = 82 - barH;
        const pct = Math.round((d.count / (distData.reduce((s, x) => s + x.count, 0) || 1)) * 100);
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="8" fill={COLORS[i]} />
            <text x={x + barW / 2} y={y - 5} fontSize="10" fill={COLORS[i]} textAnchor="middle" fontWeight="800">
              {pct}%
            </text>
            <text x={x + barW / 2} y={97} fontSize="10" fill="#334155" textAnchor="middle" fontWeight="700">
              {5 - i}★
            </text>
            <text x={x + barW / 2} y={110} fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="500">
              {d.count} reviews
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Specific Requested KPI Card ────────────────────────────────────────────────
function KpiCard({ icon: Icon, iconBg, label, value, sub, positive }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex items-start gap-3.5 hover:shadow-md transition">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        {sub && (
          <p
            className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
              positive ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {sub}
          </p>
        )}
      </div>
    </div>
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

// ── Main Ratings Dashboard Component ───────────────────────────────────────────
export default function RatingsDashboardView({ activeSection = 'overview', onOpenReports }) {
  const allRatings = authService.getRatings();

  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');
  const [filterError, setFilterError] = useState('');

  // Sub-navigation & Controls
  const [currentSubTab, setCurrentSubTab] = useState(activeSection || 'overview');
  const [trendRange, setTrendRange] = useState('6months');
  const [starFilter, setStarFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter logic
  const filteredRatings = useMemo(() => {
    let r = allRatings;
    if (appliedStart) r = r.filter((x) => x.date >= appliedStart);
    if (appliedEnd) r = r.filter((x) => x.date <= appliedEnd);
    return r;
  }, [allRatings, appliedStart, appliedEnd]);

  // History table filtering
  const tableRatings = useMemo(() => {
    let r = filteredRatings;
    if (starFilter !== 'all') r = r.filter((x) => x.rating === Number(starFilter));
    return sortOrder === 'desc'
      ? [...r].sort((a, b) => b.date.localeCompare(a.date))
      : [...r].sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredRatings, starFilter, sortOrder]);

  // Computed stats from filtered data
  const stats = useMemo(() => {
    const total = filteredRatings.length;
    const avg = total ? (filteredRatings.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0.0';
    const positiveCount = filteredRatings.filter((r) => r.rating >= 4).length;
    const positivePct = total ? Math.round((positiveCount / total) * 100) : 0;

    const prevRatings = appliedStart
      ? allRatings.filter((r) => r.date < appliedStart)
      : allRatings.filter((r) => !filteredRatings.includes(r));
    const prevAvg = prevRatings.length
      ? (prevRatings.reduce((s, r) => s + r.rating, 0) / prevRatings.length).toFixed(1)
      : '4.2';

    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: filteredRatings.filter((r) => r.rating === star).length,
    }));

    return { total, avg, positivePct, prevAvg, dist };
  }, [filteredRatings, appliedStart, allRatings]);

  function applyFilter() {
    if (startDate && endDate && startDate > endDate) {
      setFilterError('Start date must be before end date.');
      return;
    }
    setFilterError('');
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  }

  function clearFilter() {
    setStartDate('');
    setEndDate('');
    setAppliedStart('');
    setAppliedEnd('');
    setFilterError('');
  }

  const subTabs = [
    { id: 'overview', label: 'Rating Overview', icon: PieChart },
    { id: 'trends', label: 'Rating Trends', icon: Activity },
    { id: 'distribution', label: 'Rating Distribution', icon: BarChart2 },
    { id: 'history', label: 'Rating History', icon: List },
  ];

  const trendOptions = [
    { value: '1month', label: 'Last 1 Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last 1 Year' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Heading Banner with Quick Report Button ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 fill-purple-600 text-purple-600" />
            Rating Tracker &amp; Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time customer rating metrics, historical ratings, and trend evaluation.
          </p>
        </div>

        {onOpenReports && (
          <button
            onClick={onOpenReports}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-500/20 transition active:scale-98"
          >
            <FileText className="w-4 h-4" />
            Generate Rating Report
          </button>
        )}
      </div>

      {/* ── Date Range Filter Bar ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            Date Range &amp; Filter Functionality
          </span>
          {(appliedStart || appliedEnd) && (
            <span className="text-xs text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full font-bold">
              Active: {appliedStart || 'Start'} → {appliedEnd || 'Today'} ({stats.total} entries)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Start Date</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 bg-slate-50 focus-within:ring-2 focus-within:ring-purple-400 transition">
              <Calendar className="w-4 h-4 text-slate-400" />
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
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <button
            onClick={applyFilter}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-sm transition active:scale-95"
          >
            <Filter className="w-4 h-4" /> Apply Filter
          </button>

          {(appliedStart || appliedEnd) && (
            <button
              onClick={clearFilter}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-2xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Filter
            </button>
          )}
        </div>
        {filterError && <p className="text-xs text-rose-500 font-semibold">{filterError}</p>}
      </div>

      {/* ── 4 Key KPI Cards (Rating Average, Rating Total, Rating Positive, Previous Month Rating) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating Average */}
        <KpiCard
          icon={Star}
          iconBg="bg-amber-50 text-amber-500"
          label="Rating Average"
          value={`${stats.avg} / 5`}
          sub="+0.2 this period"
          positive
        />

        {/* Rating Total */}
        <KpiCard
          icon={Users}
          iconBg="bg-indigo-50 text-indigo-600"
          label="Rating Total"
          value={stats.total.toLocaleString()}
          sub="+12% growth"
          positive
        />

        {/* Rating Positive */}
        <KpiCard
          icon={ThumbsUp}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Rating Positive"
          value={`${stats.positivePct}%`}
          sub="+3% favorable"
          positive
        />

        {/* Previous Month Rating */}
        <KpiCard
          icon={Clock}
          iconBg="bg-purple-50 text-purple-600"
          label="Previous Month Rating"
          value={`${stats.prevAvg} / 5`}
          sub="+0.1 vs past"
          positive
        />
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl w-fit flex-wrap">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setCurrentSubTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Rating Overview ── */}
      {currentSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn">
          {/* Donut Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-800">Rating Overview</h3>
            </div>
            <DonutChart data={stats.dist} avg={stats.avg} />
          </div>

          {/* Trends Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">Rating Trends</h3>
              </div>
              <select
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value)}
                className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-purple-400 outline-none"
              >
                {trendOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <LineTrendChart trendKey={trendRange} />
          </div>

          {/* Distribution Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">Rating Distribution</h3>
                <span className="text-xs text-slate-400">({stats.total} total responses)</span>
              </div>
            </div>
            <BarChart distData={stats.dist} />
          </div>
        </div>
      )}

      {/* ── TAB 2: Rating Trends ── */}
      {currentSubTab === 'trends' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Rating Trends Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Rating evolution across multiple time periods.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {trendOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setTrendRange(o.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    trendRange === o.value
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <LineTrendChart trendKey={trendRange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">Peak Rating</span>
              <span className="text-2xl font-black text-purple-900">4.6★</span>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4 text-center border border-indigo-100">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Average Across Trend</span>
              <span className="text-2xl font-black text-indigo-900">4.4★</span>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Growth Momentum</span>
              <span className="text-2xl font-black text-emerald-900">+12%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Rating Distribution ── */}
      {currentSubTab === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" /> Donut Ratio
            </h3>
            <DonutChart data={stats.dist} avg={stats.avg} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-600" /> Star Breakdown (1 to 5)
            </h3>
            <BarChart distData={stats.dist} />
            <div className="space-y-2.5 pt-2">
              {stats.dist.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Stars rating={d.star} />
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((d.count / (stats.total || 1)) * 100)}%`,
                        background: ['#10b981', '#6366f1', '#f59e0b', '#94a3b8', '#ef4444'][i],
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{d.count}</span>
                  <span className="text-xs font-medium text-slate-400 w-10 text-right">
                    {Math.round((d.count / (stats.total || 1)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: Rating History ── */}
      {currentSubTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <List className="w-4 h-4 text-purple-600" /> Rating History Log
              </h3>
              <p className="text-xs text-slate-400">{tableRatings.length} customer records displayed</p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Stars</option>
                {[5, 4, 3, 2, 1].map((s) => (
                  <option key={s} value={s}>{s}★ Only</option>
                ))}
              </select>

              <button
                onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
                className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-left w-12">#</th>
                  <th className="px-5 py-3.5 text-left">Customer</th>
                  <th className="px-5 py-3.5 text-left">Rating</th>
                  <th className="px-5 py-3.5 text-left">Comment</th>
                  <th className="px-5 py-3.5 text-left">Date</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRatings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No ratings recorded for this date range.
                    </td>
                  </tr>
                ) : (
                  tableRatings.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 text-xs font-bold">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
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
                      <td className="px-5 py-3.5">
                        <Stars rating={r.rating} />
                      </td>
                      <td className="px-5 py-3.5 max-w-xs">
                        <p className="text-xs text-slate-600 truncate">{r.comment || '—'}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={r.feedbackStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
