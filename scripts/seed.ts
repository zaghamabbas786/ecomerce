import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local FIRST, before any other imports
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

// Also try .env as fallback
config({ path: resolve(process.cwd(), '.env') });

// Verify required env vars are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  console.error('📝 Please add your Supabase credentials to .env.local:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  process.exit(1);
}

import { connectDB } from '../lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    const supabase = await connectDB();

    console.log('🌱 Starting seed...');

    // Clear existing data
    await Promise.all([
      supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('collections').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('hero_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('site_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    ]);

    console.log('✨ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      })
      .select()
      .single();

    if (adminError) throw adminError;
    console.log('👤 Created admin user:', admin.email);

    // Create collections
    const { data: collections, error: collectionsError } = await supabase
      .from('collections')
      .insert([
        {
          name: 'Summer Collection',
          slug: 'summer-collection',
          description: 'Light and breezy clothing for summer',
          featured: true,
          image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
        },
        {
          name: 'Winter Essentials',
          slug: 'winter-essentials',
          description: 'Stay warm with our winter collection',
          featured: true,
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
        },
        {
          name: 'Casual Wear',
          slug: 'casual-wear',
          description: 'Comfortable everyday clothing',
          featured: true,
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
        },
      ])
      .select();

    if (collectionsError) throw collectionsError;
    console.log('📦 Created collections:', collections?.length || 0);

    // Create products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert([
        {
          title: 'Classic White T-Shirt',
          description: 'Premium cotton t-shirt with a classic fit',
          price: 29.99,
          category: 'T-Shirts',
          collection_id: collections?.[2]?.id || null,
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['White', 'Black', 'Gray'],
          images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
          ],
          variants: [
            { size: 'S', color: 'White', stock: 20 },
            { size: 'S', color: 'Black', stock: 15 },
            { size: 'S', color: 'Gray', stock: 10 },
            { size: 'M', color: 'White', stock: 30 },
            { size: 'M', color: 'Black', stock: 25 },
            { size: 'M', color: 'Gray', stock: 20 },
            { size: 'L', color: 'White', stock: 25 },
            { size: 'L', color: 'Black', stock: 20 },
            { size: 'L', color: 'Gray', stock: 15 },
            { size: 'XL', color: 'White', stock: 15 },
            { size: 'XL', color: 'Black', stock: 10 },
            { size: 'XL', color: 'Gray', stock: 10 },
          ],
          featured: true,
          slug: 'classic-white-t-shirt',
        },
        {
          title: 'Slim Fit Jeans',
          description: 'Comfortable slim fit jeans with stretch',
          price: 79.99,
          category: 'Jeans',
          collection_id: collections?.[2]?.id || null,
          sizes: ['28', '30', '32', '34', '36'],
          colors: ['Blue', 'Black'],
          images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
          ],
          variants: [
            { size: '28', color: 'Blue', stock: 10 },
            { size: '28', color: 'Black', stock: 8 },
            { size: '30', color: 'Blue', stock: 15 },
            { size: '30', color: 'Black', stock: 12 },
            { size: '32', color: 'Blue', stock: 20 },
            { size: '32', color: 'Black', stock: 18 },
            { size: '34', color: 'Blue', stock: 15 },
            { size: '34', color: 'Black', stock: 12 },
            { size: '36', color: 'Blue', stock: 10 },
            { size: '36', color: 'Black', stock: 8 },
          ],
          featured: true,
          slug: 'slim-fit-jeans',
        },
        {
          title: 'Summer Floral Dress',
          description: 'Light and airy floral dress perfect for summer',
          price: 59.99,
          category: 'Dresses',
          collection_id: collections?.[0]?.id || null,
          sizes: ['XS', 'S', 'M', 'L'],
          colors: ['Floral Pink', 'Floral Blue'],
          images: [
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
          ],
          variants: [
            { size: 'XS', color: 'Floral Pink', stock: 8 },
            { size: 'XS', color: 'Floral Blue', stock: 6 },
            { size: 'S', color: 'Floral Pink', stock: 12 },
            { size: 'S', color: 'Floral Blue', stock: 10 },
            { size: 'M', color: 'Floral Pink', stock: 15 },
            { size: 'M', color: 'Floral Blue', stock: 12 },
            { size: 'L', color: 'Floral Pink', stock: 10 },
            { size: 'L', color: 'Floral Blue', stock: 8 },
          ],
          featured: true,
          slug: 'summer-floral-dress',
        },
        {
          title: 'Leather Jacket',
          description: 'Genuine leather jacket with premium finish',
          price: 199.99,
          category: 'Jackets',
          collection_id: collections?.[1]?.id || null,
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'Brown'],
          images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5',
            'https://images.unsplash.com/photo-1520975867597-0af37a22e31e',
          ],
          variants: [
            { size: 'S', color: 'Black', stock: 5 },
            { size: 'S', color: 'Brown', stock: 4 },
            { size: 'M', color: 'Black', stock: 8 },
            { size: 'M', color: 'Brown', stock: 6 },
            { size: 'L', color: 'Black', stock: 10 },
            { size: 'L', color: 'Brown', stock: 8 },
            { size: 'XL', color: 'Black', stock: 6 },
            { size: 'XL', color: 'Brown', stock: 4 },
          ],
          featured: true,
          slug: 'leather-jacket',
        },
        {
          title: 'Running Shoes',
          description: 'Comfortable running shoes for daily workouts',
          price: 89.99,
          category: 'Shoes',
          collection_id: null,
          sizes: ['7', '8', '9', '10', '11'],
          colors: ['White', 'Black', 'Blue'],
          images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
          ],
          variants: [
            { size: '7', color: 'White', stock: 8 },
            { size: '7', color: 'Black', stock: 6 },
            { size: '7', color: 'Blue', stock: 5 },
            { size: '8', color: 'White', stock: 12 },
            { size: '8', color: 'Black', stock: 10 },
            { size: '8', color: 'Blue', stock: 8 },
            { size: '9', color: 'White', stock: 15 },
            { size: '9', color: 'Black', stock: 12 },
            { size: '9', color: 'Blue', stock: 10 },
            { size: '10', color: 'White', stock: 12 },
            { size: '10', color: 'Black', stock: 10 },
            { size: '10', color: 'Blue', stock: 8 },
            { size: '11', color: 'White', stock: 8 },
            { size: '11', color: 'Black', stock: 6 },
            { size: '11', color: 'Blue', stock: 5 },
          ],
          featured: false,
          slug: 'running-shoes',
        },
      ])
      .select();

    if (productsError) throw productsError;
    console.log('🛍️  Created products:', products?.length || 0);

    // Create hero section
    const { error: heroError } = await supabase
      .from('hero_sections')
      .insert({
        title: 'Welcome to Fashion Store',
        subtitle: 'Discover the latest trends in fashion',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
        cta_text: 'Shop Now',
        cta_link: '/shop',
        active: true,
      });

    if (heroError) throw heroError;
    console.log('🎨 Created hero section');

    // Create site settings
    const { error: settingsError } = await supabase
      .from('site_settings')
      .insert({
        site_name: 'Fashion Store',
        email: 'contact@fashionstore.com',
        phone: '+1 (555) 123-4567',
        address: '123 Fashion Street, NY 10001',
        facebook: 'https://facebook.com/fashionstore',
        instagram: 'https://instagram.com/fashionstore',
        twitter: 'https://twitter.com/fashionstore',
      });

    if (settingsError) throw settingsError;
    console.log('⚙️  Created site settings');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
