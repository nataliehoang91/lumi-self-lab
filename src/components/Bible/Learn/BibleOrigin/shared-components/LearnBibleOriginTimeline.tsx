"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BibleHeading } from "@/components/Bible/BibleHeading";
import { LearnMiniMap, LearnMapPopover } from "@/components/Bible/Learn/LearnOriginMap";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";
import { cn } from "@/lib/utils";
import { TIMELINE_LOCATION_IDS } from "./constants";

export interface TimelineItem {
  year: string;
  event: string;
  desc: string;
}

export interface MapLocationInfo {
  label: string;
  desc: string;
}

export interface LearnBibleOriginTimelineProps {
  timeline: string;
  timelineItems: readonly TimelineItem[];
  mapLocations: Record<MapLocationId, MapLocationInfo>;
  mapLabels: Record<MapLocationId, string>;
  /** When "vi", use Vietnamese flashcard font for title and item text. */
  locale?: "en" | "vi";
}

export function LearnBibleOriginTimeline({
  timeline,
  timelineItems,
  mapLocations,
  mapLabels,
  locale,
}: LearnBibleOriginTimelineProps) {
  const [mapSheetLocationId, setMapSheetLocationId] = useState<MapLocationId | null>(
    null
  );
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-serif";
  const itemFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section className="mb-14">
      <BibleHeading level="h2" className={cn("text-foreground mb-6 font-semibold", titleFont)}>
        {timeline}
      </BibleHeading>
      <div className="relative">
        <div className="absolute top-3 bottom-3 left-[106px] w-px border border-dashed" />
        <div className="space-y-6">
          {timelineItems.map((t, i) => {
            const locationId = TIMELINE_LOCATION_IDS[i];
            const loc = mapLocations[locationId];
            const chipContent = (
              <span
                className="text-muted-foreground bg-muted hover:bg-muted/80 inline-flex
                  cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs
                  transition-colors"
              >
                <MapPin className="h-3 w-3" />
                {loc.label}
              </span>
            );
            return (
              <div key={i} className="flex items-start gap-4">
                <div className="w-24 shrink-0 pt-4 text-right">
                  <span
                    className="text-muted-foreground/70 block font-mono text-xs
                      whitespace-nowrap"
                  >
                    {t.year}
                  </span>
                </div>
                <div
                  className="bg-primary/80 border-background z-10 mt-4 -ml-3 size-4
                    shrink-0 rounded-full border-2"
                />
                <div
                  className="bg-card border-border max-w-3xl min-w-0 flex-1
                    overflow-hidden rounded-2xl border shadow-sm"
                >
                  <div className="flex h-full items-center gap-0">
                    <div className="min-w-0 flex-1 px-4 py-4">
                      <p className={cn("text-foreground text-sm leading-snug font-semibold", itemFont)}>
                        {t.event}
                      </p>
                      <p className={cn("text-muted-foreground mt-1.5 text-sm leading-relaxed", itemFont)}>
                        {t.desc}
                      </p>
                      <div className="mt-3 flex items-center gap-0">
                        {/* Below md: tap location opens slide-in map sheet */}
                        <button
                          type="button"
                          onClick={() => setMapSheetLocationId(locationId)}
                          className="focus:outline-none md:hidden"
                        >
                          {chipContent}
                        </button>
                        {/* md and up: popover as before */}
                        <div className="hidden md:block">
                          <LearnMapPopover
                            locationId={locationId}
                            label={loc.label}
                            desc={loc.desc}
                            miniMapLabels={mapLabels}
                          >
                            {chipContent}
                          </LearnMapPopover>
                        </div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="bg-muted/30 mr-4 hidden h-full w-52 cursor-zoom-in
                            sm:block"
                        >
                          <LearnMiniMap
                            activeId={locationId}
                            variant="inline"
                            labels={mapLabels}
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent
                        className="max-w-2xl border-none bg-transparent p-0 shadow-none"
                      >
                        <div
                          className="border-border bg-card overflow-hidden rounded-2xl
                            border"
                        >
                          <LearnMiniMap activeId={locationId} labels={mapLabels} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Below md: slide-in sheet with map when a location is tapped */}
      <Sheet
        open={mapSheetLocationId != null}
        onOpenChange={(open) => !open && setMapSheetLocationId(null)}
      >
        <SheetContent side="bottom" className="rounded-t-2xl border-t">
          {mapSheetLocationId != null && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left text-sm tracking-wider uppercase">
                  {mapLocations[mapSheetLocationId].label}
                </SheetTitle>
              </SheetHeader>
              <div className="px-4 pt-0 pb-6">
                <div className="border-border bg-card overflow-hidden rounded-xl border">
                  <LearnMiniMap activeId={mapSheetLocationId} labels={mapLabels} />
                </div>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {mapLocations[mapSheetLocationId].desc}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
