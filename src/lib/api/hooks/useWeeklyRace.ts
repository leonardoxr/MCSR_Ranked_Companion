import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getWeeklyRace } from '../endpoints';
import type { WeeklyRaceInfo } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const weeklyRaceKeys = {
  all: ['weekly-race'] as const,
  current: () => [...weeklyRaceKeys.all, 'current'] as const,
  byWeek: (week: number, season?: number) =>
    [...weeklyRaceKeys.all, 'week', week, season] as const,
};

export function useWeeklyRace(
  params?: { week?: number; season?: number },
  options?: Omit<UseQueryOptions<WeeklyRaceInfo, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<WeeklyRaceInfo, McsrApiError>({
    queryKey: params?.week
      ? weeklyRaceKeys.byWeek(params.week, params.season)
      : weeklyRaceKeys.current(),
    queryFn: () => getWeeklyRace(params),
    ...CACHE_PRESETS.LEADERBOARD,
    ...options,
  });
}
