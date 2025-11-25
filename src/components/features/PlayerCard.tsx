'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerHead3D } from './PlayerHead3D';
import { PlayerStatsBar } from './PlayerStatsBar';
import { RankBadge } from './RankBadge';
import { CountryFlag } from './CountryFlag';
import { cn } from '@/lib/utils';
import { formatWinRate } from '@/lib/utils/formatters';
import type { UserProfile, UserInfo, MatchInfo } from '@/types/api';
import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  Timer,
  Swords,
  ChevronRight,
  Star,
  Crown,
  Zap,
} from 'lucide-react';
import { SupporterBadge } from './SupporterBadge';

export interface PlayerCardProps {
  player: UserProfile | UserInfo;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
  latestMatch?: MatchInfo | null;
  onViewLatestMatch?: () => void;
}

/**
 * PlayerCard component for displaying player profile information
 * Shows avatar, rank, stats, and achievements with enhanced visuals
 */
export function PlayerCard({
  player,
  className,
  variant = 'default',
  latestMatch,
  onViewLatestMatch,
}: PlayerCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const { nickname, uuid, eloRate, eloRank, country } = player;
  const isUserInfo = 'statistics' in player;
  const statistics = isUserInfo ? player.statistics : null;

  const winRate = statistics
    ? formatWinRate(
        statistics.total.wins.ranked,
        statistics.total.loses.ranked
      )
    : null;

  // Get season result info if available
  const seasonResult = isUserInfo ? (player as UserInfo).seasonResult : null;
  const peakElo = seasonResult?.highest || eloRate || 0;
  const currentStreak = statistics?.season?.currentWinStreak?.ranked || 0;

  if (variant === 'compact') {
    return (
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
                <SupporterBadge roleType={player.roleType} size="sm" showText={false} />
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
    );
  }

  // Hero variant - more impactful display
  return (
    <Card variant="mc" className={cn('overflow-hidden', className)}>
      {/* Top accent gradient based on rank */}
      <div className={cn(
        'h-1.5 bg-gradient-to-r',
        eloRate && eloRate >= 2000 ? 'from-slate-400 via-slate-300 to-slate-400' : // Netherite
        eloRate && eloRate >= 1600 ? 'from-cyan-400 via-blue-400 to-cyan-400' : // Diamond
        eloRate && eloRate >= 1250 ? 'from-emerald-400 via-green-400 to-emerald-400' : // Emerald
        eloRate && eloRate >= 950 ? 'from-yellow-400 via-amber-400 to-yellow-400' : // Gold
        eloRate && eloRate >= 700 ? 'from-gray-400 via-gray-300 to-gray-400' : // Iron
        'from-gray-600 via-gray-500 to-gray-600' // Coal
      )} />

      <CardHeader className="pb-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
          {/* Player Avatar Section */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <PlayerHead3D
              uuid={uuid}
              username={nickname}
              size={120}
              className="relative"
            />
            {/* Rank indicator badge */}
            {eloRank && eloRank <= 100 && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Crown className="h-3 w-3" />
                Top {eloRank}
              </div>
            )}
          </div>

          {/* Player Info Section */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Name and Country */}
            <div className="flex items-center gap-3 flex-wrap">
              <CountryFlag country={country} size="lg" />
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {nickname}
              </CardTitle>
              <SupporterBadge roleType={player.roleType} size="md" />
            </div>

            {/* Rank and ELO Display */}
            <div className="flex flex-wrap items-center gap-3">
              {eloRate && (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <RankBadge elo={eloRate} showText className="text-base" />
                  <span className="text-xl font-bold font-mono">{eloRate.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">ELO</span>
                </div>
              )}
              {eloRank && (
                <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold">#{eloRank.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{t('player.globalRank')}</span>
                </div>
              )}
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {winRate && (
                <QuickStat
                  icon={<Target className="h-4 w-4" />}
                  label={t('player.stats.winRate')}
                  value={`${winRate}%`}
                  color="text-emerald"
                />
              )}
              {peakElo > (eloRate || 0) && (
                <QuickStat
                  icon={<Star className="h-4 w-4" />}
                  label={t('player.stats.peakElo')}
                  value={peakElo.toLocaleString()}
                  color="text-yellow-500"
                />
              )}
              {currentStreak > 0 && (
                <QuickStat
                  icon={<Flame className="h-4 w-4" />}
                  label={t('player.stats.currentStreak')}
                  value={`${currentStreak}W`}
                  color="text-orange-500"
                />
              )}
              {statistics?.total.bestTime.ranked && (
                <QuickStat
                  icon={<Timer className="h-4 w-4" />}
                  label={t('player.stats.pb')}
                  value={formatTime(statistics.total.bestTime.ranked)}
                  color="text-primary"
                />
              )}
            </div>
          </div>

          {/* Latest Match Quick Action */}
          {latestMatch && (
            <div className="w-full lg:w-auto">
              <Button
                variant="outline"
                className="w-full lg:w-auto gap-2 group hover:bg-primary/10 hover:border-primary/50"
                onClick={() => {
                  if (onViewLatestMatch) {
                    onViewLatestMatch();
                  } else {
                    router.push(`/match/${latestMatch.id}`);
                  }
                }}
              >
                <Swords className="h-4 w-4" />
                {t('player.latestMatch')}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Stats Bar */}
      {isUserInfo && (
        <CardContent className="pt-0 pb-4">
          <PlayerStatsBar player={player as UserInfo} variant="both" />
        </CardContent>
      )}

      {/* Detailed Stats Grid */}
      {statistics && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<Trophy className="h-5 w-5 text-yellow-500" />}
              label={t('player.stats.wins')}
              value={statistics.total.wins.ranked.toLocaleString()}
              subValue={`${statistics.season.wins.ranked} ${t('player.stats.thisSeason')}`}
              gradient="from-yellow-500/10 to-amber-500/5"
            />
            <StatCard
              icon={<Target className="h-5 w-5 text-emerald" />}
              label={t('player.stats.winRate')}
              value={winRate ? `${winRate}%` : t('common.notAvailable')}
              subValue={`${statistics.total.playedMatches.ranked} ${t('player.stats.matches')}`}
              gradient="from-emerald/10 to-green-500/5"
            />
            <StatCard
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              label={t('player.stats.highestStreak')}
              value={statistics.total.highestWinStreak.ranked?.toLocaleString() || '0'}
              subValue={currentStreak > 0 ? `${currentStreak} ${t('player.stats.current')}` : ''}
              gradient="from-orange-500/10 to-red-500/5"
            />
            <StatCard
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              label={t('player.stats.playtime')}
              value={formatPlaytime(statistics.total.playtime.ranked || 0)}
              subValue={`${statistics.total.completions.ranked} ${t('player.stats.completions')}`}
              gradient="from-blue-500/10 to-cyan-500/5"
            />
          </div>

          {/* Best Time Highlight */}
          {statistics.total.bestTime.ranked && (
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('player.stats.personalBest')}</p>
                    <p className="text-2xl font-bold font-mono text-primary">
                      {formatTime(statistics.total.bestTime.ranked)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('player.stats.avgCompletion')}</p>
                  <p className="text-lg font-semibold font-mono">
                    {statistics.total.completions.ranked > 0
                      ? formatTime(statistics.total.completionTime.ranked / statistics.total.completions.ranked)
                      : t('common.notAvailable')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

function QuickStat({ icon, label, value, color = 'text-foreground' }: QuickStatProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('flex-shrink-0', color)}>{icon}</span>
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn('font-semibold', color)}>{value}</span>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  gradient?: string;
}

function StatCard({ icon, label, value, subValue, gradient }: StatCardProps) {
  return (
    <div className={cn(
      'p-3 rounded-xl border border-border/50 bg-gradient-to-br',
      gradient || 'from-muted/30 to-muted/10'
    )}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      {subValue && (
        <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
      )}
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
