'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useLiveMatches } from '@/lib/api/hooks/useLiveMatches';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';
import { CountryFlag } from '@/components/features/CountryFlag';
import { LoadingState } from '@/components/features/LoadingState';
import { ErrorState } from '@/components/features/ErrorState';
import { MinecraftIcon } from '@/components/features/MinecraftIcon';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Radio, Activity, ArrowUpDown, ExternalLink, Tv } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LiveMatch } from '@/types/api';

type SortOption = 'time' | 'elo-desc' | 'elo-asc';

// Get highest ELO among players in a match
function getMatchMaxElo(match: LiveMatch): number {
  return Math.max(...match.players.map(p => p.eloRate ?? 0));
}

// Check if any player in the match is high ELO (2000+)
function hasHighEloPlayer(match: LiveMatch): boolean {
  return match.players.some(p => (p.eloRate ?? 0) >= 2000);
}

// Map timeline event types to translation keys
function getTimelineEventKey(type: string): string {
  // Handle different event type formats:
  // "enter_nether", "story.enter_the_end", "projectelo.timeline.blind_travel"
  const cleanType = type
    .replace('projectelo.timeline.', '')
    .replace('story.', '')
    .replace('nether.', '')
    .replace('adventure.', '')
    .replace('husbandry.', '');

  // Map common event types to translation keys
  const eventMap: Record<string, string> = {
    'enter_nether': 'enter_nether',
    'enter_the_nether': 'enter_nether',
    'enter_bastion': 'enter_bastion',
    'enter_fortress': 'enter_fortress',
    'first_portal': 'first_portal',
    'second_portal': 'second_portal',
    'enter_stronghold': 'enter_stronghold',
    'enter_end': 'enter_end',
    'enter_the_end': 'enter_end',
    'finish': 'finish',
    'died': 'died',
    'blind_travel': 'blind_travel',
    'follow_ender_eye': 'follow_ender_eye',
    'iron_tools': 'story_iron_tools',
    'mine_stone': 'story_mine_stone',
    'upgrade_tools': 'story_upgrade_tools',
    'smelt_iron': 'story_smelt_iron',
    'mine_diamond': 'story_mine_diamond',
    'obtain_armor': 'story_obtain_armor',
    'lava_bucket': 'story_lava_bucket',
    'root': 'overworld',
  };

  return eventMap[cleanType] || cleanType;
}

// Get the appropriate icon for a timeline event
function getTimelineIcon(type: string): React.ReactNode {
  const cleanType = type
    .replace('projectelo.timeline.', '')
    .replace('story.', '')
    .replace('nether.', '')
    .replace('adventure.', '')
    .replace('husbandry.', '');

  // Map event types to minecraft icons
  if (cleanType.includes('nether') || cleanType === 'enter_the_nether') {
    return <MinecraftIcon name="nether-portal" size="sm" />;
  }
  if (cleanType.includes('bastion')) {
    return <MinecraftIcon name="gilded-blackstone" size="sm" />;
  }
  if (cleanType.includes('fortress')) {
    return <MinecraftIcon name="nether-bricks" size="sm" />;
  }
  if (cleanType.includes('stronghold')) {
    return <MinecraftIcon name="stone-bricks" size="sm" />;
  }
  if (cleanType.includes('enter_end') || cleanType === 'enter_the_end') {
    return <MinecraftIcon name="end-portal-frame" size="sm" />;
  }
  if (cleanType.includes('ender_eye') || cleanType === 'follow_ender_eye') {
    return <MinecraftIcon name="ender-eye" size="sm" />;
  }
  if (cleanType.includes('portal') || cleanType === 'blind_travel') {
    return <MinecraftIcon name="ender-pearl" size="sm" />;
  }
  if (cleanType === 'finish') {
    return <MinecraftIcon name="dragon-egg" size="sm" />;
  }
  if (cleanType === 'died') {
    return <MinecraftIcon name="bed" size="sm" />;
  }

  return <MinecraftIcon name="compass" size="sm" />;
}

