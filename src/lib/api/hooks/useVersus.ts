import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getVersusStats, getVersusMatches } from '../endpoints';
import type { VersusStats, MatchInfo, MatchFilterParams } from '@/types/api';
import type { McsrApiError } from '../client';

export const versusKeys = {
  all: ['versus'] as const,
  stats: (user1: string, user2: string) =>
    [...versusKeys.all, 'stats', user1, user2] as const,
  matches: (user1: string, user2: string, params?: MatchFilterParams) =>
    [...versusKeys.all, 'matches', user1, user2, params] as const,
};

export function useVersusStats(
  user1: string,
  user2: string,
  options?: Omit<UseQueryOptions<VersusStats, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<VersusStats, McsrApiError>({
    queryKey: versusKeys.stats(user1, user2),
    queryFn: () => getVersusStats(user1, user2),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!user1 && !!user2,
    ...options,
  });
}

export function useVersusMatches(
  user1: string,
  user2: string,
  params?: MatchFilterParams,
  options?: Omit<UseQueryOptions<MatchInfo[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo[], McsrApiError>({
    queryKey: versusKeys.matches(user1, user2, params),
    queryFn: () => getVersusMatches(user1, user2, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!user1 && !!user2,
    ...options,
  });
}
