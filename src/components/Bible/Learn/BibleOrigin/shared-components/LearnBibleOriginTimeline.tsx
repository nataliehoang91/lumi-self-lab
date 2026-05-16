"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { MapPin, Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BibleHeading } from "@/components/Bible/BibleHeading";
import { LearnMiniMap, LearnMapPopover } from "@/components/Bible/Learn/LearnOriginMap";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
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
  locale?: "en" | "vi";
  subDesc?: ReactNode;
}

const SLIDE_DURATION = 4500;

export function LearnBibleOriginTimeline({
  timeline,
  timelineItems,
  mapLocations,
  mapLabels,
  locale,
  subDesc,
}: LearnBibleOriginTimelineProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);
  const [mapSheetId, setMapSheetId] = useState<MapLocationId | null>(null);
  const [progress, setProgress] = useState(0);

  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-serif";
  const itemFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const { bodyTitleClass, bodyClass, subBodyClass, subBodyClassUp } = useBibleFontClasses();

  const goTo = useCallback(
    (idx: number, dir?: "left" | "right") => {
      setSlideDir(dir ?? (idx > activeIdx ? "right" : "left"));
      setActiveIdx(idx);
      setAnimKey((k) => k + 1);
      setProgress(0);
    },
    [activeIdx]
  );

  const next = useCallback(() => {
    if (activeIdx < timelineItems.length - 1) {
      goTo(activeIdx + 1, "right");
    } else {
      setIsPlaying(false);
    }
  }, [activeIdx, timelineItems.length, goTo]);

  const prev = useCallback(() => {
    if (activeIdx > 0) goTo(activeIdx - 1, "left");
  }, [activeIdx, goTo]);

  // Auto-play progress bar + advance
  useEffect(() => {
    if (!isPlaying) { setProgress(0); return; }
    const interval = 50;
    const step = (interval / SLIDE_DURATION) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { next(); return 0; }
        return p + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isPlaying, next]);

  const item = timelineItems[activeIdx]!;
  const locationId = TIMELINE_LOCATION_IDS[activeIdx]!;
  const loc = mapLocations[locationId]!;
  const fillPct = ((activeIdx + 1) / timelineItems.length) * 100;

  return (
    <section className="mb-14">
      {/* Animation keyframes */}
      <style>{`
        @keyframes slideFromRight { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideFromLeft  { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
        .slide-right { animation: slideFromRight 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .slide-left  { animation: slideFromLeft  0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <BibleHeading
        level="h2"
        className={cn("text-foreground mb-6 font-semibold", titleFont)}
      >
        {timeline}
      </BibleHeading>
      {subDesc && <div className="mb-4">{subDesc}</div>}

      {/* ── Dot track ── */}
      <div className="relative mb-2 px-1">
        {/* Background line */}
        <div className="bg-border/50 absolute top-1/2 right-2 left-2 h-px -translate-y-1/2" />
        {/* Fill line */}
        <div
          className="bg-primary absolute top-1/2 left-2 h-px -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ width: `calc(${fillPct}% - 8px)` }}
        />
        {/* Dots */}
        <div className="relative flex items-center justify-between">
          {timelineItems.map((t, i) => {
            const isPast = i < activeIdx;
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => { setIsPlaying(false); goTo(i); }}
                title={t.year}
                className="group relative flex flex-col items-center focus:outline-none"
              >
                <span
                  className={cn(
                    "block rounded-full border-2 border-background transition-all duration-300",
                    isActive
                      ? "bg-primary size-4 ring-4 ring-primary/25"
                      : isPast
                        ? "bg-primary size-3"
                        : "bg-border size-3 group-hover:bg-primary/50"
                  )}
                />
                {isActive && (
                  <span className="bg-primary absolute inset-0 m-auto size-4 animate-ping rounded-full opacity-30" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year labels */}
      <div className="mb-6 flex justify-between px-1">
        {timelineItems.map((t, i) => (
          <span
            key={i}
            className={cn(
              "block text-center font-mono transition-all duration-300",
              subBodyClass,
              i === activeIdx
                ? "text-primary font-semibold opacity-100"
                : "text-muted-foreground/50 opacity-60"
            )}
            style={{ fontSize: "0.65rem", maxWidth: 60 }}
          >
            {t.year}
          </span>
        ))}
      </div>

      {/* ── Main slide card ── */}
      <div className="bg-card border-border relative min-h-56 overflow-hidden rounded-2xl border shadow-md">
        {/* Auto-play progress bar */}
        {isPlaying && (
          <div className="absolute top-0 right-0 left-0 z-10 h-0.5">
            <div
              className="bg-primary h-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div
          key={animKey}
          className={cn(
            "flex flex-col gap-4 p-5 md:flex-row md:gap-6 md:p-7",
            slideDir === "right" ? "slide-right" : "slide-left"
          )}
        >
          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className={cn("mb-1 flex items-center gap-2", subBodyClass)}>
              <span className="text-primary font-mono font-semibold">{item.year}</span>
              <span className="text-muted-foreground/40 text-xs">
                {activeIdx + 1}&thinsp;/&thinsp;{timelineItems.length}
              </span>
            </div>

            <h3
              className={cn(
                "text-foreground mb-3 text-xl leading-snug font-bold",
                bodyTitleClass,
                itemFont
              )}
            >
              {item.event}
            </h3>

            <p className={cn("text-muted-foreground leading-relaxed", bodyClass, itemFont)}>
              {item.desc}
            </p>

            {/* Location chip */}
            <div className="mt-4">
              <button
                type="button"
                className="focus:outline-none md:hidden"
                onClick={() => setMapSheetId(locationId)}
              >
                <span
                  className={cn(
                    "text-muted-foreground bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 transition-colors hover:bg-muted/80",
                    subBodyClass
                  )}
                >
                  <MapPin className="h-3 w-3" />
                  {loc.label}
                </span>
              </button>
              <div className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                <LearnMapPopover
                  locationId={locationId}
                  label={loc.label}
                  desc={loc.desc}
                  miniMapLabels={mapLabels}
                >
                  <span
                    className={cn(
                      "text-muted-foreground bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 transition-colors hover:bg-muted/80",
                      subBodyClass
                    )}
                  >
                    <MapPin className="h-3 w-3" />
                    {loc.label}
                  </span>
                </LearnMapPopover>
              </div>
            </div>
          </div>

          {/* Mini map */}
          <div className="border-border bg-muted/30 hidden h-44 w-52 shrink-0 overflow-hidden rounded-xl border md:block">
            <LearnMiniMap activeId={locationId} variant="inline" labels={mapLabels} />
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={activeIdx === 0}
          className={cn(
            "flex size-9 items-center justify-center rounded-full border transition-all",
            "border-border bg-card hover:bg-muted",
            activeIdx === 0 && "cursor-not-allowed opacity-30"
          )}
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className={cn(
            "flex size-11 items-center justify-center rounded-full transition-all",
            "bg-primary text-white shadow-md hover:opacity-90"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" />
          )}
        </button>

        {activeIdx === timelineItems.length - 1 ? (
          <button
            type="button"
            onClick={() => { setIsPlaying(false); goTo(0, "left"); }}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border transition-all",
              "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
            )}
            aria-label="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        ) : (
        <button
          type="button"
          onClick={next}
          disabled={activeIdx === timelineItems.length - 1}
          className={cn(
            "flex size-9 items-center justify-center rounded-full border transition-all",
            "border-border bg-card hover:bg-muted",
            activeIdx === timelineItems.length - 1 && "cursor-not-allowed opacity-30"
          )}
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        )}
      </div>

      {/* Mobile map sheet */}
      <Sheet
        open={mapSheetId != null}
        onOpenChange={(open) => !open && setMapSheetId(null)}
      >
        <SheetContent side="bottom" className="rounded-t-2xl border-t">
          {mapSheetId != null && (
            <>
              <SheetHeader>
                <SheetTitle
                  className={cn("text-left tracking-wider uppercase", subBodyClassUp, itemFont)}
                >
                  {mapLocations[mapSheetId].label}
                </SheetTitle>
              </SheetHeader>
              <div className="px-4 pt-0 pb-6">
                <div className="border-border bg-card overflow-hidden rounded-xl border">
                  <LearnMiniMap activeId={mapSheetId} labels={mapLabels} />
                </div>
                <p
                  className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClass, itemFont)}
                >
                  {mapLocations[mapSheetId].desc}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
