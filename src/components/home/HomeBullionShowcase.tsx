"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_RATES, formatGBP } from "@/lib/rates";
import { BullionProduct, INITIAL_GOLD_ITEMS } from "@/data/bullion-items";

export default function HomeBullionShowcase() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/rates?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.goldGbpPerGram) {
          setRates({
            goldGbpPerGram: data.goldGbpPerGram,
            silverGbpPerGram: data.silverGbpPerGram,
            lastUpdated: data.lastUpdated,
            isLive: true,
            currency: "GBP",
          });
        }
      })
      .catch(() => {});
  }, []);

  const goldGram = rates.goldGbpPerGram;

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 8 handpicked top bullion products for home showcase
  const featuredGoldItems = INITIAL_GOLD_ITEMS.slice(0, 8);

  return (
    <section className="w-full bg-[#fdfbf7] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#eee5dc] select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Section Header matching high-end British Jewellery design ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b6914]">
                LBMA ACCREDITED BULLION
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1510] font-normal tracking-tight">
              Investment Gold Bars & Coins
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
              Physical investment-grade gold minted by PAMP Suisse, The Royal Mint, and Valcambi. Exempt from UK VAT.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/gold-bars"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#dfcca6] bg-white hover:bg-[#8b6914] text-[#8b6914] hover:text-white transition-all text-xs font-bold shadow-2xs group cursor-pointer"
            >
              <span>See all bullion</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* ── Scrollable Carousel Container with Navigation Arrows ── */}
        <div className="relative w-full group/bullion">
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute -left-4 top-[40%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1c1510] hover:bg-[#8b6914] text-white shadow-xl items-center justify-center transition-all duration-300 border-2 border-white active:scale-90 cursor-pointer opacity-90 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute -right-4 top-[40%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1c1510] hover:bg-[#8b6914] text-white shadow-xl items-center justify-center transition-all duration-300 border-2 border-white active:scale-90 cursor-pointer opacity-90 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Horizontal Scroll Track (Generous luxury card width so text never crunches) */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide px-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredGoldItems.map((item) => {
              const calculatedPrice =
                item.priceMode === "fixed" && item.customPriceOverride
                  ? item.customPriceOverride
                  : goldGram * item.weightGrams * (1 + item.premiumPercentage);

              const whatsappMessage = encodeURIComponent(
                `Hello Bhai Jeweller, I want to lock the price for ${item.name} (${item.purity}) currently listed at approx ${formatGBP(calculatedPrice)}.`
              );

              return (
                <div
                  key={item.id}
                  className="group flex flex-col text-left transition-all duration-300 w-[240px] sm:w-[270px] md:w-[290px] flex-shrink-0 snap-start select-none bg-white border border-[#dfcca6] hover:border-[#8b6914] rounded-2xl p-4 shadow-2xs hover:shadow-md"
                >
                  {/* Image Container with Floating Badges */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-[#faf5ea]/50 via-white to-[#faf8f5] flex items-center justify-center p-4 border border-[#dfcca6]/40">
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                      <span className="bg-[#8b6914] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
                        0% UK VAT
                      </span>
                      {item.popular && (
                        <span className="bg-[#1c1510] text-[#dec29b] text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded shadow-2xs">
                          Popular
                        </span>
                      )}
                    </div>

                    <span className="absolute top-2.5 right-2.5 bg-white/95 border border-[#dfcca6] text-[9.5px] font-bold text-slate-700 px-2 py-0.5 rounded-full z-10 shadow-2xs">
                      24K Pure
                    </span>

                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="max-h-32 sm:max-h-40 object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
                      unoptimized
                    />
                  </div>

                  {/* Card Details */}
                  <div className="mt-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Refiner & Purity in clean pill tags */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                        <span className="font-medium truncate text-zinc-600">{item.refiner.includes("/") ? item.refiner.split("/")[0].trim() : item.refiner}</span>
                        <span className="font-mono text-[#8b6914] font-bold bg-[#faf5ea] px-1.5 py-0.2 rounded border border-[#dfcca6] text-[10px] flex-shrink-0">
                          {item.purity}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 className="font-serif text-[14px] sm:text-[16px] font-bold text-[#1c1510] leading-snug group-hover:text-[#8b6914] transition-colors line-clamp-2 h-[40px]">
                        {item.name}
                      </h3>

                      {/* Price Section */}
                      <div className="mt-2.5 flex items-baseline justify-between pt-2 border-t border-[#dfcca6]/40">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
                            Live Estimate
                          </span>
                          <p className="text-[17px] sm:text-[20px] font-extrabold text-[#1c1510] tracking-tight">
                            {formatGBP(calculatedPrice)}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          LBMA Direct
                        </span>
                      </div>
                    </div>

                    {/* Action Button: Sleek Luxury Bar */}
                    <div className="mt-3.5 grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/447472027202?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 rounded-xl text-xs font-bold text-center bg-[#1c1510] hover:bg-[#8b6914] text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        Lock Price
                      </a>
                      <Link
                        href={`/contact?inquiry=${encodeURIComponent(`Gold Bullion Inquiry: ${item.name} (${item.purity}) estimated at ${formatGBP(calculatedPrice)}`)}`}
                        className="py-2.5 rounded-xl text-xs font-bold text-center bg-[#faf5ea] hover:bg-white text-[#8b6914] border border-[#dfcca6] hover:border-[#8b6914] transition-all active:scale-95 cursor-pointer"
                      >
                        Inquire
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
