import type { MatchInfo } from '@/types/api';
import type { MatchFiltersState } from '@/components/features/MatchFilters';

/**
 * Filters matches based on the provided filter criteria
 * @param matches - Array of matches to filter
 * @param filters - Filter criteria to apply
 * @param currentPlayerUuid - UUID of the current player viewing the matches
 * @returns Filtered array of matches
 */
export function filterMatches(
  matches: MatchInfo[],
  filters: MatchFiltersState,
  currentPlayerUuid?: string
): MatchInfo[] {
  return matches.filter((match) => {
    // Filter by opponent name
    if (filters.opponentName) {
      const searchTerm = filters.opponentName.toLowerCase();
      const opponents = match.players.filter(
        (p) => p.uuid !== currentPlayerUuid
      );
      const hasMatchingOpponent = opponents.some((player) =>
        player.nickname.toLowerCase().includes(searchTerm)
      );
      if (!hasMatchingOpponent) return false;
    }

    // Filter by match type
    if (filters.matchType !== 'all' && match.type !== filters.matchType) {
      return false;
    }

    // Filter by overworld type
    if (
      filters.overworldType &&
      !(match.seed?.overworld
        ?.toLowerCase()
        .includes(filters.overworldType.toLowerCase()))
    ) {
      return false;
    }

    // Filter by nether type
    if (
      filters.netherType &&
      !(match.seed?.nether?.toLowerCase().includes(filters.netherType.toLowerCase()))
    ) {
      return false;
    }

    // Filter by forfeited status
    if (filters.forfeited !== 'all' && match.forfeited !== filters.forfeited) {
      return false;
    }

    // Filter by decayed status
    if (filters.decayed !== 'all' && match.decayed !== filters.decayed) {
      return false;
    }

    // Filter by date range
    if (filters.startDate) {
      const startTimestamp = new Date(filters.startDate).getTime() / 1000;
      if (match.date < startTimestamp) return false;
    }

    if (filters.endDate) {
      // Add 1 day to include the entire end date
      const endTimestamp =
        (new Date(filters.endDate).getTime() + 24 * 60 * 60 * 1000) / 1000;
      if (match.date > endTimestamp) return false;
    }

    return true;
  });
}

/**
 * Paginates an array of items
 * @param items - Array of items to paginate
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated slice of items
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
}

/**
 * Calculates total number of pages
 * @param totalItems - Total number of items
 * @param pageSize - Number of items per page
 * @returns Total number of pages
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}
