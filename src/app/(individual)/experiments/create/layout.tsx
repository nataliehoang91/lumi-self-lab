"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";

/**
 * Create Experiment Layout - Wrapper with Suspense and ErrorBoundary
 *
 * Full viewport height for ResizablePanelGroup (AI chat + experiment form).
 */
export default function CreateExperimentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={(props) => <GeneralErrorFallback {...props} />}>
      <Suspense
        fallback={
          <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <div className="h-[calc(100vh-4rem)] w-full">{children}</div>
      </Suspense>
    </ErrorBoundary>
  );
}
