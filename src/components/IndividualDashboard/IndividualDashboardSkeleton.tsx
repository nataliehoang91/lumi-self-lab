import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function IndividualDashboardSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>

        {/* Tip card */}
        <Card className="p-6 border-border/50">
          <div className="flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </Card>

        {/* Your Experiments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-3 w-full rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Something New */}
        <Card className="p-6 border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-12 w-28 rounded-3xl" />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 border-border/50 text-center">
              <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-3" />
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-4 w-14 mt-2 mx-auto" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
