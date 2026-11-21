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
      {/* INVENTORY HEALTH METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] shadow-xl`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${subtitleColor}`}>All Products</span>
            <div className="w-8 h-8 rounded-lg bg-[#1a130e] border border-[#3d2e22] flex items-center justify-center text-[#d8bb93]">
              <DiamondIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-[#fbf8f5] mt-2">{products.length}</p>
          <p className="text-[11px] text-[#a89584] mt-0.5">Live store listings</p>
        </div>

        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] shadow-xl`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">In Stock</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-emerald-400 mt-2">{healthyStockCount}</p>
          <p className="text-[11px] text-[#a89584] mt-0.5">&gt; 5 units ready</p>
        </div>

        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] shadow-xl`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Low Stock</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <AlertTriangleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-amber-400 mt-2">{lowStockCount}</p>
          <p className="text-[11px] text-[#a89584] mt-0.5">1 to 5 units remaining</p>
        </div>

        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] shadow-xl`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Out of Stock</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <AlertCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-rose-400 mt-2">{outOfStockCount}</p>
          <p className="text-[11px] text-[#a89584] mt-0.5">Hidden / Sold out</p>
        </div>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3`}>
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7b6d]" />
            <input
              type="text"
              placeholder="Filter products, SKU, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d8bb93] w-full border border-[#2b1f17] ${inputBg}`}
            />
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1 bg-[#090604] border border-[#2b1f17] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-[#d8bb93] text-[#0c0806] shadow-xs'
                  : 'text-[#a89584] hover:text-[#fbf8f5]'
              }`}
            >
              All ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('low')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                stockFilter === 'low'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              <span>Low</span>
              <span className="text-[10px] px-1 rounded-full bg-amber-900/80 text-amber-200 font-bold">{lowStockCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('out')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                stockFilter === 'out'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-400 hover:bg-rose-950/40'
              }`}
            >
              <span>Out</span>
              <span className="text-[10px] px-1 rounded-full bg-rose-900/80 text-rose-200 font-bold">{outOfStockCount}</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 justify-end">
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className={`text-xs px-3 py-2 font-bold rounded-lg border border-[#2b1f17] focus:outline-none ${inputBg}`}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.name} className="bg-[#120d09] text-white">
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onExportInventoryCSV}
            className="px-3 py-2 rounded-lg border border-[#2b1f17] bg-[#140e0a] hover:bg-[#1f1711] text-[#d8bb93] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Download CSV"
          >
            <ExportIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddProduct}
            className={`px-3.5 py-2 ${primaryBtn} font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer`}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className={`${cardBg} rounded-xl border border-[#261c14] shadow-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] font-medium text-[#fbf8f5]">
            <thead className={`${tableHeaderBg} border-b border-[#241a13] font-bold text-[#d8bb93] uppercase tracking-wider text-[11px]`}>
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
            <tbody className={`divide-y divide-[#241a13] ${tableRowHover}`}>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#a89584] italic">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isEditingThisPrice = editingPriceId === p.id;
                  const isJustSaved = priceSuccessId === p.id;

                  return (
                    <tr key={p.id} className="transition-colors hover:bg-[#1a130e]/80">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#090604] shrink-0 border border-[#261c14]">
                            <Image
                              src={p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg'}
                              alt={p.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-[#fbf8f5] truncate text-xs hover:text-[#d8bb93] cursor-pointer" onClick={() => onStartEditProduct(p)}>
                              {p.name}
                            </p>
                            <p className="text-[10.5px] text-[#a89584] font-semibold font-mono truncate">{p.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {p.stock > 5 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Active</span>
                          </span>
                        ) : p.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-400 border border-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>Low stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/70 text-rose-400 border border-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            <span>Out of stock</span>
                          </span>
                        )}
                      </td>

                      {/* Inventory Count & Restock */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#fbf8f5] text-xs min-w-[55px]">
                            {p.stock} in stock
                          </span>
                          <div className="flex items-center border border-[#2b1f17] rounded-lg overflow-hidden bg-[#090604] shadow-xs">
                            <button
                              type="button"
                              onClick={() => onQuickRestock(p.id, p.name, p.stock, -1)}
                              disabled={p.stock <= 0}
                              className="px-2 py-1 text-[#c2b2a3] hover:text-[#d8bb93] hover:bg-[#1a130e] text-[10px] font-bold border-r border-[#2b1f17] disabled:opacity-30 cursor-pointer"
                              title="Decrease stock by 1"
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickRestock(p.id, p.name, p.stock, 1)}
                              className="px-2 py-1 text-[#c2b2a3] hover:text-[#d8bb93] hover:bg-[#1a130e] text-[10px] font-bold border-r border-[#2b1f17] cursor-pointer"
                              title="Increase stock by 1"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickRestock(p.id, p.name, p.stock, 5)}
                              className="px-2 py-1 text-[#c2b2a3] hover:text-[#d8bb93] hover:bg-[#1a130e] text-[10px] font-bold cursor-pointer"
                              title="Add batch of 5"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeBg}`}>
                          {p.category}
                        </span>
                      </td>

                      {/* REAL-TIME INLINE PRICE EDITING */}
                      <td className="py-3 px-4">
                        {isEditingThisPrice ? (
                          <div className="flex items-center gap-1.5">
                            <div className="relative flex items-center">
                              <span className="absolute left-2 text-[#d8bb93] text-xs font-bold">&pound;</span>
                              <input
                                type="number"
                                autoFocus
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSavePriceEdit(p);
                                  if (e.key === 'Escape') handleCancelPriceEdit();
                                }}
                                className="w-24 pl-5 pr-2 py-1 text-xs font-bold border border-[#d8bb93] rounded-lg bg-[#090604] text-[#fbf8f5] focus:outline-none shadow-xs"
                                placeholder="Price"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSavePriceEdit(p)}
                              disabled={isSavingPrice}
                              className="px-2.5 py-1 bg-gradient-to-r from-[#d8bb93] to-[#c5a059] text-[#0c0806] rounded-md text-[11px] font-bold shadow-xs cursor-pointer"
                              title="Save new price (Enter)"
                            >
                              {isSavingPrice ? '...' : '✓'}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelPriceEdit}
                              className="px-2 py-1 bg-[#1a130e] hover:bg-[#261c14] text-[#a89584] rounded-md text-[11px] font-bold cursor-pointer"
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
                              className="text-left font-bold font-sans text-[#fbf8f5] hover:text-[#d8bb93] cursor-pointer flex items-center gap-1.5"
                              title="Click to quickly edit price in real time"
                            >
                              <span>&pound;{p.price.toLocaleString()}</span>
                              <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#d8bb93] bg-[#1a130e] border border-[#3d2e22] px-1.5 py-0.5 rounded transition-opacity">
                                ✎ Edit
                              </span>
                            </button>
                            {isJustSaved && (
                              <span className="text-[10px] font-bold text-emerald-400">
                                Saved!
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* SKU & Metal */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#c2b2a3]">
                        <div className="text-[#fbf8f5] font-semibold">{p.sku || 'N/A'}</div>
                        <div className="text-[10px] text-[#a89584] font-sans">{p.metal}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onStartEditProduct(p)}
                            className="px-3 py-1.5 bg-[#140e0a] hover:bg-[#1f1711] text-[#d8bb93] hover:text-white rounded-lg text-[11px] font-bold transition-colors border border-[#2b1f17] flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Full Product Studio Edit"
                          >
                            <EditIcon className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p.id, p.name)}
                            className="p-1.5 hover:bg-rose-950/60 text-[#8c7b6d] hover:text-rose-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-900/60"
                            title="Delete product"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
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