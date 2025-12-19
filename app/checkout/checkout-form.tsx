'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrder } from '@/actions/order-actions';
import { clearCartAction } from '@/actions/cart-actions';
import { toast } from '@/hooks/use-toast';
import type { CartItem } from '@/lib/cart';

interface CheckoutFormProps {
  cart: CartItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export function CheckoutForm({ cart, totals }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image,
      })),
      shippingAddress: {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zipCode: formData.get('zipCode') as string,
        country: formData.get('country') as string,
      },
      paymentMethod: 'stripe', // Placeholder
    };

    const result = await createOrder(orderData);

    setLoading(false);

    if (result.success && result.order) {
      // Clear cart
      await clearCartAction();

      toast({
        title: 'Order placed successfully!',
        description: `Order number: ${result.order.orderNumber}`,
      });

      router.push(`/account/orders/${result.order._id}`);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to place order',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" name="fullName" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input id="address" name="address" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" required />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" name="state" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input id="zipCode" name="zipCode" required />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input id="country" name="country" defaultValue="United States" required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Payment processing with Stripe (placeholder integration)
          </p>
          <LoadingButton 
            type="submit" 
            size="lg" 
            className="w-full" 
            loading={loading}
            loadingText="Processing..."
          >
            Place Order - ${totals.total.toFixed(2)}
          </LoadingButton>
        </CardContent>
      </Card>
    </form>
  );
}

