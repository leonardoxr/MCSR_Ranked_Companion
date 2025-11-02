import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/api/endpoints';

// GET /api/search/player?q=NAME&limit=8
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10) || 8, 25);
  if (!q) return NextResponse.json([], { status: 200 });

  try {
    // Fetch first page of leaderboard; client library will call backend base URL
    const users = await getLeaderboard({ page: 1, pageSize: 100 });
    // Filter by nickname includes (case-insensitive). Adjust to startsWith if preferred.
    const lower = q.toLowerCase();
    const filtered = users.filter(u => u.nickname?.toLowerCase().includes(lower));
    const mapped = filtered.slice(0, limit).map(u => ({ username: u.nickname, uuid: u.uuid }));
    return NextResponse.json(mapped, { status: 200 });
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

