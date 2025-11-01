import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getLiveMatches } from '../endpoints';
import type { LiveMatch } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const liveMatchKeys = {
  all: ['liveMatches'] as const,
  list: () => [...liveMatchKeys.all, 'list'] as const,
};

/**
 * Hook to fetch live/active matches
 * Uses LIVE cache (15 sec stale, auto-refetch every 30s) - most dynamic data
 * Automatically refetches to keep live matches up to date
 */
export function useLiveMatches(
  options?: Omit<UseQueryOptions<LiveMatch[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LiveMatch[], McsrApiError>({
    queryKey: liveMatchKeys.list(),
    queryFn: getLiveMatches,
    ...CACHE_PRESETS.LIVE_MATCHES,
    ...options,
  });
}
