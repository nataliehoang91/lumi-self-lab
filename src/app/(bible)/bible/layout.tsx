import { Suspense } from "react";
import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { ReadFocusProvider } from "@/components/Bible/ReadFocusContext";
import { BibleNavBar } from "@/components/Bible/BibleNavBar";
import { BibleMainWithPadding } from "./BibleMainWithPadding";

function BibleShell({ children }: { children: React.ReactNode }) {
  return (
    <BibleAppProvider>
      <ReadFocusProvider>
        <BibleNavBar />
        <BibleMainWithPadding>{children}</BibleMainWithPadding>
      </ReadFocusProvider>
    </BibleAppProvider>
  );
}

export default function BibleSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      }
    >
      <BibleShell>{children}</BibleShell>
    </Suspense>
  );
}
