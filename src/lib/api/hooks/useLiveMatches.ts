import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getLiveMatches } from '../endpoints';
import type { LiveMatch } from '@/types/api';
import type { McsrApiError } from '../client';

export const liveMatchKeys = {
  all: ['liveMatches'] as const,
  list: () => [...liveMatchKeys.all, 'list'] as const,
};

export function useLiveMatches(
  options?: Omit<UseQueryOptions<LiveMatch[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LiveMatch[], McsrApiError>({
    queryKey: liveMatchKeys.list(),
    queryFn: getLiveMatches,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options,
  });
}
