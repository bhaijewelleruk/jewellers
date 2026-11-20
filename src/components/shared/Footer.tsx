'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ── Real Authentic Payment Badges ── */
function PaymentIcons() {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* Visa */}
      <div className="h-7 px-2.5 bg-white border border-[#e2d9cf] rounded-[5px] flex items-center justify-center shadow-xs hover:border-[#1434CB] transition-colors">
        <svg viewBox="0 0 48 16" className="h-3.5 w-auto" aria-label="Visa">
          <path fill="#1A1F71" d="M19.14 0.5l-3.08 14.54h-4.93l3.08-14.54h4.93zm17.9 9.47c-.03-3.87-5.36-4.09-5.32-5.82.02-.53.51-1.09 1.63-1.24.55-.07 2.08-.13 3.82.68l.68-3.18c-.93-.34-2.13-.67-3.62-.67-3.83 0-6.52 2.04-6.55 4.96-.04 2.16 1.93 3.37 3.4 4.09 1.52.74 2.03 1.22 2.02 1.88-.02 1.02-1.22 1.48-2.35 1.5-.99.02-3.1-.38-4.52-1.04l-.7 3.29c1.07.49 3.05.92 5.09.94 4.07 0 6.66-2.01 6.69-5.09zm10.74 5.07l-3.84-14.54h-4.22c-.96 0-1.78.56-2.13 1.42l-6.07 13.12h5.18l1.03-2.85h6.33l.6 2.85h4.12zm-5.83-6.06l2.58-7.1 1.49 7.1h-4.07zm-27.13-8.48l-4.85 14.54h-5.2l-2.4-11.45c-.15-.6-.28-.82-.76-1.08-.8-.43-2.12-.83-3.29-1.08l.08-.39h6.12c1.29 0 2.45.86 2.74 2.31l1.49 7.94 3.73-9.87h4.34z" />
        </svg>
      </div>

      {/* Mastercard */}
      <div className="h-7 px-2.5 bg-white border border-[#e2d9cf] rounded-[5px] flex items-center justify-center shadow-xs hover:border-[#EB001B] transition-colors">
        <svg viewBox="0 0 32 20" className="h-4 w-auto" aria-label="Mastercard">
          <circle cx="10" cy="10" r="10" fill="#EB001B" />
          <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.9" />
          <path d="M16 3.8A10 10 0 0 1 19.8 10 10 10 0 0 1 16 16.2 10 10 0 0 1 12.2 10 10 10 0 0 1 16 3.8z" fill="#FF5F00" />
        </svg>
      </div>

      {/* American Express */}
      <div className="h-7 px-2 bg-[#006FCF] rounded-[5px] flex items-center justify-center shadow-xs">
        <span className="text-white text-[9px] font-black tracking-wider leading-none">AMEX</span>
      </div>

      {/* PayPal */}
      <div className="h-7 px-2.5 bg-white border border-[#e2d9cf] rounded-[5px] flex items-center justify-center shadow-xs hover:border-[#003087] transition-colors">
        <span className="text-[#003087] text-[10px] font-black tracking-tight leading-none">
          Pay<span className="text-[#0079C1]">Pal</span>
        </span>
      </div>

      {/* Apple Pay */}
      <div className="h-7 px-2.5 bg-black rounded-[5px] flex items-center justify-center shadow-xs">
        <span className="text-white text-[9.5px] font-semibold tracking-tight flex items-center gap-1">
          <svg className="w-2.5 h-3 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6-9.13-10.7-19.38-14.08-30.73-3.39-11.36-5.08-22.1-5.08-32.23 0-14.68 3.8-26.79 11.41-36.32 7.61-9.54 17.18-14.42 28.71-14.65 4.58 0 9.8 1.2 15.66 3.6 5.86 2.4 9.47 3.65 10.83 3.75 2.17-.33 6.09-1.74 11.75-4.24 5.66-2.5 10.55-3.64 14.68-3.44 13.48.65 24.3 5.49 32.46 14.51-11.74 7.07-17.5 16.74-17.29 29.03.22 9.79 4.13 17.94 11.74 24.46 4.13 3.59 8.81 6.2 14.03 7.83-2.17 6.42-4.78 12.72-7.83 18.91zM119.22 31.84c0-7.39 2.66-14.35 7.99-20.88 5.33-6.52 11.96-10.65 19.89-12.39.22 1.3.33 2.5.33 3.59 0 7.39-2.83 14.57-8.48 21.53-5.65 6.96-12.28 10.98-19.89 12.07-.11-1.3-.17-2.61-.17-3.92z" />
          </svg>
          Pay
        </span>
      </div>

      {/* Google Pay */}
      <div className="h-7 px-2.5 bg-white border border-[#e2d9cf] rounded-[5px] flex items-center justify-center shadow-xs hover:border-[#4285F4] transition-colors">
        <span className="text-[10px] font-semibold flex items-center">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC04]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
          <span className="text-[#5F6368] ml-1">Pay</span>
        </span>
      </div>
    </div>
  );
}

