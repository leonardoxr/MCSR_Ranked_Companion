'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { UUID } from '@/types/api';

export interface PlayerAvatarProps {
  uuid?: UUID;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOverlay?: boolean;
}

/**
 * PlayerAvatar component for displaying Minecraft player avatars
 * Uses Crafatar API for rendering player heads with Cloudhaven as fallback
 */
export function PlayerAvatar({
  uuid,
  username,
  size = 'md',
  className,
  showOverlay = true,
}: PlayerAvatarProps) {
  const t = useTranslations();

  // Primary: Crafatar, Fallback: Cloudhaven
  const avatarUrl = uuid
    ? `https://crafatar.com/avatars/${uuid}?overlay=${showOverlay}`
    : undefined;

  const fallbackUrls = uuid
    ? [`https://avatars.cloudhaven.gg/avatars/${uuid}?overlay=${showOverlay}`]
    : [];

  return (
    <Avatar
      src={avatarUrl}
      fallbackSrcs={fallbackUrls}
      alt={username || t('common.player')}
      fallback={username?.[0]?.toUpperCase()}
      size={size}
      className={cn('border-2 border-border', className)}
    />
  );
}
