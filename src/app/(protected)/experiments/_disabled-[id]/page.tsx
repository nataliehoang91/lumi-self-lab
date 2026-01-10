import { Suspense } from "react";
import { ExperimentDetailClient } from "./ExperimentDetailClient";

export default function ExperimentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading experiment...</p>
          </div>
        </div>
      }
    >
      <ExperimentDetailClient />
    </Suspense>
  );
}
