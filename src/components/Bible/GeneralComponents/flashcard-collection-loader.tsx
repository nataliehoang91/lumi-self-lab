"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface FlashcardCollectionLoaderProps {
  collectionNumber?: number;
}

export function FlashcardCollectionLoader({
  collectionNumber,
}: FlashcardCollectionLoaderProps) {
  const count = 8; // 2 rows × 4 cols on lg

  return (
    <div
      className="bg-background mx-auto flex min-h-screen max-w-7xl flex-col px-4 pt-14
        sm:px-6"
    >
      <div className="mb-3 flex w-full justify-center">
        <div
          className={cn(
            `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]
            font-medium`,
            `bg-muted/70 border-border/70 text-muted-foreground shadow-sm
            backdrop-blur-sm`
          )}
        >
          <span className="bg-primary inline-flex h-2 w-2 animate-pulse rounded-full" />
          <span className="font-semibold tracking-[0.12em] uppercase">
            Collection {collectionNumber ?? "…"} loading…
          </span>
        </div>
      </div>
      <div
        className="grid w-full min-w-0 grid-cols-1 gap-3 py-4 sm:grid-cols-2 sm:gap-4
          md:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-3/4 max-h-[320px] w-full shrink-0 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}
