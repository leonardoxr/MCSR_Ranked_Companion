import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMatches, getMatch } from '../endpoints';
import type { MatchInfo, MatchFilterParams } from '@/types/api';
import type { McsrApiError } from '../client';

export const matchKeys = {
  all: ['matches'] as const,
  lists: () => [...matchKeys.all, 'list'] as const,
  list: (params?: MatchFilterParams) => [...matchKeys.lists(), params] as const,
  details: () => [...matchKeys.all, 'detail'] as const,
  detail: (id: string) => [...matchKeys.details(), id] as const,
};

export function useMatches(
  params?: MatchFilterParams,
  options?: Omit<UseQueryOptions<MatchInfo[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo[], McsrApiError>({
    queryKey: matchKeys.list(params),
    queryFn: () => getMatches(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

export function useMatch(
  matchId: string,
  options?: Omit<UseQueryOptions<MatchInfo, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo, McsrApiError>({
    queryKey: matchKeys.detail(matchId),
    queryFn: () => getMatch(matchId),
    staleTime: 5 * 60 * 1000, // 5 minutes (match details don't change)
    enabled: !!matchId,
    ...options,
  });
}
