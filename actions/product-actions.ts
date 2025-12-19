'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { productSchema, productUpdateSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { toCamelCase, toSnakeCase } from '@/lib/db-helpers';

export async function createProduct(data: unknown) {
  try {
    await requireAdmin();
    const validated = productSchema.parse(data);

    const supabase = await connectDB();

    const slug = slugify(validated.title);
    
    // Check if slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingProduct) {
      return { error: 'A product with this title already exists' };
    }

    const productData = toSnakeCase({
      ...validated,
      slug,
      collectionId: validated.collectionId || null,
    });

    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, product: toCamelCase(product) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProduct(id: string, data: unknown) {
  try {
    await requireAdmin();
    const validated = productUpdateSchema.parse(data);

    const supabase = await connectDB();

    // Create update object with slug if title is being updated
    const updateData: any = { ...validated };
    if (validated.title) {
      updateData.slug = slugify(validated.title);
    }

    const snakeData = toSnakeCase(updateData);
    if (snakeData.collection_id === undefined && validated.collectionId === undefined) {
      delete snakeData.collection_id;
    } else if (validated.collectionId !== undefined) {
      snakeData.collection_id = validated.collectionId || null;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(snakeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!product) {
      return { error: 'Product not found' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/');

    return { success: true, product: toCamelCase(product) };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();

    const supabase = await connectDB();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  collectionId?: string;
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: string;
}) {
  try {
    const supabase = await connectDB();

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (params?.category) {
      query = query.eq('category', params.category);
    }

    if (params?.collectionId) {
      query = query.eq('collection_id', params.collectionId);
    }

    if (params?.featured !== undefined) {
      query = query.eq('featured', params.featured);
    }

    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params?.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }

    if (params?.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }

    if (params?.sizes && params.sizes.length > 0) {
      query = query.contains('sizes', params.sizes);
    }

    if (params?.colors && params.colors.length > 0) {
      query = query.contains('colors', params.colors);
    }

    // Sorting
    if (params?.sort === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (params?.sort === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: products, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      products: products ? products.map(toCamelCase) : [],
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = await connectDB();

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!product) {
      return { error: 'Product not found' };
    }

    return { product: toCamelCase(product) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = await connectDB();

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!product) {
      return { error: 'Product not found' };
    }

    return { product: toCamelCase(product) };
  } catch (error) {
    return handleError(error);
  }
}
