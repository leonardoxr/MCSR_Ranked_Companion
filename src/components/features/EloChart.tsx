'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { RankBadge } from '@/components/features/RankBadge';
import { formatDate } from '@/lib/utils/formatters';
import { getRankTier } from '@/lib/utils/colors';
import { TrendingUp, TrendingDown, ExternalLink, Minus, MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EloRate } from '@/types/api';

export interface EloDataPoint {
  date: string | number;
  elo: EloRate;
  matchId?: string;
  eloChange?: number;
}

export interface EloChartProps {
  data: EloDataPoint[];
  className?: string;
  showRankLines?: boolean;
  onMatchClick?: (matchId: string) => void;
}

/**
 * EloChart component for visualizing ELO progression over time
 * Shows line chart with optional rank tier reference lines
 * Now with clickable data points to navigate to matches
 */
export function EloChart({
  data,
  className,
  showRankLines = true,
  onMatchClick,
}: EloChartProps) {
  const t = useTranslations();
  const router = useRouter();
  const [chartHeight, setChartHeight] = React.useState(300);
  const [isMobile, setIsMobile] = React.useState(false);
  const [selectedPoint, setSelectedPoint] = React.useState<EloDataPoint | null>(null);

  // Set responsive chart height based on screen size
  React.useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        setChartHeight(280); // Mobile: slightly taller to accommodate info
      } else if (window.innerWidth < 1024) {
        setChartHeight(320); // Tablet: medium height
      } else {
        setChartHeight(350); // Desktop: full height
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const rankTiers = [
    { name: t('ranks.netherite'), elo: 2000, color: '#4A5568' },
    { name: t('ranks.diamond'), elo: 1600, color: '#4299E1' },
    { name: t('ranks.emerald'), elo: 1250, color: '#48BB78' },
    { name: t('ranks.gold'), elo: 950, color: '#ECC94B' },
    { name: t('ranks.iron'), elo: 700, color: '#A0AEC0' },
    { name: t('ranks.coal'), elo: 0, color: '#2D3748' },
  ];

  // Calculate ELO change for each data point
  const dataWithChanges = React.useMemo(() => {
    return data.map((point, idx) => {
      const prevPoint = idx > 0 ? data[idx - 1] : null;
      const eloChange = prevPoint ? point.elo - prevPoint.elo : 0;
      return { ...point, eloChange };
    });
  }, [data]);

  // Calculate stats
  const stats = React.useMemo(() => {
    if (data.length === 0) return null;
    const eloValues = data.map(d => d.elo);
    const highestElo = Math.max(...eloValues);
    const lowestElo = Math.min(...eloValues);
    const currentElo = data[data.length - 1]?.elo || 0;
    const startElo = data[0]?.elo || 0;
    const totalChange = currentElo - startElo;
    return { highestElo, lowestElo, currentElo, startElo, totalChange };
  }, [data]);

  const handlePointClick = (point: EloDataPoint) => {
    setSelectedPoint(point);
    if (point.matchId) {
      if (onMatchClick) {
        onMatchClick(point.matchId);
      }
    }
  };

  const goToMatch = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  return (
    <Card variant="mc" className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('charts.eloProgression')}
          </CardTitle>
          {stats && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                {t('charts.range', { defaultValue: 'Range' })}:
                <span className="font-semibold text-foreground ml-1">{stats.lowestElo}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="font-semibold text-foreground">{stats.highestElo}</span>
              </span>
            </div>
          )}
        </div>
        {/* Stats summary */}
        {stats && (
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{t('charts.peak', { defaultValue: 'Peak' })}:</span>
              <RankBadge elo={stats.highestElo} showElo className="text-xs" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{t('charts.change', { defaultValue: 'Change' })}:</span>
              <span className={cn(
                'font-semibold flex items-center gap-0.5',
                stats.totalChange > 0 ? 'text-emerald' : stats.totalChange < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {stats.totalChange > 0 ? <TrendingUp className="h-3 w-3" /> : stats.totalChange < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {stats.totalChange > 0 ? '+' : ''}{stats.totalChange}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MousePointerClick className="h-3 w-3" />
              <span className="text-xs">{t('charts.clickToView', { defaultValue: 'Click point to view match' })}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart
            data={dataWithChanges}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload[0]) {
                handlePointClick(e.activePayload[0].payload);
              }
            }}
          >
            <defs>
              <linearGradient id="eloGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                if (isMobile) {
                  return formatDate(date, 'MM/d');
                }
                return formatDate(date, 'MMM d');
              }}
              className="text-xs text-muted-foreground"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis
              domain={['dataMin - 50', 'dataMax + 50']}
              className="text-xs text-muted-foreground"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <Tooltip
              content={<CustomTooltip onViewMatch={goToMatch} />}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '5 5' }}
            />

            {/* Rank tier reference lines */}
            {showRankLines &&
              rankTiers.map((tier) => (
                <ReferenceLine
                  key={tier.name}
                  y={tier.elo}
                  stroke={tier.color}
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                  label={{
                    value: tier.name,
                    position: 'right',
                    fill: tier.color,
                    fontSize: isMobile ? 8 : 10,
                  }}
                />
              ))}

            <Line
              type="monotone"
              dataKey="elo"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 5, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2, cursor: 'pointer' }}
              activeDot={{ r: 8, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 3, cursor: 'pointer' }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Selected point details */}
        {selectedPoint && selectedPoint.matchId && (
          <div className="mt-4 p-3 bg-muted/30 border border-border/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RankBadge elo={selectedPoint.elo} showElo />
              <span className="text-sm text-muted-foreground">
                {formatDate(new Date(selectedPoint.date), 'PPP')}
              </span>
              {selectedPoint.eloChange !== undefined && selectedPoint.eloChange !== 0 && (
                <span className={cn(
                  'text-sm font-semibold flex items-center gap-0.5',
                  selectedPoint.eloChange > 0 ? 'text-emerald' : 'text-destructive'
                )}>
                  {selectedPoint.eloChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {selectedPoint.eloChange > 0 ? '+' : ''}{selectedPoint.eloChange}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => goToMatch(selectedPoint.matchId!)}
              className="gap-1"
            >
              {t('charts.viewMatch', { defaultValue: 'View Match' })}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: EloDataPoint & { eloChange?: number };
  }>;
  onViewMatch?: (matchId: string) => void;
}

function CustomTooltip({ active, payload, onViewMatch }: CustomTooltipProps) {
  const t = useTranslations();

  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const change = data.eloChange || 0;

  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-xl min-w-[180px]">
      <p className="text-xs text-muted-foreground mb-2">
        {formatDate(new Date(data.date), 'PPP')}
      </p>
      <div className="flex items-center justify-between gap-4 mb-2">
        <RankBadge elo={data.elo} showElo />
        {change !== 0 && (
          <span className={cn(
            'text-sm font-bold flex items-center gap-0.5',
            change > 0 ? 'text-emerald' : 'text-destructive'
          )}>
            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change > 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
      {data.matchId && (
        <div className="pt-2 border-t border-border/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewMatch?.(data.matchId!);
            }}
            className="text-xs text-primary hover:underline flex items-center gap-1 w-full justify-center py-1"
          >
            {t('charts.clickToViewMatch', { defaultValue: 'Click to view match' })}
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
