"use client";

import { Suspense } from "react";
import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { ReadFocusProvider } from "@/components/Bible/ReadFocusContext";
import { BibleNavBar } from "@/components/Bible/BibleNavBar";
import { BibleMainWithPadding } from "@/components/Bible/Read/ReadLayout/BibleMainWithPadding";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";

function BibleShell({ children }: { children: React.ReactNode }) {
  return (
    <BibleAppProvider>
      <ReadFocusProvider>
        <BibleNavBar />
        <BibleMainWithPadding>
          {children}
        </BibleMainWithPadding>
      </ReadFocusProvider>
    </BibleAppProvider>
  );
}

export default function BibleSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <FullPageBibleLoader />
        </div>
      }
    >
      <BibleShell>{children}</BibleShell>
    </Suspense>
  );
}
