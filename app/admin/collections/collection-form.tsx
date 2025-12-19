'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { createCollection, updateCollection } from '@/actions/collection-actions';
import { toast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';

interface CollectionFormProps {
  collection?: any;
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState(collection?.slug || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      slug: formData.get('slug') as string,
      image: formData.get('image') as string,
      featured: formData.get('featured') === 'on',
    };

    const result = collection
      ? await updateCollection(collection._id, data)
      : await createCollection(data);

    setLoading(false);

    if ('success' in result && result.success) {
      toast({
        title: 'Success',
        description: `Collection ${collection ? 'updated' : 'created'} successfully`,
      });
      router.push('/admin/collections');
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!collection) {
      setSlug(slugify(e.target.value));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={collection?.name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={collection?.description}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={collection?.image}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={collection?.featured}
              className="rounded"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Collection
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Saving...'
                : collection
                ? 'Update Collection'
                : 'Create Collection'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

