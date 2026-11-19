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
    isLight,
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-4">
      {/* REAL-TIME HERO SECTION EDITOR */}
      <div className={`${cardBg} rounded-[5px] p-4 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current border-opacity-15 pb-4">
          <div>
            <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
              <BoltIcon className="w-5 h-5 text-gray-900" />
              <span>Main Storefront Hero Section Editor</span>
            </h2>
            <p className={`text-xs ${subtitleColor}`}>
              Edit headline, subtext, button links, background campaign image, and featured card live on the main website homepage.
            </p>
          </div>
          {heroSaveMsg && (
            <span className="px-3 py-1.5 rounded-[5px] bg-emerald-600 text-white text-xs font-bold shadow flex items-center gap-1.5">
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
                <label className={`block font-semibold ${subtitleColor} mb-1`}>Brand Pre-Title Tag</label>
                <input
                  type="text"
                  value={heroForm.brandPretitle}
                  onChange={(e) => setHeroForm({ ...heroForm, brandPretitle: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  placeholder="e.g. BHAI JEWELLER"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>Headline Line 1</label>
                  <input
                    type="text"
                    value={heroForm.headlineLine1}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine1: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                    placeholder="e.g. Jewellery, made"
                  />
                </div>
                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>Headline Line 2 (Italic Gold)</label>
                  <input
                    type="text"
                    value={heroForm.headlineLine2}
                    onChange={(e) => setHeroForm({ ...heroForm, headlineLine2: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                    placeholder="e.g. unforgettable"
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold ${subtitleColor} mb-1`}>Headline Line 3 (Optional)</label>
                <input
                  type="text"
                  value={heroForm.headlineLine3}
                  onChange={(e) => setHeroForm({ ...heroForm, headlineLine3: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  placeholder="e.g. Royal Heritage"
                />
              </div>

              <div>
                <label className={`block font-semibold ${subtitleColor} mb-1`}>Hero Subtitle Text</label>
                <textarea
                  rows={2}
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  placeholder="Describe your hallmark craftsmanship..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>CTA Button Text</label>
                  <input
                    type="text"
                    value={heroForm.buttonText}
                    onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold ${subtitleColor} mb-1`}>CTA Button Link</label>
                  <input
                    type="text"
                    value={heroForm.buttonLink}
                    onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              {/* Background Image Upload / URL */}
              <div>
                <label className={`block font-semibold ${subtitleColor} mb-1`}>Hero Background Image (URL or Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroForm.backgroundImage}
                    onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                    className={`flex-1 px-3.5 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                    placeholder="/images/hero-ring.jpg"
                  />
                  <label className="px-3 py-2 rounded-[5px] border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer text-xs font-semibold">
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
              <div className="relative w-full h-80 rounded-[8px] overflow-hidden bg-black text-white p-6 flex flex-col justify-between shadow-xl">
                {heroForm.backgroundImage && (
                  <Image
                    src={heroForm.backgroundImage}
                    alt="Hero Preview"
                    fill
                    className="object-cover opacity-60"
                  />
                )}
                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#e2c59d] font-bold">
                    {heroForm.brandPretitle || 'BHAI JEWELLER'}
                  </span>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold mt-2 leading-tight">
                    {heroForm.headlineLine1} <span className="italic text-[#dec29b]">{heroForm.headlineLine2}</span>
                    {heroForm.headlineLine3 ? ` ${heroForm.headlineLine3}` : ''}
                  </h1>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">{heroForm.subtitle}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs inline-flex items-center gap-1">
                    <span>{heroForm.buttonText || 'Explore Collections'}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                <BoltIcon className="w-4 h-4" />
                <span>Save Real-Time Hero Section Live</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Additional Banners Top Header */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-5 rounded-[5px]`}>
        <div>
          <h2 className={`font-serif text-lg font-semibold ${accentGold}`}>Additional Homepage Banner Slides</h2>
          <p className={`text-xs ${subtitleColor}`}>
            Add, edit, toggle visibility, and reorder extra banner slides for the storefront slider.
          </p>
        </div>
        <button
          onClick={onOpenAddSlide}
          className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer`}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Add New Hero Slide</span>
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {slides.map((slide) => (
          <div key={slide.id} className={`${cardBg} rounded-[5px] overflow-hidden flex flex-col justify-between`}>
            <div>
              <div className="relative w-full h-36 bg-[#e8dfd1] dark:bg-[#1a120e] border-b border-[#e8dfd1] dark:border-[#2a201a]">
                <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-90" />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2.5 py-1 rounded-[5px] text-[10px] font-semibold uppercase tracking-wider ${
                      slide.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {slide.status}
                  </span>
                </div>
                <div
                  className={`absolute bottom-2 left-2 ${
                    isLight ? 'bg-white/95 text-gray-800 border-gray-200 font-semibold' : 'bg-slate-900/90 text-slate-200 border-slate-700'
                  } px-2 py-0.5 rounded-[5px] text-[10px] font-mono border`}
                >
                  Order #{slide.order}
                </div>
              </div>

              <div className="p-3 space-y-1.5">
                <h3 className={`font-serif font-bold ${titleColor} text-sm leading-snug`}>{slide.title}</h3>
                <p className={`text-xs ${subtitleColor} line-clamp-2`}>{slide.subtitle}</p>
              </div>
            </div>

            <div className={`p-2.5 border-t ${cardHeaderBorder} ${isLight ? 'bg-white' : 'bg-[#100b08]'} flex items-center justify-between gap-2`}>
              <button
                onClick={() => onToggleSlideStatus(slide.id)}
                className={`flex-1 py-1.5 rounded-[5px] text-xs font-semibold transition-colors border cursor-pointer ${
                  slide.status === 'Active'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                {slide.status === 'Active' ? 'Deactivate Slide' : 'Publish Live'}
              </button>
              <button
                onClick={() => onDeleteSlide(slide.id)}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-[5px] text-xs transition-colors border border-red-300 cursor-pointer"
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
