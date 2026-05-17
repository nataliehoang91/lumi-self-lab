"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { Container } from "@/components/ui/container";

/** Wrapper that receives children; when insights are open, adds bottom padding so content is pushed up and not hidden by the fixed insights panel. When read nav is at bottom (single, sync, or independent), add padding so nav does not cover last lines. */
export function ReadContentContainer({ children }: { children: ReactNode }) {
  const { focusMode, insightOpen, insightMinimized, leftVersion, rightVersion, studyPanelOpen } =
    useRead();
  const hasContent = leftVersion !== null || rightVersion !== null;
  const navAtBottom =
    hasContent && (focusMode || !(insightOpen && !insightMinimized));
  return (
    <Container
      maxWidth="full"
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-300",
        insightOpen && "pb-120",
        navAtBottom && "pb-20",
        studyPanelOpen && "pr-72"
      )}
    >
      {children}
    </Container>
  );
}
export function ReadShellContainer({ children }: { children: ReactNode }) {
  return (
    <Container
      maxWidth="full"
      className="bg-read dark:bg-[#050408] text-foreground flex min-h-screen flex-col font-sans"
    >
      {children}
    </Container>
  );
}
