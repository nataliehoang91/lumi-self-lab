"use client";

import { useEffect } from "react";
import { useRead } from "@/components/Bible/Read";
import { ReadHeader } from "@/components/Bible/Read";
import { ReadMain } from "@/components/Bible/Read";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";

function ReadFocusSync() {
  const { focusMode } = useRead();
  const { setReadFocusMode } = useReadFocus();
  useEffect(() => {
    setReadFocusMode(focusMode);
    return () => setReadFocusMode(false);
  }, [focusMode, setReadFocusMode]);
  return null;
}

/** Renders read UI; must be inside ReadProvider (wrapped by ReadPageShell with server data). */
export function ReadPageContent() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <ReadFocusSync />
      <ReadHeader />
      <ReadMain />
    </div>
  );
}
