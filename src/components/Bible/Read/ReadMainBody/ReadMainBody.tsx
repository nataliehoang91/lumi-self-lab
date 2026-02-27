"use client";

import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { EmptyReadState } from "./EmptyReadState";
import { SyncedRead } from "./SyncedRead";
import { IndependentRead } from "./IndependentRead";
import { SingleRead } from "./SingleRead";

export function ReadMainBody() {
  const { leftVersion, rightVersion, syncMode, focusMode } = useRead();

  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  let mainBody: React.ReactNode;
  if (!leftVersion && !rightVersion) {
    mainBody = <EmptyReadState />;
  } else if (syncMode && rightVersion !== null && !focusMode) {
    mainBody = <SyncedRead />;
  } else if (rightVersion !== null && !focusMode) {
    mainBody = <IndependentRead />;
  } else {
    mainBody = <SingleRead />;
  }

  return (
    <div className={cn("flex gap-0 relative", isIndependentTwoPanels && "flex-col md:flex-row")}>
      {mainBody}
    </div>
  );
}
