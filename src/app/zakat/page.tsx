"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatGBP, formatUKDateTime } from "@/lib/rates";

export default function ZakatPage() {
  // Fiqh selection: Hanafi vs Ja'fari
  const [fiqh, setFiqh] = useState<"hanafi" | "jafari">("hanafi");

  // Gold Purity selection (karat)
  const [selectedPurity, setSelectedPurity] = useState<number>(22);
  const [customPurity, setCustomPurity] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  // Weight mode & amount
  const [weightMode, setWeightMode] = useState<"grams" | "tolas">("grams");
  const [weightInput, setWeightInput] = useState<string>("100");

  // Accordion breakdown state
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Live gold spot rate (GBP per gram 24ct)
  const [liveRate24k, setLiveRate24k] = useState(93.47);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    setLastUpdated(formatUKDateTime());
    fetch(`/api/rates?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.goldGbpPerGram) {
          setLiveRate24k(data.goldGbpPerGram);
          setLastUpdated(formatUKDateTime(new Date(data.lastUpdated || Date.now())));
        }
      })
      .catch(() => {});
  }, []);

  // Active karat
  const activeKarat = isCustom ? (parseFloat(customPurity) || 24) : selectedPurity;
  const purityFraction = Math.min(Math.max(activeKarat / 24, 0), 1);

  // Weight in grams calculation
  const rawWeight = parseFloat(weightInput) || 0;
  const weightInGrams = weightMode === "tolas" ? rawWeight * 11.6638 : rawWeight;

  // Fine pure 24K equivalent weight
  const fineGoldGrams = weightInGrams * purityFraction;
  const totalGoldValueGBP = fineGoldGrams * liveRate24k;

  // Nisab definitions
  // Fiqh Hanafi: 7.5 Tolas = 87.48 Grams of gold
  const hanafiNisabGrams = 87.48;
  const hanafiNisabGBP = hanafiNisabGrams * liveRate24k;

  // Fiqh Ja'fari: 15 Ordinary Mithqals ≈ 69.12 Grams of minted/bullion gold
  const jafariNisabGrams = 69.12;
  const jafariNisabGBP = jafariNisabGrams * liveRate24k;

  const currentNisabGrams = fiqh === "hanafi" ? hanafiNisabGrams : jafariNisabGrams;
  const currentNisabGBP = fiqh === "hanafi" ? hanafiNisabGBP : jafariNisabGBP;

  const isEligible = fineGoldGrams >= currentNisabGrams;
  const zakatDueGBP = isEligible ? totalGoldValueGBP * 0.025 : 0;

  const standardPurities = [24, 23, 22, 21, 20, 18, 14, 9];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 pt-6 sm:pt-28 pb-20 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8b6914] bg-[#faf5ea] px-3 py-1 rounded-full border border-[#dfcca6]">
            Shariah Compliant Precious Metal Tool
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Live Gold Zakat Calculator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Accurately determine your Zakat liability on gold and bullion based on today&apos;s real-time London Bullion wholesale spot rates.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-700 bg-white border border-[#dfcca6] px-4 py-1.5 rounded-full shadow-2xs mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>24K Benchmark: <strong>{formatGBP(liveRate24k)}/g</strong></span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500 font-medium">{lastUpdated}</span>
          </div>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white border-2 border-[#dfcca6] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6 sm:space-y-8">
          
          {/* Step 1: Fiqh Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2.5">
              1. Select Islamic School of Thought (Fiqh)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setFiqh("hanafi")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  fiqh === "hanafi"
                    ? "bg-[#faf5ea] border-[#8b6914] shadow-2xs"
                    : "bg-[#faf8f5] border-[#dfcca6] hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-slate-900">Hanafi Fiqh</span>
                  {fiqh === "hanafi" && <span className="text-[#8b6914] text-xs font-bold">✓ Selected</span>}
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  Nisab threshold: <strong>7.5 Tolas (87.48g)</strong> of fine gold. Applies to both bullion and jewellery.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFiqh("jafari")}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  fiqh === "jafari"
                    ? "bg-[#faf5ea] border-[#8b6914] shadow-2xs"
                    : "bg-[#faf8f5] border-[#dfcca6] hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-slate-900">Ja&apos;fari Fiqh</span>
                  {fiqh === "jafari" && <span className="text-[#8b6914] text-xs font-bold">✓ Selected</span>}
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  Nisab threshold: <strong>15 Mithqals (~69.12g)</strong> of minted/bullion currency coins and bars.
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Gold Karat / Purity */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Select Gold Karat / Fineness
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustom(!isCustom);
                  if (!isCustom) setCustomPurity("22");
                }}
                className="text-xs font-bold text-[#8b6914] hover:underline cursor-pointer"
              >
                {isCustom ? "Choose standard karat" : "Custom purity?"}
              </button>
            </div>

            {isCustom ? (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="24"
                  value={customPurity}
                  onChange={(e) => setCustomPurity(e.target.value)}
                  className="bg-[#faf8f5] border border-[#dfcca6] rounded-xl px-4 py-2 text-slate-900 font-bold w-32 focus:outline-hidden focus:border-[#8b6914]"
                  placeholder="e.g. 21.6"
                />
                <span className="text-xs text-zinc-500 font-medium">Karat (e.g. 21.6K)</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {standardPurities.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelectedPurity(k)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedPurity === k
                        ? "bg-[#8b6914] text-white border-[#8b6914] shadow-2xs"
                        : "bg-[#faf8f5] text-slate-700 border-[#dfcca6] hover:border-slate-400"
                    }`}
                  >
                    {k}K
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Weight Mode & Quantity */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2.5">
              3. Enter Total Gold Weight
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="flex bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
                <button
                  type="button"
                  onClick={() => setWeightMode("grams")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    weightMode === "grams"
                      ? "bg-[#8b6914] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Grams (g)
                </button>
                <button
                  type="button"
                  onClick={() => setWeightMode("tolas")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    weightMode === "tolas"
                      ? "bg-[#8b6914] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tolas (11.66g)
                </button>
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#dfcca6] rounded-xl px-4 py-2.5 text-lg font-bold text-slate-900 focus:outline-hidden focus:border-[#8b6914]"
                  placeholder={`Enter weight in ${weightMode}...`}
                />
              </div>
            </div>
          </div>

          {/* Calculation Output Box */}
          <div className="bg-[#faf5ea] border-2 border-[#caa771] rounded-2xl p-5 sm:p-8 text-center space-y-3.5 shadow-xs">
            <span
              className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                isEligible
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
            >
              {isEligible ? "✓ Nisab Reached — Zakat Due" : "Nisab Not Reached"}
            </span>

            <div>
              <p className="text-xs text-zinc-600 font-medium">Total Zakat Due (2.5%)</p>
              <div className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-1">
                {isEligible ? formatGBP(zakatDueGBP) : "£0.00"}
              </div>
              {isEligible && (
                <p className="text-xs text-[#8b6914] mt-1.5 font-bold">
                  Equivalent to {(fineGoldGrams * 0.025).toFixed(2)}g of pure 24K gold
                </p>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3 border-t border-[#dfcca6] text-left">
              <div className="bg-white p-3 rounded-xl border border-[#dfcca6] shadow-2xs">
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Fine Gold Equivalent</span>
                <span className="text-sm font-bold text-slate-900">{fineGoldGrams.toFixed(2)}g</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#dfcca6] shadow-2xs">
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Total Asset Value</span>
                <span className="text-sm font-bold text-slate-900">{formatGBP(totalGoldValueGBP)}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#dfcca6] shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-500 uppercase block font-medium">Nisab Threshold</span>
                <span className="text-sm font-bold text-[#8b6914]">{formatGBP(currentNisabGBP)}</span>
              </div>
            </div>

            {/* Accordion Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-xs font-semibold text-[#8b6914] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {showBreakdown ? "Hide Fiqh Breakdown ▲" : "View Fiqh & Nisab Explanation ▼"}
              </button>

              {showBreakdown && (
                <div className="text-left text-xs text-zinc-700 space-y-2 mt-3 p-4 rounded-xl bg-white border border-[#dfcca6] animate-fadeIn shadow-2xs">
                  <p>
                    <strong className="text-slate-900">How is purity factored?</strong> Zakat is levied on the actual net fine gold content. Your {weightInput} {weightMode} of {activeKarat}K gold equals {fineGoldGrams.toFixed(2)}g of 24K pure gold ({((purityFraction) * 100).toFixed(1)}% purity).
                  </p>
                  <p>
                    <strong className="text-slate-900">Current Nisab:</strong> For {fiqh === "hanafi" ? "Hanafi" : "Ja'fari"} fiqh, the threshold is {currentNisabGrams}g of pure gold, which equates to {formatGBP(currentNisabGBP)} at today&apos;s live spot rate of {formatGBP(liveRate24k)}/g.
                  </p>
                  <p className="text-[11px] text-zinc-500 italic">
                    Note: If you hold gold below the nisab threshold but also possess cash or trade goods, many scholars recommend combining assets against the silver nisab. Please consult your local scholar for individual rulings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 border-t border-[#dfcca6] pt-5">
          <Link href="/rates" className="text-[#8b6914] font-bold hover:underline">
            ← Back to Live Bullion Rates
          </Link>
          <Link href="/contact" className="text-[#8b6914] font-bold hover:underline">
            Have jewellery to weigh or value? Visit our Bradford Showroom →
          </Link>
        </div>

      </div>
    </div>
  );
}
