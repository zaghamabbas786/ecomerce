# Quick Migration Instructions

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/zhmjhqiikqmqmuaagnti
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Copy and Paste the SQL

Copy the entire contents of `lib/schema.sql` and paste it into the SQL Editor.

## Step 3: Execute

Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)

You should see: "Success. No rows returned"

## Step 4: Verify Tables

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `users`
   - `collections`
   - `products`
   - `orders`
   - `hero_sections`
   - `banners`
   - `site_settings`

## Step 5: Seed the Database (Optional)

After tables are created, run:
```bash
npm run seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Sample collections and products
- Hero section and site settings

---

**Quick Link**: https://supabase.com/dashboard/project/zhmjhqiikqmqmuaagnti/sql/new


