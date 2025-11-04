'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUserLiveMatch } from '@/lib/api/hooks/useUserLiveMatch';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Activity } from 'lucide-react';
import { formatTime } from '@/lib/utils/formatters';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';

export default function LiveMatchPage() {
  const router = useRouter();
  const t = useTranslations();
  const { username, privateKey, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated || !username) {
      router.push('/login');
    }
  }, [isAuthenticated, username, router]);

  const { data: liveMatch, isLoading, error } = useUserLiveMatch(
    username || '',
    privateKey || undefined
  );

  if (!isAuthenticated || !username) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading live match data..." />
      </div>
    );
  }

  if (error) {
    // Check if this is the specific error about not being in private room or not host/co-host
    const errorMessage = error.message || '';
    const isPrivateRoomError = 
      errorMessage.includes('Player is not in private room') ||
      errorMessage.includes('not host/co-host');

    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card variant="mc">
          <CardContent className="py-12 text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">
              {isPrivateRoomError ? 'Access Restricted' : 'Error Loading Live Match'}
            </h2>
            <p className="text-muted-foreground">
              {isPrivateRoomError
                ? 'You are not in a private room or you are not the host/co-host. Live match data is only available for private room hosts and co-hosts.'
                : errorMessage || 'Failed to load live match data'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!liveMatch) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card variant="mc">
          <CardContent className="py-12 text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Active Match</h2>
            <p className="text-muted-foreground">
              You are not currently in an active match.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTime = liveMatch.currentTime;
  const players = liveMatch.players || [];
  const playerData = liveMatch.data || {};

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Activity className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Live Match</h1>
          <p className="text-muted-foreground">Real-time match data</p>
        </div>
      </div>

      {/* Current Time */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold font-mono">
            {formatTime(currentTime)}
          </p>
        </CardContent>
      </Card>

      {/* Players */}
      <Card variant="mc">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Players ({players.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {players.map((player) => {
              const data = playerData[player.uuid];
              const isCurrentUser = player.nickname.toLowerCase() === username.toLowerCase();

              return (
                <div
                  key={player.uuid}
                  className={`p-4 border rounded-lg ${
                    isCurrentUser ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <PlayerAvatar uuid={player.uuid} username={player.nickname} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">
                            {player.nickname}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-primary">(You)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {player.eloRate ? (
                            <RankBadge elo={player.eloRate} showElo />
                          ) : (
                            <span className="text-sm text-muted-foreground">Unranked</span>
                          )}
                          {player.country && (
                            <span className="text-sm text-muted-foreground">
                              {player.country.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {data && (
                      <div className="text-right">
                        {data.timeline && (
                          <div className="space-y-1">
                            <p className="text-sm font-mono font-semibold">
                              {formatTime(data.timeline.time)}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {data.timeline.type}
                            </p>
                          </div>
                        )}
                        {data.liveUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.open(data.liveUrl!, '_blank')}
                          >
                            Watch Live
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

