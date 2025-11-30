'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { PlayerAvatar } from '@/components/features/PlayerAvatar';
import { RankBadge } from '@/components/features/RankBadge';
import { CountryFlag } from '@/components/features/CountryFlag';
import { MinecraftIcon } from '@/components/features/MinecraftIcon';
import { Tv, ExternalLink, Trophy, TrendingUp, Swords, Clock, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LiveMatch } from '@/types/api';
import { cn } from '@/lib/utils';
import {
  comparePace,
  formatTimeGap,
  getProgressPercentage,
  type PaceComparison,
  type PlayerPaceInfo,
} from '@/lib/utils/liveMatchUtils';

interface LiveMatchPaceComparisonProps {
  match: LiveMatch;
  isHighElo?: boolean;
}

// Phase icon based on current phase
function getPhaseIcon(phase: string, size: 'sm' | 'md' = 'sm'): React.ReactNode {
  const sizeClass = size === 'md' ? 'md' : 'sm';
  switch (phase) {
    case 'Overworld':
      return <MinecraftIcon name="grass-block" size={sizeClass} />;
    case 'Nether':
      return <MinecraftIcon name="nether-portal" size={sizeClass} />;
    case 'Bastion':
      return <MinecraftIcon name="gilded-blackstone" size={sizeClass} />;
    case 'Fortress':
      return <MinecraftIcon name="nether-bricks" size={sizeClass} />;
    case 'Exiting Nether':
      return <MinecraftIcon name="ender-pearl" size={sizeClass} />;
    case 'Stronghold':
      return <MinecraftIcon name="stone-bricks" size={sizeClass} />;
    case 'The End':
      return <MinecraftIcon name="end-portal-frame" size={sizeClass} />;
    case 'Finished':
      return <MinecraftIcon name="dragon-egg" size={sizeClass} />;
    default:
      return <MinecraftIcon name="compass" size={sizeClass} />;
  }
}

// Progress phases for the visual bar
const PROGRESS_PHASES = [
  { name: 'OW', phase: 'Overworld', threshold: 0 },
  { name: 'N', phase: 'Nether', threshold: 20 },
  { name: 'B', phase: 'Bastion', threshold: 30 },
  { name: 'F', phase: 'Fortress', threshold: 40 },
  { name: 'SH', phase: 'Stronghold', threshold: 70 },
  { name: 'END', phase: 'The End', threshold: 80 },
];

