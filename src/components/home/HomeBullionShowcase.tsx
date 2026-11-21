"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_RATES, formatGBP } from "@/lib/rates";
import { INITIAL_GOLD_ITEMS } from "@/data/bullion-items";

export default function HomeBullionShowcase() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [goldItems, setGoldItems] = useState(INITIAL_GOLD_ITEMS);
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

    // Fetch live bullion items
    fetch(`/api/bullion?metal=gold&t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setGoldItems(data.items);
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

  // Top 8 handpicked bullion items for home showcase
  const featuredGoldItems = goldItems.slice(0, 8);

  return (
    <section className="w-full bg-[#fdfbf7] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#8b6914] block mb-1">
              LBMA ACCREDITED BULLION
            </span>
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

        {/* Scrollable Carousel Container with Navigation Arrows */}
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

          {/* Horizontal Track */}
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

              const cleanRefiner = item.refiner.includes("/")
                ? item.refiner.split("/")[0].trim()
                : item.refiner;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col text-left transition-all duration-300 w-[195px] sm:w-[235px] md:w-[255px] flex-shrink-0 snap-start select-none bg-white border border-[#dfcca6]/80 hover:border-[#8b6914] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-2xs hover:shadow-md"
                >
                  {/* Compact Showroom Image Pedestal (No wasted vertical dead-space) */}
                  <div className="relative w-full h-32 sm:h-40 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-b from-[#faf6ee] via-white to-[#faf8f5] flex items-center justify-center p-2 sm:p-2.5 border border-[#dfcca6]/30">
                    <span className="absolute top-2 left-2 bg-[#8b6914] text-white text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded shadow-2xs z-10">
                      0% VAT
                    </span>

                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={180}
                      height={180}
                      className="max-h-24 sm:max-h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                      unoptimized
                    />
                  </div>

                  {/* Clean Compact Details */}
                  <div className="mt-2.5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Refiner & Purity */}
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                        <span className="font-semibold text-stone-500 uppercase tracking-wider text-[9px] sm:text-[10px] truncate max-w-[120px]">
                          {cleanRefiner}
                        </span>
                        <span className="text-[#8b6914] font-bold text-[10px] sm:text-[10.5px]">
                          {item.purity}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 className="font-serif text-[13.5px] sm:text-[15px] font-semibold text-stone-900 leading-snug group-hover:text-[#8b6914] transition-colors line-clamp-2 h-9 sm:h-10">
                        {item.name}
                      </h3>

                      {/* Clean Price */}
                      <div className="mt-1.5 pt-1.5 border-t border-[#dfcca6]/30 flex items-baseline justify-between">
                        <p className="text-[17px] sm:text-[20px] font-bold text-stone-900 tracking-tight">
                          {formatGBP(calculatedPrice)}
                        </p>
                        <span className="text-[9.5px] sm:text-[10px] text-zinc-400 font-medium">
                          VAT Free
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Clean & Compact */}
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
                      <a
                        href={`https://wa.me/447472027202?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-center bg-[#1c1510] hover:bg-[#8b6914] text-white transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center"
                      >
                        Lock Price
                      </a>
                      <Link
                        href={`/contact?inquiry=${encodeURIComponent(`Gold Bullion Inquiry: ${item.name} (${item.purity}) estimated at ${formatGBP(calculatedPrice)}`)}`}
                        className="py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-center bg-white hover:bg-[#faf5ea] text-stone-800 border border-[#dfcca6] hover:border-[#8b6914] transition-all active:scale-95 cursor-pointer flex items-center justify-center"
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
