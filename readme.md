# 🛍️ E-Commerce Clothing Store

A complete, production-ready e-commerce clothing store built with Next.js 16, TypeScript, MongoDB, and modern web technologies. Features a full admin panel, cart system, authentication, and payment integration.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.8-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

### Customer Features
- 🏠 **Dynamic Homepage** with hero section, featured products, and collections
- 🛒 **Shopping Cart** with real-time stock validation
- 🔍 **Advanced Search & Filters** (category, price, size, color)
- 📦 **Product Details** with multiple images and variant selection
- 💳 **Secure Checkout** with guest and authenticated options
- 👤 **User Accounts** with profile management and order history
- 📱 **Fully Responsive** design across all devices

### Admin Features
- 📊 **Dashboard** with revenue, orders, and customer analytics
- 🎨 **Product Management** with variants and stock tracking
- 📚 **Collection Management** for organizing products
- 📋 **Order Management** with status updates
- 🎭 **Homepage CMS** for dynamic content editing
- ⚙️ **Site Settings** for store configuration
- 🖼️ **Image Upload** via Cloudinary integration

## 🚀 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth v5 (OAuth + Credentials)
- **Styling**: Tailwind CSS + ShadCN UI
- **Image Storage**: Cloudinary
- **Payment**: Stripe (placeholder integration)
- **State**: Server-first architecture with cookie-based cart
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)
- Stripe account (optional, for payments)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ecomerc
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce-store

# NextAuth
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Seed the database

```bash
npm run seed
```

This creates:
- ✅ Admin user (admin@example.com / admin123)
- ✅ 5 sample products with variants
- ✅ 3 collections
- ✅ Hero section
- ✅ Site settings

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🔑 Default Admin Credentials

After seeding:
- **Email**: admin@example.com
- **Password**: admin123

Access admin panel at: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
├── actions/              # Server actions for data mutations
│   ├── auth-actions.ts
│   ├── cart-actions.ts
│   ├── cms-actions.ts
│   ├── collection-actions.ts
│   ├── order-actions.ts
│   └── product-actions.ts
├── app/                  # Next.js App Router pages
│   ├── admin/           # Admin panel (protected)
│   ├── auth/            # Sign in/up pages
│   ├── account/         # User account pages
│   ├── cart/            # Shopping cart
│   ├── checkout/        # Checkout flow
│   ├── collections/     # Collection pages
│   ├── products/        # Product detail pages
│   ├── search/          # Search functionality
│   ├── shop/            # Product listing
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/             # ShadCN UI primitives
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── product-card.tsx
│   └── ...
├── lib/                 # Utility libraries
│   ├── db.ts           # Database connection
│   ├── auth-helpers.ts # Auth utilities
│   ├── cart.ts         # Cart logic
│   ├── errors.ts       # Error handling
│   ├── utils.ts        # Helper functions
│   └── validations.ts  # Zod schemas
├── models/              # Mongoose models
│   ├── User.ts
│   ├── Product.ts
│   ├── Collection.ts
│   ├── Order.ts
│   └── ...
└── scripts/
    └── seed.ts          # Database seeding
```

## 🎯 Key Features Explained

### Server-First Architecture
- Maximizes server components for better performance
- Client components only where interactivity is needed
- Server actions for all mutations

### Cart System
- Cookie-based cart (no login required)
- Real-time stock validation
- Automatic tax calculation (10%)
- Free shipping over $100

### Product Management
- Multiple product images
- Size and color variants
- Individual stock per variant
- Featured products flag
- Full-text search

### Order Flow
1. Browse products → Add to cart
2. Review cart → Proceed to checkout
3. Enter shipping info → Place order
4. Admin updates status → Customer notified

## 🔒 Security Features

- ✅ Input validation with Zod schemas
- ✅ SQL injection protection (Mongoose)
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Protected API routes

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run seed     # Seed database with sample data
```

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy 🚀

### MongoDB Setup (Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add to `MONGODB_URI` environment variable

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to environment variables

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

### Add Product Categories

Edit `app/shop/shop-filters.tsx`:

```typescript
const CATEGORIES = ['T-Shirts', 'Jeans', 'Your Category'];
```

### Modify Email Templates

Create email templates in `lib/email/` (placeholder ready)

## 📸 Screenshots

### Homepage
- Hero section with CTA
- Featured collections grid
- Featured products showcase

### Shop Page
- Product grid with images
- Advanced filters sidebar
- Sorting options
- Pagination

### Product Details
- Image gallery
- Size/color selector
- Stock availability
- Add to cart

### Admin Panel
- Revenue dashboard
- Product management table
- Order status updates
- CMS editor

## 🧪 Testing

The application is ready for testing. Consider adding:
- Unit tests with Jest
- Integration tests with Playwright
- E2E tests for checkout flow

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is created for educational purposes.

## 🆘 Support

For questions or issues:
- 📖 Check [PROJECT_GUIDE.md](PROJECT_GUIDE.md)
- 📧 Open an issue on GitHub
- 💬 Check Next.js and MongoDB documentation

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [ShadCN UI](https://ui.shadcn.com) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [MongoDB](https://www.mongodb.com) - Database platform
- [Cloudinary](https://cloudinary.com) - Image management

---

Built with ❤️ using Next.js 16 and TypeScript
