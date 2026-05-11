"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { getRankTier } from '@/utils/ranks';
import { MinecraftIcon, type MinecraftIconName } from '@/components/features/MinecraftIcon';

export interface RankBadgeProps {
  elo: number | null;
  showText?: boolean;
  showElo?: boolean;
  className?: string;
}

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

export const RankBadge: React.FC<RankBadgeProps> = ({
  elo,
  showText = true,
  showElo = true,
  className,
}) => {
  const t = useTranslations();
  const rankTier = getRankTier(elo);
  const pickaxeIcon = rankPickaxeMap[rankTier.name] || 'wooden-pickaxe';

  const textClass = rankTier.name === 'Gold' || rankTier.name === 'Netherite'
    ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]'
    : 'text-white/90';

  return (
    <span className={`inline-flex items-center gap-1 align-middle ${className ?? ''}`}>
      <MinecraftIcon name={pickaxeIcon} size="sm" className="flex-shrink-0" />
      {showText && (
        <span className={`leading-none ${textClass}`}>
          {rankTier.name}
          {rankTier.level ? ` ${rankTier.level}` : ''}
        </span>
      )}
      {showElo && (
        <span className="text-muted-foreground">({typeof elo === 'number' ? elo : t('common.notAvailable')} {t('common.elo')})</span>
      )}
    </span>
  );
};

export default RankBadge;

