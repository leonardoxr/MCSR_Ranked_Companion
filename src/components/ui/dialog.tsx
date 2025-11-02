'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClose?: () => void;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onOpenChange(false);
          }
        }}
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className,
  title,
  onClose,
}: DialogContentProps) {
  const { onOpenChange } = React.useContext(DialogContext);

  return (
    <div
      className={cn(
        'mc-card relative w-full overflow-y-auto p-6 shadow-lg',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold mc-heading mc-title mc-accent-diamond">{title}</h2>
          <button
            onClick={() => {
              onClose?.();
              onOpenChange(false);
            }}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      )}
      {children}
    </div>
  );
}


