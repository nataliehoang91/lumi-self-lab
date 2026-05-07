"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";
import { useIntroLoader } from "@/hooks/use-intro-loader";

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  const { isMounted, introDone, markDone } = useIntroLoader("bible_read_intro_seen");

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
      <Suspense fallback={null}>{children}</Suspense>
      {isMounted && !introDone && (
        <FullPageBibleLoader onComplete={markDone} />
      )}
    </ErrorBoundary>
  );
}
