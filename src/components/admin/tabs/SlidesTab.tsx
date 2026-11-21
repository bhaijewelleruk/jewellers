'use client';

import React from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles, SlideItem } from '../types';
import {
  BoltIcon,
  CheckIcon,
  PlusIcon,
  ChevronRightIcon,
} from '../AdminIcons';

export type AdminSlide = SlideItem;

export interface HeroFormState {
  brandPretitle: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredImage: string;
}

interface SlidesTabProps {
  themeStyles: AdminThemeStyles;
  heroForm: HeroFormState;
  setHeroForm: React.Dispatch<React.SetStateAction<HeroFormState>>;
  heroSaveMsg: boolean;
  onHeroSubmit: (e: React.FormEvent) => void;
  slides: AdminSlide[];
  onOpenAddSlide: () => void;
  onToggleSlideStatus: (id: string) => void;
  onDeleteSlide: (id: string) => void;
  onHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'featuredImage') => void;
}

export default function SlidesTab({
  themeStyles,
  heroForm,
  setHeroForm,
  heroSaveMsg,
  onHeroSubmit,
  slides,
  onOpenAddSlide,
  onToggleSlideStatus,
  onDeleteSlide,
  onHeroImageUpload,
}: SlidesTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
    titleColor,
    inputBg,
    primaryBtn,
    cardHeaderBorder,
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      {/* REAL-TIME HERO SECTION EDITOR */}
      <div className={`${cardBg} rounded-xl border border-[#261c14] p-6 shadow-xl space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#241a13] pb-4">
          <div>
            <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
              <BoltIcon className="w-5 h-5 text-[#d8bb93]" />
              <span>Main Storefront Hero Section Editor</span>
            </h2>
            <p className="text-xs text-[#a89584] font-medium mt-1">
              Edit headline, subtext, button links, background campaign image, and featured card live on the homepage.
            </p>
          </div>
          {heroSaveMsg && (
            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold shadow flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5" />
              <span>Hero Section Saved &amp; Live!</span>
            </span>
          )}
        </div>

        <form onSubmit={onHeroSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Inputs */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">Brand Pre-Title Tag</label>
                <input
                  type="text"
                  value={heroForm.brandPretitle}
                  onChange={(e) => setHeroForm({ ...heroForm, brandPretitle: e.target.value })}
                  className={`w-full text-[14.5px] px-4 py-2.5 rounded-lg font-bold text-[#fbf8f5] focus:outline-none ${inputBg}`}
                  placeholder="e.g. BHAI JEWELLER"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">Headline Line 1</label>
                  <input
                    type="text"
                    value={heroForm.headlineLine1}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine1: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 rounded-lg font-bold text-[#fbf8f5] focus:outline-none ${inputBg}`}
                    placeholder="e.g. Jewellery, made"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">Headline Line 2 (Italic Gold)</label>
                  <input
                    type="text"
                    value={heroForm.headlineLine2}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine2: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 rounded-lg font-bold text-[#fbf8f5] focus:outline-none ${inputBg}`}
                    placeholder="e.g. unforgettable"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">Headline Line 3 (Optional)</label>
                <input
                  type="text"
                  value={heroForm.headlineLine3}
                  onChange={(e) => setHeroForm({ ...heroForm, headlineLine3: e.target.value })}
                  className={`w-full text-[14.5px] px-4 py-2.5 rounded-lg font-bold text-[#fbf8f5] focus:outline-none ${inputBg}`}
                  placeholder="e.g. Royal Heritage"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">Hero Subtitle Text</label>
                <textarea
                  rows={2}
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className={`w-full text-[14px] px-4 py-2.5 rounded-lg font-medium text-[#fbf8f5] focus:outline-none ${inputBg}`}
                  placeholder="Describe your hallmark craftsmanship..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroForm.buttonText}
                    onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 rounded-lg font-bold text-[#fbf8f5] focus:outline-none ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">CTA Button Link</label>
                  <input
                    type="text"
                    value={heroForm.buttonLink}
                    onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 rounded-lg font-bold text-[#fbf8f5] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              {/* Background Image Upload / URL */}
              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">Hero Background Image (URL or Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroForm.backgroundImage}
                    onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                    className={`flex-1 text-[14.5px] px-4 py-2.5 rounded-lg font-medium text-[#fbf8f5] focus:outline-none ${inputBg}`}
                    placeholder="/images/hero-ring.jpg"
                  />
                  <label className="px-4 py-2.5 rounded-lg border border-[#2b1f17] bg-[#140e0a] hover:bg-[#1f1711] text-[#d8bb93] hover:text-white cursor-pointer text-xs font-bold flex items-center transition-colors">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onHeroImageUpload(e, 'backgroundImage')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Live Hero Preview Card */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className={`font-serif text-sm font-bold ${titleColor}`}>Live Hero Preview</h3>
              <div className="relative w-full h-80 rounded-xl overflow-hidden bg-black text-white p-6 flex flex-col justify-between shadow-2xl border border-[#261c14]">
                {heroForm.backgroundImage && (
                  <Image
                    src={heroForm.backgroundImage}
                    alt="Hero Preview"
                    fill
                    className="object-cover opacity-60"
                  />
                )}
                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#d8bb93] font-bold">
                    {heroForm.brandPretitle || 'BHAI JEWELLER'}
                  </span>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold mt-2 leading-tight text-white">
                    {heroForm.headlineLine1} <span className="italic text-[#d8bb93]">{heroForm.headlineLine2}</span>
                    {heroForm.headlineLine3 ? ` ${heroForm.headlineLine3}` : ''}
                  </h1>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">{heroForm.subtitle}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d8bb93] to-[#c5a059] text-[#0c0806] font-bold text-xs inline-flex items-center gap-1 shadow-md">
                    <span>{heroForm.buttonText || 'Explore Collections'}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                <BoltIcon className="w-4 h-4" />
                <span>Save Real-Time Hero Section Live</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Additional Banners Top Header */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-5 rounded-xl border border-[#261c14] shadow-xl`}>
        <div>
          <h2 className={`font-serif text-lg font-bold ${accentGold}`}>Additional Homepage Banner Slides</h2>
          <p className="text-xs text-[#a89584] font-medium mt-0.5">
            Add, edit, toggle visibility, and reorder extra banner slides for the storefront slider.
          </p>
        </div>
        <button
          onClick={onOpenAddSlide}
          className={`px-4 py-2 ${primaryBtn} font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer`}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Add New Hero Slide</span>
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className={`${cardBg} rounded-xl border border-[#261c14] overflow-hidden flex flex-col justify-between shadow-xl`}>
            <div>
              <div className="relative w-full h-36 bg-[#090604] border-b border-[#241a13]">
                <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-90" />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      slide.status === 'Active'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {slide.status}
                  </span>
                </div>
                <div
                  className="absolute bottom-2 left-2 bg-[#0c0806]/90 text-[#d8bb93] border border-[#2b1f17] px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                >
                  Order #{slide.order}
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <h3 className="font-serif font-bold text-[#fbf8f5] text-sm leading-snug">{slide.title}</h3>
                <p className="text-xs text-[#a89584] line-clamp-2">{slide.subtitle}</p>
              </div>
            </div>

            <div className={`p-3 border-t border-[#241a13] bg-[#0c0806] flex items-center justify-between gap-2`}>
              <button
                onClick={() => onToggleSlideStatus(slide.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                  slide.status === 'Active'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-800/60 hover:bg-amber-900/60'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                }`}
              >
                {slide.status === 'Active' ? 'Deactivate Slide' : 'Publish Live'}
              </button>
              <button
                onClick={() => onDeleteSlide(slide.id)}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-bold transition-colors border border-rose-800/60 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}