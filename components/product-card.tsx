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
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

