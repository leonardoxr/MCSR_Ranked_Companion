'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { PlayerAvatar } from './PlayerAvatar';
import { RankBadge } from './RankBadge';
import { CountryFlag } from './CountryFlag';
import { cn } from '@/lib/utils';
import { formatWinRate } from '@/lib/utils/formatters';
import type { LeaderboardUser } from '@/types/api';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface LeaderboardTableProps {
  players: LeaderboardUser[];
  className?: string;
  highlightPlayer?: string; // UUID to highlight
  showRankChange?: boolean;
}

/**
 * LeaderboardTable component for displaying ranked players
 * Shows rank, player info, ELO, stats, and rank changes
 */
export function LeaderboardTable({
  players,
  className,
  highlightPlayer,
  showRankChange = false,
}: LeaderboardTableProps) {
  const t = useTranslations();

  return (
    <Card variant="mc" className={className}>
      <CardContent className="p-0">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 border-b border-border bg-muted/50 text-sm font-semibold text-muted-foreground">
          <div className="col-span-1">{t('leaderboard.table.rank')}</div>
          <div className="col-span-5">{t('leaderboard.table.player')}</div>
          <div className="col-span-3">{t('leaderboard.table.tier')}</div>
          <div className="col-span-3">{t('leaderboard.table.elo')}</div>
        </div>

        {/* Table Body - Desktop Grid / Mobile Cards */}
        <div className="divide-y divide-border">
          {players.map((player, index) => {
            const isHighlighted = player.uuid === highlightPlayer;
            const playerUrl = `/player/${encodeURIComponent(player.nickname)}?matches=ranked&sort=newest`;

            return (
              <div key={player.uuid}>
                {/* Desktop Row View */}
                <div
                  className={cn(
                    'relative hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 transition-colors',
                    isHighlighted && 'bg-primary/10'
                  )}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center relative z-10">
                    <RankBadgeIcon rank={player.eloRank || 0} />
                  </div>

                  {/* Player */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0 relative z-10">
                    <PlayerAvatar
                      uuid={player.uuid}
                      username={player.nickname}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <Link href={playerUrl} className="group block rounded-md">
                        <div className="flex h-8 items-center gap-2 text-xl">
                          {player.eloRank && (
                            <span className="font-semibold text-muted-foreground">
                              #{player.eloRank.toLocaleString()}
                            </span>
                          )}
                          <CountryFlag country={player.country} size="sm" />
                          <span className="font-semibold truncate group-hover:text-primary transition-colors">
                            {player.nickname}
                          </span>
                        </div>
                        <div className="h-0.5 w-0 group-hover:w-full bg-primary/60 transition-all" />
                      </Link>
                      {showRankChange && player.eloRank && (
                        <RankChangeIndicator change={0} />
                      )}
                    </div>
                  </div>

                  {/* Tier */}
                  <div className="col-span-3 flex items-center gap-2 relative z-10">
                    {player.eloRate ? (
                      <RankBadge elo={player.eloRate} showText showElo={false} className="!bg-transparent !p-0" />
                    ) : (
                      <span className="text-muted-foreground">{t('common.unranked')}</span>
                    )}
                  </div>

                  {/* ELO */}
                  <div className="col-span-3 flex items-center relative z-10">
                    {player.eloRate ? (
                      <RankBadge elo={player.eloRate} showText={false} showElo className="!bg-transparent !p-0" />
                    ) : (
                      <span className="font-semibold text-lg">{t('common.unranked')}</span>
                    )}
                  </div>
                </div>

                {/* Mobile Card View */}
                <Link
                  href={playerUrl}
                  className={cn(
                    'block md:hidden p-3 sm:p-4 transition-colors hover:bg-white/5',
                    isHighlighted && 'bg-primary/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 mt-1">
                      <RankBadgeIcon rank={player.eloRank || 0} />
                    </div>

                    {/* Player Avatar */}
                    <div className="flex-shrink-0">
                      <PlayerAvatar
                        uuid={player.uuid}
                        username={player.nickname}
                        size="sm"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Name and Rank */}
                      <div className="flex items-center gap-2">
                        <CountryFlag country={player.country} size="sm" />
                        <span className="font-semibold text-base truncate">
                          {player.nickname}
                        </span>
                      </div>

                      {/* Rank Number */}
                      {player.eloRank && (
                        <div className="text-sm text-muted-foreground">
                          {t('leaderboard.table.rank')}: #{player.eloRank.toLocaleString()}
                        </div>
                      )}

                      {/* Tier and ELO */}
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {player.eloRate ? (
                          <>
                            <RankBadge
                              elo={player.eloRate}
                              showText
                              showElo={false}
                              className="text-xs"
                            />
                            <span className="text-muted-foreground">•</span>
                            <RankBadge
                              elo={player.eloRate}
                              showText={false}
                              showElo
                              className="text-xs"
                            />
                          </>
                        ) : (
                          <span className="text-muted-foreground">{t('common.unranked')}</span>
                        )}
                      </div>

                      {/* Rank Change */}
                      {showRankChange && player.eloRank && (
                        <RankChangeIndicator change={0} />
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {players.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('leaderboard.noPlayersFound')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RankBadgeIconProps {
  rank: number;
}

function RankBadgeIcon({ rank }: RankBadgeIconProps) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold">
        <Trophy className="h-5 w-5" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white font-bold">
        {rank}
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold">
        {rank}
      </div>
    );
  }
  return (
    <span className="font-semibold text-muted-foreground">
      #{rank.toLocaleString()}
    </span>
  );
}

interface RankChangeIndicatorProps {
  change: number;
}

function RankChangeIndicator({ change }: RankChangeIndicatorProps) {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-green-500">
        <TrendingUp className="h-3 w-3" />+{change}
      </div>
    );
  }
  if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-destructive">
        <TrendingDown className="h-3 w-3" />
        {change}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />0
    </div>
  );
}
