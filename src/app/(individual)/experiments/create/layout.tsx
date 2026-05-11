"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";

/**
 * Create Experiment Layout — fixed below the navbar, no page scroll.
 * Both inner panels (chat + form) scroll independently.
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
          <div className="fixed inset-x-0 bottom-0 top-16 flex items-center justify-center">
            <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        }
      >
        {/* Fixed below navbar (top-16 = 64px), fills remaining viewport */}
        <div className="fixed inset-x-0 bottom-0 top-16 overflow-hidden">
          {children}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
