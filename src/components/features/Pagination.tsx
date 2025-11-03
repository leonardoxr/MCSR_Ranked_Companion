'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

/**
 * Pagination component for navigating through pages
 * Provides page navigation with first, previous, next, and last controls
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  const t = useTranslations();

  if (totalPages <= 1) return null;

  // Calculate page numbers to display
  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the start or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          aria-label={t('pagination.firstPage')}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Previous Page */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t('common.previous')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages[0] > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              className="hidden sm:inline-flex"
            >
              1
            </Button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[40px]',
              currentPage === page && 'pointer-events-none'
            )}
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              className="hidden sm:inline-flex"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      {/* Next Page */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t('common.next')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          aria-label={t('pagination.lastPage')}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}

      {/* Page Info */}
      <div className="ml-4 text-sm text-muted-foreground font-monocraft hidden md:block">
        {t('pagination.pageInfo', { current: currentPage, total: totalPages })}
      </div>
    </div>
  );
}
