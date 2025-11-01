'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils/formatters';
import type { TimelineEvent } from '@/types/api';
import {
  Eye,
  Pickaxe,
  Flame,
  Target,
  Swords,
  Sparkles,
  Crown,
  MapPin,
} from 'lucide-react';

export interface MatchTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventIcons: Record<string, React.ReactNode> = {
  enter_nether: <Sparkles className="h-4 w-4" />,
  enter_bastion: <Target className="h-4 w-4" />,
  enter_fortress: <Flame className="h-4 w-4" />,
  first_portal: <Eye className="h-4 w-4" />,
  second_portal: <Eye className="h-4 w-4" />,
  enter_stronghold: <MapPin className="h-4 w-4" />,
  enter_end: <Sparkles className="h-4 w-4" />,
  finish: <Crown className="h-4 w-4" />,
  died: <Swords className="h-4 w-4" />,
  default: <Pickaxe className="h-4 w-4" />,
};

const eventLabels: Record<string, string> = {
  enter_nether: 'Entered Nether',
  enter_bastion: 'Entered Bastion',
  enter_fortress: 'Entered Fortress',
  first_portal: 'First Portal',
  second_portal: 'Second Portal',
  enter_stronghold: 'Entered Stronghold',
  enter_end: 'Entered End',
  finish: 'Finished',
  died: 'Died',
};

const eventColors: Record<string, string> = {
  enter_nether: 'text-redstone',
  enter_bastion: 'text-gold',
  enter_fortress: 'text-rank-netherite',
  first_portal: 'text-purple-500',
  second_portal: 'text-purple-500',
  enter_stronghold: 'text-rank-iron',
  enter_end: 'text-rank-netherite',
  finish: 'text-emerald',
  died: 'text-destructive',
};

/**
 * MatchTimeline component for displaying match events chronologically
 * Shows key milestones with icons and timestamps
 */
export function MatchTimeline({ events, className }: MatchTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.time - b.time);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Match Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-4">
            {sortedEvents.map((evt, index) => {
              const icon = eventIcons[evt.type] || eventIcons.default;
              const label = eventLabels[evt.type] || evt.type;
              const color = eventColors[evt.type] || 'text-muted-foreground';

              return (
                <motion.div
                  key={`${evt.type}-${evt.time}-${evt.uuid}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-border',
                      color
                    )}
                  >
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(evt.time)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {sortedEvents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No timeline events available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
