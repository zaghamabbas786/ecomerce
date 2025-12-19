import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { Pagination } from '@/components/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/actions/product-actions';
import { SearchBar } from './search-bar';
import { Search as SearchIcon } from 'lucide-react';

export const metadata = {
  title: 'Search',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = Number(params.page) || 1;

  const result = query
    ? await getProducts({
        search: query,
        page,
        limit: 12,
      })
    : { products: [], total: 0, pages: 0 };

  const products = result.products || [];
  const totalPages = result.pages || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search Products</h1>

      <SearchBar defaultValue={query} />

      {query ? (
        products.length === 0 ? (
          <div className="text-center py-16">
            <SearchIcon className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Found {result.total} results for &quot;{query}&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              basePath="/search"
            />
          </>
        )
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">
            Enter a search term to find products
          </p>
        </div>
      )}
    </div>
  );
}

