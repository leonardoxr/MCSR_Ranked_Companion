import type { MinecraftIconName } from '@/components/features/MinecraftIcon';

/**
 * Maps overworld structure types to appropriate Minecraft icons
 * @param overworldType - The overworld structure type (e.g., 'desert_temple', 'village')
 * @returns The appropriate Minecraft icon name
 */
export function getOverworldIcon(overworldType: string): MinecraftIconName {
  const normalized = overworldType.toLowerCase().replace(/[_-]/g, '_');
  
  // Map specific structure types to appropriate icons
  const iconMap: Record<string, MinecraftIconName> = {
    desert_temple: 'stone-bricks', // Temple-like structure
    village: 'oak-planks', // Village building material
    shipwreck: 'obsidian', // Dark, ocean-related
    buried_treasure: 'gold-block', // Treasure!
  };
  
  // Try to find exact match first
  if (iconMap[normalized]) {
    return iconMap[normalized];
  }
  
  // Fallback to structure-based matching
  if (normalized.includes('temple')) {
    return 'stone-bricks';
  }
  if (normalized.includes('village')) {
    return 'oak-planks';
  }
  if (normalized.includes('shipwreck') || normalized.includes('ship')) {
    return 'obsidian';
  }
  if (normalized.includes('treasure')) {
    return 'gold-block';
  }
  
  // Default to grass block for overworld structures
  return 'grass-block';
}

/**
 * Maps bastion types to appropriate Minecraft icons
 * @param bastionType - The bastion type (e.g., 'bridge', 'housing', 'treasure', 'stables')
 * @returns The appropriate Minecraft icon name
 */
export function getBastionIcon(bastionType: string): MinecraftIconName {
  const normalized = bastionType.toLowerCase().replace(/[_-]/g, '_');
  
  // Map specific bastion types to appropriate icons
  const iconMap: Record<string, MinecraftIconName> = {
    bridge: 'gilded-blackstone', // Bridge bastions are characterized by gilded blackstone
    housing: 'nether-bricks', // Housing bastions use nether brick structures
    treasure: 'gold-block', // Treasure bastions have gold!
    stables: 'gilded-blackstone', // Stables also use gilded blackstone
  };
  
  // Try to find exact match first
  if (iconMap[normalized]) {
    return iconMap[normalized];
  }
  
  // Fallback to type-based matching
  if (normalized.includes('bridge')) {
    return 'gilded-blackstone';
  }
  if (normalized.includes('treasure')) {
    return 'gold-block';
  }
  if (normalized.includes('housing') || normalized.includes('stables')) {
    return 'nether-bricks';
  }
  
  // Default to gilded blackstone for bastions
  return 'gilded-blackstone';
}

