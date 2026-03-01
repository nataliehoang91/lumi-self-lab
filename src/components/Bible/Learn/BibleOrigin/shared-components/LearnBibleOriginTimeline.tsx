"use client";

import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BibleHeading } from "@/components/Bible/BibleHeading";
import {
  LearnMiniMap,
  LearnMapPopover,
} from "@/components/Bible/Learn/LearnOriginMap";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";
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
}

export function LearnBibleOriginTimeline({
  timeline,
  timelineItems,
  mapLocations,
  mapLabels,
}: LearnBibleOriginTimelineProps) {
  return (
    <section className="mb-14">
      <BibleHeading level="h2" className="font-serif font-semibold text-foreground mb-6">
        {timeline}
      </BibleHeading>
      <div className="relative">
        <div className="absolute left-[106px] top-3 bottom-3 w-px border border-dashed" />
        <div className="space-y-6">
          {timelineItems.map((t, i) => {
            const locationId = TIMELINE_LOCATION_IDS[i];
            const loc = mapLocations[locationId];
            return (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-24 shrink-0 text-right pt-4">
                  <span className="text-xs font-mono text-muted-foreground/70 whitespace-nowrap block">
                    {t.year}
                  </span>
                </div>
                <div className="shrink-0 size-4 -ml-3 rounded-full bg-primary/80 border-2 border-background mt-4 z-10" />
                <div className="flex-1 min-w-0 rounded-2xl max-w-3xl bg-card border border-border shadow-sm overflow-hidden">
                  <div className="flex gap-0 h-full items-center">
                    <div className="flex-1 min-w-0 px-4 py-4">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {t.event}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                        {t.desc}
                      </p>
                      <div className="mt-3">
                        <LearnMapPopover
                          locationId={locationId}
                          label={loc.label}
                          desc={loc.desc}
                          miniMapLabels={mapLabels}
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:bg-muted/80 transition-colors cursor-pointer">
                            <MapPin className="w-3 h-3" />
                            {loc.label}
                          </span>
                        </LearnMapPopover>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="hidden sm:block w-52 bg-muted/30 h-full cursor-zoom-in mr-4"
                        >
                          <LearnMiniMap
                            activeId={locationId}
                            variant="inline"
                            labels={mapLabels}
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
                        <div className="rounded-2xl overflow-hidden border border-border bg-card">
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
    </section>
  );
}
