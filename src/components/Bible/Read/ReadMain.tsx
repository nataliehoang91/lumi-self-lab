"use client";

import { cn } from "@/lib/utils";
import { useRead } from "./context/ReadContext";
import { EmptyReadState } from "./EnhancedReadingPanel/EmptyReadState";
import { SyncedRead } from "./SyncedRead";
import { IndependentRead } from "./IndependentRead";
import { SingleRead } from "./SingleRead";
import { Container } from "@/components/ui/container";

const ReadBodyContainer = ({ children }: { children: React.ReactNode }) => {
  const { focusMode } = useRead();

  return (
    <main className={cn("transition-all duration-300", focusMode ? "py-8" : "py-6")}>
      <Container maxWidth="7xl">{children}</Container>
    </main>
  );
};

export function ReadMain() {
  const { leftVersion, rightVersion, syncMode } = useRead();

  if (!leftVersion && !rightVersion) {
    return (
      <ReadBodyContainer>
        <EmptyReadState />
      </ReadBodyContainer>
    );
  }
  if (syncMode && rightVersion !== null) {
    return (
      <ReadBodyContainer>
        <SyncedRead />
      </ReadBodyContainer>
    );
  }
  if (rightVersion !== null) {
    return (
      <ReadBodyContainer>
        <IndependentRead />
      </ReadBodyContainer>
    );
  }
  return (
    <ReadBodyContainer>
      <SingleRead />
    </ReadBodyContainer>
  );
}
