"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";
import { SimpleLoader } from "@/components/Bible/GeneralComponents/simple-loader";

export default function BookOverviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <GeneralErrorFallback
          {...props}
          defaultDescription="We couldn't load this book overview. Please try again or go back to Books & Overview."
          homeUrl="/bible"
        />
      )}
    >
      <Suspense fallback={<SimpleLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
