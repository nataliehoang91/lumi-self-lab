"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MapPin, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const TIMELINE_ITEMS = [
  {
    keyYear: "learnOriginT1Year" as const,
    keyEvent: "learnOriginT1Event" as const,
    keyDesc: "learnOriginT1Desc" as const,
    locationId: "sinai" as const,
  },
  {
    keyYear: "learnOriginT2Year" as const,
    keyEvent: "learnOriginT2Event" as const,
    keyDesc: "learnOriginT2Desc" as const,
    locationId: "jerusalem" as const,
  },
  {
    keyYear: "learnOriginT3Year" as const,
    keyEvent: "learnOriginT3Event" as const,
    keyDesc: "learnOriginT3Desc" as const,
    locationId: "alexandria" as const,
  },
  {
    keyYear: "learnOriginT4Year" as const,
    keyEvent: "learnOriginT4Event" as const,
    keyDesc: "learnOriginT4Desc" as const,
    locationId: "antioch" as const,
  },
  {
    keyYear: "learnOriginT5Year" as const,
    keyEvent: "learnOriginT5Event" as const,
    keyDesc: "learnOriginT5Desc" as const,
    locationId: "alexandria" as const,
  },
  {
    keyYear: "learnOriginT6Year" as const,
    keyEvent: "learnOriginT6Event" as const,
    keyDesc: "learnOriginT6Desc" as const,
    locationId: "rome" as const,
  },
  {
    keyYear: "learnOriginT7Year" as const,
    keyEvent: "learnOriginT7Event" as const,
    keyDesc: "learnOriginT7Desc" as const,
    locationId: "qumran" as const,
  },
] as const;

const LANG_KEYS = [
  {
    pct: "79%",
    script: "עִבְרִית",
    keyLang: "learnOriginLangHebrew" as const,
    keyNote: "learnOriginLangHebrewNote" as const,
  },
  {
    pct: "18%",
    script: "Κοινή",
    keyLang: "learnOriginLangGreek" as const,
    keyNote: "learnOriginLangGreekNote" as const,
  },
  {
    pct: "3%",
    script: "ܐܪܡܝܐ",
    keyLang: "learnOriginLangAramaic" as const,
    keyNote: "learnOriginLangAramaicNote" as const,
  },
] as const;

const FAQ_KEYS = [
  { keyQ: "learnOriginFAQ1Q" as const, keyA: "learnOriginFAQ1A" as const },
  { keyQ: "learnOriginFAQ2Q" as const, keyA: "learnOriginFAQ2A" as const },
  { keyQ: "learnOriginFAQ3Q" as const, keyA: "learnOriginFAQ3A" as const },
  { keyQ: "learnOriginFAQ4Q" as const, keyA: "learnOriginFAQ4A" as const },
] as const;

const MAP_LOCATIONS = {
  jerusalem: {
    labelKey: "learnOriginLocJerusalem" as const,
    descKey: "learnOriginLocJerusalemDesc" as const,
    x: 66,
    y: 46,
  },
  qumran: {
    labelKey: "learnOriginLocQumran" as const,
    descKey: "learnOriginLocQumranDesc" as const,
    x: 69,
    y: 49,
  },
  alexandria: {
    labelKey: "learnOriginLocAlexandria" as const,
    descKey: "learnOriginLocAlexandriaDesc" as const,
    x: 49,
    y: 54,
  },
  rome: {
    labelKey: "learnOriginLocRome" as const,
    descKey: "learnOriginLocRomeDesc" as const,
    x: 27,
    y: 26,
  },
  antioch: {
    labelKey: "learnOriginLocAntioch" as const,
    descKey: "learnOriginLocAntiochDesc" as const,
    x: 71,
    y: 34,
  },
  sinai: {
    labelKey: "learnOriginLocSinai" as const,
    descKey: "learnOriginLocSinaiDesc" as const,
    x: 60,
    y: 58,
  },
} as const;

type MapLocationId = keyof typeof MAP_LOCATIONS;

const LABEL_OFFSET = {
  rome: { dx: -3, dy: -2, anchor: "end" },
  antioch: { dx: 3, dy: -2 },
  jerusalem: { dx: 3, dy: -3 },
  qumran: { dx: 3, dy: 4 },
  alexandria: { dx: -3, dy: 4, anchor: "end" },
  sinai: { dx: 3, dy: 4 },
} satisfies Record<MapLocationId, { dx: number; dy: number; anchor?: "start" | "end" }>;

