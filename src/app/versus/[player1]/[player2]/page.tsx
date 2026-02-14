'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useVersusStats, useVersusMatches } from '@/lib/api/hooks/useVersus';
import { usePlayer } from '@/lib/api/hooks/usePlayer';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { PlayerHead3D } from '@/components/features/PlayerHead3D';
import { MatchCard } from '@/components/features/MatchCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Pagination } from '@/components/features/Pagination';
import { CountryFlag } from '@/components/features/CountryFlag';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import {
  Swords,
  Trophy,
  Target,
  TrendingUp,
  ArrowLeft,
  Crown,
  Flame,
  Timer,
  Clock,
  Users,
  Zap,
  Medal,
  Filter,
  Lock,
  BarChart3
} from 'lucide-react';
import { RankBadge } from '@/components/features/RankBadge';
import { cn } from '@/lib/utils';
import { MatchType } from '@/types/api';

type MatchTypeFilter = 'all' | 'ranked' | 'private';

export default function VersusPage() {
  const params = useParams();
  const t = useTranslations();
  const router = useRouter();
  const player1Name = params?.player1 as string;
  const player2Name = params?.player2 as string;

  const [matchTypeFilter, setMatchTypeFilter] = React.useState<MatchTypeFilter>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const MATCHES_PER_PAGE = 10;

  const { data: versusStats, isLoading: statsLoading, error: statsError } = useVersusStats(
    player1Name,
    player2Name
  );

  // Fetch more matches for filtering
  const { data: allMatches, isLoading: matchesLoading } = useVersusMatches(
    player1Name,
    player2Name,
    { count: 100 }
  );

  const { data: player1Data } = usePlayer(player1Name);
  const { data: player2Data } = usePlayer(player2Name);

  // Filter matches based on selected type
  const filteredMatches = React.useMemo(() => {
    if (!allMatches) return [];
    if (matchTypeFilter === 'all') return allMatches;
    if (matchTypeFilter === 'ranked') return allMatches.filter(m => m.type === MatchType.Ranked);
    if (matchTypeFilter === 'private') return allMatches.filter(m => m.type === MatchType.Private);
    return allMatches;
  }, [allMatches, matchTypeFilter]);

  // Paginate filtered matches
  const paginatedMatches = React.useMemo(() => {
    const start = (currentPage - 1) * MATCHES_PER_PAGE;
    return filteredMatches.slice(start, start + MATCHES_PER_PAGE);
  }, [filteredMatches, currentPage]);

  const totalPages = Math.ceil(filteredMatches.length / MATCHES_PER_PAGE);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [matchTypeFilter]);

  // Calculate stats per match type
  const statsPerType = React.useMemo(() => {
    if (!allMatches || !player1Data || !player2Data) return null;

    const calcStats = (matches: typeof allMatches) => {
      let p1Wins = 0;
      let p2Wins = 0;

      matches.forEach(match => {
        const winnerId = match.result?.uuid;
        if (winnerId === player1Data.uuid) p1Wins++;
        else if (winnerId === player2Data.uuid) p2Wins++;
      });

      return { p1Wins, p2Wins, total: matches.length };
    };

    const rankedMatches = allMatches.filter(m => m.type === MatchType.Ranked);
    const privateMatches = allMatches.filter(m => m.type === MatchType.Private);

    return {
      ranked: calcStats(rankedMatches),
      private: calcStats(privateMatches),
      all: calcStats(allMatches),
    };
  }, [allMatches, player1Data, player2Data]);

  if (statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message={t('common.loading')} />
      </div>
    );
  }

  if (statsError || !versusStats || !versusStats.players || versusStats.players.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title={t('common.error')}
          message={
            statsError?.message ||
            t('versus.loadError', { player1: String(player1Name), player2: String(player2Name) })
          }
        />
      </div>
    );
  }

  const [p1Info, p2Info] = versusStats.players;
  const p1Name = p1Info?.nickname || String(player1Name);
  const p2Name = p2Info?.nickname || String(player2Name);

  // Use calculated stats or API stats
  const currentStats = statsPerType ? statsPerType[matchTypeFilter] : null;
  const rankedStats = versusStats.results?.ranked ?? null;

  // Determine which stats to show based on filter
  const p1Wins = currentStats?.p1Wins ?? (rankedStats?.[p1Info?.uuid] ?? 0);
  const p2Wins = currentStats?.p2Wins ?? (rankedStats?.[p2Info?.uuid] ?? 0);
  const totalMatches = currentStats?.total ?? (rankedStats?.total ?? 0);

  const p1WinRate = totalMatches > 0 ? ((p1Wins / totalMatches) * 100).toFixed(1) : '0';
  const p2WinRate = totalMatches > 0 ? ((p2Wins / totalMatches) * 100).toFixed(1) : '0';

  // Determine leader
  const p1IsLeader = p1Wins > p2Wins;
  const p2IsLeader = p2Wins > p1Wins;
  const isTied = p1Wins === p2Wins && totalMatches > 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      {/* Epic Header with 3D Heads */}
      <div className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-red-500/10 rounded-xl" />

        <Card variant="mc" className="overflow-hidden border-2">
          <CardContent className="p-6 sm:p-8">
            {/* Mobile View - Stacked */}
            <div className="flex flex-col sm:hidden gap-6">
              {/* Player 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <PlayerHead3D
                    uuid={p1Info?.uuid}
                    username={p1Name}
                    size={80}
                  />
                  {p1IsLeader && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black p-1.5 rounded-full shadow-lg">
                      <Crown className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CountryFlag country={p1Info?.country} size="sm" />
                  <span className="font-bold text-lg">{p1Name}</span>
                </div>
                {player1Data?.eloRate && (
                  <RankBadge elo={player1Data.eloRate} showElo className="mb-2" />
                )}
                <div className="text-4xl font-bold text-blue-500">{p1Wins}</div>
                <div className="text-sm text-muted-foreground">{p1WinRate}% WR</div>
              </div>

              {/* VS Badge */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-full border border-primary/30">
                  <Swords className="h-8 w-8 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground mt-2">VS</span>
                <span className="text-sm text-muted-foreground mt-1">
                  {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
                </span>
              </div>

              {/* Player 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <PlayerHead3D
                    uuid={p2Info?.uuid}
                    username={p2Name}
                    size={80}
                  />
                  {p2IsLeader && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black p-1.5 rounded-full shadow-lg">
                      <Crown className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CountryFlag country={p2Info?.country} size="sm" />
                  <span className="font-bold text-lg">{p2Name}</span>
                </div>
                {player2Data?.eloRate && (
                  <RankBadge elo={player2Data.eloRate} showElo className="mb-2" />
                )}
                <div className="text-4xl font-bold text-red-500">{p2Wins}</div>
                <div className="text-sm text-muted-foreground">{p2WinRate}% WR</div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:grid grid-cols-5 items-center gap-4">
              {/* Player 1 */}
              <div className="col-span-2 flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlayerHead3D
                    uuid={p1Info?.uuid}
                    username={p1Name}
                    size={100}
                    className="relative"
                  />
                  {p1IsLeader && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black p-2 rounded-full shadow-lg animate-pulse">
                      <Crown className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CountryFlag country={p1Info?.country} size="lg" />
                  <span className="font-bold text-xl">{p1Name}</span>
                </div>
                {player1Data?.eloRate && (
                  <RankBadge elo={player1Data.eloRate} showElo className="mb-3 text-lg" />
                )}
                <div className={cn(
                  "text-5xl lg:text-6xl font-bold mb-1 transition-colors",
                  p1IsLeader ? "text-blue-500" : "text-blue-500/70"
                )}>
                  {p1Wins}
                </div>
                <div className="text-sm text-muted-foreground">{p1WinRate}% Win Rate</div>
              </div>

              {/* VS Badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-5 rounded-full border-2 border-primary/30 shadow-lg">
                  <Swords className="h-10 w-10 text-primary" />
                </div>
                <span className="text-lg font-bold text-muted-foreground mt-3">VS</span>
                <span className="text-sm text-muted-foreground mt-1">
                  {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
                </span>
                {isTied && (
                  <span className="text-xs text-yellow-500 font-semibold mt-2 bg-yellow-500/10 px-2 py-1 rounded-full">
                    TIED
                  </span>
                )}
              </div>

              {/* Player 2 */}
              <div className="col-span-2 flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                  <div className="absolute -inset-2 bg-gradient-to-l from-red-500/30 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlayerHead3D
                    uuid={p2Info?.uuid}
                    username={p2Name}
                    size={100}
                    className="relative"
                  />
                  {p2IsLeader && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black p-2 rounded-full shadow-lg animate-pulse">
                      <Crown className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CountryFlag country={p2Info?.country} size="lg" />
                  <span className="font-bold text-xl">{p2Name}</span>
                </div>
                {player2Data?.eloRate && (
                  <RankBadge elo={player2Data.eloRate} showElo className="mb-3 text-lg" />
                )}
                <div className={cn(
                  "text-5xl lg:text-6xl font-bold mb-1 transition-colors",
                  p2IsLeader ? "text-red-500" : "text-red-500/70"
                )}>
                  {p2Wins}
                </div>
                <div className="text-sm text-muted-foreground">{p2WinRate}% Win Rate</div>
              </div>
            </div>

            {/* Win Progress Bar */}
            {totalMatches > 0 && (
              <div className="mt-6 sm:mt-8">
                <div className="h-3 sm:h-4 bg-muted rounded-full overflow-hidden flex">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      p1IsLeader ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-blue-500/70"
                    )}
                    style={{ width: `${(p1Wins / totalMatches) * 100}%` }}
                  />
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      p2IsLeader ? "bg-gradient-to-l from-red-600 to-red-400" : "bg-red-500/70"
                    )}
                    style={{ width: `${(p2Wins / totalMatches) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{p1Wins} wins ({p1WinRate}%)</span>
                  <span>{p2Wins} wins ({p2WinRate}%)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Match Type Filter Tabs */}
      <Card variant="mc">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">
              <Filter className="h-4 w-4 inline mr-1" />
              Filter by:
            </span>
            <FilterButton
              active={matchTypeFilter === 'all'}
              onClick={() => setMatchTypeFilter('all')}
              icon={<BarChart3 className="h-4 w-4" />}
              label="All Matches"
              count={statsPerType?.all.total}
            />
            <FilterButton
              active={matchTypeFilter === 'ranked'}
              onClick={() => setMatchTypeFilter('ranked')}
              icon={<Trophy className="h-4 w-4" />}
              label="Ranked"
              count={statsPerType?.ranked.total}
            />
            <FilterButton
              active={matchTypeFilter === 'private'}
              onClick={() => setMatchTypeFilter('private')}
              icon={<Lock className="h-4 w-4" />}
              label="Private"
              count={statsPerType?.private.total}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Grid */}
      {statsPerType && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ranked Stats Card */}
          {statsPerType.ranked.total > 0 && (
            <StatsCard
              title="Ranked"
              icon={<Trophy className="h-5 w-5 text-yellow-500" />}
              p1Name={p1Name}
              p2Name={p2Name}
              p1Wins={statsPerType.ranked.p1Wins}
              p2Wins={statsPerType.ranked.p2Wins}
              total={statsPerType.ranked.total}
              gradient="from-yellow-500/10 to-amber-500/5"
            />
          )}

          {/* Private Stats Card */}
          {statsPerType.private.total > 0 && (
            <StatsCard
              title="Private"
              icon={<Lock className="h-5 w-5 text-purple-500" />}
              p1Name={p1Name}
              p2Name={p2Name}
              p1Wins={statsPerType.private.p1Wins}
              p2Wins={statsPerType.private.p2Wins}
              total={statsPerType.private.total}
              gradient="from-purple-500/10 to-violet-500/5"
            />
          )}

          {/* Combined Stats Card */}
          <StatsCard
            title="Combined"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            p1Name={p1Name}
            p2Name={p2Name}
            p1Wins={statsPerType.all.p1Wins}
            p2Wins={statsPerType.all.p2Wins}
            total={statsPerType.all.total}
            gradient="from-primary/10 to-primary/5"
          />
        </div>
      )}

      {/* Stats Comparison */}
      {player1Data && player2Data && (
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t('versus.statisticsComparison')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ComparisonBar
                label={t('versus.eloRating')}
                player1Value={player1Data.eloRate || 0}
                player2Value={player2Data.eloRate || 0}
                player1Name={player1Data.nickname}
                player2Name={player2Data.nickname}
                format={(val) => val.toLocaleString()}
                renderValue={(val) => (
                  <span className="inline-flex items-center gap-1">
                    <RankBadge elo={val} showText={false} showElo />
                  </span>
                )}
              />
              <ComparisonBar
                label={t('player.stats.totalWins')}
                player1Value={player1Data.statistics.total.wins.ranked}
                player2Value={player2Data.statistics.total.wins.ranked}
                player1Name={player1Data.nickname}
                player2Name={player2Data.nickname}
                format={(val) => val.toLocaleString()}
              />
              <ComparisonBar
                label={t('player.stats.highestStreak')}
                player1Value={player1Data.statistics.total.highestWinStreak.ranked}
                player2Value={player2Data.statistics.total.highestWinStreak.ranked}
                player1Name={player1Data.nickname}
                player2Name={player2Data.nickname}
                format={(val) => val.toLocaleString()}
              />
              <ComparisonBar
                label={t('player.stats.bestTime')}
                player1Value={player1Data.statistics.total.bestTime.ranked || 0}
                player2Value={player2Data.statistics.total.bestTime.ranked || 0}
                player1Name={player1Data.nickname}
                player2Name={player2Data.nickname}
                format={(milliseconds) => {
                  if (milliseconds === 0) return t('common.notAvailable');
                  const totalSeconds = Math.floor(milliseconds / 1000);
                  const minutes = Math.floor(totalSeconds / 60);
                  const seconds = totalSeconds % 60;
                  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }}
                lowerIsBetter
              />
              <ComparisonBar
                label={t('player.stats.completions')}
                player1Value={player1Data.statistics.total.completions.ranked}
                player2Value={player2Data.statistics.total.completions.ranked}
                player1Name={player1Data.nickname}
                player2Name={player2Data.nickname}
                format={(val) => val.toLocaleString()}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Matches */}
      <Card variant="mc">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              {matchTypeFilter === 'all' ? 'All Matches' :
               matchTypeFilter === 'ranked' ? 'Ranked Matches' : 'Private Matches'}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {matchesLoading ? (
            <LoadingState message={t('common.loading')} />
          ) : filteredMatches.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    highlightPlayer={p1Info?.uuid || undefined}
                  />
                ))}
              </div>

              {/* Results Summary */}
              {totalPages > 1 && (
                <div className="text-sm text-muted-foreground text-center mt-4 font-monocraft">
                  Showing {(currentPage - 1) * MATCHES_PER_PAGE + 1} - {Math.min(currentPage * MATCHES_PER_PAGE, filteredMatches.length)} of {filteredMatches.length}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {matchTypeFilter === 'all'
                ? t('versus.noMatches')
                : `No ${matchTypeFilter} matches found between these players`}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function FilterButton({ active, onClick, icon, label, count }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          active ? "bg-primary-foreground/20" : "bg-muted-foreground/20"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  p1Name: string;
  p2Name: string;
  p1Wins: number;
  p2Wins: number;
  total: number;
  gradient?: string;
}

function StatsCard({ title, icon, p1Name, p2Name, p1Wins, p2Wins, total, gradient }: StatsCardProps) {
  const p1WR = total > 0 ? ((p1Wins / total) * 100).toFixed(1) : '0';
  const p2WR = total > 0 ? ((p2Wins / total) * 100).toFixed(1) : '0';
  const p1Lead = p1Wins > p2Wins;
  const p2Lead = p2Wins > p1Wins;

  return (
    <Card className={cn("border", gradient && `bg-gradient-to-br ${gradient}`)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="font-semibold">{title}</span>
          <span className="text-xs text-muted-foreground ml-auto">{total} matches</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className={cn(
              "text-2xl font-bold",
              p1Lead ? "text-blue-500" : "text-muted-foreground"
            )}>
              {p1Wins}
            </div>
            <div className="text-xs text-muted-foreground truncate">{p1Name}</div>
            <div className="text-xs text-muted-foreground">{p1WR}%</div>
          </div>
          <div>
            <div className={cn(
              "text-2xl font-bold",
              p2Lead ? "text-red-500" : "text-muted-foreground"
            )}>
              {p2Wins}
            </div>
            <div className="text-xs text-muted-foreground truncate">{p2Name}</div>
            <div className="text-xs text-muted-foreground">{p2WR}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonBarProps {
  label: string;
  player1Value: number;
  player2Value: number;
  player1Name: string;
  player2Name: string;
  format: (value: number) => string;
  lowerIsBetter?: boolean;
  renderValue?: (value: number) => React.ReactNode;
}

function ComparisonBar({
  label,
  player1Value,
  player2Value,
  player1Name,
  player2Name,
  format,
  lowerIsBetter = false,
  renderValue,
}: ComparisonBarProps) {
  const maxValue = Math.max(player1Value, player2Value);
  const player1Percentage = maxValue > 0 ? (player1Value / maxValue) * 100 : 0;
  const player2Percentage = maxValue > 0 ? (player2Value / maxValue) * 100 : 0;

  const player1Better = lowerIsBetter
    ? player1Value < player2Value && player1Value > 0
    : player1Value > player2Value;
  const player2Better = lowerIsBetter
    ? player2Value < player1Value && player2Value > 0
    : player2Value > player1Value;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground truncate">
              {player1Name}
            </span>
            <span className={cn(
              "text-sm font-semibold",
              player1Better && "text-emerald"
            )}>
              {renderValue ? renderValue(player1Value) : format(player1Value)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                player1Better ? "bg-gradient-to-r from-emerald to-green-400" : "bg-blue-500"
              )}
              style={{ width: `${player1Percentage}%` }}
            />
          </div>
        </div>

        {/* Player 2 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground truncate">
              {player2Name}
            </span>
            <span className={cn(
              "text-sm font-semibold",
              player2Better && "text-emerald"
            )}>
              {renderValue ? renderValue(player2Value) : format(player2Value)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                player2Better ? "bg-gradient-to-r from-emerald to-green-400" : "bg-red-500"
              )}
              style={{ width: `${player2Percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
