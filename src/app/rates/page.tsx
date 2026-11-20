"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DEFAULT_RATES,
  WEIGHT_CONVERSIONS,
  GOLD_PURITIES,
  calculateGoldSilverRatio,
  formatGBP,
  formatUKDateTime,
} from "@/lib/rates";
import PriceHistoryChart from "@/components/rates/PriceHistoryChart";

export default function RatesPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState("");
  const [unitMode, setUnitMode] = useState<"gram" | "tola" | "ounce">("gram");

  // Interactive Calculator State
  const [calcMetal, setCalcMetal] = useState<"gold" | "silver">("gold");
  const [calcKarat, setCalcKarat] = useState<number>(22);
  const [calcUnit, setCalcUnit] = useState<"gram" | "tola" | "ounce">("tola");
  const [calcQuantity, setCalcQuantity] = useState<number>(1);

  const fetchRates = async (fresh = false) => {
    if (fresh) setIsRefreshing(true);
    try {
      const url = fresh
        ? `/api/rates?fresh=true&t=${Date.now()}`
        : `/api/rates?t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRates({
          goldGbpPerGram: data.goldGbpPerGram || DEFAULT_RATES.goldGbpPerGram,
          silverGbpPerGram: data.silverGbpPerGram || DEFAULT_RATES.silverGbpPerGram,
          goldOunceGbp: data.goldOunceGbp,
          silverOunceGbp: data.silverOunceGbp,
          goldChange24h: data.goldChange24h,
          goldChangePercent24h: data.goldChangePercent24h,
          goldLiveHigh: data.goldLiveHigh,
          goldLiveLow: data.goldLiveLow,
          silverChange24h: data.silverChange24h,
          silverChangePercent24h: data.silverChangePercent24h,
          silverLiveHigh: data.silverLiveHigh,
          silverLiveLow: data.silverLiveLow,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          isLive: data.isLive ?? true,
          currency: data.currency || "GBP",
        });
        setLastUpdatedDisplay(formatUKDateTime(new Date(data.lastUpdated || Date.now())));
      }
    } catch {
      // Keep existing rates on network hiccup
    } finally {
      if (fresh) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    setLastUpdatedDisplay(formatUKDateTime());
    fetchRates(true);
    const timer = setInterval(() => {
      fetchRates(false);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const goldGram = rates.goldGbpPerGram;
  const silverGram = rates.silverGbpPerGram;
  const ratio = calculateGoldSilverRatio(goldGram, silverGram);

  // Calculator computation
  const calcBaseRate =
    calcMetal === "gold"
      ? goldGram * (calcKarat / 24)
      : silverGram;

  const calcWeightMultiplier =
    calcUnit === "tola"
      ? WEIGHT_CONVERSIONS.tolaTraditional
      : calcUnit === "ounce"
      ? WEIGHT_CONVERSIONS.troyOunce
      : 1;

  const calculatedTotal = (calcQuantity || 0) * calcBaseRate * calcWeightMultiplier;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 pt-6 sm:pt-28 pb-20 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Top Header & Live Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[#dfcca6] pb-6 sm:pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8b6914] bg-[#faf5ea] px-2.5 py-0.5 rounded border border-[#dfcca6]">
                London Bullion Wholesale (LBMA Live Feed)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Live Gold & Silver Rates
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 max-w-xl">
              Real-time precious metal wholesale spot prices benchmarked to London trading desks. Auto-updated every 2 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="text-xs text-slate-700 bg-white border border-[#dfcca6] rounded-xl px-3.5 py-2 shadow-2xs">
              <span className="text-zinc-500 block text-[9.5px] uppercase font-medium">Last Updated</span>
              <span className="font-semibold text-[#8b6914] text-[11px] sm:text-xs">{lastUpdatedDisplay}</span>
            </div>
            <button
              onClick={() => fetchRates(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#8b6914] hover:bg-[#72540f] text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? "Updating..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Primary Rate Cards Grid (Gold, Silver, Ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Gold Spot Card */}
          <div className="relative overflow-hidden bg-white border-2 border-[#dfcca6] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🟡</span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Gold Spot 24K</h3>
                  <span className="text-[11px] text-zinc-500">Pure 999.9 Fine</span>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  (rates.goldChangePercent24h ?? 0) >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {(rates.goldChangePercent24h ?? 0) >= 0 ? "+" : ""}
                {rates.goldChangePercent24h ?? 0}%
              </span>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Per Gram</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{formatGBP(goldGram)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#dfcca6]/50 pt-2">
                <span className="text-zinc-600 text-xs">Per Tola (11.66g)</span>
                <span className="text-base font-bold text-[#8b6914]">
                  {formatGBP(goldGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#dfcca6]/50 pt-2">
                <span className="text-zinc-600 text-xs">Per Ounce (31.10g)</span>
                <span className="text-base font-bold text-slate-800">
                  {formatGBP(rates.goldOunceGbp || goldGram * WEIGHT_CONVERSIONS.troyOunce)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#dfcca6]/50 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Day Range:</span>
              <span className="font-mono font-semibold text-slate-700">
                {formatGBP(rates.goldLiveLow || goldGram - 0.45)} – {formatGBP(rates.goldLiveHigh || goldGram + 0.35)}
              </span>
            </div>
          </div>

          {/* Silver Spot Card */}
          <div className="relative overflow-hidden bg-white border border-[#dfcca6] rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚪</span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Silver Spot</h3>
                  <span className="text-[11px] text-zinc-500">Fine 999.0 Pure</span>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  (rates.silverChangePercent24h ?? 0) >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {(rates.silverChangePercent24h ?? 0) >= 0 ? "+" : ""}
                {rates.silverChangePercent24h ?? 0}%
              </span>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Per Gram</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{formatGBP(silverGram)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#dfcca6]/50 pt-2">
                <span className="text-zinc-600 text-xs">Per Tola (11.66g)</span>
                <span className="text-base font-bold text-slate-700">
                  {formatGBP(silverGram * WEIGHT_CONVERSIONS.tolaTraditional)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#dfcca6]/50 pt-2">
                <span className="text-zinc-600 text-xs">Per Ounce (31.10g)</span>
                <span className="text-base font-bold text-slate-800">
                  {formatGBP(rates.silverOunceGbp || silverGram * WEIGHT_CONVERSIONS.troyOunce)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#dfcca6]/50 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Day Range:</span>
              <span className="font-mono font-semibold text-slate-700">
                {formatGBP(rates.silverLiveLow || silverGram - 0.03)} – {formatGBP(rates.silverLiveHigh || silverGram + 0.03)}
              </span>
            </div>
          </div>

          {/* Gold/Silver Ratio & Quick Tools Card */}
          <div className="relative overflow-hidden bg-white border border-[#dfcca6] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b6914] bg-[#faf5ea] px-2.5 py-1 rounded-full border border-[#dfcca6]">
                Market Equilibrium
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900 mt-3">Gold / Silver Ratio</h3>
              <p className="text-xs text-zinc-500 mt-1">Number of silver ounces needed to purchase 1 gold ounce.</p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#8b6914]">{ratio}</span>
                <span className="text-xs text-zinc-500 font-medium">Ounces Ratio</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#dfcca6]/50 flex items-center gap-2">
              <Link
                href="/zakat"
                className="flex-1 text-center py-2 px-2.5 rounded-xl bg-[#faf8f5] border border-[#dfcca6] hover:bg-[#faf5ea] text-xs font-bold text-[#8b6914] transition-all hover:scale-[1.02]"
              >
                Zakat Calculator →
              </Link>
              <Link
                href="/gold-bars"
                className="flex-1 text-center py-2 px-2.5 rounded-xl bg-[#faf8f5] border border-[#dfcca6] hover:bg-[#faf5ea] text-xs font-bold text-[#8b6914] transition-all hover:scale-[1.02]"
              >
                Bullion Bars →
              </Link>
            </div>
          </div>
        </div>

        {/* Karat Purity Live Rate Grid */}
        <div className="bg-white border border-[#dfcca6] rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-[#dfcca6]/50">
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900">Gold Karat Breakdown</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Wholesale spot values for all standard jewellery karats.</p>
            </div>

            <div className="inline-flex bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6] self-start sm:self-auto">
              {(["gram", "tola", "ounce"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setUnitMode(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    unitMode === mode
                      ? "bg-[#8b6914] text-white shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Per {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-5">
            {GOLD_PURITIES.map((p) => {
              const multiplier =
                unitMode === "tola"
                  ? WEIGHT_CONVERSIONS.tolaTraditional
                  : unitMode === "ounce"
                  ? WEIGHT_CONVERSIONS.troyOunce
                  : 1;
              const price = goldGram * p.fraction * multiplier;

              return (
                <div
                  key={p.karat}
                  className="bg-[#faf8f5] border border-[#dfcca6] hover:border-[#8b6914] rounded-xl p-3 sm:p-4 transition-all duration-200 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-serif font-bold text-slate-900 group-hover:text-[#8b6914] transition-colors">
                      {p.karat}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#8b6914] bg-[#faf5ea] px-1.5 py-0.5 rounded border border-[#dfcca6]">
                      {p.purity}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 truncate">{p.label}</p>
                  <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-2.5">{formatGBP(price)}</p>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mt-0.5">
                    /{unitMode}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Live Metal Calculator */}
        <div className="bg-white border-2 border-[#dfcca6] rounded-2xl p-5 sm:p-8 shadow-xs">
          <div className="border-b border-[#dfcca6]/50 pb-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b6914] bg-[#faf5ea] px-2.5 py-1 rounded-full border border-[#dfcca6]">
              Instant Valuation
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mt-2">
              Interactive Metal Value Calculator
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Calculate exact real-time wholesale spot value for any quantity of gold or silver.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Metal Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Metal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcMetal("gold")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      calcMetal === "gold"
                        ? "bg-[#faf5ea] text-[#8b6914] border-[#8b6914] shadow-2xs"
                        : "bg-[#faf8f5] text-slate-600 border-[#dfcca6] hover:text-slate-900"
                    }`}
                  >
                    🟡 Gold
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcMetal("silver")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      calcMetal === "silver"
                        ? "bg-slate-100 text-slate-900 border-slate-700 shadow-2xs"
                        : "bg-[#faf8f5] text-slate-600 border-[#dfcca6] hover:text-slate-900"
                    }`}
                  >
                    ⚪ Silver
                  </button>
                </div>
              </div>

              {/* Karat (If Gold) */}
              {calcMetal === "gold" && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Gold Karat (Purity)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[24, 22, 21, 18, 14, 9].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setCalcKarat(k)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          calcKarat === k
                            ? "bg-[#8b6914] text-white border-[#8b6914] shadow-2xs"
                            : "bg-[#faf8f5] text-slate-700 border-[#dfcca6] hover:border-slate-400"
                        }`}
                      >
                        {k}K
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Weight Unit
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["gram", "tola", "ounce"] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setCalcUnit(u)}
                        className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border cursor-pointer ${
                          calcUnit === u
                            ? "bg-[#faf5ea] text-[#8b6914] border-[#8b6914] font-bold"
                            : "bg-[#faf8f5] text-slate-600 border-[#dfcca6]"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Quantity / Weight
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#faf8f5] border border-[#dfcca6] rounded-xl px-4 py-2 text-slate-900 font-bold focus:outline-hidden focus:border-[#8b6914]"
                    placeholder="Enter amount..."
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-5 bg-[#faf5ea] border-2 border-[#caa771] rounded-2xl p-5 sm:p-7 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b6914] bg-white px-3 py-1 rounded-full border border-[#dfcca6]">
                Current Live Estimate
              </span>
              <p className="text-xs text-zinc-600 mt-3.5">
                {calcQuantity} {calcUnit} of {calcMetal === "gold" ? `${calcKarat}K Gold` : "Fine Silver"}
              </p>
              <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1.5">
                {formatGBP(calculatedTotal)}
              </div>
              <p className="text-[11px] text-[#8b6914] font-medium mt-1.5">
                Spot Benchmark: {formatGBP(calcBaseRate)}/g
              </p>

              <div className="mt-5 pt-4 border-t border-[#dfcca6] flex flex-col gap-2">
                <Link
                  href={`/contact?inquiry=${encodeURIComponent(`Live Rates Quote: ${calcQuantity} ${calcUnit} of ${calcMetal === "gold" ? `${calcKarat}K Gold` : "Fine Silver"} worth approx ${formatGBP(calculatedTotal)}`)}`}
                  className="w-full py-2.5 rounded-xl bg-[#8b6914] hover:bg-[#72540f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  Lock Price / Inquire Now
                </Link>
                <Link
                  href="/sell-your-gold"
                  className="w-full py-2 rounded-xl bg-white border border-[#dfcca6] hover:border-[#8b6914] text-xs font-bold text-[#8b6914] transition-all"
                >
                  Sell This Gold To Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Price Chart */}
        <PriceHistoryChart liveGoldGram={goldGram} liveSilverGram={silverGram} />

        {/* Quick Nav Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
          <Link
            href="/gold-bars"
            className="group bg-white border border-[#dfcca6] hover:border-[#8b6914] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-xs"
          >
            <span className="text-3xl">🧱</span>
            <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#8b6914] mt-2">
              Minted Bullion Bars
            </h3>
            <p className="text-xs text-zinc-600 mt-1">
              Explore LBMA accredited investment bars from PAMP Suisse, The Royal Mint, and Valcambi.
            </p>
            <span className="text-xs font-bold text-[#8b6914] mt-3 inline-flex items-center gap-1">
              Browse Bullion →
            </span>
          </Link>

          <Link
            href="/zakat"
            className="group bg-white border border-[#dfcca6] hover:border-[#8b6914] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-xs"
          >
            <span className="text-3xl">⚖️</span>
            <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#8b6914] mt-2">
              Zakat Calculator
            </h3>
            <p className="text-xs text-zinc-600 mt-1">
              Accurate Hanafi and Ja&apos;fari nisab calculation dynamically connected to live spot rates.
            </p>
            <span className="text-xs font-bold text-[#8b6914] mt-3 inline-flex items-center gap-1">
              Calculate Zakat →
            </span>
          </Link>

          <Link
            href="/sell-your-gold"
            className="group bg-white border border-[#dfcca6] hover:border-[#8b6914] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-xs"
          >
            <span className="text-3xl">💎</span>
            <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#8b6914] mt-2">
              Sell Scrap & Jewellery
            </h3>
            <p className="text-xs text-zinc-600 mt-1">
              Top market payouts for old Asian gold, broken jewellery, and sovereign coins in Bradford.
            </p>
            <span className="text-xs font-bold text-[#8b6914] mt-3 inline-flex items-center gap-1">
              Get Valuation →
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}
