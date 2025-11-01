/**
 * Smart Cache System for MCSR Ranked API
 *
 * Central export file for cache configuration and utilities.
 * Use this file to import cache-related functions and configurations.
 *
 * @example
 * ```ts
 * import { invalidatePlayerCache, CACHE_PRESETS } from '@/lib/api/cache';
 *
 * // Invalidate player cache when skin is updated
 * invalidatePlayerCache(queryClient, 'playerName');
 *
 * // Use custom cache preset in a hook
 * useQuery({
 *   ...CACHE_PRESETS.PLAYER_PROFILE,
 *   queryKey: ['custom'],
 *   queryFn: fetchData,
 * });
 * ```
 */

// Export cache configuration
export { CACHE_TIMES, BACKGROUND_REFETCH, CACHE_PRESETS } from './cache-config';

// Export cache utilities
export {
  invalidatePlayerCache,
  invalidateLeaderboardCache,
  invalidateLiveMatchesCache,
  invalidateMatchCache,
  invalidateAllMatchCaches,
  prefetchPlayer,
  prefetchMatch,
  clearAllCaches,
  getCacheStats,
} from './cache-utils';
