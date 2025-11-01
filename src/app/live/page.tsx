'use client';

import * as React from 'react';
import { useLiveMatches } from '@/lib/api/hooks/useLiveMatches';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Radio, Users, Eye, MapPin, Clock, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import type { LiveMatch } from '@/types/api';

export default function LiveMatchesPage() {
  const router = useRouter();
  const { data: liveMatches, isLoading, error } = useLiveMatches();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg relative">
              <Radio className="h-8 w-8 text-red-500" />
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Live Matches</h1>
              <p className="text-muted-foreground">
                Watch ongoing matches in real-time
              </p>
            </div>
          </div>
          {liveMatches && (
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              {liveMatches.length} Live
            </Badge>
          )}
        </div>
      </div>

      {/* Live Matches */}
      {isLoading ? (
        <LoadingState message="Loading live matches..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Live Matches"
          message={error.message || 'An error occurred while fetching live matches'}
        />
      ) : liveMatches && liveMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {liveMatches.map((match) => (
            <LiveMatchCard
              key={match.id}
              match={match}
              onClick={() => router.push(`/match/${match.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Radio className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Live Matches</h3>
            <p className="text-muted-foreground">
              There are no matches currently in progress. Check back later!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Activity className="h-4 w-4 animate-pulse" />
        Auto-refreshing every 30 seconds
      </div>
    </div>
  );
}

interface LiveMatchCardProps {
  match: LiveMatch;
  onClick: () => void;
}

function LiveMatchCard({ match, onClick }: LiveMatchCardProps) {
  const router = useRouter();
  const timeSinceStart = Date.now() - match.startTime * 1000;
  const [elapsedTime, setElapsedTime] = React.useState(timeSinceStart);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - match.startTime * 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [match.startTime]);

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-red-500"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radio className="h-6 w-6 text-red-500" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <CardTitle className="text-xl">
                {match.type === 2 ? 'Ranked Match' : 'Casual Match'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Started {formatDate(new Date(match.startTime * 1000), 'relative')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-red-500">
              {formatElapsedTime(elapsedTime)}
            </div>
            <p className="text-xs text-muted-foreground">Elapsed Time</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Match Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{match.category}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{match.players.length} Players</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span>{match.spectators.length} Spectators</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-red-500 font-semibold">LIVE</span>
          </div>
        </div>

        {/* Players */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            Players
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {match.players.map((player) => (
              <div
                key={player.uuid}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/player/${player.nickname}`);
                }}
              >
                <PlayerAvatar
                  uuid={player.uuid}
                  username={player.nickname}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{player.nickname}</p>
                  {player.eloRate && (
                    <div className="flex items-center gap-2 mt-1">
                      <RankBadge elo={player.eloRate} />
                      <span className="text-xs text-muted-foreground">
                        {player.eloRate} ELO
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seed Info */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">
            Seed Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Overworld:</span>{' '}
              <span className="font-medium capitalize">
                {match.seed.overworldType}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Bastion:</span>{' '}
              <span className="font-medium capitalize">
                {match.seed.bastionType}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatElapsedTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
