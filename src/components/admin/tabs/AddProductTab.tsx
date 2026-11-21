'use client';

import React from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';
import FormattedProductDescription from '@/components/shared/FormattedProductDescription';
import { AdminThemeStyles, CategoryItem, ProductItem } from '../types';
import {
  CheckCircleIcon,
  AlertCircleIcon,
  EditIcon,
  AddProductIcon,
  CheckIcon,
  DiamondIcon,
  BoltIcon,
  SparklesIcon,
  ImageIcon,
  PlusIcon,
  XIcon,
} from '../AdminIcons';

export interface AddProductFormState {
  id?: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  metal: string;
  sku: string;
  weightGrams: string;
  size: string;
  sizesText: string;
  description: string;
  primaryImage: string;
  additionalImages: string[];
  newImageUrlInput: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  focusKeywordsText: string;
}

interface AddProductTabProps {
  themeStyles: AdminThemeStyles;
  addForm: AddProductFormState;
  setAddForm: React.Dispatch<React.SetStateAction<AddProductFormState>>;
  categories: CategoryItem[];
  editingProduct: ProductItem | null;
  setEditingProduct: (p: ProductItem | null) => void;
  saveSuccessMsg: boolean;
  productErrorMsg: string;
  isSubmittingProduct: boolean;
  onCancel: () => void;
  onFullProductSubmit: (e: React.FormEvent) => Promise<void>;
  onDeviceFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onAddImageUrl: () => void;
  onRemoveImage: (idx: number) => void;
  onGenerateAutoSku: () => void;
  onGenerateAutoSeo: () => void;
}

