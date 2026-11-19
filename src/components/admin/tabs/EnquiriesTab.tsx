'use client';

import React from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles } from '../types';

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  date: string;
}

interface EnquiriesTabProps {
  themeStyles: AdminThemeStyles;
  enquiries: AdminEnquiry[];
  onUpdateEnquiryStatus: (id: string, status: string) => void;
}

export default function EnquiriesTab({
  themeStyles,
  enquiries,
  onUpdateEnquiryStatus,
}: EnquiriesTabProps) {
  const { cardBg, subtitleColor, isLight, accentGold, titleColor } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {enquiries.map((enq) => (
          <div
            key={enq.id}
            className={`${cardBg} rounded-[5px] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-gray-400`}
          >
            {/* Enquiry Header */}
            <div className="flex items-center justify-between border-b pb-2 border-opacity-30 border-current">
              <span className={`font-mono text-xs font-bold ${accentGold}`}>{enq.id}</span>
              <span
                className={`px-2 py-0.5 rounded-[5px] text-[9px] font-semibold uppercase ${
                  enq.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : enq.status === 'In Design'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {enq.status}
              </span>
            </div>

            {/* Client Info */}
            <div className="space-y-1 text-xs">
              <p className={`font-semibold ${titleColor} truncate`} title={enq.name}>
                {enq.name}
              </p>
              <p className={`text-[10px] ${subtitleColor} truncate`} title={enq.email}>
                {enq.email}
              </p>
              <p className={`text-[10px] font-mono ${accentGold}`}>{enq.phone}</p>
            </div>

            {/* Service & Budget */}
            <div className="space-y-1 text-[10px]">
              <p className={`${subtitleColor} truncate`} title={enq.service}>
                <span className="font-semibold text-opacity-80">Service:</span> {enq.service}
              </p>
              <p className={`${accentGold} font-semibold`}>Budget: {enq.budget}</p>
              <p className={`italic ${subtitleColor} line-clamp-2 text-[9px]`} title={enq.message}>
                &ldquo;{enq.message}&rdquo;
              </p>
            </div>

            {/* Date & Contact Actions */}
            <div className="pt-2 border-t border-opacity-20 border-current space-y-2">
              <div className="flex items-center justify-between text-[9px] text-opacity-75">
                <span className={subtitleColor}>{enq.date}</span>
              </div>

              <div className="flex items-center space-x-1">
                <a
                  href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[9px] font-semibold text-center transition-colors truncate"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${enq.email}`}
                  className={`flex-1 py-1 border rounded-[5px] text-[9px] font-semibold text-center transition-colors truncate ${
                    isLight
                      ? 'bg-gray-100 text-gray-700 border-gray-200'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  Email
                </a>
              </div>

              {/* Status Update Buttons */}
              <div className="flex items-center space-x-1 pt-1">
                {enq.status !== 'In Design' && (
                  <button
                    onClick={() => onUpdateEnquiryStatus(enq.id, 'In Design')}
                    className="flex-1 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-800 rounded-[5px] text-[8px] font-semibold text-center transition-colors cursor-pointer"
                  >
                    In Design
                  </button>
                )}
                {enq.status !== 'Completed' && (
                  <button
                    onClick={() => onUpdateEnquiryStatus(enq.id, 'Completed')}
                    className="flex-1 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-[5px] text-[8px] font-semibold text-center transition-colors cursor-pointer"
                  >
                    Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
