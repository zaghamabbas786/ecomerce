import { CollectionCard } from '@/components/collection-card';
import { getCollections } from '@/actions/collection-actions';

export const metadata = {
  title: 'Collections',
  description: 'Browse our curated fashion collections',
};

export default async function CollectionsPage() {
  const result = await getCollections();
  const collections = ('collections' in result ? result.collections : null) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Collections</h1>

      {collections.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No collections available yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection: any) => (
            <CollectionCard
              key={collection.id || collection._id}
              name={collection.name}
              slug={collection.slug}
              image={collection.image}
              description={collection.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}

