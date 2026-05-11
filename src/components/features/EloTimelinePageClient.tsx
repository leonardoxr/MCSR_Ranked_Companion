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
  Crown,
  Sparkles,
} from 'lucide-react';
import {
  useEloTimeline,
  type PlayerEloTimeline,
} from '@/lib/api/hooks/useEloTimeline';

type TimeRange = 'week' | 'month' | 'season';

interface ChartDataPoint {
  date: number;
  top1Elo?: number;
  top1Uuid?: string;
  [key: string]: number | string | undefined;
}

// Special color for Top 1 reference line
const TOP1_COLOR = '#FFD700'; // Gold

/**
 * Smooth data by interpolating values at regular intervals
 * Only interpolates between known points - does NOT extrapolate beyond data range
 */
function smoothData(
  data: ChartDataPoint[],
  playerUuids: string[],
  intervalMs: number = 24 * 60 * 60 * 1000
): ChartDataPoint[] {
  if (data.length < 2) return data;

  const minDate = data[0].date;
  const maxDate = data[data.length - 1].date;
  const smoothedData: ChartDataPoint[] = [];

  // Create evenly spaced time points
  for (let date = minDate; date <= maxDate; date += intervalMs) {
    const point: ChartDataPoint = { date };

    // For each player, interpolate their ELO at this time point
    playerUuids.forEach((uuid) => {
      // Find surrounding data points for this player
      let beforePoint: { date: number; elo: number } | null = null;
      let afterPoint: { date: number; elo: number } | null = null;

      for (const d of data) {
        const elo = d[uuid] as number | undefined;
        if (elo !== undefined) {
          if (d.date <= date) {
            beforePoint = { date: d.date, elo };
          }
          if (d.date >= date && !afterPoint) {
            afterPoint = { date: d.date, elo };
          }
        }
      }

      // Only interpolate when we have BOTH surrounding points (no extrapolation)
      if (beforePoint && afterPoint) {
        if (beforePoint.date === afterPoint.date) {
          point[uuid] = beforePoint.elo;
        } else {
          // Linear interpolation
          const ratio = (date - beforePoint.date) / (afterPoint.date - beforePoint.date);
          point[uuid] = Math.round(beforePoint.elo + ratio * (afterPoint.elo - beforePoint.elo));
        }
      }
      // If only beforePoint or only afterPoint exists, don't set value (no extrapolation)
    });

    smoothedData.push(point);
  }

  return smoothedData;
}

/**
 * Calculate who was #1 at each data point based on ELO values
 */
function calculateTop1AtEachPoint(
  data: ChartDataPoint[],
  playerUuids: string[]
): ChartDataPoint[] {
  return data.map((point) => {
    let maxElo = -1;
    let top1Uuid: string | undefined;

    playerUuids.forEach((uuid) => {
      const elo = point[uuid] as number | undefined;
      if (elo !== undefined && elo > maxElo) {
        maxElo = elo;
        top1Uuid = uuid;
      }
    });

    return {
      ...point,
      top1Elo: maxElo > 0 ? maxElo : undefined,
      top1Uuid,
    };
  });
}

