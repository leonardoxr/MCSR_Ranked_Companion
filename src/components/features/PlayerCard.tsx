'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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
import { CountryFlag } from './CountryFlag';
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
  const t = useTranslations();
  const { nickname, uuid, eloRate, eloRank, country } = player;
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
      <div>
    <Card variant="mc" className={cn('', className)}>
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
                  <CountryFlag country={country} size="sm" />
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
                      {winRate}% {t('player.stats.wrShort')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
    <Card variant="mc" className={cn('', className)}>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <PlayerHead3D
                uuid={uuid}
                username={nickname}
                size={96}
                className="sm:w-32 sm:h-32"
              />
              <div className="flex-1 sm:flex-initial min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <CountryFlag country={country} size="md" />
                  <CardTitle className="text-xl sm:text-2xl truncate">{nickname}</CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {eloRate && <RankBadge elo={eloRate} showText showElo className="text-sm sm:text-base" />}
                  {eloRank && (
                    <CardDescription className="text-sm sm:text-base">
                      {t('player.rank')} #{eloRank.toLocaleString()}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatItem
                icon={<Trophy className="h-3 w-3 sm:h-4 sm:w-4" />}
                label={t('player.stats.wins')}
                value={statistics.total.wins.ranked.toLocaleString()}
              />
              <StatItem
                icon={<Target className="h-3 w-3 sm:h-4 sm:w-4" />}
                label={t('player.stats.winRate')}
                value={winRate ? `${winRate}%` : t('common.notAvailable')}
              />
              <StatItem
                icon={<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />}
                label={t('player.stats.highestWinStreak')}
                value={statistics.total.highestWinStreak.ranked?.toLocaleString() || '0'}
              />
              <StatItem
                icon={<Clock className="h-3 w-3 sm:h-4 sm:w-4" />}
                label={t('player.stats.totalPlaytime')}
                value={formatPlaytime(statistics.total.playtime.ranked || 0)}
              />
            </div>

            {statistics.total.bestTime.ranked && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      {t('player.stats.bestTimeRanked')}
                    </p>
                    <p className="text-base sm:text-lg font-semibold">
                      {formatTime(statistics.total.bestTime.ranked)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      {t('player.stats.matchesPlayed')}
                    </p>
                    <p className="text-base sm:text-lg font-semibold">
                      {statistics.total.playedMatches.ranked}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
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
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      <span className="text-base sm:text-lg font-semibold">{value}</span>
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
