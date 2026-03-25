import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
  {
    variants: {
      variant: {
        pending: 'bg-amber-100 text-amber-800',
        published: 'bg-sky-100 text-sky-800',
        suspended: 'bg-slate-200 text-slate-700',
        neutral: 'bg-slate-100 text-slate-700',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
