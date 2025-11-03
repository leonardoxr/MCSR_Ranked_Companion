'use client';

import * as React from 'react';
import { Input } from '@/components/ui';
import { useLeaderboardCachedFilter } from '@/lib/api/hooks/useLeaderboard';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlayerNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (username: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  variant?: 'default' | 'header';
}

/**
 * Consolidated PlayerNameInput component with autocomplete suggestions
 * Properly handles click-outside, focus/blur, and escape key
 */
export function PlayerNameInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search player...',
  className,
  autoFocus = false,
  showSuggestions = true,
  variant = 'default',
}: PlayerNameInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Get suggestions from cache
  const suggestions = useLeaderboardCachedFilter(value.trim(), 8);

  // Update open state based on focus and suggestions
  React.useEffect(() => {
    if (isFocused && showSuggestions && value.trim() && suggestions.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isFocused, showSuggestions, value, suggestions.length]);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSelect?.(value.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (username: string) => {
    onChange(username);
    onSelect?.(username);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't blur if clicking on a suggestion
    const relatedTarget = e.relatedTarget as Node | null;
    if (containerRef.current && relatedTarget && containerRef.current.contains(relatedTarget)) {
      return;
    }
    setIsFocused(false);
    setIsOpen(false);
  };

  const inputClassName = variant === 'header'
    ? 'h-9 w-40 sm:w-56 bg-white/5 text-white placeholder:text-white/50 border-white/10 font-monocraft text-sm'
    : 'pl-10 pr-10';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {variant === 'default' && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
      )}

      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
      />

      {value && (
        <button
          onClick={handleClear}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 transition-colors z-10",
            variant === 'header'
              ? "right-3 text-white/50 hover:text-white"
              : "right-3 text-muted-foreground hover:text-foreground"
          )}
          aria-label="Clear search"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showSuggestions && isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full">
          <div className={cn(
            "border rounded-md overflow-hidden shadow-lg",
            variant === 'header'
              ? "mc-card border-white/10"
              : "mc-card border-border"
          )}>
            {suggestions.map((user, idx) => (
              <div
                key={`${user.uuid || user.nickname}-${idx}`}
                className="px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center gap-2 font-monocraft transition-colors"
                onMouseDown={(e) => {
                  // Prevent blur event
                  e.preventDefault();
                  handleSuggestionClick(user.nickname);
                }}
              >
                <span className="icon-minecraft-steve text-lg image-pixelated" />
                <span className="flex-1 truncate">{user.nickname}</span>
                {typeof user.eloRate === 'number' && (
                  <span className={cn(
                    "text-xs ml-2",
                    variant === 'header' ? "text-white/60" : "text-muted-foreground"
                  )}>
                    {user.eloRate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
