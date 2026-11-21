'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';

function BotanicalDecoration() {
  return (
    <svg viewBox="0 0 120 180" fill="none" className="w-16 h-24 sm:w-20 sm:h-28 lg:w-28 lg:h-40 text-[#c9b49a] opacity-50 select-none pointer-events-none transition-transform duration-700 hover:scale-105" aria-hidden="true">
      <path d="M60 170 C60 170 58 120 60 80 C62 40 60 20 60 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M60 90 C40 80 18 70 15 50 C12 30 35 35 55 75" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M60 100 C80 85 102 72 106 52 C110 32 87 38 62 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M60 60 C45 50 30 42 28 30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M60 70 C75 58 88 50 92 36" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M38 38 C34 28 28 30 28 30 C32 34 38 38 38 38Z" stroke="currentColor" strokeWidth="0.7"/>
      <path d="M84 44 C90 34 92 36 92 36 C88 40 84 44 84 44Z" stroke="currentColor" strokeWidth="0.7"/>
      <path d="M60 10 C56 4 60 0 60 0 C64 0 65 5 60 10Z" stroke="currentColor" strokeWidth="0.8"/>
      <path d="M60 130 C44 122 38 108 42 98 C50 105 58 120 60 130Z" stroke="currentColor" strokeWidth="0.8" fill="none"/>
      <path d="M60 145 C76 136 82 121 78 111 C70 118 62 134 60 145Z" stroke="currentColor" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

export function OurStory() {
  return (
    <section className="w-full bg-[#f6efe7] overflow-hidden py-0 px-0">
      <div className="max-w-full w-full mx-auto px-0">
        <div className="flex flex-row items-stretch rounded-none overflow-hidden bg-[#f6efe7] group">

          {/* Left: Editorial Photo with Newly Generated Ultra-HD Portrait */}
          <div className="relative w-[38%] sm:w-[42%] flex-shrink-0 min-h-[260px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden">
            <ScrollReveal direction="right" duration={900} className="w-full h-full relative min-h-[260px] sm:min-h-[380px] lg:min-h-[440px]">
              <Image
                src="/images/our-story-model-hd.jpg"
                alt="A woman adorned with bespoke Bhai Jeweller high jewelry"
                fill
                priority
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 40vw, 520px"
                className="object-cover object-top sm:object-center transform transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Subtle vignette border gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f6efe7]/30 pointer-events-none" />
            </ScrollReveal>
          </div>

          {/* Centre/Right: Text and Details with Staggered Animations */}
          <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-6 sm:py-12 bg-[#f6efe7] relative">
            <div className="max-w-lg">
              
              {/* Pre-title Tag */}
              <ScrollReveal direction="up" delay={80} duration={750}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="w-2 h-0.5 bg-[#a07f59]" />
                  <p className="text-[10px] tracking-[0.32em] uppercase text-[#9e7d56] font-semibold">
                    OUR STORY
                  </p>
                </div>
              </ScrollReveal>

              {/* Animated Headline */}
              <ScrollReveal direction="up" delay={200} duration={800}>
                <h2 className="font-serif text-[22px] sm:text-[32px] lg:text-[40px] text-[#1c1510] font-normal leading-[1.14] tracking-tight mb-3 sm:mb-4">
                  Elegance is a{' '}
                  <span className="italic font-normal text-[#9e7d56] relative inline-block">
                    feeling
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#9e7d56] to-transparent" />
                  </span>
                </h2>
              </ScrollReveal>

              {/* Narrative description */}
              <ScrollReveal direction="up" delay={320} duration={800}>
                <p className="text-[12px] sm:text-[13.5px] lg:text-[14.5px] text-[#5e4e42] font-light leading-relaxed mb-6 sm:mb-8 max-w-md">
                  At <span className="font-semibold text-[#2b1f14] tracking-wide">BHAI JEWELLER</span>, we believe fine jewellery is more than an ornament — it is a reflection of who you are. Handcrafted with passion, our mission is to create timeless heirloom pieces that carry your story, your legacy, and your most treasured dreams.
                </p>
              </ScrollReveal>

              {/* Animated Action Button */}
              <ScrollReveal direction="up" delay={440} duration={800}>
                <Link
                  href="/about"
                  className="
                    inline-flex items-center gap-2
                    self-start px-6 sm:px-7 py-2.5 sm:py-3 rounded-full
                    bg-[#201711] text-[#faf7f2] border border-[#201711]
                    text-[11px] sm:text-xs tracking-wider uppercase font-semibold
                    hover:bg-[#8b6914] hover:border-[#8b6914] hover:shadow-lg
                    transition-all duration-300 group/btn
                  "
                >
                  <span>Learn More</span>
                  <svg className="w-3.5 h-3.5 stroke-[2] group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </ScrollReveal>

            </div>

            {/* Botanical Watermark on the Right */}
            <div className="hidden sm:flex absolute right-6 bottom-6 flex-col items-center pointer-events-none opacity-40 select-none">
              <BotanicalDecoration />
              <p className="font-serif italic text-[#8c6f4e] text-[12px] mt-1">Timeless By Design</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default OurStory;
