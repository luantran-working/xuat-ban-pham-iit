import type { ComponentProps } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex h-12 items-center rounded-sm border border-white/60 bg-white/70 p-1',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium text-[var(--muted-foreground)] transition data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white',
        className,
      )}
      {...props}
    />
  );
}
