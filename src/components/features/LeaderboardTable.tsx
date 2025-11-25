'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { PlayerAvatar } from './PlayerAvatar';
import { RankBadge } from './RankBadge';
import { CountryFlag } from './CountryFlag';
import { cn } from '@/lib/utils';
import type { LeaderboardUser } from '@/types/api';
import { Crown, Medal, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';

export interface LeaderboardTableProps {
  players: LeaderboardUser[];
  className?: string;
  highlightPlayer?: string; // UUID to highlight
  showRankChange?: boolean;
}

/**
 * LeaderboardTable component for displaying ranked players
 * Shows rank, player info, ELO, stats, and rank changes
 */
export function LeaderboardTable({
  players,
  className,
  highlightPlayer,
  showRankChange = false,
}: LeaderboardTableProps) {
  const t = useTranslations();

  // Split top 3 from rest for special treatment
  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top 3 Podium Section */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reorder for desktop: 2nd, 1st, 3rd */}
          {[topThree[1], topThree[0], topThree[2]].filter(Boolean).map((player, displayIndex) => {
            if (!player) return null;
            const actualRank = player.eloRank || (displayIndex === 1 ? 1 : displayIndex === 0 ? 2 : 3);
            const isHighlighted = player.uuid === highlightPlayer;
            const playerUrl = `/player/${encodeURIComponent(player.nickname)}?matches=ranked&sort=newest`;

            return (
              <TopPlayerCard
                key={player.uuid}
                player={player}
                rank={actualRank}
                isHighlighted={isHighlighted}
                playerUrl={playerUrl}
                showRankChange={showRankChange}
                isFirst={actualRank === 1}
              />
            );
          })}
        </div>
      )}

      {/* Rest of Leaderboard */}
      {restOfPlayers.length > 0 && (
        <Card variant="mc" className="overflow-hidden">
          <CardContent className="p-0">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="col-span-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('leaderboard.table.rank')}
              </div>
              <div className="col-span-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('leaderboard.table.player')}
              </div>
              <div className="col-span-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('leaderboard.table.tier')}
              </div>
              <div className="col-span-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('leaderboard.table.elo')}
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/5">
              {restOfPlayers.map((player, index) => {
                const isHighlighted = player.uuid === highlightPlayer;
                const playerUrl = `/player/${encodeURIComponent(player.nickname)}?matches=ranked&sort=newest`;
                const isEven = index % 2 === 0;

                return (
                  <LeaderboardRow
                    key={player.uuid}
                    player={player}
                    isHighlighted={isHighlighted}
                    isEven={isEven}
                    playerUrl={playerUrl}
                    showRankChange={showRankChange}
                    animationDelay={index * 30}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {players.length === 0 && (
        <Card variant="mc">
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('leaderboard.noPlayersFound')}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface TopPlayerCardProps {
  player: LeaderboardUser;
  rank: number;
  isHighlighted: boolean;
  playerUrl: string;
  showRankChange: boolean;
  isFirst: boolean;
}

function TopPlayerCard({ player, rank, isHighlighted, playerUrl, showRankChange, isFirst }: TopPlayerCardProps) {
  const t = useTranslations();

  const getRankStyles = () => {
    switch (rank) {
      case 1:
        return {
          gradient: 'from-yellow-500/20 via-amber-500/10 to-yellow-600/20',
          border: 'border-yellow-500/50',
          glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
          icon: <Crown className="h-6 w-6 text-yellow-400" />,
          badge: 'bg-gradient-to-br from-yellow-400 to-amber-500',
          textGlow: 'drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]',
        };
      case 2:
        return {
          gradient: 'from-slate-400/20 via-gray-400/10 to-slate-500/20',
          border: 'border-slate-400/50',
          glow: 'shadow-[0_0_20px_rgba(148,163,184,0.2)]',
          icon: <Medal className="h-5 w-5 text-slate-300" />,
          badge: 'bg-gradient-to-br from-slate-300 to-slate-400',
          textGlow: '',
        };
      case 3:
        return {
          gradient: 'from-amber-700/20 via-orange-700/10 to-amber-800/20',
          border: 'border-amber-600/50',
          glow: 'shadow-[0_0_20px_rgba(180,83,9,0.2)]',
          icon: <Medal className="h-5 w-5 text-amber-500" />,
          badge: 'bg-gradient-to-br from-amber-500 to-amber-700',
          textGlow: '',
        };
      default:
        return {
          gradient: '',
          border: 'border-white/10',
          glow: '',
          icon: null,
          badge: 'bg-muted',
          textGlow: '',
        };
    }
  };

  const styles = getRankStyles();

  return (
    <Link
      href={playerUrl}
      className={cn(
        'group relative block rounded-xl overflow-hidden transition-all duration-300',
        'bg-gradient-to-b', styles.gradient,
        'border', styles.border,
        styles.glow,
        isFirst && 'md:-mt-4 md:mb-4',
        'hover:scale-[1.02] hover:brightness-110',
        isHighlighted && 'ring-2 ring-primary'
      )}
    >
      {/* Animated background shimmer for 1st place */}
      {rank === 1 && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}

      <div className="relative p-4 md:p-6">
        {/* Rank Badge */}
        <div className="absolute top-3 right-3">
          <div className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg',
            styles.badge,
            'shadow-lg'
          )}>
            {rank === 1 ? styles.icon : `#${rank}`}
          </div>
        </div>

        {/* Player Info */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Avatar with glow effect */}
          <div className={cn(
            'relative',
            rank === 1 && 'animate-pulse-slow'
          )}>
            {rank === 1 && (
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-full blur-md" />
            )}
            <div className="relative">
              <PlayerAvatar
                uuid={player.uuid}
                username={player.nickname}
                size="lg"
                priority // Top 3 are above the fold, load eagerly
              />
            </div>
          </div>

          {/* Name and Country */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <CountryFlag country={player.country} size="sm" />
              <span className={cn(
                'font-bold text-lg group-hover:text-primary transition-colors',
                styles.textGlow
              )}>
                {player.nickname}
              </span>
            </div>
          </div>

          {/* Tier and ELO */}
          <div className="flex flex-col items-center gap-2">
            {player.eloRate && (
              <>
                <RankBadge
                  elo={player.eloRate}
                  showText
                  showElo={false}
                  className="scale-110"
                />
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="font-mono font-bold text-xl text-white">
                    {player.eloRate.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">ELO</span>
                </div>
              </>
            )}
          </div>

          {showRankChange && (
            <RankChangeIndicator change={0} />
          )}
        </div>
      </div>
    </Link>
  );
}

interface LeaderboardRowProps {
  player: LeaderboardUser;
  isHighlighted: boolean;
  isEven: boolean;
  playerUrl: string;
  showRankChange: boolean;
  animationDelay: number;
}

function LeaderboardRow({
  player,
  isHighlighted,
  isEven,
  playerUrl,
  showRankChange,
  animationDelay
}: LeaderboardRowProps) {
  const t = useTranslations();

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Desktop Row */}
      <Link
        href={playerUrl}
        className={cn(
          'hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 transition-all duration-200',
          'hover:bg-white/[0.03] hover:shadow-[inset_0_0_30px_rgba(0,229,255,0.03)]',
          'group cursor-pointer',
          isEven ? 'bg-white/[0.01]' : 'bg-transparent',
          isHighlighted && 'bg-primary/10 hover:bg-primary/15'
        )}
      >
        {/* Rank */}
        <div className="col-span-1 flex items-center">
          <span className="font-mono font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
            #{player.eloRank?.toLocaleString()}
          </span>
        </div>

        {/* Player */}
        <div className="col-span-5 flex items-center gap-3 min-w-0">
          <div className="relative">
            <PlayerAvatar
              uuid={player.uuid}
              username={player.nickname}
              size="sm"
            />
            <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 blur-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CountryFlag country={player.country} size="sm" />
              <span className="font-semibold truncate group-hover:text-primary transition-colors">
                {player.nickname}
              </span>
            </div>
            {showRankChange && player.eloRank && (
              <RankChangeIndicator change={0} />
            )}
          </div>
        </div>

        {/* Tier */}
        <div className="col-span-3 flex items-center">
          {player.eloRate ? (
            <RankBadge elo={player.eloRate} showText showElo={false} />
          ) : (
            <span className="text-muted-foreground">{t('common.unranked')}</span>
          )}
        </div>

        {/* ELO with visual bar */}
        <div className="col-span-3 flex items-center gap-3">
          {player.eloRate ? (
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-white group-hover:text-primary transition-colors">
                {player.eloRate.toLocaleString()}
              </span>
              <EloMiniBar elo={player.eloRate} />
            </div>
          ) : (
            <span className="font-semibold text-lg">{t('common.unranked')}</span>
          )}
        </div>
      </Link>

      {/* Mobile Card View */}
      <Link
        href={playerUrl}
        className={cn(
          'block md:hidden p-4 transition-all duration-200',
          'hover:bg-white/[0.03] active:bg-white/[0.05]',
          isEven ? 'bg-white/[0.01]' : 'bg-transparent',
          isHighlighted && 'bg-primary/10'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Rank */}
          <div className="flex-shrink-0 w-12 text-center">
            <span className="font-mono font-semibold text-muted-foreground">
              #{player.eloRank?.toLocaleString()}
            </span>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <PlayerAvatar
              uuid={player.uuid}
              username={player.nickname}
              size="sm"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <CountryFlag country={player.country} size="sm" />
              <span className="font-semibold truncate">
                {player.nickname}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {player.eloRate ? (
                <>
                  <RankBadge
                    elo={player.eloRate}
                    showText
                    showElo={false}
                    className="text-xs"
                  />
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="font-mono font-bold text-sm">
                    {player.eloRate.toLocaleString()} ELO
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">{t('common.unranked')}</span>
              )}
            </div>
            {showRankChange && player.eloRank && (
              <RankChangeIndicator change={0} />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

interface EloMiniBarProps {
  elo: number;
}

function EloMiniBar({ elo }: EloMiniBarProps) {
  // Map ELO to percentage (0-3000 range, capped at 100%)
  const percentage = Math.min((elo / 3000) * 100, 100);

  // Determine color based on rank tier
  const getBarColor = () => {
    if (elo >= 2000) return 'bg-gradient-to-r from-purple-500 to-purple-400'; // Netherite
    if (elo >= 1500) return 'bg-gradient-to-r from-cyan-400 to-cyan-300'; // Diamond
    if (elo >= 1200) return 'bg-gradient-to-r from-emerald-500 to-emerald-400'; // Emerald
    if (elo >= 900) return 'bg-gradient-to-r from-yellow-500 to-yellow-400'; // Gold
    if (elo >= 600) return 'bg-gradient-to-r from-slate-400 to-slate-300'; // Iron
    return 'bg-gradient-to-r from-zinc-600 to-zinc-500'; // Coal
  };

  return (
    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-500', getBarColor())}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface RankChangeIndicatorProps {
  change: number;
}

function RankChangeIndicator({ change }: RankChangeIndicatorProps) {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        <span>+{change}</span>
      </div>
    );
  }
  if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-red-400">
        <TrendingDown className="h-3 w-3" />
        <span>{change}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />
      <span>0</span>
    </div>
  );
}
