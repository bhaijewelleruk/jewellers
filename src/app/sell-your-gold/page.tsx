"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_RATES, WEIGHT_CONVERSIONS, formatGBP, formatUKDateTime } from "@/lib/rates";

interface KaratConfig {
  karat: string;
  name: string;
  purityDecimal: number;
  hallmark: string;
  lowMultiplier: number;
  highMultiplier: number;
}

const KARAT_CONFIGS: KaratConfig[] = [
  { karat: "24ct", name: "Pure Fine Gold", purityDecimal: 0.999, hallmark: "999", lowMultiplier: 0.95, highMultiplier: 0.985 },
  { karat: "22ct", name: "Asian Standard Gold", purityDecimal: 0.916, hallmark: "916", lowMultiplier: 0.945, highMultiplier: 0.975 },
  { karat: "21ct", name: "Middle Eastern Gold", purityDecimal: 0.875, hallmark: "875", lowMultiplier: 0.94, highMultiplier: 0.97 },
  { karat: "18ct", name: "Diamond & Luxury Standard", purityDecimal: 0.750, hallmark: "750", lowMultiplier: 0.935, highMultiplier: 0.965 },
  { karat: "14ct", name: "Everyday Jewellery", purityDecimal: 0.585, hallmark: "585", lowMultiplier: 0.93, highMultiplier: 0.96 },
  { karat: "9ct", name: "British Standard Gold", purityDecimal: 0.375, hallmark: "375", lowMultiplier: 0.92, highMultiplier: 0.95 },
];

