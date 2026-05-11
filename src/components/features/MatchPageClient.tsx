'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMatch } from '@/lib/api/hooks/useMatches';
import { MatchSplitTable } from '@/components/features/MatchSplitTable';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { MinecraftIcon, MinecraftIconName } from '@/components/features/MinecraftIcon';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { CountryFlag } from '@/components/features/CountryFlag';
import { getOverworldIcon, getBastionIcon } from '@/lib/utils/seedIcons';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Trophy,
  Users,
  Eye,
  Crown,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Swords,
  Flag,
  ExternalLink,
  Play,
} from 'lucide-react';
import { formatDate, formatTime, formatRelativeTime } from '@/lib/utils/formatters';
import { getSafeExternalUrl } from '@/lib/utils/safeExternalUrl';
import { RankBadge } from '@/components/features/RankBadge';
import { MatchType } from '@/types/api';

function getVariationIcon(variation: string): MinecraftIconName | null {
  if (variation.includes('lava')) return 'lava';
  if (variation.includes('plains')) return 'grass-block';
  if (variation.includes('soul_sand_valley')) return 'netherrack';
  if (variation.includes('buried')) return 'gravel';
  if (variation.includes('caged')) return 'iron-block';
  if (variation.includes('crimson')) return 'crimson-fungus';
  if (variation.includes('warped')) return 'warped-fungus';
  return null;
}

function getMatchTypeName(type: MatchType, t: (key: string) => string): string {
  switch (type) {
    case MatchType.Ranked:
      return t('match.types.ranked');
    case MatchType.Casual:
      return t('match.types.casual');
    case MatchType.Private:
      return t('match.types.private');
    case MatchType.Event:
      return t('match.types.event');
    default:
      return t('match.types.unknown');
  }
}

