"use client";

import type * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function CheckboxRound({
  className,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  indicatorClassName?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-gray-400 bg-white dark:bg-slate-900",
        "data-[state=checked]:text-primary data-[state=checked]:border-primary",
        "dark:data-[state=checked]:border-od-bright-teal",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "size-4 shrink-0 rounded-full border shadow-xs transition-all outline-none focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current transition-none font-bold",
          indicatorClassName
        )}
      >
        <CheckIcon className="size-3 stroke-4 dark:text-od-bright-teal" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { CheckboxRound };
