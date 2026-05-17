'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePhaseLeaderboard } from '@/lib/api/hooks/usePhaseLeaderboard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';
import { RankBadge } from './RankBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Trophy, Clock, TrendingUp, Star } from 'lucide-react';

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
      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      setTimeLeft(parts.join(' '));
    }
    update();
    const interval = setInterval(update, 60000);
    update();
    return () => clearInterval(interval);
  }, [endsAt]);

  return timeLeft;
}

export function PhaseLeaderboardClient() {
  const t = useTranslations();
  const { data, isLoading, error } = usePhaseLeaderboard();

  const countdown = useCountdown(data?.phase.endsAt ?? 0);

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
          <Star className="h-8 w-8 text-yellow-500" />
          {t('phase.title')}
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <span className="font-monocraft">
            {t('phase.phaseNumber', { number: data.phase.number })} — {t('phase.season', { season: data.phase.season })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {t('phase.endsIn')}: <span className="font-monocraft text-foreground font-semibold">{countdown}</span>
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t('phase.title')}
            <span className="text-sm text-muted-foreground ml-auto">
              {data.users.length} players
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-xs text-muted-foreground font-semibold border-b border-border">
            <div className="col-span-1">{t('phase.table.rank')}</div>
            <div className="col-span-4">{t('phase.table.player')}</div>
            <div className="col-span-2">{t('phase.table.elo')}</div>
            <div className="col-span-2">{t('phase.table.phasePoints')}</div>
            <div className="col-span-3">{t('phase.table.predicted')}</div>
          </div>

          {data.users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('phase.noPlayers')}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {data.users.map((user, index) => {
                const phasePoint = user.seasonResult?.phasePoint ?? 0;
                const seasonRank = user.seasonResult?.eloRank ?? user.eloRank;
                const seasonElo = user.seasonResult?.eloRate ?? user.eloRate;
                const diff = user.predPhasePoint - phasePoint;
                return (
                  <Link
                    key={user.uuid}
                    href={`/player/${user.nickname}`}
                    className={cn(
                      "flex sm:grid sm:grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-muted/50 transition-colors animate-fade-in",
                      index < 3 && "bg-gradient-to-r",
                      index === 0 && "from-yellow-500/10 to-transparent",
                      index === 1 && "from-gray-400/10 to-transparent",
                      index === 2 && "from-amber-700/10 to-transparent"
                    )}
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    {/* Rank */}
                    <div className={cn(
                      "sm:col-span-1 font-bold font-monocraft text-sm w-8 text-center",
                      index === 0 && "text-yellow-500",
                      index === 1 && "text-gray-400",
                      index === 2 && "text-amber-700"
                    )}>
                      {seasonRank ? `#${seasonRank}` : '-'}
                    </div>

                    {/* Player */}
                    <div className="sm:col-span-4 flex items-center gap-2 flex-1 min-w-0">
                      <PlayerAvatar uuid={user.uuid} username={user.nickname} size="sm" />
                      <CountryFlag country={user.country} size="sm" />
                      <span className="font-medium truncate">{user.nickname}</span>
                    </div>

                    {/* ELO */}
                    <div className="sm:col-span-2">
                      {seasonElo ? (
                        <RankBadge elo={seasonElo} showElo />
                      ) : (
                        <span className="text-sm text-muted-foreground">{t('common.unranked')}</span>
                      )}
                    </div>

                    {/* Phase Points */}
                    <div className="sm:col-span-2 font-monocraft text-sm">
                      {phasePoint}
                    </div>

                    {/* Predicted */}
                    <div className="sm:col-span-3 flex items-center gap-2">
                      <span className="font-monocraft text-sm">{user.predPhasePoint}</span>
                      {diff !== 0 && (
                        <span className={cn(
                          "flex items-center gap-0.5 text-xs font-semibold",
                          diff > 0 ? "text-emerald-500" : "text-red-500"
                        )}>
                          <TrendingUp className={cn(
                            "h-3 w-3",
                            diff < 0 && "rotate-180"
                          )} />
                          {diff > 0 ? '+' : ''}{diff}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
