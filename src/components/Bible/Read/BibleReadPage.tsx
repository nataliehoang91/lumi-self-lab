"use client";

import { useEffect } from "react";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";
import { ReadProvider, useRead } from "./ReadContext";
import { ReadHeader } from "./ReadHeader";
import { ReadMain } from "./ReadMain";
import type { BibleBook } from "./types";

function ReadFocusSync() {
  const { focusMode } = useRead();
  const { setReadFocusMode } = useReadFocus();
  useEffect(() => {
    setReadFocusMode(focusMode);
    return () => setReadFocusMode(false);
  }, [focusMode, setReadFocusMode]);
  return null;
}

function ReadPageContent() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <ReadFocusSync />
      <ReadHeader />
      <ReadMain />
    </div>
  );
}

export interface BibleReadPageProps {
  initialBooks?: BibleBook[];
}

export function BibleReadPage({ initialBooks = [] }: BibleReadPageProps) {
  return (
    <ReadProvider initialBooks={initialBooks}>
      <ReadPageContent />
    </ReadProvider>
  );
}
