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
    <section className="w-full bg-[#fdfbf7] py-2 sm:py-2.5 px-3 select-none overflow-hidden">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-4">
        
        {/* Gold 24K Gram */}
        <Link
          href="/rates"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#dfcca6]/70 hover:border-[#8b6914] shadow-2xs transition-all active:scale-95 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#caa771] shadow-2xs" />
          <span className="text-[11px] sm:text-xs font-semibold text-stone-700">Gold:</span>
          <span className="font-extrabold text-stone-900 text-xs sm:text-sm font-mono tracking-tight">
            {formatGBP(gold24k)}<span className="text-[10px] font-normal text-zinc-500">/g</span>
          </span>
          <span
            className={`text-[9px] sm:text-[9.5px] font-bold px-1 py-0.2 rounded ${
              goldChange >= 0
                ? "text-emerald-700 bg-emerald-50"
                : "text-rose-700 bg-rose-50"
            }`}
          >
            {goldChange >= 0 ? "+" : ""}{goldChange}%
          </span>
        </Link>

        {/* Silver Gram */}
        <Link
          href="/rates"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200/90 hover:border-slate-400 shadow-2xs transition-all active:scale-95 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-slate-400 shadow-2xs" />
          <span className="text-[11px] sm:text-xs font-semibold text-stone-700">Silver:</span>
          <span className="font-extrabold text-stone-900 text-xs sm:text-sm font-mono tracking-tight">
            {formatGBP(silver)}<span className="text-[10px] font-normal text-zinc-500">/g</span>
          </span>
          <span
            className={`text-[9px] sm:text-[9.5px] font-bold px-1 py-0.2 rounded ${
              silverChange >= 0
                ? "text-emerald-700 bg-emerald-50"
                : "text-rose-700 bg-rose-50"
            }`}
          >
            {silverChange >= 0 ? "+" : ""}{silverChange}%
          </span>
        </Link>

      </div>
    </section>
  );
}
