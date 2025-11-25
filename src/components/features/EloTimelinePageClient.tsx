'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  ChevronLeft,
  Users,
  Calendar,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  useEloTimeline,
  type PlayerEloTimeline,
} from '@/lib/api/hooks/useEloTimeline';

type TimeRange = 'week' | 'month' | 'season';

interface ChartDataPoint {
  date: number;
  [key: string]: number | string | undefined;
}

export function EloTimelinePageClient() {
  const router = useRouter();
  const t = useTranslations();

  // State
  const [playerCount, setPlayerCount] = React.useState(10);
  const [timeRange, setTimeRange] = React.useState<TimeRange>('season');
  const [selectedPlayers, setSelectedPlayers] = React.useState<Set<string>>(
    new Set()
  );
  const [showAllPlayers, setShowAllPlayers] = React.useState(false);
  const [chartHeight, setChartHeight] = React.useState(450);

  // Fetch data
  const {
    playerTimelines,
    isLoading,
    isLoadingLeaderboard,
    leaderboardError,
    matchErrors,
  } = useEloTimeline({ playerCount: 20 });

  // Initialize selected players with top 10 on first load
  React.useEffect(() => {
    if (playerTimelines.length > 0 && selectedPlayers.size === 0) {
      const top10 = playerTimelines.slice(0, 10).map((p) => p.uuid);
      setSelectedPlayers(new Set(top10));
    }
  }, [playerTimelines, selectedPlayers.size]);

  // Filter data by time range
  const filteredTimelines = React.useMemo(() => {
    const now = Date.now();
    let cutoff: number;

    switch (timeRange) {
      case 'week':
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        cutoff = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'season':
      default:
        cutoff = 0; // Show all data
    }

    return playerTimelines
      .filter((p) => selectedPlayers.has(p.uuid))
      .map((player) => ({
        ...player,
        data: player.data.filter((d) => d.date >= cutoff),
      }));
  }, [playerTimelines, selectedPlayers, timeRange]);

  // Transform data for recharts (combine all player data points)
  const chartData = React.useMemo(() => {
    const allDates = new Set<number>();

    // Collect all unique dates
    filteredTimelines.forEach((player) => {
      player.data.forEach((point) => {
        allDates.add(point.date);
      });
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort((a, b) => a - b);

    // Create data points with player ELO values
    const data: ChartDataPoint[] = sortedDates.map((date) => {
      const point: ChartDataPoint = { date };

      filteredTimelines.forEach((player) => {
        // Find the closest data point for this player at or before this date
        const playerPoint = player.data.find((d) => d.date === date);
        if (playerPoint) {
          point[player.uuid] = playerPoint.elo;
        }
      });

      return point;
    });

    // Fill in gaps with previous values (for continuous lines)
    const filledData: ChartDataPoint[] = [];
    const lastValues: Record<string, number> = {};

    data.forEach((point) => {
      const newPoint: ChartDataPoint = { date: point.date };

      filteredTimelines.forEach((player) => {
        if (point[player.uuid] !== undefined) {
          lastValues[player.uuid] = point[player.uuid] as number;
          newPoint[player.uuid] = point[player.uuid];
        } else if (lastValues[player.uuid] !== undefined) {
          newPoint[player.uuid] = lastValues[player.uuid];
        }
      });

      filledData.push(newPoint);
    });

    return filledData;
  }, [filteredTimelines]);

  // Responsive chart height
  React.useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(350);
      } else if (window.innerWidth < 1024) {
        setChartHeight(400);
      } else {
        setChartHeight(500);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const togglePlayer = (uuid: string) => {
    const newSet = new Set(selectedPlayers);
    if (newSet.has(uuid)) {
      newSet.delete(uuid);
    } else {
      newSet.add(uuid);
    }
    setSelectedPlayers(newSet);
  };

  const selectAll = () => {
    setSelectedPlayers(new Set(playerTimelines.map((p) => p.uuid)));
  };

  const selectNone = () => {
    setSelectedPlayers(new Set());
  };

  const selectTop10 = () => {
    setSelectedPlayers(
      new Set(playerTimelines.slice(0, 10).map((p) => p.uuid))
    );
  };

  // Rank tier reference lines
  const rankTiers = [
    { name: t('ranks.netherite'), elo: 2000, color: '#4A5568' },
    { name: t('ranks.diamond'), elo: 1600, color: '#4299E1' },
    { name: t('ranks.emerald'), elo: 1250, color: '#48BB78' },
    { name: t('ranks.gold'), elo: 950, color: '#ECC94B' },
    { name: t('ranks.iron'), elo: 700, color: '#A0AEC0' },
  ];

  if (isLoadingLeaderboard) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <LoadingState message={t('eloTimeline.loading', { defaultValue: 'Loading ELO timeline...' })} />
      </div>
    );
  }

  if (leaderboardError) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <ErrorState
          title={t('eloTimeline.error', { defaultValue: 'Failed to Load Timeline' })}
          message={leaderboardError.message}
        />
      </div>
    );
  }

  const displayedPlayers = showAllPlayers
    ? playerTimelines
    : playerTimelines.slice(0, 10);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">
                {t('eloTimeline.title', { defaultValue: 'ELO Timeline' })}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('eloTimeline.description', {
                  defaultValue: 'Track ELO progression of top players over time',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {t('eloTimeline.timeRange', { defaultValue: 'Time Range' })}:
          </span>
          <div className="flex gap-1">
            {(['week', 'month', 'season'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {t(`eloTimeline.${range}`, {
                  defaultValue:
                    range === 'week'
                      ? 'Last Week'
                      : range === 'month'
                      ? 'Last Month'
                      : 'Full Season',
                })}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <Card variant="mc" className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('eloTimeline.chartTitle', { defaultValue: 'ELO Progression' })}
            </span>
            <span className="text-sm text-muted-foreground font-normal">
              {selectedPlayers.size} {t('eloTimeline.playersSelected', { defaultValue: 'players selected' })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ height: chartHeight }}>
              <LoadingState message={t('eloTimeline.loadingMatches', { defaultValue: 'Loading match history...' })} />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center text-muted-foreground" style={{ height: chartHeight }}>
              {t('eloTimeline.noData', { defaultValue: 'No data available for selected players' })}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={chartData}>
                <defs>
                  {filteredTimelines.map((player) => (
                    <linearGradient
                      key={player.uuid}
                      id={`gradient-${player.uuid}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={player.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={player.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => formatDate(new Date(value), 'MM/dd')}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <YAxis
                  domain={['dataMin - 100', 'dataMax + 100']}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <Tooltip content={<CustomTooltip players={filteredTimelines} />} />
                <Legend
                  content={<CustomLegend players={filteredTimelines} />}
                  wrapperStyle={{ paddingTop: 20 }}
                />

                {/* Rank tier reference lines */}
                {rankTiers.map((tier) => (
                  <ReferenceLine
                    key={tier.name}
                    y={tier.elo}
                    stroke={tier.color}
                    strokeDasharray="3 3"
                    strokeOpacity={0.4}
                    label={{
                      value: tier.name,
                      position: 'right',
                      fill: tier.color,
                      fontSize: 9,
                    }}
                  />
                ))}

                {/* Player lines */}
                {filteredTimelines.map((player) => (
                  <Line
                    key={player.uuid}
                    type="monotone"
                    dataKey={player.uuid}
                    name={player.nickname}
                    stroke={player.color}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    activeDot={{
                      r: 6,
                      fill: player.color,
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 2,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Player Selection */}
      <Card variant="mc">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('eloTimeline.selectPlayers', { defaultValue: 'Select Players' })}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectTop10}>
                Top 10
              </Button>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {t('eloTimeline.selectAll', { defaultValue: 'All' })}
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                {t('eloTimeline.selectNone', { defaultValue: 'None' })}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {displayedPlayers.map((player, index) => (
              <PlayerToggle
                key={player.uuid}
                player={player}
                rank={index + 1}
                selected={selectedPlayers.has(player.uuid)}
                onToggle={() => togglePlayer(player.uuid)}
              />
            ))}
          </div>

          {playerTimelines.length > 10 && (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowAllPlayers(!showAllPlayers)}
            >
              {showAllPlayers ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  {t('common.showLess')}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {t('common.showAll')} ({playerTimelines.length})
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface PlayerToggleProps {
  player: PlayerEloTimeline;
  rank: number;
  selected: boolean;
  onToggle: () => void;
}

function PlayerToggle({ player, rank, selected, onToggle }: PlayerToggleProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all',
        selected
          ? 'border-primary/50 bg-primary/5'
          : 'border-border/50 bg-muted/10 hover:border-border'
      )}
      onClick={onToggle}
    >
      <div
        className={cn(
          'w-5 h-5 rounded flex items-center justify-center shrink-0',
          selected ? 'bg-primary' : 'bg-muted/50 border border-border'
        )}
      >
        {selected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>

      <div
        className="w-4 h-4 rounded-full shrink-0"
        style={{ backgroundColor: player.color }}
      />

      <span className="text-xs text-muted-foreground shrink-0">#{rank}</span>

      <PlayerAvatar uuid={player.uuid} size="xs" className="shrink-0" />

      <span className="text-sm font-medium truncate flex-1">{player.nickname}</span>

      <RankBadge elo={player.eloRate} className="shrink-0 text-xs" />

      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/player/${player.nickname}`);
        }}
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: number;
  players: PlayerEloTimeline[];
}

function CustomTooltip({ active, payload, label, players }: CustomTooltipProps) {
  if (!active || !payload || !payload.length || !label) {
    return null;
  }

  // Sort by ELO descending
  const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-xl max-w-xs">
      <p className="text-xs text-muted-foreground mb-2 font-semibold">
        {formatDate(new Date(label), 'PPP')}
      </p>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {sortedPayload.map((entry) => {
          const player = players.find((p) => p.uuid === entry.dataKey);
          if (!player || entry.value === undefined) return null;

          return (
            <div key={entry.dataKey} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs truncate flex-1">{player.nickname}</span>
              <span className="text-xs font-semibold">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    dataKey: string;
  }>;
  players: PlayerEloTimeline[];
}

function CustomLegend({ payload, players }: CustomLegendProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-4">
      {payload.slice(0, 10).map((entry) => {
        const player = players.find((p) => p.uuid === entry.dataKey);
        return (
          <div key={entry.dataKey} className="flex items-center gap-1">
            <div
              className="w-3 h-0.5 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {player?.nickname || entry.value}
            </span>
          </div>
        );
      })}
      {payload.length > 10 && (
        <span className="text-xs text-muted-foreground">
          +{payload.length - 10} more
        </span>
      )}
    </div>
  );
}
