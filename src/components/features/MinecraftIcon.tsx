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

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * MinecraftIcon component that displays Minecraft item/block icons using the sprite sheet
 * Uses the icons-minecraft-229 CSS sprite sheet from public/icons
 */
export function MinecraftIcon({
  name,
  size = 'md',
  className,
  title,
}: MinecraftIconProps) {
  // Determine whether to use small or regular icon class based on size
  const baseClass = size === 'sm' ? 'icon-minecraft-sm' : 'icon-minecraft';
  const iconClass = `${baseClass} icon-minecraft-${name}`;

  return (
    <i
      className={cn(iconClass, sizeClasses[size], 'inline-block', className)}
      title={title}
      aria-label={title || name}
      role="img"
    />
  );
}
