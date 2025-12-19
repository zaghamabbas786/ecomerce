import { redirect } from 'next/navigation';
import { getCart, calculateCartTotal } from '@/lib/cart';
import { CheckoutForm } from './checkout-form';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export const metadata = {
  title: 'Checkout',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.length === 0) {
    redirect('/cart');
  }

  const totals = calculateCartTotal(cart);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <CheckoutForm cart={cart} totals={totals} />
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
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

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

