import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUser, getUserMatches, getUserAchievements } from '../endpoints';
import type { UserInfo, MatchInfo, Achievement, MatchFilterParams } from '@/types/api';
import type { McsrApiError } from '../client';

/**
 * Query keys for player-related queries
 */
export const playerKeys = {
  all: ['player'] as const,
  profile: (user: string) => [...playerKeys.all, 'profile', user] as const,
  matches: (user: string, params?: MatchFilterParams) =>
    [...playerKeys.all, 'matches', user, params] as const,
  achievements: (user: string) => [...playerKeys.all, 'achievements', user] as const,
};

/**
 * Hook to fetch player profile
 */
export function usePlayer(
  username: string,
  options?: Omit<UseQueryOptions<UserInfo, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserInfo, McsrApiError>({
    queryKey: playerKeys.profile(username),
    queryFn: () => getUser(username),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!username,
    ...options,
  });
}

/**
 * Hook to fetch player match history
 */
export function usePlayerMatches(
  username: string,
  params?: MatchFilterParams,
  options?: Omit<UseQueryOptions<MatchInfo[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo[], McsrApiError>({
    queryKey: playerKeys.matches(username, params),
    queryFn: () => getUserMatches(username, params),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!username,
    ...options,
  });
}

/**
 * Hook to fetch player achievements
 */
export function usePlayerAchievements(
  username: string,
  options?: Omit<UseQueryOptions<Achievement[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Achievement[], McsrApiError>({
    queryKey: playerKeys.achievements(username),
    queryFn: () => getUserAchievements(username),
    staleTime: 5 * 60 * 1000, // 5 minutes (achievements don't change often)
    enabled: !!username,
    ...options,
  });
}