export function MatchPageClient() {
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
  const loserProfile = match.players.find((p) => p.uuid !== winner.uuid);

  // Get completion times for each player
  const getPlayerTime = (uuid: string): number | null => {
    if (match.completions) {
      const completion = match.completions.find(c => c.uuid === uuid);
      if (completion) return completion.time;
    }
    return null;
  };

  const getPlayerEloChange = (uuid: string): number | null => {
    return match.changes.find((change) => change.uuid === uuid)?.change ?? null;
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('common.back')}
      </Button>

      {/* Match Header Card - Hero Section */}
      <Card variant="mc" className="overflow-hidden">
        {/* Top accent bar based on match type */}
        <div className={cn(
          'h-1',
          match.type === MatchType.Ranked && 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500',
          match.type === MatchType.Casual && 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500',
          match.type === MatchType.Private && 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500',
          match.type === MatchType.Event && 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500'
        )} />

        <CardContent className="p-4 sm:p-6">
          {/* Header info row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  match.type === MatchType.Ranked
                    ? 'ranked'
                    : match.type === MatchType.Casual
                      ? 'casual'
                      : match.type === MatchType.Private
                        ? 'private'
                        : 'event'
                }
                className="text-sm"
              >
                {getMatchTypeName(match.type, t)}
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">
                #{match.id}
              </span>
              {match.forfeited && (
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  {t('match.status.forfeited')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(new Date(match.date * 1000), 'PPP')}</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{formatRelativeTime(match.date)}</span>
            </div>
          </div>

          {/* Main VS Display */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Player 1 */}
            {match.players[0] && (
              <div
                className={cn(
                  'flex-1 w-full md:w-auto rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:scale-[1.02]',
                  winner.uuid === match.players[0].uuid
                    ? 'bg-emerald/10 border-2 border-emerald/40'
                    : 'bg-muted/30 border-2 border-transparent'
                )}
                onClick={() => router.push(`/player/${match.players[0].nickname}`)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {/* Winner crown */}
                  {winner.uuid === match.players[0].uuid && (
                    <Crown className="h-6 w-6 text-yellow-500 animate-pulse" />
                  )}
                  <PlayerAvatar
                    uuid={match.players[0].uuid}
                    username={match.players[0].nickname}
                    size="lg"
                    className="ring-2 ring-offset-2 ring-offset-background ring-white/10"
                  />
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <CountryFlag country={match.players[0].country} size="sm" />
                      <h2 className={cn(
                        'text-xl sm:text-2xl font-bold',
                        winner.uuid === match.players[0].uuid && 'text-emerald'
                      )}>
                        {match.players[0].nickname}
                      </h2>
                    </div>
                    {match.players[0].eloRate && (
                      <div className="mt-1">
                        <RankBadge elo={match.players[0].eloRate} showElo />
                      </div>
                    )}
                  </div>
                  {/* Time and ELO change */}
                  <div className="flex flex-col items-center gap-1">
                    {getPlayerTime(match.players[0].uuid) && (
                      <div className={cn(
                        'flex items-center gap-1 text-lg font-mono font-bold',
                        winner.uuid === match.players[0].uuid ? 'text-emerald' : 'text-muted-foreground'
                      )}>
                        <Clock className="h-4 w-4" />
                        {formatTime(getPlayerTime(match.players[0].uuid)!)}
                      </div>
                    )}
                    {getPlayerEloChange(match.players[0].uuid) !== null && (
                      <div className={cn(
                        'flex items-center gap-1 font-semibold',
                        getPlayerEloChange(match.players[0].uuid)! > 0
                          ? 'text-emerald'
                          : 'text-destructive'
                      )}>
                        {getPlayerEloChange(match.players[0].uuid)! > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {getPlayerEloChange(match.players[0].uuid)! > 0 ? '+' : ''}
                        {getPlayerEloChange(match.players[0].uuid)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VS Separator */}
            <div className="flex flex-col items-center gap-2 py-2 md:py-0">
              <Swords className="h-8 w-8 text-muted-foreground" />
              <span className="text-lg font-bold text-muted-foreground">VS</span>
            </div>

            {/* Player 2 */}
            {match.players[1] && (
              <div
                className={cn(
                  'flex-1 w-full md:w-auto rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:scale-[1.02]',
                  winner.uuid === match.players[1].uuid
                    ? 'bg-emerald/10 border-2 border-emerald/40'
                    : 'bg-muted/30 border-2 border-transparent'
                )}
                onClick={() => router.push(`/player/${match.players[1].nickname}`)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {/* Winner crown */}
                  {winner.uuid === match.players[1].uuid && (
                    <Crown className="h-6 w-6 text-yellow-500 animate-pulse" />
                  )}
                  <PlayerAvatar
                    uuid={match.players[1].uuid}
                    username={match.players[1].nickname}
                    size="lg"
                    className="ring-2 ring-offset-2 ring-offset-background ring-white/10"
                  />
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <CountryFlag country={match.players[1].country} size="sm" />
                      <h2 className={cn(
                        'text-xl sm:text-2xl font-bold',
                        winner.uuid === match.players[1].uuid && 'text-emerald'
                      )}>
                        {match.players[1].nickname}
                      </h2>
                    </div>
                    {match.players[1].eloRate && (
                      <div className="mt-1">
                        <RankBadge elo={match.players[1].eloRate} showElo />
                      </div>
                    )}
                  </div>
                  {/* Time and ELO change */}
                  <div className="flex flex-col items-center gap-1">
                    {getPlayerTime(match.players[1].uuid) && (
                      <div className={cn(
                        'flex items-center gap-1 text-lg font-mono font-bold',
                        winner.uuid === match.players[1].uuid ? 'text-emerald' : 'text-muted-foreground'
                      )}>
                        <Clock className="h-4 w-4" />
                        {formatTime(getPlayerTime(match.players[1].uuid)!)}
                      </div>
                    )}
                    {getPlayerEloChange(match.players[1].uuid) !== null && (
                      <div className={cn(
                        'flex items-center gap-1 font-semibold',
                        getPlayerEloChange(match.players[1].uuid)! > 0
                          ? 'text-emerald'
                          : 'text-destructive'
                      )}>
                        {getPlayerEloChange(match.players[1].uuid)! > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {getPlayerEloChange(match.players[1].uuid)! > 0 ? '+' : ''}
                        {getPlayerEloChange(match.players[1].uuid)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Winner time (if available) */}
          {winner.time && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                {t('match.winner')} Time
              </p>
              <p className="text-3xl sm:text-4xl font-mono font-bold text-emerald">
                {formatTime(winner.time)}
              </p>
            </div>
          )}

          {/* Seed Info Footer */}
          {match.seed && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                  <MinecraftIcon
                    name={getOverworldIcon(match.seed.overworld)}
                    size="md"
                    className="image-pixelated"
                  />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Overworld</p>
                    <p className="font-semibold text-sm uppercase">{(match.seed.overworld || 'unfiltered').replace(/_/g, ' ')}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <MinecraftIcon
                    name={getBastionIcon(match.seed.nether)}
                    size="md"
                    className="image-pixelated"
                  />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bastion</p>
                    <p className="font-semibold text-sm uppercase">{match.seed.nether || 'unfiltered'}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Season</p>
                  <p className="font-semibold text-sm">{match.season}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-event split table (2-player view) */}
      {match.timelines && match.timelines.length > 0 && (
        <MatchSplitTable match={match} />
      )}

      {/* Seed Variations */}
      {match.seed?.variations && match.seed.variations.length > 0 && (
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MinecraftIcon name="ender-eye" size="sm" />
              {t('match.variations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {match.seed.variations.map((variation, idx) => {
                const icon = getVariationIcon(variation);
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 border border-white/5 rounded-lg text-sm font-mono"
                  >
                    {icon && <MinecraftIcon name={icon} size="sm" className="image-pixelated" />}
                    {variation}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* VOD Links */}
      {match.vod && match.vod.some((vod) => getSafeExternalUrl(vod.url)) && (
        <Card variant="mc">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Play className="h-5 w-5 text-red-500" />
              {t('match.watchVod')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {match.vod.map((vod, idx) => {
                const player = match.players.find((p) => p.uuid === vod.uuid);
                const vodUrl = getSafeExternalUrl(vod.url);
                if (!vodUrl) return null;

                return (
                  <a
                    key={idx}
                    href={vodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-white/5 hover:bg-muted/50 hover:border-primary/30 transition-all group"
                  >
                    {player && (
                      <PlayerAvatar uuid={player.uuid} username={player.nickname} size="sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate group-hover:text-primary transition-colors">
                        {player?.nickname || t('common.player')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{vodUrl}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Info Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>
          {t('common.season')} {match.season} · {match.category.toUpperCase()} ·{' '}
          {match.forfeited ? t('match.status.forfeited') : match.decayed ? t('match.status.decayed') : t('match.status.completed')}
        </p>
        <p className="font-mono text-xs">
          Match #{match.id} · Seed: {match.seed?.id ?? 'unfiltered'}
        </p>
      </div>
    </div>
  );
}
