'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { AdminThemeStyles, CategoryItem, ProductItem } from '../types';
import {
  CategoriesIcon,
  CheckCircleIcon,
  DiamondIcon,
  BoltIcon,
  AlertTriangleIcon,
  EditIcon,
  PlusIcon,
  CheckIcon,
  SparklesIcon,
  ExternalLinkIcon,
  TrashIcon,
} from '../AdminIcons';

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  image: string;
  display_order: number;
}

interface CategoriesTabProps {
  themeStyles: AdminThemeStyles;
  categories: CategoryItem[];
  products: ProductItem[];
  categoryForm: CategoryFormState;
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryFormState>>;
  editingCategory: CategoryItem | null;
  setEditingCategory: (cat: CategoryItem | null) => void;
  catSaveSuccess: string;
  catError: string;
  catSaving: boolean;
  onCategorySubmit: (e: React.FormEvent) => Promise<void>;
  onDeleteCategory: (category: CategoryItem) => Promise<void>;
}

export default function CategoriesTab({
  themeStyles,
  categories,
  products,
  categoryForm,
  setCategoryForm,
  editingCategory,
  setEditingCategory,
  catSaveSuccess,
  catError,
  catSaving,
  onCategorySubmit,
  onDeleteCategory,
}: CategoriesTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
    titleColor,
    inputBg,
    primaryBtn,
    tableHeaderBg,
    tableRowHover,
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] border-l-4 border-l-[#d8bb93] shadow-xl`}>
          <p className="text-xs font-bold text-[#a89584] uppercase tracking-wider">Total Categories</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-[#fbf8f5]">{categories.length}</span>
            <div className="p-2 rounded-lg bg-[#1a130e] border border-[#3d2e22] text-[#d8bb93]">
              <CategoriesIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#a89584] mt-1 font-medium">Active storefront collections</p>
        </div>

        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] border-l-4 border-l-emerald-500 shadow-xl`}>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Status</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-emerald-400">
              {categories.filter((c) => c.is_active !== false).length}
            </span>
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#a89584] mt-1 font-medium">Live visible in catalog</p>
        </div>

        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] border-l-4 border-l-sky-500 shadow-xl`}>
          <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Catalog Products</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-sky-400">{products.length}</span>
            <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400">
              <DiamondIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#a89584] mt-1 font-medium">Total products distributed</p>
        </div>

        <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] border-l-4 border-l-[#d8bb93] shadow-xl`}>
          <p className="text-xs font-bold text-[#a89584] uppercase tracking-wider">Database Sync</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Live
            </span>
            <div className="p-2 rounded-lg bg-[#1a130e] border border-[#3d2e22] text-[#d8bb93]">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#a89584] mt-1 font-medium">Real-time auto replication</p>
        </div>
      </div>

      {/* Notification Messages */}
      {catSaveSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl">
          <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{catSaveSuccess}</span>
        </div>
      )}
      {catError && (
        <div className="p-4 bg-rose-950/80 border border-rose-700 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl">
          <AlertTriangleIcon className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{catError}</span>
        </div>
      )}

      {/* TWO-COLUMN STUDIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: FORM */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${cardBg} p-6 rounded-xl space-y-4 shadow-xl border border-[#261c14]`}>
            <div className="flex items-center justify-between border-b border-[#241a13] pb-3">
              <div>
                <h3 className={`font-serif text-base font-bold ${accentGold} flex items-center gap-2`}>
                  {editingCategory ? (
                    <>
                      <EditIcon className="w-4 h-4" />
                      <span>Edit Category</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" />
                      <span>Add New Category</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-[#a89584] font-medium">
                  {editingCategory ? `Modifying: ${editingCategory.name}` : 'Instantly visible on storefront'}
                </p>
              </div>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      name: '',
                      slug: '',
                      description: '',
                      image: '/images/category-rings.jpg',
                      display_order: categories.length + 1,
                    });
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg border border-[#2b1f17] text-[#a89584] hover:text-[#fbf8f5] bg-[#140e0a] cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={onCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Sets, Rings, Polki..."
                  value={categoryForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: val,
                      slug: !editingCategory
                        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                        : prev.slug,
                    }));
                  }}
                  className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                    Slug (URL Path)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. bridal-sets"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg font-mono focus:outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={categoryForm.display_order}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 1 })
                    }
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for SEO and category banner..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className={`w-full text-xs px-4 py-2.5 font-medium text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  placeholder="/images/category-rings.jpg"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                disabled={catSaving}
                className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                {catSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0c0806] border-t-transparent animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    {editingCategory ? <CheckIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                    <span>{editingCategory ? 'Update Category' : 'Save & Publish Category'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: TABLE */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`${cardBg} rounded-xl overflow-hidden border border-[#261c14] shadow-xl`}>
            <div className="p-4 border-b border-[#241a13] flex items-center justify-between">
              <div>
                <h3 className={`font-serif text-base font-bold ${titleColor}`}>
                  Active Categories Catalog ({categories.length})
                </h3>
                <p className="text-xs text-[#a89584] font-medium">
                  Live synced with Supabase Real-Time database
                </p>
              </div>
              <Link
                href="/categories"
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-[#140e0a] hover:bg-[#1f1711] text-[#d8bb93] hover:text-white text-xs font-bold border border-[#2b1f17] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>View Storefront</span>
                <ExternalLinkIcon className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] font-medium text-[#fbf8f5]">
                <thead className={`${tableHeaderBg} uppercase tracking-wider font-bold text-[10.5px]`}>
                  <tr>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Slug</th>
                    <th className="p-3.5">Catalog Products</th>
                    <th className="p-3.5">Order</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-[#241a13] ${tableRowHover}`}>
                  {categories.map((cat) => {
                    const productCount = products.filter(
                      (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
                    ).length;

                    return (
                      <tr key={cat.id || cat.slug} className="transition-colors hover:bg-[#1a130e]/80">
                        <td className="p-3.5 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#090604] shrink-0 border border-[#261c14]">
                            <Image
                              src={cat.image || '/images/category-rings.jpg'}
                              alt={cat.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-[#fbf8f5] text-xs">{cat.name}</p>
                            <p className="text-[11px] text-[#a89584] line-clamp-1">{cat.description}</p>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-xs text-[#c2b2a3]">{cat.slug}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-[#1a130e] text-[#d8bb93] border border-[#3d2e22]">
                            {productCount} items
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-xs text-[#d8bb93] font-bold">{cat.display_order || 1}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(cat);
                                setCategoryForm({
                                  name: cat.name,
                                  slug: cat.slug,
                                  description: cat.description || '',
                                  image: cat.image || '/images/category-rings.jpg',
                                  display_order: cat.display_order || 1,
                                });
                              }}
                              className="p-1.5 rounded-lg border border-[#2b1f17] hover:border-[#d8bb93] bg-[#140e0a] text-[#d8bb93] hover:text-white transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <EditIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteCategory(cat)}
                              className="p-1.5 rounded-lg border border-[#2b1f17] hover:border-rose-800 bg-[#140e0a] hover:bg-rose-950/60 text-[#8c7b6d] hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}