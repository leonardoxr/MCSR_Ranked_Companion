'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerHead3D } from './PlayerHead3D';
import { PlayerStatsBar } from './PlayerStatsBar';
import { RankBadge } from './RankBadge';
import { cn } from '@/lib/utils';
import { formatWinRate } from '@/lib/utils/formatters';
import type { UserProfile, UserInfo } from '@/types/api';
import { Trophy, Target, TrendingUp, Clock } from 'lucide-react';

export interface PlayerCardProps {
  player: UserProfile | UserInfo;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * PlayerCard component for displaying player profile information
 * Shows avatar, rank, stats, and achievements
 */
export function PlayerCard({
  player,
  className,
  variant = 'default',
}: PlayerCardProps) {
  const { nickname, uuid, eloRate, eloRank } = player;
  const isUserInfo = 'statistics' in player;
  const statistics = isUserInfo ? player.statistics : null;

  const winRate = statistics
    ? formatWinRate(
        statistics.total.wins.ranked,
        statistics.total.loses.ranked
      )
    : null;

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn('hover:shadow-lg transition-shadow', className)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <PlayerAvatar
                uuid={uuid}
                username={nickname}
                size="md"
                showOverlay
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{nickname}</h3>
                  {eloRate && <RankBadge elo={eloRate} />}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {eloRank && (
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />#{eloRank.toLocaleString()}
                    </span>
                  )}
                  {winRate && (
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {winRate}% WR
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('hover:shadow-lg transition-shadow', className)}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <PlayerHead3D
                uuid={uuid}
                username={nickname}
                size={128}
              />
              <div>
                <CardTitle className="text-2xl mb-2">{nickname}</CardTitle>
                <div className="flex items-center gap-2">
                  {eloRate && <RankBadge elo={eloRate} showElo />}
                  {eloRank && (
                    <CardDescription className="text-base">
                      Rank #{eloRank.toLocaleString()}
                    </CardDescription>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Stats Bar */}
        {isUserInfo && (
          <CardContent className="pt-0 pb-4">
            <PlayerStatsBar player={player as UserInfo} variant="both" />
          </CardContent>
        )}

        {statistics && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem
                icon={<Trophy className="h-4 w-4" />}
                label="Wins"
                value={statistics.total.wins.ranked.toLocaleString()}
              />
              <StatItem
                icon={<Target className="h-4 w-4" />}
                label="Win Rate"
                value={winRate ? `${winRate}%` : 'N/A'}
              />
              <StatItem
                icon={<TrendingUp className="h-4 w-4" />}
                label="Highest Win Streak"
                value={statistics.total.highestWinStreak.ranked?.toLocaleString() || '0'}
              />
              <StatItem
                icon={<Clock className="h-4 w-4" />}
                label="Total Playtime"
                value={formatPlaytime(statistics.total.playtime.ranked || 0)}
              />
            </div>

            {statistics.total.bestTime.ranked && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Best Time (Ranked)
                    </p>
                    <p className="text-lg font-semibold">
                      {formatTime(statistics.total.bestTime.ranked)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Matches Played
                    </p>
                    <p className="text-lg font-semibold">
                      {statistics.total.playedMatches.ranked}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

function formatPlaytime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
