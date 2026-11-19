'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  brandPretitle?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineLine3?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  heroImage?: string;
}

export function HeroSection({
  brandPretitle = 'TIMELESS ELEGANCE',
  headlineLine1 = 'Jewellery',
  headlineLine2 = 'that tells your',
  headlineLine3 = 'story',
  description = 'Discover fine jewellery designed to celebrate your most precious moments.',
  primaryCtaText = 'Shop Collection',
  primaryCtaHref = '/shop',
  heroImage = '/hero-bg.png',
}: HeroSectionProps) {
  const [data, setData] = useState({
    brandPretitle,
    headlineLine1,
    headlineLine2,
    headlineLine3,
    description,
    primaryCtaText,
    primaryCtaHref,
    heroImage,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch customizable CMS overrides if available
  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData((prev) => ({
            ...prev,
            brandPretitle: resData.data.brandPretitle || prev.brandPretitle,
            headlineLine1: resData.data.headlineLine1 || prev.headlineLine1,
            headlineLine2: resData.data.headlineLine2 || prev.headlineLine2,
            headlineLine3: resData.data.headlineLine3 ?? prev.headlineLine3,
            description: resData.data.description || prev.description,
            primaryCtaText: resData.data.primaryCtaText || prev.primaryCtaText,
            primaryCtaHref: resData.data.primaryCtaHref || prev.primaryCtaHref,
            heroImage: resData.data.heroImage || prev.heroImage,
          }));
        }
      })
      .catch((err) => console.error('Failed to fetch hero config:', err));
  }, []);

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-screen bg-[#0c0806] overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 md:pt-32 pb-1 sm:pb-2 select-none">
      {/* ── Background Photography (public/hero-bg.png) ── */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Image
          src={data.heroImage || '/hero-bg.png'}
          alt="Luxury Fine Jewellery Editorial Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] sm:object-center transition-all duration-1000 scale-100"
        />

        {/* Soft Left Side Gradient for pristine typographic contrast without hiding flowers & ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0806]/85 via-[#0c0806]/40 to-transparent w-full sm:w-[62%] lg:w-[48%]" />

        {/* Top Header & Bottom Gradients for smooth section transitions */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-[#0c0806]/70 via-[#0c0806]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#0c0806] via-[#0c0806]/60 to-transparent" />
      </div>

      {/* ── Main Content Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full flex-1 flex items-center my-auto">
        <div className="max-w-2xl py-2 sm:py-4">

          {/* Top Tagline */}
          <div className="flex items-center gap-2 mb-2.5 sm:mb-5 animate-fadeIn">
            <span className="w-6 sm:w-8 h-[1px] bg-[#dec29b]/70" />
            <span className="text-[9.5px] sm:text-xs font-medium tracking-[0.25em] sm:tracking-[0.28em] text-[#dec29b] uppercase">
              {data.brandPretitle}
            </span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-sans text-[32px] sm:text-5xl md:text-7xl lg:text-[76px] xl:text-[84px] text-white font-normal leading-[1.05] tracking-tight mb-2.5 sm:mb-5 animate-slideUpFade">
            {data.headlineLine1}
            <br />
            {data.headlineLine2}
            <br />
            <span className="font-script text-[#f3dfc8] text-[48px] sm:text-7xl md:text-9xl lg:text-[108px] xl:text-[120px] font-normal leading-[0.88] block -mt-1 sm:-mt-3 text-transparent bg-clip-text bg-gradient-to-r from-[#fbf3e8] via-[#f3dfc8] to-[#dec29b] drop-shadow-[0_4px_16px_rgba(243,223,200,0.15)]">
              {data.headlineLine3}
            </span>
          </h1>

          {/* Subtitle / Narrative */}
          <p className="text-xs sm:text-[15px] lg:text-base text-[#c7bbae] font-light leading-relaxed max-w-sm sm:max-w-lg mb-5 sm:mb-8 animate-fadeIn">
            {data.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 animate-fadeIn">
            {/* Primary Pill Button */}
            <Link
              href={data.primaryCtaHref || '/shop'}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#f3dfc8] hover:bg-white text-[#1c140e] font-semibold text-[11px] sm:text-sm tracking-wide shadow-[0_4px_20px_rgba(243,223,200,0.3)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer"
            >
              <span>{data.primaryCtaText || 'Shop Collection'}</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Secondary Outline Pill Button */}
            <Link
              href="/about"
              className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full border border-white/20 hover:border-[#f3dfc8] bg-white/[0.04] hover:bg-white/10 text-white hover:text-[#f3dfc8] font-light text-[11px] sm:text-sm tracking-wide backdrop-blur-sm transition-all duration-300 group cursor-pointer"
            >
              <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-white/10 group-hover:bg-[#f3dfc8]/20 flex items-center justify-center text-[8px] sm:text-[9px] text-[#f3dfc8] transition-colors">
                ▶
              </span>
              <span>Our Heritage</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar: Scroll Indicator (Left) & Pagination Dots (Center) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-1 sm:pt-2 flex items-center justify-between">
        {/* Bottom Left: Scroll to explore */}
        <div className="flex items-center gap-2 sm:gap-3 text-white/50 hover:text-white/80 transition-colors cursor-default">
          <div className="w-[1px] h-3 sm:h-4 bg-white/30" />
          <div className="w-3 sm:w-3.5 h-4.5 sm:h-5 rounded-full border border-white/40 flex items-start justify-center p-[2px]">
            <span className="w-0.5 sm:w-1 h-1 sm:h-1.5 rounded-full bg-[#dec29b] animate-bounce" />
          </div>
          <span className="text-[9.5px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] font-light">
            Scroll to explore
          </span>
        </div>

        {/* Bottom Center: Slider Pagination Indicators */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {[0, 1, 2, 3, 4].map((idx) => {
            const isActive = idx === activeSlide;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-5 sm:w-6 h-1 sm:h-1.5 bg-[#dec29b]'
                    : 'w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>

        {/* Spacer for symmetrical balance */}
        <div className="w-16 sm:w-24 hidden sm:block" />
      </div>
    </section>
  );
}
