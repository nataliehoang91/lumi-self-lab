"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";
import { IndividualDashboardSkeleton } from "@/components/IndividualDashboard/IndividualDashboardSkeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={(props) => <GeneralErrorFallback {...props} />}>
      <Suspense fallback={<IndividualDashboardSkeleton />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
