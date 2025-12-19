# E-Commerce Clothing Store - Project Guide

A complete, production-ready e-commerce clothing store built with Next.js 16, TypeScript, MongoDB, and more.

## Tech Stack

- **Framework**: Next.js 16 (App Router, RSC-first)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB + Mongoose
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS + ShadCN UI
- **Image Upload**: Cloudinary
- **Payments**: Stripe (placeholder)
- **State Management**: Server-first with cookie-based cart

## Project Structure

```
├── actions/              # Server actions for CRUD operations
├── app/                  # Next.js app directory
│   ├── admin/           # Admin panel pages
│   ├── auth/            # Authentication pages
│   ├── account/         # User account pages
│   ├── cart/            # Shopping cart
│   ├── checkout/        # Checkout flow
│   ├── collections/     # Collections pages
│   ├── products/        # Product pages
│   ├── search/          # Search functionality
│   └── shop/            # Shop listing
├── components/          # Reusable components
│   └── ui/             # ShadCN UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── models/             # Mongoose models
└── scripts/            # Utility scripts
```

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
AUTH_SECRET=your_secret_key
AUTH_URL=http://localhost:3000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed Database

```bash
npm run seed
```

This will create:
- Admin user (admin@example.com / admin123)
- Sample products and collections
- Hero section and site settings

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Client Site
- **Home Page**: Hero section, featured products, collections
- **Shop**: Product listing with filters (category, price, size, color)
- **Product Details**: Multiple images, size/color variants, stock management
- **Cart**: Add/update/remove items with stock validation
- **Checkout**: Guest and authenticated checkout with address form
- **Collections**: Browse products by collection
- **Search**: Full-text search across products
- **User Account**: Profile management, order history

### Admin Panel (`/admin`)
- **Dashboard**: Stats overview (revenue, orders, products, customers)
- **Products**: Full CRUD with variants and stock management
- **Collections**: Manage product collections
- **Orders**: View and update order status
- **Homepage CMS**: Edit hero section and banners
- **Settings**: Site-wide settings (contact info, social links)

## Key Features

### Authentication
- Email/password authentication with NextAuth v5
- Role-based access (user/admin)
- Protected routes with middleware
- Session management

### Cart System
- Server-side cart using cookies
- Real-time stock validation
- Quantity limits based on available stock
- Automatic tax and shipping calculation

### Product Management
- Multiple images per product
- Size and color variants
- Individual stock tracking per variant
- Featured products
- Categories and collections
- Full-text search

### Order Management
- Guest checkout support
- Order status tracking (pending → processing → shipped → delivered)
- Email notifications (placeholder)
- Order history for users
- Admin order management

### Image Upload
- Cloudinary integration
- Multiple image support
- Drag-and-drop upload
- Image optimization

## Database Models

- **User**: Authentication and profile
- **Product**: Products with variants and stock
- **Collection**: Product groupings
- **Order**: Orders with items and shipping
- **HeroSection**: Homepage hero content
- **Banner**: Promotional banners
- **SiteSettings**: Site-wide configuration

## API Routes

- `/api/auth/[...nextauth]`: NextAuth endpoints
- `/api/upload`: Cloudinary image upload

## Server Actions

All data mutations use server actions:
- Product CRUD
- Collection CRUD
- Order management
- CMS updates
- User profile updates
- Cart operations

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas

1. Create a cluster
2. Get connection string
3. Add to MONGODB_URI

### Cloudinary Setup

1. Create account at cloudinary.com
2. Get cloud name, API key, and API secret
3. Add to environment variables

## Admin Access

After seeding, use these credentials:
- Email: admin@example.com
- Password: admin123

## Customization

### Adding New Product Categories

Edit `app/shop/shop-filters.tsx` and update the `CATEGORIES` array.

### Modifying Theme

Edit `app/globals.css` to change color schemes and design tokens.

### Adding Payment Gateway

Update `app/checkout/checkout-form.tsx` to integrate with Stripe or another provider.

## Performance Optimizations

- Server-side rendering by default
- Image optimization with next/image
- Route caching and revalidation
- Lazy loading components
- Optimized database queries with indexes

## Security Features

- Input validation with Zod
- SQL injection protection (using Mongoose)
- XSS protection
- CSRF protection
- Secure authentication
- Role-based authorization

## Support

For issues or questions, please refer to:
- Next.js Documentation: https://nextjs.org/docs
- NextAuth Documentation: https://authjs.dev
- MongoDB Documentation: https://docs.mongodb.com

## License

This project is for educational purposes.

