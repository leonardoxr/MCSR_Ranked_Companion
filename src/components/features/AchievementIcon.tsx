'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAchievementImage, getAchievementTranslationKey, getBestTimeLabel } from '@/lib/utils/achievements';
import type { Achievement } from '@/types/api';

interface AchievementIconProps {
  achievement: Achievement;
  size?: number;
  className?: string;
}

/**
 * AchievementIcon component that displays achievement images with fallback and overlays
 */
export function AchievementIcon({
  achievement,
  size = 64,
  className = '',
  showOverlays = false,
}: AchievementIconProps & { showOverlays?: boolean }) {
  const t = useTranslations();
  const imagePath = getAchievementImage(achievement); // Pass full achievement object
  const [imageError, setImageError] = React.useState(false);
  
  // Get translated achievement name for alt text
  const translationKey = getAchievementTranslationKey(achievement.id);
  const achievementName = t(`achievements.${translationKey}`, { 
    defaultValue: translationKey 
  });

  // Extract season and placement information for overlays
  let seasonNumber: string | null = null;
  let placement: string | null = null;
  let timeLabel: string | null = null;
  let isCompetitiveAchievement = false; // Track if this is a competitive achievement (level not meaningful)
  
  // Get time label for Break the Barrier achievement (bestTime)
  // According to wiki: Level Achievements section - Break the Barrier shows time labels like "Sub6", "Sub9"
  if (achievement.id === 'bestTime') {
    timeLabel = getBestTimeLabel(achievement.level);
  }
  
  // Parse achievement data based on achievement type
  // Reference: API docs and actual API responses
  if (achievement.data && achievement.data.length > 0) {
    if (achievement.id === 'seasonResult') {
      isCompetitiveAchievement = true;
      // seasonResult: data[0] = season number (for display at top left), level = placement (for display at bottom right)
      // data[1] is still used for image selection (bracket value)
      // Example: {"data":["5"],"level":7} = season 5, placement 7
      if (achievement.data.length >= 1) {
        seasonNumber = achievement.data[0]; // Season number for overlay display at top left
      }
      placement = String(achievement.level); // Level is the placement for overlay display at bottom right
    } else if (achievement.id === 'SeasonOutcome') {
      isCompetitiveAchievement = true;
      // Legacy format: data[0] = season, data[1] = placement
      if (achievement.data.length >= 2) {
        seasonNumber = achievement.data[0];
        placement = achievement.data[1];
      } else {
        seasonNumber = achievement.data[0];
      }
    } else if (achievement.id === 'playoffsResult' || achievement.id === 'PlayoffsOutcome') {
      isCompetitiveAchievement = true;
      // playoffsResult: level = placement (determines image: 1, 2, 3, or participant)
      // data[0] = season number (for display only)
      // The level value IS the placement that determines the image
      placement = String(achievement.level); // Level IS the placement value
      if (achievement.data && achievement.data.length > 0) {
        seasonNumber = achievement.data[0]; // data[0] is season number
      }
    } else if (achievement.id === 'weeklyRace' || achievement.id === 'WeeklyRace') {
      isCompetitiveAchievement = true;
      // weeklyRace: data[0] = placement (top X), data[1] = count/season (if available)
      placement = achievement.data[0];
      if (achievement.data.length >= 2) {
        seasonNumber = achievement.data[1];
      }
    }
  }

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
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={imagePath}
          alt={achievementName}
          width={size}
          height={size}
          className={cn('object-contain image-pixelated relative', glowClass)}
          onError={() => setImageError(true)}
          unoptimized
          style={{ position: 'relative', zIndex: 1 }}
        />
        {/* Overlays rendered on top of the image */}
        {showOverlays && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
            {/* Top Left: Season number with S prefix - shown for competitive achievements */}
            {seasonNumber && (
              <span 
                className="absolute text-white font-monocraft leading-none whitespace-nowrap"
                style={{ 
                  top: '2px',
                  left: '2px',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.95), -2px -2px 0px rgba(0,0,0,0.95), 2px -2px 0px rgba(0,0,0,0.95), -2px 2px 0px rgba(0,0,0,0.95)',
                  fontSize: '22px',
                  lineHeight: '1.1',
                  fontWeight: 'bold',
                }}
              >
                S{seasonNumber}
              </span>
            )}
            
            {/* Bottom Left: Level (shown only for progressive achievements, excluding bestTime and one-time achievements) */}
            {/* Competitive achievements (playoffs, seasonResult, weeklyRace) don't show level - the meaningful value is placement */}
            {/* bestTime achievements only show time label, not level */}
            {/* One-time achievements don't show level */}
            {(() => {
              // List of one-time achievements that should not show level
              const ONE_TIME_ACHIEVEMENTS = new Set([
                'foodless',
                'classicRun',
                'ironHoe',
                'armorless',
                'ironPickless',
                'overtake',
                'netherite',
                'highLevel',
                'egapHolder',
                'summonWither',
                'oneshot',
                'secret',
              ]);
              
              // Progressive achievements that show level
              const PROGRESSIVE_ACHIEVEMENTS = new Set([
                'highestWinStreak',
                'playedMatches',
                'playtime',
                'wins',
              ]);
              
              const isProgressive = PROGRESSIVE_ACHIEVEMENTS.has(achievement.id);
              const isOneTime = ONE_TIME_ACHIEVEMENTS.has(achievement.id);
              
              return !isCompetitiveAchievement && 
                     achievement.id !== 'bestTime' && 
                     !timeLabel && 
                     !isOneTime && 
                     isProgressive;
            })() && (
              <span 
                className="absolute text-white font-monocraft leading-none whitespace-nowrap"
                style={{ 
                  bottom: '2px',
                  left: '2px',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.95), -2px -2px 0px rgba(0,0,0,0.95), 2px -2px 0px rgba(0,0,0,0.95), -2px 2px 0px rgba(0,0,0,0.95)',
                  fontSize: '22px',
                  lineHeight: '1.1',
                  fontWeight: 'bold',
                }}
              >
                Lv.{achievement.level}
              </span>
            )}
            
            {/* Bottom Right: Placement for seasonResult achievements */}
            {/* Season placement achievements show placement at bottom right with # prefix */}
            {placement && achievement.id === 'seasonResult' && (
              <span 
                className="absolute text-white font-monocraft leading-none whitespace-nowrap"
                style={{ 
                  bottom: '2px',
                  right: '2px',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.95), -2px -2px 0px rgba(0,0,0,0.95), 2px -2px 0px rgba(0,0,0,0.95), -2px 2px 0px rgba(0,0,0,0.95)',
                  fontSize: '22px',
                  lineHeight: '1.1',
                  fontWeight: 'bold',
                }}
              >
                #{placement}
              </span>
            )}
            
            {/* Bottom Left: Placement/Rank with # prefix (only for non-competitive achievements that aren't seasonResult) */}
            {/* For other achievements, only show if there's no time label (time label takes priority for bestTime) */}
            {placement && !isCompetitiveAchievement && !timeLabel && achievement.id !== 'seasonResult' && (
              <span 
                className="absolute text-white font-monocraft leading-none whitespace-nowrap"
                style={{ 
                  bottom: '2px',
                  left: `${2 + (String(achievement.level).length + 4) * 14}px`, // Position after "Lv.X "
                  textShadow: '2px 2px 0px rgba(0,0,0,0.95), -2px -2px 0px rgba(0,0,0,0.95), 2px -2px 0px rgba(0,0,0,0.95), -2px 2px 0px rgba(0,0,0,0.95)',
                  fontSize: '22px',
                  lineHeight: '1.1',
                  fontWeight: 'bold',
                }}
              >
                #{placement}
              </span>
            )}
            
            {/* Bottom Center: Time label for Break the Barrier (e.g., "Sub6", "Sub9") */}
            {/* According to wiki Level Achievements section - displayed at bottom center */}
            {timeLabel && (
              <span 
                className="absolute text-white font-monocraft leading-none whitespace-nowrap"
                style={{ 
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.95), -2px -2px 0px rgba(0,0,0,0.95), 2px -2px 0px rgba(0,0,0,0.95), -2px 2px 0px rgba(0,0,0,0.95)',
                  fontSize: '22px',
                  lineHeight: '1.1',
                  fontWeight: 'bold',
                }}
              >
                {timeLabel}
              </span>
            )}
          </div>
        )}
      </div>
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
  const t = useTranslations();
  const translationKey = getAchievementTranslationKey(achievement.id);
  
  // Get translated name and description
  const achievementName = t(`achievements.${translationKey}`, { 
    defaultValue: translationKey 
  });
  const achievementDescription = t(`achievements.${translationKey}Description`, { 
    defaultValue: '' 
  });
  
  // Format date if available
  const formattedDate = achievement.date 
    ? new Date(achievement.date * 1000).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;

  return (
    <div
      className={cn('mc-card flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent/40 transition-colors relative', className)}
      style={{ minHeight: '100px' }}
    >
      {/* Achievement icon with overlays rendered on top - wrapped in tooltip */}
      <div className="relative group">
        <AchievementIcon achievement={achievement} size={64} className="mb-0" showOverlays={true} />
        
        {/* Tooltip on hover */}
        <div className="absolute z-50 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 pointer-events-none w-max">
          <div className="mc-card rounded-lg shadow-xl p-3 min-w-[240px] max-w-[320px] bg-background border border-border">
            <div className="font-bold text-sm mb-1.5 font-monocraft text-foreground">
              {achievementName} {achievement.level > 1 && achievement.level}
            </div>
            {achievementDescription && (
              <div className="text-xs text-muted-foreground mb-2 font-monocraft leading-relaxed">
                {achievementDescription}
              </div>
            )}
            {formattedDate && (
              <div className="text-xs text-muted-foreground border-t border-border pt-2 font-monocraft">
                {formattedDate}
              </div>
            )}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid hsl(var(--border))',
              }}
            />
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px"
              style={{
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '7px solid hsl(var(--background))',
                marginTop: '-1px',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* No text below - removed as per user request */}
    </div>
  );
}

