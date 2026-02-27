"use client";

import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { EmptyReadState } from "./EmptyReadState";
import { SyncedRead } from "./SyncedRead";
import { IndependentRead } from "./IndependentRead";
import { SingleRead } from "./SingleRead";

const ReadMainBodyContainer = ({
  children,
  isIndependentTwoPanels,
}: {
  children: React.ReactNode;
  isIndependentTwoPanels: boolean;
}) => {
  return (
    <div className={cn("flex gap-0 relative", isIndependentTwoPanels && "flex-col md:flex-row")}>
      {children}
    </div>
  );
};

export function ReadMainBody() {
  const { leftVersion, rightVersion, syncMode, focusMode } = useRead();

  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  if (!leftVersion && !rightVersion) {
    return (
      <ReadMainBodyContainer isIndependentTwoPanels={isIndependentTwoPanels}>
        <EmptyReadState />
      </ReadMainBodyContainer>
    );
  }
  if (syncMode && rightVersion !== null && !focusMode) {
    return (
      <ReadMainBodyContainer isIndependentTwoPanels={isIndependentTwoPanels}>
        <SyncedRead />
      </ReadMainBodyContainer>
    );
  }
  if (rightVersion !== null && !focusMode) {
    return (
      <ReadMainBodyContainer isIndependentTwoPanels={isIndependentTwoPanels}>
        <IndependentRead />
      </ReadMainBodyContainer>
    );
  }
  return (
    <ReadMainBodyContainer isIndependentTwoPanels={isIndependentTwoPanels}>
      <SingleRead />
    </ReadMainBodyContainer>
  );
}
