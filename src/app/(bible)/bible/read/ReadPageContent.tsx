"use client";

import { useEffect } from "react";
import { useRead } from "@/components/Bible/Read";
import { ReadHeader } from "@/components/Bible/Read";
import { ReadMain } from "@/components/Bible/Read";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";
import type { BibleBook } from "@/components/Bible/Read/types";

function ReadFocusSync() {
  const { focusMode } = useRead();
  const { setReadFocusMode } = useReadFocus();
  useEffect(() => {
    setReadFocusMode(focusMode);
    return () => setReadFocusMode(false);
  }, [focusMode, setReadFocusMode]);
  return null;
}

export function ReadPageContent({
  initialBooks,
  searchParams,
}: {
  initialBooks: BibleBook[];
  searchParams: Record<string, string | undefined>;
}) {
  const { setServerData } = useRead();

  useEffect(() => {
    setServerData(initialBooks, searchParams);
    // Intentionally run once on mount so client-side URL updates don't re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <ReadFocusSync />
      <ReadHeader />
      <ReadMain />
    </div>
  );
}
