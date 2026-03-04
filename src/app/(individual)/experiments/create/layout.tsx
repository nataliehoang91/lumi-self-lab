"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";

/**
 * Create Experiment Layout - Wrapper with Suspense and ErrorBoundary
 *
 * Full viewport height for ResizablePanelGroup (AI chat + experiment form).
 */
export default function CreateExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallbackRender={(props) => <GeneralErrorFallback {...props} />}>
      <Suspense
        fallback={
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <div className="space-y-4 text-center">
              <div
                className="border-primary mx-auto h-12 w-12 animate-spin rounded-full
                  border-4 border-t-transparent"
              />
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
