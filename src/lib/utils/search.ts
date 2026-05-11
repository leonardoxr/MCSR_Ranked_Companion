import { getLeaderboard } from '@/lib/api/endpoints';

/**
 * Client-side player search function
 * This works in both web and Tauri environments (no API route needed)
 */
export async function searchPlayers(query: string, limit: number = 8): Promise<Array<{ username: string; uuid?: string }>> {
  const q = query.trim();
  if (!q) return [];

  try {
    // Fetch first page of leaderboard
    const users = await getLeaderboard({ page: 1, count: 100 });
    
    // Filter by nickname includes (case-insensitive)
    const lower = q.toLowerCase();
    const filtered = users.filter(u => u.nickname?.toLowerCase().includes(lower));
    
    // Map to expected format and limit results
    const mapped = filtered.slice(0, limit).map(u => ({ 
      username: u.nickname, 
      uuid: u.uuid 
    }));
    
    return mapped;
  } catch (e) {
    return [];
  }
}

