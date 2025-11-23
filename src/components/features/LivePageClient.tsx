'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useLiveMatches } from '@/lib/api/hooks/useLiveMatches';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';
import { CountryFlag } from '@/components/features/CountryFlag';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Radio, Users, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LiveMatch } from '@/types/api';

export function LivePageClient() {
  const t = useTranslations();
  const router = useRouter();
  const { data: liveMatches, isLoading, error } = useLiveMatches();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg relative">
              <Radio className="h-8 w-8 text-red-500" />
              <span className="absolute top-2 right-2 flex h-3 w-3">
                  {/* Removed ping animation to reduce motion */}
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('live.title')}</h1>
              <p className="text-muted-foreground">
                {t('live.description')}
              </p>
            </div>
          </div>
          {Array.isArray(liveMatches) && liveMatches.length > 0 && (
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              {t('live.count', { count: liveMatches.length })}
            </Badge>
          )}
        </div>
      </div>

      {/* Live Matches */}
      {isLoading ? (
        <LoadingState message={t('live.loading')} />
      ) : error ? (
        <ErrorState
          title={t('live.error')}
          message={error.message || t('live.errorMessage')}
        />
      ) : liveMatches && liveMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.map((match, index) => {
            // Generate unique key from player UUIDs
            const matchKey = match.players.map(p => p.uuid).sort().join('-') || `match-${index}`;
            return (
              <LiveMatchCard
                key={matchKey}
                match={match}
                onClick={() => {
                  // Live matches don't have permanent IDs, so we can't navigate to a match page
                  // This would need a different implementation for live match details
                }}
              />
            );
          })}
        </div>
      ) : (
        <Card variant="mc">
          <CardContent className="py-16 text-center">
            <Radio className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{t('live.noMatches')}</h3>
            <p className="text-muted-foreground">
              {t('live.noMatchesMessage')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Activity className="h-4 w-4" />
        {t('live.autoRefresh')}
      </div>
    </div>
  );
}

interface LiveMatchCardProps {
  match: LiveMatch;
  onClick: () => void;
}

function LiveMatchCard({ match, onClick }: LiveMatchCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [currentTime, setCurrentTime] = React.useState(match.currentTime);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      variant="mc"
      className="transition-all border-l-4 border-l-red-500"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radio className="h-6 w-6 text-red-500" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <CardTitle className="text-xl">{t('live.liveMatch')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('live.inProgress')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-red-500 pulse-glow">
              {formatElapsedTime(currentTime)}
            </div>
            <p className="text-xs text-muted-foreground">{t('live.matchTime')}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Match Info */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{match.players.length} {t('live.players')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-red-500 font-semibold">{t('common.live')}</span>
          </div>
        </div>

        {/* Category summary chip */}
        {(() => {
          const vals = Object.values(match.data || {});
          const type = vals.map((p) => p.timeline?.type).find(Boolean);
          if (!type) return null;
          return (
            <div className="flex flex-wrap gap-2 text-xs items-center">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 font-mono">
                <span className="icon-minecraft-compass text-[13px]" />
                Category: {String(type).replace(/_/g, ' ').replace(/\./g, ': ')}
              </span>
            </div>
          );
        })()}

        {/* Players */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            {t('live.players')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {match.players.map((player) => {
              const playerData = match.data[player.uuid];
              return (
                <div
                  key={player.uuid}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/player/${player.nickname}`);
                  }}
                >
                  <PlayerAvatar
                    uuid={player.uuid}
                    username={player.nickname}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CountryFlag country={player.country} size="sm" />
                      <p className="font-semibold truncate">{player.nickname}</p>
                    </div>
                    {player.eloRate && (
                      <div className="flex items-center gap-2 mt-1">
                        <RankBadge elo={player.eloRate} showText={false} showElo />
                      </div>
                    )}
                    {playerData?.timeline && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {playerData.timeline.type.replace(/_/g, ' ').replace(/\./g, ': ')}
                      </p>
                    )}
                    {playerData?.liveUrl && (
                      <a
                        href={playerData.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('live.watchStream')}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatElapsedTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
