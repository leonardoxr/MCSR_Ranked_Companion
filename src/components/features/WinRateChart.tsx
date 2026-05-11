'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatWinRate } from '@/lib/utils/formatters';

export interface WinRateChartProps {
  wins: number;
  losses: number;
  className?: string;
}

/**
 * WinRateChart component for visualizing win/loss ratio
 * Shows pie chart with win rate percentage
 */
export function WinRateChart({ wins, losses, className }: WinRateChartProps) {
  const t = useTranslations();
  const [chartHeight, setChartHeight] = React.useState(200);
  const [pieSize, setPieSize] = React.useState({ inner: 60, outer: 80 });

  // Set responsive chart dimensions based on screen size
  React.useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 640) {
        setChartHeight(180); // Mobile: shorter height
        setPieSize({ inner: 50, outer: 70 }); // Smaller pie on mobile
      } else {
        setChartHeight(200); // Desktop: full height
        setPieSize({ inner: 60, outer: 80 }); // Standard pie size
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const data = [
    { name: t('charts.wins'), value: wins, color: 'hsl(var(--emerald))' },
    { name: t('charts.losses'), value: losses, color: 'hsl(var(--redstone))' },
  ];

  const winRate = formatWinRate(wins, losses);
  const total = wins + losses;

  return (
    <Card variant="mc" className={className}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{t('charts.winRate')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={pieSize.inner}
                outerRadius={pieSize.outer}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsla(var(--card), 1)',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center mt-4">
            <p className="text-2xl sm:text-4xl font-bold text-primary mc-heading">{winRate}%</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-monocraft">
              {wins}{t('charts.winsShort')} - {losses}{t('charts.lossesShort')} ({t('charts.total', { count: total })})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
