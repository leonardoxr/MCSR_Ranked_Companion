# Implementation Plan: New API Features & Bug Fixes

## Overview

This plan covers 3 new endpoints, 3 type bug fixes, 1 unused feature to activate, and navigation/i18n updates. Organized into 7 phases with dependencies noted.

---

## Phase 1: Fix Type Bugs (P0 - Must fix first, other phases depend on correct types)

### 1.1 Rewrite `VersusStats` type in `src/types/api.ts`

**Problem:** The current `VersusStats` interface defines `player1`, `player2`, `player1Wins`, `player2Wins`, `totalMatches`, `recentMatches` — none of which match the actual API response. The versus page currently uses `any` casts to work around this.

**Replace the current `VersusStats` interface with:**
```ts
/**
 * Head-to-head results breakdown by match type
 * Keys are player UUIDs mapping to their win counts, plus a "total" key
 */
export interface VersusResultsByType {
  total: number;
  [uuid: string]: number; // Player UUID -> win count
}

/**
 * Head-to-head statistics between two players
 * Actual API response from GET /users/{user1}/versus/{user2}
 */
export interface VersusStats {
  players: [UserProfile, UserProfile];
  results: {
    ranked: VersusResultsByType;
    casual: VersusResultsByType;
  };
  changes: {
    [uuid: string]: number; // Net ELO change from h2h encounters
  };
}
```

**Files to modify:**
- `src/types/api.ts` — Replace `VersusStats` interface

### 1.2 Remove `any` casts from Versus page

**File:** `src/app/versus/[player1]/[player2]/page.tsx`

After fixing the type, remove the `as any` cast at ~line 122 and update all data access to use the correctly typed fields:
- `versusStats.players[0]` and `versusStats.players[1]` instead of `vsAny.players[0]`
- `versusStats.results.ranked[uuid]` for win counts
- `versusStats.results.ranked.total` for total matches
- `versusStats.changes[uuid]` for net ELO changes

**Note:** The page currently derives per-type stats from match data — review whether the new `results.casual` and `results.ranked` fields can simplify that logic.

### 1.3 Fix `WeeklyRaceInfo` type in `src/types/api.ts`

**Changes:**
1. Rename `the_end` → `theEnd` (camelCase as returned by API)
2. Add `flags: null | unknown` field to the seed object
3. Rename `replayExists` → `replayExist` in the leaderboard entry (no trailing "s")

```ts
export interface WeeklyRaceInfo {
  id: number;
  seed: {
    overworld: string;
    nether: string;
    theEnd: string;        // Changed from "the_end"
    rng: string;
    flags: unknown | null; // New field from API
  };
  endsAt: Timestamp;
  leaderboard: Array<{
    rank: number;
    player: UserProfile;
    time: Milliseconds;
    replayExist: boolean;  // Changed from "replayExists"
  }>;
}
```

**Files to modify:**
- `src/types/api.ts` — Update `WeeklyRaceInfo` interface

---

## Phase 2: Add New Types (depends on Phase 1 completion)

### 2.1 Add Record Leaderboard types to `src/types/api.ts`

```ts
/**
 * Entry in the record (fastest times) leaderboard
 */
export interface RecordLeaderboardEntry {
  rank: number;
  id: number;              // Match ID
  season: number;
  date: Timestamp;
  time: Milliseconds;
  user: UserProfile;
  seed: MatchSeed;
}
```

### 2.2 Add Phase Leaderboard types to `src/types/api.ts`

```ts
/**
 * Phase information for the phase leaderboard
 */
export interface PhaseInfo {
  endsAt: Timestamp;
  number: number;
  season: number;
}

/**
 * User entry in the phase points leaderboard
 */
export interface PhaseLeaderboardUser extends UserProfile {
  predPhasePoint: number;
  seasonResult: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoint: number;
  };
}

/**
 * Phase leaderboard response
 */
export interface PhaseLeaderboardResponse {
  phase: PhaseInfo;
  users: PhaseLeaderboardUser[];
}
```

### 2.3 Add Playoffs types to `src/types/api.ts`

