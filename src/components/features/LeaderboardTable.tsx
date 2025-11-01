'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';
import { PlayerAvatar } from './PlayerAvatar';
import { RankBadge } from './RankBadge';
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
  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-muted/50 text-sm font-semibold text-muted-foreground">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-3">Tier</div>
          <div className="col-span-3">ELO</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {players.map((player, index) => {
            const isHighlighted = player.uuid === highlightPlayer;
            const playerUrl = `/player/${encodeURIComponent(player.nickname)}?matches=ranked&sort=newest`;

            return (
              <motion.div
                key={player.uuid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={cn(
                  'relative grid grid-cols-12 gap-4 px-6 py-4 transition-colors',
                  isHighlighted && 'bg-primary/10'
                )}
              >
                {/* Clickable Link Overlay */}
                <Link
                  href={playerUrl}
                  className="absolute inset-0 rounded-lg hover:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors z-0"
                />

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
                    <div className="flex h-8 items-center gap-2 text-xl">
                      {player.eloRank && (
                        <span className="font-semibold text-muted-foreground">
                          #{player.eloRank.toLocaleString()}
                        </span>
                      )}
                      <span className="font-semibold truncate">{player.nickname}</span>
                    </div>
                    {showRankChange && player.eloRank && (
                      <RankChangeIndicator change={0} />
                    )}
                  </div>
                </div>

                {/* Tier */}
                <div className="col-span-3 flex items-center relative z-10">
                  {player.eloRate && <RankBadge elo={player.eloRate} />}
                </div>

                {/* ELO */}
                <div className="col-span-3 flex items-center relative z-10">
                  <span className="font-semibold text-lg">
                    {player.eloRate?.toLocaleString() || 'Unranked'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {players.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No players found
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
