'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/actions/auth-actions';
import { toast } from '@/hooks/use-toast';

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = await login(data);

    setLoading(false);

    if ('success' in result && result.success) {
      toast({
        title: 'Success',
        description: 'You have been signed in successfully',
      });
      router.push('/');
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: ('error' in result ? result.error : undefined) || 'Failed to sign in',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>

      <LoadingButton 
        type="submit" 
        className="w-full" 
        loading={loading}
        loadingText="Signing in..."
      >
        Sign In
      </LoadingButton>
    </form>
  );
}

