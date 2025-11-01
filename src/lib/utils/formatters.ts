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
export function formatDate(timestamp: Timestamp | Date, formatStr: string = 'PPP'): string {
  const date = timestamp instanceof Date ? timestamp : timestampToDate(timestamp);
  return format(date, formatStr);
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

/**
 * Format win rate as percentage string
 */
export function formatWinRate(wins: number, losses: number, decimals: number = 1): string {
  const winRate = calculateWinRate(wins, losses);
  return winRate.toFixed(decimals);
}

/**
 * Format ELO change with sign
 */
export function formatEloChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change}`;
}
