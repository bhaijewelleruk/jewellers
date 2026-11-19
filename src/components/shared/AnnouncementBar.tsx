'use client';

import React, { useState, useEffect } from 'react';

const defaultAnnouncements = [
  'Free worldwide shipping on all orders over £150 | Handcrafted with passion in the UK',
  'British Hallmarked 21ct & 18k Gold | Bradford Showroom Open Today',
  'Complimentary Velvet Luxury Gift Packaging with Every Order',
];

export function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>(defaultAnnouncements);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/announcement')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setIsEnabled(resData.data.isEnabled ?? true);
          if (Array.isArray(resData.data.messages) && resData.data.messages.length > 0) {
            setMessages(resData.data.messages);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch announcement bar config:', err));
  }, []);

  // Subtle auto-rotation if multiple messages
  useEffect(() => {
    if (!isEnabled || messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isEnabled, messages.length]);

  if (!isEnabled || dismissed || messages.length === 0) return null;

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 w-full h-8 sm:h-9 bg-[#0c0806] border-b border-white/[0.06] text-[#c9bea7] text-[10.5px] sm:text-xs tracking-wider select-none flex items-center px-3 sm:px-6 transition-all"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
        {/* Placeholder spacer on desktop for perfect balance */}
        <div className="w-5 hidden sm:block flex-shrink-0" />

        {/* Center: Message with truncate on mobile to guarantee single line responsiveness */}
        <div className="flex-1 min-w-0 flex items-center justify-center text-center font-light px-1 gap-1.5 sm:gap-2">
          <span className="text-[#dec29b] text-[9px] sm:text-[10px] flex-shrink-0 animate-pulse">✦</span>
          <span className="text-[#e8decb] tracking-[0.02em] font-light truncate">
            {messages[currentIndex]}
          </span>
        </div>

        {/* Right: Dismiss button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-[#8c7e70] hover:text-[#f3dfc8] transition-colors p-1 -mr-1 flex-shrink-0 flex items-center justify-center cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
