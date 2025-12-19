import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, getProducts } from '@/actions/product-actions';
import { ProductCard } from '@/components/product-card';
import { AddToCartForm } from './add-to-cart-form';
import { formatPrice } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: result.product.title,
    description: result.product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.product) {
    notFound();
  }

  const product = result.product;

  // Get related products from same category
  const relatedResult = await getProducts({
    category: product.category,
    limit: 4,
  });
  const relatedProducts = (relatedResult.products || []).filter(
    (p: any) => p._id !== product._id
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="prose prose-sm max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Category: <span className="font-medium">{product.category}</span>
            </p>
          </div>

          {/* Add to Cart Form */}
          <AddToCartForm product={product} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product: any) => (
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
    </div>
  );
}

