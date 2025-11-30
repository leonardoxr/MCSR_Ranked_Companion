'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';
import { CountryFlag } from '@/components/features/CountryFlag';
import { MinecraftIcon } from '@/components/features/MinecraftIcon';
import { Badge } from '@/components/ui';
import { Tv, ExternalLink, Trophy, TrendingUp, Swords, Clock, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LiveMatch } from '@/types/api';
import { cn } from '@/lib/utils';
import {
  comparePace,
  formatTimeGap,
  getProgressPercentage,
  getPlayerPhase,
  type PaceComparison,
  type PlayerPaceInfo,
} from '@/lib/utils/liveMatchUtils';

interface LiveMatchPaceComparisonProps {
  match: LiveMatch;
  isHighElo?: boolean;
}

// Get the appropriate icon for a timeline event
function getTimelineIcon(type: string): React.ReactNode {
  const cleanType = type
    .replace('projectelo.timeline.', '')
    .replace('story.', '')
    .replace('nether.', '')
    .replace('adventure.', '')
    .replace('husbandry.', '');

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

// Phase icon based on current phase
function getPhaseIcon(phase: string): React.ReactNode {
  switch (phase) {
    case 'Overworld':
      return <MinecraftIcon name="grass-block" size="sm" />;
    case 'Nether':
      return <MinecraftIcon name="nether-portal" size="sm" />;
    case 'Bastion':
      return <MinecraftIcon name="gilded-blackstone" size="sm" />;
    case 'Fortress':
      return <MinecraftIcon name="nether-bricks" size="sm" />;
    case 'Exiting Nether':
      return <MinecraftIcon name="ender-pearl" size="sm" />;
    case 'Stronghold':
      return <MinecraftIcon name="stone-bricks" size="sm" />;
    case 'The End':
      return <MinecraftIcon name="end-portal-frame" size="sm" />;
    case 'Finished':
      return <MinecraftIcon name="dragon-egg" size="sm" />;
    default:
      return <MinecraftIcon name="compass" size="sm" />;
  }
}

// Mini ELO bar component
function EloMiniBar({ elo }: { elo: number }) {
  const percentage = Math.min((elo / 3000) * 100, 100);

  const getBarColor = () => {
    if (elo >= 2000) return 'bg-gradient-to-r from-purple-500 to-purple-400';
    if (elo >= 1500) return 'bg-gradient-to-r from-cyan-400 to-cyan-300';
    if (elo >= 1200) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    if (elo >= 900) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    if (elo >= 600) return 'bg-gradient-to-r from-slate-400 to-slate-300';
    return 'bg-gradient-to-r from-zinc-600 to-zinc-500';
  };

  return (
    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full', getBarColor())}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Progress bar component for showing run progress
function RunProgressBar({
  progress,
  isLeader,
  isHighElo,
}: {
  progress: number;
  isLeader: boolean;
  isHighElo?: boolean;
}) {
  const getProgressColor = () => {
    if (isLeader) {
      return isHighElo
        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
        : 'bg-gradient-to-r from-green-500 to-emerald-400';
    }
    return 'bg-gradient-to-r from-slate-500 to-slate-400';
  };

  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-500', getProgressColor())}
        style={{ width: `${Math.max(progress, 2)}%` }}
      />
    </div>
  );
}

// Single player row in the comparison
function PlayerRow({
  playerInfo,
  isLeader,
  gapDisplay,
  isHighElo,
  matchData,
}: {
  playerInfo: PlayerPaceInfo;
  isLeader: boolean;
  gapDisplay: string | null;
  isHighElo?: boolean;
  matchData: LiveMatch;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { player, playerData, currentPhase, splitTime } = playerInfo;
  const isStreaming = !!playerData?.liveUrl;
  const isHighEloPlayer = (player.eloRate ?? 0) >= 2000;
  const progress = getProgressPercentage(playerData?.timeline?.type);

  return (
    <div
      className={cn(
        'p-3 rounded-lg transition-colors cursor-pointer relative overflow-hidden',
        isLeader && isHighElo
          ? 'bg-amber-500/15 hover:bg-amber-500/20 border border-amber-500/30'
          : isLeader
            ? 'bg-green-500/10 hover:bg-green-500/15 border border-green-500/20'
            : isHighEloPlayer
              ? 'bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20'
              : 'bg-muted/40 hover:bg-muted/60 border border-transparent'
      )}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/player/${player.nickname}`);
      }}
    >
      {/* Leader indicator */}
      {isLeader && (
        <div className="absolute top-0 right-0">
          <div
            className={cn(
              'px-2 py-0.5 text-[10px] font-bold rounded-bl-md',
              isHighElo
                ? 'bg-amber-500 text-amber-950'
                : 'bg-green-500 text-green-950'
            )}
          >
            <TrendingUp className="h-3 w-3 inline mr-0.5" />
            {t('live.leading')}
          </div>
        </div>
      )}

      {/* Top row: Avatar, Name, Phase, Stream button */}
      <div className="flex items-center gap-3">
        <PlayerAvatar
          uuid={player.uuid}
          username={player.nickname}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <CountryFlag country={player.country} size="sm" />
            <span
              className={cn(
                'font-semibold truncate text-sm',
                isHighEloPlayer && 'text-amber-400',
                isLeader && !isHighEloPlayer && 'text-green-400'
              )}
            >
              {player.nickname}
            </span>
            {isStreaming && (
              <Tv className="h-3 w-3 text-purple-400 flex-shrink-0" />
            )}
          </div>

          {/* Phase display */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {getPhaseIcon(currentPhase)}
              <span>{currentPhase}</span>
            </span>
            {splitTime !== null && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {formatSplitTime(splitTime)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Stream button */}
        {isStreaming && (
          <a
            href={playerData.liveUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            <span>{t('live.watch')}</span>
          </a>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-2">
        <RunProgressBar progress={progress} isLeader={isLeader} isHighElo={isHighElo} />
      </div>

      {/* Bottom row: ELO + Gap info */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        {/* ELO display */}
        {player.eloRate != null ? (
          <div className="flex items-center gap-2">
            <RankBadge elo={player.eloRate} showText showElo={false} className="text-xs" />
            <span className="text-muted-foreground text-xs">•</span>
            <span className="font-mono font-bold text-sm">
              {player.eloRate.toLocaleString()}
            </span>
            <EloMiniBar elo={player.eloRate} />
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">{t('common.unranked')}</span>
        )}

        {/* Gap display for trailing player */}
        {gapDisplay && !isLeader && (
          <div className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-red-400 font-mono">-{gapDisplay}</span>
          </div>
        )}

        {/* Current event for trailing player */}
        {playerData?.timeline && isLeader && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {getTimelineIcon(playerData.timeline.type)}
          </div>
        )}
      </div>
    </div>
  );
}

function formatSplitTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function LiveMatchPaceComparison({ match, isHighElo = false }: LiveMatchPaceComparisonProps) {
  const t = useTranslations();
  const comparison = comparePace(match);

  if (!comparison) {
    // Fallback for non-2-player matches
    return null;
  }

  const { player1, player2, leader, gapMilliseconds, gapType, isCompetitive } = comparison;
  const gapDisplay = gapMilliseconds !== null ? formatTimeGap(gapMilliseconds) : null;

  return (
    <div className="space-y-2">
      {/* Gap indicator banner */}
      {leader && gapMilliseconds !== null && (
        <div
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium',
            isCompetitive
              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              : isHighElo
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-muted/50 text-muted-foreground border border-border/50'
          )}
        >
          {isCompetitive ? (
            <>
              <Zap className="h-3.5 w-3.5" />
              <span>{t('live.closeMatch')}</span>
              <span className="font-mono">({gapDisplay} {gapType === 'progress' ? t('live.splitGap') : t('live.gap')})</span>
            </>
          ) : (
            <>
              <Trophy className="h-3.5 w-3.5" />
              <span>{leader.nickname} {t('live.leadingBy')} {gapDisplay}</span>
            </>
          )}
        </div>
      )}

      {/* Players comparison */}
      <div className="space-y-2">
        <PlayerRow
          playerInfo={player1}
          isLeader={leader?.uuid === player1.player.uuid}
          gapDisplay={leader?.uuid === player2.player.uuid ? gapDisplay : null}
          isHighElo={isHighElo}
          matchData={match}
        />

        {/* VS divider */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-border" />
            <span className="text-xs text-muted-foreground font-semibold px-2 py-0.5 bg-muted/30 rounded-full flex items-center gap-1">
              <Swords className="h-3 w-3" />
              {t('common.vs')}
            </span>
            <div className="h-px w-8 bg-border" />
          </div>
        </div>

        <PlayerRow
          playerInfo={player2}
          isLeader={leader?.uuid === player2.player.uuid}
          gapDisplay={leader?.uuid === player1.player.uuid ? gapDisplay : null}
          isHighElo={isHighElo}
          matchData={match}
        />
      </div>
    </div>
  );
}
