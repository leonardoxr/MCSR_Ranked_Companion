'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { LocaleProvider } from '@/i18n/LocaleProvider';

/**
 * Providers component with smart cache configuration
 *
 * Default options serve as fallback for any queries not using specific cache presets.
 * Individual hooks override these with optimized cache strategies based on data type.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Conservative defaults - individual hooks override with optimal settings
            staleTime: 5 * 60 * 1000, // 5 minutes (fallback for unconfigured queries)
            gcTime: 10 * 60 * 1000, // 10 minutes - keep data in memory longer
            refetchOnWindowFocus: false, // Don't auto-refetch by default
            refetchOnReconnect: true, // Do refetch when connection is restored
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </LocaleProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
