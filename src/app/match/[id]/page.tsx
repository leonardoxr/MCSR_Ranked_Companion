'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMatch } from '@/lib/api/hooks/useMatches';
import { MatchCard } from '@/components/features/MatchCard';
import { MatchTimeline } from '@/components/features/MatchTimeline';
import { MatchSplitTable } from '@/components/features/MatchSplitTable';
import { PlayerCard } from '@/components/features/PlayerCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { MinecraftIcon } from '@/components/features/MinecraftIcon';
import { getOverworldIcon, getBastionIcon } from '@/lib/utils/seedIcons';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import {
  ArrowLeft,
  Trophy,
  Users,
  Eye,
  Calendar,
  MapPin,
  Crown,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { RankBadge } from '@/components/features/RankBadge';
import { getRankTier } from '@/lib/utils/colors';

export default function MatchDetailsPage() {
  const params = useParams();
  const t = useTranslations();
  const router = useRouter();
  const matchId = params?.id as string;

  const { data: match, isLoading, error } = useMatch(matchId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message={t('match.loading')} />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title={t('match.notFound')}
          message={error?.message || t('match.notFoundMessage', { matchId })}
        />
      </div>
    );
  }

  const winner = match.result;
  const winnerProfile = winner.uuid ? match.players.find((p) => p.uuid === winner.uuid) : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      {/* Match Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mc-heading mc-title">{t('match.title')}</h1>
            <p className="text-muted-foreground">
              {formatDate(new Date(match.date * 1000), 'PPP')}
            </p>
          </div>
        </div>
      </div>

      {/* Match Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {t('match.winner')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {winnerProfile?.nickname || (match.forfeited ? t('match.forfeited') : t('match.noWinner'))}
            </p>
            {winner.time && (
              <p className="text-sm text-muted-foreground">
                {formatTime(winner.time)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('match.players')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{match.players.length}</p>
            <p className="text-sm text-muted-foreground">
              {match.spectators.length} {t('match.spectators')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Crown className="h-4 w-4" />
              {t('common.season')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{t('common.season')} {match.season}</p>
            <p className="text-sm text-muted-foreground">
              {match.rank?.season ? t('common.rank', { rank: match.rank.season.toLocaleString() }) : t('common.unranked')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('match.category')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold capitalize">{match.category}</p>
            <p className="text-sm text-muted-foreground">
              {match.forfeited ? t('match.status.forfeited') : match.decayed ? t('match.status.decayed') : t('match.status.completed')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Match Card */}
      <MatchCard match={match} />

      {/* Players and ELO Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('match.playersEloChanges')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {match.players.map((player) => {
              const eloChange = match.changes.find((c) => c.uuid === player.uuid);
              const isWinner = winner.uuid && player.uuid === winner.uuid;

              return (
                <div
                  key={player.uuid}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/player/${player.nickname}`)}
                >
                  <div className="flex items-center gap-4">
                    {isWinner && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-semibold text-lg">{player.nickname}</p>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {typeof player.eloRate === 'number' ? (
                          <RankBadge elo={player.eloRate} showElo />
                        ) : (
                          <span>{t('common.unranked')}</span>
                        )}
                        {player.eloRank ? (
                          <span className="ml-1">#{player.eloRank.toLocaleString()}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {eloChange && (
                    <div className="text-right">
                      <div className={`flex items-center gap-1 font-semibold ${
                        eloChange.change > 0 ? 'text-green-500' : 'text-destructive'
                      }`}>
                        {eloChange.change > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {eloChange.change > 0 ? '+' : ''}{eloChange.change}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {eloChange.eloRate} {t('common.elo')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Seed Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('match.seedInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('match.seedId')}</p>
              <p className="font-mono font-semibold">{match.seed.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                <MinecraftIcon name={getOverworldIcon(match.seed.overworld)} size="sm" />
                {t('match.overworldType')}
              </p>
              <p className="font-semibold capitalize">{match.seed.overworld}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                <MinecraftIcon name={getBastionIcon(match.seed.nether)} size="sm" />
                {t('match.bastionType')}
              </p>
              <p className="font-semibold capitalize">{match.seed.nether}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                <MinecraftIcon name="end-stone" size="sm" />
                {t('match.endTowerHeights')}
              </p>
              <p className="font-mono text-sm">
                {match.seed.endTowers.join(', ')}
              </p>
            </div>
          </div>
          {match.seed.variations && match.seed.variations.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t('match.variations')}</p>
              <div className="flex flex-wrap gap-2">
                {match.seed.variations.map((variation, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {variation}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-event split table (2-player view) */}
      {match.timelines && match.timelines.length > 0 && (
        <MatchSplitTable match={match} />
      )}

      {/* Timeline */}
      {match.timelines && match.timelines.length > 0 && (
        <MatchTimeline events={match.timelines} players={match.players} />
      )}

      {/* Completions */}
      {match.completions && match.completions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              {t('match.completions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {match.completions.map((completion, idx) => {
                const player = match.players.find((p) => p.uuid === completion.uuid);
                return (
                  <div
                    key={`${completion.uuid}-${idx}`}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <span className="font-semibold">
                      {player?.nickname || t('match.unknownPlayer')}
                    </span>
                    <span className="text-sm font-mono">
                      {formatTime(completion.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* VOD Links */}
      {match.vod && match.vod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t('match.watchVod')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.vod.map((vod, idx) => {
                const player = match.players.find((p) => p.uuid === vod.uuid);
                return (
                  <a
                    key={idx}
                    href={vod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline"
                  >
                    {player?.nickname || t('common.player')} - {vod.url}
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
