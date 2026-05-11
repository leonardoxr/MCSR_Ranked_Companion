# MCSR Ranked API Research Findings

Research conducted: 2026-02-14
Compared: Live API responses vs. current codebase implementation

---

## Executive Summary

Three **entirely new endpoints** were discovered that are not implemented in the codebase at all. Several existing endpoints have **response structure differences** from what's typed. The `VersusStats` type needs a complete rewrite to match the actual API. One existing endpoint function (`getWeeklyRace`) is defined but has no hook and is unused in any page.

---

## NEW Endpoints (Not Implemented)

### 1. `GET /record-leaderboard` -- Fastest Completions Leaderboard

**Priority: HIGH** -- This is a fully working endpoint returning the top 100 fastest completion times across all players.

**Live Response Structure:**
```ts
interface RecordLeaderboardEntry {
  rank: number;              // 1-based rank
  id: number;                // Match ID where the record was set
  season: number;            // Season when the record was set
  date: Timestamp;           // Unix timestamp
  time: Milliseconds;        // Completion time
  user: UserProfile;         // Player who set the record
  seed: MatchSeed;           // Seed info for the record run
}

// Endpoint: GET /record-leaderboard
// Returns: RecordLeaderboardEntry[] (100 entries)
```

**Implementation needed:**
- Add `RecordLeaderboardEntry` type to `src/types/api.ts`
- Add `getRecordLeaderboard()` endpoint to `src/lib/api/endpoints.ts`
- Create `useRecordLeaderboard` hook
- Create `/record-leaderboard` page (or integrate into existing leaderboard page as a tab)

**Feature ideas:** Fastest times table, filter by season, seed analysis for record runs, link to match details.

---

### 2. `GET /phase-leaderboard` -- Phase Points Leaderboard

**Priority: HIGH** -- Shows the current phase standings with predicted phase points.

**Live Response Structure:**
```ts
interface PhaseInfo {
  endsAt: Timestamp;
  number: number;            // Phase number (e.g. 2)
  season: number;            // Season number (e.g. 10)
}

interface PhaseLeaderboardUser extends UserProfile {
  predPhasePoint: number;    // Predicted phase points (NEW field)
  seasonResult: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoint: number;
  };
}

interface PhaseLeaderboardResponse {
  phase: PhaseInfo;
  users: PhaseLeaderboardUser[];
}

// Endpoint: GET /phase-leaderboard
// Returns: PhaseLeaderboardResponse
```

**Implementation needed:**
- Add `PhaseLeaderboardUser`, `PhaseInfo`, `PhaseLeaderboardResponse` types
- Add `getPhaseLeaderboard()` endpoint
- Create `usePhaseLeaderboard` hook
- Create `/phase-leaderboard` page or add as a tab on the leaderboard page

**Feature ideas:** Phase countdown timer, predicted vs actual phase points comparison, phase history tracking.

---

### 3. `GET /playoffs` -- Playoffs Bracket & Results

**Priority: MEDIUM** -- Full playoffs bracket data with matches, VODs, results, and prize info. Seasonal event that may not always be active.

**Live Response Structure:**
```ts
interface PlayoffPlayer {
  uuid: string;
  nickname: string;
  seasonEloRate: number;     // ELO at end of qualifying season
  seasonEloRank: number;
  seedNumber: number;        // 0-15 bracket seed position
  personalBest: Milliseconds;
}

interface PlayoffMatch {
  id: number;                // Match ID within bracket (1-16)
  name: string;              // e.g. "Grand Finals", "Semifinals", "Quarterfinals"
  nextMatchId: number | null;// Next match in bracket, null for finals
  maxRoundScore: number;     // Best-of-N (3 or 4)
  startTime: Timestamp;
  state: string;             // e.g. "DONE", "SCHEDULED", "LIVE"
  participants: Array<{
    player: number;          // Index into players array (seedNumber)
    roundScore: number;      // Rounds won
  }>;
  vod: string;               // YouTube VOD URL
}

interface PlayoffResult {
  player: number;            // Index into players array (seedNumber)
  place: number;             // Final placement (1, 2, 3, 4, 5, 9)
  prize: number;             // Prize money in dollars
}

interface PlayoffsResponse {
  data: {
    type: string;            // e.g. "alpha"
    players: PlayoffPlayer[];
    matches: PlayoffMatch[];
    results: PlayoffResult[];
    season: number;
  };
  next: number | null;       // Next playoffs ID
  prev: number | null;       // Previous playoffs ID
}

// Endpoint: GET /playoffs
// Returns: PlayoffsResponse
```

**Implementation needed:**
- Add all playoff types to `src/types/api.ts`
- Add `getPlayoffs()` endpoint (possibly with `?id=N` for historical playoffs)
- Create `usePlayoffs` hook
- Create `/playoffs` page with bracket visualization

**Feature ideas:** Interactive bracket display, match VOD links, prize pool display, historical playoffs navigation via `next`/`prev`.

---

## Existing Endpoint Issues & Type Mismatches

### 4. `VersusStats` Type -- NEEDS COMPLETE REWRITE

**Current type (WRONG):**
```ts
export interface VersusStats {
  player1: UserProfile;
  player2: UserProfile;
  player1Wins: number;
  player2Wins: number;
  totalMatches: number;
  recentMatches: MatchInfo[];
}
```

**Actual API response:**
```ts
export interface VersusStats {
  players: [UserProfile, UserProfile];  // Array of 2 players, NOT player1/player2
  results: {
    ranked: {
      total: number;
      [uuid: string]: number;          // Dynamic keys: each player's UUID -> win count
    };
    casual: {
      total: number;
      [uuid: string]: number;
    };
  };
  changes: {
    [uuid: string]: number;            // Net ELO change from head-to-head
  };
}
```

