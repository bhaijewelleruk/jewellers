'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { DEFAULT_RATES, formatGBP, formatUKDateTime } from '@/lib/rates';
import {
  BullionProduct,
  INITIAL_GOLD_ITEMS,
  INITIAL_SILVER_ITEMS,
} from '@/data/bullion-items';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface BullionShopViewProps {
  defaultMetal?: 'all' | 'gold' | 'silver';
  defaultCategory?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

const CATEGORIES = [
  'All Bullion',
  'Gold Bars',
  'Silver Bars',
  'Gold Coins',
  'Silver Coins',
  'PAMP Suisse',
  'The Royal Mint',
  'Valcambi',
] as const;

export function BullionShopContent({
  defaultMetal = 'all',
  defaultCategory = 'All Bullion',
  pageTitle,
  pageSubtitle,
}: BullionShopViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSearch = searchParams?.get('search') || searchParams?.get('q') || '';
  const urlCategory = searchParams?.get('category') || '';

  const [rates, setRates] = useState(DEFAULT_RATES);
  const [goldProducts, setGoldProducts] = useState<BullionProduct[]>(INITIAL_GOLD_ITEMS);
  const [silverProducts, setSilverProducts] = useState<BullionProduct[]>(INITIAL_SILVER_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlCategory || defaultCategory
  );
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState<string>('');

  useEffect(() => {
    setLastUpdatedDisplay(formatUKDateTime());

    // Fetch live rates
    fetch(`/api/rates?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.goldGbpPerGram) {
          setRates({
            goldGbpPerGram: data.goldGbpPerGram,
            silverGbpPerGram: data.silverGbpPerGram,
            lastUpdated: data.lastUpdated,
            isLive: true,
            currency: 'GBP',
          });
          setLastUpdatedDisplay(formatUKDateTime(new Date(data.lastUpdated)));
        }
      })
      .catch(() => {});

    // Fetch live gold bullion from DB/API
    fetch(`/api/bullion?metal=gold&t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setGoldProducts(data.items);
        }
      })
      .catch(() => {});

    // Fetch live silver bullion from DB/API
    fetch(`/api/bullion?metal=silver&t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setSilverProducts(data.items);
        }
      })
      .catch(() => {});
  }, []);

  // Sync state if URL query param changes
  useEffect(() => {
    const q = searchParams?.get('search') || searchParams?.get('q') || '';
    setSearchQuery(q);
    const cat = searchParams?.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const goldGram = rates.goldGbpPerGram;
  const silverGram = rates.silverGbpPerGram;

  // Combine products with live calculated price
  const allBullionItems = useMemo(() => {
    const combined = [...goldProducts, ...silverProducts];
    return combined.map((item) => {
      const metalRate = item.metal === 'silver' ? silverGram : goldGram;
      const calculatedPrice =
        item.priceMode === 'fixed' && item.customPriceOverride
          ? item.customPriceOverride
          : metalRate * item.weightGrams * (1 + (item.premiumPercentage || 0.05));
      return {
        ...item,
        calculatedPrice,
      };
    });
  }, [goldProducts, silverProducts, goldGram, silverGram]);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    let list = [...allBullionItems];

    // Filter by metal / category chip
    if (selectedCategory === 'Gold Bars') {
      list = list.filter((p) => p.metal === 'gold' && p.type === 'bar');
    } else if (selectedCategory === 'Silver Bars') {
      list = list.filter((p) => p.metal === 'silver' && p.type === 'bar');
    } else if (selectedCategory === 'Gold Coins') {
      list = list.filter((p) => p.metal === 'gold' && p.type === 'coin');
    } else if (selectedCategory === 'Silver Coins') {
      list = list.filter((p) => p.metal === 'silver' && p.type === 'coin');
    } else if (selectedCategory === 'PAMP Suisse') {
      list = list.filter(
        (p) =>
          p.refiner.toLowerCase().includes('pamp') ||
          p.name.toLowerCase().includes('pamp')
      );
    } else if (selectedCategory === 'The Royal Mint') {
      list = list.filter(
        (p) =>
          p.refiner.toLowerCase().includes('royal mint') ||
          p.name.toLowerCase().includes('sovereign') ||
          p.name.toLowerCase().includes('britannia')
      );
    } else if (selectedCategory === 'Valcambi') {
      list = list.filter((p) => p.refiner.toLowerCase().includes('valcambi'));
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const refinerMatch = p.refiner?.toLowerCase().includes(q);
        const purityMatch = p.purity?.toLowerCase().includes(q);
        const metalMatch = p.metal?.toLowerCase().includes(q);
        const typeMatch = p.type?.toLowerCase().includes(q);
        const weightMatch = `${p.weightGrams}g`.includes(q) || `${p.weightGrams}`.includes(q);
        return nameMatch || refinerMatch || purityMatch || metalMatch || typeMatch || weightMatch;
      });
    }

    // Sort
    if (sortBy === 'low') {
      list.sort((a, b) => a.calculatedPrice - b.calculatedPrice);
    } else if (sortBy === 'high') {
      list.sort((a, b) => b.calculatedPrice - a.calculatedPrice);
    } else if (sortBy === 'weight-asc') {
      list.sort((a, b) => a.weightGrams - b.weightGrams);
    } else if (sortBy === 'weight-desc') {
      list.sort((a, b) => b.weightGrams - a.weightGrams);
    }

    return list;
  }, [allBullionItems, selectedCategory, searchQuery, sortBy]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const titleText =
    pageTitle ||
    (selectedCategory === 'Gold Bars'
      ? 'Investment Gold Bars'
      : selectedCategory === 'Silver Bars'
      ? 'Fine Silver Bullion Bars'
      : selectedCategory === 'Gold Coins'
      ? 'Gold Sovereign & Britannia Coins'
      : selectedCategory === 'Silver Coins'
      ? 'Investment Silver Coins'
      : 'Investment Gold & Silver Bullion');

  const subtitleText =
    pageSubtitle ||
    'Physical investment-grade minted bars and legal tender coins. 0% VAT on investment gold in the UK.';

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pb-20">
      {/* ── Top Hero Banner (Matches /shop layout 1:1) ── */}
      <section className="relative w-full h-[190px] sm:h-[230px] md:h-[270px] bg-[#120e0b] overflow-hidden flex items-center justify-center text-center">
        <Image
          src="/images/shop-banner.jpg"
          alt="Investment Bullion Desk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-[#120e0b]/65 to-[#120e0b]/85" />

        <div className="relative z-10 px-4 max-w-2xl">
          {/* Live Spot Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1510]/80 border border-[#d8bb93]/40 text-[#d8bb93] text-[10.5px] font-semibold mb-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest uppercase">Live Bullion Desk</span>
            <span className="text-[#a49182]">•</span>
            <span className="text-white font-bold">Gold: {formatGBP(goldGram)}/g</span>
            <span className="text-[#a49182]">•</span>
            <span className="text-white font-bold">Silver: {formatGBP(silverGram)}/g</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#f5efe8] font-normal leading-tight">
            {searchQuery ? `Search: "${searchQuery}"` : titleText}
          </h1>
          <p className="text-xs sm:text-sm text-[#c8bdb5] font-light mt-1.5 max-w-xl mx-auto">
            {searchQuery
              ? `Showing bullion matching your query "${searchQuery}"`
              : subtitleText}
          </p>
        </div>
      </section>

      {/* ── Main Container (Matches /shop layout 1:1) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6">
        {/* Breadcrumb & Search Query Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <nav className="text-xs text-[#8c7e73] font-light flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1c1510] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/gold-bars"
              onClick={() => {
                setSelectedCategory('All Bullion');
                setSearchQuery('');
              }}
              className="hover:text-[#1c1510] transition-colors"
            >
              Bullion
            </Link>
            {selectedCategory !== 'All Bullion' && (
              <>
                <span>/</span>
                <span className="text-[#1c1510] font-normal">{selectedCategory}</span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-[#1c1510] font-normal truncate">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              </>
            )}
          </nav>

          {/* Active Search & Count Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6e5d4f] font-light">
              Found <strong>{filteredProducts.length}</strong>{' '}
              {filteredProducts.length === 1 ? 'bullion item' : 'bullion items'}
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ebd7be]/50 hover:bg-[#ebd7be] text-[#5a4329] text-xs font-medium border border-[#dec29b] transition-all shadow-2xs"
              >
                <span>Clear &ldquo;{searchQuery}&rdquo;</span>
                <span className="text-sm leading-none">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input Bar + Category Pills + Sort Bar */}
        <ScrollReveal direction="up" duration={500}>
          <div className="flex flex-col gap-4 pb-6 border-b border-[#e8dfd5]">
            {/* In-Page Real Search Input (Same as /shop) */}
            <div className="relative w-full max-w-xl mx-auto">
              <svg
                className="w-4 h-4 text-[#9e7d56] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bars, coins, PAMP, Royal Mint, 1g, 5g, 1oz, 1kg, 24K..."
                className="w-full bg-white text-[#1c1510] text-xs sm:text-sm placeholder-[#9a897b] border border-[#ded3c5] focus:border-[#9e7d56] rounded-full pl-10 pr-10 py-2.5 outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7e73] hover:text-[#1c1510] text-xs font-semibold p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips & Sort Dropdown (Same as /shop) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                        : 'bg-[#f0e8dc] text-[#6b5c50] hover:bg-[#e4dacf]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs text-[#6b5c50] self-end sm:self-auto shrink-0">
                <label htmlFor="bullionSortSelect" className="font-light">
                  Sort by:
                </label>
                <select
                  id="bullionSortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#f0e8dc] border border-[#dfd4c5] rounded-lg px-2.5 py-1 text-xs text-[#1c1510] outline-none cursor-pointer"
                >
                  <option value="featured">Featured Bullion</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="weight-asc">Weight: Light to Heavy</option>
                  <option value="weight-desc">Weight: Heavy to Light</option>
                </select>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Product Grid or Clean Empty State (2 Cols Mobile, 3 Tablet, 4 Desktop - Identical to /shop) ── */}
        {filteredProducts.length === 0 ? (
          <ScrollReveal direction="zoom" duration={500}>
            <div className="bg-white rounded-xl border border-[#ede5db] p-8 sm:p-12 text-center my-8 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#faf5ea] border border-[#dec29b] flex items-center justify-center mx-auto mb-3 text-2xl">
                ⚖️
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#1c1510] font-normal">
                No bullion products found
              </h3>
              <p className="text-xs sm:text-sm text-[#8c7e73] font-light mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any bullion matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another keyword or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Bullion');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-medium hover:bg-[#33261d] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-6">
            {filteredProducts.map((item, idx) => {
              const cleanRefiner = item.refiner.includes('/')
                ? item.refiner.split('/')[0].trim()
                : item.refiner;

              const whatsappMessage = encodeURIComponent(
                `Hello Bhai Jeweller, I want to lock the price for ${item.name} (${item.purity}) currently listed at approx ${formatGBP(item.calculatedPrice)}.`
              );

              const isZeroVat = item.metal === 'gold';

              return (
                <ScrollReveal key={item.id} delay={Math.min(idx * 30, 300)} direction="up">
                  <div className="group flex flex-col text-left transition-all duration-300 bg-white border border-[#dfcca6]/80 hover:border-[#8b6914] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-2xs hover:shadow-md select-none h-full justify-between">
                    <div>
                      {/* Compact Showroom Image Pedestal (Reduced Height - Zero Wasted Space) */}
                      <div className="relative w-full h-32 sm:h-40 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-b from-[#faf6ee] via-white to-[#faf8f5] flex items-center justify-center p-2 sm:p-2.5 border border-[#dfcca6]/30">
                        {/* VAT Badge */}
                        <span
                          className={`absolute top-2 left-2 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded shadow-2xs z-10 ${
                            isZeroVat
                              ? 'bg-[#8b6914] text-white'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          {isZeroVat ? '0% VAT' : '20% VAT'}
                        </span>

                        {/* Popular or Refiner Badge */}
                        {item.popular ? (
                          <span className="absolute top-2 right-2 bg-amber-100 text-amber-900 border border-amber-300 text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded z-10">
                            Popular
                          </span>
                        ) : (
                          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-[#dfcca6] text-slate-600 text-[8px] sm:text-[8.5px] font-medium px-1.5 py-0.5 rounded-full z-10 hidden sm:inline">
                            {item.badge ? item.badge.split(' ')[0] : 'LBMA'}
                          </span>
                        )}

                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={180}
                          height={180}
                          className="max-h-24 sm:max-h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                          unoptimized
                        />
                      </div>

                      {/* Details */}
                      <div className="mt-2 sm:mt-2.5">
                        {/* Refiner & Purity */}
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                          <span className="font-semibold text-stone-500 uppercase tracking-wider text-[9px] sm:text-[10px] truncate max-w-[110px] sm:max-w-[140px]">
                            {cleanRefiner}
                          </span>
                          <span className="text-[#8b6914] font-bold text-[10px] sm:text-[10.5px] flex-shrink-0">
                            {item.purity}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-[13px] sm:text-[15px] font-semibold text-stone-900 leading-snug group-hover:text-[#8b6914] transition-colors line-clamp-2 h-9 sm:h-10">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="mt-2 pt-1.5 border-t border-[#dfcca6]/30">
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-[17px] sm:text-[20px] font-bold text-stone-900 tracking-tight">
                          {formatGBP(item.calculatedPrice)}
                        </p>
                        <span className="text-[9.5px] sm:text-[10px] text-zinc-400 font-medium">
                          {isZeroVat ? 'VAT Free' : 'VAT Inc.'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <a
                          href={`https://wa.me/447472027202?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-center bg-[#1c1510] hover:bg-[#8b6914] text-white transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          Lock Price
                        </a>
                        <Link
                          href={`/contact?inquiry=${encodeURIComponent(
                            `Bullion Inquiry: ${item.name} (${item.purity}) estimated at ${formatGBP(
                              item.calculatedPrice
                            )}`
                          )}`}
                          className="py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-center bg-white hover:bg-[#faf5ea] text-stone-800 border border-[#dfcca6] hover:border-[#8b6914] transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          Inquire
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* ── UK Investment Gold Notice (Luxury Informational Bar) ── */}
        <div className="mt-12 bg-white border border-[#dfcca6] rounded-2xl p-5 sm:p-7 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">🏛️</span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">
              UK Investment Precious Metals Guarantee & Tax Status
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed">
            All investment gold bars and minted coins with a purity of 995+ (99.5%) are exempt from Value Added Tax (VAT) in the United Kingdom under HMRC Notice 701/21. Sovereign and Britannia coins are also exempt from Capital Gains Tax (CGT) for UK residents due to their status as British legal tender currency.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-6 text-xs font-bold text-[#8b6914] pt-1">
            <span>✓ 100% Guaranteed Purity & Weight</span>
            <span>✓ LBMA Accredited Refiners</span>
            <span>✓ Fully Insured Royal Mail Delivery</span>
            <span>✓ Private Bradford Showroom Collection</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export function BullionShopView(props: BullionShopViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center text-sm text-[#8c7e73]">
          Loading bullion collection...
        </div>
      }
    >
      <BullionShopContent {...props} />
    </Suspense>
  );
}
