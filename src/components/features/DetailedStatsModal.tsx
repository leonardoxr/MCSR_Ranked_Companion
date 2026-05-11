'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlayerAvatar } from './PlayerAvatar';
import { RankBadge } from './RankBadge';
import {
  PieChart,
  BarChart3,
  Users,
  Trophy,
  Target,
  Clock,
  X,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatchInfo, UserInfo, MatchType } from '@/types/api';
import { useRouter } from 'next/navigation';

interface DetailedStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: UserInfo;
  matches: MatchInfo[];
}

interface SeedTypeStats {
  type: string;
  played: number;
  wins: number;
  losses: number;
  avgTime: number;
  bestTime: number;
}

interface BastionTypeStats {
  type: string;
  played: number;
  wins: number;
  losses: number;
  avgTime: number;
  bestTime: number;
}

interface OpponentStats {
  uuid: string;
  nickname: string;
  played: number;
  wins: number;
  losses: number;
  lastPlayed: number;
  eloRate: number | null;
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

function formatShortTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function DetailedStatsModal({
  open,
  onOpenChange,
  player,
  matches,
}: DetailedStatsModalProps) {
  const t = useTranslations();
  const router = useRouter();

  // Filter to only ranked matches for stats
  const rankedMatches = React.useMemo(
    () => matches.filter((m) => m.type === 2), // MatchType.Ranked = 2
    [matches]
  );

  // Calculate win/loss stats
  const winLossStats = React.useMemo(() => {
    let wins = 0;
    let losses = 0;
    let draws = 0;

    rankedMatches.forEach((match) => {
      if (match.result.uuid === player.uuid) {
        wins++;
      } else if (match.result.uuid === null) {
        draws++;
      } else {
        losses++;
      }
    });

    return { wins, losses, draws, total: wins + losses + draws };
  }, [rankedMatches, player.uuid]);

  // Calculate seed type stats
  const seedTypeStats = React.useMemo(() => {
    const stats: Record<string, SeedTypeStats> = {};

    rankedMatches.forEach((match) => {
      const seedType = match.seed?.overworld || 'unknown';
      if (!stats[seedType]) {
        stats[seedType] = {
          type: seedType,
          played: 0,
          wins: 0,
          losses: 0,
          avgTime: 0,
          bestTime: Infinity,
        };
      }

      stats[seedType].played++;

      if (match.result.uuid === player.uuid) {
        stats[seedType].wins++;
        // Track completion time if player won
        const completion = match.completions?.find((c) => c.uuid === player.uuid);
        if (completion) {
          stats[seedType].avgTime += completion.time;
          if (completion.time < stats[seedType].bestTime) {
            stats[seedType].bestTime = completion.time;
          }
        }
      } else if (match.result.uuid !== null) {
        stats[seedType].losses++;
      }
    });

    // Calculate averages
    Object.values(stats).forEach((stat) => {
      if (stat.wins > 0) {
        stat.avgTime = stat.avgTime / stat.wins;
      }
      if (stat.bestTime === Infinity) {
        stat.bestTime = 0;
      }
    });

    return Object.values(stats).sort((a, b) => b.played - a.played);
  }, [rankedMatches, player.uuid]);

  // Calculate bastion type stats
  const bastionTypeStats = React.useMemo(() => {
    const stats: Record<string, BastionTypeStats> = {};

    rankedMatches.forEach((match) => {
      const bastionType = match.seed?.nether || 'unknown';
      if (!stats[bastionType]) {
        stats[bastionType] = {
          type: bastionType,
          played: 0,
          wins: 0,
          losses: 0,
          avgTime: 0,
          bestTime: Infinity,
        };
      }

      stats[bastionType].played++;

      if (match.result.uuid === player.uuid) {
        stats[bastionType].wins++;
        const completion = match.completions?.find((c) => c.uuid === player.uuid);
        if (completion) {
          stats[bastionType].avgTime += completion.time;
          if (completion.time < stats[bastionType].bestTime) {
            stats[bastionType].bestTime = completion.time;
          }
        }
      } else if (match.result.uuid !== null) {
        stats[bastionType].losses++;
      }
    });

    // Calculate averages
    Object.values(stats).forEach((stat) => {
      if (stat.wins > 0) {
        stat.avgTime = stat.avgTime / stat.wins;
      }
      if (stat.bestTime === Infinity) {
        stat.bestTime = 0;
      }
    });

    return Object.values(stats).sort((a, b) => b.played - a.played);
  }, [rankedMatches, player.uuid]);

  // Calculate opponent stats
  const opponentStats = React.useMemo(() => {
    const stats: Record<string, OpponentStats> = {};

    rankedMatches.forEach((match) => {
      const opponent = match.players.find((p) => p.uuid !== player.uuid);
      if (!opponent) return;

      if (!stats[opponent.uuid]) {
        stats[opponent.uuid] = {
          uuid: opponent.uuid,
          nickname: opponent.nickname,
          played: 0,
          wins: 0,
          losses: 0,
          lastPlayed: 0,
          eloRate: opponent.eloRate,
        };
      }

      stats[opponent.uuid].played++;
      stats[opponent.uuid].eloRate = opponent.eloRate;

      if (match.date > stats[opponent.uuid].lastPlayed) {
        stats[opponent.uuid].lastPlayed = match.date;
      }

      if (match.result.uuid === player.uuid) {
        stats[opponent.uuid].wins++;
      } else if (match.result.uuid !== null) {
        stats[opponent.uuid].losses++;
      }
    });

    return Object.values(stats)
      .filter((s) => s.played >= 2)
      .sort((a, b) => b.played - a.played)
      .slice(0, 10);
  }, [rankedMatches, player.uuid]);

  const bastionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bridge: t('player.detailedStats.bridge'),
      housing: t('player.detailedStats.housing'),
      stables: t('player.detailedStats.stables'),
      treasure: t('player.detailedStats.treasure'),
      unknown: t('player.detailedStats.unknown'),
    };
    return labels[type.toLowerCase()] || type;
  };

  const seedTypeLabel = (type: string) => {
    // Capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t('player.detailedStatistics')}
        className="max-w-4xl max-h-[90vh]"
      >
        <div className="space-y-4">
          {/* Match count info */}
          <div className="text-sm text-muted-foreground text-center">
            {t('player.showingMatches', { count: rankedMatches.length })}
            {rankedMatches.length >= 100 && (
              <span className="ml-1">({t('player.limitedMatches', { limit: 100 })})</span>
            )}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">{t('player.detailedStats.overview')}</span>
              </TabsTrigger>
              <TabsTrigger value="seeds" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('player.detailedStats.seedTypes')}</span>
              </TabsTrigger>
              <TabsTrigger value="bastions" className="gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">{t('player.detailedStats.bastionTypes')}</span>
              </TabsTrigger>
              <TabsTrigger value="opponents" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">{t('player.detailedStats.opponents')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card variant="mc">
                <CardHeader>
                  <CardTitle className="text-lg">{t('player.detailedStats.winLossDistribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Pie chart visualization */}
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {winLossStats.total > 0 && (
                          <>
                            {/* Wins slice */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="hsl(var(--chart-1))"
                              strokeWidth="20"
                              strokeDasharray={`${(winLossStats.wins / winLossStats.total) * 251.2} 251.2`}
                              strokeDashoffset="0"
                            />
                            {/* Losses slice */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="hsl(var(--destructive))"
                              strokeWidth="20"
                              strokeDasharray={`${(winLossStats.losses / winLossStats.total) * 251.2} 251.2`}
                              strokeDashoffset={`${-((winLossStats.wins / winLossStats.total) * 251.2)}`}
                            />
                            {/* Draws slice */}
                            {winLossStats.draws > 0 && (
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="hsl(var(--muted-foreground))"
                                strokeWidth="20"
                                strokeDasharray={`${(winLossStats.draws / winLossStats.total) * 251.2} 251.2`}
                                strokeDashoffset={`${-(((winLossStats.wins + winLossStats.losses) / winLossStats.total) * 251.2)}`}
                              />
                            )}
                          </>
                        )}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">
                          {winLossStats.total > 0
                            ? ((winLossStats.wins / winLossStats.total) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                        <span className="text-sm text-muted-foreground">{t('player.stats.winRate')}</span>
                      </div>
                    </div>

                    {/* Stats breakdown */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-chart-1" />
                          <span>{t('player.detailedStats.winsLabel', { count: winLossStats.wins })}</span>
                        </div>
                        <span className="font-bold text-chart-1">
                          {winLossStats.total > 0
                            ? ((winLossStats.wins / winLossStats.total) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-center gap-2">
                          <X className="h-5 w-5 text-destructive" />
                          <span>{t('player.detailedStats.lossesLabel', { count: winLossStats.losses })}</span>
                        </div>
                        <span className="font-bold text-destructive">
                          {winLossStats.total > 0
                            ? ((winLossStats.losses / winLossStats.total) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      {winLossStats.draws > 0 && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-muted">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 flex items-center justify-center text-muted-foreground">-</span>
                            <span>{t('player.detailedStats.drawsLabel', { count: winLossStats.draws })}</span>
                          </div>
                          <span className="font-bold text-muted-foreground">
                            {((winLossStats.draws / winLossStats.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Seed Types Tab */}
            <TabsContent value="seeds" className="space-y-4 mt-4">
              <Card variant="mc">
                <CardHeader>
                  <CardTitle className="text-lg">{t('player.detailedStats.seedTypes')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {seedTypeStats.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground font-semibold pb-2 border-b">
                        <div>{t('player.detailedStats.seedType')}</div>
                        <div className="text-center">{t('player.detailedStats.played')}</div>
                        <div className="text-center">{t('player.stats.wins')}</div>
                        <div className="text-center">{t('player.detailedStats.winRate')}</div>
                        <div className="text-center">{t('player.detailedStats.avgTime')}</div>
                        <div className="text-center">{t('player.detailedStats.bestTime')}</div>
                      </div>
                      {seedTypeStats.map((stat) => (
                        <div
                          key={stat.type}
                          className="grid grid-cols-6 gap-2 py-2 text-sm hover:bg-muted/50 rounded-lg px-1"
                        >
                          <div className="font-medium">{seedTypeLabel(stat.type)}</div>
                          <div className="text-center">{stat.played}</div>
                          <div className="text-center text-chart-1">{stat.wins}</div>
                          <div className="text-center">
                            {stat.played > 0
                              ? ((stat.wins / stat.played) * 100).toFixed(0)
                              : 0}
                            %
                          </div>
                          <div className="text-center font-mono text-xs">
                            {stat.avgTime > 0 ? formatShortTime(stat.avgTime) : '-'}
                          </div>
                          <div className="text-center font-mono text-xs text-primary">
                            {stat.bestTime > 0 ? formatShortTime(stat.bestTime) : '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {t('player.detailedStats.noSeedData')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bastion Types Tab */}
            <TabsContent value="bastions" className="space-y-4 mt-4">
              <Card variant="mc">
                <CardHeader>
                  <CardTitle className="text-lg">{t('player.detailedStats.bastionTypes')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {bastionTypeStats.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground font-semibold pb-2 border-b">
                        <div>{t('player.detailedStats.bastionType')}</div>
                        <div className="text-center">{t('player.detailedStats.played')}</div>
                        <div className="text-center">{t('player.stats.wins')}</div>
                        <div className="text-center">{t('player.detailedStats.winRate')}</div>
                        <div className="text-center">{t('player.detailedStats.avgTime')}</div>
                        <div className="text-center">{t('player.detailedStats.bestTime')}</div>
                      </div>
                      {bastionTypeStats.map((stat) => (
                        <div
                          key={stat.type}
                          className="grid grid-cols-6 gap-2 py-2 text-sm hover:bg-muted/50 rounded-lg px-1"
                        >
                          <div className="font-medium">{bastionTypeLabel(stat.type)}</div>
                          <div className="text-center">{stat.played}</div>
                          <div className="text-center text-chart-1">{stat.wins}</div>
                          <div className="text-center">
                            {stat.played > 0
                              ? ((stat.wins / stat.played) * 100).toFixed(0)
                              : 0}
                            %
                          </div>
                          <div className="text-center font-mono text-xs">
                            {stat.avgTime > 0 ? formatShortTime(stat.avgTime) : '-'}
                          </div>
                          <div className="text-center font-mono text-xs text-primary">
                            {stat.bestTime > 0 ? formatShortTime(stat.bestTime) : '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {t('player.detailedStats.noBastionData')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opponents Tab */}
            <TabsContent value="opponents" className="space-y-4 mt-4">
              <Card variant="mc">
                <CardHeader>
                  <CardTitle className="text-lg">{t('player.detailedStats.opponents')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {opponentStats.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-semibold pb-2 border-b">
                        <div>{t('player.detailedStats.opponent')}</div>
                        <div className="text-center">{t('player.detailedStats.matchesVs')}</div>
                        <div className="text-center">{t('player.detailedStats.record')}</div>
                        <div className="text-center">{t('player.detailedStats.winRate')}</div>
                        <div className="text-center">{t('player.detailedStats.lastPlayed')}</div>
                      </div>
                      {opponentStats.map((opponent) => (
                        <div
                          key={opponent.uuid}
                          className="grid grid-cols-5 gap-2 py-2 text-sm hover:bg-muted/50 rounded-lg px-1 cursor-pointer"
                          onClick={() => {
                            onOpenChange(false);
                            router.push(`/player/${opponent.nickname}`);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <PlayerAvatar
                              uuid={opponent.uuid}
                              username={opponent.nickname}
                              size="sm"
                            />
                            <span className="font-medium truncate">{opponent.nickname}</span>
                            {opponent.eloRate && (
                              <RankBadge elo={opponent.eloRate} className="text-xs" />
                            )}
                          </div>
                          <div className="text-center">{opponent.played}</div>
                          <div className="text-center">
                            <span className="text-chart-1">{opponent.wins}</span>
                            <span className="text-muted-foreground"> - </span>
                            <span className="text-destructive">{opponent.losses}</span>
                          </div>
                          <div className={cn(
                            'text-center font-medium',
                            opponent.wins > opponent.losses ? 'text-chart-1' :
                            opponent.wins < opponent.losses ? 'text-destructive' :
                            'text-muted-foreground'
                          )}>
                            {opponent.played > 0
                              ? ((opponent.wins / opponent.played) * 100).toFixed(0)
                              : 0}
                            %
                          </div>
                          <div className="text-center text-xs text-muted-foreground">
                            {new Date(opponent.lastPlayed * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {t('player.detailedStats.noOpponentData')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
