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
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-5">
      {/* KPI METRICS CARDS (Obsidian & Haute Joaillerie Gold Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-[#120d09] border border-[#261c14] hover:border-[#d8bb93]/60 p-4 rounded-xl shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] uppercase tracking-widest font-bold text-[#d8bb93]">
                Total Revenue
              </p>
              <p className="text-3xl font-extrabold font-serif text-[#fbf8f5] mt-1.5 tracking-tight">
                &pound;{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[#a89584] font-medium">
            <span>Verified store orders &bull; 0% fee capture</span>
          </div>
        </div>

        {/* Card 2: Catalog Products */}
        <div className="bg-[#120d09] border border-[#261c14] hover:border-[#d8bb93]/60 p-4 rounded-xl shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] uppercase tracking-widest font-bold text-[#d8bb93]">
                Catalog Products
              </p>
              <p className="text-3xl font-extrabold font-serif text-[#fbf8f5] mt-1.5 tracking-tight">
                {totalProductsCount}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-sky-950/60 border border-sky-800/50 flex items-center justify-center text-sky-400">
              <DiamondIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[#a89584] font-medium">
            <span>Live products &amp; bullion catalog</span>
          </div>
        </div>

        {/* Card 3: Bespoke Inquiries */}
        <div className="bg-[#120d09] border border-[#261c14] hover:border-[#d8bb93]/60 p-4 rounded-xl shadow-lg transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] uppercase tracking-widest font-bold text-[#d8bb93]">
                Bespoke Inquiries
              </p>
              <p className="text-3xl font-extrabold font-serif text-[#fbf8f5] mt-1.5 tracking-tight">
                {pendingEnquiriesCount}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <SparklesIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-400 font-semibold">
            <span>Customer consultation requests</span>
          </div>
        </div>

        {/* Card 4: Gold 24K Spot */}
        <div
          onClick={() => onNavigateTab('bullion')}
          className="bg-[#120d09] border border-[#261c14] hover:border-[#d8bb93] p-4 rounded-xl shadow-lg cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11.5px] uppercase tracking-widest font-bold text-[#d8bb93]">
                Live 24K Gold Spot
              </p>
              <p className="text-3xl font-extrabold font-mono text-[#d8bb93] mt-1.5">
                £{gold24kRate}/g
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#201711] border border-[#3e2e22] flex items-center justify-center text-[#d8bb93] group-hover:scale-110 transition-transform">
              <GoldRatesIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[#d8bb93] font-bold">
            <span>LBMA Bullion Desk &amp; Catalog →</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders List */}
        <div className={`lg:col-span-2 ${cardBg} rounded-xl p-4 sm:p-5 shadow-lg`}>
          <div className={`flex items-center justify-between mb-4 border-b ${cardHeaderBorder} pb-3`}>
            <h3 className="font-serif text-lg text-[#fbf8f5] font-bold flex items-center gap-2">
              <OrdersIcon className="w-4 h-4 text-[#d8bb93]" />
              <span>Recent Store Orders</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#d8bb93] hover:text-white hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>View All Orders</span>
              <ChevronRightIcon className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#261c14] text-[#d8bb93] font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1711]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#8a7667]">
                      No orders placed yet. Live orders will populate automatically.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-[#18110b]">
                      <td className="py-3 font-mono font-bold text-[#d8bb93]">{o.id}</td>
                      <td className="py-3 font-semibold text-[#fbf8f5]">{o.customer}</td>
                      <td className="py-3 font-bold text-[#fbf8f5]">&pound;{o.amount}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : o.status === 'Shipped'
                              ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectInvoiceOrder(o)}
                          className="px-3 py-1 rounded-lg border border-[#332419] bg-[#16100b] hover:bg-[#221811] text-[#d8bb93] hover:text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <PrinterIcon className="w-3 h-3" />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Add & Banner Panel */}
        <div className={`${cardBg} rounded-xl p-5 flex flex-col justify-between shadow-lg`}>
          <div>
            <div className={`flex items-center justify-between mb-3 border-b ${cardHeaderBorder} pb-3`}>
              <h3 className="font-serif text-lg text-[#fbf8f5] font-bold flex items-center gap-2">
                <BoltIcon className="w-4 h-4 text-[#d8bb93]" />
                <span>Quick Inventory Action</span>
              </h3>
            </div>
            <p className="text-xs text-[#a89584] mb-4 leading-relaxed font-medium">
              Create a new luxury item with multiple photo angles and automated SEO meta generation.
            </p>
            <button
              type="button"
              onClick={onOpenAddProduct}
              className={`w-full py-3 ${primaryBtn} rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all mb-4 flex items-center justify-center gap-2 cursor-pointer`}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Open Add Product Studio</span>
            </button>

            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] uppercase tracking-wider font-bold text-[#d8bb93]">Featured Banners</p>
              {slides.slice(0, 2).map((slide) => (
                <div
                  key={slide.id}
                  className="p-3 bg-[#0d0906] border border-[#261c14] rounded-lg flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-[#fbf8f5] truncate">{slide.title}</p>
                    <p className="text-[10px] text-[#8a7667] uppercase font-semibold">{slide.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('slides')}
            className="mt-4 w-full py-2.5 bg-[#16100b] hover:bg-[#201811] text-[#d8bb93] hover:text-white border border-[#332419] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
