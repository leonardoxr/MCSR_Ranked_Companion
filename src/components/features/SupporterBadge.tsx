'use client';

import * as React from 'react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { RoleType } from '@/types/api';
import { MinecraftIcon, type MinecraftIconName } from './MinecraftIcon';

export interface SupporterBadgeProps {
  roleType: RoleType | number;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  linkToStore?: boolean;
}

/**
 * Supporter tier information - based on Minecraft pickaxes
 * Stone Pickaxe, Iron Pickaxe, Diamond Pickaxe
 */
const SUPPORTER_TIERS: Record<number, { name: string; bgColor: string; borderColor: string; textColor: string; pickaxe: MinecraftIconName } | null> = {
  [RoleType.None]: null,
  [RoleType.Stone]: {
    name: 'Stone',
    bgColor: 'bg-stone-500/20',
    borderColor: 'border-stone-400/50',
    textColor: 'text-stone-300',
    pickaxe: 'stone-pickaxe',
  },
  [RoleType.Iron]: {
    name: 'Iron',
    bgColor: 'bg-slate-400/20',
    borderColor: 'border-slate-300/50',
    textColor: 'text-slate-200',
    pickaxe: 'iron-pickaxe',
  },
  [RoleType.Diamond]: {
    name: 'Diamond',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-400/50',
    textColor: 'text-cyan-300',
    pickaxe: 'diamond-pickaxe',
  },
};

/**
 * SupporterBadge component for displaying player supporter tier
 * Shows Stone, Iron, or Diamond supporter badge with link to store
 */
export function SupporterBadge({
  roleType,
  className,
  showIcon = true,
  showText = true,
  size = 'md',
  linkToStore = true,
}: SupporterBadgeProps) {
  const tier = SUPPORTER_TIERS[roleType as RoleType];

  // Don't render anything for non-supporters
  if (!tier) return null;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2 py-0.5 gap-1',
    lg: 'text-sm px-2.5 py-1 gap-1.5',
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-all',
        'border',
        tier.bgColor,
        tier.borderColor,
        tier.textColor,
        sizeClasses[size],
        linkToStore && 'hover:brightness-125 cursor-pointer',
        className
      )}
      title={linkToStore ? `${tier.name} Pickaxe Supporter - Click to visit store` : `${tier.name} Pickaxe Supporter`}
    >
      {showIcon && (
        <MinecraftIcon name={tier.pickaxe} size="sm" className="flex-shrink-0" />
      )}
      {showText && <span>{tier.name}</span>}
    </span>
  );

  if (linkToStore) {
    return (
      <a
        href="https://store.mcsrranked.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
        onClick={(e) => e.stopPropagation()}
      >
        {badge}
      </a>
    );
  }

  return badge;
}

/**
 * Get supporter tier info without rendering
 */
export function getSupporterTier(roleType: RoleType | number) {
  return SUPPORTER_TIERS[roleType as RoleType];
}

/**
 * Check if a player is a supporter
 */
export function isSupporter(roleType: RoleType | number): boolean {
  return roleType > RoleType.None;
}
