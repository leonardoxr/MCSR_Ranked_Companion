# Smart Cache System

The MCSR Ranked Companion uses a smart cache system built on TanStack Query (React Query) that optimizes data fetching and caching based on how frequently different types of data change.

## Cache Tiers

The system uses four cache tiers with different stale times and garbage collection policies:

### 1. STATIC (30 min stale, 1 hour in memory)
**Used for:** Data that never changes once created
- Completed match details
- Historical match records

### 2. SEMI_STATIC (10 min stale, 30 min in memory)
**Used for:** Data that changes occasionally
- Player profiles (including skins/avatars)
- Player achievements
- Head-to-head stats between players

### 3. DYNAMIC (2 min stale, 10 min in memory)
**Used for:** Data that changes regularly
- Recent match history
- Match lists
- Active player stats

### 4. REAL_TIME (30 sec stale, 5 min in memory)
**Used for:** Frequently updating data
- Leaderboard rankings

### 5. LIVE (15 sec stale, 2 min in memory, auto-refetch)
**Used for:** Live/streaming data
- Active/ongoing matches
- Auto-refetches every 30 seconds

## Refetch Strategies

Each cache tier includes a refetch strategy:

- **AGGRESSIVE**: Refetches on mount, reconnect, and window focus (leaderboard, live matches)
- **MODERATE**: Refetches on mount and reconnect only (player data, match history)
- **CONSERVATIVE**: No automatic refetching (historical data)

## Usage

### Using Cache Presets in Hooks

All API hooks already use the appropriate cache preset:

```ts
// hooks/usePlayer.ts
export function usePlayer(username: string) {
  return useQuery({
    queryKey: playerKeys.profile(username),
    queryFn: () => getUser(username),
    ...CACHE_PRESETS.PLAYER_PROFILE, // 10 min stale, moderate refetch
  });
}
```

### Manual Cache Invalidation

Use cache utilities when you need to force refresh data:

```ts
import { invalidatePlayerCache } from '@/lib/api/cache';

// When user updates their skin
function handleSkinUpdate() {
  invalidatePlayerCache(queryClient, username);
}
```

Available utilities:
- `invalidatePlayerCache(queryClient, username)` - Invalidate all data for a player
- `invalidateLeaderboardCache(queryClient)` - Refresh leaderboard
- `invalidateLiveMatchesCache(queryClient)` - Refresh live matches
- `invalidateMatchCache(queryClient, matchId)` - Refresh specific match
- `invalidateAllMatchCaches(queryClient)` - Refresh all match-related caches

### Prefetching for Better UX

Warm up the cache when users hover over links:

```ts
import { prefetchPlayer } from '@/lib/api/cache';

<Link
  href={`/player/${username}`}
  onMouseEnter={() => prefetchPlayer(queryClient, username)}
>
  {username}
</Link>
```

## Cache Behavior Examples

### Player Skin Changes
Player skins are cached for 10 minutes, but the cache refetches on mount (moderate strategy). This means:
- Users see cached skins instantly (fast page loads)
- When navigating to a player profile, fresh data is fetched in the background
- If the skin changed, it updates automatically without manual refresh

### Leaderboard Updates
Leaderboard is cached for only 30 seconds with aggressive refetching:
- Fresh data when viewing the leaderboard page
- Auto-updates when returning to the tab
- Reconnects trigger a refresh

### Historical Match Details
Completed matches are cached for 30 minutes with no auto-refetching:
- Once loaded, stays in memory for an hour
- Perfect for browsing match history without repeated API calls
- Match details never change, so aggressive caching is safe

## Benefits

1. **Reduced API Load**: Smart caching reduces unnecessary API calls
2. **Fast Page Loads**: Cached data shows instantly while fresh data loads in background
3. **Stale-While-Revalidate**: Users see cached data immediately, updates happen seamlessly
4. **Bandwidth Savings**: Long cache times for static data, short for live data
5. **Better UX**: Prefetching makes navigation feel instant

## Configuration

Cache settings are defined in `/src/lib/api/cache-config.ts`. To adjust cache times:

```ts
export const CACHE_TIMES = {
  SEMI_STATIC: {
    staleTime: 10 * 60 * 1000, // Adjust this for player profiles
    gcTime: 30 * 60 * 1000,
  },
  // ...
};
```

## Debugging

Use the React Query Devtools (available in development) to inspect cache state:

```tsx
// Automatically included in Providers component
<ReactQueryDevtools initialIsOpen={false} />
```

Get cache stats programmatically:

```ts
import { getCacheStats } from '@/lib/api/cache';

const stats = getCacheStats(queryClient);
console.log(stats); // { totalQueries, byStatus, byKey }
```
