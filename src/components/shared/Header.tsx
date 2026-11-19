'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useShop, ProductItem } from '@/context/ShopContext';

interface HeaderProps {
  brandName?: string;
  brandSubline?: string;
  solidBg?: boolean;
  isRelative?: boolean;
}

const QUICK_TAGS = [
  '21ct Gold',
  'Diamond Rings',
  'Necklaces',
  'Chandelier Earrings',
  'Gold Bangles',
  'Bridal',
  'Solitaire',
  '18k Gold',
];

export function Header({
  brandName = 'BHAI JEWELLER',
  brandSubline = 'BRADFORD',
  solidBg = false,
  isRelative = false,
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartCount, wishlistCount, products } = useShop();
  const router = useRouter();
  const pathname = usePathname();

  // Track window scroll to make floating header sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle ESC key press to close search mode or drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Real-time live search filter
  const liveResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p: ProductItem) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const metalMatch = p.metal?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const skuMatch = p.sku?.toLowerCase().includes(q);
      const kwMatch = Array.isArray(p.focusKeywords) && p.focusKeywords.some((k) => k.toLowerCase().includes(q));
      return nameMatch || catMatch || metalMatch || descMatch || skuMatch || kwMatch;
    });
  }, [searchQuery, products]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setDrawerOpen(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/shop?search=${encodeURIComponent(tag)}`);
    setIsSearchOpen(false);
    setDrawerOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories', hasDropdown: true },
    { name: 'Shop All', href: '/shop' },
    { name: 'Rings', href: '/shop?category=Rings' },
    { name: 'Necklaces', href: '/shop?category=Necklaces' },
    { name: 'Earrings', href: '/shop?category=Earrings' },
  ];

  const isHomeActive = pathname === '/';

  return (
    <>
      <header
        className={`${
          isRelative
            ? 'relative w-full z-40'
            : `relative w-full z-40 bg-transparent ${
                solidBg ? '' : '-mb-16 md:mb-0'
              } md:fixed md:left-0 md:max-w-full md:pointer-events-none md:transition-all md:duration-300 md:ease-out ${
                isScrolled
                  ? 'md:top-2 md:sm:top-3.5'
                  : 'md:top-[33px] md:sm:top-[35px] md:top-[37px]'
              }`
        } ${
          drawerOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : ''
        }`}
      >
        {/* ── SEARCH OPEN MODE (Full Header Glass Search Bar + Live Dropdown) ── */}
        {isSearchOpen ? (
          <div className="w-full bg-[#140e0b]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3 px-4 sm:px-8 pointer-events-auto">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 animate-fadeIn">
              {/* Logo (Desktop only when search is open) */}
              <Link href="/" onClick={() => setIsSearchOpen(false)} className="hidden md:flex items-center flex-shrink-0 group">
                <span className="text-sm tracking-[0.24em] text-[#f5efe8] font-semibold uppercase group-hover:text-[#dec29b] transition-colors whitespace-nowrap">
                  {brandName}
                </span>
              </Link>

              {/* Expanded Search Bar Form */}
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl relative flex items-center mx-1 sm:mx-4">
                <div className="relative w-full flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d8bb93] absolute left-3.5 stroke-[1.8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rings, necklaces, bracelets, 21ct gold, SKU..."
                    className="w-full bg-[#1c1511] text-[#f5efe8] text-xs sm:text-sm placeholder-[#8a796b] border border-[#3d2e24] focus:border-[#d8bb93] rounded-full pl-10 sm:pl-11 pr-10 py-2 sm:py-2.5 outline-none transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 text-[#9a897b] hover:text-[#f5efe8] text-xs font-semibold p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                aria-label="Close search"
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full border border-white/15 text-[#d8bb93] hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-light cursor-pointer"
              >
                <span>Close</span>
                <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* ── NORMAL HEADER: Transparent & In-Flow on Mobile; Floating Glass Capsule on Desktop ── */
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 md:pt-2.5 md:sm:pt-3 pointer-events-auto">
            <div
              className={`w-full transition-all duration-300 flex items-center justify-between gap-2 sm:gap-4 py-3 md:py-2 ${
                solidBg
                  ? 'bg-[#140e0b] md:bg-[#140e0b]/90 md:rounded-full md:backdrop-blur-2xl md:border md:border-white/15 md:shadow-[0_12px_45px_rgba(0,0,0,0.75)] md:px-6'
                  : isScrolled
                  ? 'bg-transparent md:bg-[#140e0b]/90 md:rounded-full md:backdrop-blur-2xl md:border md:border-white/15 md:shadow-[0_12px_45px_rgba(0,0,0,0.75)] md:px-6'
                  : 'bg-transparent md:bg-[#160f0b]/70 md:rounded-full md:backdrop-blur-xl md:border md:border-white/10 md:shadow-[0_10px_35px_rgba(0,0,0,0.6)] md:px-6'
              }`}
            >
              {/* Left: Mobile Menu Toggle Button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open navigation menu"
                  className="text-[#f5efe8] hover:text-[#dec29b] p-1.5 -ml-1 transition-colors"
                >
                  <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                  </svg>
                </button>
              </div>

              {/* Left Brand Name */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center group">
                  <span className="text-xs sm:text-sm tracking-[0.24em] text-[#fbf8f5] font-semibold uppercase group-hover:text-[#dec29b] transition-colors whitespace-nowrap">
                    {brandName}
                  </span>
                </Link>

                {/* Thin Vertical Divider (Desktop) */}
                <span className="h-4 w-[1px] bg-white/15 mx-3 sm:mx-4 hidden lg:block" aria-hidden="true" />
              </div>

              {/* Center Navigation Links (Editorial Pill Luxury) */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                {navLinks.map((link) => {
                  const isCurrent = link.name === 'Home' ? isHomeActive : pathname === link.href;

                  if (link.name === 'Home') {
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-300 ${
                          isHomeActive
                            ? 'bg-[#f3dfc8] text-[#1c140e] shadow-sm font-semibold'
                            : 'text-[#ded5cb] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-normal transition-all duration-200 inline-flex items-center gap-1 ${
                        isCurrent
                          ? 'text-[#f3dfc8] font-medium'
                          : 'text-[#ded5cb] hover:text-[#f3dfc8] hover:bg-white/5'
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.hasDropdown && (
                        <svg className="w-2.5 h-2.5 opacity-60 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right Utility Icons (Search, Wishlist, Account, Cart) */}
              <div className="flex items-center gap-2 sm:gap-3 text-[#ded5cb]">
                {/* Search Icon */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search jewellery"
                  className="hover:text-[#f3dfc8] transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                >
                  <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>

                {/* Wishlist Icon */}
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="relative hover:text-[#f3dfc8] transition-colors p-1.5 rounded-full hover:bg-white/5"
                >
                  <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute 0 top-0.5 right-0.5 w-3.5 h-3.5 bg-[#dec29b] text-[#1c1510] font-bold text-[8.5px] rounded-full flex items-center justify-center shadow-xs">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Account Icon */}
                <Link
                  href="/account"
                  aria-label="User Account"
                  className="hover:text-[#f3dfc8] transition-colors p-1.5 rounded-full hover:bg-white/5"
                >
                  <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>

                {/* Shopping Bag / Cart Icon with pill counter */}
                <Link
                  href="/cart"
                  aria-label="Shopping bag"
                  className="relative hover:text-[#f3dfc8] transition-colors p-1.5 rounded-full hover:bg-white/5 flex items-center"
                >
                  <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="absolute 0 top-0.5 right-0.5 w-3.5 h-3.5 bg-[#dec29b] text-[#1c1510] font-bold text-[8.5px] rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE SEARCH RESULTS OVERLAY ── */}
        {isSearchOpen && (
          <div className="w-full bg-[#16100d] border-b border-[#2e231b] shadow-2xl animate-fadeIn text-[#f5efe8]">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5">
              {/* Trending Quick Search Tags */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide text-xs">
                <span className="text-[11px] text-[#9e8d7d] uppercase tracking-wider font-medium mr-1 whitespace-nowrap">
                  Trending:
                </span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 rounded-full bg-[#241a14] hover:bg-[#dec29b] text-[#d4c5b5] hover:text-[#140e0b] border border-[#3b2c21] hover:border-[#dec29b] transition-all text-xs font-light whitespace-nowrap active:scale-95 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Live Search Results View */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#261d16]">
                  <div className="flex items-center justify-between mb-3.5">
                    <p className="text-xs text-[#a09080] font-light">
                      Found <strong className="text-[#f5efe8] font-semibold">{liveResults.length}</strong> {liveResults.length === 1 ? 'item' : 'items'} matching &ldquo;<span className="text-[#dec29b]">{searchQuery}</span>&rdquo;
                    </p>
                    {liveResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="text-xs text-[#dec29b] hover:underline font-light cursor-pointer"
                      >
                        View all in Shop →
                      </button>
                    )}
                  </div>

                  {liveResults.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="font-serif text-lg text-[#dec29b]">No products found</p>
                      <p className="text-xs text-[#9a897b] font-light mt-1">
                        Try searching for &quot;Gold&quot;, &quot;Ring&quot;, &quot;21ct&quot;, or &quot;Necklace&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {liveResults.map((p) => {
                        const imgSrc = p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg';
                        const slug = p.slug || p.id;
                        return (
                          <Link
                            key={p.id}
                            href={`/shop/${slug}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="group flex flex-col bg-[#1f1712] border border-[#31231a] hover:border-[#dec29b] rounded-[6px] overflow-hidden p-2 transition-all"
                          >
                            <div className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-[#2a2018]">
                              <Image
                                src={imgSrc}
                                alt={p.name}
                                fill
                                sizes="140px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <h4 className="font-serif text-xs text-[#f5efe8] group-hover:text-[#dec29b] transition-colors mt-2 font-medium line-clamp-1">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-[#9e8e80] font-light truncate">
                              {p.metal || p.category}
                            </p>
                            <p className="text-xs font-bold text-[#dec29b] mt-1">
                              £{Number(p.price).toFixed(2)}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay when search is open */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-30 animate-fadeIn"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Side Navigation Drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 z-[100]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed top-0 left-0 bottom-0 w-[86%] max-w-[340px] bg-white text-[#1c1510] border-r border-[#e8ded4] shadow-2xl flex flex-col z-[101] animate-slideRight">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#f0e6dc] flex items-center justify-between bg-white">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center">
                <span className="text-sm tracking-[0.22em] text-[#1c1510] font-semibold uppercase leading-tight">
                  {brandName}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="w-8.5 h-8.5 rounded-full bg-[#faf7f2] border border-[#e8ded4] flex items-center justify-center text-[#1c1510] hover:bg-[#1c1510] hover:text-white transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input inside Drawer */}
            <div className="px-5 pt-4 pb-2 bg-white">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full text-left flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#faf7f2] border border-[#e8ded4] hover:border-[#9e7d56] active:scale-[0.98] transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#9e7d56] stroke-[1.8] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="text-xs text-[#8c7a6b] font-light truncate">
                  Search rings, necklaces, 21ct gold...
                </span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#f5eee6] bg-white">
              <nav className="flex flex-col pb-4 space-y-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 px-2 rounded-lg text-[#2c221a] hover:text-[#9e7d56] hover:bg-[#faf7f2] text-sm font-medium tracking-wide transition-all"
                  >
                    <span>{link.name}</span>
                    <svg className="w-3.5 h-3.5 stroke-[1.8] text-[#a8988a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </nav>

              {/* Collections Quick Cards */}
              <div className="pt-4 pb-2">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#9e7d56] font-semibold mb-3">
                  FEATURED CATEGORIES
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Rings', href: '/shop?category=Rings' },
                    { name: 'Necklaces', href: '/shop?category=Necklaces' },
                    { name: 'Earrings', href: '/shop?category=Earrings' },
                    { name: 'Bracelets', href: '/shop?category=Bracelets' },
                  ].map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setDrawerOpen(false)}
                      className="p-2.5 rounded-[5px] bg-[#faf7f2] border border-[#ede5db] text-center text-xs font-medium text-[#1c1510] hover:border-[#9e7d56] hover:bg-[#9e7d56]/10 transition-all shadow-2xs"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Customer Service info */}
              <div className="pt-4 space-y-2.5 text-xs text-[#5c4d40] font-light">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0e6d8] flex items-center justify-center text-[#9e7d56] flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <span>Bradford, West Yorkshire, UK</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0e6d8] flex items-center justify-center text-[#9e7d56] flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <span>+44 (0) 1274 000 000</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#f0e6dc] bg-[#faf7f2] flex items-center justify-between text-xs text-[#706052]">
              <span>© {new Date().getFullYear()} Bhai Jeweller</span>
              <div className="flex items-center gap-3 font-medium">
                <Link href="/about" onClick={() => setDrawerOpen(false)} className="hover:text-[#9e7d56]">About</Link>
                <Link href="/contact" onClick={() => setDrawerOpen(false)} className="hover:text-[#9e7d56]">Support</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