function MiniMap({
  activeId,
  variant = "block",
}: {
  activeId: MapLocationId | null;
  variant?: "block" | "inline";
}) {
  const locations = Object.entries(MAP_LOCATIONS);
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  // Inline mode: fill the parent height (used in timeline cards)
  if (variant === "inline") {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden border border-border bg-card">
        <svg viewBox="0 0 100 62" className="w-full h-full">
          {/* Ocean */}
          <rect width="100" height="62" fill="oklch(0.89 0.03 215)" />

          {/* Mediterranean */}
          <path
            d="M13 27 Q20 22 30 23 Q38 20 47 24 Q54 23 63 27 Q69 25 73 29 Q71 36 65 38 Q59 40 53 38 Q47 40 38 40 Q30 42 22 38 Q13 36 13 27Z"
            fill="oklch(0.84 0.05 215)"
          />
          {/* Red Sea */}
          <path
            d="M63 43 Q65 50 63 58 Q61 60 59 58 Q57 51 59 43 Q61 41 63 43Z"
            fill="oklch(0.84 0.05 215)"
          />

          {/* Europe */}
          <path
            d="M0 0 L100 0 L100 24 Q85 19 72 21 Q60 17 50 21 Q40 17 28 19 Q15 15 5 22 Q2 24 0 24Z"
            fill="oklch(0.93 0.01 90)"
          />
          {/* Africa */}
          <path
            d="M0 43 Q8 37 14 39 Q22 41 24 45 Q32 49 40 51 Q52 56 56 62 L0 62Z"
            fill="oklch(0.91 0.015 80)"
          />
          {/* Middle East / Asia */}
          <path
            d="M65 29 Q74 25 82 21 Q92 18 100 20 L100 62 Q90 60 80 57 Q70 55 65 50 Q63 44 65 29Z"
            fill="oklch(0.92 0.013 85)"
          />
          {/* Sinai */}
          <path d="M59 41 Q63 43 65 51 Q61 53 57 51 Q55 45 59 41Z" fill="oklch(0.9 0.017 82)" />

          {/* Nile */}
          <path
            d="M51 62 Q53 55 51 49 Q49 45 47 41"
            stroke="oklch(0.76 0.04 215)"
            strokeWidth="0.4"
            fill="none"
            opacity="0.7"
          />

          {/* Subtle grid */}
          {[20, 40, 60, 80].map((x) => (
            <line
              key={x}
              x1={x}
              y1="0"
              x2={x}
              y2="62"
              stroke="oklch(0.75 0.01 200)"
              strokeWidth="0.12"
              opacity="0.35"
            />
          ))}
          {[20, 40].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="oklch(0.75 0.01 200)"
              strokeWidth="0.12"
              opacity="0.35"
            />
          ))}

          {/* Location dots */}
          {locations.map(([id, loc]) => {
            const isActive = activeId === (id as MapLocationId);
            const offset = LABEL_OFFSET[id as MapLocationId];
            const label = intl.t(loc.labelKey);

            return (
              <g key={id}>
                {isActive && (
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r="4"
                    className="animate-pulse"
                    fill="oklch(0.45 0.1 35)"
                    opacity="0.25"
                  />
                )}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={isActive ? 1.8 : 1.2}
                  fill={isActive ? "oklch(0.45 0.1 35)" : "oklch(0.35 0.012 85)"}
                  stroke="oklch(0.99 0.002 85)"
                  strokeWidth="0.6"
                />
                <text
                  x={loc.x + offset.dx}
                  y={loc.y + offset.dy}
                  fontSize={isActive ? "2.8" : "2.2"}
                  fill={isActive ? "oklch(0.25 0.01 85)" : "oklch(0.35 0.01 85)"}
                  fontFamily="sans-serif"
                  fontWeight={isActive ? "700" : "500"}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Default block mode: intrinsic height based on width
  return (
    <div
      className="relative w-full rounded-xl h-full overflow-hidden border border-border bg-card"
      style={{ paddingBottom: "62%" }}
    >
      <svg viewBox="0 0 100 62" className="absolute inset-0 w-full h-full">
        {/* Ocean */}
        <rect width="100" height="62" fill="oklch(0.89 0.03 215)" />

        {/* Mediterranean */}
        <path
          d="M13 27 Q20 22 30 23 Q38 20 47 24 Q54 23 63 27 Q69 25 73 29 Q71 36 65 38 Q59 40 53 38 Q47 40 38 40 Q30 42 22 38 Q13 36 13 27Z"
          fill="oklch(0.84 0.05 215)"
        />
        {/* Red Sea */}
        <path
          d="M63 43 Q65 50 63 58 Q61 60 59 58 Q57 51 59 43 Q61 41 63 43Z"
          fill="oklch(0.84 0.05 215)"
        />

        {/* Europe */}
        <path
          d="M0 0 L100 0 L100 24 Q85 19 72 21 Q60 17 50 21 Q40 17 28 19 Q15 15 5 22 Q2 24 0 24Z"
          fill="oklch(0.93 0.01 90)"
        />
        {/* Africa */}
        <path
          d="M0 43 Q8 37 14 39 Q22 41 24 45 Q32 49 40 51 Q52 56 56 62 L0 62Z"
          fill="oklch(0.91 0.015 80)"
        />
        {/* Middle East / Asia */}
        <path
          d="M65 29 Q74 25 82 21 Q92 18 100 20 L100 62 Q90 60 80 57 Q70 55 65 50 Q63 44 65 29Z"
          fill="oklch(0.92 0.013 85)"
        />
        {/* Sinai */}
        <path d="M59 41 Q63 43 65 51 Q61 53 57 51 Q55 45 59 41Z" fill="oklch(0.9 0.017 82)" />

        {/* Nile */}
        <path
          d="M51 62 Q53 55 51 49 Q49 45 47 41"
          stroke="oklch(0.76 0.04 215)"
          strokeWidth="0.4"
          fill="none"
          opacity="0.7"
        />

        {/* Subtle grid */}
        {[20, 40, 60, 80].map((x) => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x}
            y2="62"
            stroke="oklch(0.75 0.01 200)"
            strokeWidth="0.12"
            opacity="0.35"
          />
        ))}
        {[20, 40].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="oklch(0.75 0.01 200)"
            strokeWidth="0.12"
            opacity="0.35"
          />
        ))}

        {/* Location dots (standalone map) */}
        {locations.map(([id, loc]) => {
          const isActive = activeId === (id as MapLocationId);
          const offset = LABEL_OFFSET[id as MapLocationId];
          const label = intl.t(loc.labelKey);

          return (
            <g key={id}>
              {/* pulse ring for active */}
              {isActive && (
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r="4"
                  className="animate-pulse"
                  fill="oklch(0.45 0.1 35)"
                  opacity="0.25"
                />
              )}
              <circle
                cx={loc.x}
                cy={loc.y}
                r={isActive ? 1.8 : 1.3}
                fill={isActive ? "oklch(0.45 0.1 35)" : "oklch(0.35 0.012 85)"}
                stroke="oklch(0.99 0.002 85)"
                strokeWidth="0.6"
              />
              <text
                x={loc.x + offset.dx}
                y={loc.y + offset.dy}
                fontSize={isActive ? "2.8" : "2.2"}
                fill={isActive ? "oklch(0.25 0.01 85)" : "oklch(0.35 0.01 85)"}
                fontFamily="sans-serif"
                fontWeight={isActive ? "700" : "500"}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MapPopover({
  locationId,
  children,
}: {
  locationId: MapLocationId;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const loc = MAP_LOCATIONS[locationId];
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const label = intl.t(loc.labelKey);
  const desc = intl.t(loc.descKey);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        {children}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-3 pb-0">
            <MiniMap activeId={locationId} />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-xs font-semibold text-foreground uppercase tracking-[0.2em]">
                {label}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BibleOriginPage() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const mapPopoverRef = useRef<HTMLDivElement>(null);
  const [mapActiveLocation, setMapActiveLocation] = useState<MapLocationId | null>(null);

  useEffect(() => {
    if (mapActiveLocation === null) return;
    const handler = (e: MouseEvent) => {
      if (mapPopoverRef.current && !mapPopoverRef.current.contains(e.target as Node)) {
        setMapActiveLocation(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mapActiveLocation]);

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";

  return (
    <div>
      <div className="mb-12">
        <p className="text-xs font-mono text-second mb-3">{intl.t("learnOriginModuleNum")}</p>
        <BibleHeading
          level="h1"
          className="font-bible-english font-semibold text-foreground leading-tight text-balance"
        >
          {intl.t("learnOriginTitle")}
        </BibleHeading>
        <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>
          {intl.t("learnOriginIntro")}
        </p>
      </div>

      <section className="mb-10">
        <BibleHeading level="h2" className="font-bible-english font-semibold text-foreground mb-4">
          {intl.t("learnOriginOriginalLanguages")}
        </BibleHeading>
        <div className="grid grid-cols-3 gap-3">
          {LANG_KEYS.map((l) => (
            <div
              key={l.keyLang}
              className="p-4 bg-card border border-sage-dark/20 rounded-xl text-center"
            >
              <p className="font-bible-english text-xl text-muted-foreground/30 select-none leading-none">
                {l.script}
              </p>
              <p className="font-bible-english text-3xl font-semibold text-foreground mt-1">
                {l.pct}
              </p>
              <p className={cn("font-medium text-foreground mt-1", bodyClass)}>
                {intl.t(l.keyLang)}
              </p>
              <p className={cn("text-muted-foreground mt-0.5 leading-snug", bodyClass)}>
                {intl.t(l.keyNote)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <BibleHeading level="h2" className="font-serif font-semibold text-foreground mb-6">
          {intl.t("learnOriginTimeline")}
        </BibleHeading>
        <div className="relative">
          {/* Vertical line — aligned to dot column */}
          <div className="absolute left-[106px] top-3 bottom-3 w-px  border border-dashed" />
          <div className="space-y-6">
          {TIMELINE_ITEMS.map((t, i) => {
            const loc = MAP_LOCATIONS[t.locationId as MapLocationId];
            return (
                <div key={i} className="flex gap-4 items-start">
                  {/* Date — fixed width, no wrap */}
                  <div className="w-24 shrink-0 text-right pt-4">
                    <span className="text-xs font-mono text-muted-foreground/70 whitespace-nowrap block">
                      {intl.t(t.keyYear)}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="shrink-0 size-4 -ml-3 rounded-full bg-primary/80 border-2 border-background mt-4 z-10" />

                  {/* Card */}
                  <div className="flex-1 min-w-0 rounded-2xl max-w-3xl bg-card border border-border shadow-sm overflow-hidden">
                    <div className="flex gap-0  h-full items-center">
                      {/* Text */}
                      <div className="flex-1 min-w-0 px-4   py-4">
                        <p className="text-sm font-semibold text-foreground leading-snug">
                          {intl.t(t.keyEvent)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                          {intl.t(t.keyDesc)}
                        </p>
                        {/* Location tag with popover trigger */}
                        <div className="mt-3 ">
                          <MapPopover locationId={t.locationId}>
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:bg-muted/80 transition-colors cursor-pointer">
                              <MapPin className="w-3 h-3" />
                              {intl.t(loc.labelKey)}
                            </span>
                          </MapPopover>
                        </div>
                      </div>

                      {/* Inline mini map — click to expand */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="hidden sm:block w-52 bg-muted/30 h-full cursor-zoom-in mr-4"
                          >
                            <MiniMap activeId={t.locationId} variant="inline" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
                          <div className="rounded-2xl overflow-hidden border border-border bg-card">
                            <MiniMap activeId={t.locationId} />
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

      <section className="mb-10">
        <BibleHeading level="h2" className="font-bible-english font-semibold text-foreground mb-2">
          {intl.t("learnOriginMapTitle")}
        </BibleHeading>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>
          {intl.t("learnOriginMapBody")}
        </p>
        <div className="relative w-full" style={{ paddingBottom: "62%" }}>
          <div className="absolute inset-0">
            <MiniMap activeId={mapActiveLocation} />
          </div>
          {mapActiveLocation && (
            <div
              ref={mapPopoverRef}
              className="absolute z-50 w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200"
              style={{
                left: `${MAP_LOCATIONS[mapActiveLocation].x}%`,
                top: `${(MAP_LOCATIONS[mapActiveLocation].y / 62) * 100}%`,
                transform: "translate(-50%, -100%)",
                marginTop: "-18px",
              }}
            >
              <div className="p-3 pb-0">
                <MiniMap activeId={mapActiveLocation} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-[0.2em]">
                    {intl.t(MAP_LOCATIONS[mapActiveLocation].labelKey)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMapActiveLocation(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {intl.t(MAP_LOCATIONS[mapActiveLocation].descKey)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 justify-center">
            {Object.entries(MAP_LOCATIONS).map(([id, loc]) => {
              const locationId = id as MapLocationId;
              const label = intl.t(loc.labelKey);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMapActiveLocation(locationId)}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:bg-muted/80 transition-colors cursor-pointer",
                    bodyClass
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 inline-block" />
                  {label}
                </button>
              );
            })}
        </div>
      </section>

      <section className="mb-10 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
        <BibleHeading
          level="h2"
          className="font-bible-english font-semibold text-foreground text-xl md:text-2xl"
        >
          {intl.t("learnOriginReliableTitle")}
        </BibleHeading>
        <p className={cn(" leading-relaxed", bodyClass)}>{intl.t("learnOriginReliableP1")}</p>
        <p className={cn(" leading-relaxed", bodyClass)}>{intl.t("learnOriginReliableP2")}</p>
      </section>

      <section className="mb-14">
        <BibleHeading
          level="h2"
          className="font-bible-english font-semibold text-foreground mb-4 text-xl md:text-2xl"
        >
          {intl.t("learnOriginFAQTitle")}
        </BibleHeading>
        <LearnAccordion
          items={FAQ_KEYS.map((f) => ({
            term: intl.t(f.keyQ),
            def: intl.t(f.keyA),
          }))}
        />
      </section>
    </div>
  );
}
