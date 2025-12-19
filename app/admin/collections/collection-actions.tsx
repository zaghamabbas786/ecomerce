'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteCollection } from '@/actions/collection-actions';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface CollectionActionsProps {
  id: string;
}

export function CollectionActions({ id }: CollectionActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteCollection(id);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Collection deleted',
        description: 'Collection has been deleted successfully',
      });
      setOpen(false);
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete collection',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="outline" asChild>
        <Link href={`/admin/collections/${id}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

