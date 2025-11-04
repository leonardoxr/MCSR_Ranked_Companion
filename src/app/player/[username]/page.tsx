'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { usePlayer, usePlayerMatches } from '@/lib/api/hooks/usePlayer';
import { PlayerCard } from '@/components/features/PlayerCard';
import { MatchCard } from '@/components/features/MatchCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { EloChart } from '@/components/features/EloChart';
import { WinRateChart } from '@/components/features/WinRateChart';
import { PlayerInsights } from '@/components/features/PlayerInsights';
import { MatchFilters, defaultFilters, type MatchFiltersState } from '@/components/features/MatchFilters';
import { Pagination } from '@/components/features/Pagination';
import { Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, Separator } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Trophy, Target, TrendingUp, Clock, Award, LogOut, User } from 'lucide-react';
import { PrivateKeyManager } from '@/components/features/PrivateKeyManager';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { AchievementCard } from '@/components/features/AchievementIcon';
import { filterMatches, paginateItems, getTotalPages } from '@/lib/utils/matchFilters';
import type { EloDataPoint } from '@/components/features/EloChart';
import { MatchType } from '@/types/api';
import { InContentAd } from '@/components/features/AdUnit';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const username = params?.username as string;
  const { username: authUsername, isAuthenticated, logout } = useAuthStore();

  const [showAllAchievements, setShowAllAchievements] = React.useState(false);
  const [filters, setFilters] = React.useState<MatchFiltersState>(defaultFilters);
  const [currentPage, setCurrentPage] = React.useState(1);
  const MATCHES_PER_PAGE = 10;

  // Check if viewing own profile
  const isOwnProfile = isAuthenticated && authUsername?.toLowerCase() === username?.toLowerCase();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const { data: player, isLoading, error } = usePlayer(username);
  // Fetch more matches (100) to have enough data for filtering
  const { data: matches, isLoading: matchesLoading } = usePlayerMatches(username, { count: 100 });

  // Apply filters and pagination
  const filteredMatches = React.useMemo(() => {
    if (!Array.isArray(matches)) return [];
    return filterMatches(matches, filters, player?.uuid);
  }, [matches, filters, player?.uuid]);

  const paginatedMatches = React.useMemo(() => {
    return paginateItems(filteredMatches, currentPage, MATCHES_PER_PAGE);
  }, [filteredMatches, currentPage]);

  const totalPages = getTotalPages(filteredMatches.length, MATCHES_PER_PAGE);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  // Transform match data for ELO chart - only include ranked matches
  const eloData: EloDataPoint[] = Array.isArray(matches)
    ? matches
        .filter((match) => match.type === MatchType.Ranked) // Only ranked matches affect ELO
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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
      {/* Header with Logout (only shown when viewing own profile) */}
      {isOwnProfile && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Stats</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Logged in as {authUsername}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}

      {/* Player Header */}
      <PlayerCard player={player} variant="default" />

      {/* Personalized Insights (only shown when viewing own profile) */}
      {isOwnProfile && <PlayerInsights player={player} />}

      {/* Private Key Management (only shown when viewing own profile) */}
      {isOwnProfile && <PrivateKeyManager />}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                  : t('common.notAvailable')
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
              value={totalStats.bestTime ? formatTime(totalStats.bestTime) : t('common.notAvailable')}
            />
            <StatRow
              label={t('player.stats.avgCompletion')}
              value={
                totalStats.completions > 0
                  ? formatTime(totalStats.completionTime / totalStats.completions)
                  : t('common.notAvailable')
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {eloData.length > 0 && <EloChart data={eloData} showRankLines />}
        {Array.isArray(matches) && matches.length > 0 && (
          <WinRateChart
            wins={totalStats.wins}
            losses={totalStats.losses}
          />
        )}
      </div>

      {/* In-Content Ad */}
      <InContentAd />

      {/* Achievements */}
      {Array.isArray(player.achievements?.display) && player.achievements.display.length > 0 && (
        <>
          <Card variant="mc">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  {t('player.highlightedAchievements', { defaultValue: 'Highlighted Achievements' })} ({player.achievements.display.length})
                </CardTitle>
                {Array.isArray(player.achievements?.total) && player.achievements.total.length > player.achievements.display.length && (
                  <button
                    onClick={() => setShowAllAchievements(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('common.showAll', { defaultValue: 'Show All' })}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
              title={t('player.achievements', { defaultValue: 'Achievements' })}
              className="max-h-[90vh]"
            >
              <div className="space-y-6">
                {/* Highlighted Achievements Section */}
                {Array.isArray(player.achievements?.display) && player.achievements.display.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {t('player.highlightedAchievements', { defaultValue: 'Highlighted Achievements' })} ({player.achievements.display.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
                      {t('player.allAchievements', { defaultValue: 'All Achievements' })} ({player.achievements.total.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
          <CardTitle>{t('player.matchHistory')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <MatchFilters filters={filters} onFiltersChange={setFilters} />

          {/* Match List */}
          {matchesLoading ? (
            <LoadingState message={t('common.loading')} />
          ) : filteredMatches.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} highlightPlayer={player.uuid} />
                ))}
              </div>

              {/* Results Summary */}
              <div className="text-sm text-muted-foreground text-center font-monocraft">
                {t('pagination.showing', {
                  start: (currentPage - 1) * MATCHES_PER_PAGE + 1,
                  end: Math.min(currentPage * MATCHES_PER_PAGE, filteredMatches.length),
                  total: filteredMatches.length,
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : Array.isArray(matches) && matches.length > 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('filters.noMatchesFound')}</p>
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