export function LivePageClient() {
  const t = useTranslations();
  const router = useRouter();
  const { data: liveMatches, isLoading, error } = useLiveMatches();
  const [sortBy, setSortBy] = React.useState<SortOption>('elo-desc');

  // Sort matches based on selected option
  const sortedMatches = React.useMemo(() => {
    if (!liveMatches || !Array.isArray(liveMatches)) return [];

    const sorted = [...liveMatches];
    switch (sortBy) {
      case 'elo-desc':
        return sorted.sort((a, b) => getMatchMaxElo(b) - getMatchMaxElo(a));
      case 'elo-asc':
        return sorted.sort((a, b) => getMatchMaxElo(a) - getMatchMaxElo(b));
      case 'time':
      default:
        return sorted.sort((a, b) => b.currentTime - a.currentTime);
    }
  }, [liveMatches, sortBy]);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg relative">
              <Radio className="h-8 w-8 text-red-500" />
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t('live.title')}</h1>
              <p className="text-muted-foreground">
                {t('live.description')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            {Array.isArray(liveMatches) && liveMatches.length > 1 && (
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="elo-desc">{t('live.sortEloHigh')}</option>
                  <option value="elo-asc">{t('live.sortEloLow')}</option>
                  <option value="time">{t('live.sortTime')}</option>
                </select>
              </div>
            )}
            {Array.isArray(liveMatches) && liveMatches.length > 0 && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Activity className="h-4 w-4 mr-2" />
                {t('live.count', { count: liveMatches.length })}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Live Matches */}
      {isLoading ? (
        <LoadingState message={t('live.loading')} />
      ) : error ? (
        <ErrorState
          title={t('live.error')}
          message={error.message || t('live.errorMessage')}
        />
      ) : sortedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {sortedMatches.map((match, index) => {
            // Generate unique key from player UUIDs
            const matchKey = match.players.map(p => p.uuid).sort().join('-') || `match-${index}`;
            return (
              <LiveMatchCard
                key={matchKey}
                match={match}
                isHighElo={hasHighEloPlayer(match)}
              />
            );
          })}
        </div>
      ) : (
        <Card variant="mc">
          <CardContent className="py-16 text-center">
            <Radio className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{t('live.noMatches')}</h3>
            <p className="text-muted-foreground">
              {t('live.noMatchesMessage')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Activity className="h-4 w-4" />
        {t('live.autoRefresh')}
      </div>
    </div>
  );
}

interface LiveMatchCardProps {
  match: LiveMatch;
  isHighElo?: boolean;
}

function LiveMatchCard({ match, isHighElo = false }: LiveMatchCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [currentTime, setCurrentTime] = React.useState(match.currentTime);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get the furthest progress from any player
  const getFurthestProgress = () => {
    const vals = Object.values(match.data || {});
    const types = vals.map((p) => p.timeline?.type).filter(Boolean);
    if (types.length === 0) return null;
    // Return the first one for now (could be enhanced to pick the "furthest")
    return types[0];
  };

  const furthestProgress = getFurthestProgress();

  return (
    <Card
      variant="mc"
      className={`transition-all border-l-4 ${
        isHighElo
          ? 'border-l-amber-500 ring-1 ring-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent'
          : 'border-l-red-500'
      }`}
    >
      {/* Compact Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className={`h-5 w-5 ${isHighElo ? 'text-amber-500' : 'text-red-500'}`} />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${isHighElo ? 'bg-amber-500/60' : 'bg-red-500/60'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isHighElo ? 'bg-amber-500' : 'bg-red-500'}`}></span>
              </span>
            </div>
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 ${isHighElo ? 'border-amber-500/50 text-amber-500' : 'border-red-500/50 text-red-500'}`}
            >
              {t('common.live')}
            </Badge>
            {isHighElo && (
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-xs px-2 py-0.5">
                {t('live.highElo')}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className={`text-xl font-mono font-bold ${isHighElo ? 'text-amber-500' : 'text-red-500'}`}>
              {formatElapsedTime(currentTime)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Progress indicator with icon */}
        {furthestProgress && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/30 border border-border/50">
            <span className="flex-shrink-0">
              {getTimelineIcon(furthestProgress)}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {t.has(`timeline.events.${getTimelineEventKey(furthestProgress)}`)
                ? t(`timeline.events.${getTimelineEventKey(furthestProgress)}`)
                : furthestProgress.replace(/_/g, ' ').replace(/\./g, ': ')}
            </span>
          </div>
        )}

        {/* Players - Improved layout */}
        <div className="space-y-2">
          {match.players.map((player, index) => {
            const playerData = match.data[player.uuid];
            const isStreaming = !!playerData?.liveUrl;
            const isHighEloPlayer = (player.eloRate ?? 0) >= 2000;

            return (
              <div
                key={player.uuid}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
                  isHighEloPlayer
                    ? 'bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20'
                    : 'bg-muted/40 hover:bg-muted/60'
                }`}
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
                  <div className="flex items-center gap-1.5">
                    <CountryFlag country={player.country} size="sm" />
                    <span className={`font-semibold truncate text-sm ${isHighEloPlayer ? 'text-amber-400' : ''}`}>
                      {player.nickname}
                    </span>
                    {isStreaming && (
                      <Tv className="h-3 w-3 text-purple-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {player.eloRate != null && (
                      <RankBadge elo={player.eloRate} showText={false} showElo />
                    )}
                    {playerData?.timeline && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {getTimelineIcon(playerData.timeline.type)}
                        <span className="truncate max-w-[80px]">
                          {t.has(`timeline.events.${getTimelineEventKey(playerData.timeline.type)}`)
                            ? t(`timeline.events.${getTimelineEventKey(playerData.timeline.type)}`)
                            : playerData.timeline.type.replace(/_/g, ' ').replace(/\./g, ': ')}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                {/* Stream button */}
                {isStreaming ? (
                  <a
                    href={playerData.liveUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">{t('live.watch')}</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-muted-foreground/60 px-2">
                    {t('live.noStream')}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* VS indicator for 2-player matches */}
        {match.players.length === 2 && (
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground font-semibold px-3 py-0.5 bg-muted/30 rounded-full">
              {t('common.vs')}
            </span>
          </div>
        )}
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