```ts
/**
 * Player in the playoffs bracket
 */
export interface PlayoffPlayer {
  uuid: UUID;
  nickname: string;
  seasonEloRate: EloRate;
  seasonEloRank: Rank;
  seedNumber: number;
  personalBest: Milliseconds;
}

/**
 * A match in the playoffs bracket
 */
export interface PlayoffMatch {
  id: number;
  name: string;            // "Grand Finals", "Semifinals", etc.
  nextMatchId: number | null;
  maxRoundScore: number;   // Best-of-N
  startTime: Timestamp;
  state: string;           // "DONE", "SCHEDULED", "LIVE"
  participants: Array<{
    player: number;        // Index into PlayoffPlayer[] (seedNumber)
    roundScore: number;
  }>;
  vod: string;
}

/**
 * Final placement result in playoffs
 */
export interface PlayoffResult {
  player: number;          // Index into PlayoffPlayer[] (seedNumber)
  place: number;
  prize: number;           // Prize in dollars
}

/**
 * Full playoffs bracket data
 */
export interface PlayoffsBracket {
  type: string;
  players: PlayoffPlayer[];
  matches: PlayoffMatch[];
  results: PlayoffResult[];
  season: number;
}

/**
 * Playoffs response with navigation
 */
export interface PlayoffsResponse {
  data: PlayoffsBracket;
  next: number | null;
  prev: number | null;
}
```

---

## Phase 3: Add Endpoint Functions (depends on Phase 2)

### 3.1 Add to `src/lib/api/endpoints.ts`

Add these new endpoint functions after the existing Weekly Race section:

```ts
// ============================================================================
// Record Leaderboard Endpoints
// ============================================================================

/**
 * Get the record (fastest times) leaderboard
 * Returns top 100 fastest ranked completion times
 */
export async function getRecordLeaderboard(): Promise<RecordLeaderboardEntry[]> {
  return get<RecordLeaderboardEntry[]>('/record-leaderboard');
}

// ============================================================================
// Phase Leaderboard Endpoints
// ============================================================================

/**
 * Get the current phase points leaderboard
 */
export async function getPhaseLeaderboard(): Promise<PhaseLeaderboardResponse> {
  return get<PhaseLeaderboardResponse>('/phase-leaderboard');
}

// ============================================================================
// Playoffs Endpoints
// ============================================================================

/**
 * Get playoffs bracket data
 * @param params - Optional id for historical playoffs
 */
export async function getPlayoffs(params?: {
  id?: number;
}): Promise<PlayoffsResponse> {
  return get<PlayoffsResponse>('/playoffs', { params });
}
```

**Also add the type imports** at the top of the file:
```ts
import type {
  // ...existing imports...
  RecordLeaderboardEntry,
  PhaseLeaderboardResponse,
  PlayoffsResponse,
} from '@/types/api';
```

---

## Phase 4: Add React Query Hooks (depends on Phase 3)

### 4.1 Create `src/lib/api/hooks/useRecordLeaderboard.ts`

```ts
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
```

### 4.2 Create `src/lib/api/hooks/usePhaseLeaderboard.ts`

```ts
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
```

### 4.3 Create `src/lib/api/hooks/useWeeklyRace.ts`

```ts
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
```

### 4.4 Create `src/lib/api/hooks/usePlayoffs.ts`

```ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getPlayoffs } from '../endpoints';
import type { PlayoffsResponse } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const playoffsKeys = {
  all: ['playoffs'] as const,
  bracket: (id?: number) => [...playoffsKeys.all, 'bracket', id] as const,
};

export function usePlayoffs(
  id?: number,
  options?: Omit<UseQueryOptions<PlayoffsResponse, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PlayoffsResponse, McsrApiError>({
    queryKey: playoffsKeys.bracket(id),
    queryFn: () => getPlayoffs(id ? { id } : undefined),
    ...CACHE_PRESETS.SEMI_STATIC, // Playoffs data changes infrequently
    ...options,
  });
}
```

**Note on cache preset:** Playoffs should use `SEMI_STATIC` (or `PLAYER_PROFILE` preset which maps to SEMI_STATIC) since bracket data only changes during live playoff events. If `SEMI_STATIC` isn't directly a preset, use `CACHE_PRESETS.PLAYER_PROFILE` as a close match (10 min stale).

