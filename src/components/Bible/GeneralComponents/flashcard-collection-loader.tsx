"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface FlashcardCollectionLoaderProps {
  collectionNumber?: number;
}

export function FlashcardCollectionLoader({ collectionNumber }: FlashcardCollectionLoaderProps) {
  const count = 8; // 2 rows × 4 cols on lg

  return (
    <div className="min-h-screen pt-14 flex flex-col px-4 sm:px-6 max-w-7xl mx-auto bg-background">
      <div className="w-full flex justify-center mb-3">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium",
            "bg-muted/70 border-border/70 text-muted-foreground backdrop-blur-sm shadow-sm"
          )}
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="uppercase tracking-[0.12em] font-semibold">
            Collection {collectionNumber ?? "…"} loading…
          </span>
        </div>
      </div>
      <div className="w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 py-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-3/4 max-h-[320px] rounded-2xl shrink-0" />
        ))}
      </div>
    </div>
  );
}

