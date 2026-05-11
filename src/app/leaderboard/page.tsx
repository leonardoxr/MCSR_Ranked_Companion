import { redirect } from 'next/navigation';

// Leaderboard is now the main page - redirect to homepage
export default function LeaderboardPage() {
  redirect('/');
}
