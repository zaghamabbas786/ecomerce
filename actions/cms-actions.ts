'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { heroSectionSchema, bannerSchema, siteSettingsSchema } from '@/lib/validations';
import { toCamelCase, toSnakeCase } from '@/lib/db-helpers';

// Hero Section Actions
export async function updateHeroSection(data: unknown) {
  try {
    await requireAdmin();
    const validated = heroSectionSchema.parse(data);

    const supabase = await connectDB();

    // Deactivate all other hero sections
    await supabase
      .from('hero_sections')
      .update({ active: false });

    // Check if a hero section exists
    const { data: existing } = await supabase
      .from('hero_sections')
      .select('id')
      .limit(1)
      .single();
    
    const heroData = toSnakeCase({ ...validated, active: true });

    let heroSection;
    if (existing) {
      const { data, error } = await supabase
        .from('hero_sections')
        .update(heroData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      heroSection = data;
    } else {
      const { data, error } = await supabase
        .from('hero_sections')
        .insert(heroData)
        .select()
        .single();
      
      if (error) throw error;
      heroSection = data;
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, heroSection: toCamelCase(heroSection) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getActiveHeroSection() {
  try {
    const supabase = await connectDB();

    const { data: heroSection, error } = await supabase
      .from('hero_sections')
      .select('*')
      .eq('active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - not an error, just no active hero
      return { heroSection: null };
    }

    return { heroSection: heroSection ? toCamelCase(heroSection) : null };
  } catch (error) {
    return handleError(error);
  }
}

// Banner Actions
export async function createBanner(data: unknown) {
  try {
    await requireAdmin();
    const validated = bannerSchema.parse(data);

    const supabase = await connectDB();

    // Get max order
    const { data: maxOrderBanner } = await supabase
      .from('banners')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const order = maxOrderBanner?.order !== undefined ? maxOrderBanner.order + 1 : 0;

    const bannerData = toSnakeCase({ ...validated, order });

    const { data: banner, error } = await supabase
      .from('banners')
      .insert(bannerData)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, banner: toCamelCase(banner) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateBanner(id: string, data: unknown) {
  try {
    await requireAdmin();
    const validated = bannerSchema.parse(data);

    const supabase = await connectDB();

    const bannerData = toSnakeCase(validated);

    const { data: banner, error } = await supabase
      .from('banners')
      .update(bannerData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!banner) {
      return { error: 'Banner not found' };
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, banner: toCamelCase(banner) };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteBanner(id: string) {
  try {
    await requireAdmin();
    const supabase = await connectDB();

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true };
  } catch (error) {
    return handleError(error);
  }
}

export async function getActiveBanners() {
  try {
    const supabase = await connectDB();

    const { data: banners, error } = await supabase
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('order', { ascending: true });

    if (error) throw error;

    return { banners: banners ? banners.map(toCamelCase) : [] };
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllBanners() {
  try {
    await requireAdmin();
    const supabase = await connectDB();

    const { data: banners, error } = await supabase
      .from('banners')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return { banners: banners ? banners.map(toCamelCase) : [] };
  } catch (error) {
    return handleError(error);
  }
}

// Site Settings Actions
export async function updateSiteSettings(data: unknown) {
  try {
    await requireAdmin();
    const validated = siteSettingsSchema.parse(data);

    const supabase = await connectDB();

    // Check if settings exist
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();
    
    const settingsData = toSnakeCase(validated);

    let settings;
    if (existing) {
      const { data, error } = await supabase
        .from('site_settings')
        .update(settingsData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      settings = data;
    } else {
      const { data, error } = await supabase
        .from('site_settings')
        .insert(settingsData)
        .select()
        .single();
      
      if (error) throw error;
      settings = data;
    }

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true, settings: toCamelCase(settings) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getSiteSettings() {
  try {
    const supabase = await connectDB();

    let { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      // No settings found, create default
      const { data: newSettings, error: createError } = await supabase
        .from('site_settings')
        .insert({ site_name: 'Fashion Store' })
        .select()
        .single();
      
      if (createError) throw createError;
      settings = newSettings;
    } else if (error) {
      throw error;
    }

    return { settings: settings ? toCamelCase(settings) : null };
  } catch (error) {
    return handleError(error);
  }
}