/* ── Real Authentic Social Brand Badges ── */
function SocialLinks() {
  return (
    <div className="flex items-center gap-2.5 mt-3 sm:mt-4">
      {/* Instagram */}
      <Link
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-gradient-to-tr hover:from-[#feda75] hover:via-[#d62976] hover:to-[#4f5bd5] text-[#1c1510] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-110"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </Link>

      {/* Facebook */}
      <Link
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#1877F2] text-[#1c1510] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-110"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </Link>

      {/* Pinterest */}
      <Link
        href="https://pinterest.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pinterest"
        className="w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#E60023] text-[#1c1510] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-110"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      </Link>

      {/* YouTube */}
      <Link
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        className="w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#FF0000] text-[#1c1510] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-110"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </Link>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const bullionLinks = [
    { name: 'Live Spot Rates', href: '/rates' },
    { name: 'Investment Gold Bars', href: '/gold-bars' },
    { name: 'Silver Bullion', href: '/silver' },
    { name: 'Zakat Calculator', href: '/zakat' },
    { name: 'Sell Your Scrap Gold', href: '/sell-your-gold' },
  ];

  const customerCare = [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Showroom Support', href: '/contact' },
  ];

  return (
    <footer className="w-full bg-white text-[#1c1510] border-t border-[#e8ded4] overflow-hidden select-none pb-4 md:pb-0">

      {/* ── Mobile Compact View (< md) ── */}
      <div className="md:hidden px-5 py-6">

        {/* Brand & Socials */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-[#eee5dc]">
          <Link href="/" className="mb-2">
            <span className="text-base tracking-[0.24em] text-[#1c1510] font-semibold uppercase leading-tight">
              BHAI JEWELLER
            </span>
          </Link>
          <p className="text-xs text-[#5e4d40] font-light max-w-xs leading-relaxed">
            Timeless jewellery crafted for extraordinary moments.
          </p>
          <SocialLinks />
        </div>

        {/* Mobile Newsletter (No Box Container, Large Input) */}
        <div className="py-5 border-b border-[#eee5dc]">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#9e7d56] font-semibold mb-1">
            Join the society
          </p>
          <h3 className="text-lg text-[#1c1510] font-medium leading-snug mb-3">
            Receive exclusive previews & private invites
          </h3>

          <form onSubmit={handleSubmit} className="w-full">
            {submitted ? (
              <p className="text-xs text-[#2e7d32] font-medium py-2">
                ✓ Thank you for subscribing to Bhai Jeweller!
              </p>
            ) : (
              <div className="flex items-stretch rounded-full border border-[#d6cbbe] bg-[#faf7f2] focus-within:border-[#1c1510] focus-within:bg-white shadow-xs transition-all overflow-hidden p-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm text-[#1c1510] placeholder-[#8a796b] outline-none font-light min-w-0"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-[#1c1510] hover:bg-[#9e7d56] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* 3-Column Links on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5 border-b border-[#eee5dc] text-left">
          <div>
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-[#9e7d56] font-semibold mb-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-[#4d3d31] hover:text-[#9e7d56] font-normal transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-[#9e7d56] font-semibold mb-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bullion & Rates
            </h4>
            <ul className="space-y-2">
              {bullionLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-[#4d3d31] hover:text-[#9e7d56] font-normal transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0">
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-[#9e7d56] font-semibold mb-2.5">
              Customer Care
            </h4>
            <ul className="space-y-2">
              {customerCare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-[#4d3d31] hover:text-[#9e7d56] font-normal transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Bottom: Copyright & Payment Badges */}
        <div className="pt-4 flex flex-col items-center gap-3 text-center">
          <p className="text-[11px] text-[#7a6859] font-light">
            © {new Date().getFullYear()} Bhai Jeweller. All rights reserved.
          </p>
          <PaymentIcons />
        </div>

      </div>

      {/* ── Desktop Multi-column Luxury View (>= md) ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 lg:px-12 py-14">

        {/* Top Row: Brand Info (Left) + Large Seamless Newsletter (Right, No Box) */}
        <div className="grid grid-cols-12 gap-10 pb-12 border-b border-[#eee5dc] items-center">

          {/* Left: Brand & Story */}
          <div className="col-span-5 flex flex-col items-start text-left">
            <Link href="/" className="mb-3">
              <span className="text-base lg:text-lg tracking-[0.25em] text-[#1c1510] font-semibold uppercase leading-tight hover:text-[#9e7d56] transition-colors">
                BHAI JEWELLER
              </span>
            </Link>
            <p className="text-xs lg:text-[13px] text-[#5e4d40] font-light leading-relaxed max-w-sm mb-2">
              Fine jewellery crafted for extraordinary moments. Showroom located in Bradford, West Yorkshire.
            </p>
            <SocialLinks />
          </div>

          {/* Right: Seamless Newsletter (Box Background Removed, Enlarged Typography & Input) */}
          <div className="col-span-7 flex flex-col justify-center">
            <div className="max-w-lg ml-auto w-full">
              <p className="text-xs tracking-[0.28em] uppercase text-[#9e7d56] font-semibold mb-1.5">
                Join the society
              </p>
              <h3 className="text-2xl lg:text-[28px] text-[#1c1510] font-normal leading-snug mb-3.5">
                Receive exclusive previews & private invites
              </h3>

              <form onSubmit={handleSubmit} className="w-full">
                {submitted ? (
                  <p className="text-sm text-[#2e7d32] font-medium py-2">
                    ✓ Thank you for subscribing to Bhai Jeweller!
                  </p>
                ) : (
                  <div className="flex items-stretch rounded-full border border-[#d6cbbe] bg-[#faf7f2] focus-within:border-[#1c1510] focus-within:bg-white shadow-xs transition-all overflow-hidden p-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="flex-1 bg-transparent px-5 py-3.5 text-sm sm:text-base text-[#1c1510] placeholder-[#8a796b] outline-none font-light min-w-0"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="flex-shrink-0 w-11 h-11 rounded-full bg-[#1c1510] hover:bg-[#9e7d56] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* Middle Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 border-b border-[#eee5dc]">
          {/* Col 1: Collections */}
          <div>
            <h4 className="text-xs tracking-[0.22em] uppercase text-[#1c1510] font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs lg:text-[13px] text-[#4d3d31] hover:text-[#9e7d56] font-normal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Bullion & Rates */}
          <div>
            <h4 className="text-xs tracking-[0.22em] uppercase text-[#1c1510] font-semibold mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bullion & Rates
            </h4>
            <ul className="space-y-2.5">
              {bullionLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs lg:text-[13px] text-[#4d3d31] hover:text-[#9e7d56] font-normal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-xs tracking-[0.22em] uppercase text-[#1c1510] font-semibold mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              {customerCare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs lg:text-[13px] text-[#4d3d31] hover:text-[#9e7d56] font-normal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Showroom */}
          <div>
            <h4 className="text-xs tracking-[0.22em] uppercase text-[#1c1510] font-semibold mb-4">
              Bradford Showroom
            </h4>
            <div className="text-xs lg:text-[13px] text-[#4d3d31] space-y-3 font-normal">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#faf7f2] border border-[#e2d9cf] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span>Bradford, West Yorkshire, UK</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#faf7f2] border border-[#e2d9cf] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Mon – Sat: 10:00 – 18:00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#faf7f2] border border-[#e2d9cf] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <span>Private viewings on request</span>
              </div>
            </div>
          </div>

          {/* Col 4: Assurance */}
          <div>
            <h4 className="text-xs tracking-[0.22em] uppercase text-[#1c1510] font-semibold mb-4">
              Assurance
            </h4>
            <div className="text-xs lg:text-[13px] text-[#4d3d31] space-y-3 font-normal">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#faf7f2] border border-[#e2d9cf] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M7 3l5 18 5-18" />
                  </svg>
                </span>
                <span>100% Certified Diamonds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#faf7f2] border border-[#e2d9cf] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <span>Insured Worldwide Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#faf7f2] border border-[#e2d9cf] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </span>
                <span>Lifetime Authenticity Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright + Real Payment Icons */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7a6859] font-light">
            © {new Date().getFullYear()} Bhai Jeweller. All rights reserved.
          </p>
          <PaymentIcons />
        </div>

      </div>

    </footer>
  );
}
