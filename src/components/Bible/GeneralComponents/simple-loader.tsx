"use client";

import { cn } from "@/lib/utils";

export function SimpleLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border border-t-primary h-8 w-8 animate-spin rounded-full border-2",
        className
      )}
    />
  );
}

// Alias used by existing code in SyncedRead
export function ReadInlineSpinner({ className }: { className?: string }) {
  return <SimpleLoader className={className} />;
}
