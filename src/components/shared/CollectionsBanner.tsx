'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';

export function CollectionsBanner() {
  return (
    <section className="w-full bg-[#0a0705] py-0 px-0 overflow-hidden">
      <div className="relative w-full max-w-full mx-auto rounded-none overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[460px] flex items-center bg-[#0a0705] shadow-2xl group">

        {/* Background: Newly generated Ultra-HD jewellery image with subtle ambient zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/collections-banner-hd.jpg"
            alt="Fine 22k gold and diamond jewellery collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          {/* Gradients ensuring high legibility and rich atmospheric depth */}
          <div className="absolute inset-0 bg-[#080503]/50 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080503] via-[#080503]/85 sm:via-[#080503]/75 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080503] via-transparent to-[#080503]/40" />
        </div>

        {/* Content with Staggered ScrollReveal & CSS Animations */}
        <div className="relative z-10 w-full px-5 sm:px-10 lg:px-16 py-10 sm:py-16">
          <div className="flex items-center justify-between">

            {/* Left: Animated Text block */}
            <div className="max-w-xs sm:max-w-sm lg:max-w-lg">
              {/* Category Pill Tag */}
              <ScrollReveal direction="up" delay={50} duration={700}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1510]/80 border border-[#d8bb93]/30 backdrop-blur-xs mb-3.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d8bb93] animate-pulse" />
                  <p className="text-[10px] tracking-[0.28em] uppercase text-[#d8bb93] font-semibold">
                    OUR COLLECTIONS
                  </p>
                </div>
              </ScrollReveal>

              {/* Headline with animated gold gradient accent */}
              <ScrollReveal direction="up" delay={180} duration={800}>
                <h2 className="font-serif text-[28px] sm:text-[38px] lg:text-[46px] text-[#fbf8f5] font-normal leading-[1.12] tracking-tight mb-3.5 sm:mb-4">
                  Crafted for <br />
                  <span className="italic font-normal bg-gradient-to-r from-[#fbf8f5] via-[#dec29b] to-[#c5a059] bg-clip-text text-transparent">
                    every chapter
                  </span>
                </h2>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal direction="up" delay={300} duration={800}>
                <p className="text-[12.5px] sm:text-[14px] text-[#cfc2b6] font-light leading-relaxed mb-6 sm:mb-8 max-w-[300px] sm:max-w-[380px]">
                  From everyday elegance to life&apos;s biggest milestones, our handcrafted gold &amp; diamond jewellery is designed to be part of your story — today and always.
                </p>
              </ScrollReveal>

              {/* Animated Button */}
              <ScrollReveal direction="up" delay={420} duration={800}>
                <Link
                  href="/collections"
                  className="
                    relative inline-flex items-center gap-2.5
                    px-6 sm:px-7 py-3 rounded-full
                    bg-gradient-to-r from-[#1c140e] to-[#261c14]
                    border border-[#d8bb93]/60 text-[#fbf8f5]
                    text-xs tracking-wider uppercase font-semibold
                    hover:border-[#d8bb93] hover:text-[#0c0806]
                    hover:bg-gradient-to-r hover:from-[#d8bb93] hover:via-[#ebd7bf] hover:to-[#c5a059]
                    hover:shadow-[0_0_25px_rgba(216,187,147,0.35)]
                    transition-all duration-400 group/btn
                  "
                >
                  <span className="relative z-10">Discover Our Craft</span>
                  <svg
                    className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </ScrollReveal>
            </div>

            {/* Right: Circular Atmospheric FINE JEWELLERY Seal */}
            <ScrollReveal direction="zoom" delay={250} duration={900}>
              <div className="hidden sm:flex flex-col items-center justify-center mr-4 lg:mr-10 select-none pointer-events-none group-hover:scale-105 transition-transform duration-700">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-dashed border-[#dec29b]/40 flex items-center justify-center backdrop-blur-[2px] bg-[#0c0806]/30 shadow-inner">
                  {/* Rotating dashed ring */}
                  <div className="absolute inset-1 rounded-full border border-dotted border-[#dec29b]/25 animate-[spin_30s_linear_infinite]" />
                  <div className="text-center px-2">
                    <span className="block text-[9px] tracking-[0.3em] text-[#d8bb93] uppercase font-medium">
                      FINE
                    </span>
                    <span className="block text-[8px] tracking-[0.25em] text-[#e8dfd1] uppercase font-light mt-0.5">
                      JEWELLERY
                    </span>
                    <span className="block text-[8px] text-[#dec29b]/70 tracking-widest mt-1">
                      1982
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>

      </div>
    </section>
  );
}

export default CollectionsBanner;
