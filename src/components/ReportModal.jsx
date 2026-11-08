import React, { useState, useMemo } from 'react';
import {
  Calendar, FileText, Download, Printer, X, CheckCircle,
  Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Filter, AlertCircle
} from 'lucide-react';
import { authService } from '../services/authService';

export default function ReportModal({ isOpen, onClose }) {
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const allRatings = authService.getRatings();
  const allFeedback = authService.getFeedback();

  // Quick Presets
  const setPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setGenerated(false);
  };

  const setAllTime = () => {
    setStartDate('2026-01-01');
    setEndDate(new Date().toISOString().split('T')[0]);
    setGenerated(false);
  };

  // Generate metrics based on selected date range
  const reportData = useMemo(() => {
    const filteredRatings = allRatings.filter(r => {
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });

    const filteredFeedback = allFeedback.filter(f => {
      if (startDate && f.date < startDate) return false;
      if (endDate && f.date > endDate) return false;
      return true;
    });

    const totalRatings = filteredRatings.length;
    const avgRating = totalRatings
      ? (filteredRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(2)
      : '0.00';

    const positiveRatings = filteredRatings.filter(r => r.rating >= 4).length;
    const positivePct = totalRatings ? Math.round((positiveRatings / totalRatings) * 100) : 0;

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredRatings.forEach(r => {
      if (starCounts[r.rating] !== undefined) starCounts[r.rating]++;
    });

    const positiveFeedbackCount = filteredFeedback.filter(f => f.feedbackType === 'Positive').length;
    const negativeFeedbackCount = filteredFeedback.filter(f => f.feedbackType === 'Negative').length;
    const pendingFeedbackCount = filteredFeedback.filter(f => f.status === 'Pending').length;
    const resolvedFeedbackCount = filteredFeedback.filter(f => f.status === 'Resolved').length;

    return {
      filteredRatings,
      filteredFeedback,
      totalRatings,
      avgRating,
      positiveRatings,
      positivePct,
      starCounts,
      positiveFeedbackCount,
      negativeFeedbackCount,
      pendingFeedbackCount,
      resolvedFeedbackCount,
    };
  }, [allRatings, allFeedback, startDate, endDate]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 450);
  };

  const handleDownloadCSV = () => {
    const headers = ['Category,Record ID,Customer,Rating,Date,Type/Status,Comment'];
    const rows = [
      ...reportData.filteredRatings.map(r =>
        `Rating,${r.id},"${r.customer}",${r.rating},${r.date},"${r.feedbackStatus}","${(r.comment || '').replace(/"/g, '""')}"`
      ),
      ...reportData.filteredFeedback.map(f =>
        `Feedback,${f.id},"${f.customer}",${f.rating},${f.date},"${f.status}","${(f.comment || '').replace(/"/g, '""')}"`
      ),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BizFeedback_Owner_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Generate Business Report</h2>
              <p className="text-xs text-purple-200">Owner Executive Ratings &amp; Feedback Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-white/15 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Date Range Selection Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Select Date Range for Report
              </label>
              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPreset(7)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition"
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(30)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition"
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  onClick={setAllTime}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition"
                >
                  All Time
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-600 mb-1 block">Start Date:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setGenerated(false);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 mb-1 block">End Date:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setGenerated(false);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Comprehensive Report...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Report for Selected Range
                </>
              )}
            </button>
          </div>

          {/* Generated Report View */}
          {generated && (
            <div className="space-y-6 animate-fadeIn border-t border-slate-200 pt-4">
              {/* Report Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50 border border-purple-200/80 rounded-2xl p-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Report Ready
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Period: {startDate} to {endDate}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated from {reportData.totalRatings} ratings and {reportData.filteredFeedback.length} customer feedback records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-600" />
                    Download CSV
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / PDF
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Avg Rating</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-slate-900">{reportData.avgRating}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Out of 5.0</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Total Ratings</span>
                  <span className="text-2xl font-black text-slate-900">{reportData.totalRatings}</span>
                  <span className="text-[11px] text-purple-600 font-semibold mt-1 block">In selected range</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Positive Ratio</span>
                  <span className="text-2xl font-black text-emerald-600">{reportData.positivePct}%</span>
                  <span className="text-[11px] text-slate-400 font-semibold mt-1 block">{reportData.positiveRatings} high ratings</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Total Feedback</span>
                  <span className="text-2xl font-black text-indigo-600">{reportData.filteredFeedback.length}</span>
                  <span className="text-[11px] text-amber-600 font-semibold mt-1 block">{reportData.pendingFeedbackCount} Pending</span>
                </div>
              </div>

              {/* Rating Distribution Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Star Distribution Breakdown ({startDate} – {endDate})
                </h4>
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reportData.starCounts[star] || 0;
                    const pct = reportData.totalRatings ? Math.round((count / reportData.totalRatings) * 100) : 0;
                    const colors = {
                      5: 'bg-emerald-500',
                      4: 'bg-indigo-500',
                      3: 'bg-amber-500',
                      2: 'bg-slate-400',
                      1: 'bg-rose-500',
                    };
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                          {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                        </span>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors[star]} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-semibold text-slate-700">{count}</span>
                        <span className="w-12 text-right font-medium text-slate-400">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Feedback Highlights */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Customer Feedback Highlights in this Period
                </h4>
                {reportData.filteredFeedback.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No feedback records found for this date range.</p>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {reportData.filteredFeedback.slice(0, 5).map((f) => (
                      <div key={f.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{f.customer}</span>
                          <span className="text-[11px] text-slate-400">{f.date}</span>
                        </div>
                        <p className="text-slate-600 italic">"{f.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">BizFeedback Analytics Engine • Owner Portal</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

