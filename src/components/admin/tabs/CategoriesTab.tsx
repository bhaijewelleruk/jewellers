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
        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-gray-900`}>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 uppercase font-semibold tracking-wider`}>Total Categories</p>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-2xl font-serif font-bold ${titleColor}`}>{categories.length}</span>
            <div className="p-1.5 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900">
              <CategoriesIcon className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 mt-1`}>Active storefront collections</p>
        </div>

        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-emerald-500`}>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 uppercase font-semibold tracking-wider`}>Active Status</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
              {categories.filter((c) => c.is_active !== false).length}
            </span>
            <div className="p-1.5 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Live visible in catalog</p>
        </div>

        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-sky-500`}>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 uppercase font-semibold tracking-wider`}>Catalog Products</p>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-2xl font-serif font-bold ${titleColor}`}>{products.length}</span>
            <div className="p-1.5 rounded-[5px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-600">
              <DiamondIcon className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 mt-1`}>Total products distributed</p>
        </div>

        <div className={`${cardBg} p-4 rounded-[5px] border-l-4 border-gray-900`}>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 uppercase font-semibold tracking-wider`}>Database Sync</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Live
            </span>
            <div className="p-1.5 rounded-[5px] bg-gray-100 border border-gray-200 text-gray-900">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 mt-1`}>Real-time auto replication</p>
        </div>
      </div>

      {/* Notification Messages */}
      {catSaveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[5px] text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{catSaveSuccess}</span>
        </div>
      )}
      {catError && (
        <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 rounded-[5px] text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
          <span>{catError}</span>
        </div>
      )}

      {/* TWO-COLUMN STUDIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: FORM */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${cardBg} p-6 rounded-[5px] space-y-4 shadow-xs border border-gray-200 dark:border-[#3a2c23]`}>
            <div className="flex items-center justify-between border-b border-current border-opacity-10 pb-3">
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
                <p className={`text-xs font-semibold text-gray-800 dark:text-gray-200`}>
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
                  className={`text-xs px-2.5 py-1 rounded-[4px] border ${subtitleColor} hover:${titleColor} cursor-pointer`}
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={onCategorySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className={`block text-[14px] font-bold text-black dark:text-white mb-1`}>
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
                  className={`w-full text-[14.5px] px-3.5 py-2.5 font-medium text-black rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[14px] font-bold text-black dark:text-white mb-1`}>
                    Slug (URL Path)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. bridal-sets"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className={`w-full text-[14.5px] px-3.5 py-2.5 font-medium text-black rounded-[5px] font-mono focus:outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-[14px] font-bold text-black dark:text-white mb-1`}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={categoryForm.display_order}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 1 })
                    }
                    className={`w-full text-[14.5px] px-3.5 py-2.5 font-medium text-black rounded-[5px] focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[14px] font-bold text-black dark:text-white mb-1`}>
                  Category Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for SEO and category banner..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className={`w-full text-xs px-3.5 py-2 rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-[14px] font-bold text-black dark:text-white mb-1`}>
                  Image Path / URL
                </label>
                <input
                  type="text"
                  placeholder="/images/category-rings.jpg"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className={`w-full text-[14.5px] px-3.5 py-2.5 font-medium text-black rounded-[5px] focus:outline-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                disabled={catSaving}
                className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-[5px] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                {catSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
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
          <div className={`${cardBg} rounded-[5px] overflow-hidden border border-gray-200 dark:border-[#3a2c23]`}>
            <div className="p-4 border-b border-current border-opacity-10 flex items-center justify-between">
              <div>
                <h3 className={`font-serif text-base font-bold ${titleColor}`}>
                  Active Categories Catalog ({categories.length})
                </h3>
                <p className={`text-xs font-semibold text-gray-800 dark:text-gray-200`}>
                  Live synced with Supabase Real-Time database
                </p>
              </div>
              <Link
                href="/categories"
                target="_blank"
                className="px-3 py-1.5 rounded-[4px] bg-gray-50 hover:bg-gray-100 text-gray-900 dark:text-slate-200 text-[11px] font-semibold border border-gray-200 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>View Storefront</span>
                <ExternalLinkIcon className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] font-medium text-black dark:text-white">
                <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold text-[10.5px]`}>
                  <tr>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Slug</th>
                    <th className="p-3.5">Catalog Products</th>
                    <th className="p-3.5">Order</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableRowHover}`}>
                  {categories.map((cat) => {
                    const productCount = products.filter(
                      (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
                    ).length;

                    return (
                      <tr key={cat.id || cat.slug} className="transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-[5px] overflow-hidden bg-[#e8ded4] dark:bg-[#251a13] shrink-0 border border-gray-200 dark:border-[#3a2c23]">
                            <Image
                              src={cat.image || '/images/category-rings.jpg'}
                              alt={cat.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className={`font-semibold ${titleColor}`}>{cat.name}</p>
                            <p className={`text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1`}>{cat.description}</p>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-xs">{cat.slug}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-[4px] bg-gray-100 text-gray-800 text-[10px] font-semibold">
                            {productCount} items
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-xs">{cat.display_order || 1}</td>
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
                              className="p-1.5 rounded-[4px] border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <EditIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteCategory(cat)}
                              className="p-1.5 rounded-[4px] border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
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
