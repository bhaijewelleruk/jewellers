"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from "@/lib/rates";
import { BullionProduct, INITIAL_GOLD_ITEMS } from "@/data/bullion-items";

export default function GoldBarsPage() {
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [goldProducts] = useState<BullionProduct[]>(INITIAL_GOLD_ITEMS);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState("");
  const [filter, setFilter] = useState<"all" | "bar" | "coin">("all");

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

  const goldGram = rates.goldGbpPerGram;

  const filteredItems = goldProducts.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 pt-6 sm:pt-28 pb-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10">
        
        {/* Header & Spot Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 border-b border-[#dfcca6] pb-5 sm:pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8b6914] bg-[#faf5ea] px-2.5 py-0.5 rounded border border-[#dfcca6]">
                LBMA Accredited Bullion Direct
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Investment Gold Bars & Coins
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
              Physical investment grade minted gold bars and legal tender coins from PAMP Suisse, The Royal Mint, and Valcambi. Zero VAT in the UK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-xs text-slate-700 bg-white border border-[#dfcca6] rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-2xs">
              <span className="text-zinc-500 block text-[9px] sm:text-[9.5px] uppercase font-medium">Live 24K Spot</span>
              <span className="font-extrabold text-sm sm:text-base text-[#8b6914]">{formatGBP(goldGram)}/g</span>
            </div>
            <Link
              href="/rates"
              className="px-3 py-2 rounded-xl bg-white border border-[#dfcca6] hover:border-[#8b6914] text-xs font-bold text-[#8b6914] transition-all shadow-2xs"
            >
              Rates Portal →
            </Link>
          </div>
        </div>

        {/* Filters & Sub Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="inline-flex bg-[#ffffff] p-1 rounded-xl border border-[#dfcca6] shadow-2xs">
            {(["all", "bar", "coin"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold capitalize transition-all cursor-pointer ${
                  filter === t
                    ? "bg-[#8b6914] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t === "all" ? "All Bullion" : t === "bar" ? "Gold Bars" : "Coins"}
              </button>
            ))}
          </div>

          <div className="text-[11px] sm:text-xs text-zinc-500 flex items-center gap-2 font-medium">
            <span>{filteredItems.length} items</span>
            <span className="text-zinc-300">|</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">0% VAT Exempt</span>
          </div>
        </div>

        {/* ── 2 Cards Per Row On Mobile (grid-cols-2) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredItems.map((item) => {
            const calculatedPrice =
              item.priceMode === "fixed" && item.customPriceOverride
                ? item.customPriceOverride
                : goldGram * item.weightGrams * (1 + item.premiumPercentage);

            const whatsappMessage = encodeURIComponent(
              `Hello Bhai Jeweller, I want to inquire about purchasing the ${item.name} (${item.purity}) currently listed at approximately ${formatGBP(calculatedPrice)}.`
            );

            return (
              <div
                key={item.id}
                className="bg-white border border-[#dfcca6] hover:border-[#8b6914] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Header */}
                  <div className="relative h-32 sm:h-52 bg-gradient-to-b from-[#faf5ea]/50 to-white p-2 sm:p-5 flex items-center justify-center overflow-hidden border-b border-[#dfcca6]/40">
                    {item.popular && (
                      <span className="absolute top-2 left-2 bg-[#8b6914] text-white text-[8px] sm:text-[9.5px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs z-10">
                        Popular
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-[#dfcca6] text-slate-700 text-[8.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full z-10">
                      {item.vatStatus || "0% VAT"}
                    </span>

                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={170}
                      height={170}
                      className="max-h-24 sm:max-h-40 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      unoptimized
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 sm:p-5 space-y-1.5 sm:space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-500">
                      <span className="truncate pr-1">{item.refiner}</span>
                      <span className="font-mono text-[#8b6914] font-bold flex-shrink-0">{item.purity}</span>
                    </div>

                    <h3 className="font-serif font-bold text-xs sm:text-lg text-slate-900 group-hover:text-[#8b6914] transition-colors leading-tight line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
                      <span className="text-[9px] sm:text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded">
                        {item.badge || "LBMA"}
                      </span>
                      {item.perk && (
                        <span className="text-[9px] sm:text-[10.5px] text-zinc-600 bg-[#faf8f5] px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded border border-[#dfcca6] hidden sm:inline">
                          {item.perk}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Pricing & Action Footer */}
                <div className="p-2.5 sm:p-5 pt-0 border-t border-[#dfcca6]/30 mt-1 sm:mt-2 space-y-2 sm:space-y-3">
                  <div className="flex items-baseline justify-between pt-2 sm:pt-3.5">
                    <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider font-medium">Est. Price</span>
                    <span className="text-sm sm:text-2xl font-extrabold text-slate-900">
                      {formatGBP(calculatedPrice)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <a
                      href={`https://wa.me/447472027202?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-[#8b6914] hover:bg-[#72540f] text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-xs"
                    >
                      Lock
                    </a>
                    <Link
                      href={`/contact?inquiry=${encodeURIComponent(`Gold Bullion Inquiry: ${item.name} (${item.purity}) estimated at ${formatGBP(calculatedPrice)}`)}`}
                      className="text-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-white border border-[#dfcca6] hover:border-[#8b6914] text-[10px] sm:text-xs font-bold text-[#8b6914] transition-all"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VAT & Bullion Trust Information */}
        <div className="bg-white border border-[#dfcca6] rounded-2xl p-4 sm:p-7 space-y-2.5 sm:space-y-3 shadow-xs">
          <h2 className="font-serif font-bold text-base sm:text-xl text-slate-900">
            UK Investment Gold Exemption Notice
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            All investment-grade gold bars and minted coins with a purity of not less than 995 thousandths (99.5%) are exempt from Value Added Tax (VAT) in the United Kingdom under HMRC Notice 701/21. Sovereign and Britannia coins are also exempt from Capital Gains Tax (CGT) for UK residents due to their status as legal tender currency.
          </p>
          <div className="flex flex-wrap gap-2.5 sm:gap-5 text-xs font-bold text-[#8b6914] pt-1">
            <span>✓ 100% Guaranteed Purity</span>
            <span>✓ LBMA Accredited Refiners</span>
            <span>✓ Insured Delivery or Showroom Collection</span>
          </div>
        </div>

      </div>
    </div>
  );
}
