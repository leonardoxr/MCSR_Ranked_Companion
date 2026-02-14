'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useWeeklyRace } from '@/lib/api/hooks/useWeeklyRace';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';
import { RankBadge } from './RankBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Trophy, Clock, Timer, Sprout, Flame, Star } from 'lucide-react';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function useCountdown(endsAt: number) {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    function update() {
      const now = Math.floor(Date.now() / 1000);
      const diff = endsAt - now;
      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
      setTimeLeft(parts.join(' '));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return timeLeft;
}

export function WeeklyRaceClient() {
  const t = useTranslations();
  const { data, isLoading, error } = useWeeklyRace();

  const countdown = useCountdown(data?.endsAt ?? 0);

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
          message={error?.message || t('common.noData')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-monocraft flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          {t('weeklyRace.title')}
          <span className="text-primary">#{data.id}</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t('weeklyRace.endsIn')}:</span>
          <span className="font-monocraft text-foreground font-semibold">{countdown}</span>
        </div>
      </div>

      {/* Seed Info */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sprout className="h-5 w-5 text-emerald-500" />
            {t('weeklyRace.seedInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t('weeklyRace.overworld')}</div>
              <div className="font-mono text-sm truncate">{data.seed.overworld}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t('weeklyRace.nether')}</div>
              <div className="font-mono text-sm truncate">{data.seed.nether}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t('weeklyRace.end')}</div>
              <div className="font-mono text-sm truncate">{data.seed.theEnd}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">RNG</div>
              <div className="font-mono text-sm truncate">{data.seed.rng}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            {t('leaderboard.title')}
            <span className="text-sm text-muted-foreground ml-auto">
              {data.leaderboard.length} {t('player.stats.matches')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data.leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('weeklyRace.noEntries')}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {data.leaderboard.map((entry, index) => (
                <Link
                  key={`${entry.player.uuid}-${entry.rank}`}
                  href={`/player/${entry.player.nickname}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                    index < 3 && "bg-gradient-to-r",
                    index === 0 && "from-yellow-500/10 to-transparent",
                    index === 1 && "from-gray-400/10 to-transparent",
                    index === 2 && "from-amber-700/10 to-transparent"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Rank */}
                  <div className={cn(
                    "w-8 text-center font-bold font-monocraft text-sm",
                    index === 0 && "text-yellow-500",
                    index === 1 && "text-gray-400",
                    index === 2 && "text-amber-700"
                  )}>
                    {index < 3 ? (
                      <Trophy className={cn(
                        "h-5 w-5 mx-auto",
                        index === 0 && "text-yellow-500",
                        index === 1 && "text-gray-400",
                        index === 2 && "text-amber-700"
                      )} />
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>

                  {/* Player */}
                  <PlayerAvatar uuid={entry.player.uuid} username={entry.player.nickname} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CountryFlag country={entry.player.country} size="sm" />
                      <span className="font-medium truncate">{entry.player.nickname}</span>
                    </div>
                  </div>

                  {/* ELO Badge */}
                  {entry.player.eloRate && (
                    <RankBadge elo={entry.player.eloRate} showElo className="hidden sm:flex" />
                  )}

                  {/* Time */}
                  <div className="flex items-center gap-1.5">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-monocraft text-sm font-semibold">
                      {formatTime(entry.time)}
                    </span>
                  </div>

                  {/* Replay indicator */}
                  {entry.replayExist && (
                    <Flame className="h-4 w-4 text-red-500 hidden sm:block" aria-label="Replay available" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
