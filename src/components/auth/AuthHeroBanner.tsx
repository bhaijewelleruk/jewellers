'use client';

import React from 'react';
import Image from 'next/image';

interface AuthHeroBannerProps {
  isLogin: boolean;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export default function AuthHeroBanner({ isLogin, onSwitchMode }: AuthHeroBannerProps) {
  return (
    <div
      className={`absolute top-0 bottom-0 left-0 w-1/2 h-full z-30 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-auto ${
        isLogin ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-full h-full bg-[#140e0b] text-[#f5efe8] p-10 xl:p-14 flex flex-col justify-between overflow-hidden shadow-2xl border-x border-[#2d221a]">
        {/* Background Image */}
        <Image
          src="/images/auth-ring-full.jpg"
          alt="Bhai Jeweller Heritage"
          fill
          priority
          sizes="50vw"
          className={`object-cover object-center transition-all duration-1000 ${
            isLogin ? 'scale-100 opacity-95' : 'scale-105 opacity-90'
          }`}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120d09]/95 via-[#120d09]/40 to-[#120d09]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(222,194,155,0.08),transparent_70%)] pointer-events-none" />

        {/* Top Monogram Brand Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#dec29b]/70 flex items-center justify-center bg-[#1a1410] shadow-sm">
              <span className="font-serif text-sm text-[#dec29b] font-semibold italic">B</span>
            </div>
            <div>
              <span className="font-serif text-xs tracking-[0.24em] uppercase text-[#f5efe8]">BHAI JEWELLER</span>
              <p className="text-[7.5px] tracking-[0.35em] uppercase text-[#b8a798]">— BRADFORD —</p>
            </div>
          </div>

          {/* Quick Swap Overlay Button */}
          <button
            type="button"
            onClick={() => onSwitchMode(isLogin ? 'signup' : 'login')}
            className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/40 text-[#f5efe8] text-[11px] font-light hover:border-[#dec29b] hover:text-[#dec29b] transition-all flex items-center gap-1.5 shadow-sm group cursor-pointer"
          >
            <span>{isLogin ? 'Need an account?' : 'Already a member?'}</span>
            <span className="text-[#dec29b] font-medium group-hover:translate-x-0.5 transition-transform">
              {isLogin ? 'Sign Up →' : 'Log In →'}
            </span>
          </button>
        </div>

        {/* Dynamic Bottom Hero Quote with Crossfade */}
        <div className="relative z-10 max-w-md min-h-[160px] flex flex-col justify-end">
          {isLogin ? (
            <div key="login-quote" className="animate-fadeIn">
              <p className="text-[10.5px] tracking-[0.32em] uppercase text-[#e3c79e] font-bold mb-2.5 drop-shadow-xs">
                TIMELESS ELEGANCE
              </p>
              <h2 className="font-serif text-3xl xl:text-4xl text-[#ffffff] font-semibold leading-[1.2] drop-shadow-md">
                Your Story,<br />Adorned in Gold
              </h2>
              <p className="text-xs xl:text-sm text-[#d6c9be] font-light mt-3 leading-relaxed">
                Discover fine jewellery pieces crafted for life&apos;s most precious moments.
              </p>
            </div>
          ) : (
            <div key="signup-quote" className="animate-fadeIn">
              <p className="text-[10.5px] tracking-[0.32em] uppercase text-[#e3c79e] font-bold mb-2.5 drop-shadow-xs">
                JOIN BHAI JEWELLER
              </p>
              <h2 className="font-serif text-3xl xl:text-4xl text-[#ffffff] font-semibold leading-[1.2] drop-shadow-md">
                Elegance Awaits<br />You
              </h2>
              <p className="text-xs xl:text-sm text-[#d6c9be] font-light mt-3 leading-relaxed">
                Create your account and be the first to know about new collections, bespoke previews and private releases.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
