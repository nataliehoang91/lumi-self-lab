import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";

export const TIMELINE_LOCATION_IDS: MapLocationId[] = [
  "sinai",
  "jerusalem",
  "alexandria",
  "antioch",
  "alexandria",
  "rome",
  "qumran",
];

export const LANG_SCRIPT = [
  { pct: "79%", script: "עִבְרִית" },
  { pct: "18%", script: "Κοινή" },
  { pct: "3%", script: "ܐܪܡܝܐ" },
] as const;
