import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for /bible/flashcard – progress bar, card placeholder, nav dots.
 */
export default function FlashcardLoading() {
  return (
    <div className="min-h-screen pt-14 flex flex-col items-center px-4 sm:px-6 max-w-6xl mx-auto bg-linear-to-b from-background to-muted/20">
      {/* Progress line */}
      <div className="w-full text-center py-3 shrink-0">
        <Skeleton className="h-4 w-32 mx-auto" />
        <div className="flex justify-center gap-1.5 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-1.5 w-6 rounded-full" />
          ))}
        </div>
      </div>

      {/* Card + nav */}
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-4 py-4">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <Skeleton className="w-full max-w-[280px] h-[260px] rounded-2xl shrink-0" />
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      </div>

      {/* Hint line */}
      <div className="pb-6">
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  );
}
