import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getLeaderboard } from '../endpoints';
import type { LeaderboardUser, PaginationParams } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (params?: PaginationParams & { season?: number }) =>
    [...leaderboardKeys.all, 'list', params] as const,
};

/**
 * Hook to fetch leaderboard
 * Uses REAL_TIME cache (30 sec stale) - leaderboard updates frequently but not every second
 * Aggressively refetches to keep data fresh when viewing leaderboard
 */
export function useLeaderboard(
  params?: PaginationParams & { season?: number },
  options?: Omit<UseQueryOptions<LeaderboardUser[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LeaderboardUser[], McsrApiError>({
    queryKey: leaderboardKeys.list(params),
    queryFn: () => getLeaderboard(params),
    ...CACHE_PRESETS.LEADERBOARD,
    ...options,
  });
}
