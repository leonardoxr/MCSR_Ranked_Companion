'use client';

import * as React from 'react';
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
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <Card className={className}>
      <CardContent className="p-12">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-destructive/10 p-3 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryLabel}
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
  title = 'No data available',
  message = 'There is no data to display at the moment.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="p-12">
        <div className="flex flex-col items-center text-center">
          {icon && (
            <div className="rounded-full bg-muted p-3 mb-4 text-muted-foreground">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
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
