'use client';

import React from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles } from '../types';
import {
  StoreIcon,
  CheckIcon,
  SparklesIcon,
  SettingsIcon,
} from '../AdminIcons';

export interface AnnouncementFormState {
  isEnabled: boolean;
  message1: string;
  message2: string;
  message3: string;
}

interface SettingsTabProps {
  themeStyles: AdminThemeStyles;
  announcementForm: AnnouncementFormState;
  setAnnouncementForm: React.Dispatch<React.SetStateAction<AnnouncementFormState>>;
  announcementSaveMsg: boolean;
  onAnnouncementSubmit: (e: React.FormEvent) => void;
  shippingThreshold: string;
  setShippingThreshold: (val: string) => void;
}

export default function SettingsTab({
  themeStyles,
  announcementForm,
  setAnnouncementForm,
  announcementSaveMsg,
  onAnnouncementSubmit,
  shippingThreshold,
  setShippingThreshold,
}: SettingsTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
    titleColor,
    inputBg,
    primaryBtn,
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      {/* ANNOUNCEMENT BAR MANAGER */}
      <div className={`${cardBg} rounded-[5px] p-6 max-w-3xl mx-auto space-y-6`}>
        <div className="flex items-center justify-between border-b border-current border-opacity-15 pb-3">
          <div>
            <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
              <StoreIcon className="w-5 h-5 text-gray-900" />
              <span>Real-Time Top Announcement Bar Manager</span>
            </h2>
            <p className={`text-xs ${subtitleColor}`}>Edit promotional top-bar text slides &amp; toggle visibility on main site live.</p>
          </div>
          {announcementSaveMsg && (
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-[5px] shadow flex items-center gap-1">
              <CheckIcon className="w-3.5 h-3.5" />
              <span>Announcement Live!</span>
            </span>
          )}
        </div>

        <form onSubmit={onAnnouncementSubmit} className="space-y-4 text-xs">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-[5px] border border-current border-opacity-20">
            <div>
              <span className={`font-bold ${titleColor}`}>Enable Announcement Top Bar</span>
              <p className={`text-[10px] ${subtitleColor}`}>Shows rotating notification bar at top of desktop site.</p>
            </div>
            <button
              type="button"
              onClick={() => setAnnouncementForm((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                announcementForm.isEnabled ? 'bg-emerald-600 text-white shadow' : 'bg-gray-400 text-gray-900'
              }`}
            >
              {announcementForm.isEnabled ? 'ON (Visible)' : 'OFF (Hidden)'}
            </button>
          </div>

          <div>
            <label className={`block font-semibold ${subtitleColor} mb-1`}>Announcement Message 1</label>
            <input
              type="text"
              value={announcementForm.message1}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, message1: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
              placeholder="Free worldwide shipping on all orders over £150..."
            />
          </div>

          <div>
            <label className={`block font-semibold ${subtitleColor} mb-1`}>Announcement Message 2</label>
            <input
              type="text"
              value={announcementForm.message2}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, message2: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
              placeholder="Complimentary luxury gift packaging on every order..."
            />
          </div>

          <div>
            <label className={`block font-semibold ${subtitleColor} mb-1`}>Announcement Message 3</label>
            <input
              type="text"
              value={announcementForm.message3}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, message3: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
              placeholder="Fine jewellery showroom in Bradford, West Yorkshire..."
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Save &amp; Push Announcement Bar Live</span>
          </button>
        </form>
      </div>

      {/* STORE CONFIGURATION */}
      <div className={`${cardBg} rounded-[5px] p-6 max-w-3xl mx-auto space-y-6`}>
        <h2 className={`font-serif text-xl font-bold ${accentGold} flex items-center gap-2`}>
          <SettingsIcon className="w-5 h-5 text-gray-900" />
          <span>Storewide Configuration</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className={`block uppercase tracking-wider ${subtitleColor} mb-1 font-semibold`}>
              Free Shipping Threshold (&pound;)
            </label>
            <input
              type="text"
              value={shippingThreshold}
              onChange={(e) => setShippingThreshold(e.target.value)}
              className={`w-full text-sm px-4 py-2.5 rounded-[5px] focus:outline-none ${inputBg}`}
            />
          </div>

          <button
            type="button"
            onClick={() => alert('Store settings updated successfully!')}
            className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all shadow-md cursor-pointer`}
          >
            Update Store Configuration
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
