"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";

/**
 * Dashboard Layout - Wrapper with Suspense and ErrorBoundary
 *
 * This layout provides:
 * - ErrorBoundary: Catches and displays errors gracefully
 * - Suspense: Handles async data loading with fallback UI
 *
 * The dashboard page itself handles its own layout (ResizablePanelGroup),
 * so this layout just provides error handling and loading states.
 *
 * Note: Resizable panels need full viewport height, so we use h-screen
 * instead of Container which constrains width/height.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={(props) => <GeneralErrorFallback {...props} />}>
      <Suspense
        fallback={
          <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        }
      >
        <div className="h-[calc(100vh-4rem)] w-full">{children}</div>
      </Suspense>
    </ErrorBoundary>
  );
}
