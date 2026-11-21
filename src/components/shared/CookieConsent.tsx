'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const COOKIE_CONSENT_KEY = 'bhai_cookie_consent_v1';
const COOKIE_NAME = 'bhai_cookie_consent';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Check if consent has already been given
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) {
        // Also check document.cookie
        const match = document.cookie
          .split(';')
          .map((c) => c.trim())
          .find((c) => c.startsWith(`${COOKIE_NAME}=`));
        if (!match) {
          // Delay banner slightly for smooth luxury fade-in
          const timer = setTimeout(() => setIsOpen(true), 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // In case localStorage is blocked
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      const serialized = JSON.stringify(prefs);
      localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
      // Set cookie for 365 days
      const maxAge = 365 * 24 * 60 * 60;
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        serialized
      )}; path=/; max-age=${maxAge}; SameSite=Lax${
        window.location.protocol === 'https:' ? '; Secure' : ''
      }`;
    } catch {
      // Ignore
    }
    setIsOpen(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
  };

  if (!mounted || !isOpen) {
    return (
      // Discreet floating cookie settings button for revisiting consent anytime
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Manage Cookie Preferences"
        className="fixed bottom-4 left-4 z-40 p-2.5 rounded-full bg-[#1c1510]/90 backdrop-blur-md border border-[#d8bb93]/40 text-[#d8bb93] hover:text-white hover:border-[#d8bb93] shadow-lg transition-all text-xs flex items-center gap-1.5 opacity-80 hover:opacity-100 group"
        title="Privacy & Cookie Preferences"
      >
        <span className="text-base group-hover:rotate-12 transition-transform">🍪</span>
        <span className="hidden sm:inline font-sans text-[11px] tracking-wider uppercase font-medium">Cookies</span>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none flex justify-center animate-fadeIn"
    >
      <div className="w-full max-w-4xl bg-[#14100c]/95 backdrop-blur-md border border-[#d8bb93]/50 rounded-xl shadow-2xl p-5 sm:p-6 text-[#fbf8f5] pointer-events-auto transition-all">
        {!showPreferences ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex-1 space-y-1.5 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍪</span>
                <h3 className="font-serif text-base sm:text-lg text-[#fbf8f5] font-medium tracking-wide">
                  Your Privacy & Cookie Preferences
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-[#c8bdb5] font-light leading-relaxed">
                We use cookies and secure storage to ensure the security of live bullion spot rates, maintain your session, and provide an immaculate bespoke jewellery shopping experience in full compliance with UK GDPR and PECR regulations.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-[#a49182]">
                <Link
                  href="/privacy-policy"
                  className="underline hover:text-[#d8bb93] transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/terms-and-conditions"
                  className="underline hover:text-[#d8bb93] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#d8bb93] hover:text-white border border-[#d8bb93]/40 hover:border-[#d8bb93] rounded-md transition-colors"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#c8bdb5] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#14100c] bg-gradient-to-r from-[#d8bb93] via-[#e5cfb3] to-[#c5a059] hover:brightness-105 rounded-md shadow-md transition-all"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#33261d] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h3 className="font-serif text-base sm:text-lg text-[#fbf8f5] font-medium tracking-wide">
                  Cookie & Privacy Customization
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-xs text-[#a49182] hover:text-white underline"
              >
                Back to overview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Category 1: Strictly Necessary */}
              <div className="p-3.5 rounded-lg bg-[#1c1510] border border-[#33261d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Strictly Essential
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-[#a49182] leading-relaxed">
                  Required for core platform security, live spot price calculations, checkout, and admin edge authorization. Cannot be disabled.
                </p>
              </div>

              {/* Category 2: Performance & Analytics */}
              <div className="p-3.5 rounded-lg bg-[#1c1510] border border-[#33261d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Performance & Analytics
                  </span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="w-4 h-4 accent-[#d8bb93] rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#a49182] leading-relaxed">
                  Helps us analyze site traffic and speed optimizations to keep high-speed bullion streaming responsive.
                </p>
              </div>

              {/* Category 3: Personalized Luxury */}
              <div className="p-3.5 rounded-lg bg-[#1c1510] border border-[#33261d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Personalized Concierge
                  </span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="w-4 h-4 accent-[#d8bb93] rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#a49182] leading-relaxed">
                  Enables tailored bullion alerts, bespoke jewellery recommendations, and VIP showroom concierge assistance.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#33261d]">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-xs text-[#c8bdb5] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2 text-xs font-semibold text-[#14100c] bg-gradient-to-r from-[#d8bb93] via-[#e5cfb3] to-[#c5a059] hover:brightness-105 rounded-md shadow-md transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
