'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  isMobile?: boolean;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Lockout Countdown Timer
  useEffect(() => {
    if (!isBlocked || lockCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          setIsBlocked(false);
          setLoginError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBlocked, lockCountdown]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword || isBlocked || authLoading) return;
    setAuthLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      setAuthLoading(false);

      if (data.success) {
        if (
          data.user?.role === 'admin' ||
          loginIdentifier === 'admin@bhai.com' ||
          loginIdentifier === 'admin' ||
          loginIdentifier === 'admin@bhaijeweller.com'
        ) {
          setTimeout(() => {
            router.push('/admin');
          }, 600);
        } else {
          setTimeout(() => {
            router.push('/account');
          }, 600);
        }
      } else {
        setLoginError(data.error || 'Login failed.');
        if (data.isBlocked) {
          setIsBlocked(true);
          setLockCountdown(data.remainingSeconds || 900);
        } else if (typeof data.attemptsLeft === 'number') {
          setAttemptsLeft(data.attemptsLeft);
        }
      }
    } catch {
      setAuthLoading(false);
      setLoginError('Server connection error. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-sans text-3xl sm:text-4xl text-[#1c1510] font-bold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-[#8a796c] font-light mt-1.5">
          Access your private jewellery portfolio, orders and saved wishlist.
        </p>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {/* Error / Lockout Messages */}
        {loginError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-light flex items-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-red-600 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{loginError}</span>
          </div>
        )}

        {isBlocked && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-light flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Account temporarily locked for security.</span>
            </div>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-200">
              {Math.floor(lockCountdown / 60)}:{(lockCountdown % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {attemptsLeft !== null && attemptsLeft > 0 && !isBlocked && (
          <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 font-light">
            Warning: {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining before temporary lock.
          </p>
        )}

        {/* Email or Phone */}
        <div>
          <label className="block text-xs font-medium text-[#1c1510] mb-1">
            Email or Phone Number <span className="text-[#a83232]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              type="text"
              required
              disabled={isBlocked || authLoading}
              placeholder="e.g. your@email.com or +447123456789"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-[#1c1510]">
              Password <span className="text-[#a83232]">*</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset is available by contacting our Bradford boutique or your account executive.')}
              className="text-[11px] text-[#9e7d56] hover:text-[#1c1510] transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type={showLoginPassword ? 'text' : 'password'}
              required
              disabled={isBlocked || authLoading}
              placeholder="Enter your account password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 text-[#9a897b] hover:text-[#1c1510] transition-colors cursor-pointer"
            >
              {showLoginPassword ? (
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#c7b7a6] text-[#1c1510] focus:ring-0 focus:outline-none accent-[#1c1510]"
            />
            <span className="text-xs text-[#736355] font-light">Keep me signed in</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isBlocked || authLoading}
          className="w-full py-2.5 rounded-lg bg-[#1c1510] text-[#f5efe8] text-xs font-medium tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {authLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#dec29b] border-t-transparent rounded-full animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <span>Sign In to Account</span>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="w-full border-t border-[#e2d8cb]" />
          <span className="absolute px-3 bg-[#faf7f2] text-[10px] tracking-wider uppercase text-[#9a897b]">
            Or continue with
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => alert('Google Social Sign-In is configured on the live production domain.')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] hover:bg-[#f5ede1] text-xs text-[#1c1510] font-light transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.54 0 2.92.54 4.01 1.43l3-3C17.2 1.76 14.8 1 12 1 7.46 1 3.59 3.58 1.7 7.29l3.66 2.84C6.24 7.42 8.87 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.83-.07-1.63-.2-2.3H12v4.6h6.5c-.28 1.48-1.12 2.73-2.39 3.58l3.69 2.86c2.16-1.99 3.7-4.92 3.7-8.74z" />
              <path fill="#FBBC05" d="M5.36 14.86c-.23-.69-.36-1.42-.36-2.19s.13-1.5.36-2.19L1.7 7.64C.62 9.79 0 12.19 0 14.67s.62 4.88 1.7 7.03l3.66-2.84z" />
              <path fill="#34A853" d="M12 23.33c3.24 0 5.96-1.07 7.95-2.91l-3.69-2.86c-1.08.72-2.46 1.17-4.26 1.17-3.13 0-5.76-2.42-6.64-5.13L1.7 16.44C3.59 20.15 7.46 23.33 12 23.33z" />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Apple Social Sign-In is configured on the live production domain.')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] hover:bg-[#f5ede1] text-xs text-[#1c1510] font-light transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-[#1c1510]" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.88 1.48-.61.71-1.15 1.87-1.01 2.98 1.07.08 2.22-.54 2.9-1.36z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#8a796c] font-light">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#9e7d56] font-medium hover:text-[#1c1510] underline underline-offset-4 cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
