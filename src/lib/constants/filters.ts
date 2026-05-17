/**
 * Filter options for leaderboard filters
 */

export const COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'se', name: 'Sweden', flag: '🇸🇪' },
  { code: 'no', name: 'Norway', flag: '🇳🇴' },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { code: 'fi', name: 'Finland', flag: '🇫🇮' },
  { code: 'pl', name: 'Poland', flag: '🇵🇱' },
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { code: 'ru', name: 'Russia', flag: '🇷🇺' },
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'ar', name: 'Argentina', flag: '🇦🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'cl', name: 'Chile', flag: '🇨🇱' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { code: 'cn', name: 'China', flag: '🇨🇳' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'nz', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'za', name: 'South Africa', flag: '🇿🇦' },
  { code: 'il', name: 'Israel', flag: '🇮🇱' },
  { code: 'tr', name: 'Turkey', flag: '🇹🇷' },
  { code: 'be', name: 'Belgium', flag: '🇧🇪' },
  { code: 'at', name: 'Austria', flag: '🇦🇹' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'ie', name: 'Ireland', flag: '🇮🇪' },
  { code: 'gr', name: 'Greece', flag: '🇬🇷' },
  { code: 'ro', name: 'Romania', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungary', flag: '🇭🇺' },
  { code: 'sk', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'bg', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatia', flag: '🇭🇷' },
  { code: 'si', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'lt', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'lv', name: 'Latvia', flag: '🇱🇻' },
  { code: 'ee', name: 'Estonia', flag: '🇪🇪' },
  { code: 'is', name: 'Iceland', flag: '🇮🇸' },
  { code: 'ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'th', name: 'Thailand', flag: '🇹🇭' },
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'my', name: 'Malaysia', flag: '🇲🇾' },
] as const;

/**
 * Season options for the leaderboard filter
 * Generated from the current season reported by the MCSR Ranked API.
 */
export function getSeasonOptions(currentSeason: number | null | undefined) {
  if (!currentSeason || currentSeason < 1) return [];

  return Array.from({ length: currentSeason }, (_, index) => {
    const season = index + 1;
    return { value: season, label: `Season ${season}` };
  });
}
