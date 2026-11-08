import React from 'react';
import { Star, Check } from 'lucide-react';
import StoreIllustration from './StoreIllustration';

export default function HeroSection() {
  const benefits = [
    'Track customer ratings',
    'Analyze feedback trends',
    'Grow your business',
  ];

  return (
    <div className="flex flex-col justify-between w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 mb-6 lg:mb-8">
        <div className="relative shrink-0">
          {/* Blue Speech Bubble with Star */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-2xl rounded-bl-sm flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-white stroke-none" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            BizFeedback
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide">
            Ratings &amp; Feedback Management
          </p>
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-4 mb-6 lg:mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Welcome Back!
        </h2>
        <p className="text-slate-600 text-base sm:text-lg max-w-md leading-relaxed">
          Sign in to manage your business feedback and ratings.
        </p>

        {/* Benefits Checklist */}
        <div className="pt-2 space-y-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3 group">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30 group-hover:scale-110 transition-transform shrink-0">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-slate-700 tracking-wide">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Store Illustration Container */}
      <div className="mt-4 lg:mt-auto relative w-full">
        <StoreIllustration />
      </div>
    </div>
  );
}
