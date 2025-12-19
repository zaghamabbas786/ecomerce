import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
};

async function getDashboardStats() {
  await connectDB();

  const [productCount, orderCount, userCount, orders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.find().select('total').lean(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return {
    productCount,
    orderCount,
    userCount,
    totalRevenue,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Manage Products</h3>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove products
              </p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingBag className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">View Orders</h3>
              <p className="text-sm text-muted-foreground">
                Manage customer orders
              </p>
            </a>
            <a
              href="/admin/cms"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Edit Homepage</h3>
              <p className="text-sm text-muted-foreground">
                Customize homepage content
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

