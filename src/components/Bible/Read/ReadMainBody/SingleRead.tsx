"use client";

import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { SingleReadingPanel } from "./SingleReadingPanel";

export function SingleRead() {
  const { rightVersion, syncMode } = useRead();
  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  return (
    <>
      <div className={cn("transition-all duration-300 min-w-0", rightVersion !== null && "w-full")}>
        <SingleReadingPanel side="left" />
      </div>
      {rightVersion !== null && (
        <div
          className={cn(
            "transition-all duration-300 min-w-0",
            isIndependentTwoPanels && "w-full md:w-(--read-right-width)"
          )}
          style={
            isIndependentTwoPanels
              ? { ["--read-right-width" as string]: `${100 - 50}%` }
              : { width: "50%" }
          }
        >
          <SingleReadingPanel side="right" />
        </div>
      )}
    </>
  );
}
