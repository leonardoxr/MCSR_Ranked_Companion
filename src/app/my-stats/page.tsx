'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';

/**
 * This page has been consolidated into the player page.
 * Users are now redirected to /player/[username] which handles both
 * viewing other players and viewing your own stats (with extra features
 * like logout button and personalized insights).
 */
export default function MyStatsPage() {
  const router = useRouter();
  const { username, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated || !username) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else {
      // Redirect to player page with username
      router.push(`/player/${username}`);
    }
  }, [isAuthenticated, username, router]);

  // Return null while redirecting
  return null;
}
