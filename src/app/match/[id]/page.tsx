'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatch } from '@/lib/api/hooks/useMatches';
import { MatchCard } from '@/components/features/MatchCard';
import { MatchTimeline } from '@/components/features/MatchTimeline';
import { PlayerCard } from '@/components/features/PlayerCard';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import {
  ArrowLeft,
  Trophy,
  Users,
  Eye,
  Calendar,
  MapPin,
  Crown,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { getRankTier } from '@/lib/utils/colors';

export default function MatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.id as string;

  const { data: match, isLoading, error } = useMatch(matchId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState message="Loading match details..." />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Match Not Found"
          message={error?.message || `Could not find match "${matchId}"`}
        />
      </div>
    );
  }

  const winner = match.result;
  const winnerProfile = match.players.find((p) => p.uuid === winner.uuid);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Match Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Match Details</h1>
            <p className="text-muted-foreground">
              {formatDate(new Date(match.date * 1000), 'long')}
            </p>
          </div>
        </div>
      </div>

      {/* Match Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Winner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{winnerProfile?.nickname || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(winner.time)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{match.players.length}</p>
            <p className="text-sm text-muted-foreground">
              {match.spectators.length} spectators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Season
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">Season {match.season}</p>
            <p className="text-sm text-muted-foreground">
              Rank #{match.rank.season.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold capitalize">{match.category}</p>
            <p className="text-sm text-muted-foreground">
              {match.forfeited ? 'Forfeited' : match.decayed ? 'Decayed' : 'Completed'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Match Card */}
      <MatchCard match={match} />

      {/* Players and ELO Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Players & ELO Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {match.players.map((player) => {
              const eloChange = match.changes.find((c) => c.uuid === player.uuid);
              const isWinner = player.uuid === winner.uuid;

              return (
                <div
                  key={player.uuid}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/player/${player.nickname}`)}
                >
                  <div className="flex items-center gap-4">
                    {isWinner && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-semibold text-lg">{player.nickname}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.eloRate ? `${player.eloRate} ELO` : 'Unranked'}
                        {player.eloRank ? ` • #${player.eloRank.toLocaleString()}` : ''}
                      </p>
                    </div>
                  </div>
                  {eloChange && (
                    <div className="text-right">
                      <div className={`flex items-center gap-1 font-semibold ${
                        eloChange.change > 0 ? 'text-green-500' : 'text-destructive'
                      }`}>
                        {eloChange.change > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {eloChange.change > 0 ? '+' : ''}{eloChange.change}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {eloChange.eloRate} ELO
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Seed Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seed Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Seed ID</p>
              <p className="font-mono font-semibold">{match.seed.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overworld Type</p>
              <p className="font-semibold capitalize">{match.seed.overworldType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bastion Type</p>
              <p className="font-semibold capitalize">{match.seed.bastionType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">End Tower Heights</p>
              <p className="font-mono text-sm">
                {match.seed.endTowerHeights.join(', ')}
              </p>
            </div>
          </div>
          {match.seed.variations && match.seed.variations.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Variations</p>
              <div className="flex flex-wrap gap-2">
                {match.seed.variations.map((variation, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {variation}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      {match.timelines && match.timelines.length > 0 && (
        <MatchTimeline events={match.timelines} />
      )}

      {/* Completions */}
      {match.completions && match.completions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {match.completions.map((completion, idx) => {
                const player = match.players.find((p) => p.uuid === completion.uuid);
                return (
                  <div
                    key={`${completion.uuid}-${idx}`}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <span className="font-semibold">
                      {player?.nickname || 'Unknown Player'}
                    </span>
                    <span className="text-sm font-mono">
                      {formatTime(completion.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* VOD Link */}
      {match.vod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Watch VOD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={match.vod}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {match.vod}
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
