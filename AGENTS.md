# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

MCSR Ranked Companion is a Next.js 16 + React 18 + TypeScript application that provides statistics, leaderboards, and live match viewing for MCSR (Minecraft Speedrun) Ranked players.

## Common Commands

### Development
```bash
npm run dev           # Start development server on http://localhost:3000
npm run build         # Build for production (runs type-check automatically)
npm start             # Start production server
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript compiler without emitting files
```

### Release Checks

```bash
npm audit --omit=dev
npm run type-check
npm run build
```

For desktop releases, also run `npm run tauri:build` on each target platform.

## Architecture Overview

### API Integration Pattern

The app uses a layered API integration approach:

1. **API Client** ([src/lib/api/client.ts](src/lib/api/client.ts))
   - Axios-based client with interceptors for logging and error handling
   - Custom `McsrApiError` class for structured error handling
   - Handles both wrapped `{status, data}` and direct API responses
   - Base URL defaults to `https://api.mcsrranked.com` and is configurable via `NEXT_PUBLIC_MCSR_API_BASE_URL`
   - User-provided private keys are attached with the `Private-Key` header

2. **Endpoints** ([src/lib/api/endpoints.ts](src/lib/api/endpoints.ts))
   - Type-safe wrapper functions for all API endpoints
   - All endpoints return properly typed data

3. **React Query Hooks** ([src/lib/api/hooks/](src/lib/api/hooks/))
   - One hook file per feature area (usePlayer, useLeaderboard, useLiveMatches, etc.)
   - Each hook file exports query keys for cache management
   - Standard pattern: `queryKey`, `queryFn`, `staleTime`, `enabled` condition
   - Example structure:
     ```ts
     export const playerKeys = {
       all: ['player'] as const,
       profile: (user: string) => [...playerKeys.all, 'profile', user] as const,
     };

     export function usePlayer(username: string, options?) {
       return useQuery<UserInfo, McsrApiError>({
         queryKey: playerKeys.profile(username),
         queryFn: () => getUser(username),
         staleTime: 2 * 60 * 1000,
         enabled: !!username,
         ...options,
       });
     }
     ```

### Type System

All API types are defined in [src/types/api.ts](src/types/api.ts) to match the MCSR Ranked API specification exactly:

- **Important**: API uses specific field names that differ from conventional naming:
  - `loses` (not `losses`)
  - `phasePoint` (not `phasePoints`)
  - `point` (not `points`)
  - `overworld`/`nether` (not `overworldType`/`bastionType`)
  - `endTowers` (not `endTowerHeights`)
  - `type` for timeline events (not `event`)

- **Response variations**: Some API responses have nullable/conditional fields:
  - Match results can have `{uuid: null, time: number}` for forfeits
  - Ranks can be `{season: null, allTime: null}`
  - VOD field is an array of `VodInfo` objects, not a string

### State Management

- **TanStack Query**: Primary state management for all server data
  - Configured in [src/components/providers.tsx](src/components/providers.tsx)
  - Default staleTime: 60s, gcTime: 5min
  - Retry logic: 3 attempts with exponential backoff
  - React Query Devtools included in development

- **Zustand**: Available for client-side UI state (if needed)

- **next-themes**: Theme management (default dark mode)

### Component Organization

```
src/components/
├── ui/              # Base UI components (Button, Card, Avatar, etc.)
├── features/        # Feature-specific components (LeaderboardTable, MatchCard, etc.)
└── providers.tsx    # QueryClientProvider + ThemeProvider setup
```

### Path Aliases

Use `@/` for all imports from the src directory:
```ts
import { UserInfo } from '@/types/api';
import { getUser } from '@/lib/api/endpoints';
```

### Image Handling

Next.js Image component is configured for:
- Minecraft avatars: `crafatar.com/avatars/**` and `crafatar.com/renders/**`
- Country flags: `flagcdn.com/**`
- Optimized formats: AVIF and WebP

## API Documentation

Full API documentation is available in [MCSR_Ranked_API_Documentation.md](MCSR_Ranked_API_Documentation.md). Key endpoints:

- `/users/{user}` - Player profile and statistics
- `/users/{user}/matches` - Match history with pagination
- `/leaderboard` - Global leaderboard
- `/live` - Currently active matches
- `/matches/{id}` - Detailed match information with timelines and VODs

## Development Notes

### When Adding New API Features

1. Add types to [src/types/api.ts](src/types/api.ts) matching the exact API response structure
2. Add endpoint function to [src/lib/api/endpoints.ts](src/lib/api/endpoints.ts)
3. Create or update hook in [src/lib/api/hooks/](src/lib/api/hooks/) with query keys
4. Use the hook in components with proper error handling

### TypeScript Configuration

- Strict mode enabled
- Path alias `@/*` maps to `./src/*`
- Target: ES2020
- Module resolution: bundler

### Next.js Configuration

- App Router (not Pages Router)
- Output: standalone (for Docker/Tauri compatibility)
- React Strict Mode enabled
- React 19 compiler disabled (waiting for stable release)
