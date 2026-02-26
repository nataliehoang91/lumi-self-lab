"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

/**
 * Loading skeleton for the /bible/read page.
 * Mirrors the sticky header + main layout of the actual Read page.
 */
export function ReadLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky z-40 top-14 bg-background/95 border-b border-border">
        <Container className="mx-auto px-4 sm:px-6 py-3">
          <div className="hidden md:flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-4 w-16" />
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-12 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="flex md:hidden flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </Container>
      </header>
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-4 py-8">
              <Skeleton className="h-5 w-full max-w-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
