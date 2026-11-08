import React, { useState, useMemo, useCallback } from 'react';
import {
  Star, MessageSquare, Bell, LogOut, ChevronDown, BarChart2,
  PieChart, Activity, List, FileText, Menu, X, Filter, Eye,
  ChevronRight, Calendar
} from 'lucide-react';
import { authService } from '../services/authService';
import DateRangePicker from './DateRangePicker';
import ReportModal from './ReportModal';

// Rating Module Pages
import RatingOverviewPage from './rating/RatingOverviewPage';
import RatingHistoryPage from './rating/RatingHistoryPage';
import RatingTrendsPage from './rating/RatingTrendsPage';
import RatingDistributionPage from './rating/RatingDistributionPage';

// Feedback Module Pages
import FeedbackOverviewPage from './feedback/FeedbackOverviewPage';
import FeedbackListPage from './feedback/FeedbackListPage';
import FeedbackDetailsPage from './feedback/FeedbackDetailsPage';
import FeedbackFilterPage from './feedback/FeedbackFilterPage';

export default function OwnerDashboard({ userEmail, onLogout, onPreviewFeedbackForm }) {
  // Navigation State
  // activeModule: 'rating' | 'feedback'
  const [activeModule, setActiveModule] = useState('rating');
  // activeSubpage:
  // For rating: 'rating-overview' | 'rating-history' | 'rating-trends' | 'rating-distribution'
  // For feedback: 'feedback-overview' | 'feedback-list' | 'feedback-details' | 'feedback-filter'
  const [activeSubpage, setActiveSubpage] = useState('rating-overview');

  // Accordion Expand/Collapse State for Sidebar Modules
  const [ratingExpanded, setRatingExpanded] = useState(true);
  const [feedbackExpanded, setFeedbackExpanded] = useState(true);

  // Mobile sidebar drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Single Date Range Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected feedback for inspection
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Reports modal open/close
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Header notifications & user menu
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Master Data Sources
  const [allRatings, setAllRatings] = useState(() => authService.getRatings());
  const [allFeedback, setAllFeedback] = useState(() => authService.getFeedback());

  // Apply Date Range Filter across ratings
  const filteredRatings = useMemo(() => {
    let r = allRatings;
    if (startDate) r = r.filter((item) => item.date >= startDate);
    if (endDate) r = r.filter((item) => item.date <= endDate);
    return r;
  }, [allRatings, startDate, endDate]);

  // Apply Date Range Filter across feedback
  const filteredFeedback = useMemo(() => {
    let f = allFeedback;
    if (startDate) f = f.filter((item) => item.date >= startDate);
    if (endDate) f = f.filter((item) => item.date <= endDate);
    return f;
  }, [allFeedback, startDate, endDate]);

  // Handlers for single date range picker
  const handleApplyDateRange = useCallback((start, end) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleResetDateRange = useCallback(() => {
    setStartDate('');
    setEndDate('');
  }, []);

  // Update status in master dataset
  const handleFeedbackStatusChange = useCallback((id, newStatus) => {
    const updated = authService.updateFeedbackStatus(id, newStatus);
    setAllFeedback(updated);
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
    }
  }, [selectedFeedback]);

  // Submenu Selection Handlers
  const handleSelectRatingPage = (pageKey) => {
    setActiveModule('rating');
    setActiveSubpage(pageKey);
    setMobileMenuOpen(false);
  };

  const handleSelectFeedbackPage = (pageKey) => {
    setActiveModule('feedback');
    setActiveSubpage(pageKey);
    setMobileMenuOpen(false);
  };

  const handleSelectFeedbackForDetail = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setActiveModule('feedback');
    setActiveSubpage('feedback-details');
    setMobileMenuOpen(false);
  };

  const notifications = [
    { id: 1, text: 'New 5-star rating from Rahul Sharma', time: '2m ago' },
    { id: 2, text: 'Priya Kumar left feedback on Store QR', time: '1h ago' },
    { id: 3, text: 'Pooja Mehta complaint needs attention', time: '3h ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* ── MOBILE TOPBAR (Hidden on desktop) ── */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xs">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-none">Owner Dashboard</h1>
              <p className="text-[10px] text-slate-400 font-medium">BizFeedback</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="px-2.5 py-1.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            Reports
          </button>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* ── MOBILE BACKDROP ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── EXPANDABLE & COLLAPSIBLE SIDEBAR NAVIGATION ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/20 text-white">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 block">
                  BizFeedback
                </span>
                <h1 className="text-base font-black text-slate-900 leading-tight">
                  Owner Dashboard
                </h1>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-185px)]">
            {/* ── MODULE 1: RATING ── */}
            <div className="space-y-1">
              {/* Expandable Module Header Button */}
              <button
                onClick={() => setRatingExpanded(!ratingExpanded)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeModule === 'rating'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className={`w-4 h-4 ${activeModule === 'rating' ? 'fill-white text-white' : 'text-purple-600'}`} />
                  <span className="text-sm">Rating</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    ratingExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Collapsible Submenu Options */}
              {ratingExpanded && (
                <div className="pl-3 pt-1 space-y-1 border-l-2 border-purple-100 ml-4 animate-fadeIn">
                  {/* 1. Rating Overview */}
                  <button
                    onClick={() => handleSelectRatingPage('rating-overview')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'rating' && activeSubpage === 'rating-overview'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <PieChart className="w-3.5 h-3.5" />
                    <span>Rating Overview</span>
                  </button>

                  {/* 2. Rating History */}
                  <button
                    onClick={() => handleSelectRatingPage('rating-history')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'rating' && activeSubpage === 'rating-history'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Rating History</span>
                  </button>

                  {/* 3. Rating Trends */}
                  <button
                    onClick={() => handleSelectRatingPage('rating-trends')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'rating' && activeSubpage === 'rating-trends'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Rating Trends</span>
                  </button>

                  {/* 4. Rating Distribution */}
                  <button
                    onClick={() => handleSelectRatingPage('rating-distribution')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'rating' && activeSubpage === 'rating-distribution'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Rating Distribution</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── MODULE 2: FEEDBACK ── */}
            <div className="space-y-1 pt-1">
              {/* Expandable Module Header Button */}
              <button
                onClick={() => setFeedbackExpanded(!feedbackExpanded)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeModule === 'feedback'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare
                    className={`w-4 h-4 ${activeModule === 'feedback' ? 'text-white' : 'text-purple-600'}`}
                  />
                  <span className="text-sm">Feedback</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    feedbackExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Collapsible Submenu Options */}
              {feedbackExpanded && (
                <div className="pl-3 pt-1 space-y-1 border-l-2 border-purple-100 ml-4 animate-fadeIn">
                  {/* 1. Feedback Overview */}
                  <button
                    onClick={() => handleSelectFeedbackPage('feedback-overview')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'feedback' && activeSubpage === 'feedback-overview'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <PieChart className="w-3.5 h-3.5" />
                    <span>Feedback Overview</span>
                  </button>

                  {/* 2. Feedback List */}
                  <button
                    onClick={() => handleSelectFeedbackPage('feedback-list')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'feedback' && activeSubpage === 'feedback-list'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Feedback List</span>
                  </button>

                  {/* 3. Feedback Details */}
                  <button
                    onClick={() => handleSelectFeedbackPage('feedback-details')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'feedback' && activeSubpage === 'feedback-details'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Feedback Details</span>
                  </button>

                  {/* 4. Feedback Filter */}
                  <button
                    onClick={() => handleSelectFeedbackPage('feedback-filter')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeModule === 'feedback' && activeSubpage === 'feedback-filter'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Feedback Filter</span>
                  </button>
                </div>
              )}
            </div>

            {/* ── REPORTS & CUSTOMER FORM IN SIDEBAR ── */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => {
                  setReportModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 bg-slate-50/70 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span>Executive Reports</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  Date Range
                </span>
              </button>

              {onPreviewFeedbackForm && (
                <button
                  onClick={onPreviewFeedbackForm}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-purple-700 hover:bg-purple-100 border border-purple-200 bg-purple-50/60 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-purple-600 fill-purple-600 group-hover:scale-110 transition-transform" />
                    <span>Customer Feedback Form</span>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                    Live
                  </span>
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Owner Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-none truncate">Super Admin</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="w-8 h-8 rounded-xl hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Owner Dashboard
              <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                {activeModule === 'rating' ? 'Rating Module' : 'Feedback Module'}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Isolated subpages with dedicated views and interactive single Date Range filtering.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Single Date Range Selector in Topbar */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onApply={handleApplyDateRange}
              onReset={handleResetDateRange}
            />

            {/* Reports Generator Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm shadow-purple-500/20 transition active:scale-98"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>

            {/* Customer Feedback Form Preview Button */}
            {onPreviewFeedbackForm && (
              <button
                onClick={onPreviewFeedbackForm}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-2xl border border-purple-200 shadow-xs transition active:scale-98"
              >
                <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
                <span>Customer Form</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setShowUserMenu(false);
                }}
                className="relative w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-slate-600"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-3xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fadeIn">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-5 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer"
                    >
                      <p className="text-xs text-slate-800 font-semibold">{n.text}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition"
              >
                <div className="w-7 h-7 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                  SA
                </div>
                <span className="text-xs font-bold text-slate-700">Super Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden p-1.5 animate-fadeIn">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Store Owner</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{userEmail}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full px-3.5 py-2.5 text-left flex items-center gap-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── ISOLATED MAIN CONTENT PAGES (Only selected page is rendered!) ── */}
        <main
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
          onClick={() => {
            setNotifOpen(false);
            setShowUserMenu(false);
          }}
        >
          {/* RATING MODULE SUBPAGES */}
          {activeModule === 'rating' && activeSubpage === 'rating-overview' && (
            <RatingOverviewPage
              ratings={filteredRatings}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
            />
          )}

          {activeModule === 'rating' && activeSubpage === 'rating-history' && (
            <RatingHistoryPage
              ratings={filteredRatings}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
            />
          )}

          {activeModule === 'rating' && activeSubpage === 'rating-trends' && (
            <RatingTrendsPage
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
            />
          )}

          {activeModule === 'rating' && activeSubpage === 'rating-distribution' && (
            <RatingDistributionPage
              ratings={filteredRatings}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
            />
          )}

          {/* FEEDBACK MODULE SUBPAGES */}
          {activeModule === 'feedback' && activeSubpage === 'feedback-overview' && (
            <FeedbackOverviewPage
              feedbackList={filteredFeedback}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
            />
          )}

          {activeModule === 'feedback' && activeSubpage === 'feedback-list' && (
            <FeedbackListPage
              feedbackList={filteredFeedback}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
              onSelectFeedback={handleSelectFeedbackForDetail}
            />
          )}

          {activeModule === 'feedback' && activeSubpage === 'feedback-details' && (
            <FeedbackDetailsPage
              feedbackList={filteredFeedback}
              selectedFeedback={selectedFeedback}
              onSelectFeedback={setSelectedFeedback}
              onStatusChange={handleFeedbackStatusChange}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
            />
          )}

          {activeModule === 'feedback' && activeSubpage === 'feedback-filter' && (
            <FeedbackFilterPage
              feedbackList={filteredFeedback}
              startDate={startDate}
              endDate={endDate}
              onApplyDateRange={handleApplyDateRange}
              onResetDateRange={handleResetDateRange}
              onSelectFeedback={handleSelectFeedbackForDetail}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs font-medium text-slate-400 border-t border-slate-200/70 bg-white">
          BizFeedback &copy; {new Date().getFullYear()} • Owner Dashboard • Rating &amp; Feedback Management
        </footer>
      </div>

      {/* ── REPORTS GENERATION MODAL ── */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
