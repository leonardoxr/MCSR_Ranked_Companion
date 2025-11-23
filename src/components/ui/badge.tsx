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
        // Rank colors (Neon/Glass Style)
        coal: 'border-rank-coal/50 bg-rank-coal/10 text-rank-coal hover:bg-rank-coal/20',
        iron: 'border-rank-iron/50 bg-rank-iron/10 text-rank-iron hover:bg-rank-iron/20',
        gold: 'border-rank-gold/50 bg-rank-gold/10 text-rank-gold hover:bg-rank-gold/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]',
        emerald: 'border-rank-emerald/50 bg-rank-emerald/10 text-rank-emerald hover:bg-rank-emerald/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]',
        diamond: 'border-rank-diamond/50 bg-rank-diamond/10 text-rank-diamond hover:bg-rank-diamond/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]',
        netherite: 'border-rank-netherite/50 bg-rank-netherite/10 text-rank-netherite hover:bg-rank-netherite/20 shadow-[0_0_10px_rgba(160,32,240,0.1)]',
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
