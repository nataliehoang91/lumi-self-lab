"use client";

import { useReadFocus } from "@/components/Bible/ReadFocusContext";
import { cn } from "@/lib/utils";

export function BibleMainWithPadding({ children }: { children: React.ReactNode }) {
  const { readFocusMode } = useReadFocus();
  return (
    <main className={cn("min-h-screen transition-[padding] duration-300", readFocusMode ? "pt-0" : "pt-14")}>
      {children}
    </main>
  );
}
