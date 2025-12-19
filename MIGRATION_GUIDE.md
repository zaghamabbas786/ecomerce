# MongoDB to Supabase PostgreSQL Migration Guide

This project has been migrated from MongoDB to Supabase PostgreSQL. Follow these steps to set up your database.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon/Public Key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Service Role Key** (this is your `SUPABASE_SERVICE_ROLE_KEY`) - **Recommended for production**

### 3. Set Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Service Role Key (Optional but recommended for production)
# Use this for server-side operations that need to bypass RLS
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Remove or comment out MongoDB URI
# MONGODB_URI=mongodb://...
```

**Note**: The code will work with just the anon key, but for production, you should use the service role key for server-side operations. The service role key bypasses Row Level Security (RLS) which is needed for admin operations.

### 4. Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Open the file `lib/schema.sql` from this project
3. Copy the entire SQL content
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

This will create all necessary tables:
- `users`
- `collections`
- `products`
- `orders`
- `hero_sections`
- `banners`
- `site_settings`

### 5. Install Dependencies

```bash
npm install
```

### 6. Seed the Database (Optional)

Run the seed script to populate your database with sample data:

```bash
npm run seed
```

This will create:
- Admin user (admin@example.com / admin123)
- Sample collections
- Sample products
- Hero section
- Site settings

### 7. Start Development Server

```bash
npm run dev
```

## What Changed

### Database Connection

- **Before**: MongoDB with Mongoose ODM
- **After**: Supabase PostgreSQL with Supabase JS client

### Models

- MongoDB models in `models/` directory are no longer used
- Database operations now use Supabase queries directly
- Type definitions are in `lib/db-helpers.ts`

### Actions

All server actions have been updated to use Supabase:
- `actions/product-actions.ts`
- `actions/collection-actions.ts`
- `actions/order-actions.ts`
- `actions/auth-actions.ts`
- `actions/cms-actions.ts`

### Authentication

- NextAuth still uses JWT strategy (no database adapter needed)
- User authentication queries Supabase `users` table directly

## Important Notes

1. **Service Role Key**: Keep your `SUPABASE_SERVICE_ROLE_KEY` secret and never expose it to the client
2. **Row Level Security**: Consider enabling RLS policies in Supabase for production
3. **Backups**: Set up automatic backups in Supabase dashboard
4. **Migrations**: Use Supabase migrations for schema changes in production

## Troubleshooting

### Connection Errors

- Verify your Supabase URL and service role key are correct
- Check that the schema has been run successfully
- Ensure your Supabase project is active

### Type Errors

- Make sure all TypeScript types are properly imported from `lib/db-helpers.ts`
- Run `npm run build` to check for type errors

### Seed Script Issues

- Ensure the schema has been created first
- Check that environment variables are set correctly

## Next Steps

1. Set up Row Level Security (RLS) policies in Supabase
2. Configure database backups
3. Set up monitoring and alerts
4. Review and optimize queries for performance

## Support

For issues or questions:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

