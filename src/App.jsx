import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import LoginForm from './components/LoginForm';
import OwnerDashboard from './components/OwnerDashboard';
import CustomerFeedbackForm from './components/CustomerFeedbackForm';
import { Star, Check, ChevronDown, ChevronUp, MessageSquareHeart } from 'lucide-react';
import StoreIllustration from './components/StoreIllustration';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showMobilePerks, setShowMobilePerks] = useState(false);
  // 'login' | 'customer-feedback'
  const [viewMode, setViewMode] = useState('login');

  const benefits = [
    'Track customer ratings',
    'Analyze feedback trends',
    'Grow your business',
  ];

  // Auto-detect if customer opened via unique WhatsApp link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'feedback' || params.get('token') || params.get('ref')) {
        setViewMode('customer-feedback');
      }
    } catch {}
  }, []);

  // If owner is authenticated, show Owner Dashboard
  if (currentUser) {
    return (
      <OwnerDashboard
        userEmail={currentUser.email}
        onLogout={() => {
          setCurrentUser(null);
          setViewMode('login');
        }}
        onPreviewFeedbackForm={() => setViewMode('customer-feedback')}
      />
    );
  }

  // If viewing Customer Feedback Form
  if (viewMode === 'customer-feedback') {
    return (
      <CustomerFeedbackForm
        onBackToLogin={() => setViewMode('login')}
      />
    );
  }

  // Otherwise, render Owner Login Portal (with Customer Form Tab)
  return (
    <div className="relative min-h-screen w-full bg-[#eef5ff] overflow-x-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Soft Background Organic Gradient Shapes matching reference image */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-blue-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-[32rem] h-[32rem] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-[36rem] h-[36rem] bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      {/* Main Split-Screen Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Desktop Left Column: Brand Hero & 3D Store Artwork */}
          <div className="hidden lg:block lg:col-span-7">
            <HeroSection />
          </div>

          {/* Mobile Top Header (only on mobile screens < lg) */}
          <div className="block lg:hidden text-center mb-2">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-2xl rounded-bl-sm flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Star className="w-5 h-5 fill-white stroke-none" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                BizFeedback
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ratings &amp; Feedback Management
            </p>
          </div>

          {/* Right Column: Owner Login & Customer Form Card */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <div className="w-full max-w-md">
              <LoginForm 
                onLoginSuccess={(user) => setCurrentUser(user)}
                onOpenCustomerFeedbackForm={() => setViewMode('customer-feedback')}
              />
            </div>
          </div>

          {/* Mobile Bottom Expandable Benefits Section */}
          <div className="block lg:hidden w-full max-w-md mx-auto mt-2">
            <button
              onClick={() => setShowMobilePerks(!showMobilePerks)}
              className="w-full py-2.5 px-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-blue-100 flex items-center justify-between text-xs font-semibold text-slate-700 shadow-xs"
            >
              <span>Why BizFeedback? View Features</span>
              {showMobilePerks ? (
                <ChevronUp className="w-4 h-4 text-blue-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {showMobilePerks && (
              <div className="mt-3 p-4 bg-white/95 rounded-2xl border border-blue-100 shadow-lg space-y-3 animate-fadeIn">
                <h3 className="text-base font-bold text-slate-900">Welcome Back!</h3>
                <p className="text-xs text-slate-500">
                  Sign in to manage your business feedback and ratings.
                </p>
                <div className="space-y-2 pt-1">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <StoreIllustration />
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 px-6 text-center">
        <p className="text-xs font-medium text-slate-400">
          BizFeedback &copy; {new Date().getFullYear()} • Secure Owner Portal
        </p>
      </footer>
    </div>
  );
}
