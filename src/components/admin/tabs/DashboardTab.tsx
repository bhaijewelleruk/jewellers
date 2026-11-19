'use client';

import React from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import {
  AdminThemeStyles,
  OrderItem,
  SlideItem,
  AdminTab,
} from '../types';
import {
  OrdersIcon,
  DiamondIcon,
  SparklesIcon,
  GoldRatesIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
  PrinterIcon,
  BoltIcon,
  PlusIcon,
  SlidesIcon,
} from '../AdminIcons';

interface DashboardTabProps {
  themeStyles: AdminThemeStyles;
  totalRevenue: number;
  totalProductsCount: number;
  pendingEnquiriesCount: number;
  gold24kRate: string;
  orders: OrderItem[];
  slides: SlideItem[];
  onSelectInvoiceOrder: (order: OrderItem) => void;
  onOpenAddProduct: () => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export default function DashboardTab({
  themeStyles,
  totalRevenue,
  totalProductsCount,
  pendingEnquiriesCount,
  gold24kRate,
  orders,
  slides,
  onSelectInvoiceOrder,
  onOpenAddProduct,
  onNavigateTab,
}: DashboardTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
    titleColor,
    cardHeaderBorder,
    tableRowHover,
    primaryBtn,
    isLight,
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-4">
      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`${cardBg} p-3.5 rounded-[5px]`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>
                Total Revenue
              </p>
              <p className={`text-xl sm:text-2xl font-serif ${accentGold} font-bold mt-1.5`}>
                &pound;{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-[4px] bg-gray-100 border border-gray-200 text-gray-900">
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>&uarr; +18.4% from last month</span>
          </div>
        </div>

        <div className={`${cardBg} p-3.5 rounded-[5px]`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>
                Live Catalog Items
              </p>
              <p className={`text-xl sm:text-2xl font-serif ${titleColor} font-bold mt-1.5`}>
                {totalProductsCount}
              </p>
            </div>
            <div className="p-2 rounded-[4px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-600">
              <DiamondIcon className="w-5 h-5" />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-xs ${subtitleColor}`}>
            <span>Synced in real-time with Storefront</span>
          </div>
        </div>

        <div className={`${cardBg} p-3.5 rounded-[5px]`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>
                Bespoke Requests
              </p>
              <p className={`text-xl sm:text-2xl font-serif ${accentGold} font-bold mt-1.5`}>
                {pendingEnquiriesCount}
              </p>
            </div>
            <div className="p-2 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-600">
              <SparklesIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>Requires artisan consultation</span>
          </div>
        </div>

        <div className={`${cardBg} p-3.5 rounded-[5px]`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs ${subtitleColor} uppercase tracking-wider font-semibold`}>
                Live 24K Gold Rate
              </p>
              <p className={`text-xl sm:text-2xl font-serif ${titleColor} font-bold mt-1.5`}>
                Rs. {gold24kRate}
              </p>
            </div>
            <div className="p-2 rounded-[4px] bg-gray-100 border border-gray-200 text-gray-900">
              <GoldRatesIcon className="w-5 h-5" />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-xs ${accentGold}`}>
            <span>PKR / Gram &bull; Auto-sync on</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Recent Orders List */}
        <div className={`lg:col-span-2 ${cardBg} rounded-[5px] p-3.5`}>
          <div className={`flex items-center justify-between mb-4 border-b ${cardHeaderBorder} pb-3`}>
            <h3 className={`font-serif text-lg ${accentGold} font-semibold flex items-center gap-2`}>
              <OrdersIcon className="w-4 h-4" />
              Recent Store Orders
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className={`text-xs ${accentGold} hover:underline flex items-center gap-1 cursor-pointer`}
            >
              <span>View All Orders</span>
              <ChevronRightIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${cardHeaderBorder} ${subtitleColor} uppercase tracking-wider`}>
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${tableRowHover}`}>
                {orders.slice(0, 4).map((o) => (
                  <tr key={o.id} className="transition-colors">
                    <td className={`py-3 font-mono font-medium ${accentGold}`}>{o.id}</td>
                    <td className={`py-3 font-medium ${titleColor}`}>{o.customer}</td>
                    <td className={`py-3 font-semibold ${accentGold}`}>&pound;{o.amount}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold uppercase ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : o.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectInvoiceOrder(o)}
                        className="px-2.5 py-1 rounded-[4px] border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-[10px] font-semibold transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <PrinterIcon className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Add & Banner Panel */}
        <div className={`${cardBg} rounded-[5px] p-5 flex flex-col justify-between`}>
          <div>
            <div className={`flex items-center justify-between mb-3 border-b ${cardHeaderBorder} pb-3`}>
              <h3 className={`font-serif text-lg ${accentGold} font-semibold flex items-center gap-2`}>
                <BoltIcon className="w-4 h-4" />
                Quick Inventory Action
              </h3>
            </div>
            <p className={`text-xs ${subtitleColor} mb-4`}>
              Create a new product with multiple images and auto-generated SEO metadata.
            </p>
            <button
              type="button"
              onClick={onOpenAddProduct}
              className={`w-full py-3 ${primaryBtn} rounded-[5px] text-xs font-bold uppercase tracking-wider shadow-xs transition-all mb-4 flex items-center justify-center gap-1.5 cursor-pointer`}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Open Add Product Studio</span>
            </button>
            <div className="space-y-3 pt-2">
              {slides.slice(0, 2).map((slide) => (
                <div
                  key={slide.id}
                  className={`p-3 ${
                    isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#1a120e] border-[#2c201a]'
                  } border rounded-[5px] flex items-center justify-between`}
                >
                  <div className="truncate pr-2">
                    <p className={`text-xs font-semibold ${titleColor} truncate`}>{slide.title}</p>
                    <p className={`text-[10px] ${subtitleColor} uppercase`}>{slide.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('slides')}
            className={`mt-4 w-full py-2 ${
              isLight
                ? 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                : 'bg-[#1e293b] text-slate-200 border-slate-700 hover:bg-slate-700'
            } border rounded-[5px] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer`}
          >
            <SlidesIcon className="w-3.5 h-3.5" />
            <span>Manage Slider Banners</span>
            <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
