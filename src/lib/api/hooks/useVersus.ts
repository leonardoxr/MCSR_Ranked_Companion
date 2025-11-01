import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getVersusStats, getVersusMatches } from '../endpoints';
import type { VersusStats, MatchInfo, MatchFilterParams } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const versusKeys = {
  all: ['versus'] as const,
  stats: (user1: string, user2: string) =>
    [...versusKeys.all, 'stats', user1, user2] as const,
  matches: (user1: string, user2: string, params?: MatchFilterParams) =>
    [...versusKeys.all, 'matches', user1, user2, params] as const,
};

/**
 * Hook to fetch head-to-head stats between two players
 * Uses SEMI_STATIC cache (10 min stale) - versus stats don't change very often
 */
export function useVersusStats(
  user1: string,
  user2: string,
  options?: Omit<UseQueryOptions<VersusStats, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VersusStats, McsrApiError>({
    queryKey: versusKeys.stats(user1, user2),
    queryFn: () => getVersusStats(user1, user2),
    ...CACHE_PRESETS.PLAYER_PROFILE,
    enabled: !!user1 && !!user2,
    ...options,
  });
}

/**
 * Hook to fetch match history between two players
 * Uses DYNAMIC cache (2 min stale) - match lists update regularly
 */
export function useVersusMatches(
  user1: string,
  user2: string,
  params?: MatchFilterParams,
  options?: Omit<UseQueryOptions<MatchInfo[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo[], McsrApiError>({
    queryKey: versusKeys.matches(user1, user2, params),
    queryFn: () => getVersusMatches(user1, user2, params),
    ...CACHE_PRESETS.RECENT_MATCHES,
    enabled: !!user1 && !!user2,
    ...options,
  });
}
