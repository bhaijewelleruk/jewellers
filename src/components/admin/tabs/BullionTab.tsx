'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BullionProduct } from '@/data/bullion-items';
import { AdminThemeStyles } from '../types';
import { formatGBP } from '@/lib/rates';

interface BullionTabProps {
  themeStyles: AdminThemeStyles;
  goldGram: number;
  silverGram: number;
}

export default function BullionTab({
  themeStyles,
  goldGram,
  silverGram,
}: BullionTabProps) {
  const {
    cardBg,
    subtitleColor,
    accentGold,
    titleColor,
    inputBg,
    primaryBtn,
  } = themeStyles;

  const [metalFilter, setMetalFilter] = useState<'gold' | 'silver'>('gold');
  const [typeFilter, setTypeFilter] = useState<'all' | 'bar' | 'coin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [goldItems, setGoldItems] = useState<BullionProduct[]>([]);
  const [silverItems, setSilverItems] = useState<BullionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BullionProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<BullionProduct>>({
    name: '',
    metal: 'gold',
    type: 'bar',
    weightGrams: 10,
    purity: '999.9 (24K)',
    refiner: 'PAMP Suisse',
    premiumPercentage: 0.08,
    priceMode: 'auto',
    customPriceOverride: 0,
    imageUrl: '/bullion/gold-bar-10g.webp',
    badge: 'LBMA Good Delivery',
    perk: 'Free Vault Storage',
    vatStatus: '0% VAT Exempt',
    popular: false,
    inStock: true,
  });

  // Fetch Bullion Items from API
  const loadBullionCatalog = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/bullion?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.goldItems)) setGoldItems(data.goldItems);
        if (Array.isArray(data.silverItems)) setSilverItems(data.silverItems);
      }
    } catch (err) {
      console.error('Failed to load bullion items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBullionCatalog();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const currentList = metalFilter === 'gold' ? goldItems : silverItems;

  const filteredItems = currentList.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchRefiner = item.refiner?.toLowerCase().includes(q);
      const matchWeight = `${item.weightGrams}g`.includes(q);
      return matchName || matchRefiner || matchWeight;
    }
    return true;
  });

  // Calculate live price for preview
  const calculatePrice = (item: Partial<BullionProduct>) => {
    if (item.priceMode === 'fixed' && item.customPriceOverride && item.customPriceOverride > 0) {
      return item.customPriceOverride;
    }
    const spot = item.metal === 'silver' ? silverGram : goldGram;
    const weight = Number(item.weightGrams) || 0;
    const premium = Number(item.premiumPercentage) || 0;
    return spot * weight * (1 + premium);
  };

  // Open modal for new item
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      metal: metalFilter,
      type: 'bar',
      weightGrams: 10,
      purity: metalFilter === 'gold' ? '999.9 (24K)' : '999 Fine Silver',
      refiner: 'PAMP Suisse',
      premiumPercentage: 0.08,
      priceMode: 'auto',
      customPriceOverride: 0,
      imageUrl: metalFilter === 'gold' ? '/bullion/gold-bar-10g.webp' : '/bullion/silver-bar-100g.webp',
      badge: 'LBMA Good Delivery',
      perk: 'Free Vault Storage',
      vatStatus: metalFilter === 'gold' ? '0% VAT Exempt' : '20% Standard VAT',
      popular: false,
      inStock: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (item: BullionProduct) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Handle Image Upload via Base64 Compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/webp', 0.85);
          setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
          showToast('Image uploaded & compressed successfully!');
        }
        setIsUploadingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const generatedId =
        editingItem?.id ||
        `${formData.metal}-${formData.type}-${String(formData.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

      const itemToSave: BullionProduct = {
        id: generatedId,
        name: formData.name.trim(),
        metal: (formData.metal as 'gold' | 'silver') || 'gold',
        type: (formData.type as 'bar' | 'coin') || 'bar',
        weightGrams: Number(formData.weightGrams) || 1,
        purity: formData.purity || (formData.metal === 'gold' ? '999.9 (24K)' : '999 Fine Silver'),
        refiner: formData.refiner || 'PAMP Suisse',
        premiumPercentage: Number(formData.premiumPercentage) ?? 0.08,
        priceMode: formData.priceMode || 'auto',
        customPriceOverride: Number(formData.customPriceOverride) || 0,
        imageUrl: formData.imageUrl || '/bullion/gold-bar-1g.webp',
        badge: formData.badge || 'LBMA Good Delivery',
        perk: formData.perk || 'Free Vault Storage',
        vatStatus: formData.vatStatus || (formData.metal === 'gold' ? '0% VAT Exempt' : '20% Standard VAT'),
        popular: !!formData.popular,
        inStock: formData.inStock !== false,
      };

      const res = await fetch('/api/bullion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(
          editingItem ? 'Bullion item updated successfully!' : 'New bullion item added live to catalog!',
          'success'
        );
        setIsModalOpen(false);
        loadBullionCatalog();
      } else {
        showToast(resData.error || 'Failed to save bullion item', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error saving item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteItem = async (item: BullionProduct) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete '${item.name}' (${item.purity})? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/bullion?id=${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`'${item.name}' deleted successfully!`, 'success');
        loadBullionCatalog();
      } else {
        showToast(data.error || 'Failed to delete item', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error deleting item', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xl transition-all ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
              : 'bg-rose-950/80 text-rose-300 border border-rose-700'
          }`}
        >
          <span>{toastMsg.text}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-xs uppercase font-bold hover:underline cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Overview Card */}
      <div className={`${cardBg} p-5 sm:p-6 rounded-xl border border-[#261c14] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8bb93] shadow-xs animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#d8bb93]">
              Bullion &amp; Investment Desk
            </span>
          </div>
          <h2 className={`font-serif text-2xl font-bold ${titleColor}`}>
            Gold Bars &amp; Bullion Products
          </h2>
          <p className="text-xs text-[#a89584] font-medium mt-1 max-w-xl">
            Add, edit, remove, and manage minted gold bars, coins, and silver items with real-time LBMA spot pricing.
          </p>
        </div>

        {/* Live Spot Quick Badges & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-[#090604] border border-[#2b1f17] rounded-xl px-4 py-2 text-xs">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#d8bb93]">Live 24K Gold</span>
              <span className="font-mono font-bold text-sm text-[#fbf8f5]">
                {formatGBP(goldGram)}/g
              </span>
            </div>
            <div className="h-6 w-[1px] bg-[#241a13]" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Live Silver</span>
              <span className="font-mono font-bold text-sm text-[#fbf8f5]">
                {formatGBP(silverGram)}/g
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className={`px-4 py-2.5 ${primaryBtn} font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95`}
          >
            <span className="text-base leading-none">+</span>
            <span>Add New Bullion Item</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className={`${cardBg} p-4 rounded-xl border border-[#261c14] space-y-3 shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Gold vs Silver Toggle */}
          <div className="inline-flex p-1 bg-[#090604] rounded-xl border border-[#2b1f17]">
            <button
              type="button"
              onClick={() => setMetalFilter('gold')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metalFilter === 'gold'
                  ? 'bg-[#d8bb93] text-[#0c0806] shadow-xs'
                  : 'text-[#a89584] hover:text-[#fbf8f5]'
              }`}
            >
              🟡 Gold Bars &amp; Coins ({goldItems.length})
            </button>
            <button
              type="button"
              onClick={() => setMetalFilter('silver')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metalFilter === 'silver'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-[#a89584] hover:text-[#fbf8f5]'
              }`}
            >
              ⚪ Silver Bullion ({silverItems.length})
            </button>
          </div>

          {/* Type Filter */}
          <div className="inline-flex p-1 bg-[#090604] rounded-xl border border-[#2b1f17]">
            {(['all', 'bar', 'coin'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#1a130e] text-[#d8bb93] border border-[#3d2e22] shadow-xs'
                    : 'text-[#a89584] hover:text-[#fbf8f5]'
                }`}
              >
                {t === 'all' ? 'All' : t === 'bar' ? 'Bars Only' : 'Coins Only'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search by name, mint, weight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs px-3.5 py-2 pl-9 rounded-xl border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
            />
            <svg
              className="w-4 h-4 text-[#8c7b6d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>

        </div>
      </div>

      {/* Items Table / Cards */}
      <div className={`${cardBg} rounded-xl border border-[#261c14] overflow-hidden shadow-xl`}>
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#a89584]">
            Loading bullion items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-bold text-[#fbf8f5]">No bullion products found</p>
            <p className="text-xs text-[#a89584] mt-1">
              Try adjusting your search or click &quot;Add New Bullion Item&quot; to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] font-medium text-[#fbf8f5] border-collapse">
              <thead>
                <tr className="border-b border-[#241a13] bg-[#0c0806] text-[#d8bb93] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Refiner / Mint</th>
                  <th className="py-3 px-4">Weight &amp; Purity</th>
                  <th className="py-3 px-4">Pricing Mode</th>
                  <th className="py-3 px-4">Live Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#241a13]">
                {filteredItems.map((item) => {
                  const estPrice = calculatePrice(item);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#1a130e]/80 transition-colors"
                    >
                      {/* Product thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#090604] border border-[#261c14] flex items-center justify-center overflow-hidden shrink-0 p-1">
                            <Image
                              src={item.imageUrl || '/bullion/gold-bar-1g.webp'}
                              alt={item.name}
                              width={44}
                              height={44}
                              className="object-contain max-h-10"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#fbf8f5] block text-[13px]">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-[#a89584] font-semibold font-mono">ID: {item.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Refiner / Mint */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#fbf8f5]">
                          {item.refiner || 'PAMP Suisse'}
                        </span>
                        <span className="block text-[10px] text-[#a89584] capitalize">{item.type}</span>
                      </td>

                      {/* Weight & Purity */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#fbf8f5] block">
                          {item.weightGrams}g
                        </span>
                        <span className="text-[10px] text-[#d8bb93] font-bold">
                          {item.purity}
                        </span>
                      </td>

                      {/* Pricing Mode */}
                      <td className="py-3 px-4">
                        {item.priceMode === 'fixed' ? (
                          <span className="bg-purple-950/70 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-800">
                            Fixed Override
                          </span>
                        ) : (
                          <span className="bg-amber-950/70 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-800">
                            Spot + {Math.round(item.premiumPercentage * 100)}%
                          </span>
                        )}
                      </td>

                      {/* Live Calculated Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-sm text-[#fbf8f5] font-mono">
                          {formatGBP(estPrice)}
                        </span>
                        <span className="block text-[10px] text-[#a89584]">{item.vatStatus || '0% VAT'}</span>
                      </td>

                      {/* Badges / Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {item.inStock !== false ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/70 px-2 py-0.5 rounded border border-rose-800">
                              Out of Stock
                            </span>
                          )}
                          {item.popular && (
                            <span className="text-[9px] font-bold text-[#d8bb93] bg-[#1a130e] border border-[#3d2e22] px-1.5 py-0.2 rounded">
                              ⭐ Popular
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="px-2.5 py-1 rounded-lg border border-[#2b1f17] bg-[#140e0a] hover:bg-[#1f1711] text-[#d8bb93] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item)}
                            className="px-2.5 py-1 rounded-lg border border-[#2b1f17] hover:border-rose-800 bg-[#140e0a] hover:bg-rose-950/60 text-[#8c7b6d] hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#120d09] border border-[#261c14] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#241a13] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#d8bb93]">
                  Bullion Catalog Studio
                </span>
                <h3 className="font-serif text-lg font-bold text-[#fbf8f5]">
                  {editingItem ? `Edit: ${editingItem.name}` : 'Add New Bullion Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1a130e] border border-[#2b1f17] text-[#a89584] hover:text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93] mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Gram Minted Gold Bar or 1oz Britannia Gold Coin"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
                />
              </div>

              {/* Metal & Product Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93] mb-1.5">
                    Precious Metal *
                  </label>
                  <select
                    value={formData.metal}
                    onChange={(e) => {
                      const m = e.target.value as 'gold' | 'silver';
                      setFormData({
                        ...formData,
                        metal: m,
                        purity: m === 'gold' ? '999.9 (24K)' : '999 Fine Silver',
                        vatStatus: m === 'gold' ? '0% VAT Exempt' : '20% Standard VAT',
                      });
                    }}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
                  >
                    <option value="gold" className="bg-[#120d09] text-white">Gold</option>
                    <option value="silver" className="bg-[#120d09] text-white">Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93] mb-1.5">
                    Product Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bar' | 'coin' })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
                  >
                    <option value="bar" className="bg-[#120d09] text-white">Minted Bar</option>
                    <option value="coin" className="bg-[#120d09] text-white">Bullion Coin</option>
                  </select>
                </div>
              </div>

              {/* Weight & Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93] mb-1.5">
                  Weight in Grams *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formData.weightGrams || ''}
                    onChange={(e) => setFormData({ ...formData, weightGrams: parseFloat(e.target.value) || 0 })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
                  />
                  <span className="text-xs font-bold text-[#d8bb93]">grams</span>
                </div>
                {/* Quick weight preset chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[1, 2.5, 5, 10, 20, 31.1035, 50, 100, 250, 500, 1000].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFormData({ ...formData, weightGrams: w })}
                      className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-[#140e0a] border border-[#2b1f17] hover:border-[#d8bb93] text-[#a89584] hover:text-[#fbf8f5] transition-colors cursor-pointer"
                    >
                      {w === 31.1035 ? '1 oz (31.1g)' : `${w}g`}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weightGrams: 11.664 })}
                    className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-[#140e0a] border border-[#2b1f17] hover:border-[#d8bb93] text-[#a89584] hover:text-[#fbf8f5] transition-colors cursor-pointer"
                  >
                    1 Tola (11.66g)
                  </button>
                </div>
              </div>

              {/* Refiner & Purity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93] mb-1.5">
                    Refiner / Mint *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PAMP Suisse, Royal Mint, Valcambi"
                    value={formData.refiner || ''}
                    onChange={(e) => setFormData({ ...formData, refiner: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93] mb-1.5">
                    Purity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 999.9 (24K) or 916.7 (22K)"
                    value={formData.purity || ''}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    className={`w-full text-[14.5px] px-4 py-2.5 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] focus:outline-none focus:border-[#d8bb93] ${inputBg}`}
                  />
                </div>
              </div>

              {/* Pricing Mode & Markup */}
              <div className="p-4 rounded-xl bg-[#090604] border border-[#241a13] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#fbf8f5]">
                    Pricing Mode
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#fbf8f5] cursor-pointer">
                      <input
                        type="radio"
                        name="priceMode"
                        checked={formData.priceMode === 'auto'}
                        onChange={() => setFormData({ ...formData, priceMode: 'auto' })}
                      />
                      <span>Live Spot Auto</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#fbf8f5] cursor-pointer">
                      <input
                        type="radio"
                        name="priceMode"
                        checked={formData.priceMode === 'fixed'}
                        onChange={() => setFormData({ ...formData, priceMode: 'fixed' })}
                      />
                      <span>Fixed Price (£)</span>
                    </label>
                  </div>
                </div>

                {formData.priceMode === 'auto' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-[#a89584] mb-1.5">
                      Premium Markup % (e.g. 0.08 for 8% above spot)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.premiumPercentage ?? 0.08}
                      onChange={(e) => setFormData({ ...formData, premiumPercentage: parseFloat(e.target.value) || 0 })}
                      className={`w-full text-[14px] px-3.5 py-2 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] ${inputBg}`}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-[#a89584] mb-1.5">
                      Fixed Price Override (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 98.50"
                      value={formData.customPriceOverride || ''}
                      onChange={(e) => setFormData({ ...formData, customPriceOverride: parseFloat(e.target.value) || 0 })}
                      className={`w-full text-[14px] px-3.5 py-2 font-bold text-[#fbf8f5] rounded-lg border border-[#2b1f17] ${inputBg}`}
                    />
                  </div>
                )}

                {/* Live Preview Box */}
                <div className="p-3 rounded-lg bg-[#1a130e] border border-[#3d2e22] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#a89584]">
                    Live Estimated Catalog Price:
                  </span>
                  <span className="font-extrabold text-sm text-[#d8bb93] font-mono">
                    {formatGBP(calculatePrice(formData))}
                  </span>
                </div>
              </div>

              {/* Image Section: Device Upload or Custom URL */}
              <div className="p-4 rounded-xl bg-[#090604] border border-[#241a13] space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d8bb93]">
                  Product Image *
                </label>

                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div className="w-20 h-20 rounded-xl bg-[#120d09] border border-[#261c14] flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        width={70}
                        height={70}
                        className="object-contain max-h-16"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[10px] text-[#8c7b6d]">No Image</span>
                    )}
                  </div>

                  {/* Upload button & URL input */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-lg bg-[#140e0a] hover:bg-[#1f1711] border border-[#2b1f17] text-[#d8bb93] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isUploadingImage ? 'Uploading...' : '📁 Upload Photo from Device'}
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Or enter image URL (/bullion/gold-bar-1g.webp)"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className={`w-full text-xs px-3.5 py-2 rounded-lg border border-[#2b1f17] ${inputBg}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Preset Images */}
                <div>
                  <span className="block text-[10px] font-bold text-[#a89584] uppercase tracking-wider mb-1.5">
                    Or select from bullion presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '1g Bar', url: '/bullion/gold-bar-1g.webp' },
                      { label: '2.5g Bar', url: '/bullion/gold-bar-2.5g.webp' },
                      { label: '5g Bar', url: '/bullion/gold-bar-5g.webp' },
                      { label: '10g Bar', url: '/bullion/gold-bar-10g.webp' },
                      { label: '20g Bar', url: '/bullion/gold-bar-20g.webp' },
                      { label: '1oz Bar', url: '/bullion/gold-bar-1oz.webp' },
                      { label: '50g Bar', url: '/bullion/gold-bar-50g.webp' },
                      { label: '100g Bar', url: '/bullion/gold-bar-100g.webp' },
                      { label: '1kg Bar', url: '/bullion/gold-bar-1kg.webp' },
                      { label: 'Britannia Coin', url: '/bullion/gold-coin-britannia.webp' },
                      { label: 'Sovereign Coin', url: '/bullion/gold-coin-soovereign.webp' },
                      { label: 'Silver 100g', url: '/bullion/silver-bar-100g.webp' },
                      { label: 'Silver 1kg', url: '/bullion/silver-bar-1kg.webp' },
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          formData.imageUrl === preset.url
                            ? 'bg-[#d8bb93] text-[#0c0806] border-[#d8bb93]'
                            : 'bg-[#140e0a] border-[#2b1f17] text-[#a89584] hover:border-[#d8bb93] hover:text-[#fbf8f5]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles (Popular & In Stock) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#241a13] bg-[#090604] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#fbf8f5] block">Popular Badge</span>
                    <span className="text-[10px] text-[#a89584]">Featured with gold badge</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#241a13] bg-[#090604] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock !== false}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#fbf8f5] block">In Stock</span>
                    <span className="text-[10px] text-[#a89584]">Available for live purchase</span>
                  </div>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#241a13]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#140e0a] border border-[#2b1f17] text-[#a89584] hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 ${primaryBtn} text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50`}
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Bullion Item'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}