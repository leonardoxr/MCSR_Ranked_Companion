import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUser, getUserMatches, getUserAchievements } from '../endpoints';
import type { UserInfo, MatchInfo, Achievement, MatchFilterParams } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

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
 * Uses SEMI_STATIC cache (10 min stale) - player profiles including skins don't change often
 * Refetches on mount to catch skin changes when viewing a profile
 */
export function usePlayer(
  username: string,
  options?: Omit<UseQueryOptions<UserInfo, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserInfo, McsrApiError>({
    queryKey: playerKeys.profile(username),
    queryFn: () => getUser(username),
    ...CACHE_PRESETS.PLAYER_PROFILE,
    enabled: !!username,
    ...options,
  });
}

/**
 * Hook to fetch player match history
 * Uses DYNAMIC cache (2 min stale) - recent matches update regularly
 */
export function usePlayerMatches(
  username: string,
  params?: MatchFilterParams,
  options?: Omit<UseQueryOptions<MatchInfo[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MatchInfo[], McsrApiError>({
    queryKey: playerKeys.matches(username, params),
    queryFn: () => getUserMatches(username, params),
    ...CACHE_PRESETS.RECENT_MATCHES,
    enabled: !!username,
    ...options,
  });
}

/**
 * Hook to fetch player achievements
 * Uses SEMI_STATIC cache (10 min stale) - achievements rarely change
 */
export function usePlayerAchievements(
  username: string,
  options?: Omit<UseQueryOptions<Achievement[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Achievement[], McsrApiError>({
    queryKey: playerKeys.achievements(username),
    queryFn: () => getUserAchievements(username),
    ...CACHE_PRESETS.ACHIEVEMENTS,
    enabled: !!username,
    ...options,
  });
}
