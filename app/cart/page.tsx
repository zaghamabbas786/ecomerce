import Link from 'next/link';
import Image from 'next/image';
import { getCart, calculateCartTotal } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { CartActions } from './cart-actions';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Shopping Cart',
};

export default async function CartPage() {
  const cart = await getCart();
  const totals = calculateCartTotal(cart);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to get started!
          </p>
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={`${item.productId}-${item.size}-${item.color}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative w-24 h-24 flex-shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold hover:underline">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="font-bold mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <CartActions
                    productId={item.productId}
                    size={item.size}
                    color={item.color}
                    quantity={item.quantity}
                    stock={item.stock}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0
                      ? 'FREE'
                      : formatPrice(totals.shipping)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

