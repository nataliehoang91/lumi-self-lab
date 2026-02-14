"use client";

import type * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

function RadioGroupCustom({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItemCustom({
  className,
  circleClassName,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  circleClassName?: string;
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border-2 border-muted-foreground/30 bg-background transition-all duration-200 outline-none",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus-visible:border-primary focus-visible:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/20",
        "active:bg-primary/15",
        "data-[state=checked]:border-primary data-[state=checked]:bg-background",
        "dark:data-[state=checked]:border-od-bright-teal",
        "data-[state=checked]:hover:bg-primary/5",
        "data-[state=checked]:focus-visible:bg-primary/10 data-[state=checked]:focus-visible:ring-primary/30",
        "dark:data-[state=checked]:focus-visible:ring-od-bright-teal/40",
        "data-[state=checked]:active:bg-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-muted-foreground/30 disabled:hover:bg-background",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <div
          className={cn("size-1.5 rounded-full bg-primary dark:bg-od-bright-teal", circleClassName)}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroupCustom, RadioGroupItemCustom };
