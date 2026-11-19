'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { animate, stagger } from 'animejs';

export function CTABanner() {
  const bannerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const headline = 'Own a piece of forever';
  const words = headline.split(' ');

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Animate headline characters with anime.js
          animate('.cta-letter', {
            translateY: [40, 0],
            opacity: [0, 1],
            rotateZ: [3, 0],
            delay: stagger(35, { start: 100 }),
            duration: 850,
            ease: 'outExpo',
          });

          // Animate subtitle
          animate('.cta-subtitle', {
            translateY: [25, 0],
            opacity: [0, 1],
            delay: 450,
            duration: 900,
            ease: 'outExpo',
          });

          // Animate CTA button
          animate('.cta-action-btn', {
            translateY: [20, 0],
            scale: [0.92, 1],
            opacity: [0, 1],
            delay: 600,
            duration: 850,
            ease: 'outExpo',
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={bannerRef} className="w-full bg-[#0c0806] py-0 px-0 overflow-hidden select-none">
      <div className="relative w-full max-w-full mx-auto overflow-hidden flex items-center min-h-[220px] sm:min-h-[300px] lg:min-h-[380px] shadow-2xl bg-[#0e0a07]">

        {/* ── Background Photography (Diamonds Close-up) ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/category-rings.jpg"
            alt="Own a piece of forever"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          {/* Ambient Dark Espresso Vignette Overlays for flawless contrast */}
          <div className="absolute inset-0 bg-[#0c0806]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0806]/90 via-[#0c0806]/65 to-[#0c0806]/40" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-radial from-transparent to-[#0c0806]/80 pointer-events-none" />
        </div>

        {/* ── Content Container with Large Desktop Typography ── */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-16 py-10 sm:py-16 lg:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-10">

            {/* Left Column: Animated Headline & Subtext */}
            <div className="flex-1 min-w-0 max-w-2xl">
              {/* Overline Tag */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="w-5 sm:w-7 h-[1px] bg-[#dec29b]/70" />
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.26em] text-[#dec29b] uppercase">
                  Fine Jewellery
                </span>
              </div>

              {/* Large Desktop Headline (Letter-by-Letter Animated with anime.js) */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] text-white font-medium leading-[1.08] tracking-tight overflow-hidden">
                {words.map((word, wordIdx) => (
                  <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.28em]">
                    {word.split('').map((char, charIdx) => (
                      <span
                        key={charIdx}
                        className="cta-letter inline-block opacity-0 will-change-transform"
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </h2>

              {/* Large Subtitle (Fade & Slide Animated) */}
              <p className="cta-subtitle opacity-0 text-xs sm:text-sm md:text-base lg:text-lg text-[#d8cec4] font-light mt-3 sm:mt-4 max-w-md lg:max-w-xl leading-relaxed">
                Explore our collection and find the perfect piece for your next chapter. Handcrafted in 21ct & 18k British hallmarked gold.
              </p>
            </div>

            {/* Right Column: CTA Golden Pill Button */}
            <div className="cta-action-btn opacity-0 flex-shrink-0 pt-1 md:pt-0">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 sm:gap-2.5 px-6 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#f3dfc8] hover:bg-white text-[#1c140e] font-semibold text-xs sm:text-sm tracking-wide shadow-[0_4px_24px_rgba(243,223,200,0.35)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group whitespace-nowrap cursor-pointer"
              >
                <span>Shop Collection</span>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
