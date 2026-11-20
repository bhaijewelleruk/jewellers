'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles, CategoryItem, ProductItem } from '../types';
import {
  DiamondIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  SearchIcon,
  ExportIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
} from '../AdminIcons';

interface ProductsTabProps {
  themeStyles: AdminThemeStyles;
  products: ProductItem[];
  categories: CategoryItem[];
  onOpenAddProduct: () => void;
  onStartEditProduct: (p: ProductItem) => void;
  onDeleteProduct: (id: string, name: string) => Promise<void>;
  onQuickRestock: (id: string, name: string, currentStock: number, delta: number) => void;
  onExportInventoryCSV: () => void;
  onUpdatePrice?: (id: string, newPrice: number) => Promise<boolean>;
}

export default function ProductsTab({
  themeStyles,
  products,
  categories,
  onOpenAddProduct,
  onStartEditProduct,
  onDeleteProduct,
  onQuickRestock,
  onExportInventoryCSV,
  onUpdatePrice,
}: ProductsTabProps) {
  const {
    cardBg,
    subtitleColor,
    titleColor,
    inputBg,
    primaryBtn,
    tableHeaderBg,
    tableRowHover,
    badgeBg,
  } = themeStyles;

  const [searchQuery, setSearchQuery] = useState('');
  const [productCategory, setProductCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Inline Price Editing State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isSavingPrice, setIsSavingPrice] = useState<boolean>(false);
  const [priceSuccessId, setPriceSuccessId] = useState<string | null>(null);

  const healthyStockCount = products.filter((p) => p.stock > 5).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = productCategory === 'All' || p.category === productCategory;

    if (!matchesSearch || !matchesCategory) return false;

    if (stockFilter === 'low') return p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'out') return p.stock === 0;
    return true;
  });

  const handleStartPriceEdit = (p: ProductItem) => {
    setEditingPriceId(p.id);
    setTempPrice(String(p.price));
  };

  const handleCancelPriceEdit = () => {
    setEditingPriceId(null);
    setTempPrice('');
  };

  const handleSavePriceEdit = async (p: ProductItem) => {
    const val = parseFloat(tempPrice);
    if (isNaN(val) || val < 0) {
      alert('Please enter a valid price.');
      return;
    }
    if (!onUpdatePrice) return;

    setIsSavingPrice(true);
    const success = await onUpdatePrice(p.id, val);
    setIsSavingPrice(false);

    if (success) {
      setEditingPriceId(null);
      setPriceSuccessId(p.id);
      setTimeout(() => setPriceSuccessId(null), 2500);
    } else {
      alert('Failed to update price. Please try again.');
    }
  };

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-5">
      {/* INVENTORY HEALTH METRICS (Shopify Polaris Clean KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`${cardBg} p-4 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-medium uppercase tracking-wider ${subtitleColor}`}>All Products</span>
            <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
              <DiamondIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-sans ${titleColor} mt-2`}>{products.length}</p>
          <p className="text-[11px] text-gray-800 dark:text-gray-200 mt-0.5">Live store listings</p>
        </div>

        <div className={`${cardBg} p-4 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">In Stock</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircleIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-emerald-600 dark:text-emerald-400 mt-2">{healthyStockCount}</p>
          <p className="text-[11px] text-gray-800 dark:text-gray-200 mt-0.5">&gt; 5 units ready</p>
        </div>

        <div className={`${cardBg} p-4 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">Low Stock</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <AlertTriangleIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-amber-600 dark:text-amber-400 mt-2">{lowStockCount}</p>
          <p className="text-[11px] text-gray-800 dark:text-gray-200 mt-0.5">1 to 5 units remaining</p>
        </div>

        <div className={`${cardBg} p-4 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-xs`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-rose-700 dark:text-rose-400">Out of Stock</span>
            <div className="w-7 h-7 rounded-md bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
              <AlertCircleIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-rose-600 dark:text-rose-400 mt-2">{outOfStockCount}</p>
          <p className="text-[11px] text-gray-800 dark:text-gray-200 mt-0.5">Hidden / Sold out</p>
        </div>
      </div>

      {/* FILTER & CONTROL BAR (Shopify Style) */}
      <div className={`${cardBg} p-3.5 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3`}>
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter products, SKU, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`text-xs pl-8.5 pr-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black w-full border border-gray-200 dark:border-neutral-700 ${inputBg}`}
            />
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800/80 p-0.5 rounded-md border border-gray-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              All ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                stockFilter === 'low'
                  ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50'
              }`}
            >
              <span>Low</span>
              <span className="text-[10px] px-1 rounded-full bg-amber-100 text-amber-800 font-bold">{lowStockCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('out')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                stockFilter === 'out'
                  ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50'
              }`}
            >
              <span>Out</span>
              <span className="text-[10px] px-1 rounded-full bg-rose-100 text-rose-800 font-bold">{outOfStockCount}</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 justify-end">
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className={`text-[14px] px-3.5 py-2 font-medium text-black rounded-md border border-gray-200 dark:border-neutral-700 focus:outline-none ${inputBg}`}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onExportInventoryCSV}
            className="px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 text-gray-700 dark:text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Download CSV"
          >
            <ExportIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddProduct}
            className={`px-3.5 py-2 ${primaryBtn} font-semibold text-xs rounded-md transition-all shadow-xs flex items-center gap-1.5 cursor-pointer`}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE (Shopify Polaris Clean Style with Inline Price Edit & Restock) */}
      <div className={`${cardBg} rounded-lg border border-gray-200 dark:border-neutral-800 shadow-xs overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] font-medium text-black dark:text-white">
            <thead className={`${tableHeaderBg} border-b border-gray-200 dark:border-neutral-800 font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[11px]`}>
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (Real-Time Edit)</th>
                <th className="py-3 px-4">SKU / Metal</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-100 dark:divide-neutral-800 ${tableRowHover}`}>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400 italic">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isEditingThisPrice = editingPriceId === p.id;
                  const isJustSaved = priceSuccessId === p.id;

                  return (
                    <tr key={p.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/40">
                      {/* Product Thumbnail & Title */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800 shrink-0 border border-gray-200 dark:border-neutral-700">
                            <Image
                              src={p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg'}
                              alt={p.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className={`font-semibold ${titleColor} truncate text-xs hover:text-amber-700 cursor-pointer`} onClick={() => onStartEditProduct(p)}>
                              {p.name}
                            </p>
                            <p className="text-[10.5px] text-gray-600 dark:text-gray-400 font-semibold font-mono truncate">{p.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge (Shopify Pill) */}
                      <td className="py-2.5 px-4">
                        {p.stock > 5 ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e3f1df] text-[#108043] border border-[#bbe5b3]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#108043]" />
                            <span>Active</span>
                          </span>
                        ) : p.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fff3d6] text-[#8a6100] border border-[#ffe082]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8a6100] animate-pulse" />
                            <span>Low stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fed3d1] text-[#bf0711] border border-[#fba4a1]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#bf0711]" />
                            <span>Out of stock</span>
                          </span>
                        )}
                      </td>

                      {/* Inventory Count & Real-Time Restock Buttons */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100 min-w-[55px]">
                            {p.stock} in stock
                          </span>
                          <div className="flex items-center border border-gray-200 dark:border-neutral-700 rounded-md overflow-hidden bg-white dark:bg-neutral-800 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onQuickRestock(p.id, p.name, p.stock, -1)}
                              disabled={p.stock <= 0}
                              className="px-1.5 py-1 text-gray-800 dark:text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-neutral-700 text-[10px] font-bold border-r border-gray-200 dark:border-neutral-700 disabled:opacity-30 cursor-pointer"
                              title="Decrease stock by 1"
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickRestock(p.id, p.name, p.stock, 1)}
                              className="px-1.5 py-1 text-gray-700 hover:text-black hover:bg-gray-100 dark:hover:bg-neutral-700 text-[10px] font-bold border-r border-gray-200 dark:border-neutral-700 cursor-pointer"
                              title="Increase stock by 1"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickRestock(p.id, p.name, p.stock, 5)}
                              className="px-2 py-1 text-gray-700 hover:text-black hover:bg-gray-100 dark:hover:bg-neutral-700 text-[10px] font-bold cursor-pointer"
                              title="Add standard batch of 5"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${badgeBg}`}>
                          {p.category}
                        </span>
                      </td>

                      {/* REAL-TIME INLINE PRICE EDITING */}
                      <td className="py-2.5 px-4">
                        {isEditingThisPrice ? (
                          <div className="flex items-center gap-1 animate-fadeIn">
                            <div className="relative flex items-center">
                              <span className="absolute left-2 text-gray-800 dark:text-gray-200 text-xs font-semibold">&pound;</span>
                              <input
                                type="number"
                                autoFocus
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSavePriceEdit(p);
                                  if (e.key === 'Escape') handleCancelPriceEdit();
                                }}
                                className="w-24 pl-5 pr-2 py-1 text-xs font-semibold border-2 border-emerald-500 rounded bg-white text-gray-900 focus:outline-none shadow-xs"
                                placeholder="Price"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSavePriceEdit(p)}
                              disabled={isSavingPrice}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                              title="Save new price (Enter)"
                            >
                              {isSavingPrice ? '...' : '✓'}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelPriceEdit}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-[11px] font-bold transition-colors cursor-pointer"
                              title="Cancel (Esc)"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <button
                              type="button"
                              onClick={() => handleStartPriceEdit(p)}
                              className="text-left font-bold font-sans text-gray-900 dark:text-gray-100 hover:text-emerald-700 cursor-pointer flex items-center gap-1.5"
                              title="Click to quickly edit price in real time"
                            >
                              <span>&pound;{p.price.toLocaleString()}</span>
                              <span className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 bg-gray-100 dark:bg-neutral-800 px-1 rounded transition-opacity">
                                ✎ Edit
                              </span>
                            </button>
                            {isJustSaved && (
                              <span className="text-[10px] font-medium text-emerald-600 animate-fadeIn">
                                Saved!
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* SKU & Metal */}
                      <td className="py-2.5 px-4 font-mono text-[11px] text-gray-800 dark:text-gray-200">
                        <div>{p.sku || 'N/A'}</div>
                        <div className="text-[10px] text-gray-400 font-sans">{p.metal}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onStartEditProduct(p)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded text-[11px] font-medium transition-colors border border-gray-200 dark:border-neutral-700 flex items-center gap-1 cursor-pointer"
                            title="Full Product Studio Edit"
                          >
                            <EditIcon className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p.id, p.name)}
                            className="px-2 py-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded text-[11px] transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  );
}
