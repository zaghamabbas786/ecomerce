'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { collectionSchema, collectionUpdateSchema } from '@/lib/validations';
import { toCamelCase, toSnakeCase } from '@/lib/db-helpers';

export async function createCollection(data: unknown) {
  try {
    await requireAdmin();
    const validated = collectionSchema.parse(data);

    const supabase = await connectDB();

    const { data: existingCollection } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', validated.slug)
      .single();

    if (existingCollection) {
      return { error: 'A collection with this slug already exists' };
    }

    const collectionData = toSnakeCase(validated);

    const { data: collection, error } = await supabase
      .from('collections')
      .insert(collectionData)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    revalidatePath('/');

    return { success: true, collection: toCamelCase(collection) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCollection(id: string, data: unknown) {
  try {
    await requireAdmin();
    const validated = collectionUpdateSchema.parse(data);

    const supabase = await connectDB();

    const snakeData = toSnakeCase(validated);

    const { data: collection, error } = await supabase
      .from('collections')
      .update(snakeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!collection) {
      return { error: 'Collection not found' };
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    revalidatePath(`/collections/${collection.slug}`);
    revalidatePath('/');

    return { success: true, collection: toCamelCase(collection) };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteCollection(id: string) {
  try {
    await requireAdmin();

    const supabase = await connectDB();

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;

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
    const supabase = await connectDB();

    let query = supabase.from('collections').select('*');

    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    query = query.order('created_at', { ascending: false });

    const { data: collections, error } = await query;

    if (error) throw error;

    return { collections: collections ? collections.map(toCamelCase) : [] };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCollectionBySlug(slug: string) {
  try {
    const supabase = await connectDB();

    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!collection) {
      return { error: 'Collection not found' };
    }

    return { collection: toCamelCase(collection) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCollectionById(id: string) {
  try {
    const supabase = await connectDB();

    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!collection) {
      return { error: 'Collection not found' };
    }

    return { collection: toCamelCase(collection) };
  } catch (error) {
    return handleError(error);
  }
}
