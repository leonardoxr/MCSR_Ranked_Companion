'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { MatchInfo, TimelineEvent, UUID, CountryCode } from '@/types/api';
import { cn } from '@/lib/utils';
import { formatTime, formatTimeDifference } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';

function PlayerName({ uuid, name, country, side }: { uuid: UUID; name: string; country: CountryCode | null; side: 'left'|'right' }) {
  return (
    <div className={cn('flex items-center gap-2', side === 'right' && 'flex-row-reverse')}>
      <PlayerAvatar uuid={uuid} username={name} size="xs" />
      <CountryFlag country={country} size="xs" />
      <span className="truncate max-w-[140px]">{name}</span>
    </div>
  );
}

interface MatchSplitTableProps {
  match: MatchInfo;
  className?: string;
}

// Order of milestones to display
const ORDER: string[] = [
  'enter_nether',
  'enter_bastion',
  'enter_fortress',
  'enter_stronghold',
  'enter_end',
  'finish',
];

const LABEL: Record<string, string> = {
  enter_nether: 'Entered Nether',
  enter_bastion: 'Entered Bastion',
  enter_fortress: 'Entered Fortress',
  enter_stronghold: 'Found Stronghold',
  enter_end: 'Entered The End',
  finish: 'Finish',
};

function normalizeType(raw: string): string {
  const t = raw.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '_');
  if (t.includes('nether')) return 'enter_nether';
  if (t.includes('bastion')) return 'enter_bastion';
  if (t.includes('fortress')) return 'enter_fortress';
  if (t.includes('stronghold')) return 'enter_stronghold';
  if (t.includes('the_end') || t.endsWith('_end') || t.includes('enter_end') || t.includes('end_root')) return 'enter_end';
  if (t.includes('finish') || t.includes('completed') || t.includes('win')) return 'finish';
  return t;
}

function firstEventTime(events: TimelineEvent[] | undefined, uuid: UUID, type: string): number | null {
  if (!events) return null;
  const desired = type;
  const match = events
    .filter((ev) => ev.uuid === uuid)
    .map((ev) => ({ time: ev.time, norm: normalizeType(ev.type) }))
    .find((ev) => ev.norm === desired);
  return match ? match.time : null;
}

// Fallback finish time from completions if not in timelines
function completionTime(match: MatchInfo, uuid: UUID): number | null {
  const c = match.completions?.find((x) => x.uuid === uuid);
  return c ? c.time : null;
}

export function MatchSplitTable({ match, className }: MatchSplitTableProps) {
  const players = match.players.slice(0, 2); // show first two players
  if (players.length === 0) return null;

  const left = players[0];
  const right = players[1] || null;
  const finishTimes = [left, right]
    .filter(Boolean)
    .map((p) => firstEventTime(match.timelines, p!.uuid, 'finish') ?? completionTime(match, p!.uuid))
    .filter((t): t is number => t !== null);
  const maxTime = Math.max(...(finishTimes.length ? finishTimes : [0]));

  const chipLeft = 'bg-emerald/70';
  const chipRight = 'bg-diamond/70';

  return (
    <Card variant="mc" className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 text-sm rounded-md overflow-hidden">
          {/* Header row */}
          <div className="px-3 py-2 bg-muted/40 font-semibold truncate flex items-center gap-2">
            <span className={cn('inline-block h-2 w-2 rounded-full', chipLeft)} />
            <span className="shrink-0"><PlayerName uuid={left.uuid} name={left.nickname} country={left.country} side="left" /></span>
          </div>
          <div className="px-3 py-2 bg-muted/40 text-center font-semibold">Event</div>
          <div className="px-3 py-2 bg-muted/40 text-right font-semibold truncate flex items-center justify-end gap-2">
            {right && <><span className="shrink-0"><PlayerName uuid={right.uuid} name={right.nickname} country={right.country} side="right" /></span><span className={cn('inline-block h-2 w-2 rounded-full', chipRight)} /></>}
          </div>

          {ORDER.map((type, idx) => {
            const lTime = firstEventTime(match.timelines, left.uuid, type);
            const rTime = right ? firstEventTime(match.timelines, right.uuid, type) : null;
            const delta = lTime !== null && rTime !== null ? lTime - rTime : null;
            const isEven = idx % 2 === 0;
            return (
              <React.Fragment key={type}>
                {/* Left time */}
                <motion.div
                  className={cn('px-3 py-3 font-mono', isEven ? 'bg-background/40' : 'bg-background/20')}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {lTime !== null ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <span className={cn('inline-block h-1.5 w-1.5 rounded-full', chipLeft)} />
                        {formatTime(lTime)}
                      </span>
                      {delta !== null && (
                        <motion.span
                          key={delta}
                          initial={{ scale: 0.9, opacity: 0.6 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.25 }}
                          className={cn('text-xs', delta > 0 ? 'pace-behind' : 'pace-ahead')}
                        >
                          ({formatTimeDifference(delta)})
                        </motion.span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  <div className="mt-2 progress-track">
                    <div className="progress-fill" style={{ width: `${lTime && maxTime ? Math.min((lTime / maxTime) * 100, 100) : 0}%` }} />
                  </div>
                </motion.div>

                {/* Label */}
                <div className={cn('px-3 py-3 text-center font-semibold', isEven ? 'bg-background/40' : 'bg-background/20')}>
                  {LABEL[type] || type}
                </div>

                {/* Right time */}
                <motion.div
                  className={cn('px-3 py-3 text-right font-mono', isEven ? 'bg-background/40' : 'bg-background/20')}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.03 }}
                >
                  {rTime !== null ? (
                    <div className="flex items-center justify-end gap-3">
                      {delta !== null && (
                        <motion.span
                          key={-delta}
                          initial={{ scale: 0.9, opacity: 0.6 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.25 }}
                          className={cn('text-xs', delta < 0 ? 'pace-behind' : 'pace-ahead')}
                        >
                          ({formatTimeDifference(-delta)})
                        </motion.span>
                      )}
                      <span className="flex items-center gap-2">
                        {right && <span className={cn('inline-block h-1.5 w-1.5 rounded-full', chipRight)} />}
                        {formatTime(rTime)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  <div className="mt-2 progress-track">
                    <div className="progress-fill" style={{ width: `${rTime && maxTime ? Math.min((rTime / maxTime) * 100, 100) : 0}%` }} />
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
