'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
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
import type { EloDataPoint } from '@/components/features/EloChart';

export default function PlayerPage() {
  const params = useParams();
  const username = params?.username as string;

  const { data: player, isLoading, error } = usePlayer(username);
  const { data: matches, isLoading: matchesLoading } = usePlayerMatches(username, { count: 20 });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading player profile..." />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Player Not Found"
          message={error?.message || `Could not find player "${username}"`}
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
          title="Invalid Player Data"
          message="The player data received from the API is incomplete. Please try again later."
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
            matchId: match.id,
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Season Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow label="Matches Played" value={seasonStats.playedMatches} />
            <StatRow label="Wins" value={seasonStats.wins} />
            <StatRow label="Losses" value={seasonStats.losses} />
            <StatRow
              label="Win Rate"
              value={
                seasonStats.playedMatches > 0
                  ? `${((seasonStats.wins / seasonStats.playedMatches) * 100).toFixed(1)}%`
                  : 'N/A'
              }
            />
            <StatRow label="Current Streak" value={seasonStats.currentWinStreak} />
          </CardContent>
        </Card>

        {/* All-Time Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              All-Time Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow label="Total Matches" value={totalStats.playedMatches} />
            <StatRow label="Total Wins" value={totalStats.wins} />
            <StatRow label="Highest Streak" value={totalStats.highestWinStreak} />
            <StatRow label="Completions" value={totalStats.completions} />
            <StatRow label="Forfeits" value={totalStats.forfeits} />
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatRow
              label="Best Time"
              value={totalStats.bestTime ? formatTime(totalStats.bestTime) : 'N/A'}
            />
            <StatRow
              label="Avg Completion"
              value={
                totalStats.completions > 0
                  ? formatTime(totalStats.completionTime / totalStats.completions)
                  : 'N/A'
              }
            />
            <StatRow label="Total Playtime" value={formatPlaytime(totalStats.playtime)} />
            <StatRow
              label="Last Online"
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements ({player.achievements.display.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {player.achievements.display.slice(0, 8).map((achievement, index) => (
                <div
                  key={`${achievement.id}-${achievement.date}-${index}`}
                  className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Award className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">
                    {achievement.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Level {achievement.level}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {matchesLoading ? (
            <LoadingState message="Loading matches..." />
          ) : Array.isArray(matches) && matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} highlightPlayer={player.uuid} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No matches found</p>
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
