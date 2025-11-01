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

  return (
    <span className={`flex items-center gap-1 ${className ?? ''}`}>
      <span className={styles.rankIcon} style={spriteStyle} />
      {showText && (
        <span style={{ color: rankTier.color }}>
          {rankTier.name}
          {rankTier.level ? ` ${rankTier.level}` : ''}
        </span>
      )}
      {showElo && (
        <span>({typeof elo === 'number' ? elo : t('common.notAvailable')} {t('common.elo')})</span>
      )}
    </span>
  );
};

export default RankBadge;

