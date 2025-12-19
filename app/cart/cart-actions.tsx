'use client';

import { useState } from 'react';
import { LoadingButton } from '@/components/loading-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateCartItemAction, removeFromCartAction } from '@/actions/cart-actions';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface CartActionsProps {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

export function CartActions({
  productId,
  size,
  color,
  quantity,
  stock,
}: CartActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setLoading(true);
    const result = await updateCartItemAction(productId, size, color, newQuantity);
    setLoading(false);

    if ('success' in result && result.success) {
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Failed to update quantity',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    const result = await removeFromCartAction(productId, size, color);
    setLoading(false);

    if ('success' in result && result.success) {
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
      });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={quantity.toString()}
        onValueChange={(value) => handleQuantityChange(Number(value))}
        disabled={loading}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: Math.min(stock, 10) }, (_, i) => i + 1).map(
            (num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <LoadingButton
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        loading={loading}
      >
        <Trash2 className="h-4 w-4" />
      </LoadingButton>
    </div>
  );
}

