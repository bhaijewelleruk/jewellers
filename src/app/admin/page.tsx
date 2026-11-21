'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop, ProductItem, CategoryItem } from '@/context/ShopContext';
import { ProductEditModal } from '@/components/shared/ProductEditModal';

import {
  AdminTab,
  OrderItem,
  EnquiryItem,
  RegisteredUserItem,
  LoginAttemptItem,
  AuditLogItem,
  AdminThemeStyles,
} from '@/components/admin/types';

import {
  DashboardIcon,
  ProductsIcon,
  AddProductIcon,
  CategoriesIcon,
  SlidesIcon,
  OrdersIcon,
  EnquiriesIcon,
  UsersIcon,
  GoldRatesIcon,
  SettingsIcon,
  XIcon,
  ExternalLinkIcon,
  MoonIcon,
  SunIcon,
} from '@/components/admin/AdminIcons';

import AdminSidebar from '@/components/admin/AdminSidebar';
import InvoiceModal from '@/components/admin/InvoiceModal';

// Modularized Tabs
import DashboardTab from '@/components/admin/tabs/DashboardTab';
import ProductsTab from '@/components/admin/tabs/ProductsTab';
import AddProductTab, { AddProductFormState } from '@/components/admin/tabs/AddProductTab';
import CategoriesTab from '@/components/admin/tabs/CategoriesTab';
import SlidesTab, { HeroFormState, AdminSlide } from '@/components/admin/tabs/SlidesTab';
import OrdersTab from '@/components/admin/tabs/OrdersTab';
import EnquiriesTab, { AdminEnquiry } from '@/components/admin/tabs/EnquiriesTab';
import CustomersTab from '@/components/admin/tabs/CustomersTab';
import SettingsTab, { AnnouncementFormState } from '@/components/admin/tabs/SettingsTab';
import BullionTab from '@/components/admin/tabs/BullionTab';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Real-time Shop Context
  const {
    products,
    addProduct,
    updateProduct,
    updateProductPrice,
    deleteProduct: removeStoreProduct,
    updateProductStock,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useShop();

  // Theme State: Permanently Locked to Luxury Dark Obsidian Gold Terminal
  const theme = 'dark';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Admin Panel 80% zoom & viewport coverage with permanent Luxury Dark theme
  useEffect(() => {
    const originalZoom = (document.body.style as any).zoom;
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyHeight = document.body.style.height;
    const originalBodyMinHeight = document.body.style.minHeight;

    (document.body.style as any).zoom = '80%';
    document.body.style.minHeight = '125vh';
    document.body.style.height = '125vh';
    document.body.style.backgroundColor = '#090705';
    document.documentElement.style.backgroundColor = '#090705';

    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.remove('light');

    return () => {
      (document.body.style as any).zoom = originalZoom || '';
      document.body.style.minHeight = originalBodyMinHeight || '';
      document.body.style.height = originalBodyHeight || '';
      document.body.style.backgroundColor = originalBodyBg || '';
      document.documentElement.style.backgroundColor = originalHtmlBg || '';
    };
  }, []);



  // Edit Product Modal State
  const [editingAdminProduct, setEditingAdminProduct] = useState<ProductItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productErrorMsg, setProductErrorMsg] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/images/category-rings.jpg',
    display_order: 1,
  });
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catSaveSuccess, setCatSaveSuccess] = useState('');
  const [catError, setCatError] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  // Sidebar / Drawer
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Store data states
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [slides, setSlides] = useState<AdminSlide[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserItem[]>([]);
  const [loginAttemptsLogs, setLoginAttemptsLogs] = useState<LoginAttemptItem[]>([]);
  const [userActionMsg, setUserActionMsg] = useState('');
  const [userLoadingId, setUserLoadingId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  // Invoice State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderItem | null>(null);

  // Audit Logs State (Live real-time operational logs)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Auth Verification
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role === 'admin') {
          setIsAdminAuthorized(true);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, [router]);

  // Real-Time Audit Logger
  const addAuditLog = (
    category: 'AUTH' | 'SECURITY' | 'ORDER' | 'INVENTORY' | 'SYSTEM',
    action: string,
    details: string,
    severity: 'INFO' | 'WARNING' | 'ALERT'
  ) => {
    const newLog: AuditLogItem = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category,
      action,
      details,
      severity,
      ip: '82.132.241.18 (Bradford Session)',
      actor: 'admin@bhaijeweller.co.uk',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Export Inventory CSV
  const handleExportInventoryCSV = () => {
    if (products.length === 0) {
      alert('Product catalog is currently empty. Nothing to export.');
      return;
    }
    const headers = ['Product ID', 'Name', 'SKU', 'Category', 'Metal Specification', 'Price (GBP)', 'Stock Units', 'Status'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku || 'N/A'}"`,
      `"${p.category}"`,
      `"${p.metal || 'N/A'}"`,
      `"£${p.price}"`,
      p.stock,
      `"${p.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bhai_jeweller_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addAuditLog('INVENTORY', 'INVENTORY_EXPORTED', `Exported inventory catalog (${products.length} products) to CSV`, 'INFO');
  };

  // Export Audit CSV
  const handleExportAuditCSV = () => {
    if (auditLogs.length === 0) {
      alert('Audit trail is empty.');
      return;
    }
    const headers = ['Log ID', 'Timestamp (UTC)', 'Category', 'Action', 'Details', 'Severity', 'IP Address', 'Actor'];
    const rows = auditLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.severity}"`,
      `"${l.ip}"`,
      `"${l.actor}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bhai_jeweller_security_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Quick Restock Handler
  const handleQuickRestock = (productId: string, productName: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateProductStock(productId, newStock);
    addAuditLog(
      'INVENTORY',
      'STOCK_REPLENISHED',
      `Product "${productName}" stock updated from ${currentStock} to ${newStock} (${delta >= 0 ? '+' : ''}${delta})`,
      'INFO'
    );
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    router.push('/admin/login');
  };

  const handleUpdateUserStatus = async (userId: string, email: string, newStatus: string, actionName: string) => {
    try {
      setUserLoadingId(userId);
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, status: newStatus, action: actionName }),
      });
      const data = await res.json();
      if (data.success) {
        setRegisteredUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status: newStatus as 'active' | 'inactive' | 'banned' | 'locked',
                  isBanned: newStatus === 'banned',
                  isLocked: actionName === 'unlock' || newStatus === 'active' ? false : u.isLocked,
                  failedAttempts: actionName === 'unlock' || newStatus === 'active' ? 0 : u.failedAttempts,
                }
              : u
          )
        );
        setUserActionMsg(`User "${email}" successfully marked as ${newStatus.toUpperCase()}`);
        addAuditLog(
          'AUTH',
          'USER_STATUS_UPDATED',
          `User "${email}" status updated to ${newStatus.toUpperCase()} (${actionName})`,
          newStatus === 'banned' ? 'WARNING' : 'INFO'
        );
        setTimeout(() => setUserActionMsg(''), 3500);
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    } finally {
      setUserLoadingId(null);
    }
  };

  // Hero Section Form State
  const [heroForm, setHeroForm] = useState<HeroFormState>({
    brandPretitle: 'BHAI JEWELLER',
    headlineLine1: 'Jewellery, made',
    headlineLine2: 'unforgettable',
    headlineLine3: '',
    subtitle: 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.',
    buttonText: 'Shop Collection',
    buttonLink: '/shop',
    backgroundImage: '/images/hero-ring.jpg',
    featuredTitle: 'Diamond Elegance',
    featuredSubtitle: 'Classic pieces, endless beauty.',
    featuredImage: '/images/featured-ring.jpg',
  });
  const [heroSaveMsg, setHeroSaveMsg] = useState(false);

  // Announcement Bar Form State
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementFormState>({
    isEnabled: true,
    message1: 'Free worldwide shipping on all orders over £150  |  Handcrafted with passion in the UK',
    message2: 'Complimentary luxury gift packaging on every order  |  Bespoke service',
    message3: 'Fine jewellery showroom in Bradford, West Yorkshire  |  Private viewings available',
  });
  const [announcementSaveMsg, setAnnouncementSaveMsg] = useState(false);

  // Load real-time data once authorized & setup automatic live synchronization
  useEffect(() => {
    if (!isAdminAuthorized) return;

    const fetchLiveStoreData = () => {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setOrders(data.data);
          }
        })
        .catch((err) => console.error('Error loading orders:', err));

      fetch('/api/enquiries')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setEnquiries(data.data);
          }
        })
        .catch((err) => console.error('Error loading enquiries:', err));

      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (Array.isArray(data.users)) setRegisteredUsers(data.users);
            const logs = data.loginAttempts || data.attempts;
            if (Array.isArray(logs)) setLoginAttemptsLogs(logs);
          }
        })
        .catch((err) => console.error('Error loading users:', err));
    };

    // Immediate fetch
    fetchLiveStoreData();

    // One-off UI config fetches
    fetch('/api/slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSlides(data.data);
        }
      })
      .catch((err) => console.error('Error loading slides:', err));

    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setHeroForm((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => console.error('Error loading hero config:', err));

    fetch('/api/announcement')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnnouncementForm({
            isEnabled: data.data.isEnabled ?? true,
            message1: data.data.messages?.[0] || '',
            message2: data.data.messages?.[1] || '',
            message3: data.data.messages?.[2] || '',
          });
        }
      })
      .catch((err) => console.error('Error loading announcement config:', err));

    // Live real-time polling every 10 seconds for user accounts, orders, and inquiries
    const syncInterval = setInterval(fetchLiveStoreData, 10000);
    return () => clearInterval(syncInterval);
  }, [isAdminAuthorized]);

  // Add Product Form State
  const [addForm, setAddForm] = useState<AddProductFormState>({
    name: '',
    category: 'Rings',
    price: '',
    originalPrice: '',
    stock: '10',
    metal: '18k Yellow Gold',
    sku: '',
    weightGrams: '6.5',
    size: '7',
    sizesText: '5, 6, 7, 8, 9',
    description: '',
    primaryImage: '',
    additionalImages: [],
    newImageUrlInput: '',
    seoTitle: '',
    seoDescription: '',
    slug: '',
    focusKeywordsText: '',
  });

  // Client-Side Image Compressor
  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof window === 'undefined') {
          resolve('');
          return;
        }
        const img = new window.Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const compressedUrl = await compressImageFile(file);
      if (!compressedUrl) continue;

      setAddForm((prev) => {
        if (!prev.primaryImage) {
          return { ...prev, primaryImage: compressedUrl };
        }
        if (prev.primaryImage === compressedUrl || prev.additionalImages.includes(compressedUrl)) {
          return prev;
        }
        return { ...prev, additionalImages: [...prev.additionalImages, compressedUrl] };
      });
    }
  };

  const handleStartEditProduct = (p: ProductItem) => {
    setEditingProduct(p);

    const rawImagesList = [
      p.image,
      ...(Array.isArray(p.images) ? p.images : []),
    ].filter(Boolean).map((img) => String(img).trim());
    const uniqueImagesList = Array.from(new Set(rawImagesList));
    const primaryImg = uniqueImagesList[0] || '';
    const additionalImgs = uniqueImagesList.slice(1);

    const defaultSize = p.size || (p.sizes && p.sizes[0]) || '7';
    const defaultSizesText =
      Array.isArray(p.sizes) && p.sizes.length > 0
        ? p.sizes.join(', ')
        : p.size || '5, 6, 7, 8, 9';

    setAddForm({
      name: p.name,
      category: p.category || 'Rings',
      price: String(p.price),
      originalPrice: String(p.originalPrice || p.price),
      stock: String(p.stock ?? 10),
      metal: p.metal || '18k Yellow Gold',
      sku: p.sku || '',
      weightGrams: p.weightGrams ? String(p.weightGrams) : p.weight ? p.weight.replace(/g$/i, '').trim() : '0.6',
      size: defaultSize,
      sizesText: defaultSizesText,
      description: p.description || '',
      primaryImage: primaryImg,
      additionalImages: additionalImgs,
      newImageUrlInput: '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      slug: p.slug || '',
      focusKeywordsText: Array.isArray(p.focusKeywords) ? p.focusKeywords.join(', ') : '',
    });
    setProductErrorMsg('');
    setActiveTab('add-product');
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductErrorMsg('');
    setAddForm({
      name: '',
      category: 'Rings',
      price: '',
      originalPrice: '',
      stock: '10',
      metal: '18k Yellow Gold',
      sku: '',
      weightGrams: '6.5',
      size: '7',
      sizesText: '5, 6, 7, 8, 9',
      description: '',
      primaryImage: '',
      additionalImages: [],
      newImageUrlInput: '',
      seoTitle: '',
      seoDescription: '',
      slug: '',
      focusKeywordsText: '',
    });
    setActiveTab('add-product');
  };

  const generateAutoSku = () => {
    const catCode = addForm.category.substring(0, 3).toUpperCase();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setAddForm((prev) => ({ ...prev, sku: `BJ-${catCode}-${randNum}` }));
  };

  const generateAutoSeo = () => {
    const title = addForm.name.trim() || 'Luxury Jewelry Piece';
    const metal = addForm.metal || 'Gold';
    const cat = addForm.category || 'Jewelry';
    const slugified = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const generatedSeoTitle = `${title} | ${metal} ${cat} | Bhai Jeweller`;
    const generatedMetaDesc = `Shop ${title} handcrafted in ${metal}. Authentic fine ${cat.toLowerCase()} with certified purity and artisan heritage craftsmanship. Free insured shipping.`;
    const generatedKeywords = [
      title.toLowerCase(),
      `${metal.toLowerCase()} ${cat.toLowerCase()}`,
      `bhai jeweller ${cat.toLowerCase()}`,
      `fine jewelry ${cat.toLowerCase()}`,
      `handmade gold ${cat.toLowerCase()}`,
    ].join(', ');

    setAddForm((prev) => ({
      ...prev,
      slug: slugified || 'luxury-product',
      seoTitle: generatedSeoTitle,
      seoDescription: generatedMetaDesc,
      focusKeywordsText: generatedKeywords,
    }));
  };

  const handleAddImageUrl = () => {
    const url = addForm.newImageUrlInput.trim();
    if (!url) return;
    setAddForm((prev) => {
      if (!prev.primaryImage) {
        return { ...prev, primaryImage: url, newImageUrlInput: '' };
      }
      if (prev.primaryImage === url || prev.additionalImages.includes(url)) {
        return { ...prev, newImageUrlInput: '' };
      }
      return {
        ...prev,
        additionalImages: [...prev.additionalImages, url],
        newImageUrlInput: '',
      };
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAddForm((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleFullProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      alert('Please enter a product name.');
      return;
    }
    if (addForm.price === '' || isNaN(Number(addForm.price))) {
      alert('Please enter a valid product price.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductErrorMsg('');

    try {
      const trimmedName = addForm.name.trim();
      const existingProduct =
        editingProduct ||
        products.find((p) => p.name.trim().toLowerCase() === trimmedName.toLowerCase());

      const parsedSizes = addForm.sizesText
        ? addForm.sizesText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const primarySize = addForm.size.trim() || parsedSizes[0] || 'Standard';

      const rawImgs = [addForm.primaryImage, ...addForm.additionalImages]
        .filter(Boolean)
        .map((s) => String(s).trim());
      const allImagesList = Array.from(new Set(rawImgs));
      const finalPrimary = allImagesList[0] || '/images/detail-ring-hero.jpg';
      const finalImages = allImagesList.length > 0 ? allImagesList : [finalPrimary];

      const generatedSlug =
        existingProduct?.slug ||
        addForm.slug ||
        trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const autoSku =
        existingProduct?.sku ||
        addForm.sku ||
        `BJ-${addForm.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const resolvedId = existingProduct?.id || `prod-${Date.now()}`;

      const newProductObject: ProductItem = {
        id: resolvedId,
        name: trimmedName,
        category: addForm.category,
        price: Number(addForm.price),
        originalPrice: Number(addForm.originalPrice || addForm.price),
        stock: Number(addForm.stock || 0),
        metal: addForm.metal,
        status:
          Number(addForm.stock) > 0
            ? Number(addForm.stock) <= 5
              ? 'Low Stock'
              : 'In Stock'
            : 'Out of Stock',
        isFeatured: true,
        image: finalPrimary,
        images: finalImages,
        sku: autoSku,
        description:
          addForm.description ||
          `Exquisite handcrafted ${addForm.metal} ${addForm.category.toLowerCase()} designed by master artisans.`,
        slug: generatedSlug,
        weightGrams: parseFloat(String(addForm.weightGrams || '0.6').replace(/[^\d.]/g, '')) || 0.6,
        weight: `${parseFloat(String(addForm.weightGrams || '0.6').replace(/[^\d.]/g, '')) || 0.6}g`,
        size: primarySize,
        sizes: parsedSizes.length > 0 ? parsedSizes : [primarySize],
        seoTitle: addForm.seoTitle || `${trimmedName} | Bhai Jeweller`,
        seoDescription:
          addForm.seoDescription || `Buy ${trimmedName} online in Pakistan & UK. Handcrafted luxury jewelry.`,
        focusKeywords: addForm.focusKeywordsText
          ? addForm.focusKeywordsText.split(',').map((s) => s.trim())
          : [trimmedName.toLowerCase()],
      };

      if (existingProduct) {
        await updateProduct(newProductObject);
      } else {
        await addProduct(newProductObject);
      }

      setSaveSuccessMsg(true);
      setEditingProduct(null);

      setAddForm({
        name: '',
        category: 'Rings',
        price: '',
        originalPrice: '',
        stock: '10',
        metal: '18k Yellow Gold',
        sku: '',
        weightGrams: '6.5',
        size: '7',
        sizesText: '5, 6, 7, 8, 9',
        description: '',
        primaryImage: '',
        additionalImages: [],
        newImageUrlInput: '',
        seoTitle: '',
        seoDescription: '',
        slug: '',
        focusKeywordsText: '',
      });

      setTimeout(() => {
        setSaveSuccessMsg(false);
        setActiveTab('products');
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product to database.';
      setProductErrorMsg(msg);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Category Submit
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCatError('Category name is required.');
      return;
    }
    setCatSaving(true);
    setCatError('');
    setCatSaveSuccess('');

    try {
      const slug = (
        categoryForm.slug ||
        categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      ).trim();

      if (editingCategory) {
        const ok = await updateCategory({
          id: editingCategory.id,
          name: categoryForm.name.trim(),
          slug,
          description: categoryForm.description,
          image: categoryForm.image,
          display_order: Number(categoryForm.display_order) || 1,
          is_active: true,
        });

        if (ok) {
          setCatSaveSuccess(`Category "${categoryForm.name}" updated live!`);
          setEditingCategory(null);
          setCategoryForm({
            name: '',
            slug: '',
            description: '',
            image: '/images/category-rings.jpg',
            display_order: categories.length + 1,
          });
        } else {
          setCatError('Failed to update category.');
        }
      } else {
        const ok = await addCategory({
          id: `cat-${slug || Date.now()}`,
          name: categoryForm.name.trim(),
          slug,
          description: categoryForm.description,
          image: categoryForm.image,
          display_order: Number(categoryForm.display_order) || categories.length + 1,
          is_active: true,
        });

        if (ok) {
          setCatSaveSuccess(`Category "${categoryForm.name}" added and synced live!`);
          setCategoryForm({
            name: '',
            slug: '',
            description: '',
            image: '/images/category-rings.jpg',
            display_order: categories.length + 2,
          });
        } else {
          setCatError('Failed to save category.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error occurred while saving category.';
      setCatError(msg);
    } finally {
      setCatSaving(false);
      setTimeout(() => setCatSaveSuccess(''), 3500);
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    const productCount = products.filter(
      (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
    ).length;

    const warningMsg =
      productCount > 0
        ? `Notice: ${productCount} active catalog items belong to "${cat.name}".\nAre you sure you want to delete this category from the database?`
        : `Are you sure you want to delete "${cat.name}"?\nThis removes it from the live store and database.`;

    if (!window.confirm(warningMsg)) return;

    const ok = await deleteCategory(cat.id);
    if (ok) {
      setCatSaveSuccess(`Category "${cat.name}" deleted.`);
      setTimeout(() => setCatSaveSuccess(''), 3000);
    }
  };

  // Slide Modal State
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    ctaText: 'Discover Now',
    ctaLink: '/shop',
    image: '/images/hero-slider-1.jpg',
    status: 'Active' as const,
    order: slides.length + 1,
  });

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title) return;
    const addedSlide: AdminSlide = {
      id: `slide-${Date.now()}`,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      ctaText: newSlide.ctaText,
      ctaLink: newSlide.ctaLink,
      image: newSlide.image,
      status: newSlide.status,
      order: Number(newSlide.order) || slides.length + 1,
    };
    setSlides([...slides, addedSlide]);
    setIsAddSlideOpen(false);
    fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addedSlide),
    }).catch((err) => console.error('Slide API Sync error:', err));
    setNewSlide({
      title: '',
      subtitle: '',
      ctaText: 'Discover Now',
      ctaLink: '/shop',
      image: '/images/hero-slider-1.jpg',
      status: 'Active',
      order: slides.length + 2,
    });
  };

  const toggleSlideStatus = (id: string) => {
    setSlides(
      slides.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    );
    fetch('/api/slides', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch((err) => console.error('Slide toggle error:', err));
  };

  const handleDeleteSlide = (id: string) => {
    setSlides(slides.filter((s) => s.id !== id));
    fetch(`/api/slides?id=${id}`, { method: 'DELETE' }).catch((err) =>
      console.error('Slide delete error:', err)
    );
  };

  const handleHeroImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'backgroundImage' | 'featuredImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        setHeroForm((prev) => ({ ...prev, [targetField]: resultUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroForm),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHeroSaveMsg(true);
          setTimeout(() => setHeroSaveMsg(false), 3000);
        }
      })
      .catch((err) => console.error('Error saving hero section:', err));
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messages = [announcementForm.message1, announcementForm.message2, announcementForm.message3].filter(
      Boolean
    );
    fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isEnabled: announcementForm.isEnabled,
        messages,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnnouncementSaveMsg(true);
          setTimeout(() => setAnnouncementSaveMsg(false), 3000);
        }
      })
      .catch((err) => console.error('Error saving announcement bar:', err));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Processing' | 'Shipped' | 'Delivered') => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    addAuditLog('ORDER', 'ORDER_STATUS_CHANGED', `Order ${orderId} status advanced to ${newStatus}`, 'INFO');
    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    }).catch((err) => console.error('Order status update error:', err));
  };

  const handleUpdateEnquiryStatus = (enqId: string, newStatus: string) => {
    setEnquiries(enquiries.map((e) => (e.id === enqId ? { ...e, status: newStatus as EnquiryItem['status'] } : e)));
    fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: enqId, status: newStatus }),
    }).catch((err) => console.error('Enquiry status update error:', err));
  };

  // Gold rates & store settings
  const [liveBullionRates, setLiveBullionRates] = useState({ gold: 87.9, silver: 1.04 });

  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.goldGbpPerGram) {
          setLiveBullionRates({ gold: d.goldGbpPerGram, silver: d.silverGbpPerGram || 1.04 });
        }
      })
      .catch(() => {});
  }, []);
  const [shippingThreshold, setShippingThreshold] = useState('500');

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'New' || e.status === 'Pending').length;

  // Navigation Items
  const NAV_ITEMS = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon className="w-4 h-4" />,
      count: null,
    },
    {
      id: 'products',
      label: 'Products',
      icon: <ProductsIcon className="w-4 h-4" />,
      count: products.length,
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: <AddProductIcon className="w-4 h-4" />,
      count: null,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <CategoriesIcon className="w-4 h-4" />,
      count: categories.length,
    },
    {
      id: 'slides',
      label: 'Slider & Banners',
      icon: <SlidesIcon className="w-4 h-4" />,
      count: slides.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <OrdersIcon className="w-4 h-4" />,
      count: activeOrdersCount,
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <EnquiriesIcon className="w-4 h-4" />,
      count: pendingEnquiriesCount,
    },
    {
      id: 'customers',
      label: 'Users',
      icon: <UsersIcon className="w-4 h-4" />,
      count: registeredUsers.length,
    },
    {
      id: 'bullion',
      label: 'Gold Bars & Bullion',
      icon: <GoldRatesIcon className="w-4 h-4" />,
      count: null,
    },

    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon className="w-4 h-4" />,
      count: null,
    },
  ];

  // Theme styles helper: Locked permanently to bespoke Luxury Dark Obsidian Gold
  const isLight = false;
  const themeStyles: AdminThemeStyles = {
    isLight: false,
    containerBg: 'bg-[#080503] text-[#fbf8f5]',
    sidebarBg: 'bg-[#0c0806] border-r border-[#241a13] text-[#fbf8f5]',
    sidebarHeaderBorder: 'border-b border-[#241a13]',
    sidebarFooterBg: 'bg-[#090604] border-t border-[#241a13] text-[#fbf8f5]',
    cardBg: 'bg-[#120d09] border border-[#261c14] hover:border-[#8b6914]/50 shadow-xl text-[#fbf8f5]',
    cardHeaderBorder: 'border-b border-[#261c14]',
    inputBg: 'bg-[#090604] border border-[#2b1f17] text-[#fbf8f5] font-semibold text-[14.5px] placeholder:text-[#6e5d4f] focus:border-[#d8bb93] focus:ring-1 focus:ring-[#d8bb93]/30',
    tableHeaderBg: 'bg-[#0c0806] border-b border-[#261c14] text-[#d8bb93] font-bold text-[12.5px] uppercase tracking-wider',
    tableRowHover: 'hover:bg-[#1a130e] divide-[#1f1711] text-[#f5efe8]',
    titleColor: 'text-[#fbf8f5] font-bold',
    accentGold: 'text-[#d8bb93] font-bold',
    subtitleColor: 'text-[#c2b2a3] font-semibold text-[13.5px]',
    badgeBg: 'bg-[#1a130e] text-[#d8bb93] border border-[#3d2e22] font-bold',
    primaryBtn: 'bg-gradient-to-r from-[#d8bb93] via-[#e5cfb3] to-[#c5a059] hover:brightness-110 text-[#0c0806] font-bold shadow-md active:scale-95 transition-all',
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#080503] flex flex-col items-center justify-center text-[#fbf8f5]">
        <div className="w-12 h-12 rounded-full border-2 border-[#d8bb93] border-t-transparent animate-spin mb-4" />
        <p className="font-serif text-sm tracking-[0.25em] uppercase text-[#d8bb93] font-semibold">
          Verifying Bradford Atelier Terminal...
        </p>
      </div>
    );
  }

  if (!isAdminAuthorized) {
    return null;
  }

  return (
    <div
      suppressHydrationWarning
      style={{ minHeight: '125vh', height: '125vh' }}
      className={`w-full overflow-hidden ${themeStyles.containerBg} flex flex-col md:flex-row font-sans selection:bg-[#d8bb93]/30 selection:text-white transition-colors duration-200 text-[15px]`}
    >
      {/* MOBILE HEADER BAR */}
      <header className={`md:hidden flex items-center justify-between px-4 py-3 ${themeStyles.sidebarBg} border-b border-[#241a13] sticky top-0 z-40 bg-[#0c0806]`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 text-[#d8bb93] hover:bg-[#18110b] rounded-lg transition-colors cursor-pointer"
            aria-label="Open Admin Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-bold text-[#fbf8f5] tracking-wider">BHAI JEWELLER</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg text-[#d8bb93] border border-[#2b1f17] hover:bg-[#18110b]"
            title="View Storefront"
          >
            <ExternalLinkIcon className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* SIDEBAR */}
      <AdminSidebar
        themeStyles={themeStyles}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'add-product') {
            handleOpenAddProduct();
          } else {
            setActiveTab(tab);
          }
        }}
        navItems={NAV_ITEMS}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileDrawerOpen={mobileDrawerOpen}
        setMobileDrawerOpen={setMobileDrawerOpen}
        onLogout={handleAdminLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#080503]">
        {/* TOP BAR DESKTOP */}
        <div className="hidden md:flex items-center justify-between pb-4 border-b border-[#241a13]">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#fbf8f5] capitalize tracking-wide">
              {activeTab === 'slides'
                ? 'Slider & Banner Manager'
                : activeTab === 'add-product'
                ? editingProduct
                  ? `Edit Product: ${editingProduct.name}`
                  : 'Add New Product Studio'
                : activeTab === 'bullion'
                ? 'Gold Bars & Bullion Manager'
                : activeTab}
            </h1>
            <p className="text-xs text-[#a89584] font-medium mt-0.5">
              Bradford Atelier Management Terminal &bull; Real-time synchronization
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live 24K Spot Pill */}
            <div className="px-3.5 py-1.5 rounded-full bg-[#120d09] border border-[#2b1f17] text-xs flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#a89584] uppercase font-bold text-[10.5px]">24K Spot:</span>
              <span className="font-mono text-[#d8bb93] font-bold">£{liveBullionRates.gold.toFixed(2)}/g</span>
            </div>

            <Link
              href="/shop"
              target="_blank"
              className="px-4 py-2 rounded-lg bg-[#140e0a] border border-[#2b1f17] hover:border-[#d8bb93] text-xs font-bold text-[#d8bb93] hover:text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span>Live Shop</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            themeStyles={themeStyles}
            totalRevenue={totalRevenue}
            totalProductsCount={products.length}
            pendingEnquiriesCount={pendingEnquiriesCount}
            gold24kRate={liveBullionRates.gold.toFixed(2)}
            orders={orders}
            slides={slides}
            onSelectInvoiceOrder={setSelectedInvoiceOrder}
            onOpenAddProduct={handleOpenAddProduct}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <ProductsTab
            themeStyles={themeStyles}
            products={products}
            categories={categories}
            onOpenAddProduct={handleOpenAddProduct}
            onStartEditProduct={handleStartEditProduct}
            onDeleteProduct={async (id, name) => {
              if (window.confirm(`Delete product "${name}"?\nThis will remove it from the catalog in real time.`)) {
                await removeStoreProduct(id);
              }
            }}
            onQuickRestock={handleQuickRestock}
            onExportInventoryCSV={handleExportInventoryCSV}
            onUpdatePrice={updateProductPrice}
          />
        )}

        {/* TAB 3: ADD / EDIT PRODUCT STUDIO */}
        {activeTab === 'add-product' && (
          <AddProductTab
            themeStyles={themeStyles}
            addForm={addForm}
            setAddForm={setAddForm}
            categories={categories}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            saveSuccessMsg={saveSuccessMsg}
            productErrorMsg={productErrorMsg}
            isSubmittingProduct={isSubmittingProduct}
            onCancel={() => {
              setEditingProduct(null);
              setActiveTab('products');
            }}
            onFullProductSubmit={handleFullProductSubmit}
            onDeviceFileUpload={handleDeviceFileUpload}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            onGenerateAutoSku={generateAutoSku}
            onGenerateAutoSeo={generateAutoSeo}
          />
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <CategoriesTab
            themeStyles={themeStyles}
            categories={categories}
            products={products}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            editingCategory={editingCategory}
            setEditingCategory={setEditingCategory}
            catSaveSuccess={catSaveSuccess}
            catError={catError}
            catSaving={catSaving}
            onCategorySubmit={handleCategorySubmit}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {/* TAB 5: SLIDES & BANNERS */}
        {activeTab === 'slides' && (
          <SlidesTab
            themeStyles={themeStyles}
            heroForm={heroForm}
            setHeroForm={setHeroForm}
            heroSaveMsg={heroSaveMsg}
            onHeroSubmit={handleHeroSubmit}
            slides={slides}
            onOpenAddSlide={() => setIsAddSlideOpen(true)}
            onToggleSlideStatus={toggleSlideStatus}
            onDeleteSlide={handleDeleteSlide}
            onHeroImageUpload={handleHeroImageUpload}
          />
        )}

        {/* TAB 6: ORDERS */}
        {activeTab === 'orders' && (
          <OrdersTab
            themeStyles={themeStyles}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSelectInvoiceOrder={setSelectedInvoiceOrder}
          />
        )}

        {/* TAB 7: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <EnquiriesTab
            themeStyles={themeStyles}
            enquiries={enquiries as AdminEnquiry[]}
            onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
          />
        )}

        {/* TAB 8: USERS & AUDIT LOGS */}
        {activeTab === 'customers' && (
          <CustomersTab
            themeStyles={themeStyles}
            registeredUsers={registeredUsers}
            loginAttemptsLogs={loginAttemptsLogs}
            auditLogs={auditLogs}
            onUpdateUserStatus={handleUpdateUserStatus}
            userLoadingId={userLoadingId}
            userActionMsg={userActionMsg}
            setUserActionMsg={setUserActionMsg}
            onExportAuditCSV={handleExportAuditCSV}
          />
        )}

        {/* TAB: BULLION & GOLD BARS MANAGER */}
        {activeTab === 'bullion' && (
          <BullionTab
            themeStyles={themeStyles}
            goldGram={liveBullionRates.gold}
            silverGram={liveBullionRates.silver}
          />
        )}


        {/* TAB 10: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsTab
            themeStyles={themeStyles}
            announcementForm={announcementForm}
            setAnnouncementForm={setAnnouncementForm}
            announcementSaveMsg={announcementSaveMsg}
            onAnnouncementSubmit={handleAnnouncementSubmit}
            shippingThreshold={shippingThreshold}
            setShippingThreshold={setShippingThreshold}
          />
        )}
      </main>

      {/* MODAL: ADD HERO SLIDE */}
      {isAddSlideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className={`${themeStyles.cardBg} rounded-[5px] max-w-md w-full p-6 shadow-2xl space-y-4`}>
            <div className={`flex justify-between items-center border-b ${themeStyles.cardHeaderBorder} pb-3`}>
              <h3 className={`font-serif text-lg ${themeStyles.accentGold} font-bold flex items-center gap-2`}>
                <SlidesIcon className="w-5 h-5 text-gray-900" />
                <span>Add Hero Slide Banner</span>
              </h3>
              <button
                onClick={() => setIsAddSlideOpen(false)}
                className={`${themeStyles.subtitleColor} hover:${themeStyles.titleColor} cursor-pointer`}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSlide} className="space-y-3 text-xs">
              <div>
                <label className={`block ${themeStyles.subtitleColor} mb-1`}>Slide Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Emerald Collection"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${themeStyles.inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${themeStyles.subtitleColor} mb-1`}>Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted gold set with certified emeralds"
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${themeStyles.inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${themeStyles.subtitleColor} mb-1`}>CTA Button Text</label>
                <input
                  type="text"
                  value={newSlide.ctaText}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${themeStyles.inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${themeStyles.subtitleColor} mb-1`}>CTA Button Link</label>
                <input
                  type="text"
                  value={newSlide.ctaLink}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaLink: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${themeStyles.inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${themeStyles.subtitleColor} mb-1`}>Slide Image URL</label>
                <input
                  type="text"
                  required
                  placeholder="/images/hero-slider-1.jpg"
                  value={newSlide.image}
                  onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${themeStyles.inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${themeStyles.subtitleColor} mb-1`}>Display Order</label>
                <input
                  type="number"
                  min="1"
                  value={newSlide.order}
                  onChange={(e) => setNewSlide({ ...newSlide, order: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 rounded-[5px] focus:outline-none ${themeStyles.inputBg}`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlideOpen(false)}
                  className="px-4 py-2 border rounded-[5px] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${themeStyles.primaryBtn} rounded-[5px] text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer`}
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Real-time Product Edit Modal */}
      <ProductEditModal
        product={editingAdminProduct}
        isOpen={!!editingAdminProduct}
        onClose={() => setEditingAdminProduct(null)}
      />
    </div>
  );
}
