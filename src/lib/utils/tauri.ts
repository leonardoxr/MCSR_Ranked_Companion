/**
 * Utility functions for Tauri environment detection
 */

/**
 * Check if the app is running in a Tauri environment
 */
export function isTauri(): boolean {
  if (typeof window === 'undefined') return false;
  return '__TAURI__' in window || (window as any).__TAURI__ !== undefined;
}

/**
 * Get Tauri API if available
 */
export function getTauriAPI() {
  if (typeof window === 'undefined') return null;
  try {
    // Dynamic import to avoid issues when not in Tauri
    return (window as any).__TAURI__ || null;
  } catch {
    return null;
  }
}

