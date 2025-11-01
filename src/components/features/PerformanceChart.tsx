'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatTime } from '@/lib/utils/formatters';

export interface PerformanceDataPoint {
  category: string;
  averageTime: number;
  bestTime: number;
  matches: number;
}

export interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  className?: string;
}

/**
 * PerformanceChart component for visualizing performance metrics
 * Shows bar chart comparing average vs best times across categories
 */
export function PerformanceChart({ data, className }: PerformanceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="category"
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickFormatter={(value) => formatTime(value)}
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
            <Legend />
            <Bar
              dataKey="averageTime"
              fill="hsl(var(--diamond))"
              name="Average Time"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="bestTime"
              fill="hsl(var(--emerald))"
              name="Best Time"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    payload: PerformanceDataPoint;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-semibold mb-2">{label}</p>
      <div className="space-y-1 text-xs">
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[hsl(var(--diamond))]" />
          <span>Average: {formatTime(data.averageTime)}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[hsl(var(--emerald))]" />
          <span>Best: {formatTime(data.bestTime)}</span>
        </p>
        <p className="text-muted-foreground mt-1">
          {data.matches} matches
        </p>
      </div>
    </div>
  );
}
