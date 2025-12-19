'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { productSchema, productUpdateSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import Product from '@/models/Product';
import type { IProduct } from '@/models/Product';

export async function createProduct(data: unknown) {
  try {
    await requireAdmin();
    const validated = productSchema.parse(data);

    await connectDB();

    const slug = slugify(validated.title);
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return { error: 'A product with this title already exists' };
    }

    const product = await Product.create({
      ...validated,
      slug,
    });

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProduct(id: string, data: unknown) {
  try {
    await requireAdmin();
    const validated = productUpdateSchema.parse(data);

    await connectDB();

    if (validated.title) {
      validated.slug = slugify(validated.title);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, runValidators: true }
    );

    if (!product) {
      return { error: 'Product not found' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/');

    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();

    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return { error: 'Product not found' };
    }

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
    await connectDB();

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (params?.category) {
      filter.category = params.category;
    }

    if (params?.collectionId) {
      filter.collectionId = params.collectionId;
    }

    if (params?.featured !== undefined) {
      filter.featured = params.featured;
    }

    if (params?.search) {
      filter.$text = { $search: params.search };
    }

    if (params?.minPrice || params?.maxPrice) {
      filter.price = {};
      if (params.minPrice) filter.price.$gte = params.minPrice;
      if (params.maxPrice) filter.price.$lte = params.maxPrice;
    }

    if (params?.sizes && params.sizes.length > 0) {
      filter.sizes = { $in: params.sizes };
    }

    if (params?.colors && params.colors.length > 0) {
      filter.colors = { $in: params.colors };
    }

    let sort: any = { createdAt: -1 };
    if (params?.sort === 'price-asc') {
      sort = { price: 1 };
    } else if (params?.sort === 'price-desc') {
      sort = { price: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return { error: 'Product not found' };
    }

    return { product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();

    const product = await Product.findById(id).lean();

    if (!product) {
      return { error: 'Product not found' };
    }

    return { product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    return handleError(error);
  }
}

