'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth-helpers';
import { handleError } from '@/lib/errors';
import { heroSectionSchema, bannerSchema, siteSettingsSchema } from '@/lib/validations';
import HeroSection from '@/models/HeroSection';
import Banner from '@/models/Banner';
import SiteSettings from '@/models/SiteSettings';

// Hero Section Actions
export async function updateHeroSection(data: unknown) {
  try {
    await requireAdmin();
    const validated = heroSectionSchema.parse(data);

    await connectDB();

    // Deactivate all other hero sections
    await HeroSection.updateMany({}, { $set: { active: false } });

    // Check if a hero section exists
    const existing = await HeroSection.findOne();
    
    let heroSection;
    if (existing) {
      heroSection = await HeroSection.findByIdAndUpdate(
        existing._id,
        { $set: { ...validated, active: true } },
        { new: true }
      );
    } else {
      heroSection = await HeroSection.create({ ...validated, active: true });
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, heroSection: JSON.parse(JSON.stringify(heroSection)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getActiveHeroSection() {
  try {
    await connectDB();

    const heroSection = await HeroSection.findOne({ active: true }).lean();

    if (!heroSection) {
      return { heroSection: null };
    }

    return { heroSection: JSON.parse(JSON.stringify(heroSection)) };
  } catch (error) {
    return handleError(error);
  }
}

// Banner Actions
export async function createBanner(data: unknown) {
  try {
    await requireAdmin();
    const validated = bannerSchema.parse(data);

    await connectDB();

    const maxOrder = await Banner.findOne().sort({ order: -1 }).select('order');
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const banner = await Banner.create({
      ...validated,
      order,
    });

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateBanner(id: string, data: unknown) {
  try {
    await requireAdmin();
    const validated = bannerSchema.parse(data);

    await connectDB();

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: validated },
      { new: true }
    );

    if (!banner) {
      return { error: 'Banner not found' };
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteBanner(id: string) {
  try {
    await requireAdmin();
    await connectDB();

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return { error: 'Banner not found' };
    }

    revalidatePath('/');
    revalidatePath('/admin/cms');

    return { success: true };
  } catch (error) {
    return handleError(error);
  }
}

export async function getActiveBanners() {
  try {
    await connectDB();

    const banners = await Banner.find({ active: true })
      .sort({ order: 1 })
      .lean();

    return { banners: JSON.parse(JSON.stringify(banners)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllBanners() {
  try {
    await requireAdmin();
    await connectDB();

    const banners = await Banner.find().sort({ order: 1 }).lean();

    return { banners: JSON.parse(JSON.stringify(banners)) };
  } catch (error) {
    return handleError(error);
  }
}

// Site Settings Actions
export async function updateSiteSettings(data: unknown) {
  try {
    await requireAdmin();
    const validated = siteSettingsSchema.parse(data);

    await connectDB();

    const existing = await SiteSettings.findOne();
    
    let settings;
    if (existing) {
      settings = await SiteSettings.findByIdAndUpdate(
        existing._id,
        { $set: validated },
        { new: true }
      );
    } else {
      settings = await SiteSettings.create(validated);
    }

    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    return handleError(error);
  }
}

export async function getSiteSettings() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      // Create default settings
      settings = await SiteSettings.create({ siteName: 'Fashion Store' });
    }

    return { settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    return handleError(error);
  }
}

