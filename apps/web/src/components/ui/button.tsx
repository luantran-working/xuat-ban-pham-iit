import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-strong)] hover:text-white [&_svg]:text-current',
        outline:
          'border border-[var(--border-strong)] bg-white/82 text-[var(--foreground)] shadow-sm hover:border-[var(--accent)] hover:bg-white [&_svg]:text-current',
        secondary:
          'bg-[var(--accent-soft)] text-[var(--accent-strong)] hover:bg-[#cfe2ff] [&_svg]:text-current',
        ghost:
          'text-[var(--foreground)] hover:bg-white/75 [&_svg]:text-current',
        destructive:
          'bg-[var(--danger)] text-white hover:bg-[#8f1f2b] [&_svg]:text-current',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3.5 text-sm',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
