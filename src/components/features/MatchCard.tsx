'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, Badge } from '@/components/ui';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';
import { MinecraftIcon } from './MinecraftIcon';
import { getOverworldIcon, getBastionIcon } from '@/lib/utils/seedIcons';
import { cn } from '@/lib/utils';
import {
  formatTime,
  formatRelativeTime,
  formatEloChange,
} from '@/lib/utils/formatters';
import { getEloChangeColor, getMatchTypeColor } from '@/lib/utils/colors';
import type { MatchInfo, TimelineEvent } from '@/types/api';
import { MatchType } from '@/types/api';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Crown,
  X,
  Minus,
  Swords,
  Flag,
} from 'lucide-react';

export interface MatchCardProps {
  match: MatchInfo;
  className?: string;
  highlightPlayer?: string; // UUID to highlight
}

/**
 * Match outcome from the perspective of a specific player
 */
type MatchOutcome = 'win' | 'loss' | 'draw';

/**
 * Get match outcome for a specific player
 */
function getMatchOutcome(
  resultUuid: string | null,
  playerUuid: string | null,
  forfeited: boolean
): MatchOutcome {
  // If no winner or forfeited, it's a draw
  if (resultUuid === null || forfeited) {
    return 'draw';
  }

  // If we have a highlighted player, determine win/loss
  if (playerUuid) {
    return resultUuid === playerUuid ? 'win' : 'loss';
  }

  // Default to draw if no player specified
  return 'draw';
}

/**
 * MatchCard component for displaying match summary information
 * Shows players, result, times, and ELO changes
 */
