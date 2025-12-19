import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/actions/product-actions';
import { ShopFilters } from './shop-filters';

export const metadata = {
  title: 'Shop',
  description: 'Browse our collection of trendy clothing and accessories',
};

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sizes?: string;
    colors?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const sizes = params.sizes ? params.sizes.split(',') : undefined;
  const colors = params.colors ? params.colors.split(',') : undefined;
  const sort = params.sort;
  const search = params.search;

  const result = await getProducts({
    page,
    limit: 12,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sort,
    search,
  });

  const products = ('products' in result ? result.products : null) || [];
  const totalPages = ('pages' in result ? result.pages : null) || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shop</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <ShopFilters />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {(page - 1) * 12 + 1}-
                {Math.min(page * 12, ('total' in result ? result.total : null) || 0)} of {('total' in result ? result.total : null) || 0}{' '}
                products
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    slug={product.slug}
                    price={product.price}
                    image={product.images[0]}
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/shop"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

