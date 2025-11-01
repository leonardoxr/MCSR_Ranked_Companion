'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CountryCode } from '@/types/api';

export interface CountryFlagProps {
  country: CountryCode | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

const sizeMap = {
  xs: { width: 16, height: 12 },
  sm: { width: 20, height: 15 },
  md: { width: 24, height: 18 },
  lg: { width: 32, height: 24 },
} as const;

/**
 * CountryFlag component for displaying nationality flags
 * Uses flagcdn.com API for flag images
 */
export function CountryFlag({
  country,
  size = 'sm',
  className,
  showTooltip = true,
}: CountryFlagProps) {
  if (!country) {
    return null;
  }

  const { width, height } = sizeMap[size];
  const countryCode = country.toLowerCase();
  const flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;

  return (
    <span
      className={cn('inline-flex items-center justify-center', className)}
      title={showTooltip ? country.toUpperCase() : undefined}
    >
      <Image
        src={flagUrl}
        alt={`${country.toUpperCase()} flag`}
        width={width}
        height={height}
        className="rounded-sm object-cover"
        unoptimized={false}
      />
    </span>
  );
}
