import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCollectionBySlug } from '@/actions/collection-actions';
import { getProducts } from '@/actions/product-actions';
import { ProductCard } from '@/components/product-card';
import { Pagination } from '@/components/pagination';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const result = await getCollectionBySlug(slug);

  if (!('collection' in result) || !result.collection) {
    return { title: 'Collection Not Found' };
  }

  return {
    title: result.collection.name,
    description: result.collection.description,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const collectionResult = await getCollectionBySlug(slug);

  if (!('collection' in collectionResult) || !collectionResult.collection) {
    notFound();
  }

  const collection = collectionResult.collection;

  const productsResult = await getProducts({
    collectionId: collection.id || collection._id,
    page: currentPage,
    limit: 12,
  });

  const products = ('products' in productsResult ? productsResult.products : null) || [];
  const totalPages = ('pages' in productsResult ? productsResult.pages : null) || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Collection Header */}
      <div className="mb-12">
        {collection.image && (
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover"
              unoptimized={collection.image?.includes('unsplash.com')}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h1 className="text-5xl font-bold text-white">
                {collection.name}
              </h1>
            </div>
          </div>
        )}
        {!collection.image && (
          <h1 className="text-4xl font-bold mb-4">{collection.name}</h1>
        )}
        {collection.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {collection.description}
          </p>
        )}
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No products in this collection yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard
                key={product.id || product._id}
                id={product.id || product._id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                image={product.images[0]}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/collections/${slug}`}
          />
        </>
      )}
    </div>
  );
}