---

## Phase 5: Create Pages (depends on Phase 4)

Each new page follows the established pattern:
- `src/app/<route>/page.tsx` — Server component with metadata, renders `*Client`
- `src/components/features/<Name>Client.tsx` — Client component with `'use client'`, hooks, and UI

### 5.1 Weekly Race Page

**File: `src/app/weekly-race/page.tsx`**
- Server component with SEO metadata (title: "Weekly Race - MCSR Ranked Companion")
- Renders `<WeeklyRaceClient />`

**File: `src/components/features/WeeklyRaceClient.tsx`**
- Uses `useWeeklyRace()` hook
- Shows:
  - Current race ID and countdown timer to `endsAt` (using a `useEffect` interval)
  - Seed info display (overworld, nether, theEnd, rng)
  - Leaderboard table with columns: Rank, Player (avatar + name + country flag), Time (formatted from ms), Replay indicator
  - Loading/error states using `LoadingState` and `ErrorState` components
- Pattern: Similar to `HomePageClient.tsx` with `LeaderboardTable`-like rendering but custom columns
- Use `Card`, `CardContent` from UI components

### 5.2 Record Leaderboard Page

**File: `src/app/records/page.tsx`**
- Server component with SEO metadata (title: "Records - MCSR Ranked Companion")
- Renders `<RecordLeaderboardClient />`

**File: `src/components/features/RecordLeaderboardClient.tsx`**
- Uses `useRecordLeaderboard()` hook
- Shows:
  - Table with columns: Rank, Player (avatar + name + flag), Time (formatted), Season, Date, Seed info (overworld type + bastion type)
  - Each row links to `/match/{id}` for the record match
  - Top 3 podium cards (similar pattern to `LeaderboardTable`)
  - Loading/error states
- Could optionally show seed analysis stats (most common overworld types in records, etc.)

### 5.3 Phase Leaderboard Page

**File: `src/app/phase/page.tsx`**
- Server component with SEO metadata (title: "Phase Standings - MCSR Ranked Companion")
- Renders `<PhaseLeaderboardClient />`

**File: `src/components/features/PhaseLeaderboardClient.tsx`**
- Uses `usePhaseLeaderboard()` hook
- Shows:
  - Phase info header: "Phase {number} - Season {season}", countdown to `phase.endsAt`
  - Table with columns: Rank (from eloRank), Player (avatar + name + flag), ELO, Phase Points, Predicted Phase Points (predPhasePoint)
  - Each row links to `/player/{nickname}`
  - Loading/error states
  - Color-coded predicted points (green if higher than current, red if lower)

### 5.4 Playoffs Page

**File: `src/app/playoffs/page.tsx`**
- Server component with SEO metadata (title: "Playoffs - MCSR Ranked Companion")
- Renders `<PlayoffsClient />`

**File: `src/components/features/PlayoffsClient.tsx`**
- Uses `usePlayoffs(id?)` hook
- Shows:
  - Season header with navigation arrows to prev/next playoffs (using `response.prev` and `response.next`)
  - **Bracket visualization** — This is the most complex component:
    - Round of 16 → Quarterfinals → Semifinals → Grand Finals
    - Each match shows: two participant names with scores, match state badge (DONE/LIVE/SCHEDULED), VOD link button
    - Winners highlighted, losers dimmed
    - Best-of-N indicator per match
  - **Results table** at the bottom: Final placements with prize amounts
  - **Players panel**: List of 16 participants with their seed number, season ELO, and personal best
  - Loading/error states
- Consider using CSS Grid or Flexbox for bracket layout (4 columns for 4 rounds)
- VOD links open in new tab

### 5.5 Layout files for new pages

Each new route needs a minimal layout.tsx if using dynamic segments. For the playoffs page (if adding `?id=N` query param rather than path segment), no layout is needed. For weekly-race, records, and phase — no dynamic segments, so no extra layout needed.

---

## Phase 6: Navigation & i18n Updates (depends on Phase 5)

### 6.1 Add translation keys to all 4 locale files

