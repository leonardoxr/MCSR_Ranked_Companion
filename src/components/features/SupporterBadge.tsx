'use client';

import * as React from 'react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { RoleType } from '@/types/api';
import { Gem, ShieldCheck } from 'lucide-react';

export interface SupporterBadgeProps {
  roleType: RoleType | number;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  linkToStore?: boolean;
}

/**
 * Supporter tier information
 */
const SUPPORTER_TIERS = {
  [RoleType.None]: null,
  [RoleType.Stone]: {
    name: 'Stone',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-400/50',
    textColor: 'text-gray-300',
    icon: '🪨',
  },
  [RoleType.Iron]: {
    name: 'Iron',
    color: 'from-slate-300 to-slate-400',
    bgColor: 'bg-slate-400/20',
    borderColor: 'border-slate-300/50',
    textColor: 'text-slate-200',
    icon: '⚙️',
  },
  [RoleType.Diamond]: {
    name: 'Diamond',
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-400/50',
    textColor: 'text-cyan-300',
    icon: '💎',
  },
} as const;

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

  const iconSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-all',
        'border bg-gradient-to-r',
        tier.bgColor,
        tier.borderColor,
        tier.textColor,
        sizeClasses[size],
        linkToStore && 'hover:brightness-125 cursor-pointer',
        className
      )}
      title={linkToStore ? `${tier.name} Supporter - Click to visit store` : `${tier.name} Supporter`}
    >
      {showIcon && (
        <span className={cn(iconSizes[size])} aria-hidden="true">
          {tier.icon}
        </span>
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
