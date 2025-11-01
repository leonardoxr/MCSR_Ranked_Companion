'use client';

import * as React from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
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

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imagePath}
        alt={getAchievementName(achievement.id)}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setImageError(true)}
        unoptimized // For now, optimize later if needed
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
      className={`flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent transition-colors ${className}`}
      title={`${achievementName} - Level ${achievement.level}`}
    >
      <AchievementIcon achievement={achievement} size={64} className="mb-2" />
      <span className="text-sm font-medium text-center">
        {achievementName}
      </span>
      <span className="text-xs text-muted-foreground">
        Level {achievement.level}
      </span>
      {achievement.value !== null && achievement.goal !== null && (
        <div className="w-full mt-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${Math.min((achievement.value / achievement.goal) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">
            {achievement.value} / {achievement.goal}
          </span>
        </div>
      )}
    </div>
  );
}

