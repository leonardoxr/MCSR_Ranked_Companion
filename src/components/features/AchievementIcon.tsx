'use client';

import * as React from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAchievementImage, getAchievementName } from '@/lib/utils/achievements';
import type { Achievement } from '@/types/api';

interface AchievementIconProps {
  achievement: Achievement;
  size?: number;
  className?: string;
}

/**
 * AchievementIcon component that displays achievement images with fallback
 */
export function AchievementIcon({
  achievement,
  size = 64,
  className = '',
}: AchievementIconProps) {
  const imagePath = getAchievementImage(achievement.id);
  const [imageError, setImageError] = React.useState(false);

  // If no image path or image failed to load, show fallback icon
  if (!imagePath || imageError) {
    return (
      <Award
        className={`text-primary ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Choose a glow based on level to add excitement
  const glowClass = achievement.level >= 50
    ? 'glow-diamond'
    : achievement.level >= 30
    ? 'glow-emerald'
    : achievement.level >= 10
    ? 'glow-gold'
    : 'glow-redstone';

  return (
    <div className={cn('relative pixel-frame badge-sparkle', className)} style={{ width: size + 12, height: size + 12, padding: 6 }}>
      <Image
        src={imagePath}
        alt={getAchievementName(achievement.id)}
        width={size}
        height={size}
        className={cn('object-contain image-pixelated', glowClass)}
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

/**
 * AchievementCard component for displaying individual achievements
 */
export function AchievementCard({ achievement, className = '' }: AchievementCardProps) {
  const achievementName = getAchievementName(achievement.id);

  return (
    <div
      className={cn('mc-card flex flex-col items-center p-4 rounded-lg hover:bg-accent/40 transition-colors', className)}
      title={`${achievementName} - Level ${achievement.level}`}
    >
      <AchievementIcon achievement={achievement} size={64} className="mb-3" />
      <span className="text-sm font-semibold text-center mc-title">
        {achievementName}
      </span>
      <span className="text-xs text-muted-foreground">Level {achievement.level}</span>
      {achievement.value !== null && achievement.goal !== null && (
        <div className="w-full mt-3">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald/70 via-diamond/80 to-gold/70 transition-all"
              style={{
                width: `${Math.min((achievement.value / achievement.goal) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {achievement.value} / {achievement.goal}
          </span>
        </div>
      )}
    </div>
  );
}

