import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] text-white shadow-md hover:from-[var(--primary-700)] hover:to-[var(--primary-600)] hover:shadow-lg [&_svg]:text-current',
        outline:
          'border border-[var(--border-strong)] bg-white text-[var(--foreground)] shadow-sm hover:border-[var(--accent)] hover:bg-[var(--primary-50)] [&_svg]:text-current',
        secondary:
          'bg-[var(--accent-soft)] text-[var(--primary-700)] hover:bg-[var(--primary-200)] [&_svg]:text-current',
        ghost:
          'text-[var(--foreground)] hover:bg-[var(--primary-50)] [&_svg]:text-current',
        destructive:
          'bg-[var(--danger)] text-white hover:bg-red-700 [&_svg]:text-current',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
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
