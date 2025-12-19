'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/actions/auth-actions';
import { toast } from '@/hooks/use-toast';

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = await register(data);

    setLoading(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Account created successfully. Please sign in.',
      });
      router.push('/auth/signin');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to create account',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      <LoadingButton 
        type="submit" 
        className="w-full" 
        loading={loading}
        loadingText="Creating account..."
      >
        Create Account
      </LoadingButton>
    </form>
  );
}

