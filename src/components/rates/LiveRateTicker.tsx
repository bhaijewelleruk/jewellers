"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_RATES, formatGBP } from "@/lib/rates";

export default function LiveRateTicker() {
  const [rates, setRates] = useState(DEFAULT_RATES);

  useEffect(() => {
    fetch(`/api/rates?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.goldGbpPerGram) {
          setRates({
            goldGbpPerGram: data.goldGbpPerGram,
            silverGbpPerGram: data.silverGbpPerGram,
            goldChangePercent24h: data.goldChangePercent24h,
            silverChangePercent24h: data.silverChangePercent24h,
            lastUpdated: data.lastUpdated,
            isLive: true,
            currency: "GBP",
          });
        }
      })
      .catch(() => {});
  }, []);

  const gold24k = rates.goldGbpPerGram;
  const silver = rates.silverGbpPerGram;
  const goldChange = rates.goldChangePercent24h ?? 0;
  const silverChange = rates.silverChangePercent24h ?? 0;

  return (
    <section className="w-full bg-white border-y border-[#dfcca6]/80 shadow-xs relative z-30 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        
        {/* ── SINGLE PROFESSIONAL LINE ON BOTH MOBILE AND DESKTOP ── */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
          
          {/* Left: Live Indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8b6914] whitespace-nowrap">
              Live Spot
            </span>
            <span className="text-zinc-300 hidden sm:inline">|</span>
          </div>

          {/* Center: GOLD & SILVER GRAM PRICE IN THE SAME LINE */}
          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            
            {/* Gold 24K Gram */}
            <div className="flex items-center gap-1.5 bg-[#faf5ea] px-2.5 py-1 rounded-lg border border-[#dfcca6]">
              <span className="text-[11px] sm:text-xs">🟡</span>
              <span className="text-[10.5px] sm:text-xs font-bold text-[#8b6914]">Gold 24K:</span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm font-mono tracking-tight">
                {formatGBP(gold24k)}<span className="text-[10px] font-normal text-zinc-500">/g</span>
              </span>
              <span
                className={`text-[9px] sm:text-[9.5px] font-bold px-1 py-0.2 rounded ${
                  goldChange >= 0
                    ? "text-emerald-700 bg-emerald-100"
                    : "text-rose-700 bg-rose-100"
                }`}
              >
                {goldChange >= 0 ? "+" : ""}{goldChange}%
              </span>
            </div>

            {/* Silver Gram — SAME LINE */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-[11px] sm:text-xs">⚪</span>
              <span className="text-[10.5px] sm:text-xs font-bold text-slate-700">Silver:</span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm font-mono tracking-tight">
                {formatGBP(silver)}<span className="text-[10px] font-normal text-zinc-500">/g</span>
              </span>
              <span
                className={`text-[9px] sm:text-[9.5px] font-bold px-1 py-0.2 rounded hidden sm:inline-block ${
                  silverChange >= 0
                    ? "text-emerald-700 bg-emerald-100"
                    : "text-rose-700 bg-rose-100"
                }`}
              >
                {silverChange >= 0 ? "+" : ""}{silverChange}%
              </span>
            </div>

          </div>

          {/* Right: Clean Link to Rates Portal */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/rates"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-white hover:bg-[#faf5ea] text-[#8b6914] border border-[#dfcca6] text-[10.5px] sm:text-[11.5px] font-bold transition-all shadow-2xs whitespace-nowrap group"
            >
              <span className="hidden sm:inline">All Karats & Calculator</span>
              <span className="sm:hidden">Full Rates</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
