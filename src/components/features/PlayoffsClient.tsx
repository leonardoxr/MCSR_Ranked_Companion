'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePlayoffs } from '@/lib/api/hooks/usePlayoffs';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { PlayerAvatar } from './PlayerAvatar';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Medal,
  Users,
  DollarSign,
  Timer,
  Video,
} from 'lucide-react';
import type { PlayoffPlayer, PlayoffMatch, PlayoffsResponse } from '@/types/api';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function PlayoffsClient() {
  const t = useTranslations();
  const [playoffsId, setPlayoffsId] = React.useState<number | undefined>(undefined);
  const { data, isLoading, error } = usePlayoffs(playoffsId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message={t('common.loading')} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title={t('common.error')}
          message={error?.message || t('playoffs.noPlayoffs')}
        />
      </div>
    );
  }

  const bracket = data.data;
  const players = bracket.players;

  // Group matches by round name
  const roundOrder = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Grand Finals'];
  const matchesByRound: Record<string, PlayoffMatch[]> = {};
  for (const match of bracket.matches) {
    if (!matchesByRound[match.name]) matchesByRound[match.name] = [];
    matchesByRound[match.name].push(match);
  }

  // Sort results by place
  const sortedResults = [...bracket.results].sort((a, b) => a.place - b.place);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-monocraft flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          {t('playoffs.title')}
        </h1>
        <p className="text-lg text-muted-foreground font-monocraft">
          {t('playoffs.season', { season: bracket.season })}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.prev === null}
            onClick={() => data.prev !== null && setPlayoffsId(data.prev)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('playoffs.prevSeason')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={data.next === null}
            onClick={() => data.next !== null && setPlayoffsId(data.next)}
          >
            {t('playoffs.nextSeason')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Bracket */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {t('playoffs.bracket')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[600px]">
              {roundOrder.map((roundName) => {
                const matches = matchesByRound[roundName] || [];
                if (matches.length === 0) return null;

                const roundKey = roundName.toLowerCase().replace(/ /g, '');
                const translationKey = `playoffs.${
                  roundName === 'Round of 16' ? 'roundOf16' :
                  roundName === 'Quarterfinals' ? 'quarterfinals' :
                  roundName === 'Semifinals' ? 'semifinals' : 'grandFinals'
                }`;

                return (
                  <div key={roundName} className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground text-center uppercase tracking-wider">
                      {t(translationKey)}
                    </h3>
                    <div className="space-y-3 flex flex-col justify-around h-full">
                      {matches.map((match) => (
                        <BracketMatch
                          key={match.id}
                          match={match}
                          players={players}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-yellow-500" />
            {t('playoffs.results')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {sortedResults.map((result) => {
              const player = players.find((p) => p.seedNumber === result.player);
              if (!player) return null;

              return (
                <Link
                  key={result.player}
                  href={`/player/${player.nickname}`}
                  className="flex items-center gap-3 py-3 px-2 hover:bg-muted/50 transition-colors rounded-md"
                >
                  <div className={cn(
                    "w-10 text-center font-bold font-monocraft",
                    result.place === 1 && "text-yellow-500 text-lg",
                    result.place === 2 && "text-gray-400",
                    result.place === 3 && "text-amber-700"
                  )}>
                    {result.place <= 3 ? (
                      <Trophy className={cn(
                        "h-5 w-5 mx-auto",
                        result.place === 1 && "text-yellow-500",
                        result.place === 2 && "text-gray-400",
                        result.place === 3 && "text-amber-700"
                      )} />
                    ) : (
                      `#${result.place}`
                    )}
                  </div>

                  <PlayerAvatar uuid={player.uuid} username={player.nickname} size="sm" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{player.nickname}</span>
                    <div className="text-xs text-muted-foreground">
                      {t('playoffs.seed')} #{player.seedNumber + 1} — ELO {player.seasonEloRate}
                    </div>
                  </div>

                  {result.prize > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
                      <DollarSign className="h-4 w-4" />
                      {result.prize.toLocaleString()}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('playoffs.players')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...players]
              .sort((a, b) => a.seedNumber - b.seedNumber)
              .map((player) => (
                <Link
                  key={player.uuid}
                  href={`/player/${player.nickname}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-xs text-muted-foreground font-monocraft w-6 text-center">
                    #{player.seedNumber + 1}
                  </div>
                  <PlayerAvatar uuid={player.uuid} username={player.nickname} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{player.nickname}</div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <span>ELO {player.seasonEloRate}</span>
                      <span className="flex items-center gap-0.5">
                        <Timer className="h-3 w-3" />
                        {t('playoffs.personalBest')}: {formatTime(player.personalBest)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BracketMatch({
  match,
  players,
  t,
}: {
  match: PlayoffMatch;
  players: PlayoffPlayer[];
  t: ReturnType<typeof useTranslations>;
}) {
  const p1 = match.participants[0];
  const p2 = match.participants[1];
  const player1 = players.find((p) => p.seedNumber === p1?.player);
  const player2 = players.find((p) => p.seedNumber === p2?.player);

  const p1Won = match.state === 'DONE' && p1 && p2 && p1.roundScore > p2.roundScore;
  const p2Won = match.state === 'DONE' && p1 && p2 && p2.roundScore > p1.roundScore;

  const stateColor = match.state === 'DONE' ? 'text-muted-foreground' :
    match.state === 'LIVE' ? 'text-red-500' : 'text-blue-500';

  return (
    <Card className="border">
      <CardContent className="p-2 space-y-1">
        {/* Match header */}
        <div className="flex items-center justify-between text-xs">
          <span className={cn("font-semibold", stateColor)}>
            {match.state === 'DONE' ? t('playoffs.states.done') :
             match.state === 'LIVE' ? t('playoffs.states.live') : t('playoffs.states.scheduled')}
          </span>
          <span className="text-muted-foreground">
            {t('playoffs.bestOf', { n: match.maxRoundScore * 2 - 1 })}
          </span>
        </div>

        {/* Player 1 */}
        <div className={cn(
          "flex items-center gap-2 p-1.5 rounded",
          p1Won && "bg-emerald-500/10",
          match.state === 'DONE' && !p1Won && "opacity-60"
        )}>
          {player1 ? (
            <>
              <PlayerAvatar uuid={player1.uuid} username={player1.nickname} size="xs" />
              <span className="text-sm font-medium flex-1 truncate">{player1.nickname}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground flex-1">TBD</span>
          )}
          <span className={cn(
            "font-monocraft text-sm font-bold w-4 text-center",
            p1Won && "text-emerald-500"
          )}>
            {p1?.roundScore ?? '-'}
          </span>
        </div>

        {/* Player 2 */}
        <div className={cn(
          "flex items-center gap-2 p-1.5 rounded",
          p2Won && "bg-emerald-500/10",
          match.state === 'DONE' && !p2Won && "opacity-60"
        )}>
          {player2 ? (
            <>
              <PlayerAvatar uuid={player2.uuid} username={player2.nickname} size="xs" />
              <span className="text-sm font-medium flex-1 truncate">{player2.nickname}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground flex-1">TBD</span>
          )}
          <span className={cn(
            "font-monocraft text-sm font-bold w-4 text-center",
            p2Won && "text-emerald-500"
          )}>
            {p2?.roundScore ?? '-'}
          </span>
        </div>

        {/* VOD link */}
        {match.vod && (
          <a
            href={match.vod}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-xs text-primary hover:underline pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Video className="h-3 w-3" />
            {t('playoffs.watchVod')}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
