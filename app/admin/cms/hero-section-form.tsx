'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateHeroSection } from '@/actions/cms-actions';
import { toast } from '@/hooks/use-toast';

interface HeroSectionFormProps {
  hero: any;
}

export function HeroSectionForm({ hero }: HeroSectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      image: formData.get('image') as string,
      ctaText: formData.get('ctaText') as string,
      ctaLink: formData.get('ctaLink') as string,
    };

    const result = await updateHeroSection(data);

    setLoading(false);

    if (result.success) {
      toast({
        title: 'Hero section updated',
        description: 'Homepage hero section has been updated successfully',
      });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update hero section',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={hero?.title}
          required
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          name="subtitle"
          defaultValue={hero?.subtitle}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="image">Hero Image URL</Label>
        <Input
          id="image"
          name="image"
          type="url"
          defaultValue={hero?.image}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ctaText">CTA Button Text</Label>
          <Input
            id="ctaText"
            name="ctaText"
            defaultValue={hero?.ctaText}
          />
        </div>

        <div>
          <Label htmlFor="ctaLink">CTA Button Link</Label>
          <Input
            id="ctaLink"
            name="ctaLink"
            defaultValue={hero?.ctaLink}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Hero Section'}
      </Button>
    </form>
  );
}

