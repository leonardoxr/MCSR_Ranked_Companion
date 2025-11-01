# MCSR Ranked Companion App - Implementation Plan

> **A Complete Guide to Building a Cross-Platform MCSR Ranked Statistics Tracker**
>
> Stack: Next.js 15 + TypeScript + Capacitor + Tauri
> Target Platforms: Web, iOS, Android, Windows, macOS, Linux

**Last Updated**: 2025-11-01
**Status**: Phase 3 Complete - Web App MVP Ready
**Difficulty**: Intermediate to Advanced
**Estimated Timeline**: 4-6 weeks for MVP (Phases 1-3 Complete)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack Breakdown](#tech-stack-breakdown)
3. [Architecture & Design Philosophy](#architecture--design-philosophy)
4. [Development Environment Setup](#development-environment-setup)
5. [Project Structure](#project-structure)
6. [Phase 1: Core Web App (Next.js)](#phase-1-core-web-app-nextjs)
7. [Phase 2: API Integration Layer](#phase-2-api-integration-layer)
8. [Phase 3: Feature Implementation](#phase-3-feature-implementation)
9. [Phase 4: Mobile App (Capacitor)](#phase-4-mobile-app-capacitor)
10. [Phase 5: Desktop App (Tauri)](#phase-5-desktop-app-tauri)
11. [Phase 6: Polish & Optimization](#phase-6-polish--optimization)
12. [Deployment Strategy](#deployment-strategy)
13. [Testing Strategy](#testing-strategy)
14. [Future Enhancements](#future-enhancements)

---

## Project Overview

### What We're Building

A gorgeous, fast, and feature-rich companion app for MCSR Ranked players that provides:

**Core Features**:
- Real-time player statistics and ELO tracking
- Beautiful match history with detailed breakdowns
- Interactive leaderboards with filters
- Head-to-head player comparisons
- Live match viewer
- Weekly race tracking
- Achievement showcase with progress tracking
- Seed analysis and statistics
- Visual pace tracking (LiveSplit-style)
- Offline-first data caching
- Dark mode and Minecraft-themed UI

**Why This Stack?**:
- **Next.js 15**: Latest features, App Router, Server Components, excellent DX
- **TypeScript**: Type safety for API responses and state management
- **Capacitor**: Near-native mobile experience with 95% code reuse
- **Tauri**: Lightweight desktop apps (3-5MB vs 100MB+ Electron)
- **One Codebase**: Write once, deploy everywhere

### Target Audience

- MCSR Ranked players who want detailed stats
- Speedrun enthusiasts tracking their progression
- Competitive players analyzing their performance
- Coaches and teams reviewing player data
- Community members following top players

---

## Tech Stack Breakdown

### Core Technologies

```yaml
Frontend Framework:
  - Next.js 15 (App Router)
  - React 19
  - TypeScript 5.3+

Styling:
  - Tailwind CSS 4.0 (for utility-first styling)
  - shadcn/ui (for beautiful, accessible components)
  - Framer Motion (for smooth animations)
  - Recharts (for data visualization)

State Management:
  - Zustand (lightweight, simple)
  - TanStack Query (formerly React Query) for server state
  - Local Storage API for persistence

Mobile Wrapper:
  - Capacitor 6 (for iOS & Android)
  - Capacitor Plugins: Storage, Share, StatusBar, SplashScreen

Desktop Wrapper:
  - Tauri 2.0 (for Windows, macOS, Linux)
  - Rust backend for native features

Data & APIs:
  - MCSR Ranked REST API
  - SWR or TanStack Query for caching
  - Axios for HTTP requests

Development Tools:
  - ESLint + Prettier (code quality)
  - Husky (git hooks)
  - Vitest (unit testing)
  - Playwright (E2E testing)
```

### Why These Choices?

**Next.js 15 App Router**:
- Server Components reduce bundle size
- Built-in caching and revalidation
- API routes for serverless functions
- Image optimization out of the box
- Perfect for SEO (player profile pages)

**Tailwind CSS + shadcn/ui**:
- Rapid UI development
- Consistent design system
- Accessible components by default
- Easy theming (Minecraft aesthetic!)
- Small bundle size

**TanStack Query**:
- Perfect for MCSR API caching
- Automatic background refetching
- Optimistic updates
- Request deduplication
- Offline support

**Capacitor over React Native**:
- Same web code works on mobile
- Easy to add native features
- Smaller learning curve
- Better web performance
- Access to web ecosystem

**Tauri over Electron**:
- 10-20x smaller app size
- Uses system WebView (not bundling Chromium)
- Rust backend = blazing fast
- Better security model
- Native feel on each platform

---

## Architecture & Design Philosophy

### Design Principles

1. **Offline First**: Cache everything, work without internet
2. **Performance First**: Sub-second page loads, 60fps animations
3. **Mobile First**: Design for small screens, scale up
4. **Accessible**: WCAG 2.1 AA compliance
5. **Fun**: Minecraft aesthetic with smooth animations

### Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│  (Next.js Pages/Components - Shared Across Platforms)│
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   State Management                   │
│     (Zustand Stores + TanStack Query Cache)         │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                 API Integration Layer                │
│   (Type-safe API client + Response normalization)   │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              MCSR Ranked REST API                    │
│        (https://api.mcsrranked.com/)                 │
└─────────────────────────────────────────────────────┘

Platform Wrappers:
┌───────────┐  ┌───────────┐  ┌───────────┐
│    Web    │  │  Mobile   │  │  Desktop  │
│ (Next.js) │  │(Capacitor)│  │  (Tauri)  │
└───────────┘  └───────────┘  └───────────┘
```

### Data Flow Pattern

```typescript
// Example: Fetching player data

User Action
    ↓
Component calls hook (usePlayer)
    ↓
TanStack Query checks cache
    ↓
If stale, calls API client
    ↓
API client adds type safety
    ↓
Fetches from MCSR API
    ↓
Normalizes response
    ↓
Updates cache
    ↓
Component re-renders
    ↓
Smooth transition with Framer Motion
```

---

## Development Environment Setup

### Prerequisites

```bash
# Required
- Node.js 20+ (LTS)
- npm or pnpm (I prefer pnpm for speed)
- Git
- VS Code (or your favorite editor)

# For Mobile (optional initially)
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

# For Desktop (optional initially)
- Rust toolchain (for Tauri)
- System dependencies per OS
```

### Initial Setup Steps

```bash
# 1. Create Next.js project with TypeScript
npx create-next-app@latest mcsr-companion --typescript --tailwind --app --use-pnpm

# Navigate to project
cd mcsr-companion

# 2. Install core dependencies
pnpm add @tanstack/react-query zustand axios date-fns
pnpm add framer-motion recharts lucide-react
pnpm add @radix-ui/react-* (for shadcn/ui components)

# 3. Install dev dependencies
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D eslint prettier eslint-config-prettier
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# 4. Initialize shadcn/ui
npx shadcn-ui@latest init

# 5. Setup git hooks
pnpm add -D husky lint-staged
npx husky init
```

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "csstools.postcss",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Environment Variables

Create `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_MCSR_API_BASE_URL=https://api.mcsrranked.com
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Sentry (error tracking)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Cache Configuration
NEXT_PUBLIC_CACHE_TTL=300000  # 5 minutes in ms
NEXT_PUBLIC_STALE_TIME=60000  # 1 minute

# Feature Flags
NEXT_PUBLIC_ENABLE_LIVE_MATCHES=true
NEXT_PUBLIC_ENABLE_WEEKLY_RACES=true
```

---

## Project Structure

### Folder Organization

```
mcsr-companion/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (root)/                   # Root layout group
│   │   │   ├── page.tsx              # Home page
│   │   │   └── layout.tsx            # Root layout
│   │   ├── player/
│   │   │   └── [username]/
│   │   │       ├── page.tsx          # Player profile
│   │   │       ├── matches/          # Match history
│   │   │       └── achievements/     # Achievements
│   │   ├── leaderboard/
│   │   │   └── page.tsx              # Leaderboard
│   │   ├── match/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Match details
│   │   ├── versus/
│   │   │   └── [player1]/[player2]/
│   │   │       └── page.tsx          # Head-to-head
│   │   ├── live/
│   │   │   └── page.tsx              # Live matches
│   │   ├── weekly-races/
│   │   │   └── page.tsx              # Weekly races
│   │   └── api/                      # API routes (if needed)
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── player/                   # Player-specific components
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── PlayerAvatar.tsx
│   │   │   ├── StatsDisplay.tsx
│   │   │   └── EloChart.tsx
│   │   ├── match/                    # Match components
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchTimeline.tsx
│   │   │   ├── SeedInfo.tsx
│   │   │   └── PaceComparison.tsx
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardTable.tsx
│   │   │   └── RankBadge.tsx
│   │   ├── common/                   # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── visualizations/           # Charts & graphs
│   │       ├── EloProgressionChart.tsx
│   │       ├── WinLossPieChart.tsx
│   │       ├── PerformanceHeatmap.tsx
│   │       └── PaceTimeline.tsx
│   │
│   ├── lib/                          # Utilities & helpers
│   │   ├── api/                      # API client
│   │   │   ├── client.ts             # Axios instance
│   │   │   ├── endpoints.ts          # API endpoints
│   │   │   ├── types.ts              # API response types
│   │   │   └── hooks/                # React Query hooks
│   │   │       ├── usePlayer.ts
│   │   │       ├── useMatches.ts
│   │   │       ├── useLeaderboard.ts
│   │   │       └── useLiveMatches.ts
│   │   ├── stores/                   # Zustand stores
│   │   │   ├── userStore.ts          # User preferences
│   │   │   ├── searchStore.ts        # Search history
│   │   │   └── favoritesStore.ts     # Favorite players
│   │   ├── utils/                    # Utility functions
│   │   │   ├── formatters.ts         # Date, time, number formatting
│   │   │   ├── validators.ts         # Input validation
│   │   │   ├── time.ts               # Time conversion utilities
│   │   │   ├── colors.ts             # Color utilities (ranks, etc.)
│   │   │   └── constants.ts          # App constants
│   │   └── hooks/                    # Custom React hooks
│   │       ├── useDebounce.ts
│   │       ├── useLocalStorage.ts
│   │       ├── useMediaQuery.ts
│   │       └── useIntersectionObserver.ts
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css               # Tailwind + custom CSS
│   │   └── themes/                   # Theme definitions
│   │       ├── minecraft.css
│   │       └── variables.css
│   │
│   └── types/                        # TypeScript types
│       ├── api.ts                    # API types (generated from docs)
│       ├── components.ts             # Component prop types
│       └── global.d.ts               # Global type declarations
│
├── public/                           # Static assets
│   ├── icons/                        # App icons
│   ├── images/                       # Images
│   │   ├── achievements/
│   │   ├── ranks/
│   │   └── textures/                 # Minecraft textures
│   └── fonts/                        # Custom fonts
│       └── Minecraft.ttf
│
├── mobile/                           # Capacitor mobile app
│   ├── android/                      # Android project
│   ├── ios/                          # iOS project
│   └── capacitor.config.ts           # Capacitor configuration
│
├── desktop/                          # Tauri desktop app
│   ├── src-tauri/                    # Rust backend
│   │   ├── src/
│   │   │   └── main.rs
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   └── icons/                        # Desktop app icons
│
├── tests/                            # Tests
│   ├── unit/                         # Unit tests
│   ├── integration/                  # Integration tests
│   └── e2e/                          # End-to-end tests
│
├── .github/                          # GitHub Actions
│   └── workflows/
│       ├── ci.yml                    # CI pipeline
│       └── deploy.yml                # Deployment
│
├── docs/                             # Documentation
│   ├── API.md                        # API documentation
│   ├── CONTRIBUTING.md
│   └── CHANGELOG.md
│
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
├── pnpm-lock.yaml
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## Phase 1: Core Web App (Next.js)

### Step 1.1: Project Configuration

**Goal**: Set up Next.js with optimal configuration for performance and DX.

**next.config.js**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React 19 features
  experimental: {
    reactCompiler: true,
    ppr: true, // Partial Prerendering
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crafatar.com',
        pathname: '/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'crafatar.com',
        pathname: '/renders/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Output standalone for Docker/Tauri
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Strict mode
  reactStrictMode: true,

  // Enable SWC minification
  swcMinify: true,

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
};

module.exports = nextConfig;
```

**tailwind.config.ts**:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Minecraft-inspired color palette
        minecraft: {
          grass: '#7cbd56',
          dirt: '#8b6d47',
          stone: '#7d7d7d',
          diamond: '#4fc3f7',
          emerald: '#2ecc71',
          gold: '#f4d03f',
          redstone: '#e74c3c',
          netherrack: '#8b3a3a',
          endstone: '#e3e8a0',
          obsidian: '#1a1a2e',
        },
        // Rank colors
        rank: {
          coal: '#3d3d3d',
          iron: '#d8d8d8',
          gold: '#f4d03f',
          emerald: '#2ecc71',
          diamond: '#4fc3f7',
          netherite: '#8b4789',
        },
        // Pace colors
        pace: {
          ahead: 'rgba(128, 255, 128, 1)',
          behind: 'rgba(255, 128, 128, 1)',
          even: 'rgba(255, 255, 255, 0.8)',
        },
      },
      fontFamily: {
        minecraft: ['Minecraft', 'monospace'],
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'walk': 'walk 0.4s steps(2, end) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        walk: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      imageRendering: {
        'pixelated': 'pixelated',
        'crisp-edges': 'crisp-edges',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

### Step 1.2: Layout & Navigation

**src/app/layout.tsx**:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/common/Header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'MCSR Ranked Companion',
    template: '%s | MCSR Ranked Companion',
  },
  description: 'Track your Minecraft Speedrun Ranked statistics, matches, and performance',
  keywords: ['minecraft', 'speedrun', 'mcsr', 'ranked', 'statistics'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'MCSR Ranked Companion',
    description: 'Track your Minecraft Speedrun Ranked statistics',
    siteName: 'MCSR Ranked Companion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCSR Ranked Companion',
    description: 'Track your Minecraft Speedrun Ranked statistics',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, 'font-sans antialiased')}>
        <Providers>
          <div className="relative min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

**src/components/providers.tsx**:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## Phase 2: API Integration Layer

### Step 2.1: Type Definitions

**src/types/api.ts**:

```typescript
// ============================================================================
// MCSR Ranked API Type Definitions
// Auto-generated from API documentation
// ============================================================================

/**
 * User's UUID format (32 hex characters without dashes)
 */
export type UUID = string;

/**
 * Unix timestamp in seconds
 */
export type Timestamp = number;

/**
 * Time duration in milliseconds
 */
export type Milliseconds = number;

/**
 * ISO 3166-1 alpha-2 country code
 */
export type CountryCode = string;

/**
 * ELO rating (0-65535)
 */
export type EloRate = number;

/**
 * Rank position (1-based)
 */
export type Rank = number;

/**
 * Match type identifier
 */
export enum MatchType {
  Casual = 1,
  Ranked = 2,
  Private = 3,
  Event = 4,
}

/**
 * Supporter tier level
 */
export enum RoleType {
  None = 0,
  Stone = 1,
  Iron = 2,
  Diamond = 3,
}

/**
 * User profile information
 */
export interface UserProfile {
  uuid: UUID;
  nickname: string;
  roleType: RoleType;
  eloRate: EloRate | null;
  eloRank: Rank | null;
  country: CountryCode | null;
}

/**
 * Match seed characteristics
 */
export interface MatchSeed {
  id: string | number;
  overworldType: string;
  bastionType: 'housing' | 'treasure' | 'bridge' | 'stables';
  endTowerHeights: [number, number, number, number];
  variations: string[];
}

/**
 * Match result information
 */
export interface MatchResult {
  uuid: UUID;
  time: Milliseconds;
}

/**
 * ELO change for a player
 */
export interface EloChange {
  uuid: UUID;
  change: number;
  eloRate: EloRate;
}

/**
 * Match rank information
 */
export interface MatchRank {
  season: number;
  allTime: number;
}

/**
 * Timeline event in a match
 */
export interface TimelineEvent {
  event: string;
  time: Milliseconds;
  uuid?: UUID;
}

/**
 * Completion data
 */
export interface Completion {
  uuid: UUID;
  time: Milliseconds;
}

/**
 * Comprehensive match information
 */
export interface MatchInfo {
  id: string;
  type: MatchType;
  season: number;
  category: string;
  date: Timestamp;
  players: UserProfile[];
  spectators: UserProfile[];
  result: MatchResult;
  forfeited: boolean;
  decayed: boolean;
  rank: MatchRank;
  changes: EloChange[];
  seed: MatchSeed;
  // Advanced fields (only in /matches/{id})
  completions?: Completion[];
  timelines?: TimelineEvent[];
  replayExist?: boolean;
  vod?: string | null;
}

/**
 * User statistics for a specific mode
 */
export interface UserStats {
  bestTime: Milliseconds | null;
  highestWinStreak: number;
  currentWinStreak: number;
  playedMatches: number;
  playtime: Milliseconds;
  completionTime: Milliseconds;
  forfeits: number;
  completions: number;
  wins: number;
  losses: number;
}

/**
 * Complete user statistics structure
 */
export interface UserStatistics {
  season: {
    ranked: UserStats;
    casual: UserStats;
  };
  total: {
    ranked: UserStats;
    casual: UserStats;
  };
}

/**
 * Achievement data
 */
export interface Achievement {
  id: number;
  date: Timestamp;
  data: string[];
  level: number;
  value: number | null;
  goal: number | null;
}

/**
 * Social platform connection
 */
export interface SocialConnection {
  id: string;
  name: string;
}

/**
 * User connections (social platforms)
 */
export interface UserConnections {
  discord: SocialConnection | null;
  twitch: SocialConnection | null;
  youtube: SocialConnection | null;
}

/**
 * Season result information
 */
export interface SeasonResult {
  last: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoints: number;
  };
  highest: EloRate;
  lowest: EloRate;
  phaseInfos: Array<{
    phase: number;
    points: number;
    rank: Rank;
  }>;
}

/**
 * Extended user information
 */
export interface UserInfo extends UserProfile {
  firstOnline: Timestamp;
  lastOnline: Timestamp;
  lastRanked: Timestamp;
  nextDecay: Timestamp | null;
  statistics: UserStatistics;
  connections: UserConnections;
  achievements: {
    display: Achievement[];
    total: Achievement[];
  };
  seasonResult: SeasonResult | null;
}

/**
 * Leaderboard user entry
 */
export interface LeaderboardUser extends UserProfile {
  seasonResult: {
    eloRate: EloRate;
    eloRank: Rank;
    phasePoints: number;
  };
}

/**
 * Weekly race information
 */
export interface WeeklyRaceInfo {
  id: number;
  seed: {
    overworld: string;
    nether: string;
    the_end: string;
    rng: string;
  };
  endsAt: Timestamp;
  leaderboard: Array<{
    rank: number;
    player: UserProfile;
    time: Milliseconds;
    replayExists: boolean;
  }>;
}

/**
 * Head-to-head statistics
 */
export interface VersusStats {
  player1: UserProfile;
  player2: UserProfile;
  player1Wins: number;
  player2Wins: number;
  totalMatches: number;
  recentMatches: MatchInfo[];
}

/**
 * Live match data
 */
export interface LiveMatch {
  id: string;
  players: UserProfile[];
  spectators: UserProfile[];
  type: MatchType;
  category: string;
  seed: MatchSeed;
  startTime: Timestamp;
}

/**
 * API Error response
 */
export interface ApiError {
  error: string;
  status: number;
  timestamp?: Timestamp;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  count?: number;
}

/**
 * Match filter parameters
 */
export interface MatchFilterParams extends PaginationParams {
  filter?: MatchType;
  type?: MatchType;
  season?: number;
}
```

### Step 2.2: API Client

**src/lib/api/client.ts**:

```typescript
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_MCSR_API_BASE_URL || 'https://api.mcsrranked.com';

/**
 * Custom error class for API errors
 */
export class McsrApiError extends Error {
  constructor(
    public status: number,
    public data: ApiError,
    public originalError?: AxiosError
  ) {
    super(data.error || 'An unknown error occurred');
    this.name = 'McsrApiError';
  }
}

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add API key if available
      const apiKey = process.env.NEXT_PUBLIC_MCSR_API_KEY;
      if (apiKey) {
        config.headers['X-API-Key'] = apiKey;
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // Server responded with error status
        const apiError: ApiError = {
          error: error.response.data?.error || error.message,
          status: error.response.status,
          timestamp: Date.now(),
        };

        throw new McsrApiError(error.response.status, apiError, error);
      } else if (error.request) {
        // Request made but no response
        throw new McsrApiError(0, {
          error: 'No response from server. Please check your connection.',
          status: 0,
        });
      } else {
        // Error setting up request
        throw new McsrApiError(0, {
          error: error.message,
          status: 0,
        });
      }
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * Helper function for GET requests
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * Helper function for POST requests
 */
export async function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}
```

**src/lib/api/endpoints.ts**:

```typescript
import { get } from './client';
import type {
  UserInfo,
  MatchInfo,
  Achievement,
  LeaderboardUser,
  VersusStats,
  LiveMatch,
  WeeklyRaceInfo,
  MatchFilterParams,
  PaginationParams,
} from '@/types/api';

/**
 * User identification type
 * Can be UUID, nickname, or Discord ID
 */
export type UserIdentifier = string;

/**
 * Format UUID (add or remove dashes)
 */
export function formatUuid(uuid: string, withDashes: boolean = false): string {
  const clean = uuid.replace(/-/g, '');

  if (withDashes && clean.length === 32) {
    return clean.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      '$1-$2-$3-$4-$5'
    );
  }

  return clean;
}

// ============================================================================
// User Endpoints
// ============================================================================

/**
 * Get user profile with full statistics
 * @param user - UUID, nickname, or Discord ID
 */
export async function getUser(user: UserIdentifier): Promise<UserInfo> {
  return get<UserInfo>(`/users/${user}`);
}

/**
 * Get user match history
 * @param user - UUID, nickname, or Discord ID
 * @param params - Filter and pagination parameters
 */
export async function getUserMatches(
  user: UserIdentifier,
  params?: MatchFilterParams
): Promise<MatchInfo[]> {
  return get<MatchInfo[]>(`/users/${user}/matches`, { params });
}

/**
 * Get user achievements
 * @param user - UUID, nickname, or Discord ID
 */
export async function getUserAchievements(user: UserIdentifier): Promise<Achievement[]> {
  return get<Achievement[]>(`/users/${user}/achievements`);
}

// ============================================================================
// Match Endpoints
// ============================================================================

/**
 * Get all matches with optional filters
 * @param params - Filter and pagination parameters
 */
export async function getMatches(params?: MatchFilterParams): Promise<MatchInfo[]> {
  return get<MatchInfo[]>('/matches', { params });
}

/**
 * Get detailed match information
 * @param matchId - Match identifier
 */
export async function getMatch(matchId: string): Promise<MatchInfo> {
  return get<MatchInfo>(`/matches/${matchId}`);
}

// ============================================================================
// Leaderboard Endpoints
// ============================================================================

/**
 * Get global leaderboard
 * @param params - Pagination parameters and optional season filter
 */
export async function getLeaderboard(
  params?: PaginationParams & { season?: number }
): Promise<LeaderboardUser[]> {
  return get<LeaderboardUser[]>('/leaderboard', { params });
}

// ============================================================================
// Versus Endpoints
// ============================================================================

/**
 * Get head-to-head statistics between two players
 * @param user1 - First player identifier
 * @param user2 - Second player identifier
 */
export async function getVersusStats(
  user1: UserIdentifier,
  user2: UserIdentifier
): Promise<VersusStats> {
  return get<VersusStats>(`/versus/${user1}/${user2}`);
}

/**
 * Get match history between two players
 * @param user1 - First player identifier
 * @param user2 - Second player identifier
 * @param params - Filter and pagination parameters
 */
export async function getVersusMatches(
  user1: UserIdentifier,
  user2: UserIdentifier,
  params?: MatchFilterParams
): Promise<MatchInfo[]> {
  return get<MatchInfo[]>(`/versus/${user1}/${user2}/matches`, { params });
}

// ============================================================================
// Live Match Endpoints
// ============================================================================

/**
 * Get currently active matches
 */
export async function getLiveMatches(): Promise<LiveMatch[]> {
  return get<LiveMatch[]>('/live');
}

// ============================================================================
// Weekly Race Endpoints
// ============================================================================

/**
 * Get weekly race information
 * @param params - Optional week and season filters
 */
export async function getWeeklyRace(params?: {
  week?: number;
  season?: number;
}): Promise<WeeklyRaceInfo> {
  return get<WeeklyRaceInfo>('/weekly-race', { params });
}
```

### Step 2.3: React Query Hooks

**src/lib/api/hooks/usePlayer.ts**:

```typescript
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
```

**src/lib/api/hooks/useLeaderboard.ts**:

```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getLeaderboard } from '../endpoints';
import type { LeaderboardUser, PaginationParams } from '@/types/api';
import type { McsrApiError } from '../client';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (params?: PaginationParams & { season?: number }) =>
    [...leaderboardKeys.all, 'list', params] as const,
};

export function useLeaderboard(
  params?: PaginationParams & { season?: number },
  options?: Omit<UseQueryOptions<LeaderboardUser[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LeaderboardUser[], McsrApiError>({
    queryKey: leaderboardKeys.list(params),
    queryFn: () => getLeaderboard(params),
    staleTime: 30 * 1000, // 30 seconds (leaderboard updates frequently)
    ...options,
  });
}
```

**src/lib/api/hooks/useLiveMatches.ts**:

```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getLiveMatches } from '../endpoints';
import type { LiveMatch } from '@/types/api';
import type { McsrApiError } from '../client';

export const liveMatchKeys = {
  all: ['liveMatches'] as const,
  list: () => [...liveMatchKeys.all, 'list'] as const,
};

export function useLiveMatches(
  options?: Omit<UseQueryOptions<LiveMatch[], McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LiveMatch[], McsrApiError>({
    queryKey: liveMatchKeys.list(),
    queryFn: getLiveMatches,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options,
  });
}
```

---

## Phase 3: Feature Implementation ✅ COMPLETE

**Status**: All core pages and features implemented and production-ready.

**Completed Deliverables**:
- ✅ All utility functions (formatters, colors, validators)
- ✅ Complete UI component library
- ✅ All main application pages
- ✅ Full React Query integration
- ✅ TypeScript type safety throughout
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Error handling and loading states
- ✅ Production build passing

### Implemented Pages

#### 1. Player Profile Page (`/player/[username]`)
**Location**: `src/app/player/[username]/page.tsx`

**Features**:
- Comprehensive player statistics (season and all-time)
- ELO progression chart with rank tier indicators
- Win rate visualization
- Achievement showcase with progress tracking
- Match history with detailed cards (20 most recent)
- Performance metrics (best time, completion time, playtime)
- Last online status and activity tracking
- Responsive grid layout for statistics

**Integration**:
- `usePlayer` - Player profile data
- `usePlayerMatches` - Match history with filters
- `usePlayerAchievements` - Achievement data

#### 2. Global Leaderboard (`/leaderboard`)
**Location**: `src/app/leaderboard/page.tsx`

**Features**:
- Global player rankings table (50 per page)
- Pagination with smooth scrolling
- Player search with instant navigation
- Stats summary (page range, player count, season)
- Rank badges with color coding
- Hover effects and responsive design
- Real-time rank positions

**Integration**:
- `useLeaderboard` - Paginated leaderboard data
- SearchBar component with controlled state

#### 3. Match Details Page (`/match/[id]`)
**Location**: `src/app/match/[id]/page.tsx`

**Features**:
- Complete match information display
- Winner statistics and completion time
- ELO changes visualization for all players
- Seed information (overworld, bastion, tower heights, variations)
- Match timeline with event markers (if available)
- Completion times for all players
- VOD links (if available)
- Match type and category badges
- Season and rank information
- Spectator list

**Integration**:
- `useMatch` - Detailed match data with timeline

#### 4. Live Matches Feed (`/live`)
**Location**: `src/app/live/page.tsx`

**Features**:
- Real-time feed of ongoing matches
- Auto-refresh every 30 seconds
- Live elapsed time counter (updates every second)
- Player information for each match
- Spectator count and match type indicators
- Animated live pulse indicators
- Seed information preview
- Click to navigate to player profiles
- Empty state when no matches active

**Integration**:
- `useLiveMatches` - Live match data with auto-refresh

#### 5. Head-to-Head Comparison (`/versus/[player1]/[player2]`)
**Location**: `src/app/versus/[player1]/[player2]/page.tsx`

**Features**:
- Win/loss statistics between two players
- Win rate comparison with visual display
- Side-by-side player profile cards
- Detailed stats comparison bars:
  - ELO rating comparison
  - Total wins comparison
  - Win streak comparison
  - Best time comparison (lower is better)
- Animated progress bars with color coding
- Recent head-to-head match history (10 matches)
- Responsive layout for mobile/desktop

**Integration**:
- `useVersusStats` - H2H statistics (new hook created)
- `useVersusMatches` - Match history between players (new hook)
- `usePlayer` - Individual player profiles

#### 6. Enhanced Home Page (`/`)
**Location**: `src/app/page.tsx`

**Features**:
- Hero section with gradient branding
- Player search functionality (navigates to profile)
- Quick navigation cards:
  - Leaderboard (with trophy icon)
  - Live Matches (with animated pulse)
  - Player Comparison (head-to-head)
- Feature showcase grid (6 features)
- Tech stack display
- Fully interactive routing
- Responsive card-based layout

### New Hooks Created

#### `useVersus` Hook
**Location**: `src/lib/api/hooks/useVersus.ts`

**Exports**:
- `useVersusStats` - Fetch head-to-head statistics
- `useVersusMatches` - Fetch match history between two players
- `versusKeys` - Query key factory for cache management

**Features**:
- Proper query key structure
- 2-minute stale time
- Automatic caching
- Enabled only when both players provided
- Type-safe error handling

### Step 3.1: Utility Functions

**src/lib/utils/formatters.ts**:

```typescript
import { format, formatDistanceToNow } from 'date-fns';
import type { Milliseconds, Timestamp } from '@/types/api';

/**
 * Convert milliseconds to formatted time string
 * @param ms - Time in milliseconds
 * @param suppressMs - Hide milliseconds
 * @returns Formatted time (e.g., "5:23.456" or "1:05:23")
 */
export function formatTime(ms: Milliseconds, suppressMs: boolean = false): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor(ms % 1000);

  const minutesPadded = String(minutes).padStart(2, '0');
  const secondsPadded = String(seconds).padStart(2, '0');
  const msPadded = String(milliseconds).padStart(3, '0');

  if (hours > 0) {
    return suppressMs
      ? `${hours}:${minutesPadded}:${secondsPadded}`
      : `${hours}:${minutesPadded}:${secondsPadded}.${msPadded}`;
  }

  return suppressMs
    ? `${minutes}:${secondsPadded}`
    : `${minutes}:${secondsPadded}.${msPadded}`;
}

/**
 * Format time difference with sign
 * @param ms - Time difference in milliseconds
 * @returns Formatted difference (e.g., "+1:23.456" or "-0:05.123")
 */
export function formatTimeDifference(ms: Milliseconds): string {
  const sign = ms >= 0 ? '+' : '-';
  const absTime = formatTime(Math.abs(ms));
  return `${sign}${absTime}`;
}

/**
 * Convert Unix timestamp to Date object
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return new Date(timestamp * 1000);
}

/**
 * Format timestamp as relative time
 * @param timestamp - Unix timestamp in seconds
 * @returns Relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: Timestamp): string {
  return formatDistanceToNow(timestampToDate(timestamp), { addSuffix: true });
}

/**
 * Format timestamp as absolute date
 */
export function formatDate(timestamp: Timestamp, formatStr: string = 'PPP'): string {
  return format(timestampToDate(timestamp), formatStr);
}

/**
 * Format ELO rating with commas
 */
export function formatElo(elo: number | null): string {
  if (elo === null) return 'Unranked';
  return elo.toLocaleString();
}

/**
 * Format rank with ordinal suffix
 */
export function formatRank(rank: number | null): string {
  if (rank === null) return 'Unranked';

  const j = rank % 10;
  const k = rank % 100;

  if (j === 1 && k !== 11) return `${rank}st`;
  if (j === 2 && k !== 12) return `${rank}nd`;
  if (j === 3 && k !== 13) return `${rank}rd`;
  return `${rank}th`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return (wins / total) * 100;
}
```

**src/lib/utils/colors.ts**:

```typescript
import type { EloRate } from '@/types/api';

/**
 * Rank tier definitions
 */
export interface RankTier {
  name: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    name: 'Coal',
    min: 0,
    max: 600,
    color: '#3d3d3d',
    bgColor: 'rgba(61, 61, 61, 0.1)',
  },
  {
    name: 'Iron',
    min: 601,
    max: 900,
    color: '#d8d8d8',
    bgColor: 'rgba(216, 216, 216, 0.1)',
  },
  {
    name: 'Gold',
    min: 901,
    max: 1200,
    color: '#f4d03f',
    bgColor: 'rgba(244, 208, 63, 0.1)',
  },
  {
    name: 'Emerald',
    min: 1201,
    max: 1500,
    color: '#2ecc71',
    bgColor: 'rgba(46, 204, 113, 0.1)',
  },
  {
    name: 'Diamond',
    min: 1501,
    max: 1800,
    color: '#4fc3f7',
    bgColor: 'rgba(79, 195, 247, 0.1)',
  },
  {
    name: 'Netherite',
    min: 1801,
    max: 99999,
    color: '#8b4789',
    bgColor: 'rgba(139, 71, 137, 0.1)',
  },
];

/**
 * Get rank tier for an ELO rating
 */
export function getRankTier(eloRate: EloRate | null): RankTier {
  if (eloRate === null) {
    return RANK_TIERS[0]; // Default to Coal
  }

  return (
    RANK_TIERS.find((tier) => eloRate >= tier.min && eloRate <= tier.max) ||
    RANK_TIERS[RANK_TIERS.length - 1]
  );
}

/**
 * Get color for ELO change
 */
export function getEloChangeColor(change: number): string {
  if (change > 0) return '#2ecc71'; // Green
  if (change < 0) return '#e74c3c'; // Red
  return '#95a5a6'; // Gray
}

/**
 * Get color for pace status
 */
export function getPaceColor(currentTime: number, pbTime: number): string {
  const diff = currentTime - pbTime;
  const threshold = 1000; // 1 second

  if (diff < -threshold) return 'rgba(128, 255, 128, 1)'; // Ahead (green)
  if (diff > threshold) return 'rgba(255, 128, 128, 1)'; // Behind (red)
  return 'rgba(255, 255, 255, 0.8)'; // Even (white)
}

/**
 * Match type colors
 */
export const MATCH_TYPE_COLORS = {
  1: '#95a5a6', // Casual - Gray
  2: '#e74c3c', // Ranked - Red
  3: '#9b59b6', // Private - Purple
  4: '#f39c12', // Event - Orange
} as const;
```

### Step 3.2: Core Components

**src/components/player/PlayerCard.tsx**:

```typescript
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlayerAvatar } from './PlayerAvatar';
import { RankBadge } from '@/components/leaderboard/RankBadge';
import { Badge } from '@/components/ui/badge';
import { formatElo, formatRank } from '@/lib/utils/formatters';
import type { UserInfo } from '@/types/api';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player: UserInfo;
  showStats?: boolean;
}

export function PlayerCard({ player, showStats = true }: PlayerCardProps) {
  const rankedStats = player.statistics.total.ranked;
  const winRate = rankedStats.wins + rankedStats.losses > 0
    ? (rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4">
          <PlayerAvatar uuid={player.uuid} nickname={player.nickname} size={64} />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{player.nickname}</h2>
              {player.country && (
                <img
                  src={`https://flagcdn.com/w40/${player.country.toLowerCase()}.png`}
                  alt={player.country}
                  className="h-4 w-auto"
                />
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <RankBadge eloRate={player.eloRate} />
              {player.eloRate !== null && (
                <>
                  <Badge variant="outline">{formatElo(player.eloRate)} ELO</Badge>
                  <Badge variant="outline">Rank {formatRank(player.eloRank)}</Badge>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {showStats && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem
                label="Wins"
                value={rankedStats.wins}
                color="text-green-500"
              />
              <StatItem
                label="Losses"
                value={rankedStats.losses}
                color="text-red-500"
              />
              <StatItem
                label="Win Rate"
                value={`${winRate.toFixed(1)}%`}
              />
              <StatItem
                label="Best Time"
                value={rankedStats.bestTime ? formatTime(rankedStats.bestTime) : 'N/A'}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color || ''}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
```

**src/components/player/PlayerAvatar.tsx**:

```typescript
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PlayerAvatarProps {
  uuid: string;
  nickname: string;
  size?: number;
  showOverlay?: boolean;
}

export function PlayerAvatar({
  uuid,
  nickname,
  size = 64,
  showOverlay = true,
}: PlayerAvatarProps) {
  const [error, setError] = useState(false);

  const avatarUrl = `https://crafatar.com/avatars/${uuid}?size=${size}${
    showOverlay ? '&overlay' : ''
  }`;

  if (error) {
    return (
      <Avatar style={{ width: size, height: size }}>
        <AvatarFallback>{nickname[0].toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Image
      src={avatarUrl}
      alt={nickname}
      width={size}
      height={size}
      className="rounded-lg"
      style={{ imageRendering: 'pixelated' }}
      onError={() => setError(true)}
    />
  );
}
```

**src/components/leaderboard/RankBadge.tsx**:

```typescript
'use client';

import { Badge } from '@/components/ui/badge';
import { getRankTier } from '@/lib/utils/colors';
import type { EloRate } from '@/types/api';

interface RankBadgeProps {
  eloRate: EloRate | null;
  showName?: boolean;
}

export function RankBadge({ eloRate, showName = true }: RankBadgeProps) {
  const tier = getRankTier(eloRate);

  return (
    <Badge
      style={{
        backgroundColor: tier.bgColor,
        borderColor: tier.color,
        color: tier.color,
      }}
      className="border-2 font-semibold"
    >
      {showName && tier.name}
    </Badge>
  );
}
```

**(Continuing in next section due to length...)**

---

## Phase 3: Feature Implementation (Continued)

### Step 3.3: Page Implementation

**src/app/page.tsx** (Home Page):

```typescript
import { Suspense } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { FeaturedPlayers } from '@/components/home/FeaturedPlayers';
import { LiveMatchesFeed } from '@/components/live/LiveMatchesFeed';
import { RecentMatches } from '@/components/match/RecentMatches';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-minecraft-diamond to-minecraft-emerald bg-clip-text text-transparent">
          MCSR Ranked Companion
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Track your speedrun statistics, analyze matches, and climb the leaderboard
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search for a player..." />
        </div>
      </section>

      {/* Live Matches */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Live Matches</h2>
        <Suspense fallback={<LoadingSkeleton count={3} />}>
          <LiveMatchesFeed />
        </Suspense>
      </section>

      {/* Featured Players */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Top Players</h2>
        <Suspense fallback={<LoadingSkeleton count={5} />}>
          <FeaturedPlayers />
        </Suspense>
      </section>

      {/* Recent Matches */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Recent Matches</h2>
        <Suspense fallback={<LoadingSkeleton count={10} />}>
          <RecentMatches />
        </Suspense>
      </section>
    </div>
  );
}
```

**src/app/player/[username]/page.tsx**:

```typescript
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getUser } from '@/lib/api/endpoints';
import { PlayerCard } from '@/components/player/PlayerCard';
import { PlayerStats } from '@/components/player/PlayerStats';
import { PlayerMatchHistory } from '@/components/player/PlayerMatchHistory';
import { PlayerAchievements } from '@/components/player/PlayerAchievements';
import { EloChart } from '@/components/visualizations/EloChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlayerPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  try {
    const player = await getUser(params.username);
    return {
      title: `${player.nickname} - Player Profile`,
      description: `View ${player.nickname}'s MCSR Ranked statistics, matches, and achievements`,
    };
  } catch {
    return {
      title: 'Player Not Found',
    };
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  let player;

  try {
    player = await getUser(params.username);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PlayerCard player={player} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<div>Loading chart...</div>}>
            <EloChart username={params.username} />
          </Suspense>

          <PlayerStats player={player} />
        </TabsContent>

        <TabsContent value="matches">
          <Suspense fallback={<div>Loading matches...</div>}>
            <PlayerMatchHistory username={params.username} />
          </Suspense>
        </TabsContent>

        <TabsContent value="achievements">
          <Suspense fallback={<div>Loading achievements...</div>}>
            <PlayerAchievements username={params.username} />
          </Suspense>
        </TabsContent>

        <TabsContent value="stats">
          <PlayerStats player={player} detailed />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## Phase 4: Mobile App (Capacitor)

### Step 4.1: Capacitor Setup

```bash
# Install Capacitor
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init "MCSR Companion" "com.mcsr.companion" --web-dir=out

# Add platforms
npx cap add android
npx cap add ios

# Install useful plugins
pnpm add @capacitor/status-bar @capacitor/splash-screen
pnpm add @capacitor/share @capacitor/preferences @capacitor/app
```

**capacitor.config.ts**:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mcsr.companion',
  appName: 'MCSR Companion',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },
  },
};

export default config;
```

### Step 4.2: Mobile-Specific Features

**src/lib/capacitor/storage.ts**:

```typescript
import { Preferences } from '@capacitor/preferences';

export const storage = {
  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  },

  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },

  async clear(): Promise<void> {
    await Preferences.clear();
  },
};
```

### Step 4.3: Build for Mobile

Update **package.json**:

```json
{
  "scripts": {
    "build:mobile": "next build && next export",
    "cap:sync": "pnpm build:mobile && cap sync",
    "cap:android": "pnpm cap:sync && cap open android",
    "cap:ios": "pnpm cap:sync && cap open ios"
  }
}
```

---

## Phase 5: Desktop App (Tauri)

### Step 5.1: Tauri Setup

```bash
# Install Tauri CLI
pnpm add -D @tauri-apps/cli

# Initialize Tauri
pnpm tauri init

# Install Tauri API
pnpm add @tauri-apps/api
```

**src-tauri/tauri.conf.json**:

```json
{
  "build": {
    "beforeDevCommand": "pnpm dev",
    "beforeBuildCommand": "pnpm build",
    "devPath": "http://localhost:3000",
    "distDir": "../out"
  },
  "package": {
    "productName": "MCSR Companion",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "window": {
        "all": false,
        "close": true,
        "hide": true,
        "show": true,
        "maximize": true,
        "minimize": true,
        "unmaximize": true,
        "unminimize": true,
        "startDragging": true
      }
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "MCSR Companion",
        "width": 1280,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

### Step 5.2: Build Scripts

Add to **package.json**:

```json
{
  "scripts": {
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

---

## Phase 6: Polish & Optimization

### Performance Optimizations

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Dynamic imports for heavy components
3. **Caching Strategy**: Aggressive caching with SWR
4. **Bundle Analysis**: Use `@next/bundle-analyzer`
5. **Lighthouse Score**: Target 90+ on all metrics

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint
```

---

## Deployment Strategy

### Web (Vercel)

```bash
# Install Vercel CLI
pnpm add -D vercel

# Deploy
pnpm vercel --prod
```

### Mobile (App Stores)

**Android (Google Play)**:
1. Generate signed APK
2. Create Play Store listing
3. Submit for review

**iOS (App Store)**:
1. Configure Xcode project
2. Archive and upload
3. Submit via App Store Connect

### Desktop (GitHub Releases)

```bash
# Build for all platforms
pnpm tauri build

# Artifacts in src-tauri/target/release/bundle/
```

---

## Implementation Summary

### ✅ Completed (Phases 1-3)

**Core Infrastructure**:
- ✅ Next.js 15 App Router setup
- ✅ TypeScript configuration
- ✅ Tailwind CSS + shadcn/ui components
- ✅ TanStack Query integration
- ✅ Framer Motion animations
- ✅ Complete UI component library

**API Integration**:
- ✅ Type-safe API client (Axios)
- ✅ Complete TypeScript types from API
- ✅ React Query hooks for all endpoints
- ✅ Error handling and retry logic
- ✅ Proper caching strategies

**Pages Implemented**:
- ✅ Home page with navigation
- ✅ Player profile page
- ✅ Leaderboard page
- ✅ Match details page
- ✅ Live matches page
- ✅ Head-to-head comparison page

**Features**:
- ✅ Player statistics and ELO tracking
- ✅ Match history with filters
- ✅ Achievement showcase
- ✅ Real-time live match updates
- ✅ Interactive charts (ELO progression, win rates)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Loading states and error boundaries
- ✅ Search functionality
- ✅ Pagination support

**Build Status**:
- ✅ TypeScript compilation: PASSING
- ✅ Production build: SUCCESS
- ✅ All routes optimized
- ✅ No type errors
- ✅ ESLint warnings addressed

### 🔲 Remaining Work

**Phase 4: Mobile App (Capacitor)**
- 🔲 Capacitor setup and configuration
- 🔲 Android platform integration
- 🔲 iOS platform integration
- 🔲 Native features (notifications, sharing)
- 🔲 Mobile-specific optimizations
- 🔲 App store deployment

**Phase 5: Desktop App (Tauri)**
- 🔲 Tauri integration
- 🔲 Rust backend setup
- 🔲 Desktop-specific features
- 🔲 Multi-platform builds (Windows/Mac/Linux)
- 🔲 GitHub releases automation

**Phase 6: Polish & Optimization**
- 🔲 Performance optimization (Lighthouse 90+)
- 🔲 Accessibility improvements (WCAG 2.1 AA)
- 🔲 End-to-end testing suite
- 🔲 Unit test coverage
- 🔲 SEO optimization
- 🔲 Analytics integration

## Future Enhancements

### Phase 2 Features

- [ ] Weekly race tracking and integration
- [ ] Real-time notifications for favorite players
- [ ] Advanced filtering and sorting on leaderboard
- [ ] Match predictions using ML
- [ ] Custom overlay for OBS (pace tracker)
- [ ] Discord bot integration
- [ ] Tournament bracket generator
- [ ] Seed database with win rates
- [ ] Player comparison tool (3+ players)
- [ ] Export stats to CSV/PDF
- [ ] Custom themes and skins
- [ ] Offline mode improvements
- [ ] Match replay viewer

### Advanced Features

- [ ] WebSocket for real-time updates
- [ ] Voice commands (mobile)
- [ ] AR mode for mobile (fun!)
- [ ] Social features (friends, groups)
- [ ] Coaching tools (annotations, notes)

---

## Development Timeline

### Week 1-2: Foundation ✅ COMPLETE
- ✅ Project setup
- ✅ API integration
- ✅ Core components
- ✅ Basic pages

### Week 3-4: Features ✅ COMPLETE
- ✅ Player profiles (/player/[username])
- ✅ Match history (integrated in player page)
- ✅ Leaderboards (/leaderboard)
- ✅ Live matches (/live)
- ✅ Match details (/match/[id])
- ✅ Head-to-head comparison (/versus/[player1]/[player2])
- ✅ Enhanced home page with navigation
- ✅ All pages integrated with React Query hooks
- ✅ TypeScript type-safe throughout
- ✅ Production build successful

### Week 5: Mobile 🔲 NEXT PHASE
- 🔲 Capacitor setup
- 🔲 Mobile optimization
- 🔲 Native features
- 🔲 Mobile-specific UI adaptations

### Week 6: Desktop & Polish 🔲 UPCOMING
- 🔲 Tauri integration
- 🔲 Performance optimization
- 🔲 End-to-end testing
- 🔲 Deployment strategies

---

## Tips for Success

1. **Start Simple**: Build MVP first, add features later
2. **Test Often**: Run on real devices early
3. **User Feedback**: Get feedback from MCSR community
4. **Performance**: Monitor bundle size and load times
5. **Documentation**: Keep README updated
6. **Git Workflow**: Use conventional commits
7. **Have Fun**: This is a passion project!

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Tauri Docs](https://tauri.app/v1/guides/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [MCSR Ranked API Docs](https://docs.mcsrranked.com/)

---

**Now let's build something amazing!** 🚀

The beauty of this stack is that every line of code you write for the web app works on mobile and desktop too. Focus on making the web experience incredible, and the other platforms will follow naturally.

Start with Phase 1 (Core Web App) and Phase 2 (API Integration), get those solid, then the rest will flow smoothly. The most important thing is to iterate quickly and get feedback from actual MCSR players.

Happy coding! 🎮⚡
