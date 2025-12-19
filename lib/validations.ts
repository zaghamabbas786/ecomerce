import { z } from 'zod';

// Product Validations
export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  collectionId: z.string().optional(),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  variants: z.array(
    z.object({
      size: z.string(),
      color: z.string(),
      stock: z.number().int().min(0),
    })
  ),
  featured: z.boolean().optional(),
});

export const productUpdateSchema = productSchema.partial();

// Collection Validations
export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().optional(),
  featured: z.boolean().optional(),
});

export const collectionUpdateSchema = collectionSchema.partial();

// Order Validations
export const orderItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  size: z.string(),
  color: z.string(),
  image: z.string(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

// User Profile Validations
export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

// Auth Validations
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

// Hero Section Validation
export const heroSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

// Banner Validation
export const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  active: z.boolean().optional(),
});

// Site Settings Validation
export const siteSettingsSchema = z.object({
  logo: z.string().optional(),
  siteName: z.string().min(1, 'Site name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

