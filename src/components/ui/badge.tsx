import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-monocraft',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-[0_0_0_1px_rgba(79,195,247,0.15)]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Rank colors
        coal: 'border-transparent bg-rank-coal text-white',
        iron: 'border-transparent bg-rank-iron text-white',
        gold: 'border-transparent bg-rank-gold text-white',
        emerald: 'border-transparent bg-rank-emerald text-white',
        diamond: 'border-transparent bg-rank-diamond text-white',
        netherite: 'border-transparent bg-rank-netherite text-white',
        // Match types
        ranked: 'border-transparent bg-[hsl(var(--emerald))] text-black',
        casual: 'border-transparent bg-[hsl(var(--diamond))] text-black',
        private: 'border-transparent bg-[hsl(var(--gold))] text-black',
        event: 'border-transparent bg-[hsl(var(--redstone))] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
