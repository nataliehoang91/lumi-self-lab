import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  leftElement,
  rightElement,
  containerClassName,
  ...props
}: React.ComponentProps<"input"> & {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}) {
  return (
    <div className={cn("relative", containerClassName)}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          leftElement ? "pl-8" : "pl-3",
          rightElement ? "pr-10" : "pr-3",
          className
        )}
        {...props}
      />
      {leftElement && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <span className="flex items-center justify-center">
            {leftElement}
          </span>
        </div>
      )}
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}

export { Input };
