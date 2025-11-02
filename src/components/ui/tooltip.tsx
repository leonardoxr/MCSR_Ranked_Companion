'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 mb-2 px-3 py-2 text-sm rounded-md shadow-lg border text-popover-foreground pointer-events-none mc-card font-monocraft',
            'min-w-[200px] max-w-[300px]',
            'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            // remove enter animations for reduced motion
            '',
            className
          )}
          style={{
            marginBottom: '8px',
          }}
        >
          {content}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(79, 195, 247, 0.2)',
            }}
          />
        </div>
      )}
    </div>
  );
}


