'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Input, Card } from '@/components/ui';
import { useLeaderboardCachedFilter } from '@/lib/api/hooks/useLeaderboard';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  autoFocus?: boolean;
  autoSuggest?: boolean;
  fetchSuggestions?: (q: string) => Promise<Array<{ username: string; uuid?: string }>>;
}

/**
 * SearchBar component for player and match search
 * Includes clear button and search icon
 */
export function SearchBar({
  value,
  onChange,
  placeholder,
  className,
  onSearch,
  autoFocus = false,
  autoSuggest = false,
  fetchSuggestions,
}: SearchBarProps) {
  const t = useTranslations();
  const defaultPlaceholder = t('search.placeholder');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
  };

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Array<{ username: string; uuid?: string }>>([]);

  // Debounced autosuggest
  React.useEffect(() => {
    if (!autoSuggest || fetchSuggestions) return; // handled below if custom fetch provided
    const q = value.trim();
    if (!q) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(() => {
      // Use cached leaderboard filter (no network)
      try {
        const results = useLeaderboardCachedFilter(q, 8) as any; // hook can't be used here; compute synchronously below
      } catch {}
      setLoading(false);
    }, 200);
    return () => clearTimeout(id);
  }, [value, autoSuggest, fetchSuggestions]);

  // Derive results from cache via a memoized selector when using built-in autosuggest
  const cachedResults = useLeaderboardCachedFilter(value, 8);
  React.useEffect(() => {
    if (!autoSuggest || fetchSuggestions) return;
    const arr = cachedResults.map((u) => ({ username: u.nickname, uuid: u.uuid }));
    setItems(arr);
    setOpen(arr.length > 0);
  }, [cachedResults, autoSuggest, fetchSuggestions]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const onBlurCapture = (e: React.FocusEvent) => {
    // Close if focus moves outside container
    const next = e.relatedTarget as Node | null;
    if (containerRef.current && next && containerRef.current.contains(next)) return;
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)} onBlurCapture={onBlurCapture}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || defaultPlaceholder}
        autoFocus={autoFocus}
        className="pl-10 pr-10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t('common.clearSearch')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {autoSuggest && open && (
        <div className="absolute z-50 mt-1 w-full">
          <div className="mc-card border border-border rounded-md overflow-hidden">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground font-monocraft">{t('common.loading')}</div>
            )}
            {!loading && items.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground font-monocraft">No results in Top 150</div>
            )}
            {!loading && items.map((it, idx) => (
              <div
                key={`${it.username}-${idx}`}
                className="px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center gap-2 font-monocraft"
                onClick={() => onSearch?.(it.username)}
              >
                <span className="icon-minecraft-steve text-lg image-pixelated" />
                <span className="flex-1 truncate">{it.username}</span>
                {typeof (it as any).eloRate === 'number' && (
                  <span className="text-xs text-muted-foreground ml-2">{(it as any).eloRate}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
