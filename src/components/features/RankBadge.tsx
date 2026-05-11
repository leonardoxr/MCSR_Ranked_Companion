'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui';
import { getRankTier } from '@/lib/utils/colors';
import { getRankTier as getSpriteRankTier } from '@/utils/ranks';
import { MinecraftIcon, type MinecraftIconName } from '@/components/features/MinecraftIcon';
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

// Map rank names to Minecraft pickaxe icons
const rankPickaxeMap: Record<string, MinecraftIconName> = {
  Unrated: 'wooden-pickaxe',
  Coal: 'stone-pickaxe',
  Iron: 'iron-pickaxe',
  Gold: 'golden-pickaxe',
  Emerald: 'copper-pickaxe', // No emerald pickaxe in Minecraft, using copper
  Diamond: 'diamond-pickaxe',
  Netherite: 'netherite-pickaxe',
};

/**
 * RankBadge component for displaying player rank based on ELO
 * Shows rank tier with optional ELO rating
 */
export function RankBadge({ elo, className, showElo = false, showText = true }: RankBadgeProps) {
  const t = useTranslations();
  const rank = getRankTier(elo);
  const spriteTier = getSpriteRankTier(elo);
  const variant = rankVariantMap[rank.name] || 'coal';
  const pickaxeIcon = rankPickaxeMap[spriteTier.name] || 'wooden-pickaxe';

  // Translate rank name
  const rankNameKey = `ranks.${rank.name.toLowerCase()}`;
  const translatedRankName = t(rankNameKey);

  return (
    <Badge variant={variant} className={cn('font-semibold flex items-center gap-1', className)}>
      <MinecraftIcon name={pickaxeIcon} size="sm" className="flex-shrink-0" />
      {showText && (
        <span>
          {spriteTier.name}
          {spriteTier.level ? ` ${spriteTier.level}` : ''}
        </span>
      )}
      {showElo && <span>{` • ${elo.toLocaleString()} elo`}</span>}
    </Badge>
  );
}
