'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BannersListProps {
  banners: any[];
}

export function BannersList({ banners }: BannersListProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Manage promotional banners for the homepage
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No banners created yet
        </p>
      ) : (
        <div className="space-y-2">
          {banners.map((banner: any) => (
            <div
              key={banner._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{banner.title}</p>
                <p className="text-sm text-muted-foreground">
                  {banner.description}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {banner.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

