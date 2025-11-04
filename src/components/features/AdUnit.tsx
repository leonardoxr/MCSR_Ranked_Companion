'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type AdSize = 
  | 'banner' // 728x90
  | 'large-banner' // 970x90
  | 'rectangle' // 300x250
  | 'wide-skyscraper' // 160x600
  | 'square' // 250x250
  | 'responsive';

interface AdUnitProps {
  /**
   * AdSense ad unit slot ID (e.g., '1234567890')
   * Format: publisher-id/ad-unit-id
   */
  adSlot: string;
  /**
   * Size of the ad
   */
  size?: AdSize;
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Whether to hide on mobile devices
   */
  hideOnMobile?: boolean;
  /**
   * Whether to hide on desktop devices
   */
  hideOnDesktop?: boolean;
  /**
   * Custom style for the ad container
   */
  style?: React.CSSProperties;
}

/**
 * AdUnit component for displaying Google AdSense ads
 * 
 * Usage:
 * <AdUnit 
 *   adSlot="1234567890/6789012345" 
 *   size="banner"
 *   hideOnMobile={true}
 * />
 */
export function AdUnit({
  adSlot,
  size = 'responsive',
  className,
  hideOnMobile = false,
  hideOnDesktop = false,
  style,
}: AdUnitProps) {
  const adRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Only load ads if AdSense is configured
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  if (!adsenseId) {
    return null; // Silently fail if not configured
  }

  // Size mapping for Google AdSense
  const sizeMap: Record<AdSize, { width: number; height: number } | 'responsive'> = {
    'banner': { width: 728, height: 90 },
    'large-banner': { width: 970, height: 90 },
    'rectangle': { width: 300, height: 250 },
    'wide-skyscraper': { width: 160, height: 600 },
    'square': { width: 250, height: 250 },
    'responsive': 'responsive',
  };

  const adSize = sizeMap[size];

  React.useEffect(() => {
    // Wait for AdSense script to load
    const initAd = () => {
      if (adRef.current && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setIsLoaded(true);
        } catch (error) {
          console.error('AdSense error:', error);
          setHasError(true);
        }
      } else {
        // If script not loaded yet, wait a bit and retry
        setTimeout(initAd, 100);
      }
    };

    // Small delay to ensure script is loaded
    const timer = setTimeout(initAd, 500);
    return () => clearTimeout(timer);
  }, [adsenseId]);

  // Don't render if there's an error or not configured
  if (hasError || !adsenseId) {
    return null;
  }

  const containerClassName = cn(
    'ad-container',
    'flex items-center justify-center',
    'bg-white/5 border border-white/10 rounded-lg',
    'overflow-hidden',
    hideOnMobile && 'hidden md:block',
    hideOnDesktop && 'block md:hidden',
    className
  );

  const adStyle: React.CSSProperties = {
    ...style,
    ...(adSize !== 'responsive' && {
      width: `${adSize.width}px`,
      height: `${adSize.height}px`,
      minWidth: `${adSize.width}px`,
      minHeight: `${adSize.height}px`,
    }),
  };

  return (
    <div className={containerClassName} style={adStyle}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(adSize === 'responsive' 
            ? { width: '100%', height: 'auto' }
            : { width: `${adSize.width}px`, height: `${adSize.height}px` }
          ),
        }}
        data-ad-client={adsenseId}
        data-ad-slot={adSlot}
        {...(adSize === 'responsive' 
          ? { 'data-ad-format': 'auto' }
          : { 
              'data-ad-width': adSize.width.toString(),
              'data-ad-height': adSize.height.toString(),
            }
        )}
        data-full-width-responsive={adSize === 'responsive' ? 'true' : 'false'}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">
          Ad
        </div>
      )}
    </div>
  );
}

/**
 * Convenience component for sidebar ads
 */
export function SidebarAd({ adSlot, className }: { adSlot: string; className?: string }) {
  return (
    <div className={cn('sticky top-20', className)}>
      <AdUnit 
        adSlot={adSlot} 
        size="wide-skyscraper" 
        hideOnMobile={true}
        className="w-full"
      />
    </div>
  );
}

/**
 * Convenience component for banner ads
 */
export function BannerAd({ adSlot, className }: { adSlot: string; className?: string }) {
  return (
    <AdUnit 
      adSlot={adSlot} 
      size="banner" 
      className={cn('w-full max-w-4xl mx-auto', className)}
      hideOnMobile={true}
    />
  );
}

/**
 * Convenience component for in-content rectangle ads
 */
export function InContentAd({ adSlot, className }: { adSlot: string; className?: string }) {
  return (
    <div className={cn('flex justify-center my-6', className)}>
      <AdUnit 
        adSlot={adSlot} 
        size="rectangle" 
        className="w-full max-w-xs"
      />
    </div>
  );
}

