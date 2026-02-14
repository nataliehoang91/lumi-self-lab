"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Container } from "@/components/ui/container";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";
import { ExperimentsSkeleton } from "@/components/ExperimentsSkeleton";

export default function ExperimentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="7xl" className="min-h-screen mb-8 md:px-6 md:py-8">
      <ErrorBoundary fallbackRender={(props) => <GeneralErrorFallback {...props} />}>
        <Suspense fallback={<ExperimentsSkeleton />}>{children}</Suspense>
      </ErrorBoundary>
    </Container>
  );
}
