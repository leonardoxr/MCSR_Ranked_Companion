'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRecordLeaderboard } from '@/lib/api/hooks/useRecordLeaderboard';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';
import { RankBadge } from './RankBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Trophy, Timer, Calendar, Zap, Mountain } from 'lucide-react';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function RecordLeaderboardClient() {
  const t = useTranslations();
  const { data, isLoading, error } = useRecordLeaderboard();

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

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-monocraft flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-yellow-500" />
          {t('records.title')}
        </h1>
        <p className="text-muted-foreground">{t('records.description')}</p>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {/* 2nd place */}
          <div className="flex flex-col items-center pt-8">
            <PodiumCard entry={top3[1]} rank={2} />
          </div>
          {/* 1st place */}
          <div className="flex flex-col items-center">
            <PodiumCard entry={top3[0]} rank={1} />
          </div>
          {/* 3rd place */}
          <div className="flex flex-col items-center pt-12">
            <PodiumCard entry={top3[2]} rank={3} />
          </div>
        </div>
      )}

      {/* Records Table */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t('records.title')}
            <span className="text-sm text-muted-foreground ml-auto">
              {data.length} records
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-xs text-muted-foreground font-semibold border-b border-border">
            <div className="col-span-1">{t('records.table.rank')}</div>
            <div className="col-span-4">{t('records.table.player')}</div>
            <div className="col-span-2">{t('records.table.time')}</div>
            <div className="col-span-2">{t('records.table.seed')}</div>
            <div className="col-span-1">{t('records.table.season')}</div>
            <div className="col-span-2">{t('records.table.date')}</div>
          </div>

          <div className="divide-y divide-border">
            {data.map((entry, index) => (
              <Link
                key={entry.id}
                href={`/match/${entry.id}`}
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
                  #{entry.rank}
                </div>

                {/* Player */}
                <div className="sm:col-span-4 flex items-center gap-2 flex-1 min-w-0">
                  <PlayerAvatar uuid={entry.user.uuid} username={entry.user.nickname} size="sm" />
                  <CountryFlag country={entry.user.country} size="sm" />
                  <span className="font-medium truncate">{entry.user.nickname}</span>
                  {entry.user.eloRate && (
                    <RankBadge elo={entry.user.eloRate} showText={false} className="hidden lg:flex" />
                  )}
                </div>

                {/* Time */}
                <div className="sm:col-span-2 flex items-center gap-1">
                  <Timer className="h-4 w-4 text-muted-foreground sm:hidden" />
                  <span className="font-monocraft text-sm font-semibold">{formatTime(entry.time)}</span>
                </div>

                {/* Seed */}
                <div className="sm:col-span-2 hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <Mountain className="h-3 w-3" />
                  <span className="truncate">{entry.seed?.overworld || 'unfiltered'}</span>
                </div>

                {/* Season */}
                <div className="sm:col-span-1 hidden sm:block text-xs text-muted-foreground">
                  S{entry.season}
                </div>

                {/* Date */}
                <div className="sm:col-span-2 hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(entry.date)}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PodiumCard({ entry, rank }: { entry: { id: number; user: { uuid: string; nickname: string; eloRate: number | null; country: string | null }; time: number }; rank: number }) {
  const colors = {
    1: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    2: 'from-gray-400/20 to-gray-400/5 border-gray-400/30',
    3: 'from-amber-700/20 to-amber-700/5 border-amber-700/30',
  };

  return (
    <Link href={`/match/${entry.id}`}>
      <Card className={cn(
        "bg-gradient-to-b border-2 hover:scale-105 transition-transform",
        colors[rank as keyof typeof colors]
      )}>
        <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center">
          <div className={cn(
            "text-lg font-bold font-monocraft mb-2",
            rank === 1 && "text-yellow-500",
            rank === 2 && "text-gray-400",
            rank === 3 && "text-amber-700"
          )}>
            #{rank}
          </div>
          <PlayerAvatar uuid={entry.user.uuid} username={entry.user.nickname} size={rank === 1 ? "lg" : "md"} />
          <div className="flex items-center gap-1 mt-2">
            <CountryFlag country={entry.user.country} size="sm" />
            <span className="font-medium text-sm truncate max-w-[80px] sm:max-w-[100px]">
              {entry.user.nickname}
            </span>
          </div>
          {entry.user.eloRate && (
            <RankBadge elo={entry.user.eloRate} showElo className="mt-1 text-xs" />
          )}
          <div className="font-monocraft text-sm font-bold mt-2 text-primary">
            {formatTime(entry.time)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
