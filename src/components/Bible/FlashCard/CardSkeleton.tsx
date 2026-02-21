import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton({ horizontal = false }: { horizontal?: boolean }) {
  return (
    <div className="shrink-0 w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg">
      <Skeleton
        className={cn(
          "w-full rounded-2xl",
          horizontal ? "aspect-4/3 max-h-[280px]" : "h-[280px] sm:h-[320px]"
        )}
      />
    </div>
  );
}
