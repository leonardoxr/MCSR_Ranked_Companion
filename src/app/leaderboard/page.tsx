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
import { BannerAd, InContentAd } from '@/components/features/AdUnit';
import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Trophy } from 'lucide-react';
import { COUNTRIES, SEASONS } from '@/lib/constants/filters';
import { CACHE_PRESETS } from '@/lib/api/cache-config';

const MAX_USERS = 150;

export default function LeaderboardPage() {
  const router = useRouter();
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch current season from API
  const { data: seasonData } = useQuery({
    queryKey: ['leaderboard', 'current-season'],
    queryFn: () => getLeaderboardWithSeason({ count: 1 }),
    ...CACHE_PRESETS.REAL_TIME,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get current season from API response, fallback to 9 if not available
  const currentSeasonFromApi = seasonData?.season?.number;
  const defaultSeason = currentSeasonFromApi ?? 9;

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
    <div className="container mx-auto px-4 py-8 space-y-6">
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

      {/* Banner Ad */}
      <BannerAd className="mb-6" />

      {/* Leaderboard Table */}
      {isLoading ? (
        <LoadingState message={t('leaderboard.loading')} />
      ) : error ? (
        <ErrorState
          title={t('leaderboard.error')}
          message={error.message || t('leaderboard.errorMessage')}
        />
      ) : players && players.length > 0 ? (
        <>
          <LeaderboardTable players={players} />
          {/* In-Content Ad after leaderboard */}
          <InContentAd className="mt-6" />
        </>
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
