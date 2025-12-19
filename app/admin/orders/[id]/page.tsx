import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/actions/order-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { OrderStatusUpdater } from './order-status-updater';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Order Details',
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  
  // For admin, we need to bypass auth check, so we'll connect directly
  const result = await getOrderById(id);

  if (!('order' in result) || !result.order) {
    notFound();
  }

  const order = result.order;

  return (
    <div>
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/admin/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusUpdater orderId={order._id} currentStatus={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">
                <span className="text-muted-foreground">Phone:</span>{' '}
                {order.shippingAddress.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{' '}
                {order.shippingAddress.email}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold capitalize mb-2">
                {order.orderStatus}
              </p>
              <p className="text-sm text-muted-foreground">
                Payment Status: <span className="capitalize">{order.paymentStatus}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Payment Method: {order.paymentMethod}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

