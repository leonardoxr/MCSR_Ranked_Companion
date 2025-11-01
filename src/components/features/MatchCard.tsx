'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, Badge } from '@/components/ui';
import { PlayerAvatar } from './PlayerAvatar';
import { cn } from '@/lib/utils';
import {
  formatTime,
  formatRelativeTime,
  formatEloChange,
} from '@/lib/utils/formatters';
import { getEloChangeColor, getMatchTypeColor } from '@/lib/utils/colors';
import type { MatchInfo } from '@/types/api';
import { MatchType } from '@/types/api';
import {
  Trophy,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Crown,
} from 'lucide-react';

export interface MatchCardProps {
  match: MatchInfo;
  className?: string;
  highlightPlayer?: string; // UUID to highlight
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
  const { id, type, result, date, seed, players, changes } = match;

  const winner = result.uuid; // Can be null for forfeited matches
  const matchTypeColor = getMatchTypeColor(type);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn('hover:shadow-lg transition-shadow cursor-pointer', className)}
      >
        <CardContent className="p-4">
          {/* Header: Match type and date */}
          <div className="flex items-center justify-between mb-4">
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
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatRelativeTime(date)}
            </div>
          </div>

          {/* Players */}
          <div className="space-y-3">
            {players.map((player) => {
              const isWinner = winner && player.uuid === winner;
              const isHighlighted = player.uuid === highlightPlayer;
              const playerChange = changes.find((c) => c.uuid === player.uuid);
              const eloChange = playerChange?.change || null;

              return (
                <div
                  key={player.uuid}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-colors',
                    isWinner && 'bg-emerald/10 border border-emerald/30',
                    isHighlighted && !isWinner && 'bg-muted',
                    !isWinner && !isHighlighted && 'bg-background'
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isWinner && (
                      <Crown className="h-5 w-5 text-emerald shrink-0" />
                    )}
                    <PlayerAvatar
                      uuid={player.uuid}
                      username={player.nickname}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-semibold truncate',
                          isWinner && 'text-emerald'
                        )}
                      >
                        {player.nickname}
                      </p>
                      {isWinner && result.time && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
                        'flex items-center gap-1 font-semibold text-sm',
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
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {t('match.seed')}: {seed.overworld} • {t('match.bastion')}: {seed.nether}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
