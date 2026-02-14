import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getRecordLeaderboard } from '../endpoints';
import type { RecordLeaderboardEntry } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const recordLeaderboardKeys = {
  all: ['record-leaderboard'] as const,
  list: () => [...recordLeaderboardKeys.all, 'list'] as const,
};

export function useRecordLeaderboard(
  options?: Omit<UseQueryOptions<RecordLeaderboardEntry[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<RecordLeaderboardEntry[], McsrApiError>({
    queryKey: recordLeaderboardKeys.list(),
    queryFn: () => getRecordLeaderboard(),
    ...CACHE_PRESETS.LEADERBOARD,
    ...options,
  });
}
