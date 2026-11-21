'use client';

import React, { useState } from 'react';
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
  const { cardBg, subtitleColor, isLight, accentGold, titleColor, inputBg } = themeStyles;
  const [filterStatus, setFilterStatus] = useState<'all' | 'New' | 'In Design' | 'Completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesFilter = filterStatus === 'all' || e.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.phone && e.phone.includes(q)) ||
      (e.service && e.service.toLowerCase().includes(q)) ||
      (e.message && e.message.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-5">
      {/* Top Filter and Search Bar */}
      <div className={`p-4 rounded-lg ${cardBg} border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs`}>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-lg">📩</span>
          <div>
            <h2 className={`font-serif text-base sm:text-lg font-bold ${titleColor}`}>
              Customer Inquiries &amp; Consultations
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              Real-time submissions from the Storefront Contact &amp; Bullion forms ({enquiries.length} total)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className={`px-3 py-1.5 rounded text-xs outline-none ${inputBg} w-full sm:w-48`}
          />

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded">
            {(['all', 'New', 'In Design', 'Completed'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-all ${
                  filterStatus === s
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries Grid or Clean Empty State */}
      {filteredEnquiries.length === 0 ? (
        <div className={`p-10 text-center rounded-xl ${cardBg} border border-gray-200 dark:border-slate-800 shadow-xs`}>
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl">
            💬
          </div>
          <h3 className={`font-serif text-base font-bold ${titleColor}`}>
            No inquiries matching your criteria
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            When customers submit a consultation or contact request on the website, it will immediately appear here with contact details.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className={`${cardBg} rounded-xl border border-gray-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-3 transition-all hover:border-black dark:hover:border-white shadow-xs`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-slate-800">
                <span className={`font-mono text-xs font-extrabold ${accentGold}`}>{enq.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                    enq.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : enq.status === 'In Design'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {enq.status || 'New'}
                </span>
              </div>

              {/* Client Details */}
              <div className="space-y-1">
                <p className={`font-serif text-[15px] font-bold ${titleColor} truncate`} title={enq.name}>
                  {enq.name}
                </p>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate" title={enq.email}>
                  ✉️ {enq.email}
                </p>
                <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                  📞 {enq.phone || 'No phone'}
                </p>
              </div>

              {/* Subject & Message */}
              <div className="space-y-1.5 bg-gray-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-bold text-black dark:text-white truncate">
                  <span className="text-gray-500 font-normal">Subject:</span> {enq.service || 'General Inquiry'}
                </p>
                <p
                  onClick={() => setSelectedEnquiry(enq)}
                  className="text-xs text-gray-800 dark:text-gray-200 line-clamp-3 leading-relaxed cursor-pointer hover:underline"
                  title="Click to view full message"
                >
                  &ldquo;{enq.message}&rdquo;
                </p>
              </div>

              {/* Date & Actions */}
              <div className="pt-2 border-t border-gray-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>📅 {enq.date}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(enq)}
                    className="text-[10px] font-bold text-black dark:text-white underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                {/* Direct Reply Actions */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold text-center transition-colors shadow-2xs"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${enq.email}?subject=RE: ${encodeURIComponent(enq.service || 'Bhai Jeweller Inquiry')}`}
                    className="flex-1 py-1.5 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded text-[11px] font-bold text-center transition-colors shadow-2xs"
                  >
                    Email
                  </a>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1 pt-1">
                  {enq.status !== 'In Design' && (
                    <button
                      type="button"
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'In Design')}
                      className="flex-1 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded text-[9.5px] font-bold text-center cursor-pointer transition-colors"
                    >
                      In Design
                    </button>
                  )}
                  {enq.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'Completed')}
                      className="flex-1 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded text-[9.5px] font-bold text-center cursor-pointer transition-colors"
                    >
                      Completed
                    </button>
                  )}
                  {enq.status !== 'New' && (
                    <button
                      type="button"
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'New')}
                      className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded text-[9.5px] font-bold text-center cursor-pointer transition-colors"
                    >
                      Reset New
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className={`w-full max-w-lg ${cardBg} border border-gray-300 dark:border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700">{selectedEnquiry.id}</span>
                <h3 className={`font-serif text-lg font-bold ${titleColor}`}>{selectedEnquiry.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Email:</strong> {selectedEnquiry.email}</p>
              <p><strong>Phone:</strong> {selectedEnquiry.phone || 'N/A'}</p>
              <p><strong>Inquiry Subject:</strong> {selectedEnquiry.service}</p>
              <p><strong>Date Submitted:</strong> {selectedEnquiry.date}</p>
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <p className="font-bold text-gray-600 dark:text-gray-400 mb-1">Message:</p>
                <p className="text-sm text-black dark:text-white leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-800">
              <a
                href={`https://wa.me/${(selectedEnquiry.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                Open WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ScrollReveal>
  );
}
