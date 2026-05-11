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
        // Rank colors (Material Theme)
        coal: 'border-white/10 bg-rank-coal text-white hover:bg-rank-coal/90',
        iron: 'border-black/10 bg-rank-iron text-black hover:bg-rank-iron/90',
        gold: 'border-black/10 bg-rank-gold text-black hover:bg-rank-gold/90',
        emerald: 'border-black/10 bg-rank-emerald text-black hover:bg-rank-emerald/90',
        diamond: 'border-black/10 bg-rank-diamond text-black hover:bg-rank-diamond/90',
        netherite: 'border-white/10 bg-rank-netherite text-white hover:bg-rank-netherite/90',
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
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
