'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSiteSettings } from '@/actions/cms-actions';
import { toast } from '@/hooks/use-toast';

interface SettingsFormProps {
  settings: any;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      siteName: formData.get('siteName') as string,
      logo: formData.get('logo') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      facebook: formData.get('facebook') as string,
      instagram: formData.get('instagram') as string,
      twitter: formData.get('twitter') as string,
    };

    const result = await updateSiteSettings(data);

    setLoading(false);

    if ('success' in result && result.success) {
      toast({
        title: 'Settings updated',
        description: 'Site settings have been updated successfully',
      });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="siteName">Site Name *</Label>
        <Input
          id="siteName"
          name="siteName"
          defaultValue={settings?.siteName}
          required
        />
      </div>

      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          name="logo"
          type="url"
          defaultValue={settings?.logo}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Contact Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={settings?.email}
          />
        </div>

        <div>
          <Label htmlFor="phone">Contact Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={settings?.phone}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={settings?.address}
        />
      </div>

      <div className="space-y-2">
        <Label>Social Media Links</Label>
        <Input
          id="facebook"
          name="facebook"
          placeholder="Facebook URL"
          defaultValue={settings?.facebook}
        />
        <Input
          id="instagram"
          name="instagram"
          placeholder="Instagram URL"
          defaultValue={settings?.instagram}
        />
        <Input
          id="twitter"
          name="twitter"
          placeholder="Twitter URL"
          defaultValue={settings?.twitter}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
}

