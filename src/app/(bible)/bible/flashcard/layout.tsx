import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/** Grid skeleton: 2 rows, 1 col (default) → 2 (sm) → 3 (md) → 4 (lg). */
function FlashcardSkeleton() {
  const count = 8; // 2 rows × 4 cols on lg
  return (
    <div className="min-h-screen pt-14 flex flex-col px-4 sm:px-6 max-w-7xl mx-auto bg-background">
      <div className="w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 py-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-[3/4] max-h-[320px] rounded-2xl shrink-0" />
        ))}
      </div>
    </div>
  );
}

export default function FlashcardLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<FlashcardSkeleton />}>{children}</Suspense>;
}
