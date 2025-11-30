'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { LiveMatch, Milliseconds } from '@/types/api';

/**
 * RTA (Real Time Attack) Timer Hook
 *
 * Bridges the gap between API updates by adding elapsed time since last fetch
 * to provide smooth, real-time timer updates.
 *
 * Based on mcsr-tools/ranked approach:
 * - API Time = match.currentTime (raw value from API)
 * - RTA Time = match.currentTime + elapsed_since_last_update
 */

interface RtaTimerState {
  /** Raw API time from last fetch */
  apiTime: Milliseconds;
  /** Real-time estimate (API time + elapsed) */
  rtaTime: Milliseconds;
  /** Milliseconds since last API update */
  elapsed: Milliseconds;
  /** Timestamp when data was last updated */
  lastUpdateTimestamp: number;
  /** Whether the timer is stale (hasn't been updated recently) */
  isStale: boolean;
}

interface PlayerRtaInfo {
  uuid: string;
  /** API split time for current event */
  apiSplitTime: Milliseconds | null;
  /** RTA-adjusted split time */
  rtaSplitTime: Milliseconds | null;
  /** Current event type */
  eventType: string | null;
}

interface UseRtaTimerOptions {
  /** Update interval in ms (default: 100ms for smooth display) */
  updateInterval?: number;
  /** Consider data stale after this many ms (default: 60s) */
  staleThreshold?: number;
}

/**
 * Hook to track RTA (real-time) timer for a live match
 */
export function useRtaTimer(
  match: LiveMatch | null | undefined,
  dataUpdatedAt: number | undefined,
  options: UseRtaTimerOptions = {}
): RtaTimerState | null {
  const { updateInterval = 100, staleThreshold = 60000 } = options;

  const [elapsed, setElapsed] = useState(0);
  const lastMatchRef = useRef<string | null>(null);

  // Track when match data actually changes
  const matchId = match ? `${match.currentTime}-${JSON.stringify(match.data)}` : null;
  const effectiveUpdateTime = useMemo(() => {
    if (matchId !== lastMatchRef.current) {
      lastMatchRef.current = matchId;
      return Date.now();
    }
    return dataUpdatedAt || Date.now();
  }, [matchId, dataUpdatedAt]);

  // Update elapsed time at regular intervals
  useEffect(() => {
    if (!match) return;

    const interval = setInterval(() => {
      setElapsed(Date.now() - effectiveUpdateTime);
    }, updateInterval);

    // Reset elapsed when match data changes
    setElapsed(Date.now() - effectiveUpdateTime);

    return () => clearInterval(interval);
  }, [match, effectiveUpdateTime, updateInterval]);

  if (!match) return null;

  const apiTime = match.currentTime;
  const rtaTime = apiTime + elapsed;
  const isStale = elapsed > staleThreshold;

  return {
    apiTime,
    rtaTime,
    elapsed,
    lastUpdateTimestamp: effectiveUpdateTime,
    isStale,
  };
}

/**
 * Hook to get RTA-adjusted player pace information
 */
export function usePlayerRtaInfo(
  match: LiveMatch | null | undefined,
  rtaState: RtaTimerState | null
): PlayerRtaInfo[] {
  return useMemo(() => {
    if (!match || !rtaState) return [];

    return match.players.map((player) => {
      const playerData = match.data[player.uuid];
      const timeline = playerData?.timeline;

      // For split times, we can estimate the RTA split time
      // by adding the elapsed time since API update
      const apiSplitTime = timeline?.time ?? null;

      // RTA split time: if the player is still running (hasn't finished this split),
      // we estimate their current time as their last known split + elapsed
      // But if we have a split time, that's when they HIT that event, so it's fixed
      // The RTA adjustment is more useful for the match timer itself
      const rtaSplitTime = apiSplitTime;

      return {
        uuid: player.uuid,
        apiSplitTime,
        rtaSplitTime,
        eventType: timeline?.type ?? null,
      };
    });
  }, [match, rtaState]);
}

/**
 * Format time in minutes:seconds format
 */
export function formatMatchTime(milliseconds: Milliseconds): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format time with milliseconds precision (for close finishes)
 */
export function formatMatchTimeWithMs(milliseconds: Milliseconds): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${Math.floor(ms / 100)}`;
}

/**
 * Calculate the real-time gap between players
 * Uses the same logic as comparePace but with RTA timing
 */
export function calculateRtaGap(
  match: LiveMatch,
  rtaState: RtaTimerState
): {
  gapMs: number | null;
  type: 'ahead' | 'behind' | 'even';
  leaderUuid: string | null;
} {
  if (match.players.length !== 2) {
    return { gapMs: null, type: 'even', leaderUuid: null };
  }

  const [p1, p2] = match.players;
  const p1Data = match.data[p1.uuid];
  const p2Data = match.data[p2.uuid];

  const p1Time = p1Data?.timeline?.time ?? null;
  const p2Time = p2Data?.timeline?.time ?? null;

  // If both have split times at the same event, the gap is the difference
  if (p1Time !== null && p2Time !== null) {
    const gap = Math.abs(p1Time - p2Time);
    if (p1Time < p2Time) {
      return { gapMs: gap, type: 'ahead', leaderUuid: p1.uuid };
    } else if (p2Time < p1Time) {
      return { gapMs: gap, type: 'ahead', leaderUuid: p2.uuid };
    }
  }

  return { gapMs: null, type: 'even', leaderUuid: null };
}
