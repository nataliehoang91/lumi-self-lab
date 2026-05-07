"use client";

import { Suspense } from "react";
import { StudyFullPageLoader } from "@/components/Bible/GeneralComponents/study-full-page-loader";
import { useIntroLoader } from "@/hooks/use-intro-loader";

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  const { isMounted, introDone, markDone } = useIntroLoader("bible_study_intro_seen");

  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      {isMounted && !introDone && (
        <StudyFullPageLoader onComplete={markDone} />
      )}
    </>
  );
}