export function EloTimelinePageClient() {
  const router = useRouter();
  const t = useTranslations();

  // State
  const [timeRange, setTimeRange] = React.useState<TimeRange>('season');
  const [selectedPlayers, setSelectedPlayers] = React.useState<Set<string>>(
    new Set()
  );
  const [showAllPlayers, setShowAllPlayers] = React.useState(false);
  const [chartHeight, setChartHeight] = React.useState(450);
  const [smoothGraph, setSmoothGraph] = React.useState(true);
  const [showTop1, setShowTop1] = React.useState(true);
  const hasInitializedSelection = React.useRef(false);

  // Fetch data
  const {
    playerTimelines,
    isLoading,
    isLoadingLeaderboard,
    leaderboardError,
  } = useEloTimeline({ playerCount: 20 });

  // Get current top 1 player
  const currentTop1Player = playerTimelines.length > 0 ? playerTimelines[0] : null;

  // Initialize selected players with top 10 on first load only
  React.useEffect(() => {
    if (playerTimelines.length > 0 && !hasInitializedSelection.current) {
      const top10 = playerTimelines.slice(0, 10).map((p) => p.uuid);
      setSelectedPlayers(new Set(top10));
      hasInitializedSelection.current = true;
    }
  }, [playerTimelines]);

  // Filter data by time range - ALL players (for Top 1 reference)
  const allTimelinesFiltered = React.useMemo(() => {
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
        cutoff = 0;
    }

    return playerTimelines.map((player) => ({
      ...player,
      data: player.data.filter((d) => d.date >= cutoff),
    }));
  }, [playerTimelines, timeRange]);

  // Filter data by time range - SELECTED players only (for player lines)
  const filteredTimelines = React.useMemo(() => {
    return allTimelinesFiltered.filter((p) => selectedPlayers.has(p.uuid));
  }, [allTimelinesFiltered, selectedPlayers]);

  // Get smoothing interval based on time range
  const smoothingInterval = React.useMemo(() => {
    switch (timeRange) {
      case 'week':
        return 6 * 60 * 60 * 1000;
      case 'month':
        return 12 * 60 * 60 * 1000;
      case 'season':
      default:
        return 24 * 60 * 60 * 1000;
    }
  }, [timeRange]);

  // Transform data for recharts
  const chartData = React.useMemo(() => {
    // Use ALL players for date collection (so Top 1 line always has data)
    const allDates = new Set<number>();

    allTimelinesFiltered.forEach((player) => {
      player.data.forEach((point) => {
        allDates.add(point.date);
      });
    });

    const sortedDates = Array.from(allDates).sort((a, b) => a - b);

    // Build data points with ALL players (for Top 1) and selected players (for lines)
    const data: ChartDataPoint[] = sortedDates.map((date) => {
      const point: ChartDataPoint = { date };

      // Add selected player data
      filteredTimelines.forEach((player) => {
        const playerPoint = player.data.find((d) => d.date === date);
        if (playerPoint) {
          point[player.uuid] = playerPoint.elo;
        }
      });

      return point;
    });

    // Fill in gaps with previous values for selected players
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

    // Apply smoothing if enabled (only to selected players)
    let processedData = filledData;
    if (smoothGraph && filledData.length > 2) {
      processedData = smoothData(
        filledData,
        filteredTimelines.map((p) => p.uuid),
        smoothingInterval
      );
    }

    // Calculate Top 1 at each point using ALL players (not just selected)
    if (showTop1 && allTimelinesFiltered.length > 0) {
      // Build separate data for Top 1 calculation using ALL players
      const allPlayersData: ChartDataPoint[] = sortedDates.map((date) => {
        const point: ChartDataPoint = { date };
        allTimelinesFiltered.forEach((player) => {
          const playerPoint = player.data.find((d) => d.date === date);
          if (playerPoint) {
            point[player.uuid] = playerPoint.elo;
          }
        });
        return point;
      });

      // Fill gaps for all players
      const allLastValues: Record<string, number> = {};
      const allFilledData: ChartDataPoint[] = [];
      allPlayersData.forEach((point) => {
        const newPoint: ChartDataPoint = { date: point.date };
        allTimelinesFiltered.forEach((player) => {
          if (point[player.uuid] !== undefined) {
            allLastValues[player.uuid] = point[player.uuid] as number;
            newPoint[player.uuid] = point[player.uuid];
          } else if (allLastValues[player.uuid] !== undefined) {
            newPoint[player.uuid] = allLastValues[player.uuid];
          }
        });
        allFilledData.push(newPoint);
      });

      // Apply smoothing to all players data for Top 1
      let top1Data = allFilledData;
      if (smoothGraph && allFilledData.length > 2) {
        top1Data = smoothData(
          allFilledData,
          allTimelinesFiltered.map((p) => p.uuid),
          smoothingInterval
        );
      }

      // Calculate Top 1 from all players
      const top1Calculated = calculateTop1AtEachPoint(
        top1Data,
        allTimelinesFiltered.map((p) => p.uuid)
      );

      // Merge Top 1 data into processed data
      processedData = processedData.map((point, i) => ({
        ...point,
        top1Elo: top1Calculated[i]?.top1Elo,
        top1Uuid: top1Calculated[i]?.top1Uuid,
      }));
    }

    return processedData;
  }, [allTimelinesFiltered, filteredTimelines, smoothGraph, smoothingInterval, showTop1]);

  // Responsive chart height
  React.useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(300);
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
    setSelectedPlayers(new Set(playerTimelines.slice(0, 10).map((p) => p.uuid)));
  };

  // Rank tier reference lines (at actual tier start boundaries)
  const rankTiers = [
    { name: t('ranks.netherite'), elo: 2000, color: '#4A5568' },
    { name: t('ranks.diamond'), elo: 1500, color: '#4299E1' },
    { name: t('ranks.emerald'), elo: 1200, color: '#48BB78' },
    { name: t('ranks.gold'), elo: 900, color: '#ECC94B' },
    { name: t('ranks.iron'), elo: 600, color: '#A0AEC0' },
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
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 sm:px-3">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden xs:inline">{t('common.back')}</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold truncate">
              {t('eloTimeline.title', { defaultValue: 'ELO Timeline' })}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {t('eloTimeline.description', {
                defaultValue: 'Track ELO progression of top players over time',
              })}
            </p>
          </div>
        </div>

        {/* Filters - Mobile Friendly Layout */}
        <div className="flex flex-col gap-3">
          {/* Time Range Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {(['week', 'month', 'season'] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="text-xs h-7 px-2 sm:px-3"
                >
                  {t(`eloTimeline.${range}`, {
                    defaultValue:
                      range === 'week' ? '1W' : range === 'month' ? '1M' : 'All',
                  })}
                </Button>
              ))}
            </div>
          </div>

          {/* Checkboxes Row */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {/* Smooth Graph Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <div
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center shrink-0 transition-colors',
                  smoothGraph ? 'bg-primary' : 'bg-muted/50 border border-border'
                )}
                onClick={() => setSmoothGraph(!smoothGraph)}
              >
                {smoothGraph && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span className="hidden xs:inline">{t('eloTimeline.smoothGraph', { defaultValue: 'Smooth' })}</span>
              </span>
            </label>

            {/* Show Top 1 Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <div
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center shrink-0 transition-colors',
                  showTop1 ? 'bg-yellow-500' : 'bg-muted/50 border border-border'
                )}
                onClick={() => setShowTop1(!showTop1)}
              >
                {showTop1 && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Crown className="h-3 w-3 text-yellow-500" />
                <span>{t('eloTimeline.showTop1', { defaultValue: '#1 Ref' })}</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <Card variant="mc" className="overflow-hidden">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-sm sm:text-base flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 min-w-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <span className="truncate">{t('eloTimeline.chartTitle', { defaultValue: 'ELO Progression' })}</span>
            </span>
            <span className="text-xs text-muted-foreground font-normal whitespace-nowrap">
              {selectedPlayers.size} {t('eloTimeline.playersSelected', { defaultValue: 'selected' })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-1 sm:px-4">
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ height: chartHeight }}>
              <LoadingState message={t('eloTimeline.loadingMatches', { defaultValue: 'Loading...' })} />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center text-muted-foreground text-sm" style={{ height: chartHeight }}>
              {t('eloTimeline.noData', { defaultValue: 'No data available' })}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
                      <stop offset="5%" stopColor={player.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={player.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => formatDate(new Date(value), 'MM/dd')}
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                  tickMargin={8}
                />
                <YAxis
                  domain={['dataMin - 100', 'dataMax + 100']}
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                  tickMargin={4}
                  width={45}
                />
                <Tooltip content={<CustomTooltip players={filteredTimelines} showTop1={showTop1} />} />
                <Legend
                  content={<CustomLegend players={filteredTimelines} showTop1={showTop1} />}
                  wrapperStyle={{ paddingTop: 10 }}
                />

                {/* Rank tier reference lines */}
                {rankTiers.map((tier) => (
                  <ReferenceLine
                    key={tier.name}
                    y={tier.elo}
                    stroke={tier.color}
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                  />
                ))}

                {/* Top 1 reference line - shows who was #1 at each moment */}
                {showTop1 && (
                  <Line
                    type={smoothGraph ? 'monotone' : 'linear'}
                    dataKey="top1Elo"
                    name="Top 1"
                    stroke={TOP1_COLOR}
                    strokeWidth={3}
                    dot={false}
                    connectNulls
                    strokeDasharray="5 5"
                    activeDot={{
                      r: 6,
                      fill: TOP1_COLOR,
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 2,
                    }}
                  />
                )}

                {/* Player lines */}
                {filteredTimelines.map((player) => (
                  <Line
                    key={player.uuid}
                    type={smoothGraph ? 'monotone' : 'linear'}
                    dataKey={player.uuid}
                    name={player.nickname}
                    stroke={player.color}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    activeDot={{
                      r: 5,
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

      {/* Current Top 1 Info Card - Mobile Friendly */}
      {showTop1 && currentTop1Player && (
        <Card variant="mc" className="border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-transparent">
          <CardContent className="py-2.5 px-3 sm:px-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Crown className="h-4 w-4 text-yellow-500 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-yellow-500">
                {t('eloTimeline.currentTop1', { defaultValue: 'Current #1' })}:
              </span>
              <div className="flex items-center gap-1.5">
                <PlayerAvatar uuid={currentTop1Player.uuid} size="xs" />
                <span className="text-xs sm:text-sm font-medium">{currentTop1Player.nickname}</span>
                <RankBadge elo={currentTop1Player.eloRate} className="text-xs" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 text-xs px-2"
                onClick={() => router.push(`/player/${currentTop1Player.nickname}`)}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Selection - Mobile Friendly */}
      <Card variant="mc">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {t('eloTimeline.selectPlayers', { defaultValue: 'Players' })}
            </CardTitle>
            <div className="flex gap-1.5 flex-wrap">
              <Button variant="outline" size="sm" onClick={selectTop10} className="h-7 text-xs px-2">
                Top 10
              </Button>
              <Button variant="outline" size="sm" onClick={selectAll} className="h-7 text-xs px-2">
                {t('eloTimeline.selectAll', { defaultValue: 'All' })}
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone} className="h-7 text-xs px-2">
                {t('eloTimeline.selectNone', { defaultValue: 'None' })}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-3 sm:px-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-2">
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
              className="w-full mt-3 h-8 text-xs"
              onClick={() => setShowAllPlayers(!showAllPlayers)}
            >
              {showAllPlayers ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {t('common.showLess')}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
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
        'flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg border cursor-pointer transition-all min-w-0',
        selected
          ? 'border-primary/50 bg-primary/5'
          : 'border-border/50 bg-muted/10 hover:border-border'
      )}
      onClick={onToggle}
    >
      <div
        className={cn(
          'w-4 h-4 rounded flex items-center justify-center shrink-0',
          selected ? 'bg-primary' : 'bg-muted/50 border border-border'
        )}
      >
        {selected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
      </div>

      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: player.color }}
      />

      <span className="text-[10px] text-muted-foreground shrink-0">#{rank}</span>

      <PlayerAvatar uuid={player.uuid} size="xs" className="shrink-0" />

      <span className="text-xs font-medium truncate flex-1 min-w-0">{player.nickname}</span>

      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 shrink-0 hidden xs:flex"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/player/${player.nickname}`);
        }}
      >
        <ExternalLink className="h-2.5 w-2.5" />
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
  showTop1: boolean;
}

function CustomTooltip({ active, payload, label, players, showTop1 }: CustomTooltipProps) {
  if (!active || !payload || !payload.length || !label) {
    return null;
  }

  // Find Top 1 entry and regular player entries
  const top1Entry = payload.find((p) => p.dataKey === 'top1Elo');
  const playerEntries = payload.filter((p) => p.dataKey !== 'top1Elo' && p.dataKey !== 'top1Uuid');

  // Sort by ELO descending
  const sortedPayload = [...playerEntries].sort((a, b) => (b.value || 0) - (a.value || 0));

  // Find current top1 uuid from data
  const dataPoint = payload.find((p) => p.dataKey === 'top1Uuid');

  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-2 sm:p-3 shadow-xl max-w-[200px] sm:max-w-xs">
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 font-semibold">
        {formatDate(new Date(label), 'PP')}
      </p>

      {/* Top 1 at this moment */}
      {showTop1 && top1Entry && top1Entry.value !== undefined && (
        <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-border/50">
          <Crown className="h-3 w-3 text-yellow-500 shrink-0" />
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: TOP1_COLOR }}
          />
          <span className="text-[10px] sm:text-xs text-yellow-500 font-medium">Top 1</span>
          <span className="text-[10px] sm:text-xs font-semibold ml-auto">{Math.round(top1Entry.value)}</span>
        </div>
      )}

      <div className="space-y-0.5 max-h-48 overflow-y-auto">
        {sortedPayload.map((entry) => {
          const player = players.find((p) => p.uuid === entry.dataKey);
          if (!player || entry.value === undefined) return null;

          return (
            <div key={entry.dataKey} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[10px] sm:text-xs truncate flex-1">{player.nickname}</span>
              <span className="text-[10px] sm:text-xs font-semibold">{Math.round(entry.value)}</span>
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
  showTop1: boolean;
}

function CustomLegend({ payload, players, showTop1 }: CustomLegendProps) {
  if (!payload || payload.length === 0) return null;

  // Filter out top1Elo and top1Uuid entries
  const playerPayload = payload.filter((p) => p.dataKey !== 'top1Elo' && p.dataKey !== 'top1Uuid');

  return (
    <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1 px-2">
      {/* Top 1 reference legend */}
      {showTop1 && (
        <div className="flex items-center gap-1">
          <Crown className="h-2.5 w-2.5 text-yellow-500" />
          <div
            className="w-3 h-0.5 rounded"
            style={{ backgroundColor: TOP1_COLOR }}
          />
          <span className="text-[10px] sm:text-xs text-yellow-500 font-medium">Top 1</span>
        </div>
      )}

      {playerPayload.slice(0, 8).map((entry) => {
        const player = players.find((p) => p.uuid === entry.dataKey);
        return (
          <div key={entry.dataKey} className="flex items-center gap-1">
            <div
              className="w-2 sm:w-3 h-0.5 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {player?.nickname || entry.value}
            </span>
          </div>
        );
      })}
      {playerPayload.length > 8 && (
        <span className="text-[10px] sm:text-xs text-muted-foreground">
          +{playerPayload.length - 8}
        </span>
      )}
    </div>
  );
}
