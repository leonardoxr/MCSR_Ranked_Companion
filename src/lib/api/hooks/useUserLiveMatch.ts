import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserLiveMatch } from '../endpoints';
import type { LiveMatch } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const userLiveMatchKeys = {
  all: ['userLiveMatch'] as const,
  user: (identifier: string) => [...userLiveMatchKeys.all, identifier] as const,
};

/**
 * Hook to fetch a user's live match data
 * Uses LIVE cache (15 sec stale, auto-refetch every 30s) - most dynamic data
 * Automatically refetches to keep live match data up to date
 * @param userIdentifier - User UUID, nickname, or Discord ID
 * @param privateKey - Optional private key for live match data access
 */
export function useUserLiveMatch(
  userIdentifier: string,
  privateKey?: string,
  authRevision = 0,
  options?: Omit<UseQueryOptions<LiveMatch | null, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  const authScope = privateKey ? 'with-private-key' : 'public';

  return useQuery<LiveMatch | null, McsrApiError>({
    queryKey: [...userLiveMatchKeys.user(userIdentifier), authScope, authRevision],
    queryFn: () => getUserLiveMatch(userIdentifier, privateKey),
    ...CACHE_PRESETS.LIVE_MATCHES,
    ...options,
    // Refetch every 10 seconds for live match data
    refetchInterval: 10000,
  });
}
