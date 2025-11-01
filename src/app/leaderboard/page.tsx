'use client';

import * as React from 'react';
import { useLeaderboard } from '@/lib/api/hooks/useLeaderboard';
import { LeaderboardTable } from '@/components/features/LeaderboardTable';
import { SearchBar } from '@/components/features/SearchBar';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Trophy, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 50;

export default function LeaderboardPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: players, isLoading, error } = useLeaderboard({
    page,
    count: PAGE_SIZE,
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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-muted-foreground">
                Top ranked MCSR players worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search for a player..."
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {((page - 1) * PAGE_SIZE + 1).toLocaleString()} -{' '}
              {(page * PAGE_SIZE).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Players Shown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {Array.isArray(players) ? players.length.toLocaleString() : '0'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Season
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Current</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <LoadingState message="Loading leaderboard..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Leaderboard"
          message={error.message || 'An error occurred while fetching the leaderboard'}
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
              Previous
            </Button>
            <div className="flex items-center px-4 py-2 bg-muted rounded-lg">
              <span className="font-semibold">Page {page}</span>
            </div>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!players || players.length < PAGE_SIZE}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No players found on this page
          </CardContent>
        </Card>
      )}
    </div>
  );
}
