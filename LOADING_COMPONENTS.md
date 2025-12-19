# 🔄 Loading Components Usage Guide

Your app now has reusable loading indicators throughout! Here's how to use them:

## 📦 Available Components

### 1. **LoadingButton** - Buttons with Loading State

The most commonly used component. Replaces regular Button with loading spinner.

```tsx
import { LoadingButton } from '@/components/loading-button';

function MyForm() {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingButton 
      loading={loading}
      loadingText="Saving..."  // Optional: text to show while loading
      onClick={handleClick}
    >
      Save Changes
    </LoadingButton>
  );
}
```

**Props:**
- `loading` - boolean to show/hide spinner
- `loadingText` - optional text to display during loading
- All regular Button props (variant, size, etc.)

---

### 2. **Spinner** - Standalone Spinner

Simple spinner for any loading state.

```tsx
import { Spinner } from '@/components/ui/spinner';

<Spinner size="sm" />  // sm, md, lg, xl
<Spinner size="lg" className="text-primary" />
```

---

### 3. **LoadingOverlay** - Cover Content While Loading

Shows spinner overlay over a section or full screen.

```tsx
import { LoadingOverlay } from '@/components/loading-overlay';

<div className="relative">
  <YourContent />
  <LoadingOverlay 
    loading={isLoading} 
    text="Loading data..."  // Optional
    fullScreen={false}      // true for full screen overlay
  />
</div>
```

---

### 4. **PageLoader** - Top Progress Bar

Already added to main layout! Shows automatic progress bar when navigating between pages.

No setup needed - it works automatically! ✨

---

### 5. **Loading Skeletons** - Placeholder UI

Show placeholder UI while content loads.

```tsx
import { 
  ProductCardSkeleton, 
  TableSkeleton,
  FormSkeleton,
  CardSkeleton 
} from '@/components/loading-state';

// Show skeleton while loading
{loading ? <ProductCardSkeleton /> : <ProductCard />}

// Multiple skeletons
<TableSkeleton rows={10} />
```

---

## ✅ Where Loading is Already Implemented

### Frontend:
- ✅ Sign In form
- ✅ Register form
- ✅ Add to Cart button
- ✅ Remove from Cart button
- ✅ Checkout form
- ✅ Page navigation (top progress bar)

### Admin Panel:
Ready to add! Use `LoadingButton` in admin forms.

---

## 🚀 How to Add Loading to More Components

### Example 1: Admin Delete Button

```tsx
'use client';

import { useState } from 'react';
import { LoadingButton } from '@/components/loading-button';

export function DeleteButton({ id }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteItem(id);
    setLoading(false);
  };

  return (
    <LoadingButton
      variant="destructive"
      loading={loading}
      loadingText="Deleting..."
      onClick={handleDelete}
    >
      Delete
    </LoadingButton>
  );
}
```

### Example 2: Data Fetching with Overlay

```tsx
'use client';

import { useState, useEffect } from 'react';
import { LoadingOverlay } from '@/components/loading-overlay';

export function DataTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <div className="relative min-h-[400px]">
      {/* Your table/content */}
      <table>...</table>
      
      {/* Loading overlay */}
      <LoadingOverlay loading={loading} text="Loading data..." />
    </div>
  );
}
```

### Example 3: Page with Skeleton

```tsx
import { ProductCardSkeleton } from '@/components/loading-state';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <Suspense fallback={
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
      }>
        <ProductList />
      </Suspense>
    </div>
  );
}
```

---

## 🎨 Styling Tips

### Change Spinner Color
```tsx
<Spinner className="text-blue-500" />
<LoadingButton loading={true} className="bg-green-500">
  Save
</LoadingButton>
```

### Custom Loading Text
```tsx
<LoadingButton 
  loading={saving}
  loadingText="Please wait, saving your changes..."
>
  Save Product
</LoadingButton>
```

### Disable User Interaction During Loading
```tsx
<div className={loading ? 'pointer-events-none opacity-50' : ''}>
  <YourForm />
</div>
```

---

## 📝 Best Practices

1. **Always show loading for async operations** (API calls, navigation)
2. **Use meaningful loading text** ("Saving..." not "Loading...")
3. **Disable forms during submission** (prevents double-submit)
4. **Show skeletons for better perceived performance**
5. **Keep loading states consistent** (same spinner size/style)

---

## 🐛 Common Issues

**Issue:** Button jumps when loading text is different length  
**Fix:** Use `loadingText` with same length as button text

**Issue:** Spinner not visible  
**Fix:** Check parent has contrasting background color

**Issue:** Page loader not showing  
**Fix:** It's already in layout.tsx - works automatically!

---

## 🎉 What You Have Now

✅ Loading spinners on all buttons  
✅ Page transition indicators  
✅ Skeleton loaders for content  
✅ Overlay loaders for sections  
✅ Consistent UX throughout the app  

Your users now have **visual feedback** for every action! 🚀

