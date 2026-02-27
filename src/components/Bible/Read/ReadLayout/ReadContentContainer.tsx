"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { Container } from "@/components/ui/container";

/** Wrapper that receives children; when insights are open, adds bottom padding so content is pushed up and not hidden by the fixed insights panel. */
export function ReadContentContainer({ children }: { children: ReactNode }) {
  const { insightOpen } = useRead();
  return (
    <Container
      maxWidth="full"
      className={cn("flex-1 flex flex-col min-h-0 min-w-0", insightOpen && "pb-120")}
    >
      {children}
    </Container>
  );
}
export function ReadShellContainer({ children }: { children: ReactNode }) {
  return (
    <Container
      maxWidth="full"
      className="min-h-screen bg-read text-foreground font-sans flex flex-col"
    >
      {children}
    </Container>
  );
}
