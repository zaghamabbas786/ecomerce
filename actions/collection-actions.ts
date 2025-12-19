'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { collectionSchema, collectionUpdateSchema } from '@/lib/validations';
import Collection from '@/models/Collection';

export async function createCollection(data: unknown) {
  try {
    await requireAdmin();
    const validated = collectionSchema.parse(data);

    await connectDB();

    const existingCollection = await Collection.findOne({ slug: validated.slug });
    if (existingCollection) {
      return { error: 'A collection with this slug already exists' };
    }

    const collection = await Collection.create(validated);

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    revalidatePath('/');

    return { success: true, collection: JSON.parse(JSON.stringify(collection)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCollection(id: string, data: unknown) {
  try {
    await requireAdmin();
    const validated = collectionUpdateSchema.parse(data);

    await connectDB();

    const collection = await Collection.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true, runValidators: true }
    );

    if (!collection) {
      return { error: 'Collection not found' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    revalidatePath(`/collections/${collection.slug}`);
    revalidatePath('/');

    return { success: true, collection: JSON.parse(JSON.stringify(collection)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteCollection(id: string) {
  try {
    await requireAdmin();

    await connectDB();

    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return { error: 'Collection not found' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCollections(featured?: boolean) {
  try {
    await connectDB();

    const filter: any = {};
    if (featured !== undefined) {
      filter.featured = featured;
    }

    const collections = await Collection.find(filter).sort({ createdAt: -1 }).lean();

    return { collections: JSON.parse(JSON.stringify(collections)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCollectionBySlug(slug: string) {
  try {
    await connectDB();

    const collection = await Collection.findOne({ slug }).lean();

    if (!collection) {
      return { error: 'Collection not found' };
    }

    return { collection: JSON.parse(JSON.stringify(collection)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCollectionById(id: string) {
  try {
    await connectDB();

    const collection = await Collection.findById(id).lean();

    if (!collection) {
      return { error: 'Collection not found' };
    }

    return { collection: JSON.parse(JSON.stringify(collection)) };
  } catch (error) {
    return handleError(error);
  }
}

