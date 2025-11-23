'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { MatchInfo, TimelineEvent, UUID, CountryCode } from '@/types/api';
import { cn } from '@/lib/utils';
import { formatTime, formatTimeDifference } from '@/lib/utils/formatters';
import { PlayerAvatar } from './PlayerAvatar';
import { CountryFlag } from './CountryFlag';
import { MinecraftIcon } from './MinecraftIcon';
import type { MinecraftIconName } from './MinecraftIcon';

function PlayerName({ uuid, name, country, side }: { uuid: UUID; name: string; country: CountryCode | null; side: 'left' | 'right' }) {
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

// Icon mapping for milestones
const milestoneIcons: Record<string, MinecraftIconName> = {
  enter_nether: 'nether-portal',
  enter_bastion: 'gilded-blackstone',
  enter_fortress: 'nether-bricks',
  enter_stronghold: 'stone-bricks',
  enter_end: 'end-portal',
  finish: 'dragon-egg',
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
  const t = useTranslations();
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
    <Card variant="mc" className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <MinecraftIcon name="ender-eye" size="sm" /> {/* Assuming clock icon exists or fallback */}
          {t('timeline.milestones.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile View - Stacked Cards */}
        <div className="md:hidden space-y-0 divide-y divide-white/5">
          {/* Player Header */}
          <div className="flex justify-between items-center text-xs font-semibold px-4 py-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={cn('inline-block h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]', chipLeft)} />
              <span className="truncate max-w-[120px]">{left.nickname}</span>
            </div>
            {right && (
              <div className="flex items-center gap-2">
                <span className="truncate max-w-[120px]">{right.nickname}</span>
                <span className={cn('inline-block h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]', chipRight)} />
              </div>
            )}
          </div>

          {ORDER.map((type, idx) => {
            const lTime = firstEventTime(match.timelines, left.uuid, type);
            const rTime = right ? firstEventTime(match.timelines, right.uuid, type) : null;
            const delta = lTime !== null && rTime !== null ? lTime - rTime : null;

            return (
              <div key={type} className="p-4 hover:bg-white/5 transition-colors relative group">
                {/* Milestone Name */}
                <div className="flex items-center justify-center gap-2 mb-3 font-semibold text-sm text-foreground/90">
                  {milestoneIcons[type] && <MinecraftIcon name={milestoneIcons[type]} size="sm" />}
                  <span>{t(`timeline.milestones.${type}`)}</span>
                </div>

                {/* Times */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* Left Player */}
                  <div className="relative">
                    <div className="font-mono font-medium text-lg leading-none mb-1">
                      {lTime !== null ? (
                        <span className={cn(delta !== null && delta < 0 ? "text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]" : "text-foreground")}>
                          {formatTime(lTime)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </div>
                    {delta !== null && lTime !== null && (
                      <div className={cn('text-xs font-mono font-bold', delta < 0 ? 'text-emerald-500' : 'text-rose-500')}>
                        {delta < 0 ? '-' : '+'}{formatTimeDifference(Math.abs(delta))}
                      </div>
                    )}
                  </div>

                  {/* Right Player */}
                  <div className="text-right relative">
                    <div className="font-mono font-medium text-lg leading-none mb-1">
                      {rTime !== null ? (
                        <span className={cn(delta !== null && delta > 0 ? "text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]" : "text-foreground")}>
                          {formatTime(rTime)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </div>
                    {delta !== null && rTime !== null && (
                      <div className={cn('text-xs font-mono font-bold', delta > 0 ? 'text-emerald-500' : 'text-rose-500')}>
                        {delta > 0 ? '-' : '+'}{formatTimeDifference(Math.abs(delta))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View - 3 Column Grid with Timeline */}
        <div className="hidden md:block">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 bg-black/40 border-b border-white/5 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className={cn('inline-block h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]', chipLeft)} />
              <PlayerName uuid={left.uuid} name={left.nickname} country={left.country} side="left" />
            </div>
            <div className="text-center px-4">{t('timeline.milestones.event')}</div>
            <div className="flex items-center justify-end gap-3">
              {right && (
                <>
                  <PlayerName uuid={right.uuid} name={right.nickname} country={right.country} side="right" />
                  <span className={cn('inline-block h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor]', chipRight)} />
                </>
              )}
            </div>
          </div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 -translate-x-1/2 z-0" />

            {ORDER.map((type, idx) => {
              const lTime = firstEventTime(match.timelines, left.uuid, type);
              const rTime = right ? firstEventTime(match.timelines, right.uuid, type) : null;
              const delta = lTime !== null && rTime !== null ? lTime - rTime : null;

              return (
                <div key={type} className="grid grid-cols-[1fr_auto_1fr] items-center group hover:bg-white/[0.02] transition-colors relative z-10">
                  {/* Left time */}
                  <div className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    {delta !== null && (
                      <span className={cn('text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/5', delta < 0 ? 'text-emerald-400 border-emerald-500/20' : 'text-rose-400 border-rose-500/20')}>
                        {delta < 0 ? '-' : '+'}{formatTimeDifference(Math.abs(delta))}
                      </span>
                    )}
                    <div className="font-mono text-lg font-medium">
                      {lTime !== null ? (
                        <span className={cn(delta !== null && delta < 0 ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]" : "text-foreground")}>
                          {formatTime(lTime)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </div>
                  </div>

                  {/* Label / Center Icon */}
                  <div className="px-4 py-4 flex flex-col items-center justify-center gap-1 min-w-[140px]">
                    <div className="relative">
                      <div className="absolute inset-0 bg-background rounded-full blur-sm opacity-50" />
                      <div className="relative bg-card border border-white/10 p-2 rounded-lg shadow-lg group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300">
                        {milestoneIcons[type] && <MinecraftIcon name={milestoneIcons[type]} size="sm" />}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-1 group-hover:text-primary transition-colors">
                      {t(`timeline.milestones.${type}`)}
                    </span>
                  </div>

                  {/* Right time */}
                  <div className="px-6 py-4 text-left flex items-center justify-start gap-4">
                    <div className="font-mono text-lg font-medium">
                      {rTime !== null ? (
                        <span className={cn(delta !== null && delta > 0 ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]" : "text-foreground")}>
                          {formatTime(rTime)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </div>
                    {delta !== null && (
                      <span className={cn('text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/5', delta > 0 ? 'text-emerald-400 border-emerald-500/20' : 'text-rose-400 border-rose-500/20')}>
                        {delta > 0 ? '-' : '+'}{formatTimeDifference(Math.abs(delta))}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
