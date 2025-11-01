'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion, useAnimationFrame } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils/formatters';
import type { TimelineEvent, UserProfile } from '@/types/api';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
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
  players?: UserProfile[]; // used to show who triggered each event
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

function normalizeType(t: string): string {
  const v = t.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '_');
  return v;
}

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
export function MatchTimeline({ events, className, players }: MatchTimelineProps) {
  const t = useTranslations();
  const sortedEvents = React.useMemo(() => [...events].sort((a, b) => a.time - b.time), [events]);
  const total = React.useMemo(() => (sortedEvents.length ? Math.max(...sortedEvents.map((e) => e.time)) : 0), [sortedEvents]);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [speed, setSpeed] = React.useState(1); // 1x, 2x, etc.
  const [playhead, setPlayhead] = React.useState(0);
  const [theme, setTheme] = React.useState<'standard' | 'texture'>('texture');
  const activeIdx = React.useMemo(() => {
    if (!sortedEvents.length) return -1;
    // Last event at or before playhead
    let idx = -1;
    for (let i = 0; i < sortedEvents.length; i++) {
      if (sortedEvents[i].time <= playhead) idx = i;
      else break;
    }
    return idx;
  }, [sortedEvents, playhead]);

  // Advance playhead with animation frame, loop at end
  const lastTs = React.useRef<number | null>(null);
  useAnimationFrame((t) => {
    if (!isPlaying || total === 0) return;
    if (lastTs.current == null) {
      lastTs.current = t;
      return;
    }
    const dt = (t - lastTs.current) * speed; // ms
    lastTs.current = t;
    setPlayhead((prev) => {
      const next = prev + dt;
      if (next >= total) {
        // stop at end
        return total;
      }
      return next;
    });
  });

  // Reset timer ref when play/pause toggles
  React.useEffect(() => {
    if (!isPlaying) return;
    lastTs.current = null;
  }, [isPlaying]);

  // Clamp playhead when events change
  React.useEffect(() => {
    setPlayhead((p) => Math.min(p, total));
  }, [total]);
  const nameOf = (uuid: string) => players?.find((p) => p.uuid === uuid)?.nickname || t('timeline.unknownPlayer');
  const playerOf = (uuid: string) => players?.find((p) => p.uuid === uuid) || null;

  // Choose up to two players for two-lane playback: winner + opponent, else first two
  const lanePlayers = React.useMemo(() => {
    if (!players || players.length === 0) return [] as UserProfile[];
    if (players.length === 1) return [players[0]];
    // Prefer the two players that have most timeline events; fallback to first two
    const counts = new Map<string, number>();
    for (const e of sortedEvents) counts.set(e.uuid, (counts.get(e.uuid) || 0) + 1);
    const sortedByCount = [...players].sort((a, b) => (counts.get(b.uuid) || 0) - (counts.get(a.uuid) || 0));
    const p1 = sortedByCount[0] || players[0];
    const p2 = sortedByCount[1] || players[1];
    return [p1, p2].filter(Boolean) as UserProfile[];
  }, [players, sortedEvents]);

  const eventsByPlayer = React.useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const p of lanePlayers) map.set(p.uuid, []);
    for (const e of sortedEvents) {
      if (map.has(e.uuid)) map.get(e.uuid)!.push(e);
    }
    return map;
  }, [lanePlayers, sortedEvents]);

  type Phase = 'overworld' | 'enter_nether' | 'enter_bastion' | 'enter_fortress' | 'enter_stronghold' | 'enter_end' | 'finish';
  const phaseClass: Record<Phase, string> = {
    overworld: 'tex-overworld',
    enter_nether: 'tex-netherrack',
    enter_bastion: 'tex-netherrack',
    enter_fortress: 'tex-netherbrick',
    enter_stronghold: 'tex-stone',
    enter_end: 'tex-endstone',
    finish: 'tex-endstone',
  };
  function currentPhaseFor(laneEvents: TimelineEvent[], t: number): Phase {
    let phase: Phase = 'overworld';
    for (const e of laneEvents) {
      if (e.time > t) break;
      const key = normalizeType(e.type) as Phase;
      if (phaseClass[key]) phase = key;
    }
    return phase;
  }

  // Keyboard controls: space toggle, arrows snap to prev/next event, 1/2/5 set speeds
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sortedEvents.length) return;
      // Avoid typing in inputs interfering
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((v) => !v);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = Math.min(sortedEvents.length - 1, activeIdx + 1);
        if (nextIdx >= 0) {
          setPlayhead(sortedEvents[nextIdx].time);
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = Math.max(0, activeIdx === -1 ? 0 : activeIdx - 1);
        setPlayhead(sortedEvents[prevIdx]?.time ?? 0);
        return;
      }
      if (e.key === '1') setSpeed(1);
      if (e.key === '2') setSpeed(2);
      if (e.key === '5') setSpeed(0.5);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sortedEvents, activeIdx]);

  const getEventLabel = (type: string): string => {
    const labelKey = `timeline.events.${type}`;
    return t(labelKey);
  };

  return (
    <Card variant="mc" className={className}>
      <CardHeader>
        <CardTitle>{t('timeline.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Controls */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={isPlaying ? t('timeline.pause') : t('timeline.play')}
                  onClick={() => setIsPlaying((v) => !v)}
                  className="px-2 py-1 rounded border border-border hover:bg-muted text-sm"
                >
                  {isPlaying ? t('timeline.pause') : t('timeline.play')}
                </button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <button
                    type="button"
                    className={cn('px-2 py-0.5 rounded', speed === 0.5 ? 'bg-muted' : 'hover:bg-muted')}
                    onClick={() => setSpeed(0.5)}
                  >
                    {t('timeline.speedSlow')}
                  </button>
                  <button
                    type="button"
                    className={cn('px-2 py-0.5 rounded', speed === 1 ? 'bg-muted' : 'hover:bg-muted')}
                    onClick={() => setSpeed(1)}
                  >
                    {t('timeline.speedNormal')}
                  </button>
                  <button
                    type="button"
                    className={cn('px-2 py-0.5 rounded', speed === 2 ? 'bg-muted' : 'hover:bg-muted')}
                    onClick={() => setSpeed(2)}
                  >
                    {t('timeline.speedFast')}
                  </button>
                </div>
                <div className="flex items-center gap-1 ml-3 text-xs">
                  <span className="text-muted-foreground">{t('timeline.theme')}</span>
                  <button
                    type="button"
                    className={cn('px-2 py-0.5 rounded', theme === 'standard' ? 'bg-muted' : 'hover:bg-muted')}
                    onClick={() => setTheme('standard')}
                  >
                    {t('timeline.themeStandard')}
                  </button>
                  <button
                    type="button"
                    className={cn('px-2 py-0.5 rounded', theme === 'texture' ? 'bg-muted' : 'hover:bg-muted')}
                    onClick={() => setTheme('texture')}
                  >
                    {t('timeline.themeTexture')}
                  </button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {formatTime(Math.min(playhead, total))} / {formatTime(total)}
              </div>
            </div>
          </div>

          {/* Two-lane playback (per player) */}
          {lanePlayers.length >= 1 && (
            <div className="space-y-4 mb-6">
              {lanePlayers.map((p, laneIdx) => {
                const laneEvents = eventsByPlayer.get(p.uuid) || [];
                const phase = currentPhaseFor(laneEvents, playhead) as Phase;
                // Determine ahead/behind: more completed events wins; tie-breaker by last event time
                let ahead = false;
                if (lanePlayers.length === 2) {
                  const other = lanePlayers[1 - laneIdx];
                  const otherEvents = eventsByPlayer.get(other.uuid) || [];
                  const doneA = laneEvents.filter((e) => e.time <= playhead).length;
                  const doneB = otherEvents.filter((e) => e.time <= playhead).length;
                  if (doneA > doneB) ahead = true;
                  else if (doneA === doneB) {
                    const lastA = laneEvents.filter((e) => e.time <= playhead).slice(-1)[0]?.time ?? -1;
                    const lastB = otherEvents.filter((e) => e.time <= playhead).slice(-1)[0]?.time ?? -1;
                    ahead = lastA > lastB; // later timestamp within same count implies further along
                  }
                }
                return (
                  <div key={p.uuid} className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <PlayerAvatar uuid={p.uuid} username={p.nickname} size="sm" />
                      <span className="font-medium">{p.nickname}</span>
                    </div>
                    <div className={cn('relative h-12 select-none rounded-full border border-border overflow-hidden', theme === 'texture' ? phaseClass[phase] : 'bg-muted/70')}>
                      {/* Lane track */}
                      {theme === 'standard' && (
                        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-muted/70" />
                      )}
                      {/* Lane fill follows shared playhead */}
                      <motion.div
                        className={cn(
                          'absolute inset-y-1 left-1 rounded-full',
                          laneIdx === 0 ? 'bg-gradient-to-r from-emerald to-diamond' : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: total ? `${(Math.min(playhead, total) / total) * 100}%` : '0%' }}
                        transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
                      />
                      {/* Tiny avatar playhead (widget-like) */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -ml-3 z-20"
                        animate={{ left: total ? `${(Math.min(playhead, total) / total) * 100}%` : '0%' }}
                        transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
                      >
                        <motion.div
                          className="relative mcsr-walk"
                          style={{ filter: laneIdx === 0 ? 'drop-shadow(0 0 6px rgba(16,185,129,0.45))' : 'drop-shadow(0 0 6px rgba(168,85,247,0.45))' }}
                          title={`Now: ${formatTime(Math.min(playhead, total))}`}
                        >
                          <PlayerAvatar
                            uuid={p.uuid}
                            username={p.nickname}
                            size="xs"
                            className={cn('ring-2', ahead ? 'ring-emerald-400' : 'ring-red-400')}
                          />
                          {/* small indicator dot */}
                          <span className={cn('absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full', laneIdx === 0 ? 'bg-emerald-400' : 'bg-purple-400')} />
                        </motion.div>
                      </motion.div>
                      {/* Lane markers: only this player's events with icons */}
                      {laneEvents.map((evt, i) => {
                        const passed = playhead >= evt.time;
                        const pct = total ? (evt.time / total) * 100 : 0;
                        const key = normalizeType(evt.type);
                        const label = getEventLabel(key);
                        const isActive = sortedEvents[activeIdx]?.uuid === evt.uuid && sortedEvents[activeIdx]?.time === evt.time;
                        return (
                          <motion.div
                            key={`lane-${p.uuid}-${evt.time}-${i}`}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${pct}%` }}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: passed ? 1 : 0.6, scale: isActive ? 1.2 : passed ? 1 : 0.95 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                          >
                            <div className={cn('h-7 w-7 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm', isActive ? 'ring-2 ring-primary/40' : '')}
                                 title={`${label} • ${formatTime(evt.time)}`}>
                              <span className={cn(laneIdx === 0 ? 'text-emerald-500' : 'text-purple-500', passed ? 'opacity-100' : 'opacity-80')}>
                                {eventIcons[key] || eventIcons.default}
                              </span>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 text-[10px] whitespace-nowrap bg-background/90 backdrop-blur px-1.5 py-0.5 rounded border border-border">
                              {label}
                            </div>
                          </motion.div>
                        );
                      })}
                      {/* Seek by clicking lane */}
                      <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={(e) => {
                          if (!total) return;
                          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const pct = x / rect.width;
                          const raw = Math.max(0, Math.min(total, pct * total));
                          if (sortedEvents.length) {
                            let nearest = sortedEvents[0];
                            let d = Math.abs(raw - nearest.time);
                            for (let i = 1; i < sortedEvents.length; i++) {
                              const di = Math.abs(raw - sortedEvents[i].time);
                              if (di < d) { d = di; nearest = sortedEvents[i]; }
                            }
                            setPlayhead(nearest.time);
                          } else {
                            setPlayhead(raw);
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
