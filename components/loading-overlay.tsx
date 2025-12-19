'use client';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  loading: boolean;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ loading, text, fullScreen }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
        fullScreen
          ? 'fixed inset-0 z-50'
          : 'absolute inset-0 z-10'
      )}
    >
      <Spinner size="lg" />
      {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

