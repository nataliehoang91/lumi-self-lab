"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export const MAP_LOCATION_IDS = [
  "jerusalem",
  "qumran",
  "alexandria",
  "rome",
  "antioch",
  "sinai",
] as const;

export type MapLocationId = (typeof MAP_LOCATION_IDS)[number];

const COORDS: Record<MapLocationId, { x: number; y: number }> = {
  jerusalem: { x: 66, y: 46 },
  qumran: { x: 69, y: 49 },
  alexandria: { x: 49, y: 54 },
  rome: { x: 27, y: 26 },
  antioch: { x: 71, y: 34 },
  sinai: { x: 60, y: 58 },
};

const LABEL_OFFSET: Record<
  MapLocationId,
  { dx: number; dy: number; anchor?: "start" | "end" }
> = {
  rome: { dx: -3, dy: -2, anchor: "end" },
  antioch: { dx: 3, dy: -2 },
  jerusalem: { dx: 3, dy: -3 },
  qumran: { dx: 3, dy: 4 },
  alexandria: { dx: -3, dy: 4, anchor: "end" },
  sinai: { dx: 3, dy: 4 },
};

export interface LearnOriginMapLabels {
  [key: string]: string;
}

function MapSvg({
  activeId,
  labels,
  variant = "block",
}: {
  activeId: MapLocationId | null;
  labels: Record<MapLocationId, string>;
  variant?: "block" | "inline";
}) {
  const locations = MAP_LOCATION_IDS;

  return (
    <svg
      viewBox="0 0 100 62"
      className={variant === "inline" ? "w-full h-full" : "absolute inset-0 w-full h-full"}
    >
      <rect width="100" height="62" fill="oklch(0.89 0.03 215)" />
      <path
        d="M13 27 Q20 22 30 23 Q38 20 47 24 Q54 23 63 27 Q69 25 73 29 Q71 36 65 38 Q59 40 53 38 Q47 40 38 40 Q30 42 22 38 Q13 36 13 27Z"
        fill="oklch(0.84 0.05 215)"
      />
      <path
        d="M63 43 Q65 50 63 58 Q61 60 59 58 Q57 51 59 43 Q61 41 63 43Z"
        fill="oklch(0.84 0.05 215)"
      />
      <path
        d="M0 0 L100 0 L100 24 Q85 19 72 21 Q60 17 50 21 Q40 17 28 19 Q15 15 5 22 Q2 24 0 24Z"
        fill="oklch(0.93 0.01 90)"
      />
      <path
        d="M0 43 Q8 37 14 39 Q22 41 24 45 Q32 49 40 51 Q52 56 56 62 L0 62Z"
        fill="oklch(0.91 0.015 80)"
      />
      <path
        d="M65 29 Q74 25 82 21 Q92 18 100 20 L100 62 Q90 60 80 57 Q70 55 65 50 Q63 44 65 29Z"
        fill="oklch(0.92 0.013 85)"
      />
      <path
        d="M59 41 Q63 43 65 51 Q61 53 57 51 Q55 45 59 41Z"
        fill="oklch(0.9 0.017 82)"
      />
      <path
        d="M51 62 Q53 55 51 49 Q49 45 47 41"
        stroke="oklch(0.76 0.04 215)"
        strokeWidth="0.4"
        fill="none"
        opacity="0.7"
      />
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
      {locations.map((id) => {
        const loc = COORDS[id];
        const isActive = activeId === id;
        const offset = LABEL_OFFSET[id];
        const label = labels[id] ?? id;

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
              r={isActive ? 1.8 : variant === "inline" ? 1.2 : 1.3}
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
  );
}

export function LearnMiniMap({
  activeId,
  variant = "block",
  labels,
}: {
  activeId: MapLocationId | null;
  variant?: "block" | "inline";
  labels: Record<MapLocationId, string>;
}) {
  if (variant === "inline") {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden border border-border bg-card">
        <MapSvg activeId={activeId} labels={labels} variant="inline" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-border bg-card"
      style={{ paddingBottom: "62%" }}
    >
      <div className="absolute inset-0 w-full h-full">
        <MapSvg activeId={activeId} labels={labels} variant="block" />
      </div>
    </div>
  );
}

export function LearnMapPopover({
  locationId,
  label,
  desc,
  children,
  miniMapLabels,
}: {
  locationId: MapLocationId;
  label: string;
  desc: string;
  children: ReactNode;
  miniMapLabels: Record<MapLocationId, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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
            <LearnMiniMap activeId={locationId} labels={miniMapLabels} />
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

export function LearnOriginMapFullWidth({
  activeId,
  onActiveChange,
  labels,
  renderPopover,
}: {
  activeId: MapLocationId | null;
  onActiveChange: (id: MapLocationId | null) => void;
  labels: Record<MapLocationId, string>;
  renderPopover: (locationId: MapLocationId) => { label: string; desc: string };
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeId === null) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onActiveChange(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeId, onActiveChange]);

  const active = activeId ? renderPopover(activeId) : null;

  return (
    <>
      <div className="relative w-full" style={{ paddingBottom: "62%" }}>
        <div className="absolute inset-0">
          <LearnMiniMap activeId={activeId} labels={labels} />
        </div>
        {activeId && active && (
          <div
            ref={ref}
            className="absolute z-50 w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200"
            style={{
              left: `${COORDS[activeId].x}%`,
              top: `${(COORDS[activeId].y / 62) * 100}%`,
              transform: "translate(-50%, -100%)",
              marginTop: "-18px",
            }}
          >
            <div className="p-3 pb-0">
              <LearnMiniMap activeId={activeId} labels={labels} />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-[0.2em]">
                  {active.label}
                </p>
                <button
                  type="button"
                  onClick={() => onActiveChange(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{active.desc}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 justify-center">
        {MAP_LOCATION_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onActiveChange(id)}
            className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:bg-muted/80 transition-colors cursor-pointer text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 inline-block" />
            {labels[id]}
          </button>
        ))}
      </div>
    </>
  );
}

export { COORDS, LABEL_OFFSET };
