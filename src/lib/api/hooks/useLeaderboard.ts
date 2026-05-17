import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { getLeaderboard } from '../endpoints';
import type { LeaderboardParams, LeaderboardUser } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (params?: LeaderboardParams) =>
    [...leaderboardKeys.all, 'list', params] as const,
};

/**
 * Hook to fetch leaderboard
 * Uses REAL_TIME cache (30 sec stale) - leaderboard updates frequently but not every second
 * Aggressively refetches to keep data fresh when viewing leaderboard
 */
export function useLeaderboard(
  params?: LeaderboardParams,
  options?: Omit<UseQueryOptions<LeaderboardUser[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LeaderboardUser[], McsrApiError>({
    queryKey: leaderboardKeys.list(params),
    queryFn: () => getLeaderboard(params),
    ...CACHE_PRESETS.LEADERBOARD,
    ...options,
  });
}

/**
 * Read leaderboard users from cache and filter locally without network.
 * Returns up to `limit` results whose nickname includes `query` (case-insensitive).
 */
export function useLeaderboardCachedFilter(query: string, limit: number = 8) {
  const client = useQueryClient();
  const q = (query || '').trim().toLowerCase();
  if (!q) return [] as LeaderboardUser[];

  // Try to find any cached leaderboard array. Prefer the latest list entry.
  const cache = client.getQueryCache();
  const entries = cache.getAll().filter((e) => {
    const key = e.queryKey as unknown as any[];
    return Array.isArray(key) && key[0] === 'leaderboard' && key.includes('list');
  });

  // Aggregate from all cached pages we find
  const aggregated: LeaderboardUser[] = [];
  for (const entry of entries) {
    const data = entry.state.data as unknown as LeaderboardUser[] | undefined;
    if (Array.isArray(data) && data.length > 0) aggregated.push(...data);
  }
  if (aggregated.length > 0) {
    // Deduplicate by uuid (or nickname fallback)
    const byId = new Map<string, LeaderboardUser>();
    for (const u of aggregated) {
      const key = u.uuid || u.nickname || Math.random().toString();
      if (!byId.has(key)) byId.set(key, u);
    }
    const uniq = Array.from(byId.values());
    const starts = uniq.filter((u) => u.nickname?.toLowerCase().startsWith(q));
    const includes = uniq.filter((u) => u.nickname?.toLowerCase().includes(q));
    const merged = starts.concat(includes.filter((u) => !starts.includes(u)));
    return merged.slice(0, limit);
  }

  // Fallback: try the generic all key if someone cached directly
  const all = client.getQueryData(leaderboardKeys.all as any) as LeaderboardUser[] | undefined;
  if (Array.isArray(all)) {
    const byId = new Map<string, LeaderboardUser>();
    for (const u of all) {
      const key = u.uuid || u.nickname || Math.random().toString();
      if (!byId.has(key)) byId.set(key, u);
    }
    const uniq = Array.from(byId.values());
    const starts = uniq.filter((u) => u.nickname?.toLowerCase().startsWith(q));
    const includes = uniq.filter((u) => u.nickname?.toLowerCase().includes(q));
    const merged = starts.concat(includes.filter((u) => !starts.includes(u)));
    return merged.slice(0, limit);
  }
  return [] as LeaderboardUser[];
}
