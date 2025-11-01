'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { usePlayer, usePlayerMatches } from '@/lib/api/hooks/usePlayer';
import { PlayerCard } from '@/components/features/PlayerCard';
import { MatchCard } from '@/components/features/MatchCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { EloChart } from '@/components/features/EloChart';
import { WinRateChart } from '@/components/features/WinRateChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { AchievementCard } from '@/components/features/AchievementIcon';
import type { EloDataPoint } from '@/components/features/EloChart';

export default function PlayerPage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = useTranslations();
  const username = params?.username as string;

  const { data: player, isLoading, error } = usePlayer(username);
  const { data: matches, isLoading: matchesLoading } = usePlayerMatches(username, { count: 20 });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message={t('player.loading')} />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title={t('player.notFound')}
          message={error?.message || t('player.notFoundMessage', { username })}
        />
      </div>
    );
  }

  // Validate player data structure
  if (!player.statistics?.season || !player.statistics?.total) {
    console.error('Invalid player data structure:', player);
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title={t('player.invalidData')}
          message={t('player.invalidDataMessage')}
        />
      </div>
    );
  }

  // Transform match data for ELO chart
  const eloData: EloDataPoint[] = Array.isArray(matches)
    ? matches
        .map((match) => {
          const playerChange = match.changes.find((c) => c.uuid === player.uuid);
          return {
            date: match.date * 1000,
            elo: playerChange?.eloRate || 0,
            matchId: String(match.id),
          };
        })
        .reverse()
    : [];

  // Extract ranked stats from the API structure
  const seasonStats = {
    playedMatches: player.statistics.season.playedMatches.ranked,
    wins: player.statistics.season.wins.ranked,
    losses: player.statistics.season.loses.ranked, // API uses "loses"
    currentWinStreak: player.statistics.season.currentWinStreak.ranked,
  };

  const totalStats = {
    playedMatches: player.statistics.total.playedMatches.ranked,
    wins: player.statistics.total.wins.ranked,
    losses: player.statistics.total.loses.ranked, // API uses "loses"
    highestWinStreak: player.statistics.total.highestWinStreak.ranked,
    completions: player.statistics.total.completions.ranked,
    forfeits: player.statistics.total.forfeits.ranked,
    bestTime: player.statistics.total.bestTime.ranked,
    completionTime: player.statistics.total.completionTime.ranked,
    playtime: player.statistics.total.playtime.ranked,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Player Header */}
      <PlayerCard player={player} variant="default" />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Season Stats */}
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {t('player.seasonStats')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow label={t('player.stats.matchesPlayed')} value={seasonStats.playedMatches} />
            <StatRow label={t('player.stats.wins')} value={seasonStats.wins} />
            <StatRow label={t('player.stats.losses')} value={seasonStats.losses} />
            <StatRow
              label={t('player.stats.winRate')}
              value={
                seasonStats.playedMatches > 0
                  ? `${((seasonStats.wins / seasonStats.playedMatches) * 100).toFixed(1)}%`
                  : 'N/A'
              }
            />
            <StatRow label={t('player.stats.currentStreak')} value={seasonStats.currentWinStreak} />
          </CardContent>
        </Card>

        {/* All-Time Stats */}
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t('player.allTimeStats')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow label={t('player.stats.totalMatches')} value={totalStats.playedMatches} />
            <StatRow label={t('player.stats.totalWins')} value={totalStats.wins} />
            <StatRow label={t('player.stats.highestStreak')} value={totalStats.highestWinStreak} />
            <StatRow label={t('player.stats.completions')} value={totalStats.completions} />
            <StatRow label={t('player.stats.forfeits')} value={totalStats.forfeits} />
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t('player.performance')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow
              label={t('player.stats.bestTime')}
              value={totalStats.bestTime ? formatTime(totalStats.bestTime) : 'N/A'}
            />
            <StatRow
              label={t('player.stats.avgCompletion')}
              value={
                totalStats.completions > 0
                  ? formatTime(totalStats.completionTime / totalStats.completions)
                  : 'N/A'
              }
            />
            <StatRow label={t('player.stats.totalPlaytime')} value={formatPlaytime(totalStats.playtime)} />
            <StatRow
              label={t('player.stats.lastOnline')}
              value={formatRelativeTime(player.timestamp.lastOnline)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {eloData.length > 0 && <EloChart data={eloData} showRankLines />}
        {Array.isArray(matches) && matches.length > 0 && (
          <WinRateChart
            wins={totalStats.wins}
            losses={totalStats.losses}
          />
        )}
      </div>

      {/* Achievements */}
      {Array.isArray(player.achievements?.display) && player.achievements.display.length > 0 && (
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {t('player.achievements')} ({player.achievements.display.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {player.achievements.display.slice(0, 8).map((achievement, index) => (
                <AchievementCard
                  key={`${achievement.id}-${achievement.date}-${index}`}
                  achievement={achievement}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match History */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle>{t('player.recentMatches')}</CardTitle>
        </CardHeader>
        <CardContent>
          {matchesLoading ? (
            <LoadingState message={t('common.loading')} />
          ) : Array.isArray(matches) && matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} highlightPlayer={player.uuid} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('player.noMatches')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatPlaytime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
