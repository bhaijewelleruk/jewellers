'use client';

import React from 'react';
import { OrderItem } from './types';
import { PrinterIcon, XIcon, ShieldCheckIcon } from './AdminIcons';

interface InvoiceModalProps {
  order: OrderItem | null;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-[6px] shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* MODAL ACTION BAR (Hidden in Print) */}
        <div className="no-print bg-gray-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PrinterIcon className="w-5 h-5 text-gray-300" />
            <span className="font-serif text-sm font-semibold tracking-wide">
              Official Assay &amp; Sales Invoice: #{order.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-[4px] bg-white text-gray-900 font-semibold text-xs hover:bg-gray-100 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PrinterIcon className="w-4 h-4" />
              <span>Print Invoice / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE LUXURY INVOICE BODY */}
        <div id="printable-luxury-invoice" className="p-8 sm:p-12 text-[#1c1510] bg-white space-y-6">
          {/* HEADER: STORE INFORMATION & INVOICE NUMBER */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-[#1c1510] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center bg-gray-50">
                  <span className="font-serif text-xl font-bold italic text-gray-900">B</span>
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-[0.15em] text-gray-900 uppercase">
                  BHAI JEWELLER
                </h2>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-700 mt-0.5">
                BRADFORD ATELIER &bull; FINE JEWELLERY &amp; BULLION
              </p>
              <p className="text-[10.5px] text-[#6b5c50] mt-1.5 leading-relaxed">
                120 Manningham Lane, Bradford, West Yorkshire, BD8 7JF, United Kingdom<br />
                Tel: +44 (0)1274 722888 &bull; Email: concierge@bhaijeweller.co.uk &bull; Web: www.bhaijeweller.co.uk
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[9.5px] font-mono text-[#8a796c]">
                <span>UK VAT Reg: <strong>GB 384 9201 44</strong></span>
                <span>&bull;</span>
                <span>Assay Office Reg: <strong>UK-BFD-882</strong></span>
              </div>
            </div>

            <div className="sm:text-right bg-gray-50 p-4 rounded-[4px] border border-gray-200/60 sm:min-w-[210px]">
              <span className="font-serif text-base font-bold text-gray-900 uppercase tracking-wider block">
                TAX INVOICE
              </span>
              <p className="font-mono text-xs font-bold text-[#1c1510] mt-1">
                INV-{order.id}
              </p>
              <div className="mt-2 space-y-0.5 text-[10.5px] text-[#6b5c50]">
                <p>Date: <span className="font-medium text-[#1c1510]">{order.date}</span></p>
                <p>Status: <span className="font-bold text-emerald-700 uppercase">{order.status}</span></p>
                <p>Payment: <span className="font-medium text-[#1c1510]">Credit / Debit Card</span></p>
              </div>
            </div>
          </div>

          {/* CLIENT BILLING & DELIVERY INFORMATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
            <div className="bg-[#faf8f5] p-3.5 rounded-[4px] border border-[#eee4d7]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Billed &amp; Delivered To:
              </p>
              <p className="font-serif text-sm font-semibold text-[#1c1510]">{order.customer}</p>
              <p className="text-xs text-[#5c4d40] font-mono mt-0.5">{order.email}</p>
              <p className="text-xs text-[#6b5c50] mt-1.5 leading-relaxed">
                <strong>Shipping Address:</strong><br />
                {order.address || 'Showroom Collection, 120 Manningham Lane, Bradford, BD8 7JF'}
              </p>
            </div>

            <div className="bg-[#faf8f5] p-3.5 rounded-[4px] border border-[#eee4d7]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Dispatch &amp; Delivery Method:
              </p>
              <p className="text-xs font-medium text-[#1c1510]">Royal Mail Special Delivery Guaranteed (Insured)</p>
              <p className="text-[11px] text-[#6b5c50] mt-1 leading-relaxed">
                Tamper-evident luxury packaging with full postal transit insurance coverage up to &pound;10,000.
              </p>
              <p className="text-[10px] font-mono text-emerald-800 mt-2 font-semibold">
                &bull; Insured Delivery: Included (&pound;0.00)
              </p>
            </div>
          </div>

          {/* PURCHASED ITEMS TABLE */}
          <div className="overflow-hidden border border-gray-200 rounded-[4px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5efe7] text-[#1c1510] uppercase font-bold tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3">Item Description &amp; Specifications</th>
                  <th className="p-3">Hallmark Certification</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee4d7]">
                <tr>
                  <td className="p-3">
                    <p className="font-serif font-semibold text-sm text-[#1c1510]">{order.items}</p>
                    <p className="text-[10px] text-[#8a796c] mt-0.5">Order Ref: #{order.id}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-[3px] bg-gray-900 text-white/30 text-gray-700 text-[10px] font-semibold">
                      22K (916) UK Assay Hallmark
                    </span>
                  </td>
                  <td className="p-3 text-center font-semibold">1</td>
                  <td className="p-3 text-right font-medium">&pound;{order.amount.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-[#1c1510]">&pound;{order.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FINANCIAL BREAKDOWN */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            {/* Assay Seal Box */}
            <div className="sm:max-w-xs p-3.5 rounded-[4px] bg-gray-50 border border-gray-200/60 flex items-start gap-3">
              <ShieldCheckIcon className="w-7 h-7 text-gray-900 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#1c1510]">UK Hallmarking Act 1973 Guarantee</h4>
                <p className="text-[10px] text-[#6b5c50] mt-1 leading-snug">
                  Every piece of fine gold sold by Bhai Jeweller Bradford is independently tested and stamped with authentic British Assay Office hallmarks.
                </p>
              </div>
            </div>

            {/* Subtotals & Grand Total */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#6b5c50]">
                <span>Net Amount (Excl. VAT):</span>
                <span className="font-medium text-[#1c1510] font-mono">
                  &pound;{(order.amount / 1.2).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#6b5c50]">
                <span>UK VAT (20% Included):</span>
                <span className="font-medium text-[#1c1510] font-mono">
                  &pound;{(order.amount - order.amount / 1.2).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#6b5c50]">
                <span>Insured Delivery:</span>
                <span className="font-semibold text-emerald-700">FREE (&pound;0.00)</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t-2 border-[#1c1510] text-sm">
                <span className="font-bold text-[#1c1510] uppercase">Total Paid (GBP):</span>
                <span className="font-serif text-lg font-bold text-gray-900">
                  &pound;{order.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* INVOICE FOOTER WITH TERMS & SIGNATURE */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-[#7a695d]">
            <div className="space-y-1">
              <p><strong>Thank you for choosing Bhai Jeweller Bradford.</strong></p>
              <p>Includes 1-year complimentary cleaning, polishing, and stone-setting inspection.</p>
              <p>Showroom viewings &amp; bespoke consultations available by appointment.</p>
            </div>
            <div className="text-left sm:text-right pt-2 sm:pt-0">
              <p className="font-serif italic text-xs text-gray-900 font-bold">Bhai Jeweller Bradford</p>
              <p className="text-[9.5px] uppercase tracking-wider text-[#9a897b]">Authorized Master Goldsmith</p>
            </div>
          </div>
        </div>

        {/* PRINT STYLES */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-luxury-invoice,
            #printable-luxury-invoice * {
              visibility: visible !important;
            }
            #printable-luxury-invoice {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 24px !important;
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
