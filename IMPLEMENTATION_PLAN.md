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

## Phase 4: Mobile App (Capacitor) 🔄 IN PROGRESS

**Goal**: Transform the web app into native mobile applications for iOS and Android while maintaining 95%+ code reuse and adding mobile-specific enhancements.

**Timeline**: 1-2 weeks
**Priority**: High (critical for multi-platform presence)

---

### Step 4.1: Initial Capacitor Setup

**Prerequisites**:
```bash
# For Android development
- Android Studio (latest stable)
- Android SDK 33+ (API Level 33)
- Java Development Kit (JDK) 17

# For iOS development (macOS only)
- Xcode 14+
- CocoaPods
- iOS Deployment Target: 13.0+
```

**Installation and Initialization**:

```bash
# 1. Install Capacitor core dependencies
pnpm add @capacitor/core @capacitor/cli

# 2. Install platform-specific packages
pnpm add @capacitor/android @capacitor/ios

# 3. Install essential Capacitor plugins
pnpm add @capacitor/status-bar @capacitor/splash-screen
pnpm add @capacitor/share @capacitor/preferences @capacitor/app
pnpm add @capacitor/haptics @capacitor/toast @capacitor/network
pnpm add @capacitor/browser @capacitor/clipboard @capacitor/device

# 4. Initialize Capacitor
npx cap init "MCSR Companion" "com.mcsr.companion" --web-dir=out

# 5. Add mobile platforms
npx cap add android
npx cap add ios
```

**Update Next.js Configuration for Static Export**:

**next.config.js**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Capacitor requires static export
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Asset prefix for Capacitor
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,

  // Trailing slash for consistent routing
  trailingSlash: true,

  // Image optimization config
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
  },

  // React strict mode
  reactStrictMode: true,

  // SWC minification
  swcMinify: true,
};

module.exports = nextConfig;
```

**Capacitor Configuration**:

**capacitor.config.ts**:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mcsr.companion',
  appName: 'MCSR Companion',
  webDir: 'out',

  // Server configuration
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // For development, enable live reload
    // url: 'http://192.168.1.100:3000',
    // cleartext: true,
  },

  // Plugin configurations
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#4fc3f7',
      splashFullScreen: true,
      splashImmersive: true,
    },

    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },

    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },

  // Android specific configuration
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK',
    },
  },

  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
};

export default config;
```

**Package.json Scripts**:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",

    "build:mobile": "next build",
    "cap:sync": "pnpm build:mobile && cap sync",
    "cap:copy": "cap copy",

    "android:dev": "cap open android",
    "android:build": "pnpm build:mobile && cap sync android && cap open android",
    "android:run": "cap run android",

    "ios:dev": "cap open ios",
    "ios:build": "pnpm build:mobile && cap sync ios && cap open ios",
    "ios:run": "cap run ios",

    "mobile:update": "pnpm build:mobile && cap copy && cap sync"
  }
}
```

---

### Step 4.2: Platform Detection and Mobile Utilities

**src/lib/mobile/platform.ts**:

```typescript
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

/**
 * Platform detection utilities
 */
export const Platform = {
  /**
   * Check if running as native mobile app
   */
  isNative: () => Capacitor.isNativePlatform(),

  /**
   * Check if running on iOS
   */
  isIOS: () => Capacitor.getPlatform() === 'ios',

  /**
   * Check if running on Android
   */
  isAndroid: () => Capacitor.getPlatform() === 'android',

  /**
   * Check if running in web browser
   */
  isWeb: () => Capacitor.getPlatform() === 'web',

  /**
   * Get current platform name
   */
  getPlatform: () => Capacitor.getPlatform(),
};

/**
 * Get device information
 */
export async function getDeviceInfo() {
  const info = await Device.getInfo();
  const id = await Device.getId();

  return {
    ...info,
    uuid: id.identifier,
  };
}

/**
 * Platform-specific configuration
 */
export function getPlatformConfig() {
  if (Platform.isIOS()) {
    return {
      statusBarHeight: 44, // iPhone status bar
      safeAreaTop: 44,
      safeAreaBottom: 34, // iPhone home indicator
      hapticFeedback: true,
    };
  }

  if (Platform.isAndroid()) {
    return {
      statusBarHeight: 24,
      safeAreaTop: 0,
      safeAreaBottom: 0,
      hapticFeedback: true,
    };
  }

  return {
    statusBarHeight: 0,
    safeAreaTop: 0,
    safeAreaBottom: 0,
    hapticFeedback: false,
  };
}
```

---

### Step 4.3: Mobile-Optimized Storage Layer

**src/lib/mobile/storage.ts**:

```typescript
import { Preferences } from '@capacitor/preferences';
import { Platform } from './platform';