export default function AddProductTab({
  themeStyles,
  addForm,
  setAddForm,
  categories,
  editingProduct,
  saveSuccessMsg,
  productErrorMsg,
  isSubmittingProduct,
  onCancel,
  onFullProductSubmit,
  onDeviceFileUpload,
  onAddImageUrl,
  onRemoveImage,
  onGenerateAutoSku,
  onGenerateAutoSeo,
}: AddProductTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
    titleColor,
    inputBg,
    primaryBtn,
    cardHeaderBorder,
  } = themeStyles;

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-xl">
          <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            {editingProduct
              ? 'Product updated and synced live in real-time!'
              : 'Product saved to database! Synced live with Storefront catalog.'}
          </span>
        </div>
      )}

      {productErrorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-700 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-xl">
          <AlertCircleIcon className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{productErrorMsg}</span>
        </div>
      )}

      <form onSubmit={onFullProductSubmit} className="space-y-6">
        {/* Header Action Bar */}
        <div className={`${cardBg} p-5 rounded-xl border border-[#261c14] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a130e] border border-[#3d2e22] text-[#d8bb93] flex items-center justify-center">
              {editingProduct ? <EditIcon className="w-5 h-5" /> : <AddProductIcon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className={`font-serif text-xl font-bold ${accentGold}`}>
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Full Product Creation Studio'}
              </h2>
              <p className="text-xs text-[#a89584] font-medium">
                {editingProduct
                  ? 'Modify specifications, prices, stock, and photos. Updates in real-time.'
                  : 'Configure metal specifications, upload multiple photos, and auto-generate SEO metadata.'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-xs font-bold border border-[#2b1f17] bg-[#140e0a] hover:bg-[#1f1711] text-[#c2b2a3] hover:text-white transition-colors cursor-pointer"
            >
              Cancel &amp; Return
            </button>
            <button
              type="submit"
              disabled={isSubmittingProduct}
              className={`px-6 py-2.5 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
            >
              {isSubmittingProduct ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0c0806] border-t-transparent rounded-full animate-spin" />
                  <span>{editingProduct ? 'Updating in Real Time...' : 'Saving to Database...'}</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product in Real Time' : 'Save & Publish Live to Site'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Grid: Left Form Fields, Right Live Store Preview & SEO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COL: PRODUCT DETAILS & MULTI-IMAGE UPLOADER */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Core Product Specs */}
            <div className={`${cardBg} p-6 rounded-xl border border-[#261c14] shadow-xl space-y-4`}>
              <h3 className={`font-serif text-base font-bold ${accentGold} border-b ${cardHeaderBorder} pb-2.5 flex items-center gap-2`}>
                <DiamondIcon className="w-4 h-4" />
                <span>1. Basic Product Information</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Aurelia Solitaire Diamond Ring"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={addForm.category}
                      onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.name} className="bg-[#120d09] text-[#fbf8f5]">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[14px] font-bold text-[#fbf8f5]">
                        Metal Purity &amp; Spec *
                      </label>
                      <span className="text-xs text-[#d8bb93] font-bold font-mono flex items-center gap-1">
                        <EditIcon className="w-3 h-3" />
                        Type custom
                      </span>
                    </div>
                    <input
                      type="text"
                      list="admin-gold-purity-presets"
                      required
                      placeholder="e.g. 21ct Gold, 22k Pure Gold, 24k Bullion..."
                      value={addForm.metal}
                      onChange={(e) => setAddForm({ ...addForm, metal: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                    <datalist id="admin-gold-purity-presets">
                      <option value="22k Pure Gold" />
                      <option value="21ct Gold" />
                      <option value="24k Pure Gold Bullion" />
                      <option value="18k Yellow Gold" />
                      <option value="18k White Gold" />
                      <option value="18k Rose Gold" />
                      <option value="14k Solid Gold" />
                      <option value="Platinum 950" />
                      <option value="Sterling Silver 925" />
                    </datalist>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {['22k Pure Gold', '21ct Gold', '18k Yellow Gold', '18k White Gold', '24k Bullion', 'Platinum 950'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAddForm({ ...addForm, metal: preset })}
                          className={`px-2 py-0.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                            addForm.metal === preset
                              ? 'bg-[#d8bb93] text-[#0c0806] border-[#d8bb93]'
                              : 'bg-[#140e0a] text-[#a89584] border-[#2b1f17] hover:border-[#d8bb93] hover:text-[#fbf8f5]'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      Price (&pound; GBP) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="1280"
                      value={addForm.price}
                      onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      Compare Price (&pound;)
                    </label>
                    <input
                      type="number"
                      placeholder="1650"
                      value={addForm.originalPrice}
                      onChange={(e) => setAddForm({ ...addForm, originalPrice: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="10"
                      value={addForm.stock}
                      onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[14px] font-bold text-[#fbf8f5]">
                        SKU Code
                      </label>
                      <button
                        type="button"
                        onClick={onGenerateAutoSku}
                        className={`text-xs ${accentGold} hover:underline font-bold flex items-center gap-1 cursor-pointer`}
                      >
                        <BoltIcon className="w-3.5 h-3.5" />
                        <span>Auto Generate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="BJ-RNG-8472"
                      value={addForm.sku}
                      onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg font-mono focus:outline-none ${inputBg}`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[14px] font-bold text-[#fbf8f5]">
                        Gold / Metal Weight (Grams) *
                      </label>
                      <span className="text-xs text-[#a89584] font-bold font-mono">e.g. 0.6g, 5.5g</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 0.6g or 5.5"
                        value={addForm.weightGrams}
                        onChange={(e) => setAddForm({ ...addForm, weightGrams: e.target.value })}
                        className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                      />
                      <span className="absolute right-3.5 top-3 text-xs text-[#8c7b6d] select-none font-bold">grams</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {[
                        { label: '0.6g (Studs)', val: '0.6' },
                        { label: '1.5g (Light)', val: '1.5' },
                        { label: '3.5g (Standard)', val: '3.5' },
                        { label: '5.5g (Heavy)', val: '5.5' },
                        { label: '8.0g (Chains)', val: '8.0' },
                        { label: '15.0g (Bangles)', val: '15.0' },
                        { label: '25.0g (Bridal)', val: '25.0' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setAddForm({ ...addForm, weightGrams: preset.val })}
                          className="px-2 py-0.5 rounded text-xs font-bold border border-[#2b1f17] bg-[#140e0a] text-[#a89584] hover:text-[#fbf8f5] hover:border-[#d8bb93] transition-all cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Sizes & Default Size */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[14px] font-bold text-[#fbf8f5]">
                        Available Sizes / Variations (Comma separated)
                      </label>
                      <span className="text-xs text-[#a89584] font-bold font-mono">e.g. 5, 6, 7, 8, 9</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 5, 6, 7, 8, 9 or 16', 18', 20' or 2.4, 2.6, 2.8"
                      value={addForm.sizesText}
                      onChange={(e) => setAddForm({ ...addForm, sizesText: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {[
                        { label: 'Rings (5-9)', val: '5, 6, 7, 8, 9' },
                        { label: 'Rings UK (J-Q)', val: 'J, L, N, P, Q' },
                        { label: 'Chains (16-24")', val: '16", 18", 20", 22", 24"' },
                        { label: 'Bangles (2.4-2.8)', val: '2.4, 2.6, 2.8' },
                        { label: 'Standard', val: 'Standard, Adjustable' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setAddForm({
                              ...addForm,
                              sizesText: preset.val,
                              size: preset.val.split(',')[0].trim(),
                            })
                          }
                          className="px-2 py-0.5 rounded text-xs font-bold border border-[#2b1f17] bg-[#140e0a] text-[#a89584] hover:text-[#fbf8f5] hover:border-[#d8bb93] transition-all cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      Default / Featured Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7"
                      value={addForm.size}
                      onChange={(e) => setAddForm({ ...addForm, size: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                    <p className="text-[11px] text-[#a89584] mt-1.5 font-medium">Shows as active on review &amp; storefront</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[14px] font-bold text-[#fbf8f5]">
                      Detailed Description &amp; Craftsmanship Details
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const template = `Add timeless elegance to your look with this exquisite piece. Featuring master craftsmanship, delicate detailing and a brilliant finish, perfect for everyday wear or royal celebrations.

**Product Details**
- **Metal:** ${addForm.metal || '22ct Yellow Gold'}
- **Style:** Handcrafted Luxury
- **Design:** Royal Artisan Heritage
- **Size:** ${addForm.size || 'Standard'}
- **Weight:** ${addForm.weightGrams ? `${addForm.weightGrams}g` : '5.5g'}
- **Fastening:** Secure Clasp
- **Certification:** Authentic British Hallmark Certified

A beautiful gift for birthdays, anniversaries or any special celebration.`;
                        setAddForm((prev) => ({ ...prev, description: template }));
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#1a130e] border border-[#3d2e22] text-[#d8bb93] hover:text-white hover:border-[#d8bb93] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>✨</span>
                      <span>Insert Luxury Template</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Describe design story, metal purity, specifications, and gifting details..."
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none font-mono ${inputBg}`}
                  />
                  <div className="flex items-center justify-between mt-1.5 text-xs text-[#a89584] font-semibold">
                    <span>Supports markdown: **Bold**, - **Key:** Value bullet lists, and paragraphs</span>
                    <span>{addForm.description.length} chars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Multiple Product Images Manager */}
            <div className={`${cardBg} p-6 rounded-xl border border-[#261c14] shadow-xl space-y-4`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-[#241a13]">
                <h3 className={`font-serif text-base font-bold ${accentGold} flex items-center gap-2`}>
                  <ImageIcon className="w-4 h-4" />
                  <span>2. Multiple Product Images Studio</span>
                </h3>
                <span className="text-xs text-[#d8bb93] font-bold">
                  Total:{' '}
                  {(addForm.primaryImage ? 1 : 0) +
                    addForm.additionalImages.filter((img) => img && img !== addForm.primaryImage).length}{' '}
                  Images
                </span>
              </div>

              <div className="space-y-4">
                {/* Device File Upload Box */}
                <div
                  className="p-6 bg-[#090604] border-2 border-dashed border-[#2b1f17] hover:border-[#d8bb93]/60 rounded-xl text-center space-y-2 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1a130e] border border-[#3d2e22] text-[#d8bb93] flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#fbf8f5]">
                    Upload Photo Files from Device (PC or Mobile)
                  </h4>
                  <p className="text-xs text-[#a89584]">Select device image files (JPG, PNG, WEBP)</p>

                  <label
                    className={`inline-flex items-center space-x-2 px-5 py-2.5 ${primaryBtn} font-bold text-xs rounded-lg shadow-md cursor-pointer transition-all mt-2`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Choose Photo Files...</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={onDeviceFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Primary Cover Image URL Input */}
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                    Primary Cover Image (Uploaded Device File or Image URL) *
                  </label>
                  <input
                    type="text"
                    placeholder="Upload file above or paste image URL..."
                    value={addForm.primaryImage}
                    onChange={(e) => setAddForm({ ...addForm, primaryImage: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                  />
                </div>

                {/* Additional Image URLs List */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-bold text-[#fbf8f5]">
                    Additional Angle Photos &amp; Gallery Images
                  </label>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (e.g. /images/shop-prod-2.jpg)..."
                      value={addForm.newImageUrlInput}
                      onChange={(e) => setAddForm({ ...addForm, newImageUrlInput: e.target.value })}
                      className={`flex-1 text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                    <button
                      type="button"
                      onClick={onAddImageUrl}
                      className={`px-4 py-2.5 ${primaryBtn} font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer`}
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Add URL</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Gallery Thumbnails */}
                <div className="pt-2">
                  <p className="text-[14px] font-bold text-[#fbf8f5] mb-2.5">Gallery Thumbnails Preview:</p>

                  {!addForm.primaryImage && addForm.additionalImages.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-[#2b1f17] text-[#a89584] text-xs italic">
                      No photos added yet. Upload image files above or enter image URL.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {addForm.primaryImage && (
                        <div className="relative h-24 rounded-lg overflow-hidden border-2 border-[#d8bb93] group bg-[#090604]">
                          <Image src={addForm.primaryImage} alt="Primary Cover" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setAddForm((prev) => ({ ...prev, primaryImage: '' }))}
                            className="absolute top-1 right-1 bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow transition-transform hover:scale-110 cursor-pointer"
                            title="Remove cover photo"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-0 left-0 right-0 bg-[#0c0806]/90 text-[#d8bb93] text-[9px] text-center font-bold uppercase py-0.5 border-t border-[#3d2e22]">
                            COVER PHOTO
                          </span>
                        </div>
                      )}

                      {addForm.additionalImages
                        .filter((imgUrl) => imgUrl && imgUrl !== addForm.primaryImage)
                        .map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative h-24 rounded-lg overflow-hidden border border-[#2b1f17] group bg-[#090604]"
                          >
                            <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => onRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow transition-transform hover:scale-110 cursor-pointer"
                              title="Remove photo"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[8.5px] text-center py-0.5">
                              Angle #{idx + 2}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Automated SEO Engine */}
            <div className={`${cardBg} p-6 rounded-xl border border-[#261c14] shadow-xl space-y-4`}>
              <div className="flex items-center justify-between border-b pb-2.5 border-[#241a13]">
                <div>
                  <h3 className={`font-serif text-base font-bold ${accentGold} flex items-center gap-2`}>
                    <SparklesIcon className="w-4 h-4" />
                    <span>3. Automated SEO Metadata &amp; Search Keywords</span>
                  </h3>
                  <p className="text-xs text-[#a89584] font-medium">Google SEO tags and search keywords automatically generated.</p>
                </div>
                <button
                  type="button"
                  onClick={onGenerateAutoSeo}
                  className="px-3 py-1.5 bg-[#1a130e] hover:bg-[#261c14] text-[#d8bb93] border border-[#3d2e22] text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Auto-Generate SEO</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                    SEO Page Title
                  </label>
                  <input
                    type="text"
                    value={addForm.seoTitle}
                    onChange={(e) => setAddForm({ ...addForm, seoTitle: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={addForm.seoDescription}
                    onChange={(e) => setAddForm({ ...addForm, seoDescription: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      URL Permaslug
                    </label>
                    <input
                      type="text"
                      value={addForm.slug}
                      onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg font-mono focus:outline-none ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold text-[#fbf8f5] mb-1.5">
                      Focus Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={addForm.focusKeywordsText}
                      onChange={(e) => setAddForm({ ...addForm, focusKeywordsText: e.target.value })}
                      className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg focus:outline-none ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: LIVE STORE PREVIEW */}
          <div className="space-y-6">
            <div className={`${cardBg} p-5 rounded-xl border border-[#261c14] shadow-xl space-y-4 sticky top-6`}>
              <h3 className={`font-serif text-base font-bold ${accentGold} border-b ${cardHeaderBorder} pb-2.5`}>
                Live Storefront Card Preview
              </h3>

              <div className="rounded-xl overflow-hidden border border-[#261c14] bg-[#0c0806] shadow-xl">
                <div className="relative w-full h-56 bg-[#120d09]">
                  {addForm.primaryImage ? (
                    <Image src={addForm.primaryImage} alt="Cover Preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8c7b6d]">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs">Product Photo Preview</span>
                    </div>
                  )}
                  {addForm.originalPrice && Number(addForm.originalPrice) > Number(addForm.price) && (
                    <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#d8bb93] to-[#c5a059] text-[#0c0806] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      Special Offer
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-[#a89584] uppercase tracking-wider font-bold">{addForm.metal}</p>
                    <h4 className="font-serif font-bold text-sm text-[#fbf8f5] line-clamp-1">
                      {addForm.name || 'Royal Jewelry Piece Title'}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-base font-serif font-bold text-[#fbf8f5]">
                      &pound;{addForm.price ? Number(addForm.price).toLocaleString() : '1,280'}
                    </span>
                    {addForm.originalPrice && Number(addForm.originalPrice) > Number(addForm.price) && (
                      <span className="text-xs text-[#8c7b6d] line-through">
                        &pound;{Number(addForm.originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#241a13] flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#a89584] uppercase tracking-wider text-[10px]">Metal Weight:</span>
                    <span className="font-bold text-[#d8bb93] bg-[#1a130e] px-2 py-0.5 rounded border border-[#3d2e22] flex items-center gap-1 font-mono">
                      <span>⚖️</span>
                      <span>
                        {addForm.weightGrams ? `${String(addForm.weightGrams).replace(/g$/i, '').trim()}g` : '0.6g'}
                      </span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#241a13]">
                    <div className="flex items-center justify-between text-[11px] text-[#a89584] mb-1.5">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Product Size:</span>
                      <span className="font-bold text-[#d8bb93]">{addForm.size || 'Standard'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(addForm.sizesText
                        ? addForm.sizesText
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : ['5', '6', '7', '8', '9']
                      ).map((sz, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAddForm((prev) => ({ ...prev, size: sz }))}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            (addForm.size || '').trim() === sz.trim() || (!addForm.size && i === 0)
                              ? 'bg-[#d8bb93] text-[#0c0806] shadow-xs'
                              : 'bg-[#140e0a] text-[#a89584] border border-[#2b1f17] hover:border-[#d8bb93]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 ${primaryBtn} text-xs font-bold rounded-lg uppercase tracking-wider shadow-md cursor-pointer`}
                  >
                    Add To Bag
                  </button>

                  {addForm.description && (
                    <div className="pt-2 border-t border-[#241a13]">
                      <p className="text-[10px] font-bold text-[#a89584] uppercase tracking-wider mb-1">
                        Live Description Preview:
                      </p>
                      <div className="bg-[#090604] p-2.5 rounded-lg border border-[#241a13] text-xs text-[#c2b2a3]">
                        <FormattedProductDescription
                          description={addForm.description}
                          productName={addForm.name}
                          mode="compact"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[10px] text-[#a89584] border-t border-[#241a13]">
                    <span>SKU: {addForm.sku || 'BJ-AUTO'}</span>
                    <span>
                      Images:{' '}
                      {(addForm.primaryImage ? 1 : 0) +
                        addForm.additionalImages.filter((img) => img && img !== addForm.primaryImage).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#241a13]">
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className={`w-full py-3 ${primaryBtn} font-bold text-xs uppercase tracking-widest rounded-lg shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                >
                  {isSubmittingProduct ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0c0806] border-t-transparent rounded-full animate-spin" />
                      <span>{editingProduct ? 'Updating...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Update Product in Real Time' : 'Publish to Storefront Catalog'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}