export function MatchCard({
  match,
  className,
  highlightPlayer,
}: MatchCardProps) {
  const t = useTranslations();
  const { id, type, result, date, seed, players, changes, forfeited } = match;
  const router = useRouter();

  const winner = result.uuid; // Can be null for forfeited matches
  const matchTypeColor = getMatchTypeColor(type);

  // Determine match outcome if highlightPlayer is set
  const matchOutcome = highlightPlayer
    ? getMatchOutcome(winner, highlightPlayer, forfeited)
    : null;

  const getMatchTypeName = (type: MatchType): string => {
    switch (type) {
      case MatchType.Ranked:
        return t('match.types.ranked');
      case MatchType.Casual:
        return t('match.types.casual');
      case MatchType.Private:
        return t('match.types.private');
      case MatchType.Event:
        return t('match.types.event');
      default:
        return t('match.types.unknown');
    }
  };

  // Get player completion times from timelines or completions
  const getPlayerFinishTime = (playerUuid: string): number | null => {
    // Check completions first
    if (match.completions) {
      const completion = match.completions.find(c => c.uuid === playerUuid);
      if (completion) return completion.time;
    }
    // Fall back to timelines
    if (match.timelines) {
      const finishEvent = match.timelines.find(
        e => e.uuid === playerUuid &&
        (e.type.toLowerCase().includes('finish') || e.type.toLowerCase().includes('complete'))
      );
      if (finishEvent) return finishEvent.time;
    }
    return null;
  };

  return (
    <Card
      variant="mc"
      className={cn(
        'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] overflow-hidden',
        matchOutcome === 'win' && 'ring-1 ring-emerald/30',
        matchOutcome === 'loss' && 'ring-1 ring-destructive/20',
        className
      )}
      onClick={() => router.push(`/match/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/match/${id}`);
        }
      }}
    >
      {/* Match outcome indicator bar */}
      {matchOutcome && (
        <div className={cn(
          'h-1',
          matchOutcome === 'win' && 'bg-emerald',
          matchOutcome === 'loss' && 'bg-destructive',
          matchOutcome === 'draw' && 'bg-muted-foreground'
        )} />
      )}

      <CardContent className="p-3 sm:p-4">
        {/* Header: Match type, outcome badge, and date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                type === MatchType.Ranked
                  ? 'ranked'
                  : type === MatchType.Casual
                    ? 'casual'
                    : type === MatchType.Private
                      ? 'private'
                      : 'event'
              }
            >
              {getMatchTypeName(type)}
            </Badge>
            {matchOutcome && (
              <span className={cn(
                'text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                matchOutcome === 'win' && 'bg-emerald/20 text-emerald',
                matchOutcome === 'loss' && 'bg-destructive/20 text-destructive',
                matchOutcome === 'draw' && 'bg-muted text-muted-foreground'
              )}>
                {matchOutcome === 'win' ? t('match.win', { defaultValue: 'WIN' }) : matchOutcome === 'loss' ? t('match.loss', { defaultValue: 'LOSS' }) : t('match.draw', { defaultValue: 'DRAW' })}
              </span>
            )}
            {forfeited && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                <Flag className="h-3 w-3" />
                {t('match.status.forfeited')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-monocraft">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(date)}
          </div>
        </div>

        {/* VS Display - Two players side by side */}
        <div className="flex items-stretch gap-2 sm:gap-3">
          {players.map((player, idx) => {
            const isWinner = winner && player.uuid === winner;
            const isHighlighted = player.uuid === highlightPlayer;
            const playerChange = changes.find((c) => c.uuid === player.uuid);
            const eloChange = playerChange?.change ?? null;
            const finishTime = getPlayerFinishTime(player.uuid);
            const isLeft = idx === 0;

            return (
              <React.Fragment key={player.uuid}>
                {/* VS separator between players */}
                {idx === 1 && (
                  <div className="flex items-center justify-center px-1 sm:px-2">
                    <div className="flex flex-col items-center gap-1">
                      <Swords className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground">VS</span>
                    </div>
                  </div>
                )}

                {/* Player card */}
                <div
                  className={cn(
                    'flex-1 rounded-lg p-2 sm:p-3 transition-colors relative overflow-hidden',
                    isWinner && 'bg-emerald/10 border border-emerald/30',
                    !isWinner && isHighlighted && matchOutcome === 'loss' && 'bg-destructive/5 border border-destructive/20',
                    !isWinner && !isHighlighted && 'bg-muted/30 border border-transparent',
                    isHighlighted && !isWinner && !matchOutcome && 'bg-primary/5 border border-primary/20'
                  )}
                >
                  {/* Winner crown */}
                  {isWinner && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 drop-shadow-[0_0_4px_rgba(234,179,8,0.5)]" />
                    </div>
                  )}

                  {/* Player info */}
                  <div className={cn('flex flex-col gap-2', isLeft ? 'items-start' : 'items-end')}>
                    <div className={cn('flex items-center gap-2', !isLeft && 'flex-row-reverse')}>
                      <PlayerAvatar
                        uuid={player.uuid}
                        username={player.nickname}
                        size="sm"
                      />
                      <div className={cn('min-w-0', !isLeft && 'text-right')}>
                        <div className={cn('flex items-center gap-1.5', !isLeft && 'flex-row-reverse')}>
                          <CountryFlag country={player.country} size="xs" />
                          <p className={cn(
                            'font-semibold text-sm truncate max-w-[80px] sm:max-w-[120px]',
                            isWinner && 'text-emerald'
                          )}>
                            {player.nickname}
                          </p>
                        </div>
                        {/* ELO display */}
                        {player.eloRate && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                            {player.eloRate} ELO
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Time and ELO change */}
                    <div className={cn('flex flex-col gap-1', !isLeft && 'items-end')}>
                      {/* Finish time */}
                      {finishTime && (
                        <div className={cn(
                          'flex items-center gap-1 text-sm font-mono font-medium',
                          isWinner ? 'text-emerald' : 'text-muted-foreground'
                        )}>
                          <Clock className="h-3 w-3" />
                          {formatTime(finishTime)}
                        </div>
                      )}
                      {/* ELO Change */}
                      {type === MatchType.Ranked && eloChange !== null && (
                        <div
                          className={cn(
                            'flex items-center gap-0.5 font-semibold text-xs font-mono',
                            getEloChangeColor(eloChange)
                          )}
                        >
                          {eloChange > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatEloChange(eloChange)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Seed info */}
        {seed && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <MinecraftIcon
                  name={getOverworldIcon(seed.overworld)}
                  size="sm"
                  title={seed.overworld || undefined}
                  className="image-pixelated"
                />
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {(seed.overworld || 'unfiltered').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <MinecraftIcon
                  name={getBastionIcon(seed.nether)}
                  size="sm"
                  title={seed.nether || undefined}
                  className="image-pixelated"
                />
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {seed.nether || 'unfiltered'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
