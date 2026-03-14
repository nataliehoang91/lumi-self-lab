"use client";

import { useReadPanel } from "../context/ReadContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SelectPassage } from "../ReadHeaderNav/SelectPassage";

/**
 * When synced: passage is in the nav; this renders nothing.
 * When unsynced (two panels): each panel gets its own Select Passage inside the panel.
 */
export function ReadingPanelControlHeader({ side }: { side: "left" | "right" }) {
  const { focusMode, version, showControls, showBookChapterSelectors } =
    useReadPanel(side);
  const isMobile = useIsMobile();
  const variant = isMobile ? "mobile" : "desktop";

  if (focusMode || version === null) return null;
  if (!showControls || !showBookChapterSelectors) return null;

  return (
    <div className="mb-4 flex justify-center">
      <SelectPassage variant={variant} side={side} />
    </div>
  );
}