// Visual progress comparison bar
function ProgressComparisonBar({
  player1Progress,
  player2Progress,
  player1Name,
  player2Name,
  isHighElo,
}: {
  player1Progress: number;
  player2Progress: number;
  player1Name: string;
  player2Name: string;
  isHighElo?: boolean;
}) {
  return (
    <div className="relative px-1">
      {/* Phase markers */}
      <div className="flex justify-between text-[9px] text-muted-foreground/60 mb-1">
        {PROGRESS_PHASES.map((phase) => (
          <span key={phase.name} className="w-6 text-center">{phase.name}</span>
        ))}
      </div>

      {/* Progress track */}
      <div className="relative h-6 bg-muted/30 rounded-lg overflow-hidden border border-border/50">
        {/* Phase dividers */}
        <div className="absolute inset-0 flex">
          {PROGRESS_PHASES.map((phase, i) => (
            <div
              key={phase.name}
              className="flex-1 border-r border-white/5 last:border-r-0"
            />
          ))}
        </div>

        {/* Player 1 progress (top half) */}
        <div className="absolute top-0 left-0 h-1/2 w-full">
          <div
            className={cn(
              'h-full rounded-tr-sm transition-all duration-700 ease-out',
              isHighElo
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-blue-600 to-blue-400'
            )}
            style={{ width: `${Math.max(player1Progress, 2)}%` }}
          />
          {/* Player 1 position indicator */}
          <div
            className="absolute top-0 h-full flex items-center transition-all duration-700"
            style={{ left: `${Math.max(player1Progress - 1, 0)}%` }}
          >
            <div className={cn(
              'w-2 h-2 rounded-full border-2 border-white shadow-lg',
              isHighElo ? 'bg-amber-500' : 'bg-blue-500'
            )} />
          </div>
        </div>

        {/* Player 2 progress (bottom half) */}
        <div className="absolute bottom-0 left-0 h-1/2 w-full">
          <div
            className={cn(
              'h-full rounded-br-sm transition-all duration-700 ease-out',
              isHighElo
                ? 'bg-gradient-to-r from-purple-600 to-purple-400'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
            )}
            style={{ width: `${Math.max(player2Progress, 2)}%` }}
          />
          {/* Player 2 position indicator */}
          <div
            className="absolute bottom-0 h-full flex items-center transition-all duration-700"
            style={{ left: `${Math.max(player2Progress - 1, 0)}%` }}
          >
            <div className={cn(
              'w-2 h-2 rounded-full border-2 border-white shadow-lg',
              isHighElo ? 'bg-purple-500' : 'bg-emerald-500'
            )} />
          </div>
        </div>

        {/* Center divider */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-border/50" />
      </div>

      {/* Player labels */}
      <div className="flex justify-between mt-1 text-[10px]">
        <span className={cn(
          'font-medium truncate max-w-[45%]',
          isHighElo ? 'text-amber-400' : 'text-blue-400'
        )}>
          {player1Name}
        </span>
        <span className={cn(
          'font-medium truncate max-w-[45%] text-right',
          isHighElo ? 'text-purple-400' : 'text-emerald-400'
        )}>
          {player2Name}
        </span>
      </div>
    </div>
  );
}

// Gap display badge
function GapBadge({
  leader,
  gapMilliseconds,
  gapType,
  isCompetitive,
  isHighElo,
}: {
  leader: { nickname: string } | null;
  gapMilliseconds: number | null;
  gapType: 'time' | 'progress' | 'unknown';
  isCompetitive: boolean;
  isHighElo?: boolean;
}) {
  const t = useTranslations();

  if (!leader || gapMilliseconds === null) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50">
        <Swords className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {t('live.samePhase')}
        </span>
      </div>
    );
  }

  const gapDisplay = formatTimeGap(gapMilliseconds);

  if (isCompetitive) {
    return (
      <div className={cn(
        'relative overflow-hidden rounded-lg border-2',
        'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20',
        'border-yellow-500/50'
      )}>
        {/* Animated pulse background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/20 to-yellow-500/10 animate-pulse" />

        <div className="relative flex items-center justify-center gap-3 px-4 py-2.5">
          <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
          <div className="text-center">
            <span className="text-sm font-bold text-yellow-300">
              {t('live.closeMatch')}
            </span>
            <span className="text-xs text-yellow-400/80 ml-2 font-mono">
              {gapDisplay} {gapType === 'progress' ? t('live.splitGap') : t('live.gap')}
            </span>
          </div>
          <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border',
      isHighElo
        ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/15 border-amber-500/40'
        : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
    )}>
      <Trophy className={cn(
        'h-5 w-5',
        isHighElo ? 'text-amber-400' : 'text-green-400'
      )} />
      <div className="flex items-center gap-2">
        <span className={cn(
          'font-bold',
          isHighElo ? 'text-amber-300' : 'text-green-300'
        )}>
          {leader.nickname}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className={cn(
          'font-mono text-lg font-bold',
          isHighElo ? 'text-amber-400' : 'text-green-400'
        )}>
          +{gapDisplay}
        </span>
      </div>
    </div>
  );
}

// Compact player card for the comparison
function PlayerCard({
  playerInfo,
  isLeader,
  gapDisplay,
  isHighElo,
  playerColor,
}: {
  playerInfo: PlayerPaceInfo;
  isLeader: boolean;
  gapDisplay: string | null;
  isHighElo?: boolean;
  playerColor: 'blue' | 'amber' | 'emerald' | 'purple';
}) {
  const t = useTranslations();
  const router = useRouter();
  const { player, playerData, currentPhase, splitTime } = playerInfo;
  const isStreaming = !!playerData?.liveUrl;
  const isHighEloPlayer = (player.eloRate ?? 0) >= 2000;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10 hover:bg-blue-500/15',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      accent: 'bg-blue-500',
    },
    amber: {
      bg: 'bg-amber-500/10 hover:bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      accent: 'bg-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      accent: 'bg-emerald-500',
    },
    purple: {
      bg: 'bg-purple-500/10 hover:bg-purple-500/15',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      accent: 'bg-purple-500',
    },
  };

  const colors = colorClasses[playerColor];

  return (
    <div
      className={cn(
        'relative p-3 rounded-xl transition-all cursor-pointer border-2',
        colors.bg,
        isLeader ? colors.border : 'border-transparent',
        isLeader && 'ring-1 ring-inset',
        isLeader && (playerColor === 'amber' || playerColor === 'purple' ? 'ring-amber-500/20' : 'ring-green-500/20')
      )}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/player/${player.nickname}`);
      }}
    >
      {/* Leader badge */}
      {isLeader && (
        <div className={cn(
          'absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1',
          colors.accent,
          'text-white shadow-lg'
        )}>
          <TrendingUp className="h-3 w-3" />
          {t('live.leading')}
        </div>
      )}

      {/* Main content */}
      <div className="flex items-center gap-3 mt-1">
        {/* Avatar with streaming indicator */}
        <div className="relative">
          <PlayerAvatar
            uuid={player.uuid}
            username={player.nickname}
            size="md"
          />
          {isStreaming && (
            <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-0.5">
              <Tv className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Player info */}
        <div className="flex-1 min-w-0">
          {/* Name and country */}
          <div className="flex items-center gap-1.5">
            <CountryFlag country={player.country} size="sm" />
            <span className={cn(
              'font-bold truncate',
              isHighEloPlayer ? 'text-amber-400' : colors.text
            )}>
              {player.nickname}
            </span>
          </div>

          {/* Phase with icon - more prominent */}
          <div className={cn(
            'flex items-center gap-2 mt-1.5 px-2 py-1 rounded-md',
            'bg-black/20 border border-white/5'
          )}>
            <span className="flex-shrink-0">
              {getPhaseIcon(currentPhase, 'md')}
            </span>
            <span className="text-sm font-medium text-foreground/90">
              {currentPhase}
            </span>
            {splitTime !== null && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-mono text-muted-foreground">
                  {formatSplitTime(splitTime)}
                </span>
              </>
            )}
          </div>

          {/* ELO */}
          <div className="flex items-center gap-2 mt-1.5">
            {player.eloRate != null ? (
              <>
                <RankBadge elo={player.eloRate} showText showElo={false} className="text-xs" />
                <span className="font-mono font-bold text-sm">
                  {player.eloRate.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground text-xs">{t('common.unranked')}</span>
            )}
          </div>
        </div>

        {/* Stream button or gap display */}
        <div className="flex flex-col items-end gap-2">
          {isStreaming && (
            <a
              href={playerData.liveUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t('live.watch')}
            </a>
          )}

          {/* Gap indicator for trailing player */}
          {gapDisplay && !isLeader && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
              <Clock className="h-3 w-3 text-red-400" />
              <span className="text-red-400 font-mono font-bold text-sm">-{gapDisplay}</span>
            </div>
          )}
        </div>
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
    return null;
  }

  const { player1, player2, leader, gapMilliseconds, gapType, isCompetitive } = comparison;
  const gapDisplay = gapMilliseconds !== null ? formatTimeGap(gapMilliseconds) : null;

  // Determine player colors based on high ELO status
  const player1Color = isHighElo ? 'amber' : 'blue';
  const player2Color = isHighElo ? 'purple' : 'emerald';

  const player1Progress = getProgressPercentage(player1.playerData?.timeline?.type);
  const player2Progress = getProgressPercentage(player2.playerData?.timeline?.type);

  return (
    <div className="space-y-3">
      {/* Gap indicator - prominent */}
      <GapBadge
        leader={leader}
        gapMilliseconds={gapMilliseconds}
        gapType={gapType}
        isCompetitive={isCompetitive}
        isHighElo={isHighElo}
      />

      {/* Progress comparison bar */}
      <ProgressComparisonBar
        player1Progress={player1Progress}
        player2Progress={player2Progress}
        player1Name={player1.player.nickname}
        player2Name={player2.player.nickname}
        isHighElo={isHighElo}
      />

      {/* Players */}
      <div className="space-y-2">
        <PlayerCard
          playerInfo={player1}
          isLeader={leader?.uuid === player1.player.uuid}
          gapDisplay={leader?.uuid === player2.player.uuid ? gapDisplay : null}
          isHighElo={isHighElo}
          playerColor={player1Color}
        />

        {/* VS divider */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
            <span className="text-xs text-muted-foreground font-bold px-3 py-1 bg-muted/50 rounded-full flex items-center gap-1.5 border border-border/50">
              <Swords className="h-3.5 w-3.5" />
              {t('common.vs')}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
          </div>
        </div>

        <PlayerCard
          playerInfo={player2}
          isLeader={leader?.uuid === player2.player.uuid}
          gapDisplay={leader?.uuid === player1.player.uuid ? gapDisplay : null}
          isHighElo={isHighElo}
          playerColor={player2Color}
        />
      </div>
    </div>
  );
}
