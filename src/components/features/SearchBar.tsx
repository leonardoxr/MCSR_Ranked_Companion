'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { PlayerNameInput } from './PlayerNameInput';

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
 * Now uses the consolidated PlayerNameInput component
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

  return (
    <PlayerNameInput
      value={value}
      onChange={onChange}
      onSelect={onSearch}
      placeholder={placeholder || defaultPlaceholder}
      className={className}
      autoFocus={autoFocus}
      showSuggestions={autoSuggest}
      variant="default"
    />
  );
}
