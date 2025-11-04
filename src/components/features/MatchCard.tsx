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
import type { MatchInfo } from '@/types/api';
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

  return (
    <div>
      <Card
        variant="mc"
        className={cn('cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-[0.98]', className)}
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
        <CardContent className="p-3 sm:p-4">
          {/* Header: Match type and date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
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
            <div className="flex items-center gap-1 text-sm text-muted-foreground font-monocraft">
              <Calendar className="h-3 w-3" />
              {formatRelativeTime(date)}
            </div>
          </div>

          {/* Players */}
          <div className="space-y-2 sm:space-y-3">
            {players.map((player) => {
              const isWinner = winner && player.uuid === winner;
              const isHighlighted = player.uuid === highlightPlayer;
              const playerChange = changes.find((c) => c.uuid === player.uuid);
              const eloChange = playerChange?.change || null;

              // Determine styling based on match outcome for highlighted player
              let outcomeStyles = {
                container: 'bg-background',
                icon: null as React.ReactNode,
                textColor: '',
              };

              if (isHighlighted && matchOutcome) {
                if (matchOutcome === 'win') {
                  outcomeStyles = {
                    container: 'bg-emerald/10 border border-emerald/30',
                    icon: <Crown className="h-5 w-5 text-emerald shrink-0" />,
                    textColor: 'text-emerald',
                  };
                } else if (matchOutcome === 'loss') {
                  outcomeStyles = {
                    container: 'bg-destructive/10 border border-destructive/30',
                    icon: <X className="h-5 w-5 text-destructive shrink-0" />,
                    textColor: 'text-destructive',
                  };
                } else {
                  // draw
                  outcomeStyles = {
                    container: 'bg-muted/50 border border-muted',
                    icon: <Minus className="h-5 w-5 text-muted-foreground shrink-0" />,
                    textColor: 'text-muted-foreground',
                  };
                }
              } else if (!isHighlighted && isWinner) {
                // Non-highlighted winner (opponent won)
                outcomeStyles = {
                  container: 'bg-emerald/10 border border-emerald/30',
                  icon: <Crown className="h-5 w-5 text-emerald shrink-0" />,
                  textColor: 'text-emerald',
                };
              } else if (isHighlighted && !matchOutcome) {
                // Highlighted but no outcome (shouldn't happen, but fallback)
                outcomeStyles.container = 'bg-muted';
              }

              return (
                <div
                  key={player.uuid}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors',
                    outcomeStyles.container
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {outcomeStyles.icon}
                    <PlayerAvatar
                      uuid={player.uuid}
                      username={player.nickname}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CountryFlag country={player.country} size="sm" />
                        <p
                          className={cn(
                            'font-semibold truncate mc-heading',
                            outcomeStyles.textColor
                          )}
                        >
                          {player.nickname}
                        </p>
                      </div>
                      {isWinner && result.time && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground font-monocraft">
                          <Clock className="h-3 w-3" />
                          {formatTime(result.time)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ELO Change */}
                  {type === MatchType.Ranked && eloChange !== null && (
                    <div
                      className={cn(
                        'flex items-center gap-1 font-semibold text-sm font-monocraft',
                        getEloChangeColor(eloChange)
                      )}
                    >
                      {eloChange > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {formatEloChange(eloChange)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Seed info */}
          {seed && (
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
              <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-foreground font-mono">
                <div className="flex items-center gap-2">
                  <MinecraftIcon 
                    name={getOverworldIcon(seed.overworld)} 
                    size="sm" 
                    title={`${t('match.seed')}: ${seed.overworld}`} 
                    className="flex-shrink-0 image-pixelated" 
                  />
                  <span className="uppercase">
                    <span className="text-muted-foreground">{t('match.seed')}:</span> {seed.overworld}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MinecraftIcon 
                    name={getBastionIcon(seed.nether)} 
                    size="sm" 
                    title={`${t('match.bastion')}: ${seed.nether}`} 
                    className="flex-shrink-0 image-pixelated" 
                  />
                  <span className="uppercase">
                    <span className="text-muted-foreground">{t('match.bastion')}:</span> {seed.nether}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
