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
}: ProductsTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
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

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      {/* INVENTORY HEALTH KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-gray-900`}>
          <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>
            Total Catalog Items
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-2xl font-serif font-bold ${titleColor}`}>{products.length}</span>
            <div className="p-1.5 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900">
              <DiamondIcon className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-[10px] ${subtitleColor} mt-1`}>Active product listings</p>
        </div>

        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-emerald-500`}>
          <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>
            Healthy Stock (&gt; 5)
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
              {healthyStockCount}
            </span>
            <div className="p-1.5 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Optimal retail inventory</p>
        </div>

        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-amber-500`}>
          <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>
            Low Stock Warning (1-5)
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
              {lowStockCount}
            </span>
            <div className="p-1.5 rounded-[5px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600">
              <AlertTriangleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Replenishment recommended</p>
        </div>

        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-red-500`}>
          <p className={`text-[10px] ${subtitleColor} uppercase font-semibold tracking-wider`}>
            Out of Stock (0 units)
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">
              {outOfStockCount}
            </span>
            <div className="p-1.5 rounded-[5px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600">
              <AlertCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">Unavailable on storefront</p>
        </div>
      </div>

      {/* LOW STOCK CRITICAL WARNING BANNER */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="p-3.5 rounded-[5px] bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangleIcon className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-amber-900 dark:text-amber-200 font-medium">
              <strong>Inventory Alert:</strong> {lowStockCount} items running low on stock and {outOfStockCount} items are out of stock. Immediate artisan restock required.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStockFilter('low')}
              className="px-2.5 py-1 rounded-[4px] bg-amber-600 text-white text-[10px] font-semibold hover:bg-amber-700 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangleIcon className="w-3 h-3" />
              <span>View Low Stock ({lowStockCount})</span>
            </button>
            {outOfStockCount > 0 && (
              <button
                onClick={() => setStockFilter('out')}
                className="px-2.5 py-1 rounded-[4px] bg-red-600 text-white text-[10px] font-semibold hover:bg-red-700 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <AlertCircleIcon className="w-3 h-3" />
                <span>View Out of Stock ({outOfStockCount})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACTION & FILTER CONTROLS */}
      <div className={`flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`text-xs pl-8.5 pr-3 py-2 rounded-[5px] focus:outline-none w-full ${inputBg}`}
            />
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a120e] p-1 rounded-[5px] border border-gray-200 dark:border-[#3a2c23]">
            <button
              type="button"
              onClick={() => setStockFilter('all')}
              className={`px-2.5 py-1 rounded-[4px] text-[10.5px] font-medium transition-all cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-[#17120e] text-[#fbfaf8] font-bold shadow-2xs'
                  : `${subtitleColor} hover:${titleColor}`
              }`}
            >
              All Stock ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('low')}
              className={`px-2.5 py-1 rounded-[4px] text-[10.5px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                stockFilter === 'low'
                  ? 'bg-amber-600 text-white font-bold shadow-2xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950'
              }`}
            >
              <AlertTriangleIcon className="w-3 h-3" />
              <span>Low ({lowStockCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('out')}
              className={`px-2.5 py-1 rounded-[4px] text-[10.5px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                stockFilter === 'out'
                  ? 'bg-red-600 text-white font-bold shadow-2xs'
                  : 'text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950'
              }`}
            >
              <AlertCircleIcon className="w-3 h-3" />
              <span>Out ({outOfStockCount})</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className={`text-xs px-3 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
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
            className="px-3.5 py-2 rounded-[5px] border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Download inventory report as CSV spreadsheet"
          >
            <ExportIcon className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddProduct}
            className={`px-4 py-2 ${primaryBtn} font-semibold text-xs rounded-[5px] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer`}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table with Quick Restock Controls */}
      <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
              <tr>
                <th className="py-2.5 px-3">Product Info</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Metal Spec</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Stock Health</th>
                <th className="py-2.5 px-3">Quick Restock</th>
                <th className="py-2.5 px-3">Images</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tableRowHover}`}>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-gray-500 italic">
                    No products found matching the current search or stock filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="transition-colors">
                    <td className="py-2 px-3 flex items-center space-x-2.5">
                      <div className="relative w-8 h-8 rounded-[4px] overflow-hidden bg-[#e8ded4] dark:bg-[#211611] shrink-0 border border-gray-200 dark:border-[#3a2c23]">
                        <Image
                          src={p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg'}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className={`font-semibold ${titleColor}`}>{p.name}</p>
                        <p className={`text-[10px] ${subtitleColor}`}>{p.id}</p>
                      </div>
                    </td>
                    <td className={`py-2 px-3 font-mono ${subtitleColor}`}>{p.sku}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 border rounded-[4px] text-[10px] ${badgeBg}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className={`py-2 px-3 ${subtitleColor}`}>{p.metal}</td>
                    <td className={`py-2 px-3 font-semibold ${accentGold}`}>&pound;{p.price.toLocaleString()}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold inline-flex items-center gap-1 ${
                          p.stock > 5
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : p.stock > 0
                            ? 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                        }`}
                      >
                        {p.stock > 5 ? (
                          <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                        ) : p.stock > 0 ? (
                          <AlertTriangleIcon className="w-3 h-3 text-amber-600 animate-pulse" />
                        ) : (
                          <AlertCircleIcon className="w-3 h-3 text-red-600" />
                        )}
                        <span>
                          {p.stock} units ({p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'})
                        </span>
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onQuickRestock(p.id, p.name, p.stock, 1)}
                          className="px-2 py-1 rounded-[4px] bg-gray-50 dark:bg-[#211611] hover:bg-gray-100 dark:hover:bg-[#2d1e17] text-[#17120e] dark:text-slate-200 border border-gray-200 dark:border-[#3a2c23] text-[10px] font-bold transition-all cursor-pointer"
                          title="Add 1 piece to stock"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickRestock(p.id, p.name, p.stock, 5)}
                          className="px-2 py-1 rounded-[4px] bg-gray-900/15 hover:bg-gray-900/30 text-gray-900 dark:text-slate-200 border border-gray-300 text-[10px] font-bold transition-all cursor-pointer"
                          title="Add 5 pieces (Standard batch restock)"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-gray-900">
                      <span className="font-semibold">{p.images?.length || 1} imgs</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onStartEditProduct(p)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 rounded-[5px] text-[10px] font-bold transition-colors border border-gray-200 flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Edit product in studio"
                        >
                          <EditIcon className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p.id, p.name)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 dark:bg-red-950/80 dark:hover:bg-red-900 dark:text-red-200 rounded-[5px] text-[10px] font-semibold transition-colors border border-red-200 dark:border-red-900 flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Delete product"
                        >
                          <TrashIcon className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  );
}
