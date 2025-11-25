/**
 * Avatar/Skin Caching Utilities
 *
 * Provides smart caching for player avatars and skins with:
 * - Daily rotating cache version for automatic but infrequent refreshes
 * - Manual force refresh capability
 * - Consistent URL generation across the app
 */

/**
 * Get the current cache version based on date.
 * This rotates daily, allowing skins to refresh once per day at most.
 * Format: YYYYMMDD (e.g., "20240115")
 */
export function getAvatarCacheVersion(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Storage key for forced refresh version
 * When user requests a refresh, we store a timestamp that overrides the daily version
 */
const FORCE_REFRESH_KEY = 'avatar_force_refresh_v';

/**
 * Get the effective cache version, considering forced refreshes.
 * If user has forced a refresh, use that timestamp until it expires.
 */
export function getEffectiveCacheVersion(): string {
  // Check for forced refresh in localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const forced = localStorage.getItem(FORCE_REFRESH_KEY);
    if (forced) {
      const { timestamp, version } = JSON.parse(forced);
      // Force refresh is valid for 1 hour
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        return version;
      }
      // Expired, clean up
      localStorage.removeItem(FORCE_REFRESH_KEY);
    }
  }
  return getAvatarCacheVersion();
}

/**
 * Force refresh all avatars by bumping the cache version.
 * This creates a unique version that bypasses the daily cache.
 */
export function forceRefreshAvatars(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      FORCE_REFRESH_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        version: `force_${Date.now()}`,
      })
    );
  }
}

/**
 * Clear the forced refresh, returning to daily cache rotation.
 */
export function clearForcedRefresh(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FORCE_REFRESH_KEY);
  }
}

// Avatar URL configuration
const AVATAR_PROVIDERS = {
  primary: {
    avatar: (uuid: string, overlay: boolean, size?: number) => {
      const params = new URLSearchParams();
      params.set('overlay', String(overlay));
      if (size) params.set('size', String(size));
      params.set('v', getEffectiveCacheVersion());
      return `https://crafatar.com/avatars/${uuid}?${params.toString()}`;
    },
    skin: (uuid: string) => {
      const params = new URLSearchParams();
      params.set('v', getEffectiveCacheVersion());
      return `https://crafatar.com/skins/${uuid}?${params.toString()}`;
    },
  },
  fallback: {
    avatar: (uuid: string, overlay: boolean) => {
      const params = new URLSearchParams();
      params.set('overlay', String(overlay));
      params.set('v', getEffectiveCacheVersion());
      return `https://avatars.cloudhaven.gg/avatars/${uuid}?${params.toString()}`;
    },
    skin: (uuid: string) => {
      const params = new URLSearchParams();
      params.set('v', getEffectiveCacheVersion());
      return `https://avatars.cloudhaven.gg/skins/${uuid}?${params.toString()}`;
    },
  },
} as const;

/**
 * Generate avatar URL with proper caching parameters.
 * @param uuid Player UUID
 * @param options Configuration options
 */
export function getAvatarUrl(
  uuid: string,
  options: {
    overlay?: boolean;
    size?: number;
    provider?: 'primary' | 'fallback';
  } = {}
): string {
  const { overlay = true, size, provider = 'primary' } = options;
  return AVATAR_PROVIDERS[provider].avatar(uuid, overlay, size);
}

/**
 * Generate skin texture URL with proper caching parameters.
 * @param uuid Player UUID
 * @param provider Which provider to use
 */
export function getSkinUrl(
  uuid: string,
  provider: 'primary' | 'fallback' = 'primary'
): string {
  return AVATAR_PROVIDERS[provider].skin(uuid);
}

/**
 * Get both primary and fallback avatar URLs for a player.
 * Useful for components that need to try multiple sources.
 */
export function getAvatarUrls(
  uuid: string,
  options: { overlay?: boolean; size?: number } = {}
): { primary: string; fallback: string } {
  return {
    primary: getAvatarUrl(uuid, { ...options, provider: 'primary' }),
    fallback: getAvatarUrl(uuid, { ...options, provider: 'fallback' }),
  };
}

/**
 * Get both primary and fallback skin URLs for a player.
 */
export function getSkinUrls(uuid: string): { primary: string; fallback: string } {
  return {
    primary: getSkinUrl(uuid, 'primary'),
    fallback: getSkinUrl(uuid, 'fallback'),
  };
}

/**
 * Recommended sizes for different use cases.
 * Crafatar supports: 8, 16, 32, 64, 128, 256, 512
 */
export const AVATAR_SIZES = {
  xs: 32,   // Tiny icons
  sm: 48,   // Small inline
  md: 64,   // Default medium
  lg: 96,   // Large cards
  xl: 128,  // Hero sections
  full: 256, // Full size display
} as const;
