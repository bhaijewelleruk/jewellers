'use client';

import React from 'react';
import Link from 'next/link';
import { AdminTab, AdminThemeStyles } from './types';
import {
  CrownIcon,
  StoreIcon,
  ExternalLinkIcon,
  LockIcon,
  MoonIcon,
  SunIcon,
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
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
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
  themeStyles,
  theme,
  setTheme,
  activeTab,
  onSelectTab,
  navItems,
  sidebarOpen,
  setSidebarOpen,
  mobileDrawerOpen,
  setMobileDrawerOpen,
  onLogout,
}: AdminSidebarProps) {
  const {
    sidebarBg,
    sidebarHeaderBorder,
    sidebarFooterBg,
    accentGold,
    subtitleColor,
    badgeBg,
    isLight,
  } = themeStyles;

  return (
    <>
      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className={`relative w-4/5 max-w-xs ${sidebarBg} h-full flex flex-col z-10 shadow-2xl`}>
            <div className={`p-4 ${sidebarHeaderBorder} border-b flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[5px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
                  <CrownIcon className="w-4 h-4" />
                </div>
                <div>
                  <h1 className={`font-serif text-sm font-bold tracking-wider ${accentGold}`}>BHAI JEWELLER</h1>
                  <p className={`text-[10px] ${subtitleColor} tracking-widest uppercase`}>Bradford HQ Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className={`p-1.5 rounded-[5px] ${subtitleColor} hover:${accentGold} transition-colors cursor-pointer`}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id as AdminTab);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-[14px] font-semibold transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-gray-900 text-white font-extrabold shadow-xs'
                      : isLight
                      ? 'text-gray-900 hover:text-black hover:bg-gray-100'
                      : 'text-[#c2b4a3] hover:bg-[#1a120e] hover:text-[#faf7f2]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-[5px] border ${badgeBg}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className={`p-3 ${sidebarFooterBg} border-t flex flex-col gap-2`}>
              <Link
                href="/"
                target="_blank"
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 ${
                  isLight
                    ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
                    : 'bg-[#1e293b] text-slate-200 border border-slate-700 hover:bg-slate-700'
                } rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs`}
              >
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Storefront Main Site</span>
                <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LockIcon className="w-3.5 h-3.5" />
                <span>Lock &amp; Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col ${sidebarBg} border-r transition-all duration-300 relative z-30 h-full overflow-y-auto shrink-0 sticky top-0 ${
          sidebarOpen ? 'w-56' : 'w-16'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className={`p-3.5 ${sidebarHeaderBorder} border-b flex items-center justify-between`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[5px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
                <CrownIcon className="w-4 h-4" />
              </div>
              <div>
                <h1 className={`font-serif text-sm font-bold tracking-wider ${accentGold}`}>BHAI JEWELLER</h1>
                <p className={`text-[10px] ${subtitleColor} tracking-widest uppercase`}>Bradford HQ Terminal</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-[5px] bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <CrownIcon className="w-4 h-4" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-[5px] ${subtitleColor} hover:${accentGold} transition-colors cursor-pointer`}
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

        {/* THEME TOGGLE BUTTON */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-full flex items-center ${
              sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
            } py-1.5 px-2.5 rounded-[4px] text-[11px] font-semibold border transition-all cursor-pointer ${
              isLight
                ? 'bg-gray-50 text-[#17120e] border-gray-200 hover:bg-gray-100'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Admin Theme"
          >
            <div className="flex items-center space-x-2">
              {isLight ? <MoonIcon className="w-4 h-4 text-gray-700" /> : <SunIcon className="w-4 h-4 text-amber-500" />}
              {sidebarOpen && <span>{isLight ? 'Light Theme (Default)' : 'Dark Theme'}</span>}
            </div>
            {sidebarOpen && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-gray-900 text-white">
                Toggle
              </span>
            )}
          </button>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as AdminTab)}
              className={`w-full flex items-center ${
                sidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
              } py-2.5 rounded-[4px] text-[14px] font-semibold transition-all cursor-pointer ${
                activeTab === item.id
                  ? isLight
                    ? 'bg-gray-100 text-black border-l-3 border-black font-extrabold shadow-xs'
                    : 'bg-slate-800 text-white border-l-2 border-white shadow-md'
                  : isLight
                  ? 'text-gray-900 hover:text-black hover:bg-gray-100'
                  : 'text-[#c2b4a3] hover:bg-[#1a120e] hover:text-[#faf7f2]'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
              {sidebarOpen && item.count !== null && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-[5px] border ${badgeBg}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ADMIN PROFILE FOOTER */}
        <div className={`p-3 ${sidebarFooterBg} border-t flex flex-col space-y-3`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-[4px] bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  B
                </div>
                <div className="truncate flex-1">
                  <p className={`text-xs font-bold ${accentGold} truncate`}>Bradford Concierge</p>
                  <p className={`text-[10px] ${subtitleColor} truncate`}>admin@bhaijeweller.co.uk</p>
                </div>
              </div>
              <Link
                href="/"
                target="_blank"
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 ${
                  isLight
                    ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
                    : 'bg-[#1e293b] text-slate-200 border border-slate-700 hover:bg-slate-700'
                } rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs`}
              >
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Storefront Main Site</span>
                <ExternalLinkIcon className="w-3 h-3 ml-0.5" />
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LockIcon className="w-3.5 h-3.5" />
                <span>Lock &amp; Sign Out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="mx-auto p-2 bg-red-50 text-red-800 rounded-[5px] hover:bg-red-100 transition-colors cursor-pointer"
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