**Add to `messages/en.json`:**
```json
{
  "nav": {
    // ...existing keys...
    "records": "Records",
    "weeklyRace": "Weekly Race",
    "phase": "Phase",
    "playoffs": "Playoffs"
  },
  "records": {
    "title": "Record Times",
    "description": "Fastest completion times in MCSR Ranked history",
    "table": {
      "rank": "Rank",
      "player": "Player",
      "time": "Time",
      "season": "Season",
      "date": "Date",
      "seed": "Seed"
    },
    "noRecords": "No records found"
  },
  "weeklyRace": {
    "title": "Weekly Race",
    "description": "Current weekly speedrun race",
    "endsIn": "Ends in",
    "seedInfo": "Seed Information",
    "overworld": "Overworld",
    "nether": "Nether",
    "end": "End",
    "table": {
      "rank": "Rank",
      "player": "Player",
      "time": "Time",
      "replay": "Replay"
    },
    "noEntries": "No race entries yet"
  },
  "phase": {
    "title": "Phase Standings",
    "description": "Current phase points leaderboard",
    "phaseNumber": "Phase {number}",
    "season": "Season {season}",
    "endsIn": "Ends in",
    "table": {
      "rank": "Rank",
      "player": "Player",
      "elo": "ELO",
      "phasePoints": "Phase Points",
      "predicted": "Predicted"
    },
    "noPlayers": "No phase data available"
  },
  "playoffs": {
    "title": "Playoffs",
    "description": "MCSR Ranked playoffs bracket",
    "season": "Season {season}",
    "bracket": "Bracket",
    "results": "Results",
    "players": "Players",
    "roundOf16": "Round of 16",
    "quarterfinals": "Quarterfinals",
    "semifinals": "Semifinals",
    "grandFinals": "Grand Finals",
    "bestOf": "Best of {n}",
    "watchVod": "Watch VOD",
    "placement": "Place",
    "prize": "Prize",
    "seed": "Seed",
    "personalBest": "PB",
    "states": {
      "done": "Completed",
      "live": "Live",
      "scheduled": "Scheduled"
    },
    "noPlayoffs": "No playoffs data available",
    "prevSeason": "Previous Season",
    "nextSeason": "Next Season"
  }
}
```

**Add equivalent translations to `messages/pt-BR.json`, `messages/es.json`, `messages/zh.json`** with appropriate translations for each language.

### 6.2 Update Header navigation

**File: `src/components/layout/Header.tsx`**

Add new nav links in both desktop and mobile sections. The nav is getting larger, so consider using a dropdown/submenu for "Leaderboards" grouping. Two approaches:

**Option A: Flat nav (simpler, add all links):**
```tsx
// Desktop nav - add after existing links, before LiveNavLink
<NavLink href="/records" label={t('nav.records')} />
<NavLink href="/weekly-race" label={t('nav.weeklyRace')} />
<NavLink href="/phase" label={t('nav.phase')} />
<NavLink href="/playoffs" label={t('nav.playoffs')} />

// Mobile nav - same additions
<MobileNavLink href="/records" label={t('nav.records')} />
<MobileNavLink href="/weekly-race" label={t('nav.weeklyRace')} />
<MobileNavLink href="/phase" label={t('nav.phase')} />
<MobileNavLink href="/playoffs" label={t('nav.playoffs')} />
```

**Option B: Grouped dropdown (better for UX with many links):**
Create a "Rankings" or "Leaderboards" dropdown menu using the existing `dropdown-menu.tsx` UI component that groups:
- ELO Leaderboard (/)
- Record Times (/records)
- Phase Standings (/phase)
- Weekly Race (/weekly-race)
- Playoffs (/playoffs)

**Recommendation:** Start with Option A for simplicity. If the nav feels cluttered, refactor to Option B in a follow-up.

### 6.3 Update `src/components/features/index.ts` barrel export

Add exports for all new client components:
```ts
export { WeeklyRaceClient } from './WeeklyRaceClient';
export { RecordLeaderboardClient } from './RecordLeaderboardClient';
export { PhaseLeaderboardClient } from './PhaseLeaderboardClient';
export { PlayoffsClient } from './PlayoffsClient';
```

---

## Phase 7: Testing & Verification

