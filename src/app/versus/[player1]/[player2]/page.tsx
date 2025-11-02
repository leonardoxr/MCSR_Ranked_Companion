'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useVersusStats, useVersusMatches } from '@/lib/api/hooks/useVersus';
import { usePlayer } from '@/lib/api/hooks/usePlayer';
import { PlayerCard } from '@/components/features/PlayerCard';
import { MatchCard } from '@/components/features/MatchCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { Swords, Trophy, Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { RankBadge } from '@/components/features/RankBadge';

export default function VersusPage() {
  const params = useParams();
  const t = useTranslations();
  const router = useRouter();
  const player1Name = params?.player1 as string;
  const player2Name = params?.player2 as string;

  const { data: versusStats, isLoading: statsLoading, error: statsError } = useVersusStats(
    player1Name,
    player2Name
  );
  const { data: matches, isLoading: matchesLoading } = useVersusMatches(
    player1Name,
    player2Name,
    { count: 10 }
  );
  const { data: player1Data } = usePlayer(player1Name);
  const { data: player2Data } = usePlayer(player2Name);

  if (statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message={t('common.loading')} />
      </div>
    );
  }

  const vsAny: any = versusStats as any;
  const playersArr: any[] | undefined = vsAny?.players;
  if (statsError || !versusStats || !Array.isArray(playersArr) || playersArr.length < 2) {
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

  const [p1Info, p2Info] = playersArr as any[];
  const p1Name = p1Info?.nickname || String(player1Name);
  const p2Name = p2Info?.nickname || String(player2Name);
  const ranked = vsAny?.results?.ranked ?? null;
  const rankedTotal: number = ranked?.total ?? 0;
  const rankedP1Wins: number = p1Info ? (ranked?.[p1Info.uuid] ?? 0) : 0;
  const rankedP2Wins: number = p2Info ? (ranked?.[p2Info.uuid] ?? 0) : 0;
  const rankedP1WR = rankedTotal > 0 ? ((rankedP1Wins / rankedTotal) * 100).toFixed(1) : '0';
  const rankedP2WR = rankedTotal > 0 ? ((rankedP2Wins / rankedTotal) * 100).toFixed(1) : '0';

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

      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 bg-primary/10 rounded-lg">
          <Swords className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('versus.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('versus.subtitle', { player1: p1Name, player2: p2Name })}
          </p>
        </div>
      </div>

      {/* Win/Loss Comparison */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x divide-border">
            {/* Player 1 */}
            <div className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-transparent">
              <p className="text-sm text-muted-foreground mb-2">{p1Name}</p>
              <p className="text-5xl font-bold text-blue-500 mb-2">
                {rankedP1Wins}
              </p>
              <p className="text-sm text-muted-foreground">
                {rankedP1WR}{t('versus.winRate')}
              </p>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted/50">
              <Swords className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">{t('common.vs')}</p>
              <p className="text-xs text-muted-foreground mt-2">{t('versus.totalMatches', { count: rankedTotal })}</p>
            </div>

            {/* Player 2 */}
            <div className="p-6 text-center bg-gradient-to-bl from-red-500/10 to-transparent">
              <p className="text-sm text-muted-foreground mb-2">{p2Name}</p>
              <p className="text-5xl font-bold text-red-500 mb-2">
                {rankedP2Wins}
              </p>
              <p className="text-sm text-muted-foreground">
                {rankedP2WR}{t('versus.winRate')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {player1Data && (
          <div>
            <PlayerCard player={player1Data} variant="compact" />
          </div>
        )}
        {player2Data && (
          <div>
            <PlayerCard player={player2Data} variant="compact" />
          </div>
        )}
      </div>

  {/* Stats Comparison */}
  {player1Data && player2Data && (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t('versus.statisticsComparison')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Ranked head-to-head */}
          <div>
            <div className="mb-2 text-sm font-semibold">Ranked</div>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{rankedP1Wins}</div>
                <div className="text-xs text-muted-foreground">{p1Name} • {rankedP1WR}% WR</div>
              </div>
              <div className="text-center text-sm text-muted-foreground">{t('versus.totalMatches', { count: rankedTotal })}</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{rankedP2Wins}</div>
                <div className="text-xs text-muted-foreground">{p2Name} • {rankedP2WR}% WR</div>
              </div>
            </div>
          </div>

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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t('versus.recentMatches')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matchesLoading ? (
            <LoadingState message={t('common.loading')} />
          ) : matches && matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  highlightPlayer={(playersArr && playersArr[0]?.uuid) || undefined}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {t('versus.noMatches')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
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
            <span className={`text-sm font-semibold ${player1Better ? 'text-green-500' : ''}`}>
              {renderValue ? renderValue(player1Value) : format(player1Value)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${player1Better ? 'bg-green-500' : 'bg-blue-500'}`}
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
            <span className={`text-sm font-semibold ${player2Better ? 'text-green-500' : ''}`}>
              {renderValue ? renderValue(player2Value) : format(player2Value)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${player2Better ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${player2Percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(milliseconds: number): string {
  if (milliseconds === 0) return 'N/A';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
