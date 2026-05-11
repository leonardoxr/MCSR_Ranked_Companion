'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type MinecraftIconName =
  // Nether related
  | 'nether-portal'
  | 'netherrack'
  | 'blackstone'
  | 'gilded-blackstone'
  | 'nether-bricks'
  | 'blaze-rod'
  | 'blaze-powder'
  | 'obsidian'
  | 'crying-obsidian'
  | 'crimson-fungus'
  | 'warped-fungus'
  | 'crimson-nylium'
  | 'lava'
  // End related
  | 'end-portal'
  | 'end-portal-frame'
  | 'end-stone'
  | 'end-stone-bricks'
  | 'ender-pearl'
  | 'ender-eye'
  | 'ender-chest'
  | 'dragon-egg'
  | 'dragon-head'
  | 'dragon-breath'
  | 'end-crystal'
  | 'end-rod'
  // Stronghold related
  | 'stone-bricks'
  | 'cobblestone'
  | 'spawner'
  // Overworld related
  | 'grass-block'
  | 'oak-planks'
  | 'oak-boat'
  | 'gravel'
  | 'flint'
  | 'flint-and-steel'
  | 'bucket'
  | 'compass'
  // Blocks
  | 'diamond-block'
  | 'gold-block'
  | 'iron-block'
  | 'netherite-block'
  // Items
  | 'bow'
  | 'arrow'
  | 'bed'
  | 'string'
  | 'clock'
  | 'gold-ingot'
  | 'gold-nugget'
  | 'golden-apple'
  | 'golden-axe'
  | 'golden-pickaxe'
  | 'golden-sword'
  // Pickaxes (for rank icons)
  | 'wooden-pickaxe'
  | 'stone-pickaxe'
  | 'iron-pickaxe'
  | 'diamond-pickaxe'
  | 'netherite-pickaxe'
  | 'copper-pickaxe';

export interface MinecraftIconProps {
  name: MinecraftIconName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

/**
 * MinecraftIcon component that displays Minecraft item/block icons using the sprite sheet
 * Uses the icons-minecraft-229 CSS sprite sheet from public/icons
 *
 * Sizes:
 * - sm: 16x16px (uses icon-minecraft-sm class)
 * - md: 32x32px (uses icon-minecraft class)
 * - lg: 32x32px scaled to 48px (uses icon-minecraft class with transform)
 */
export function MinecraftIcon({
  name,
  size = 'md',
  className,
  title,
}: MinecraftIconProps) {
  // Determine whether to use small or regular icon class based on size
  // sm = 16px, md/lg = 32px base (lg gets scaled)
  const baseClass = size === 'sm' ? 'icon-minecraft-sm' : 'icon-minecraft';
  const iconClass = `icon-minecraft-${name}`;
  const scaleClass = size === 'lg' ? 'scale-150' : '';

  return (
    <i
      className={cn(baseClass, iconClass, scaleClass, 'inline-block', className)}
      title={title || name}
      aria-label={title || name}
      role="img"
      data-icon={name}
    />
  );
}
