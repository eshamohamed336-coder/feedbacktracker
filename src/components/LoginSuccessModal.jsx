import React from 'react';
import { CheckCircle2, Store, Star, TrendingUp, Users, LogOut, ArrowRight } from 'lucide-react';

export default function LoginSuccessModal({ userEmail, onLogout }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-8 text-center animate-scaleUp">
        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back, Owner!
        </h2>
        <p className="text-slate-500 text-sm mt-1.5 mb-6">
          Successfully authenticated as <span className="font-semibold text-blue-600">{userEmail}</span>
        </p>

        {/* Dashboard Quick Preview Metrics */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-100/80 mb-6 text-left">
          <div className="bg-white p-3 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Avg. Rating</p>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>1,248</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Total Reviews</p>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>+18.4%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Monthly Growth</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onLogout}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Log Out (Test Again)
          </button>
          <button
            onClick={() => alert('Demo Dashboard initialized! Connected to BizFeedback API.')}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

