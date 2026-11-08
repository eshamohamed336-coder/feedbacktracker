import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Loader2, 
  AlertCircle, ShieldAlert, Clock, RefreshCw, 
  UserX, AlertTriangle, MessageSquare
} from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';
import CustomerWhatsAppSender from './CustomerWhatsAppSender';
import { authService, MAX_FAILED_ATTEMPTS } from '../services/authService';

export default function LoginForm({ onLoginSuccess, onOpenCustomerFeedbackForm }) {
  // Option Tab: 'owner-login' | 'customer-form'
  const [activeTab, setActiveTab] = useState('owner-login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Security validation states
  const [errorState, setErrorState] = useState({
    type: null, // 'INVALID_EMAIL', 'INVALID_PASSWORD', 'ACCOUNT_LOCKED', 'VALIDATION_ERROR'
    title: '',
    message: '',
    remainingAttempts: null
  });

  // Account lockout countdown timer
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const countdownIntervalRef = useRef(null);

  // Load remembered email
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('bizfeedback_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
        checkLockoutStatus(savedEmail);
      }
    } catch {
      // ignore
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Check lockout on email change
  const checkLockoutStatus = (targetEmail) => {
    if (!targetEmail || !targetEmail.includes('@')) {
      setLockoutRemaining(0);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    const status = authService.getLockoutStatus(targetEmail);
    if (status.isLocked && status.remainingSeconds > 0) {
      startCountdown(status.remainingSeconds);
      setErrorState({
        type: 'ACCOUNT_LOCKED',
        title: 'Owner Account Temporarily Locked',
        message: `This account is locked due to ${MAX_FAILED_ATTEMPTS} failed login attempts. Please wait for the security countdown to finish.`,
        remainingAttempts: 0
      });
    } else {
      setLockoutRemaining(0);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
  };

  const startCountdown = (initialSeconds) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setLockoutRemaining(initialSeconds);

    countdownIntervalRef.current = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setErrorState({
            type: null,
            title: '',
            message: '',
            remainingAttempts: null
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (errorState.type) {
      setErrorState({ type: null, title: '', message: '', remainingAttempts: null });
    }
    checkLockoutStatus(val);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorState.type && errorState.type !== 'ACCOUNT_LOCKED') {
      setErrorState({ type: null, title: '', message: '', remainingAttempts: null });
    }
  };

  const handleUnlockManual = () => {
    if (email) {
      authService.unlockAccount(email);
      setLockoutRemaining(0);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setErrorState({
        type: null,
        title: '',
        message: '',
        remainingAttempts: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lockoutRemaining > 0) {
      return;
    }

    if (!email.trim()) {
      setErrorState({
        type: 'VALIDATION_ERROR',
        title: 'Missing Email',
        message: 'Please enter your registered Business Owner email address.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorState({
        type: 'VALIDATION_ERROR',
        title: 'Invalid Email Format',
        message: 'Please enter a valid email format (e.g. owner@bizfeedback.com).'
      });
      return;
    }

    if (!password) {
      setErrorState({
        type: 'VALIDATION_ERROR',
        title: 'Missing Password',
        message: 'Please enter your password to proceed.'
      });
      return;
    }

    setIsLoading(true);
    setErrorState({ type: null, title: '', message: '', remainingAttempts: null });

    // Authenticate through Owner AuthService
    const result = await authService.login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (rememberMe) {
        try {
          localStorage.setItem('bizfeedback_remembered_email', email);
        } catch {}
      } else {
        try {
          localStorage.removeItem('bizfeedback_remembered_email');
        } catch {}
      }
      onLoginSuccess(result.user);
    } else {
      if (result.errorType === 'ACCOUNT_LOCKED') {
        startCountdown(result.remainingSeconds);
        setErrorState({
          type: 'ACCOUNT_LOCKED',
          title: result.title,
          message: result.message,
          remainingAttempts: 0
        });
      } else if (result.errorType === 'INVALID_EMAIL') {
        setErrorState({
          type: 'INVALID_EMAIL',
          title: result.title,
          message: result.message,
          remainingAttempts: null
        });
      } else if (result.errorType === 'INVALID_PASSWORD') {
        setErrorState({
          type: 'INVALID_PASSWORD',
          title: result.title,
          message: result.message,
          remainingAttempts: result.remainingAttempts
        });
      }
    }
  };

  const isLocked = lockoutRemaining > 0;

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl shadow-blue-500/10 border border-slate-100 p-6 sm:p-10 transition-all duration-300">
        
        {/* Navigation Option Switcher: Owner Login vs Customer Form */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('owner-login')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'owner-login'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Owner Login</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customer-form')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'customer-form'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Form</span>
          </button>
        </div>

        {/* ── CUSTOMER FORM OPTION (ENTER THE NUMBER) ── */}
        {activeTab === 'customer-form' ? (
          <CustomerWhatsAppSender onOpenFeedbackForm={onOpenCustomerFeedbackForm} />
        ) : (
          /* ── OWNER LOGIN OPTION ── */
          <>
            {/* Top Floating Circular Storefront Badge */}
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform duration-300 ${
                  isLocked 
                    ? 'bg-gradient-to-b from-rose-500 to-rose-600 shadow-rose-500/30' 
                    : 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-blue-500/30 group-hover:scale-105'
                }`}>
                  {isLocked ? (
                    <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
                  ) : (
                    <svg
                      viewBox="0 0 48 48"
                      className="w-9 h-9 sm:w-11 sm:h-11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 20 L38 20 L36 12 L12 12 Z" fill="white" />
                      <circle cx="13.5" cy="20" r="3.5" fill="white" />
                      <circle cx="20.5" cy="20" r="3.5" fill="white" />
                      <circle cx="27.5" cy="20" r="3.5" fill="white" />
                      <circle cx="34.5" cy="20" r="3.5" fill="white" />
                      <rect x="12" y="23" width="24" height="15" rx="2" stroke="white" strokeWidth="3" fill="none" />
                      <rect x="15" y="27" width="7" height="7" rx="1" fill="white" />
                      <rect x="25" y="27" width="8" height="11" rx="1" fill="white" />
                    </svg>
                  )}
                </div>

                {/* Lock badge indicator */}
                {isLocked && (
                  <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md">
                    <Lock className="w-4 h-4 text-rose-600" />
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 sm:mt-5 tracking-tight">
                {isLocked ? 'Owner Account Locked' : 'Owner Login'}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
                {isLocked ? 'Maximum login attempts exceeded' : 'Access your dashboard'}
              </p>
            </div>

        {/* LIVE ACCOUNT LOCKOUT BANNER (Triggered only after 3 failed attempts) */}
        {isLocked && (
          <div className="mt-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 space-y-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-900">
                  Owner Security Lockout Active
                </h4>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                  Too many incorrect password attempts. This portal is temporarily locked to defend against unauthorized access.
                </p>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="bg-white/90 p-3 rounded-xl border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-xs font-semibold text-slate-700">Auto-unlock in:</span>
              </div>
              <span className="text-base font-extrabold text-rose-600 font-mono">
                {lockoutRemaining}s
              </span>
            </div>

            {/* Emergency Unlock */}
            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-slate-500">Need immediate access?</span>
              <button
                type="button"
                onClick={handleUnlockManual}
                className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Security Reset (Unlock)
              </button>
            </div>
          </div>
        )}

        {/* ERROR ALERTS BY CATEGORY */}
        {!isLocked && errorState.type && (
          <div className={`mt-5 p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 animate-fadeIn ${
            errorState.type === 'INVALID_EMAIL' 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : errorState.type === 'INVALID_PASSWORD'
              ? errorState.remainingAttempts === 1
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-medium'
                : 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-start gap-2.5">
              {errorState.type === 'INVALID_EMAIL' ? (
                <UserX className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : errorState.type === 'INVALID_PASSWORD' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 flex-1">
                <p className="font-bold text-xs uppercase tracking-wider">
                  {errorState.title}
                </p>
                <p className="text-xs leading-relaxed">
                  {errorState.message}
                </p>
              </div>
            </div>

            {/* Attempt Limitation Pill if password error */}
            {errorState.type === 'INVALID_PASSWORD' && typeof errorState.remainingAttempts === 'number' && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-900">
                  Attempt limit: {MAX_FAILED_ATTEMPTS - errorState.remainingAttempts}/{MAX_FAILED_ATTEMPTS} used
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  errorState.remainingAttempts === 1 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-amber-200 text-amber-900'
                }`}>
                  {errorState.remainingAttempts} attempt{errorState.remainingAttempts > 1 ? 's' : ''} left
                </span>
              </div>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email Address Field */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Email Address
            </label>
            <div className={`relative flex items-center rounded-2xl border bg-white transition-all duration-200 ${
              errorState.type === 'INVALID_EMAIL'
                ? 'border-rose-400 ring-2 ring-rose-100'
                : 'border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100'
            } ${isLocked ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}>
              <div className="pl-4 pr-2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email-input"
                type="email"
                disabled={isLocked}
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-full py-3.5 sm:py-4 pr-4 text-slate-900 placeholder-slate-400 text-sm sm:text-base bg-transparent focus:outline-none font-medium disabled:cursor-not-allowed"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Password
            </label>
            <div className={`relative flex items-center rounded-2xl border bg-white transition-all duration-200 ${
              errorState.type === 'INVALID_PASSWORD'
                ? 'border-amber-400 ring-2 ring-amber-100'
                : 'border-slate-200 hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100'
            } ${isLocked ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}>
              <div className="pl-4 pr-2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                disabled={isLocked}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className="w-full py-3.5 sm:py-4 pr-12 text-slate-900 placeholder-slate-400 text-sm sm:text-base bg-transparent focus:outline-none font-medium disabled:cursor-not-allowed"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition rounded-lg disabled:opacity-40"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                disabled={isLocked}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isLocked}
            className={`w-full mt-2 py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg group ${
              isLocked
                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-lg shadow-blue-500/30'
            } disabled:opacity-70`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sign In...</span>
              </>
            ) : isLocked ? (
              <>
                <Lock className="w-5 h-5" />
                <span>Locked ({lockoutRemaining}s)</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Security Divider - Clean & Exact to reference design */}
        <div className="mt-8 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200"></div>
            <div className="absolute bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-400 shadow-xs flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          
          <p className="text-center text-xs font-semibold text-slate-400 tracking-wider uppercase mt-4">
            Secure Owner Access
          </p>
        </div>
        </>
      )}
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </>
  );
}
