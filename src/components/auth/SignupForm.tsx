'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  isMobile?: boolean;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    if (pass.length < 8) return { score: 1, label: 'Weak (min 8 chars)', color: 'bg-red-500' };
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpec = /[^A-Za-z0-9]/.test(pass);
    const matches = [hasUpper, hasLower, hasNum, hasSpec].filter(Boolean).length;

    if (matches >= 3 && pass.length >= 10) return { score: 3, label: 'Strong Security ✓', color: 'bg-emerald-600' };
    if (matches >= 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 1, label: 'Weak', color: 'bg-red-500' };
  };

  const strength = getPasswordStrength(signupPassword);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupFullName || !signupEmail || !signupPassword || authLoading) return;

    if (signupPassword.length < 8) {
      setSignupError('Password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    setSignupError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signupFullName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
        }),
      });

      const data = await res.json();
      setAuthLoading(false);

      if (data.success) {
        setRegistered(true);
      } else {
        setSignupError(data.error || 'Failed to create account.');
      }
    } catch {
      setAuthLoading(false);
      setSignupError('Server connection error. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#dec29b]/60 text-center animate-fadeIn w-full">
        <div className="w-12 h-12 rounded-full bg-[#1c1510] text-[#f5efe8] flex items-center justify-center mx-auto mb-3 shadow-sm">
          <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-serif text-lg text-[#1c1510]">Account Created!</h3>
        <p className="text-xs text-[#736355] font-light mt-1 mb-4">
          Welcome to Bhai Jeweller, {signupFullName}. You can now save your wishlist and track your orders.
        </p>
        <Link
          href="/account"
          className="inline-flex px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
        >
          Go to My Account →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-sans text-3xl sm:text-4xl text-[#1c1510] font-bold tracking-tight">
          Create Your Account
        </h1>
        <p className="text-xs sm:text-sm text-[#8a796c] font-light mt-1.5">
          Join Bhai Jeweller and enjoy bespoke previews and private releases.
        </p>
      </div>

      <form onSubmit={handleSignupSubmit} className="space-y-3">
        {signupError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-light flex items-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-red-600 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{signupError}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-[#1c1510] mb-1">
            Full Name <span className="text-[#a83232]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={signupFullName}
              onChange={(e) => setSignupFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-[#1c1510] mb-1">
            Email Address <span className="text-[#a83232]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              type="email"
              required
              placeholder="e.g. name@domain.co.uk"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-[#1c1510] mb-1">
            Mobile Number (Optional)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </span>
            <input
              type="tel"
              placeholder="+44 7123 456789"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-[#1c1510]">
              Create Password <span className="text-[#a83232]">*</span>
            </label>
            {signupPassword && (
              <span className={`text-[10.5px] font-medium ${strength.score >= 3 ? 'text-emerald-700' : strength.score === 2 ? 'text-amber-700' : 'text-red-700'}`}>
                {strength.label}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type={showSignupPassword ? 'text' : 'password'}
              required
              placeholder="Minimum 8 characters"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 text-[#9a897b] hover:text-[#1c1510] transition-colors cursor-pointer"
            >
              {showSignupPassword ? (
                <svg className="w-4 h-4 stroke-[1.6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-4 h-4 stroke-[1.6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Strength Bar */}
          {signupPassword && (
            <div className="mt-1.5 flex gap-1 h-1">
              <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-gray-200'} transition-all`} />
              <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-gray-200'} transition-all`} />
              <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-gray-200'} transition-all`} />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-2.5 rounded-lg bg-[#1c1510] text-[#f5efe8] text-xs font-medium tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {authLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#dec29b] border-t-transparent rounded-full animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-[#8a796c] font-light">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#9e7d56] font-medium hover:text-[#1c1510] underline underline-offset-4 cursor-pointer"
            >
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
