'use client';

import React, { useState } from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles, OrderItem } from '../types';
import { PrinterIcon } from '../AdminIcons';

interface OrdersTabProps {
  themeStyles: AdminThemeStyles;
  orders: OrderItem[];
  onUpdateOrderStatus: (id: string, status: 'Processing' | 'Shipped' | 'Delivered') => void;
  onSelectInvoiceOrder: (order: OrderItem) => void;
}

export default function OrdersTab({
  themeStyles,
  orders,
  onUpdateOrderStatus,
  onSelectInvoiceOrder,
}: OrdersTabProps) {
  const { cardBg, cardHeaderBorder, accentGold } = themeStyles;
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-5">
      {/* Top Filter Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-xl border border-[#261c14] shadow-lg`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🛍️</span>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#fbf8f5]">
              Customer Store Orders
            </h2>
            <p className="text-xs text-[#a89584] font-medium">
              Real-time store purchases and bespoke showroom invoices ({orders.length} total)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setOrderStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderStatusFilter === st
                  ? 'bg-gradient-to-r from-[#d8bb93] to-[#c5a059] text-[#0e0a07] shadow-sm'
                  : 'bg-[#18120c] text-[#a89584] border border-[#2d2117] hover:text-[#fbf8f5]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className={`p-10 text-center rounded-xl ${cardBg} border border-[#261c14] shadow-lg`}>
          <div className="w-12 h-12 rounded-full bg-[#18120c] border border-[#332419] flex items-center justify-center mx-auto mb-3 text-xl">
            📦
          </div>
          <h3 className="font-serif text-base font-bold text-[#fbf8f5]">
            No orders found matching &ldquo;{orderStatusFilter}&rdquo;
          </h3>
          <p className="text-xs text-[#a89584] mt-1 max-w-sm mx-auto">
            When customers place orders via checkout, they will immediately appear here for processing and dispatch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`${cardBg} rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 border border-[#261c14] hover:border-[#d8bb93]/60 transition-all shadow-lg`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between border-b pb-2.5 border-[#261c14]">
                <span className={`font-mono text-xs font-bold ${accentGold}`}>{order.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : order.status === 'Shipped'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer & Details */}
              <div className="space-y-1 text-xs">
                <p className="font-serif text-[15px] font-bold text-[#fbf8f5] truncate" title={order.customer}>
                  {order.customer}
                </p>
                <p className="text-xs text-[#d8bb93] font-medium truncate" title={order.email}>
                  ✉️ {order.email}
                </p>
                <p className="text-xs text-[#c2b2a3] pt-1 truncate" title={order.items}>
                  <strong className="text-white">Items:</strong> {order.items}
                </p>
                {order.address && (
                  <p className="text-xs text-[#8a7667] truncate" title={order.address}>
                    <strong className="text-[#a89584]">Address:</strong> {order.address}
                  </p>
                )}
              </div>

              {/* Price & Date */}
              <div className="pt-2 border-t border-[#261c14] flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-[#8a7667] uppercase font-bold">{order.date}</p>
                  <p className="text-[10px] text-[#a89584]">Credit / Debit Card</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-serif text-[#d8bb93] font-extrabold">
                    &pound;{order.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                {order.status !== 'Processing' && (
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(order.id, 'Processing')}
                    className="flex-1 py-1.5 px-2 bg-[#18120c] hover:bg-[#241a12] text-[#d8bb93] border border-[#332419] rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer"
                  >
                    Mark Processing
                  </button>
                )}
                {order.status !== 'Shipped' && (
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                    className="flex-1 py-1.5 px-2 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer"
                  >
                    Mark Shipped
                  </button>
                )}
                {order.status !== 'Delivered' && (
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                    className="flex-1 py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>

              {/* PRINT LUXURY INVOICE BUTTON */}
              <button
                type="button"
                onClick={() => onSelectInvoiceOrder(order)}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 bg-[#18120c] hover:bg-[#241a12] text-[#fbf8f5] border border-[#332419] hover:border-[#d8bb93] transition-all shadow-xs cursor-pointer"
              >
                <PrinterIcon className="w-3.5 h-3.5 text-[#d8bb93]" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </ScrollReveal>
  );
}
