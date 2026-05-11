import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getPlayoffs } from '../endpoints';
import type { PlayoffsResponse } from '@/types/api';
import type { McsrApiError } from '../client';
import { CACHE_PRESETS } from '../cache-config';

export const playoffsKeys = {
  all: ['playoffs'] as const,
  bracket: (id?: number) => [...playoffsKeys.all, 'bracket', id] as const,
};

export function usePlayoffs(
  id?: number,
  options?: Omit<UseQueryOptions<PlayoffsResponse, McsrApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<PlayoffsResponse, McsrApiError>({
    queryKey: playoffsKeys.bracket(id),
    queryFn: () => getPlayoffs(id ? { id } : undefined),
    ...CACHE_PRESETS.PLAYER_PROFILE,
    ...options,
  });
}
