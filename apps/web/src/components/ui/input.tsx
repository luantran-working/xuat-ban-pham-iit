import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-white px-4 py-2 text-sm text-[var(--foreground)] shadow-sm outline-none transition-all duration-200 placeholder:text-[var(--muted-foreground)]/60 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
