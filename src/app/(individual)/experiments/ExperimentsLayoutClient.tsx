"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";
import { ExperimentsSkeleton } from "@/components/ExperimentsSkeleton";

export function ExperimentsLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <IndividualContainer className="mb-8">
      <ErrorBoundary fallbackRender={(props) => <GeneralErrorFallback {...props} />}>
        <Suspense fallback={<ExperimentsSkeleton />}>{children}</Suspense>
      </ErrorBoundary>
    </IndividualContainer>
  );
}
