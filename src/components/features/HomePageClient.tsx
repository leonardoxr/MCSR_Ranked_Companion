'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useLeaderboard } from '@/lib/api/hooks/useLeaderboard';
import { getLeaderboardWithSeason } from '@/lib/api/endpoints';
import { LeaderboardTable } from '@/components/features/LeaderboardTable';
import { SearchBar } from '@/components/features/SearchBar';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Trophy, TrendingUp, ChevronRight } from 'lucide-react';
import { COUNTRIES, SEASONS } from '@/lib/constants/filters';
import { CACHE_PRESETS } from '@/lib/api/cache-config';
import Link from 'next/link';

const MAX_USERS = 150;

export function HomePageClient() {
  const router = useRouter();
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch current season from API
  const { data: seasonData } = useQuery({
    queryKey: ['leaderboard', 'current-season'],
    queryFn: () => getLeaderboardWithSeason({ count: 1 }),
    ...CACHE_PRESETS.LEADERBOARD,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (override default)
  });

  // Get current season from API response, fallback to 10 if not available
  const currentSeasonFromApi = seasonData?.season?.number;
  const defaultSeason = currentSeasonFromApi ?? 10;

  const [season, setSeason] = React.useState<number | null>(null);
  const [country, setCountry] = React.useState('');

  // Set season once we have the API data
  React.useEffect(() => {
    if (season === null && defaultSeason) {
      setSeason(defaultSeason);
    }
  }, [defaultSeason, season]);

  const { data: players, isLoading, error } = useLeaderboard({
    count: MAX_USERS,
    ...(season ? { season } : {}),
    ...(country ? { country } : {} as any),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      // Navigate to player profile
      router.push(`/player/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">{t('leaderboard.title')}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('leaderboard.description')}
              </p>
            </div>
          </div>
        </div>

        {/* ELO Timeline Banner */}
        <Link href="/elo-timeline" className="block">
          <div className="group relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                    {t('eloTimeline.bannerTitle', { defaultValue: 'ELO Timeline' })}
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {t('eloTimeline.new', { defaultValue: 'NEW' })}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t('eloTimeline.bannerDescription', { defaultValue: 'Visualize ELO progression of top players over time' })}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              autoSuggest
              placeholder={t('leaderboard.searchPlaceholder')}
            />
          </div>
          {/* Filters - Mobile: Full Width Stack, Desktop: Inline */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3">
            {/* Season Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Season
              </label>
              <Select
                value={season?.toString() ?? ''}
                onValueChange={(value) => setSeason(Number(value))}
                disabled={season === null}
              >
                <SelectTrigger
                  className="h-9 w-full sm:w-32"
                  allowClear={false}
                >
                  <SelectValue placeholder={season === null ? "Loading..." : "Select Season"} />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search seasons...">
                  {SEASONS.map((s) => (
                    <SelectItem key={s.value} value={s.value.toString()}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Country
              </label>
              <Select
                value={country || 'all'}
                onValueChange={(value) => setCountry(value === 'all' ? '' : value)}
              >
                <SelectTrigger
                  className="h-9 w-full sm:w-44"
                  allowClear={country !== ''}
                  showClearButton={country !== ''}
                  onClear={() => setCountry('')}
                >
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search countries...">
                  <SelectItem value="all">All Countries</SelectItem>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <LoadingState message={t('leaderboard.loading')} />
      ) : error ? (
        <ErrorState
          title={t('leaderboard.error')}
          message={error.message || t('leaderboard.errorMessage')}
        />
      ) : players && players.length > 0 ? (
        <LeaderboardTable players={players} />
      ) : (
        <Card variant="mc">
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('leaderboard.noPlayers')}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
