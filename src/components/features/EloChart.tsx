'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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
import { RankBadge } from '@/components/features/RankBadge';
import { formatDate } from '@/lib/utils/formatters';
import { getRankTier } from '@/lib/utils/colors';
import type { EloRate } from '@/types/api';

export interface EloDataPoint {
  date: string | number;
  elo: EloRate;
  matchId?: string;
}

export interface EloChartProps {
  data: EloDataPoint[];
  className?: string;
  showRankLines?: boolean;
}

/**
 * EloChart component for visualizing ELO progression over time
 * Shows line chart with optional rank tier reference lines
 */
export function EloChart({
  data,
  className,
  showRankLines = true,
}: EloChartProps) {
  const t = useTranslations();
  const [chartHeight, setChartHeight] = React.useState(300);

  // Set responsive chart height based on screen size
  React.useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(200); // Mobile: shorter height
      } else if (window.innerWidth < 1024) {
        setChartHeight(250); // Tablet: medium height
      } else {
        setChartHeight(300); // Desktop: full height
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const rankTiers = [
    { name: t('ranks.netherite'), elo: 2000, color: '#4A5568' },
    { name: t('ranks.diamond'), elo: 1600, color: '#4299E1' },
    { name: t('ranks.emerald'), elo: 1250, color: '#48BB78' },
    { name: t('ranks.gold'), elo: 950, color: '#ECC94B' },
    { name: t('ranks.iron'), elo: 700, color: '#A0AEC0' },
    { name: t('ranks.coal'), elo: 0, color: '#2D3748' },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{t('charts.eloProgression')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return formatDate(date, 'MMM d');
              }}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              domain={['dataMin - 50', 'dataMax + 50']}
              className="text-xs text-muted-foreground"
            />
            <Tooltip
              content={<CustomTooltip />}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />

            {/* Rank tier reference lines */}
            {showRankLines &&
              rankTiers.map((tier) => (
                <ReferenceLine
                  key={tier.name}
                  y={tier.elo}
                  stroke={tier.color}
                  strokeDasharray="3 3"
                  label={{
                    value: tier.name,
                    position: 'right',
                    fill: tier.color,
                    fontSize: 10,
                  }}
                />
              ))}

            <Line
              type="monotone"
              dataKey="elo"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: EloDataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  const t = useTranslations();

  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const rank = getRankTier(data.elo);

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-semibold mb-1">
        {formatDate(new Date(data.date), 'PPP')}
      </p>
      <div className="flex items-center gap-2">
        <RankBadge elo={data.elo} showElo />
      </div>
    </div>
  );
}
