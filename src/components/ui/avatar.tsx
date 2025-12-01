'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  /** Fallback image URLs to try if the primary src fails */
  fallbackSrcs?: string[];
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Priority loading - set true for above-the-fold images */
  priority?: boolean;
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-24 w-24 text-xl',
};

// Pixel sizes for Next.js Image optimization
const pixelSizes = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const Avatar = React.memo(React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallbackSrcs = [], alt, fallback, size = 'md', priority = false, ...props }, ref) => {
    // Create stable key from sources to detect actual content changes
    // This prevents reset loops caused by array reference changes
    const sourcesKey = React.useMemo(() => {
      return [src, ...fallbackSrcs].filter(Boolean).join('|');
    }, [src, fallbackSrcs]);

    // Build array of all image sources to try
    const allSrcs = React.useMemo(() => {
      const sources: string[] = [];
      if (src) sources.push(src);
      sources.push(...fallbackSrcs);
      return sources;
    }, [src, fallbackSrcs]);

    // Track which source index we're currently trying
    const [srcIndex, setSrcIndex] = React.useState(0);

    // Reset source index only when actual source URLs change (not just references)
    React.useEffect(() => {
      setSrcIndex(0);
    }, [sourcesKey]);

    const currentSrc = allSrcs[srcIndex];
    const allSourcesFailed = srcIndex >= allSrcs.length;
    const pixelSize = pixelSizes[size];

    const handleError = () => {
      // Try next source in the list
      setSrcIndex((prev) => prev + 1);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-md bg-muted',
          sizeMap[size],
          className
        )}
        {...props}
      >
        {currentSrc && !allSourcesFailed ? (
          <Image
            src={currentSrc}
            alt={alt || 'Avatar'}
            width={pixelSize}
            height={pixelSize}
            className="aspect-square h-full w-full object-cover image-pixelated"
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald to-diamond text-white font-semibold">
            {fallback || alt?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
    );
  }
));
Avatar.displayName = 'Avatar';

export { Avatar };
