'use client';

import * as React from 'react';
import { Badge } from '@/components/ui';
import { getRankTier } from '@/lib/utils/colors';
import { getRankTier as getSpriteRankTier } from '@/utils/ranks';
import { RANK_SPRITE_BASE64 } from '@/constants/rankSprite';
import { cn } from '@/lib/utils';
import type { EloRate } from '@/types/api';

export interface RankBadgeProps {
  elo: EloRate;
  className?: string;
  showElo?: boolean;
  showText?: boolean;
}

const rankVariantMap: Record<string, 'coal' | 'iron' | 'gold' | 'emerald' | 'diamond' | 'netherite'> = {
  Coal: 'coal',
  Iron: 'iron',
  Gold: 'gold',
  Emerald: 'emerald',
  Diamond: 'diamond',
  Netherite: 'netherite',
};

/**
 * RankBadge component for displaying player rank based on ELO
 * Shows rank tier with optional ELO rating
 */
export function RankBadge({ elo, className, showElo = false, showText = true }: RankBadgeProps) {
  const rank = getRankTier(elo);
  const spriteTier = getSpriteRankTier(elo);
  const variant = rankVariantMap[rank.name] || 'coal';

  return (
    <Badge variant={variant} className={cn('font-semibold flex items-center gap-1', className)}>
      <span
        style={{
          ['--sprite-index' as any]: spriteTier.spriteIndex,
          ['--rank-sprite-url' as any]: `url('${RANK_SPRITE_BASE64}')`,
          width: 13,
          height: 13,
          display: 'inline-block',
          backgroundImage: `var(--rank-sprite-url)` as any,
          backgroundPosition: `calc(var(--sprite-index) * -13px) 0`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        } as React.CSSProperties}
      />
      {showText && (
        <span style={{ color: spriteTier.color }}>
          {spriteTier.name}
          {spriteTier.level ? ` ${spriteTier.level}` : ''}
        </span>
      )}
      {showElo && <span>{` • ${elo.toLocaleString()} elo`}</span>}
    </Badge>
  );
}
