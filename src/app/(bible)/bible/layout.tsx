import { Suspense } from "react";
import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { BibleNavBar } from "@/components/Bible/BibleNavBar";

function BibleShell({ children }: { children: React.ReactNode }) {
  return (
    <BibleAppProvider>
      <BibleNavBar />
      <main className="pt-14 min-h-screen">{children}</main>
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
