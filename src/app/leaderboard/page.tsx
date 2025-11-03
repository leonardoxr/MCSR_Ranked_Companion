'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLeaderboard } from '@/lib/api/hooks/useLeaderboard';
import { LeaderboardTable } from '@/components/features/LeaderboardTable';
import { SearchBar } from '@/components/features/SearchBar';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { COUNTRIES, SEASONS } from '@/lib/constants/filters';

const PAGE_SIZE = 10;

export default function LeaderboardPage() {
  const router = useRouter();
  const t = useTranslations();
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [season, setSeason] = React.useState<number | undefined>(undefined);
  const [country, setCountry] = React.useState('');

  const { data: players, isLoading, error } = useLeaderboard({
    page,
    count: PAGE_SIZE,
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

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                value={season?.toString() ?? 'all'}
                onValueChange={(value) => setSeason(value === 'all' ? undefined : Number(value))}
              >
                <SelectTrigger className="h-9 w-full sm:w-32">
                  <SelectValue placeholder="All Seasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
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
                <SelectTrigger className="h-9 w-full sm:w-44">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="mc">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('leaderboard.currentPage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {((page - 1) * PAGE_SIZE + 1).toLocaleString()} -{' '}
              {(page * PAGE_SIZE).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card variant="mc">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('leaderboard.playersShown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {Array.isArray(players) ? players.length.toLocaleString() : '0'}
            </p>
          </CardContent>
        </Card>

        <Card variant="mc">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('common.season')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{t('common.current')}</p>
          </CardContent>
        </Card>
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
        <>
          <LeaderboardTable players={players} />

          {/* Pagination */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('common.previous')}
            </Button>
            <div className="flex items-center px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold">{t('common.page', { page })}</span>
            </div>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!players || players.length < PAGE_SIZE}
            >
              {t('common.next')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
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
