'use client';

import { useState } from 'react';
import { LoadingButton } from '@/components/loading-button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addToCartAction } from '@/actions/cart-actions';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddToCartFormProps {
  product: any;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const selectedVariant = product.variants.find(
    (v: any) => v.size === selectedSize && v.color === selectedColor
  );

  const availableStock = selectedVariant?.stock || 0;
  const canAddToCart = selectedSize && selectedColor && availableStock > 0;

  const handleAddToCart = async () => {
    if (!canAddToCart) return;

    setLoading(true);

    const result = await addToCartAction({
      productId: product.id || product._id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
      stock: availableStock,
    });

    setLoading(false);

    if ('success' in result && result.success) {
      toast({
        title: 'Added to cart',
        description: `${product.title} has been added to your cart.`,
      });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <Label>Size</Label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            {product.sizes.map((size: string) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Selection */}
      <div>
        <Label>Color</Label>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {product.colors.map((color: string) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stock Info */}
      {selectedSize && selectedColor && (
        <div className="text-sm">
          {availableStock > 0 ? (
            <p className="text-green-600 font-medium">
              {availableStock} in stock
            </p>
          ) : (
            <p className="text-destructive font-medium">Out of stock</p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div>
        <Label>Quantity</Label>
        <Select
          value={quantity.toString()}
          onValueChange={(value) => setQuantity(Number(value))}
          disabled={!canAddToCart}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: Math.min(availableStock, 10) },
              (_, i) => i + 1
            ).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add to Cart Button */}
      <LoadingButton
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        loading={loading}
        loadingText="Adding to Cart..."
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </LoadingButton>
    </div>
  );
}

