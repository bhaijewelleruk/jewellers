import { ProductItem, CategoryItem } from '@/context/ShopContext';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'add-product'
  | 'categories'
  | 'slides'
  | 'orders'
  | 'enquiries'
  | 'customers'
  | 'goldrates'
  | 'settings';

export interface OrderItem {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  items: string;
  address?: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
  status: 'New' | 'Replied' | 'Pending' | 'Completed' | 'In Design';
  date: string;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  status: 'Active' | 'Inactive';
  order: number;
  link?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  joinDate: string;
}

export interface RegisteredUserItem {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  status: 'active' | 'inactive' | 'banned' | 'locked';
  created_at: string;
  last_sign_in_at?: string;
  loginAttempts?: number;
  lockedUntil?: string;
  [key: string]: unknown;
}

export interface LoginAttemptItem {
  id: string;
  identifier: string;
  success: boolean;
  ip_address: string;
  user_agent?: string;
  created_at: string;
  attempt_count: number;
  failure_reason?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  category: 'AUTH' | 'SECURITY' | 'ORDER' | 'INVENTORY' | 'SYSTEM';
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  ip: string;
  actor: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  bgImage: string;
}

export interface AnnouncementSettings {
  text: string;
  link: string;
  isActive: boolean;
}

export interface AdminThemeStyles {
  isLight: boolean;
  containerBg: string;
  sidebarBg: string;
  sidebarHeaderBorder: string;
  sidebarFooterBg: string;
  cardBg: string;
  cardHeaderBorder: string;
  inputBg: string;
  tableHeaderBg: string;
  tableRowHover: string;
  titleColor: string;
  accentGold: string;
  subtitleColor: string;
  badgeBg: string;
  primaryBtn: string;
}

export type { ProductItem, CategoryItem };
