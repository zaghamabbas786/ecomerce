export const metadata = {
  title: 'About Us',
  description: 'Learn more about Fashion Store and our mission to provide trendy and affordable clothing.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Fashion Store</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg text-muted-foreground">
            Welcome to Fashion Store, your one-stop destination for trendy and affordable clothing. 
            We are passionate about bringing you the latest fashion trends at prices that won't break the bank.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              Our mission is to make fashion accessible to everyone. We believe that everyone deserves 
              to look and feel great without spending a fortune. That's why we curate a wide selection 
              of stylish clothing and accessories that combine quality, style, and affordability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Trendy clothing for all occasions</li>
              <li>Curated collections from top brands</li>
              <li>Affordable prices without compromising quality</li>
              <li>Fast and reliable shipping</li>
              <li>Excellent customer service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground">
              At Fashion Store, we're committed to providing you with the best shopping experience. 
              From our carefully selected products to our customer-first approach, we strive to exceed 
              your expectations every step of the way.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

