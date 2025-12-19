'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
}

export function ProductCard({ id, title, slug, price, image }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={image?.includes('unsplash.com') || (image?.startsWith('http') && !image?.includes('cloudinary'))}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="18"%3EImage%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 mb-2">{title}</h3>
          <p className="text-xl font-bold">{formatPrice(price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

