import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { CollectionCard } from '@/components/collection-card';
import { getProducts } from '@/actions/product-actions';
import { getCollections } from '@/actions/collection-actions';
import { getActiveHeroSection } from '@/actions/cms-actions';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Home',
};

export default async function HomePage() {
  const [heroResult, featuredProductsResult, collectionsResult] =
    await Promise.all([
      getActiveHeroSection(),
      getProducts({ featured: true, limit: 8 }),
      getCollections(true),
    ]);

  const hero = ('heroSection' in heroResult ? heroResult.heroSection : null);
  const featuredProducts = ('products' in featuredProductsResult ? featuredProductsResult.products : null) || [];
  const collections = ('collections' in collectionsResult ? collectionsResult.collections : null) || [];

  return (
    <div>
      {/* Hero Section */}
      {hero && (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          {hero.image && (
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
                {hero.subtitle}
              </p>
            )}
            {hero.ctaText && hero.ctaLink && (
              <Button size="lg" asChild>
                <Link href={hero.ctaLink}>
                  {hero.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </section>
      )}

      {/* Featured Collections */}
      {collections.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Collections</h2>
            <Button variant="outline" asChild>
              <Link href="/collections">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.slice(0, 3).map((collection: any) => (
              <CollectionCard
                key={collection._id}
                name={collection.name}
                slug={collection.slug}
                image={collection.image}
                description={collection.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/shop">Shop All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
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
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          New Season, New Style
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover the latest trends in fashion and elevate your wardrobe with our curated collection.
        </p>
        <Button size="lg" asChild>
          <Link href="/shop">
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

