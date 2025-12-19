import { ProductForm } from '../product-form';

export const metadata = {
  title: 'Add Product',
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Add New Product</h1>
      <ProductForm />
    </div>
  );
}

