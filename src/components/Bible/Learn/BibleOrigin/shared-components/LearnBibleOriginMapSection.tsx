"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { LearnOriginMapFullWidth } from "@/components/Bible/Learn/LearnOriginMap";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";

export interface LearnBibleOriginMapSectionProps {
  mapTitle: string;
  mapBody: string;
  activeId: MapLocationId | null;
  onActiveChange: (id: MapLocationId | null) => void;
  labels: Record<MapLocationId, string>;
  renderPopover: (id: MapLocationId) => { label: string; desc: string };
}

export function LearnBibleOriginMapSection({
  mapTitle,
  mapBody,
  activeId,
  onActiveChange,
  labels,
  renderPopover,
}: LearnBibleOriginMapSectionProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-10">
      <BibleHeading level="h2" className="font-bible-english font-semibold text-foreground mb-2">
        {mapTitle}
      </BibleHeading>
      <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>{mapBody}</p>
      <LearnOriginMapFullWidth
        activeId={activeId}
        onActiveChange={onActiveChange}
        labels={labels}
        renderPopover={renderPopover}
      />
    </section>
  );
}
