import Link from 'next/link';
import { getUserOrders } from '@/actions/order-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'My Orders',
};

export default async function OrdersPage() {
  const result = await getUserOrders();

  if (result.error) {
    redirect('/auth/signin');
  }

  const orders = result.orders || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8">
            Start shopping to see your orders here
          </p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-semibold text-lg">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm mt-1">
                      Status:{' '}
                      <span className="font-medium capitalize">
                        {order.orderStatus}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xl font-bold">
                      {formatPrice(order.total)}
                    </p>
                    <Button asChild variant="outline">
                      <Link href={`/account/orders/${order._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

