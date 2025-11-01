'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  autoFocus?: boolean;
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

  return (
    <div className={cn('relative', className)}>
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
    </div>
  );
}
