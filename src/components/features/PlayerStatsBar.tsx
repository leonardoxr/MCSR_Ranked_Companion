'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Medal,
  Award,
  Flame,
  Timer,
  XCircle,
  Zap,
  Star,
} from 'lucide-react';
import { RankBadge } from './RankBadge';
import type { UserInfo } from '@/types/api';

export interface PlayerStatsBarProps {
  player: UserInfo;
  variant?: 'season' | 'all-time' | 'both';
  className?: string;
}

/**
 * PlayerStatsBar component for displaying player stats in a compact, icon-rich format
 * Similar to the reference site's stats display with icons
 */
export function PlayerStatsBar({
  player,
  variant = 'both',
  className,
}: PlayerStatsBarProps) {
  const [activeTab, setActiveTab] = React.useState<'season' | 'all-time'>('season');

  const seasonStats = player.statistics?.season;
  const totalStats = player.statistics?.total;

  if (!seasonStats || !totalStats) return null;

  const seasonWinRate =
    seasonStats.playedMatches.ranked > 0
      ? ((seasonStats.wins.ranked / seasonStats.playedMatches.ranked) * 100).toFixed(1)
      : '0';

  const totalWinRate =
    totalStats.playedMatches.ranked > 0
      ? ((totalStats.wins.ranked / totalStats.playedMatches.ranked) * 100).toFixed(1)
      : '0';

  const forfeitRate =
    totalStats.playedMatches.ranked > 0
      ? ((totalStats.forfeits.ranked / totalStats.playedMatches.ranked) * 100).toFixed(1)
      : '0';

  const avgCompletion =
    totalStats.completions.ranked > 0
      ? totalStats.completionTime.ranked / totalStats.completions.ranked
      : 0;

  // Get peak ELO from seasonResult if available
  const peakElo = player.seasonResult?.highest || player.eloRate || 0;
  const points = player.seasonResult?.last?.phasePoint || 0;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Tab Selector */}
      {variant === 'both' && (
        <div className="flex gap-2 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab('season')}
            className={cn(
              'px-3 py-1 text-sm font-medium transition-colors',
              activeTab === 'season'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            SEASON
          </button>
          <button
            onClick={() => setActiveTab('all-time')}
            className={cn(
              'px-3 py-1 text-sm font-medium transition-colors',
              activeTab === 'all-time'
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            ALL TIME
          </button>
        </div>
      )}

      {/* Stats Display */}
      <div className="flex flex-wrap items-center gap-3 p-2 pb-0 tabular-nums text-sm">
        {activeTab === 'season' || variant === 'season' ? (
          <>
            {/* Rank */}
            {player.eloRank && (
              <StatItem
                icon={<Trophy className="h-4 w-4" />}
                value={`#${player.eloRank.toLocaleString()}`}
              />
            )}

            {/* Player Name */}
            <span className="font-semibold">{player.nickname}</span>

            {/* Season Label */}
            <span className="text-muted-foreground">SEASON</span>

            {/* Rank Badge */}
            {player.eloRate && (
              <RankBadge elo={player.eloRate} className="text-xs" />
            )}

            {/* ELO */}
            {player.eloRate && (
              <StatItem
                icon={<Star className="h-4 w-4" />}
                value={`(${player.eloRate.toLocaleString()} elo)`}
              />
            )}

            {/* Peak ELO */}
            {peakElo > 0 && peakElo !== player.eloRate && (
              <StatItem
                icon={<TrendingUp className="h-4 w-4" />}
                value={`${peakElo.toLocaleString()} peak elo`}
              />
            )}

            {/* Win Rate */}
            <StatItem
              icon={<Target className="h-4 w-4" />}
              value={`${seasonWinRate}% winrate`}
            />

            {/* Best Time */}
            {totalStats.bestTime.ranked && (
              <StatItem
                icon={<Timer className="h-4 w-4" />}
                value={`${formatTime(totalStats.bestTime.ranked)} pb`}
              />
            )}

            {/* Win Streak */}
            {seasonStats.highestWinStreak.ranked > 0 && (
              <StatItem
                icon={<Flame className="h-4 w-4" />}
                value={`${seasonStats.highestWinStreak.ranked} best winstreak`}
              />
            )}

            {/* Average Completion */}
            {avgCompletion > 0 && (
              <StatItem
                icon={<Clock className="h-4 w-4" />}
                value={`${formatTime(avgCompletion)} average`}
              />
            )}

            {/* Forfeit Rate */}
            <StatItem
              icon={<XCircle className="h-4 w-4" />}
              value={`${forfeitRate}% forfeit rate`}
            />

            {/* Points */}
            {points > 0 && (
              <StatItem
                icon={<Zap className="h-4 w-4" />}
                value={`${points} points`}
              />
            )}
          </>
        ) : (
          <>
            {/* Wins */}
            <StatItem
              icon={<Trophy className="h-4 w-4" />}
              value={`${totalStats.wins.ranked.toLocaleString()} wins`}
            />

            {/* Completions */}
            <StatItem
              icon={<Medal className="h-4 w-4" />}
              value={`${totalStats.completions.ranked.toLocaleString()} completions`}
            />

            {/* ALL TIME Label */}
            <span className="text-muted-foreground">ALL TIME</span>

            {/* Best Time */}
            {totalStats.bestTime.ranked && (
              <StatItem
                icon={<Timer className="h-4 w-4" />}
                value={`${formatTime(totalStats.bestTime.ranked)} pb`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
}

function StatItem({ icon, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground/70 flex-shrink-0 inline-flex items-center justify-center">
        {icon}
      </span>
      <span className="font-semibold text-foreground whitespace-nowrap">{value}</span>
    </div>
  );
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