### 7.1 Type check
```bash
npm run type-check
```
Verify no TypeScript errors, especially:
- The fixed `VersusStats` type works in the versus page without `any` casts
- The fixed `WeeklyRaceInfo` type matches usage in `getWeeklyRace`
- All new types are correctly exported and imported

### 7.2 Lint check
```bash
npm run lint
```

### 7.3 Build verification
```bash
npm run build
```
Ensure production build succeeds with all new pages.

### 7.4 Manual testing checklist
- [ ] `/versus/Player1/Player2` — Still works correctly with fixed types (no runtime errors)
- [ ] `/records` — Loads and displays the top 100 records
- [ ] `/weekly-race` — Shows current race with countdown and leaderboard
- [ ] `/phase` — Shows phase standings with predicted points
- [ ] `/playoffs` — Shows bracket, navigates between seasons
- [ ] Navigation — All new links appear and work in desktop and mobile
- [ ] i18n — Switch language and verify translations appear

---

## File Change Summary

### Modified files:
| File | Changes |
|------|---------|
| `src/types/api.ts` | Fix `VersusStats`, fix `WeeklyRaceInfo`, add 8 new interfaces |
| `src/lib/api/endpoints.ts` | Add 3 new endpoint functions + imports |
| `src/app/versus/[player1]/[player2]/page.tsx` | Remove `any` casts, use correct `VersusStats` fields |
| `src/components/layout/Header.tsx` | Add 4 new nav links (desktop + mobile) |
| `src/components/features/index.ts` | Add 4 new exports |
| `messages/en.json` | Add translation keys for 4 new features |
| `messages/pt-BR.json` | Add Portuguese translations |
| `messages/es.json` | Add Spanish translations |
| `messages/zh.json` | Add Chinese translations |

### New files:
| File | Purpose |
|------|---------|
| `src/lib/api/hooks/useRecordLeaderboard.ts` | Hook for record leaderboard |
| `src/lib/api/hooks/usePhaseLeaderboard.ts` | Hook for phase leaderboard |
| `src/lib/api/hooks/useWeeklyRace.ts` | Hook for weekly race |
| `src/lib/api/hooks/usePlayoffs.ts` | Hook for playoffs |
| `src/app/records/page.tsx` | Record leaderboard page |
| `src/app/weekly-race/page.tsx` | Weekly race page |
| `src/app/phase/page.tsx` | Phase leaderboard page |
| `src/app/playoffs/page.tsx` | Playoffs page |
| `src/components/features/RecordLeaderboardClient.tsx` | Record leaderboard UI |
| `src/components/features/WeeklyRaceClient.tsx` | Weekly race UI |
| `src/components/features/PhaseLeaderboardClient.tsx` | Phase leaderboard UI |
| `src/components/features/PlayoffsClient.tsx` | Playoffs bracket UI |

### Total: 9 modified files + 12 new files = 21 files

---

## Implementation Order (recommended sequence)

1. **Phase 1** (30 min) — Fix type bugs. Must be first since other phases depend on correct types.
2. **Phase 2** (20 min) — Add all new types. Pure type additions, no runtime impact.
3. **Phase 3** (15 min) — Add endpoint functions. Depends on types from Phase 2.
4. **Phase 4** (20 min) — Add hooks. Depends on endpoints from Phase 3.
5. **Phase 5** (2-3 hours) — Create pages. The bulk of the work. Can be done in parallel per page:
   - 5.1 Weekly Race — Simplest new page (table + countdown)
   - 5.2 Record Leaderboard — Simple table, similar to existing leaderboard
   - 5.3 Phase Leaderboard — Simple table with extra columns
   - 5.4 Playoffs — Most complex (bracket visualization)
6. **Phase 6** (30 min) — Nav and i18n updates. Should be done after pages exist.
7. **Phase 7** (20 min) — Testing and verification.

**Commit strategy:** One commit per phase, or logical groupings:
1. "Fix VersusStats and WeeklyRaceInfo type mismatches"
2. "Add types, endpoints, and hooks for new API features"
3. "Add Weekly Race page"
4. "Add Record Leaderboard page"
5. "Add Phase Leaderboard page"
6. "Add Playoffs bracket page"
7. "Add navigation links and i18n for new pages"
