'use client';

import React from 'react';
import Link from 'next/link';
import { AdminTab, AdminThemeStyles } from './types';
import {
  CrownIcon,
  StoreIcon,
  ExternalLinkIcon,
  LockIcon,
  XIcon,
} from './AdminIcons';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number | null;
}

interface AdminSidebarProps {
  themeStyles: AdminThemeStyles;
  theme?: 'light' | 'dark';
  setTheme?: (t: 'light' | 'dark') => void;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  navItems: NavItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  navItems,
  sidebarOpen,
  setSidebarOpen,
  mobileDrawerOpen,
  setMobileDrawerOpen,
  onLogout,
}: AdminSidebarProps) {
  return (
    <>
      {/* MOBILE DRAWER (Full Luxury Dark Aesthetic) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative w-4/5 max-w-xs bg-[#0b0806] border-r border-[#261c14] h-full flex flex-col z-10 shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#261c14] flex items-center justify-between bg-[#0e0a07]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d8bb93] to-[#8b6914] text-[#0e0a07] flex items-center justify-center shadow-md">
                  <CrownIcon className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="font-serif text-sm font-bold tracking-wider text-[#fbf8f5]">BHAI JEWELLER</h1>
                  <p className="text-[9.5px] text-[#d8bb93] tracking-widest uppercase font-semibold">Bradford HQ Terminal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#a89584] hover:text-[#fbf8f5] transition-colors cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Live Status Pill */}
            <div className="px-4 py-2.5 bg-[#120d09] border-b border-[#261c14] flex items-center gap-2 text-[10.5px] text-[#d8bb93] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id as AdminTab);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-[14px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d8bb93]/25 via-[#8b6914]/20 to-transparent text-white border-l-3 border-[#d8bb93] font-bold shadow-sm'
                        : 'text-[#a89584] hover:text-white hover:bg-[#16100b]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg ${isActive ? 'text-[#d8bb93]' : 'text-[#8a7667]'}`}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1c1510] text-[#d8bb93] border border-[#3d2e22]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 bg-[#0a0705] border-t border-[#261c14] flex flex-col gap-2">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#16100b] hover:bg-[#201811] text-[#d8bb93] border border-[#332419] rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Storefront Main Site</span>
                <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/80 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LockIcon className="w-3.5 h-3.5" />
                <span>Lock &amp; Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Permanent Obsidian Black & Burnished Gold) */}
      <aside
        className={`hidden md:flex flex-col bg-[#0b0806] border-r border-[#261c14] transition-all duration-300 relative z-30 h-full overflow-y-auto shrink-0 sticky top-0 ${
          sidebarOpen ? 'w-60' : 'w-20'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-4 border-b border-[#261c14] flex items-center justify-between bg-[#0e0a07]">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d8bb93] via-[#c5a059] to-[#8b6914] text-[#0e0a07] flex items-center justify-center shadow-lg font-bold">
                <CrownIcon className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h1 className="font-serif text-sm font-bold tracking-wider text-[#fbf8f5] truncate">BHAI JEWELLER</h1>
                <p className="text-[9.5px] text-[#d8bb93] tracking-widest uppercase font-semibold">Bradford HQ Terminal</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-br from-[#d8bb93] via-[#c5a059] to-[#8b6914] text-[#0e0a07] flex items-center justify-center shadow-lg">
              <CrownIcon className="w-5 h-5" />
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-[#a89584] hover:text-[#d8bb93] hover:bg-[#16100b] transition-colors cursor-pointer"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'}
              />
            </svg>
          </button>
        </div>

        {/* SYSTEM STATUS BADGE */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-[#140e0a] border border-[#261c14] flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#d8bb93] font-bold uppercase tracking-wider">Atelier Online</span>
            </div>
            <span className="font-mono text-[#8a7667] text-[10px]">80% Scale</span>
          </div>
        )}

        {/* NAVIGATION ITEMS */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id as AdminTab)}
                className={`w-full flex items-center ${
                  sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
                } py-2.5 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d8bb93]/20 via-[#8b6914]/15 to-transparent text-white border-l-4 border-[#d8bb93] font-bold shadow-xs'
                    : 'text-[#a89584] hover:text-[#fbf8f5] hover:bg-[#16100b]'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-lg ${isActive ? 'text-[#d8bb93]' : 'text-[#7e6b5d]'}`}>{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
                {sidebarOpen && item.count !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#d8bb93] text-[#0b0806]'
                      : 'bg-[#18120c] text-[#d8bb93] border border-[#332419]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* PROFILE & LOGOUT FOOTER */}
        <div className="p-3 bg-[#080504] border-t border-[#261c14] flex flex-col space-y-2.5">
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d8bb93] to-[#8b6914] text-[#0e0a07] flex items-center justify-center font-bold text-xs shadow-md">
                  B
                </div>
                <div className="truncate flex-1">
                  <p className="text-xs font-bold text-[#fbf8f5] truncate">Bradford Concierge</p>
                  <p className="text-[10px] text-[#a89584] truncate">admin@bhaijeweller.co.uk</p>
                </div>
              </div>

              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#16100b] hover:bg-[#201811] text-[#d8bb93] border border-[#332419] rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Storefront Main Site</span>
                <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-900/60 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LockIcon className="w-3.5 h-3.5" />
                <span>Lock &amp; Sign Out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="mx-auto p-2 rounded-lg text-rose-400 hover:bg-rose-950/40 cursor-pointer"
              title="Lock & Sign Out"
            >
              <LockIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
