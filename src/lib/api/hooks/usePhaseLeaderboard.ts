import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getPhaseLeaderboard } from '../endpoints';
import type { PhaseLeaderboardResponse } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const phaseLeaderboardKeys = {
  all: ['phase-leaderboard'] as const,
  list: () => [...phaseLeaderboardKeys.all, 'list'] as const,
};

export function usePhaseLeaderboard(
  options?: Omit<UseQueryOptions<PhaseLeaderboardResponse, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PhaseLeaderboardResponse, McsrApiError>({
    queryKey: phaseLeaderboardKeys.list(),
    queryFn: () => getPhaseLeaderboard(),
    ...CACHE_PRESETS.LEADERBOARD,
    ...options,
  });
}