**Key differences:**
- Players are in an array, not named `player1`/`player2`
- Results are split by ranked/casual with dynamic UUID keys
- There's no `recentMatches` field
- There's a `changes` field showing net ELO impact
- Win counts use player UUIDs as dynamic keys

---

### 5. Weekly Race Seed -- Field Name Mismatch

**Current type:**
```ts
seed: {
  overworld: string;
  nether: string;
  the_end: string;  // <-- underscore
  rng: string;
}
```

**Actual API response:**
```ts
seed: {
  overworld: string;
  nether: string;
  theEnd: string;   // <-- camelCase, NOT "the_end"
  rng: string;
  flags: null;      // <-- NEW nullable field, not in current types
}
```

---

### 6. Weekly Race Leaderboard -- Field Name Mismatch

**Current type uses:** `replayExists: boolean`
**Actual API returns:** `replayExist: boolean` (no trailing "s")

---

### 7. `LiveMatch` Type -- Missing Fields

The `LiveMatch` type is mostly correct but the live match data includes timeline types not documented:
- `"projectelo.timeline.blind_travel"` -- Player started blind traveling
- `"projectelo.timeline.death"` -- Player died
- `"projectelo.timeline.forfeit"` -- Player forfeited

These are custom MCSR Ranked timeline events (not vanilla Minecraft advancements).

---

### 8. `MatchSeed` -- Additional Variation Patterns

The current variations are typed as `string[]` which is correct, but the actual format uses a colon-delimited naming scheme not documented:
- `"chest:structure:diamond"` -- Diamond in structure chest
- `"chest:structure:obsidian"` -- Obsidian in structure chest
- `"bastion:triple:2"` -- Triple chests in bastion
- `"bastion:biome:CRIMSON_FOREST"` -- Bastion biome type
- `"fortress:biome:NETHER_WASTES"` -- Fortress biome type

The overworld types are also uppercased in responses: `"DESERT_TEMPLE"`, `"RUINED_PORTAL"`, `"VILLAGE"`, `"SHIPWRECK"`, `"BURIED_TREASURE"` -- not the mixed-case values documented.

---

### 9. Leaderboard `count` Parameter -- Ignored

The `count` query parameter on `GET /leaderboard` appears to be **ignored** by the API -- it always returns 150 entries regardless of the value passed. The `page` parameter should work for pagination. This affects `useLeaderboard` which accepts `count` as a param but it has no effect.

---

## Unused But Implemented

### 10. `getWeeklyRace()` -- Defined but No Hook/Page

The endpoint function exists in `endpoints.ts` but:
- No `useWeeklyRace` hook exists
- No `/weekly-race` page exists
- The `WeeklyRaceInfo` type exists in `types/api.ts`

**Action needed:** Create `useWeeklyRace` hook and a `/weekly-race` page.

---

### 11. `getLeaderboardWithSeason()` -- Defined but Unused

Returns the full `LeaderboardResponse` including season dates, but is not called by any hook. The `useLeaderboard` hook only calls `getLeaderboard()` which strips the season info.

**Action needed:** Either use this in the leaderboard page to show season info (start/end dates, season number) or remove it.

---

## Implementation Priority Ranking

| Priority | Item | Type | Effort |
|----------|------|------|--------|
| **P0** | Fix `VersusStats` type mismatch | Bug fix | Small |
| **P0** | Fix weekly race `theEnd` field name | Bug fix | Tiny |
| **P0** | Fix weekly race `replayExist` field name | Bug fix | Tiny |
| **P1** | Record Leaderboard (`/record-leaderboard`) | New feature | Medium |
| **P1** | Phase Leaderboard (`/phase-leaderboard`) | New feature | Medium |
| **P1** | Weekly Race page + hook | New feature | Medium |
| **P2** | Playoffs bracket (`/playoffs`) | New feature | Large |
| **P2** | Use `getLeaderboardWithSeason()` for season info display | Enhancement | Small |
| **P3** | Document variation naming scheme | Documentation | Tiny |
| **P3** | Document custom timeline event types | Documentation | Tiny |

---

## New Pages to Build

| Route | Description | API Endpoint |
|-------|-------------|-------------|
| `/record-leaderboard` | Fastest completion times ever | `GET /record-leaderboard` |
| `/phase-leaderboard` | Current phase standings | `GET /phase-leaderboard` |
| `/weekly-race` | Current weekly race + leaderboard | `GET /weekly-race` |
| `/playoffs` | Playoffs bracket visualization | `GET /playoffs` |

---

## Seed Variation Format Reference

Actual format observed from live API (colon-delimited):
```
chest:structure:diamond
chest:structure:obsidian
chest:structure:looting_sword
chest:structure:golden_apple
chest:structure:enchanted_golden_apple
bastion:triple:2
bastion:biome:CRIMSON_FOREST
bastion:biome:SOUL_SAND_VALLEY
fortress:biome:NETHER_WASTES
fortress:biome:CRIMSON_FOREST
```

---

## Timeline Event Types Reference

### Vanilla Advancements (used in match timelines)
```
story.root
story.mine_stone
story.mine_diamond
story.smelt_iron
story.lava_bucket
story.form_obsidian
story.enter_the_nether
story.follow_ender_eye
story.enter_the_end
nether.root
nether.find_bastion
nether.distract_piglin
nether.loot_bastion
nether.obtain_crying_obsidian
nether.find_fortress
adventure.root
adventure.kill_a_mob
husbandry.root
```

### Custom MCSR Ranked Events
```
projectelo.timeline.blind_travel
projectelo.timeline.death
projectelo.timeline.forfeit
```
