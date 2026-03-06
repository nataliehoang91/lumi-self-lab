"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { LearnOriginMapFullWidth } from "@/components/Bible/Learn/LearnOriginMap";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";

export interface LearnBibleOriginMapSectionProps {
  mapTitle: string;
  mapBody: string;
  activeId: MapLocationId | null;
  onActiveChange: (id: MapLocationId | null) => void;
  labels: Record<MapLocationId, string>;
  renderPopover: (id: MapLocationId) => { label: string; desc: string };
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnBibleOriginMapSection({
  mapTitle,
  mapBody,
  activeId,
  onActiveChange,
  labels,
  renderPopover,
  locale,
  bodyBright,
}: LearnBibleOriginMapSectionProps) {
  const { bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <section className="mb-10">
      <BibleHeading
        level="h2"
        className={cn("text-foreground mb-2 font-semibold", titleFont)}
      >
        {mapTitle}
      </BibleHeading>
      <p className={cn(bodyColor, "mb-5 leading-relaxed", bodyClass, bodyFont)}>
        {mapBody}
      </p>
      <LearnOriginMapFullWidth
        activeId={activeId}
        onActiveChange={onActiveChange}
        labels={labels}
        renderPopover={renderPopover}
      />
    </section>
  );
}
