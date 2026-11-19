'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AuthHeroBanner from './AuthHeroBanner';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
}

export default function AuthCard({ initialMode = 'login' }: AuthCardProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Sync with browser back/forward and URL change
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('signup') || path.includes('register')) {
        setMode('signup');
      } else {
        setMode('login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchMode = (newMode: 'login' | 'signup') => {
    if (newMode === mode) return;
    setMode(newMode);
    const targetPath = newMode === 'signup' ? '/signup' : '/login';
    window.history.pushState(null, '', targetPath);
  };

  const isLogin = mode === 'login';

  return (
    <main className="w-full flex-1 min-h-[680px] xl:min-h-[760px] bg-[#faf7f2] flex flex-col justify-center relative overflow-hidden select-none py-0">
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP CONTAINER: Sliding Swap Layout (lg screens and above)
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block relative w-full h-full min-h-[680px] xl:min-h-[760px] overflow-hidden bg-[#faf7f2]">
        {/* The 2 Fixed Under-Panels (Login Form on Right, Sign Up Form on Left) */}
        <div className="absolute inset-0 grid grid-cols-2 w-full h-full">
          {/* Left Slot: SIGN UP FORM */}
          <div
            className={`w-full h-full p-8 xl:p-14 flex flex-col justify-between transition-all duration-700 ease-out ${
              !isLogin
                ? 'opacity-100 scale-100 pointer-events-auto delay-150'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Top Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#ede4d8] p-1 rounded-full border border-[#ded3c5]">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    !isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-xs text-[#8a796c] font-light">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="ml-1 text-[#9e7d56] font-medium hover:text-[#1c1510] transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>

            {/* Form Content */}
            <ScrollReveal direction="up" delay={100} className="max-w-md w-full mx-auto my-auto py-3">
              <SignupForm onSwitchToLogin={() => switchMode('login')} />
            </ScrollReveal>

            {/* Bottom Note */}
            <div className="pt-3 text-center text-[10.5px] text-[#9a897b] font-light flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Your data is protected under UK Data Privacy regulations.</span>
            </div>
          </div>

          {/* Right Slot: LOG IN FORM */}
          <div
            className={`w-full h-full p-8 xl:p-14 flex flex-col justify-between transition-all duration-700 ease-out ${
              isLogin
                ? 'opacity-100 scale-100 pointer-events-auto delay-150'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Top Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#ede4d8] p-1 rounded-full border border-[#ded3c5]">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    !isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-xs text-[#8a796c] font-light">
                <span>New to Bhai Jeweller? </span>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="ml-1 text-[#9e7d56] font-medium hover:text-[#1c1510] transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form Content */}
            <ScrollReveal direction="up" delay={100} className="max-w-md w-full mx-auto my-auto py-3">
              <LoginForm onSwitchToSignup={() => switchMode('signup')} />
            </ScrollReveal>

            {/* Bottom Note */}
            <div className="pt-3 text-center text-[10.5px] text-[#9a897b] font-light flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Your data is safe and secure with us.</span>
            </div>
          </div>
        </div>

        {/* Sliding Hero Banner */}
        <AuthHeroBanner isLogin={isLogin} onSwitchMode={switchMode} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE CONTAINER: Smooth Directional Sliding Panels (Below lg)
          ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col w-full min-h-full">
        {/* Mobile Hero Top Banner */}
        <div className="relative w-full h-64 sm:h-72 bg-[#140f0c] overflow-hidden flex flex-col justify-between">
          <Image
            src="/images/auth-ring-full.jpg"
            alt="Bhai Jeweller Ring Header"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_55%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#140f0c] pointer-events-none" />

          {/* Top Bar */}
          <div className="relative z-10 w-full px-4 pt-3.5 flex items-center justify-between">
            <Link
              href="/"
              aria-label="Back to store"
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/50 flex items-center justify-center text-[#f5efe8] hover:text-[#dec29b] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>

            <Link href="/" className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/50 shadow-sm">
              <div className="w-5 h-5 rounded-full border border-[#dec29b] flex items-center justify-center bg-[#1a1410]">
                <span className="font-serif text-[11px] text-[#dec29b] font-semibold leading-none">B</span>
              </div>
              <span className="font-serif text-[10.5px] tracking-[0.22em] text-[#f5efe8] uppercase font-light">
                BHAI JEWELLER
              </span>
            </Link>

            <button
              type="button"
              onClick={() => switchMode(isLogin ? 'signup' : 'login')}
              className="text-[11px] font-medium text-[#f5efe8] px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/50 hover:text-[#dec29b] transition-colors shadow-sm cursor-pointer"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          {/* Dynamic Mobile Banner Quote */}
          <div key={mode} className="relative z-10 px-6 pb-10 sm:pb-12 transition-all duration-500 animate-fadeIn">
            <p className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#e3c79e] font-bold drop-shadow-xs">
              {isLogin ? 'WELCOME BACK' : 'JOIN THE FAMILY'}
            </p>
            <h2 className="font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold leading-tight mt-1 drop-shadow-md">
              {isLogin ? 'Your Story, Adorned in Gold' : 'Elegance Awaits You'}
            </h2>
          </div>
        </div>

        {/* Mobile Sliding Form Card */}
        <div className="w-full bg-[#faf7f2] -mt-5 rounded-t-[28px] relative z-20 p-5 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
          {/* Animated Segmented Switcher Tab */}
          <div className="relative flex items-center bg-[#ede4d8] p-1 rounded-full border border-[#ded3c5] max-w-xs mx-auto mb-5 w-full">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1c1510] rounded-full shadow-sm transition-all duration-300 ease-out ${
                isLogin ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`relative z-10 w-1/2 py-1.5 text-xs font-medium text-center transition-colors cursor-pointer ${
                isLogin ? 'text-[#f5efe8]' : 'text-[#736355]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`relative z-10 w-1/2 py-1.5 text-xs font-medium text-center transition-colors cursor-pointer ${
                !isLogin ? 'text-[#f5efe8]' : 'text-[#736355]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="max-w-md w-full mx-auto">
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => switchMode('signup')} isMobile />
            ) : (
              <SignupForm onSwitchToLogin={() => switchMode('login')} isMobile />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
