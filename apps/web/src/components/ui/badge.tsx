import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        pending: 'bg-amber-50 text-amber-700 border border-amber-200',
        published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        suspended: 'bg-slate-100 text-slate-600 border border-slate-200',
        neutral: 'bg-sky-50 text-sky-700 border border-sky-200',
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
