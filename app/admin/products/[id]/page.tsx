import { notFound } from 'next/navigation';
import { getProductById } from '@/actions/product-actions';
import { ProductForm } from '../product-form';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Product',
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const result = await getProductById(id);

  if (!result.product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={result.product} />
    </div>
  );
}

