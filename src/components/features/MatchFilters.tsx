'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Input, Button } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchType } from '@/types/api';

export interface MatchFiltersState {
  opponentName: string;
  matchType: MatchType | 'all';
  overworldType: string;
  netherType: string;
  forfeited: boolean | 'all';
  decayed: boolean | 'all';
  startDate: string;
  endDate: string;
}

export const defaultFilters: MatchFiltersState = {
  opponentName: '',
  matchType: 'all',
  overworldType: '',
  netherType: '',
  forfeited: 'all',
  decayed: 'all',
  startDate: '',
  endDate: '',
};

export interface MatchFiltersProps {
  filters: MatchFiltersState;
  onFiltersChange: (filters: MatchFiltersState) => void;
  className?: string;
}

/**
 * MatchFilters component for filtering match lists
 * Provides controls for filtering by opponent, match type, seed, date, and status
 */
export function MatchFilters({
  filters,
  onFiltersChange,
  className,
}: MatchFiltersProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const updateFilter = <K extends keyof MatchFiltersState>(
    key: K,
    value: MatchFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.opponentName !== '' ||
      filters.matchType !== 'all' ||
      filters.overworldType !== '' ||
      filters.netherType !== '' ||
      filters.forfeited !== 'all' ||
      filters.decayed !== 'all' ||
      filters.startDate !== '' ||
      filters.endDate !== ''
    );
  }, [filters]);

  const clearFilters = () => {
    onFiltersChange(defaultFilters);
  };

  const matchTypeOptions = [
    { value: 'all', label: t('filters.matchType.all') },
    { value: MatchType.Ranked, label: t('match.types.ranked') },
    { value: MatchType.Casual, label: t('match.types.casual') },
    { value: MatchType.Private, label: t('match.types.private') },
    { value: MatchType.Event, label: t('match.types.event') },
  ];

  const booleanOptions = [
    { value: 'all', label: t('filters.all') },
    { value: 'true', label: t('filters.yes') },
    { value: 'false', label: t('filters.no') },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Opponent Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('filters.searchOpponent')}
            value={filters.opponentName}
            onChange={(e) => updateFilter('opponentName', e.target.value)}
            className="pl-9 pr-9"
          />
          {filters.opponentName && (
            <button
              onClick={() => updateFilter('opponentName', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={t('common.clear')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Match Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px] justify-between">
              {filters.matchType === 'all'
                ? t('filters.matchType.all')
                : matchTypeOptions.find((o) => o.value === filters.matchType)
                    ?.label}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {matchTypeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() =>
                  updateFilter(
                    'matchType',
                    option.value === 'all' ? 'all' : (option.value as MatchType)
                  )
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Toggle Advanced Filters */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-w-[140px]"
        >
          <Filter className="h-4 w-4 mr-2" />
          {isExpanded ? t('filters.hideAdvanced') : t('filters.showAdvanced')}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            {t('filters.clearAll')}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-lg border border-border bg-muted/20">
          {/* Seed Filters */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('filters.overworldType')}
            </label>
            <Input
              type="text"
              placeholder={t('filters.anyType')}
              value={filters.overworldType}
              onChange={(e) => updateFilter('overworldType', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('filters.netherType')}
            </label>
            <Input
              type="text"
              placeholder={t('filters.anyType')}
              value={filters.netherType}
              onChange={(e) => updateFilter('netherType', e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('filters.startDate')}
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter('startDate', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('filters.endDate')}
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter('endDate', e.target.value)}
            />
          </div>

          {/* Status Filters */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('filters.forfeited')}
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {booleanOptions.find(
                    (o) => o.value === String(filters.forfeited)
                  )?.label || t('filters.all')}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                {booleanOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      updateFilter(
                        'forfeited',
                        option.value === 'all'
                          ? 'all'
                          : option.value === 'true'
                      )
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t('filters.decayed')}
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {booleanOptions.find((o) => o.value === String(filters.decayed))
                    ?.label || t('filters.all')}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                {booleanOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      updateFilter(
                        'decayed',
                        option.value === 'all' ? 'all' : option.value === 'true'
                      )
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}
