'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { usePlayer, usePlayerMatches } from '@/lib/api/hooks/usePlayer';
import { PlayerCard } from '@/components/features/PlayerCard';
import { MatchCard } from '@/components/features/MatchCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { EloChart } from '@/components/features/EloChart';
import { WinRateChart } from '@/components/features/WinRateChart';
import { PlayerInsights } from '@/components/features/PlayerInsights';
import { Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, Separator } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Clock, Award, LogOut, User } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { AchievementCard } from '@/components/features/AchievementIcon';
import type { EloDataPoint } from '@/components/features/EloChart';

export default function MyStatsPage() {
  const router = useRouter();
  const { username, isAuthenticated, logout } = useAuthStore();
  const [showAllAchievements, setShowAllAchievements] = React.useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated || !username) {
      router.push('/login');
    }
  }, [isAuthenticated, username, router]);

  const { data: player, isLoading, error } = usePlayer(username || '', {
    enabled: !!username,
  });
  const { data: matches, isLoading: matchesLoading } = usePlayerMatches(
    username || '',
    { count: 20 },
    { enabled: !!username }
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render anything while checking auth
  if (!isAuthenticated || !username) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading your stats..." />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Unable to Load Stats"
          message={error?.message || `Unable to load stats for ${username}`}
        />
        <div className="flex justify-center mt-6">
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  // Validate player data structure
  if (!player.statistics?.season || !player.statistics?.total) {
    console.error('Invalid player data structure:', player);
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Invalid Data"
          message="Player statistics data is incomplete or invalid"
        />
        <div className="flex justify-center mt-6">
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
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
      {/* Header with Logout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Stats</h1>
            <p className="text-sm text-muted-foreground">Logged in as {username}</p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Player Header */}
      <PlayerCard player={player} variant="default" />

      {/* Personalized Insights */}
      <PlayerInsights player={player} />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Season Stats */}
        <Card variant="mc">
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
        <Card variant="mc">
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
        <Card variant="mc">
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
        <>
          <Card variant="mc">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Highlighted Achievements ({player.achievements.display.length})
                </CardTitle>
                {Array.isArray(player.achievements?.total) && player.achievements.total.length > player.achievements.display.length && (
                  <button
                    onClick={() => setShowAllAchievements(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Show All
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {player.achievements.display.map((achievement, index) => (
                  <AchievementCard
                    key={`${achievement.id}-${achievement.date}-${index}`}
                    achievement={achievement}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Modal */}
          <Dialog open={showAllAchievements} onOpenChange={setShowAllAchievements}>
            <DialogContent
              title="Achievements"
              className="max-h-[90vh]"
            >
              <div className="space-y-6">
                {/* Highlighted Achievements Section */}
                {Array.isArray(player.achievements?.display) && player.achievements.display.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Highlighted Achievements ({player.achievements.display.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {player.achievements.display.map((achievement, index) => (
                        <AchievementCard
                          key={`display-${achievement.id}-${achievement.date}-${index}`}
                          achievement={achievement}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Separator between sections */}
                {Array.isArray(player.achievements?.display) && player.achievements.display.length > 0 &&
                 Array.isArray(player.achievements?.total) && player.achievements.total.length > 0 && (
                  <Separator />
                )}

                {/* All Achievements Section */}
                {Array.isArray(player.achievements?.total) && player.achievements.total.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      All Achievements ({player.achievements.total.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {player.achievements.total.map((achievement, index) => (
                        <AchievementCard
                          key={`total-${achievement.id}-${achievement.date}-${index}`}
                          achievement={achievement}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Match History */}
      <Card variant="mc">
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
            <p className="text-center text-muted-foreground py-8">No recent matches found</p>
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
