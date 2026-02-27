"use client";

import { cn } from "@/lib/utils";

export function SimpleLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary",
        className
      )}
    />
  );
}

// Alias used by existing code in SyncedRead
export function ReadInlineSpinner({ className }: { className?: string }) {
  return <SimpleLoader className={className} />;
}
