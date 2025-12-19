import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCollections } from '@/actions/collection-actions';
import { Plus } from 'lucide-react';
import { CollectionActions } from './collection-actions';

export const metadata = {
  title: 'Collections Management',
};

export default async function AdminCollectionsPage() {
  const result = await getCollections();
  const collections = ('collections' in result ? result.collections : null) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Collections</h1>
        <Button asChild>
          <Link href="/admin/collections/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No collections found. Create your first collection!
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection: any) => (
                <TableRow key={collection._id}>
                  <TableCell>
                    {collection.image ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {collection.name[0]}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {collection.name}
                  </TableCell>
                  <TableCell>{collection.slug}</TableCell>
                  <TableCell>
                    {collection.featured ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <CollectionActions id={collection._id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

