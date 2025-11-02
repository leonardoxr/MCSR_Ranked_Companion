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

  const data = [
    { name: t('charts.wins'), value: wins, color: 'hsl(var(--emerald))' },
    { name: t('charts.losses'), value: losses, color: 'hsl(var(--redstone))' },
  ];

  const winRate = formatWinRate(wins, losses);
  const total = wins + losses;

  return (
    <Card variant="mc" className={className}>
      <CardHeader>
        <CardTitle>{t('charts.winRate')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center mt-4">
            <p className="text-4xl font-bold text-primary">{winRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {wins}{t('charts.winsShort')} - {losses}{t('charts.lossesShort')} ({t('charts.total', { count: total })})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
