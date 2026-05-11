import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMatches, getMatch } from '../endpoints';
import type { MatchInfo, MatchFilterParams } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const matchKeys = {
  all: ['matches'] as const,
  lists: () => [...matchKeys.all, 'list'] as const,
  list: (params?: MatchFilterParams) => [...matchKeys.lists(), params] as const,
  details: () => [...matchKeys.all, 'detail'] as const,
  detail: (id: string) => [...matchKeys.details(), id] as const,
};

/**
 * Hook to fetch match lists
 * Uses DYNAMIC cache (2 min stale) - match lists update regularly with new matches
 */
export function useMatches(
  params?: MatchFilterParams,
  options?: Omit<UseQueryOptions<MatchInfo[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo[], McsrApiError>({
    queryKey: matchKeys.list(params),
    queryFn: () => getMatches(params),
    ...CACHE_PRESETS.RECENT_MATCHES,
    ...options,
  });
}

/**
 * Hook to fetch specific match details
 * Uses STATIC cache (30 min stale) - completed match details never change
 * Conservative refetch strategy since historical data is immutable
 */
export function useMatch(
  matchId: string,
  options?: Omit<UseQueryOptions<MatchInfo, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo, McsrApiError>({
    queryKey: matchKeys.detail(matchId),
    queryFn: () => getMatch(matchId),
    ...CACHE_PRESETS.MATCH_DETAILS,
    enabled: !!matchId,
    ...options,
  });
}
