import { supabase } from './db';

// Type definitions matching the MongoDB models
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  collection_id?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  stripe_payment_intent_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  logo?: string;
  site_name: string;
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message || 'Database error occurred');
  }
}

// Convert snake_case to camelCase for API responses
export function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

  const camelObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelObj[camelKey] = toCamelCase(obj[key]);
    }
  }
  return camelObj;
}

// Convert camelCase to snake_case for database inserts
export function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;

  const snakeObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeObj[snakeKey] = toSnakeCase(obj[key]);
    }
  }
  return snakeObj;
}