export default function SellYourGoldPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState("");

  // Calculator Inputs
  const [selectedKarat, setSelectedKarat] = useState<string>("22ct");
  const [grossWeight, setGrossWeight] = useState<string>("20");
  const [weightUnit, setWeightUnit] = useState<"gram" | "tola" | "ounce">("gram");
  const [stoneWeight, setStoneWeight] = useState<string>("0");

  useEffect(() => {
    setLastUpdatedDisplay(formatUKDateTime());
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
          setLastUpdatedDisplay(formatUKDateTime(new Date(data.lastUpdated)));
        }
      })
      .catch(() => {});
  }, []);

  const spotGold = rates.goldGbpPerGram;
  const activeKarat = KARAT_CONFIGS.find((k) => k.karat === selectedKarat) || KARAT_CONFIGS[1];

  const parsedGross = parseFloat(grossWeight) || 0;
  const parsedStones = parseFloat(stoneWeight) || 0;

  let multiplier = 1;
  if (weightUnit === "tola") multiplier = WEIGHT_CONVERSIONS.tolaTraditional;
  if (weightUnit === "ounce") multiplier = WEIGHT_CONVERSIONS.troyOunce;

  const grossInGrams = parsedGross * multiplier;
  const netGoldGrams = Math.max(0, grossInGrams - parsedStones);

  // Spot pure value
  const baseValuePerGram = spotGold * activeKarat.purityDecimal;
  const lowEstimate = netGoldGrams * baseValuePerGram * activeKarat.lowMultiplier;
  const highEstimate = netGoldGrams * baseValuePerGram * activeKarat.highMultiplier;

  const whatsappMessage = encodeURIComponent(
    `Hello Bhai Jeweller, I want to sell my gold. Estimation: ${grossWeight} ${weightUnit} of ${selectedKarat} gold (net ~${netGoldGrams.toFixed(1)}g), estimated value around ${formatGBP(lowEstimate)} - ${formatGBP(highEstimate)}.`
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 pt-6 sm:pt-28 pb-20 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8b6914] bg-[#faf5ea] px-3 py-1 rounded-full border border-[#dfcca6]">
            Bradford Gold Buying Service
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Sell Your Gold For Immediate Cash Or Transfer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Get top UK market rates for your scrap gold, broken jewellery, sovereign coins, and Asian bridal sets. Transparent testing on certified scales.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-700 bg-white border border-[#dfcca6] px-4 py-1.5 rounded-full shadow-2xs mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Live 24K Spot: <strong>{formatGBP(spotGold)}/g</strong></span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500 font-medium">{lastUpdatedDisplay}</span>
          </div>
        </div>

        {/* Valuation Estimator & Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-7 bg-white border-2 border-[#dfcca6] rounded-2xl p-5 sm:p-8 space-y-5 shadow-xs">
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900">Instant Scrap Gold Estimator</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Select karat and enter approximate weight to calculate your payout.</p>
            </div>

            {/* Karat selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                Select Gold Karat
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KARAT_CONFIGS.map((k) => (
                  <button
                    key={k.karat}
                    type="button"
                    onClick={() => setSelectedKarat(k.karat)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedKarat === k.karat
                        ? "bg-[#faf5ea] text-[#8b6914] border-[#8b6914] shadow-2xs"
                        : "bg-[#faf8f5] text-slate-700 border-[#dfcca6] hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-slate-900">{k.karat}</span>
                      <span className="text-[10px] font-mono font-bold text-[#8b6914]">{k.hallmark}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 block truncate font-medium">{k.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                  Unit
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#faf8f5] p-1 rounded-xl border border-[#dfcca6]">
                  {(["gram", "tola", "ounce"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setWeightUnit(u)}
                      className={`py-1.5 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                        weightUnit === u
                          ? "bg-[#8b6914] text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                  Gross Weight
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#dfcca6] rounded-xl px-4 py-2 text-slate-900 font-bold focus:outline-hidden focus:border-[#8b6914]"
                  placeholder="e.g. 25"
                />
              </div>
            </div>

            {/* Non-gold stone deduction optional */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                Estimated Stones / Wax Deduction (in grams, optional)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={stoneWeight}
                onChange={(e) => setStoneWeight(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#dfcca6] rounded-xl px-4 py-2 text-slate-800 text-sm focus:outline-hidden focus:border-[#8b6914]"
                placeholder="0 if pure plain gold or no heavy stones"
              />
            </div>
          </div>

          {/* Output Card */}
          <div className="lg:col-span-5 bg-[#faf5ea] border-2 border-[#caa771] rounded-2xl p-5 sm:p-7 text-center shadow-xs space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b6914] bg-white px-3 py-1 rounded-full border border-[#dfcca6]">
              Estimated Cash Payout
            </span>

            <div>
              <p className="text-xs text-zinc-600 font-medium">
                {netGoldGrams.toFixed(2)}g Net {selectedKarat} ({activeKarat.name})
              </p>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {formatGBP(lowEstimate)} – {formatGBP(highEstimate)}
              </div>
              <p className="text-xs text-[#8b6914] mt-1 font-bold">
                Payout Rate: ~{formatGBP(lowEstimate / Math.max(netGoldGrams, 0.01))}/g – {formatGBP(highEstimate / Math.max(netGoldGrams, 0.01))}/g
              </p>
            </div>

            <div className="text-left text-xs text-zinc-700 bg-white p-3.5 rounded-xl border border-[#dfcca6] space-y-1.5 shadow-2xs">
              <div className="flex justify-between">
                <span>Spot Value:</span>
                <span className="font-bold text-slate-900">{formatGBP(netGoldGrams * baseValuePerGram)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-emerald-700 font-bold">Immediate Cash or Faster Payment</span>
              </div>
              <div className="flex justify-between">
                <span>Required ID:</span>
                <span className="text-slate-800 font-medium">UK Driving Licence or Passport</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/447472027202?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#8b6914] hover:bg-[#72540f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                Lock Price via WhatsApp
              </a>
              <Link
                href="/contact"
                className="w-full py-2 rounded-xl bg-white border border-[#dfcca6] hover:border-[#8b6914] text-xs font-bold text-[#8b6914] transition-all"
              >
                Visit Our Bradford Showroom
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
          <div className="bg-white border border-[#dfcca6] rounded-2xl p-5 sm:p-6 shadow-2xs">
            <span className="text-2xl font-serif font-bold text-[#8b6914]">01.</span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1.5">Bring or Post</h3>
            <p className="text-xs text-zinc-600 mt-1">
              Visit our Bradford showroom or request an insured Royal Mail Special Delivery pack.
            </p>
          </div>
          <div className="bg-white border border-[#dfcca6] rounded-2xl p-5 sm:p-6 shadow-2xs">
            <span className="text-2xl font-serif font-bold text-[#8b6914]">02.</span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1.5">Certified Testing</h3>
            <p className="text-xs text-zinc-600 mt-1">
              We test your gold in front of you using precision XRF acid spectroscopy and trade-approved scales.
            </p>
          </div>
          <div className="bg-white border border-[#dfcca6] rounded-2xl p-5 sm:p-6 shadow-2xs">
            <span className="text-2xl font-serif font-bold text-[#8b6914]">03.</span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1.5">Instant Settlement</h3>
            <p className="text-xs text-zinc-600 mt-1">
              Receive your funds immediately in cash or direct bank transfer within minutes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
