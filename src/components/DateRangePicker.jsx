import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Check, RotateCcw } from 'lucide-react';

export default function DateRangePicker({ startDate, endDate, onApply, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || '');
  const [tempEnd, setTempEnd] = useState(endDate || '');
  const [error, setError] = useState('');
  const popoverRef = useRef(null);

  // Sync internal state when props change
  useEffect(() => {
    setTempStart(startDate || '');
    setTempEnd(endDate || '');
  }, [startDate, endDate]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', type: 'thisMonth' },
    { label: 'All Records', type: 'all' },
  ];

  const handlePresetSelect = (preset) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset.type === 'all') {
      setTempStart('2026-01-01');
      setTempEnd(todayStr);
      setError('');
      return;
    }

    if (preset.type === 'thisMonth') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      setTempStart(`${year}-${month}-01`);
      setTempEnd(todayStr);
      setError('');
      return;
    }

    if (preset.days === 0) {
      setTempStart(todayStr);
      setTempEnd(todayStr);
      setError('');
      return;
    }

    const past = new Date();
    past.setDate(today.getDate() - preset.days);
    setTempStart(past.toISOString().split('T')[0]);
    setTempEnd(todayStr);
    setError('');
  };

  const handleApply = () => {
    if (tempStart && tempEnd && tempStart > tempEnd) {
      setError('Start date cannot be after End date');
      return;
    }
    setError('');
    onApply(tempStart, tempEnd);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStart('');
    setTempEnd('');
    setError('');
    if (onReset) onReset();
    setIsOpen(false);
  };

  // Format label to display in the single selector input
  const formatDisplay = () => {
    if (!startDate && !endDate) return 'Select Date Range';
    if (startDate && !endDate) return `From ${startDate}`;
    if (!startDate && endDate) return `Until ${endDate}`;
    return `${startDate}  ➔  ${endDate}`;
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* ── SINGLE DATE RANGE SELECTOR BUTTON ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
          isOpen || startDate || endDate
            ? 'bg-purple-50 text-purple-800 border-purple-300 ring-2 ring-purple-100'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <CalendarIcon className="w-4 h-4 text-purple-600 shrink-0" />
        <span className="tracking-tight">{formatDisplay()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ── DROPDOWN DATE RANGE CALENDAR POPUP ── */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 p-5 space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
                Select Date Range
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Filter records across the dashboard</p>
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Quick Range Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Date Range Inputs inside single picker */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date</label>
              <input
                type="date"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
              <input
                type="date"
                value={tempEnd}
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

          {/* Apply Button */}
          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

