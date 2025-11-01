'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  className?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * ErrorState component for displaying error messages
 * Includes optional retry button
 */
export function ErrorState({
  className,
  title,
  message,
  onRetry,
  retryLabel,
}: ErrorStateProps) {
  const t = useTranslations();

  return (
    <Card className={className}>
      <CardContent className="p-12">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title || t('errors.somethingWentWrong')}</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{message || t('errors.loadingError')}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryLabel || t('common.tryAgain')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * EmptyState component for displaying when no data is available
 */
export interface EmptyStateProps {
  className?: string;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  className,
  title,
  message,
  icon,
  action,
}: EmptyStateProps) {
  const t = useTranslations();

  return (
    <Card className={className}>
      <CardContent className="p-12">
        <div className="flex flex-col items-center text-center">
          {icon && (
            <div className="rounded-full bg-muted p-3 mb-4 text-muted-foreground">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{title || t('common.noDataAvailable')}</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{message || t('common.noDataMessage')}</p>
          {action && (
            <Button onClick={action.onClick} variant="default">
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
