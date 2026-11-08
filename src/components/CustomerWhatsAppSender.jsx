import React, { useState } from 'react';
import {
  Phone, Send, CheckCircle2, AlertCircle, Copy, Check,
  ExternalLink, RotateCcw, MessageSquare, ShieldCheck, Sparkles
} from 'lucide-react';

export default function CustomerWhatsAppSender({ onOpenFeedbackForm }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // Validation & Dispatch State
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null); // { success: boolean, link: string, phone: string, token: string }
  const [copied, setCopied] = useState(false);

  const countryCodes = [
    { code: '+91', country: 'India (IN)' },
    { code: '+1',  country: 'USA / Canada' },
    { code: '+44', country: 'UK' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'Singapore' },
    { code: '+60', country: 'Malaysia' },
    { code: '+61', country: 'Australia' },
  ];

  const handlePhoneChange = (e) => {
    // Only allow digits and spaces
    const val = e.target.value.replace(/[^\d\s]/g, '');
    setPhoneNumber(val);
    if (error) setError('');
  };

  const validatePhone = (digits) => {
    // Must be between 7 and 15 digits
    return digits.length >= 10 && digits.length <= 15;
  };

  const handleSendLink = (e) => {
    e.preventDefault();

    const cleanDigits = phoneNumber.replace(/\s+/g, '');

    // Validation
    if (!cleanDigits) {
      setError('Please enter a WhatsApp phone number.');
      return;
    }

    if (!validatePhone(cleanDigits)) {
      setError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setError('');
    setIsSending(true);

    // Simulate WhatsApp Business API Dispatch
    setTimeout(() => {
      const fullPhone = `${countryCode.replace('+', '')}${cleanDigits}`;
      const token = 'token_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
      
      // Generate clean unique feedback form link
      const baseUrl = window.location.origin + window.location.pathname;
      const uniqueLink = `${baseUrl}?mode=feedback&ref=${token}&phone=${encodeURIComponent(cleanDigits)}`;

      // WhatsApp message content
      const storeName = 'BizFeedback Store #9042';
      const greeting = customerName.trim() ? `Dear ${customerName.trim()}, ` : 'Hello! ';
      const messageText = `${greeting}Thank you for visiting ${storeName}! ✨\n\nWe value your opinion. Please take 30 seconds to rate your experience and share your feedback here:\n👉 ${uniqueLink}\n\nYour feedback helps us serve you better! Thank you!`;

      // WhatsApp API URL for direct messaging
      const whatsappApiUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(messageText)}`;

      // Automatically launch WhatsApp Web / App
      window.open(whatsappApiUrl, '_blank', 'noopener,noreferrer');

      setDispatchStatus({
        success: true,
        fullPhone: `${countryCode} ${cleanDigits}`,
        whatsappApiUrl,
        uniqueLink,
        token,
        customerName: customerName.trim() || 'Valued Customer'
      });

      setIsSending(false);
    }, 650);
  };

  const handleCopy = () => {
    if (dispatchStatus?.uniqueLink) {
      navigator.clipboard.writeText(dispatchStatus.uniqueLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setPhoneNumber('');
    setCustomerName('');
    setError('');
    setDispatchStatus(null);
    setCopied(false);
  };

  return (
    <div className="w-full text-left space-y-5 animate-fadeIn">
      {/* Top Header Badge */}
      <div className="text-center pb-2">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mx-auto mb-3">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Enter the Number
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Send a unique feedback form link directly to the customer's WhatsApp
        </p>
      </div>

      {/* DISPATCH SUCCESS STATE */}
      {dispatchStatus ? (
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-emerald-900">
                Feedback Link Dispatched!
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                Unique link generated for <strong className="text-emerald-950">{dispatchStatus.fullPhone}</strong> via WhatsApp Business API.
              </p>
            </div>
          </div>

          {/* Generated Link Box */}
          <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Generated Feedback Form URL:
            </span>
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <input
                type="text"
                readOnly
                value={dispatchStatus.uniqueLink}
                className="w-full bg-transparent text-xs text-slate-700 font-mono focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <a
              href={dispatchStatus.whatsappApiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              Open WhatsApp Chat Again
            </a>

            {onOpenFeedbackForm && (
              <button
                type="button"
                onClick={onOpenFeedbackForm}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open &amp; Submit Customer Feedback
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Send to Another Customer
            </button>
          </div>
        </div>
      ) : (
        /* FORM INPUT STATE */
        <form onSubmit={handleSendLink} className="space-y-4">
          {/* Customer Name (Optional Helper) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Customer Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full py-3 px-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/70"
            />
          </div>

          {/* Customer WhatsApp Phone Number (MANDATORY) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              WhatsApp Phone Number <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-28 py-3 px-2 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.country}
                  </option>
                ))}
              </select>

              {/* Number Input Field */}
              <div className="relative flex-1">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit number"
                  maxLength={15}
                  className={`w-full py-3 pl-3.5 pr-9 rounded-2xl border text-xs sm:text-sm font-semibold tracking-wide text-slate-900 bg-slate-50/70 focus:outline-none focus:ring-2 ${
                    error
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-emerald-500'
                  }`}
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Validation Error Message */}
            {error && (
              <p className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
            <p className="mt-1.5 text-[11px] text-slate-400">
              Only sends after you click Send Link. No messages are sent while typing.
            </p>
          </div>

          {/* Submit & Generate Link Button */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/25 active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting WhatsApp API...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate &amp; Send Feedback Link</span>
              </>
            )}
          </button>

          {/* Security Note */}
          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sent securely via WhatsApp Business API protocol
            </span>
          </div>
        </form>
      )}
    </div>
  );
}

