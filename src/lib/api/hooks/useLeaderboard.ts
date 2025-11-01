import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getLeaderboard } from '../endpoints';
import type { LeaderboardUser, PaginationParams } from '@/types/api';
import type { McsrApiError } from '../client';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (params?: PaginationParams & { season?: number }) =>
    [...leaderboardKeys.all, 'list', params] as const,
};

export function useLeaderboard(
  params?: PaginationParams & { season?: number },
  options?: Omit<UseQueryOptions<LeaderboardUser[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LeaderboardUser[], McsrApiError>({
    queryKey: leaderboardKeys.list(params),
    queryFn: () => getLeaderboard(params),
    staleTime: 30 * 1000, // 30 seconds (leaderboard updates frequently)
    ...options,
  });
}
