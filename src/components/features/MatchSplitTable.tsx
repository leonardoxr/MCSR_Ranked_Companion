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
import { Crown, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlayerNameProps {
  uuid: UUID;
  name: string;
  country: CountryCode | null;
  side: 'left' | 'right';
  isWinner?: boolean;
}

function PlayerName({ uuid, name, country, side, isWinner }: PlayerNameProps) {
  return (
    <div className={cn('flex items-center gap-2', side === 'right' && 'flex-row-reverse')}>
      <div className="relative">
        <PlayerAvatar uuid={uuid} username={name} size="sm" />
        {isWinner && (
          <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
        )}
      </div>
      <div className={cn('flex flex-col', side === 'right' && 'items-end')}>
        <div className={cn('flex items-center gap-1.5', side === 'right' && 'flex-row-reverse')}>
          <CountryFlag country={country} size="xs" />
          <span className={cn(
            'font-semibold truncate max-w-[120px]',
            isWinner && 'text-emerald'
          )}>
            {name}
          </span>
        </div>
      </div>
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

// Icon mapping for milestones with descriptions
const milestoneConfig: Record<string, { icon: MinecraftIconName; color: string }> = {
  enter_nether: { icon: 'nether-portal', color: 'text-purple-400' },
  enter_bastion: { icon: 'gilded-blackstone', color: 'text-yellow-500' },
  enter_fortress: { icon: 'nether-bricks', color: 'text-red-400' },
  enter_stronghold: { icon: 'stone-bricks', color: 'text-gray-400' },
  enter_end: { icon: 'end-portal-frame', color: 'text-teal-400' },
  finish: { icon: 'dragon-egg', color: 'text-pink-400' },
};

// Simple icon mapping for backward compatibility
const milestoneIcons: Record<string, MinecraftIconName> = Object.fromEntries(
  Object.entries(milestoneConfig).map(([key, { icon }]) => [key, icon])
);

/**
 * Normalize timeline event types from the API to our internal milestone names.
 *
 * API event formats (from MCSR_Ranked_API_Documentation.md):
 * - nether_enter, bastion_enter, fortress_enter, nether_exit
 * - stronghold_enter, end_enter, finish
 *
 * Our internal milestone names (ORDER array):
 * - enter_nether, enter_bastion, enter_fortress, enter_stronghold, enter_end, finish
 */
function normalizeType(raw: string): string {
  const t = raw.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '_');

  // Handle "xxx_enter" format from API (e.g., "nether_enter" -> "enter_nether")
  if (t === 'nether_enter' || t === 'enter_nether' || t === 'story.enter_the_nether' || t === 'story_enter_the_nether') return 'enter_nether';
  if (t === 'bastion_enter' || t === 'enter_bastion' || t === 'nether.find_bastion' || t === 'nether_find_bastion') return 'enter_bastion';
  if (t === 'fortress_enter' || t === 'enter_fortress' || t === 'nether.find_fortress' || t === 'nether_find_fortress') return 'enter_fortress';
  if (t === 'stronghold_enter' || t === 'enter_stronghold' || t === 'story.follow_ender_eye' || t === 'story_follow_ender_eye') return 'enter_stronghold';
  if (t === 'end_enter' || t === 'enter_end' || t === 'story.enter_the_end' || t === 'story_enter_the_end') return 'enter_end';
  if (t === 'finish' || t === 'completed' || t === 'win' || t === 'projectelo.timeline.complete_run') return 'finish';

  // Fallback pattern matching for edge cases
  if (t.includes('nether') && t.includes('enter')) return 'enter_nether';
  if (t.includes('bastion')) return 'enter_bastion';
  if (t.includes('fortress')) return 'enter_fortress';
  if (t.includes('stronghold')) return 'enter_stronghold';
  if ((t.includes('end') && t.includes('enter')) || t === 'the_end' || t.includes('enter_the_end')) return 'enter_end';
  if (t.includes('finish') || t.includes('complete')) return 'finish';

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
  const winner = match.result?.uuid;
  const leftIsWinner = winner === left.uuid;
  const rightIsWinner = right && winner === right.uuid;

  const finishTimes = [left, right]
    .filter(Boolean)
    .map((p) => firstEventTime(match.timelines, p!.uuid, 'finish') ?? completionTime(match, p!.uuid))
    .filter((t): t is number => t !== null);
  const maxTime = Math.max(...(finishTimes.length ? finishTimes : [0]));

  const chipLeft = leftIsWinner ? 'bg-emerald' : 'bg-blue-500';
  const chipRight = rightIsWinner ? 'bg-emerald' : 'bg-orange-500';

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
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 bg-black/40 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className={cn('inline-block h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]', chipLeft)} />
              <PlayerName uuid={left.uuid} name={left.nickname} country={left.country} side="left" isWinner={leftIsWinner} />
            </div>
            <div className="text-center px-6">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {t('timeline.milestones.event', { defaultValue: 'Milestone' })}
              </span>
            </div>
            <div className="flex items-center justify-end gap-3">
              {right && (
                <>
                  <PlayerName uuid={right.uuid} name={right.nickname} country={right.country} side="right" isWinner={rightIsWinner} />
                  <span className={cn('inline-block h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]', chipRight)} />
                </>
              )}
            </div>
          </div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-yellow-500/50 to-pink-500/50 -translate-x-1/2 z-0" />

            {ORDER.map((type, idx) => {
              const lTime = firstEventTime(match.timelines, left.uuid, type);
              const rTime = right ? firstEventTime(match.timelines, right.uuid, type) : null;
              const delta = lTime !== null && rTime !== null ? lTime - rTime : null;
              const config = milestoneConfig[type] || { icon: 'ender-eye' as MinecraftIconName, color: 'text-muted-foreground' };
              const leftAhead = delta !== null && delta < 0;
              const rightAhead = delta !== null && delta > 0;
              const isFinish = type === 'finish';

              return (
                <div
                  key={type}
                  className={cn(
                    "grid grid-cols-[1fr_auto_1fr] items-center group hover:bg-white/[0.03] transition-all relative z-10",
                    isFinish && "bg-gradient-to-r from-emerald/5 via-transparent to-emerald/5"
                  )}
                >
                  {/* Left time */}
                  <div className="px-6 py-5 text-right flex items-center justify-end gap-3">
                    {/* Delta badge */}
                    {delta !== null && (
                      <div className={cn(
                        'flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded-md',
                        leftAhead ? 'bg-emerald/20 text-emerald border border-emerald/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      )}>
                        {leftAhead ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {leftAhead ? '-' : '+'}{formatTimeDifference(Math.abs(delta))}
                      </div>
                    )}
                    {/* Time */}
                    <div className={cn(
                      "font-mono text-lg font-semibold tabular-nums",
                      lTime !== null && leftAhead && "text-emerald drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]",
                      lTime !== null && !leftAhead && delta !== null && "text-muted-foreground",
                      lTime !== null && delta === null && "text-foreground"
                    )}>
                      {lTime !== null ? formatTime(lTime) : <span className="text-muted-foreground/30">—</span>}
                    </div>
                  </div>

                  {/* Center Milestone Icon */}
                  <div className="px-4 py-5 flex flex-col items-center justify-center gap-2 min-w-[160px]">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className={cn("absolute inset-0 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity", config.color.replace('text-', 'bg-'))} />
                      {/* Icon container */}
                      <div className={cn(
                        "relative bg-card/80 backdrop-blur border-2 p-3 rounded-xl shadow-lg transition-all duration-300",
                        "group-hover:scale-110 group-hover:shadow-xl",
                        isFinish ? "border-pink-500/50 shadow-pink-500/20" : "border-white/10 group-hover:border-white/20"
                      )}>
                        <MinecraftIcon
                          name={config.icon}
                          size="md"
                          className="image-pixelated"
                        />
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs uppercase tracking-wider font-semibold transition-colors",
                      isFinish ? "text-pink-400" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {t(`timeline.milestones.${type}`, { defaultValue: type.replace('enter_', '').replace('_', ' ') })}
                    </span>
                  </div>

                  {/* Right time */}
                  <div className="px-6 py-5 text-left flex items-center justify-start gap-3">
                    {/* Time */}
                    <div className={cn(
                      "font-mono text-lg font-semibold tabular-nums",
                      rTime !== null && rightAhead && "text-emerald drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]",
                      rTime !== null && !rightAhead && delta !== null && "text-muted-foreground",
                      rTime !== null && delta === null && "text-foreground"
                    )}>
                      {rTime !== null ? formatTime(rTime) : <span className="text-muted-foreground/30">—</span>}
                    </div>
                    {/* Delta badge */}
                    {delta !== null && (
                      <div className={cn(
                        'flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded-md',
                        rightAhead ? 'bg-emerald/20 text-emerald border border-emerald/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      )}>
                        {rightAhead ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {rightAhead ? '-' : '+'}{formatTimeDifference(Math.abs(delta))}
                      </div>
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
