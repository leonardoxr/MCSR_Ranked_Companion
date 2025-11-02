"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './RankBadge.module.css';
import { getRankTier } from '@/utils/ranks';
import { RANK_SPRITE_BASE64 } from '@/constants/rankSprite';

export interface RankBadgeProps {
  elo: number | null;
  showText?: boolean;
  showElo?: boolean;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  elo,
  showText = true,
  showElo = true,
  className,
}) => {
  const t = useTranslations();
  const rankTier = getRankTier(elo);

  // CSS custom properties for sprite URL and index
  const spriteStyle = {
    ['--sprite-index' as any]: rankTier.spriteIndex,
    ['--rank-sprite-url' as any]: `url('${RANK_SPRITE_BASE64}')`,
  } as React.CSSProperties;

  const textClass = rankTier.name === 'Gold' || rankTier.name === 'Netherite'
    ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]'
    : 'text-white/90';

  return (
    <span className={`inline-flex items-center gap-1 align-middle ${className ?? ''}`}>
      <span className={styles.rankIcon} style={spriteStyle} />
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

