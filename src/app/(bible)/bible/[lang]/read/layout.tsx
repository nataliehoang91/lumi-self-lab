"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <GeneralErrorFallback
          {...props}
          defaultDescription="We couldn't load the Bible reader. Please try again or go back to the main Bible page."
          homeUrl="/bible"
        />
      )}
    >
      <Suspense fallback={<FullPageBibleLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
