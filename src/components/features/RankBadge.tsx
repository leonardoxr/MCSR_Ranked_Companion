'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui';
import { getRankTier } from '@/lib/utils/colors';
import { cn } from '@/lib/utils';
import type { EloRate } from '@/types/api';

export interface RankBadgeProps {
  elo: EloRate;
  className?: string;
  showElo?: boolean;
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
export function RankBadge({ elo, className, showElo = false }: RankBadgeProps) {
  const t = useTranslations();
  const rank = getRankTier(elo);
  const variant = rankVariantMap[rank.name] || 'coal';

  // Translate rank name
  const rankNameKey = `ranks.${rank.name.toLowerCase()}`;
  const translatedRankName = t(rankNameKey);

  return (
    <Badge variant={variant} className={cn('font-semibold', className)}>
      {translatedRankName}
      {showElo && ` • ${elo.toLocaleString()}`}
    </Badge>
  );
}