/**
 * Mobile-optimized storage using Capacitor Preferences
 * Falls back to localStorage for web
 */
export const MobileStorage = {
  /**
   * Set a value in storage
   */
  async set(key: string, value: any): Promise<void> {
    try {
      if (Platform.isNative()) {
        await Preferences.set({
          key,
          value: JSON.stringify(value),
        });
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Get a value from storage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (Platform.isNative()) {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) : null;
      } else {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove a value from storage
   */
  async remove(key: string): Promise<void> {
    try {
      if (Platform.isNative()) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Storage remove error for key ${key}:`, error);
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      if (Platform.isNative()) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },

  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    try {
      if (Platform.isNative()) {
        const { keys } = await Preferences.keys();
        return keys;
      } else {
        return Object.keys(localStorage);
      }
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  },
};

/**
 * Cached storage for frequently accessed data
 */
export class CachedStorage<T> {
  private cache: Map<string, T> = new Map();
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Load from storage
    const value = await MobileStorage.get<T>(this.getKey(key));
    if (value !== null) {
      this.cache.set(key, value);
    }

    return value;
  }

  async set(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
    await MobileStorage.set(this.getKey(key), value);
  }

  async remove(key: string): Promise<void> {
    this.cache.delete(key);
    await MobileStorage.remove(this.getKey(key));
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Storage keys for the app
 */
export const StorageKeys = {
  // User preferences
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
  THEME: 'theme',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',

  // Cached data
  LEADERBOARD_CACHE: 'leaderboard_cache',
  PLAYER_CACHE: 'player_cache',
  MATCHES_CACHE: 'matches_cache',

  // App state
  LAST_VIEWED_PLAYER: 'last_viewed_player',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

/**
 * Typed storage helpers
 */
export const FavoritesStorage = new CachedStorage<string[]>('favorites');
export const RecentSearchesStorage = new CachedStorage<string[]>('recent_searches');
```

---

### Step 4.4: Native Features Integration

**src/lib/mobile/features.ts**:

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from './platform';

/**
 * Haptic feedback utilities
 */
export const HapticFeedback = {
  /**
   * Light impact (button press)
   */
  async light() {
    if (Platform.isNative()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  },

  /**
   * Medium impact (selection change)
   */
  async medium() {
    if (Platform.isNative()) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  },

  /**
   * Heavy impact (important action)
   */
  async heavy() {
    if (Platform.isNative()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }
  },

  /**
   * Selection changed (picker, slider)
   */
  async selection() {
    if (Platform.isNative()) {
      await Haptics.selectionChanged();
    }
  },

  /**
   * Notification feedback
   */
  async notification(type: 'success' | 'warning' | 'error' = 'success') {
    if (Platform.isNative()) {
      await Haptics.notification({ type: type.toUpperCase() as any });
    }
  },
};

/**
 * Toast notifications
 */
export const ToastNotification = {
  async show(text: string, duration: 'short' | 'long' = 'short') {
    if (Platform.isNative()) {
      await Toast.show({
        text,
        duration: duration,
        position: 'bottom',
      });
    } else {
      // Fallback for web (you can use a custom toast component)
      console.log('Toast:', text);
    }
  },

  async success(text: string) {
    await HapticFeedback.notification('success');
    await this.show(text, 'short');
  },

  async error(text: string) {
    await HapticFeedback.notification('error');
    await this.show(text, 'long');
  },
};

/**
 * Share functionality
 */
export const ShareUtils = {
  /**
   * Share text content
   */
  async shareText(text: string, title?: string) {
    try {
      await Share.share({
        text,
        title,
        dialogTitle: 'Share via',
      });
      await HapticFeedback.light();
    } catch (error) {
      console.error('Share error:', error);
    }
  },

  /**
   * Share player profile
   */
  async sharePlayer(username: string, eloRate: number, rank: number) {
    const text = `Check out ${username}'s MCSR Ranked stats!\nELO: ${eloRate} | Rank: #${rank}\nhttps://mcsrranked.com/users/${username}`;
    await this.shareText(text, `${username} - MCSR Ranked`);
  },

  /**
   * Share match result
   */
  async shareMatch(matchId: string, winner: string, time: number) {
    const text = `${winner} won in ${this.formatTime(time)}!\nView match: https://mcsrranked.com/matches/${matchId}`;
    await this.shareText(text, 'MCSR Ranked Match');
  },

  formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
};

/**
 * Browser utilities
 */
export const BrowserUtils = {
  /**
   * Open URL in in-app browser
   */
  async open(url: string) {
    if (Platform.isNative()) {
      await Browser.open({ url, presentationStyle: 'popover' });
    } else {
      window.open(url, '_blank');
    }
  },

  /**
   * Open player VOD
   */
  async openVOD(vodUrl: string) {
    await this.open(vodUrl);
    await HapticFeedback.light();
  },

  /**
   * Open player's Twitch
   */
  async openTwitch(username: string) {
    await this.open(`https://twitch.tv/${username}`);
  },
};

/**
 * Clipboard utilities
 */
export const ClipboardUtils = {
  /**
   * Copy text to clipboard
   */
  async copy(text: string) {
    await Clipboard.write({ string: text });
    await ToastNotification.show('Copied to clipboard');
    await HapticFeedback.light();
  },

  /**
   * Read from clipboard
   */
  async read(): Promise<string> {
    const { value } = await Clipboard.read();
    return value;
  },

  /**
   * Copy player UUID
   */
  async copyUUID(uuid: string) {
    await this.copy(uuid);
  },

  /**
   * Copy match ID
   */
  async copyMatchId(matchId: string) {
    await this.copy(matchId);
  },
};

/**
 * Network status monitoring
 */
export const NetworkMonitor = {
  /**
   * Check current network status
   */
  async getStatus() {
    const status = await Network.getStatus();
    return {
      connected: status.connected,
      connectionType: status.connectionType,
    };
  },

  /**
   * Listen for network status changes
   */
  onChange(callback: (connected: boolean) => void) {
    Network.addListener('networkStatusChange', (status) => {
      callback(status.connected);
    });
  },

  /**
   * Remove network listener
   */
  removeListeners() {
    Network.removeAllListeners();
  },
};

/**
 * App lifecycle management
 */
export const AppLifecycle = {
  /**
   * Handle app state changes
   */
  onStateChange(callback: (isActive: boolean) => void) {
    App.addListener('appStateChange', ({ isActive }) => {
      callback(isActive);
    });
  },

  /**
   * Handle deep links
   */
  onDeepLink(callback: (url: string) => void) {
    App.addListener('appUrlOpen', (data) => {
      callback(data.url);
    });
  },

  /**
   * Get app info
   */
  async getInfo() {
    return await App.getInfo();
  },
};

/**
 * Status bar management
 */
export const StatusBarManager = {
  /**
   * Set status bar style
   */
  async setStyle(style: 'light' | 'dark') {
    if (Platform.isNative()) {
      await StatusBar.setStyle({
        style: style === 'light' ? Style.Light : Style.Dark,
      });
    }
  },

  /**
   * Show status bar
   */
  async show() {
    if (Platform.isNative()) {
      await StatusBar.show();
    }
  },

  /**
   * Hide status bar
   */
  async hide() {
    if (Platform.isNative()) {
      await StatusBar.hide();
    }
  },

  /**
   * Set background color (Android only)
   */
  async setBackgroundColor(color: string) {
    if (Platform.isAndroid()) {
      await StatusBar.setBackgroundColor({ color });
    }
  },
};
```

---

### Step 4.5: Mobile-Optimized Components

**src/components/mobile/MobileNav.tsx**:

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Users, Star, Menu } from 'lucide-react';
import { HapticFeedback } from '@/lib/mobile/features';
import { Platform } from '@/lib/mobile/platform';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/live', label: 'Live', icon: Users },
  { href: '/favorites', label: 'Favorites', icon: Star },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = async () => {
    if (Platform.isNative()) {
      await HapticFeedback.light();
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex justify-around items-center h-16 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Hamburger Menu (Mobile Alternative) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <button className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <nav className="flex flex-col gap-4 mt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    handleNavClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

**src/components/mobile/PullToRefresh.tsx**:

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { HapticFeedback } from '@/lib/mobile/features';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isRefreshing || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.5));

      if (distance > PULL_THRESHOLD) {
        HapticFeedback.light();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      await HapticFeedback.medium();
      await onRefresh();
      setIsRefreshing(false);
    }

    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
        style={{
          height: pullDistance,
          opacity: isPulling ? 1 : 0,
        }}
      >
        <RefreshCw
          className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`}
          style={{
            transform: `rotate(${pullDistance * 3}deg)`,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ marginTop: isPulling ? pullDistance : 0 }}>
        {children}
      </div>
    </div>
  );
}
```

---

### Step 4.6: Mobile-Specific Hooks

**src/lib/hooks/useMobileFeatures.ts**:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Platform } from '@/lib/mobile/platform';
import { NetworkMonitor, AppLifecycle } from '@/lib/mobile/features';

/**
 * Hook to detect if running on mobile
 */
export function useIsMobile() {
  return Platform.isNative();
}

/**
 * Hook for network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Get initial status
    NetworkMonitor.getStatus().then((status) => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    });

    // Listen for changes
    NetworkMonitor.onChange((connected) => {
      setIsOnline(connected);
    });

    return () => {
      NetworkMonitor.removeListeners();
    };
  }, []);

  return { isOnline, connectionType };
}

/**
 * Hook for app state (active/background)
 */
export function useAppState() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    AppLifecycle.onStateChange((active) => {
      setIsActive(active);
    });
  }, []);

  return { isActive };
}

/**
 * Hook for safe area insets
 */
export function useSafeArea() {
  const config = getPlatformConfig();

  return {
    top: config.safeAreaTop,
    bottom: config.safeAreaBottom,
  };
}

/**
 * Hook for orientation changes
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
}
```

---

### Step 4.7: Platform-Specific Configuration

#### Android Configuration

**android/app/src/main/AndroidManifest.xml**:

Add internet and network state permissions:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.VIBRATE" />

  <application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme"
    android:usesCleartextTraffic="true">

    <!-- Deep linking support -->
    <intent-filter android:autoVerify="true">
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:scheme="mcsrcompanion" />
      <data android:host="player" />
      <data android:host="match" />
    </intent-filter>
  </application>
</manifest>
```

**android/app/build.gradle**:

```gradle
android {
    namespace "com.mcsr.companion"
    compileSdkVersion 33

    defaultConfig {
        applicationId "com.mcsr.companion"
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

#### iOS Configuration

**ios/App/Info.plist**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDisplayName</key>
  <string>MCSR Companion</string>

  <key>CFBundleIdentifier</key>
  <string>com.mcsr.companion</string>

  <key>CFBundleVersion</key>
  <string>1.0.0</string>

  <!-- Deep linking -->
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>mcsrcompanion</string>
      </array>
    </dict>
  </array>

  <!-- Dark mode support -->
  <key>UIUserInterfaceStyle</key>
  <string>Automatic</string>

  <!-- Status bar -->
  <key>UIStatusBarHidden</key>
  <false/>
  <key>UIViewControllerBasedStatusBarAppearance</key>
  <true/>
</dict>
</plist>
```

---

### Step 4.8: App Icons and Splash Screens

**Generate app icons** using a tool like [appicon.co](https://appicon.co/):

1. Create a 1024x1024px icon with the MCSR Companion logo
2. Upload to icon generator
3. Download platform-specific assets

**Android Icon Structure**:
```
android/app/src/main/res/
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png (192x192)
```

**iOS Icon Structure**:
```
ios/App/Assets.xcassets/AppIcon.appiconset/
├── AppIcon-20x20@1x.png
├── AppIcon-20x20@2x.png
├── AppIcon-40x40@1x.png
└── ... (all required sizes)
```

**Splash Screen**:

Create a splash screen image (2732x2732px recommended):

```
resources/
├── splash.png          # Main splash image
├── splash-dark.png     # Dark mode variant
└── icon.png           # App icon
```

Run Capacitor CLI to generate splash screens:
```bash
npx @capacitor/assets generate
```

---

### Step 4.9: Offline Support and Caching

**Service Worker for Progressive Web App** (also benefits mobile):

**public/sw.js**:

```javascript
const CACHE_NAME = 'mcsr-companion-v1';
const urlsToCache = [
  '/',
  '/leaderboard',
  '/live',
  '/offline',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - cache-first strategy for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API requests - network-first
  if (url.hostname === 'api.mcsrranked.com') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets - cache-first
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
```

**Offline Indicator Component**:

**src/components/mobile/OfflineIndicator.tsx**:

```typescript
'use client';

import { useNetworkStatus } from '@/lib/hooks/useMobileFeatures';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function OfflineIndicator() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="fixed top-0 left-0 right-0 z-50 rounded-none">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Some features may be unavailable.
      </AlertDescription>
    </Alert>
  );
}
```

---

### Step 4.10: Build and Deployment

#### Development Workflow

```bash
# 1. Start Next.js dev server
pnpm dev

# 2. In another terminal, sync to mobile (live reload)
# Update capacitor.config.ts with your local IP:
# server: { url: 'http://192.168.1.100:3000', cleartext: true }

# 3. Open in Android Studio
pnpm android:dev

# 4. Run on device/emulator
# Use Android Studio's run button or:
pnpm android:run

# For iOS (macOS only)
pnpm ios:dev
pnpm ios:run
```

#### Production Build

**Android APK/AAB**:

```bash
# 1. Build the Next.js app
pnpm build:mobile

# 2. Sync to Android
cap sync android

# 3. Open Android Studio
cap open android

# 4. In Android Studio:
# - Build > Generate Signed Bundle / APK
# - Select Android App Bundle (AAB) for Play Store
# - Or APK for direct distribution

# Output location:
# android/app/build/outputs/bundle/release/app-release.aab
# android/app/build/outputs/apk/release/app-release.apk
```

**iOS IPA**:

```bash
# 1. Build the Next.js app
pnpm build:mobile

# 2. Sync to iOS
cap sync ios

# 3. Open Xcode
cap open ios

# 4. In Xcode:
# - Select "Any iOS Device (arm64)"
# - Product > Archive
# - Distribute App > App Store Connect
# - Follow the upload wizard

# For TestFlight:
# - Use "TestFlight & App Store" distribution
# - Upload to App Store Connect
# - Add to TestFlight for beta testing
```

#### Google Play Store Submission

**Requirements**:
1. Google Play Developer Account ($25 one-time fee)
2. App screenshots (phone, tablet, possibly TV)
3. Feature graphic (1024x500px)
4. App description and marketing materials
5. Privacy policy URL

**Checklist**:
- [ ] Create app listing in Play Console
- [ ] Upload app bundle (AAB)
- [ ] Add screenshots (min 2, max 8 per device type)
- [ ] Write app description (short and full)
- [ ] Set content rating
- [ ] Add privacy policy
- [ ] Submit for review

**android/app/build.gradle signing config**:

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MCSR_RELEASE_STORE_FILE')) {
                storeFile file(MCSR_RELEASE_STORE_FILE)
                storePassword MCSR_RELEASE_STORE_PASSWORD
                keyAlias MCSR_RELEASE_KEY_ALIAS
                keyPassword MCSR_RELEASE_KEY_PASSWORD
            }
        }
    }
}
```

#### Apple App Store Submission

**Requirements**:
1. Apple Developer Account ($99/year)
2. App screenshots (various iPhone sizes)
3. App preview videos (optional but recommended)
4. App description and keywords
5. Privacy policy URL

**Checklist**:
- [ ] Create app ID in App Store Connect
- [ ] Configure app information
- [ ] Upload build via Xcode
- [ ] Add screenshots and metadata
- [ ] Submit for App Review
- [ ] Respond to any feedback

---

### Step 4.11: Testing Checklist

**Functionality Testing**:
- [ ] Player search works correctly
- [ ] Leaderboard loads and paginates
- [ ] Live matches update in real-time
- [ ] Match details display correctly
- [ ] Player profiles show all stats
- [ ] Favorites can be added/removed
- [ ] Share functionality works
- [ ] Deep links open correctly
- [ ] Offline mode shows cached data

**Platform-Specific Testing**:

**Android**:
- [ ] Test on Android 8+ devices
- [ ] Back button navigation works
- [ ] Status bar color changes with theme
- [ ] Haptic feedback works
- [ ] Share sheet appears correctly
- [ ] Deep links work from browser
- [ ] App doesn't crash on rotation
- [ ] Network state changes handled

**iOS**:
- [ ] Test on iOS 13+ devices
- [ ] Safe area insets respected
- [ ] Status bar style changes correctly
- [ ] Haptic feedback works (Taptic Engine)
- [ ] Share sheet appears correctly
- [ ] Deep links work from Safari
- [ ] Pull-to-refresh works smoothly
- [ ] Dark mode switches correctly

**Performance Testing**:
- [ ] App launches in < 3 seconds
- [ ] Smooth scrolling (60 FPS)
- [ ] No memory leaks
- [ ] Images load efficiently
- [ ] API calls are cached appropriately
- [ ] Battery usage is reasonable

---

### Step 4.12: Mobile-Specific Features (MCSR API Integration)

**Favorites Management**:

**src/lib/mobile/favorites.ts**:

```typescript
import { FavoritesStorage } from './storage';
import { ToastNotification, HapticFeedback } from './features';

export class FavoritesManager {
  /**
   * Add player to favorites
   */
  static async addFavorite(username: string) {
    const favorites = await FavoritesStorage.get('players') || [];

    if (!favorites.includes(username)) {
      favorites.push(username);
      await FavoritesStorage.set('players', favorites);
      await ToastNotification.success(`${username} added to favorites`);
      await HapticFeedback.light();
    }
  }

  /**
   * Remove player from favorites
   */
  static async removeFavorite(username: string) {
    const favorites = await FavoritesStorage.get('players') || [];
    const updated = favorites.filter(u => u !== username);

    await FavoritesStorage.set('players', updated);
    await ToastNotification.show(`${username} removed from favorites`);
    await HapticFeedback.light();
  }

  /**
   * Check if player is favorited
   */
  static async isFavorite(username: string): Promise<boolean> {
    const favorites = await FavoritesStorage.get('players') || [];
    return favorites.includes(username);
  }

  /**
   * Get all favorites
   */
  static async getAllFavorites(): Promise<string[]> {
    return await FavoritesStorage.get('players') || [];
  }
}
```

**Quick Actions (Home Screen Shortcuts)**:

For iOS 13+ and Android 7.1+, add home screen quick actions:

**Add to capacitor.config.ts**:

```typescript
plugins: {
  // ... other plugins

  // iOS Quick Actions
  QuickActions: {
    items: [
      {
        type: 'search',
        title: 'Search Player',
        subtitle: 'Find player statistics',
        icon: 'search',
      },
      {
        type: 'leaderboard',
        title: 'Leaderboard',
        subtitle: 'View global rankings',
        icon: 'trophy',
      },
      {
        type: 'live',
        title: 'Live Matches',
        subtitle: 'Watch ongoing matches',
        icon: 'play',
      },
    ],
  },
},
```

---

### Step 4.13: Performance Optimizations

**Image Optimization**:

```typescript
// Use optimized images for mobile
export function getOptimizedImageUrl(uuid: string, size: number = 128) {
  // Use smaller sizes on mobile
  const mobileSize = Platform.isNative() && size > 128 ? 128 : size;
  return `https://crafatar.com/avatars/${uuid}?size=${mobileSize}&overlay`;
}

// Lazy load images
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={getOptimizedImageUrl(uuid)}
  alt={nickname}
  effect="blur"
  threshold={100}
/>
```

**API Request Batching**:

```typescript
// Batch multiple player requests
async function batchFetchPlayers(usernames: string[]) {
  const results = await Promise.all(
    usernames.map(username =>
      fetch(`https://api.mcsrranked.com/users/${username}`)
        .then(r => r.json())
        .catch(() => null)
    )
  );

  return results.filter(Boolean);
}
```

**Virtual Scrolling for Long Lists**:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function LeaderboardVirtualized({ players }) {
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: players.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <PlayerRow player={players[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Phase 4 Summary

**What We've Built**:
- ✅ Complete Capacitor setup for iOS and Android
- ✅ Mobile-optimized storage with native Preferences API
- ✅ Native features (haptics, toast, share, clipboard)
- ✅ Platform detection and responsive utilities
- ✅ Mobile-specific components (bottom nav, pull-to-refresh)
- ✅ Offline support with service workers
- ✅ App icons and splash screens
- ✅ Deep linking configuration
- ✅ Build and deployment workflows
- ✅ Performance optimizations

**Code Reuse**:
- 95%+ of the web app code works on mobile
- Only mobile-specific additions:
  - Native plugin integrations
  - Platform-specific UI components
  - Mobile navigation patterns
  - Touch interactions

**Next Steps**:
1. Test on real devices
2. Optimize for different screen sizes
3. Add push notifications (optional)
4. Submit to app stores
5. Move to Phase 5 (Desktop with Tauri)

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
