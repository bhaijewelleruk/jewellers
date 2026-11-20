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
  const { cardBg, subtitleColor, isLight, accentGold, titleColor } = themeStyles;
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
        <span className={`text-[13.5px] font-medium text-gray-800 dark:text-gray-200`}>Filter Status:</span>
        <div className="flex items-center space-x-2">
          {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setOrderStatusFilter(st)}
              className={`px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all cursor-pointer ${
                orderStatusFilter === st
                  ? isLight
                    ? 'bg-gray-900 text-white font-bold'
                    : 'bg-gray-900 text-white font-bold'
                  : isLight
                  ? 'bg-gray-100 text-[#5c4d40] border border-gray-200'
                  : 'bg-[#1a120e] text-[#c2b4a3] border border-[#3a2c23]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className={`${cardBg} rounded-[5px] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-gray-400`}
          >
            {/* Order Box Header */}
            <div className="flex items-center justify-between border-b pb-2.5 border-opacity-30 border-current">
              <span className={`font-mono text-xs font-bold ${accentGold}`}>{order.id}</span>
              <span
                className={`px-2 py-0.5 rounded-[5px] text-[9px] font-semibold uppercase ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : order.status === 'Shipped'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Customer & Details */}
            <div className="space-y-1 text-xs">
              <p className={`font-semibold ${titleColor} truncate`} title={order.customer}>
                {order.customer}
              </p>
              <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 truncate`} title={order.email}>
                {order.email}
              </p>
              <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 pt-1 truncate`} title={order.items}>
                <span className="font-semibold text-opacity-80">Item:</span> {order.items}
              </p>
              <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 truncate`} title={order.address}>
                <span className="font-semibold text-opacity-80">Address:</span> {order.address}
              </p>
            </div>

            {/* Price & Date */}
            <div className="pt-2 border-t border-opacity-20 border-current flex items-end justify-between">
              <div>
                <p className={`text-[9px] ${subtitleColor} uppercase`}>{order.date}</p>
                <p className={`text-[9px] ${subtitleColor}`}>Credit / Debit Card</p>
              </div>
              <div className="text-right">
                <p className={`text-base font-serif ${accentGold} font-bold`}>
                  &pound;{order.amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap gap-1">
              {order.status !== 'Processing' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'Processing')}
                  className={`flex-1 py-1 px-1.5 border rounded-[5px] text-[9px] font-semibold text-center transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-gray-100 text-gray-700 border-gray-200'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  Processing
                </button>
              )}
              {order.status !== 'Shipped' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                  className="flex-1 py-1 px-1.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-800 rounded-[5px] text-[9px] font-semibold text-center transition-colors cursor-pointer"
                >
                  Shipped
                </button>
              )}
              {order.status !== 'Delivered' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                  className="flex-1 py-1 px-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[9px] font-semibold text-center transition-colors cursor-pointer"
                >
                  Delivered
                </button>
              )}
            </div>

            {/* PRINT LUXURY INVOICE BUTTON */}
            <button
              type="button"
              onClick={() => onSelectInvoiceOrder(order)}
              className={`w-full py-1.5 px-2 rounded-[5px] text-[10px] font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  : 'bg-[#1f1612] text-gray-900 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              <span>Print Invoice / Receipt</span>
            </button>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
