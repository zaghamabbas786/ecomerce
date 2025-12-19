import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, Globe, Package } from 'lucide-react';

export const metadata = {
  title: 'Shipping Information',
  description: 'Learn about our shipping options, delivery times, and international shipping policies.',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Shipping Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Standard Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">$5.99</p>
              <p className="text-muted-foreground">
                Delivery within 5-7 business days
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Free shipping on orders over $50
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Express Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">$14.99</p>
              <p className="text-muted-foreground">
                Delivery within 2-3 business days
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Available for most locations
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              International Shipping
            </CardTitle>
            <CardDescription>
              We ship to over 50 countries worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              International shipping rates and delivery times vary by destination. 
              Standard international shipping typically takes 10-15 business days.
            </p>
            <p className="text-sm text-muted-foreground">
              Please note: International orders may be subject to customs fees and import taxes, 
              which are the responsibility of the customer.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-muted-foreground">
                  Orders are typically processed within 1-2 business days. During peak seasons 
                  or sales, processing may take up to 3 business days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tracking</h3>
                <p className="text-muted-foreground">
                  Once your order ships, you'll receive a tracking number via email. 
                  You can track your package in real-time using the tracking link provided.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery</h3>
                <p className="text-muted-foreground">
                  Packages are delivered Monday through Friday, excluding holidays. 
                  A signature may be required for high-value orders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Some items may have shipping restrictions based on size, weight, or destination. 
              If your order contains restricted items, our team will contact you to discuss alternatives.
            </p>
            <p className="text-sm text-muted-foreground">
              For questions about shipping to your location, please{' '}
              <a href="/contact" className="text-primary hover:underline">
                contact our support team
              </a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

