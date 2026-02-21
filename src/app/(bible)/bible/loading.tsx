import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for /bible (redirect page) and fallback for bible section.
 * Matches bible layout: pt-14 (navbar) + main content.
 */
export default function BibleLoading() {
  return (
    <div className="min-h-screen pt-14 flex flex-col items-center justify-center px-4 bg-linear-to-b from-background to-muted/20">
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
