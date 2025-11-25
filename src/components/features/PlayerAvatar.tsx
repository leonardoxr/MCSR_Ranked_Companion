'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { getAvatarUrls, AVATAR_SIZES } from '@/lib/api/avatar-cache';
import type { UUID } from '@/types/api';

export interface PlayerAvatarProps {
  uuid?: UUID;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOverlay?: boolean;
  /** Priority loading - set true for above-the-fold avatars */
  priority?: boolean;
}

/**
 * PlayerAvatar component for displaying Minecraft player avatars
 * Uses Crafatar API for rendering player heads with Cloudhaven as fallback
 * Implements smart caching with daily rotation for efficient loading
 */
export function PlayerAvatar({
  uuid,
  username,
  size = 'md',
  className,
  showOverlay = true,
  priority = false,
}: PlayerAvatarProps) {
  const t = useTranslations();

  // Get optimized avatar URLs with cache versioning
  // Request appropriate size from Crafatar to avoid over-fetching
  const requestedSize = uuid ? AVATAR_SIZES[size] : undefined;
  const urls = uuid
    ? getAvatarUrls(uuid, { overlay: showOverlay, size: requestedSize })
    : null;

  return (
    <Avatar
      src={urls?.primary}
      fallbackSrcs={urls ? [urls.fallback] : []}
      alt={username || t('common.player')}
      fallback={username?.[0]?.toUpperCase()}
      size={size}
      priority={priority}
      className={cn('border-2 border-border', className)}
    />
  );
}
