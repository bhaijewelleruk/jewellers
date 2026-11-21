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
  const { cardBg, subtitleColor, accentGold, titleColor, inputBg } = themeStyles;
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
      <div className={`p-4 rounded-xl ${cardBg} border border-[#261c14] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-lg bg-[#1a130e] border border-[#3d2e22] flex items-center justify-center text-lg text-[#d8bb93]">
            📩
          </div>
          <div>
            <h2 className={`font-serif text-base sm:text-lg font-bold ${titleColor} flex items-center gap-2`}>
              Customer Inquiries &amp; Consultations
            </h2>
            <p className="text-xs text-[#a89584] font-medium">
              Real-time submissions from Storefront Contact &amp; Bullion forms ({enquiries.length} total)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className={`px-3 py-1.5 rounded-lg text-xs outline-none ${inputBg} w-full sm:w-48`}
          />

          <div className="flex items-center gap-1 bg-[#090604] border border-[#2b1f17] p-1 rounded-lg">
            {(['all', 'New', 'In Design', 'Completed'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md cursor-pointer transition-all ${
                  filterStatus === s
                    ? 'bg-[#d8bb93] text-[#0c0806] shadow-sm font-extrabold'
                    : 'text-[#a89584] hover:text-[#fbf8f5] hover:bg-[#1a130e]'
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
        <div className={`p-12 text-center rounded-xl ${cardBg} border border-[#261c14] shadow-xl`}>
          <div className="w-14 h-14 rounded-full bg-[#1a130e] border border-[#3d2e22] text-[#d8bb93] flex items-center justify-center mx-auto mb-3 text-2xl">
            💬
          </div>
          <h3 className={`font-serif text-base font-bold ${titleColor}`}>
            No inquiries matching your criteria
          </h3>
          <p className="text-xs text-[#a89584] mt-1 max-w-sm mx-auto">
            When customers submit a consultation or contact request on the website, it will immediately appear here with contact details.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className={`${cardBg} rounded-xl border border-[#261c14] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-[#8b6914]/60 shadow-xl`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b pb-2 border-[#241a13]">
                <span className={`font-mono text-xs font-extrabold ${accentGold}`}>{enq.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider ${
                    enq.status === 'Completed'
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800'
                      : enq.status === 'In Design'
                      ? 'bg-sky-950/70 text-sky-400 border border-sky-800'
                      : 'bg-amber-950/70 text-amber-400 border border-amber-800'
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
                <p className="text-xs font-semibold text-[#c2b2a3] truncate" title={enq.email}>
                  ✉️ {enq.email}
                </p>
                <p className="text-xs font-mono font-bold text-[#d8bb93]">
                  📞 {enq.phone || 'No phone'}
                </p>
              </div>

              {/* Subject & Message */}
              <div className="space-y-1.5 bg-[#090604] p-3 rounded-lg border border-[#241a13]">
                <p className="text-xs font-bold text-[#fbf8f5] truncate">
                  <span className="text-[#a89584] font-normal">Subject:</span> {enq.service || 'General Inquiry'}
                </p>
                <p
                  onClick={() => setSelectedEnquiry(enq)}
                  className="text-xs text-[#c2b2a3] line-clamp-3 leading-relaxed cursor-pointer hover:text-[#d8bb93]"
                  title="Click to view full message"
                >
                  &ldquo;{enq.message}&rdquo;
                </p>
              </div>

              {/* Date & Actions */}
              <div className="pt-2 border-t border-[#241a13] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#a89584]">
                  <span>📅 {enq.date}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(enq)}
                    className="text-[11px] font-bold text-[#d8bb93] hover:text-white underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                {/* Direct Reply Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold text-center transition-colors border border-emerald-600/40"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${enq.email}?subject=RE: ${encodeURIComponent(enq.service || 'Bhai Jeweller Inquiry')}`}
                    className="flex-1 py-1.5 bg-[#1f1711] hover:bg-[#2b1f17] text-[#d8bb93] hover:text-white rounded-lg text-[11px] font-bold text-center transition-colors border border-[#3d2e22]"
                  >
                    Email
                  </a>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  {enq.status !== 'In Design' && (
                    <button
                      type="button"
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'In Design')}
                      className="flex-1 py-1 bg-sky-950/50 hover:bg-sky-900/50 text-sky-300 border border-sky-800/60 rounded text-[9.5px] font-bold text-center cursor-pointer transition-colors"
                    >
                      In Design
                    </button>
                  )}
                  {enq.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'Completed')}
                      className="flex-1 py-1 bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/60 rounded text-[9.5px] font-bold text-center cursor-pointer transition-colors"
                    >
                      Completed
                    </button>
                  )}
                  {enq.status !== 'New' && (
                    <button
                      type="button"
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'New')}
                      className="flex-1 py-1 bg-[#1a130e] hover:bg-[#261c14] text-[#a89584] hover:text-white border border-[#2b1f17] rounded text-[9.5px] font-bold text-center cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg ${cardBg} border border-[#261c14] rounded-2xl p-6 shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b pb-3 border-[#241a13]">
              <div>
                <span className="text-xs font-mono font-bold text-[#d8bb93]">{selectedEnquiry.id}</span>
                <h3 className={`font-serif text-lg font-bold ${titleColor}`}>{selectedEnquiry.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-[#1a130e] border border-[#2b1f17] text-[#a89584] hover:text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#c2b2a3]">
              <p><strong className="text-[#fbf8f5]">Email:</strong> {selectedEnquiry.email}</p>
              <p><strong className="text-[#fbf8f5]">Phone:</strong> {selectedEnquiry.phone || 'N/A'}</p>
              <p><strong className="text-[#fbf8f5]">Inquiry Subject:</strong> {selectedEnquiry.service}</p>
              <p><strong className="text-[#fbf8f5]">Date Submitted:</strong> {selectedEnquiry.date}</p>
              <div className="p-3 bg-[#090604] rounded-lg border border-[#241a13]">
                <p className="font-bold text-[#d8bb93] mb-1">Customer Message:</p>
                <p className="text-sm text-[#fbf8f5] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#241a13]">
              <a
                href={`https://wa.me/${(selectedEnquiry.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
              >
                Open WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-gradient-to-r from-[#d8bb93] via-[#e5cfb3] to-[#c5a059] text-[#0c0806] rounded-lg text-xs font-bold cursor-pointer shadow-sm hover:brightness-110"
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