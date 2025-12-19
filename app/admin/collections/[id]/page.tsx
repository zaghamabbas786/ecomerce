import { notFound } from 'next/navigation';
import { getCollectionById } from '@/actions/collection-actions';
import { CollectionForm } from '../collection-form';

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Collection',
};

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { id } = await params;
  const result = await getCollectionById(id);

  if (!('collection' in result) || !result.collection) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Edit Collection</h1>
      <CollectionForm collection={result.collection} />
    </div>
  );
}

