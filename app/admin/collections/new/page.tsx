import { CollectionForm } from '../collection-form';

export const metadata = {
  title: 'Add Collection',
};

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Add New Collection</h1>
      <CollectionForm />
    </div>
  );
}

