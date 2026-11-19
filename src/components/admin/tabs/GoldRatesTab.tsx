'use client';

import React from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles } from '../types';
import { GoldRatesIcon, SparklesIcon } from '../AdminIcons';

interface GoldRatesTabProps {
  themeStyles: AdminThemeStyles;
  gold24kRate: string;
  setGold24kRate: (rate: string) => void;
  gold22kRate: string;
  setGold22kRate: (rate: string) => void;
}

export default function GoldRatesTab({
  themeStyles,
  gold24kRate,
  setGold24kRate,
  gold22kRate,
  setGold22kRate,
}: GoldRatesTabProps) {
  const { cardBg, subtitleColor, isLight, accentGold, inputBg, primaryBtn } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      <div className={`${cardBg} rounded-[5px] p-6 max-w-2xl mx-auto space-y-6`}>
        <div>
          <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
            <GoldRatesIcon className="w-5 h-5 text-gray-900" />
            <span>Live Gold Bullion Pricing Engine</span>
          </h2>
          <p className={`text-xs ${subtitleColor} mt-1`}>
            Adjust per-gram rates in PKR to update catalog prices automatically across the entire site.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className={`block text-xs uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
              24K Pure Gold Rate (PKR / Gram)
            </label>
            <input
              type="text"
              value={gold24kRate}
              onChange={(e) => setGold24kRate(e.target.value)}
              className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
              22K Jewelry Gold Rate (PKR / Gram)
            </label>
            <input
              type="text"
              value={gold22kRate}
              onChange={(e) => setGold22kRate(e.target.value)}
              className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
            />
          </div>

          <div
            className={`p-4 ${
              isLight ? 'bg-[#f7f3eb] border-[#e8dfd3]' : 'bg-[#1a120e] border-[#2c201a]'
            } border rounded-[5px] text-xs ${subtitleColor}`}
          >
            <p className={`font-semibold ${accentGold} mb-1 flex items-center gap-1.5`}>
              <SparklesIcon className="w-4 h-4 text-gray-900" />
              <span>Automated Pricing Formula:</span>
            </p>
            <p>Catalog price = (Gold Weight &times; 22K Rate) + Artisan Making Charges + Diamond Carat Value.</p>
          </div>

          <button
            onClick={() => alert('Gold Rates Updated Live!')}
            className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer`}
          >
            <GoldRatesIcon className="w-4 h-4" />
            <span>Save &amp; Push Gold Rates Live</span>
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
