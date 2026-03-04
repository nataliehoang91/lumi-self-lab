import type { JourneyAccent } from "./types";

export const JOURNEY_STRIP_CLASS: Record<JourneyAccent, string> = {
  primary: "bg-primary/80",
  second: "bg-second/80",
  tertiary: "bg-tertiary/80",
  sage: "bg-sage/80",
  coral: "bg-coral/80",
  gray: "bg-gray-500/80",
};

export const JOURNEY_ICON_CLASS: Record<JourneyAccent, string> = {
  primary:
    "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-dark group-hover:border-primary-dark dark:text-gray-300",
  second:
    "bg-second/20 text-second group-hover:bg-second group-hover:text-second-dark dark:text-gray-300",
  tertiary:
    "bg-tertiary/20 text-tertiary group-hover:bg-tertiary group-hover:text-tertiary-foreground dark:text-gray-300",
  sage: "bg-sage/20 text-sage group-hover:bg-sage group-hover:text-white dark:text-gray-300",
  coral:
    "bg-coral/20 text-coral group-hover:bg-coral group-hover:text-coral-foreground group-hover:border-coral dark:text-gray-300",
  gray: "bg-gray-500/20 text-gray-500 group-hover:bg-gray-500 group-hover:text-white dark:text-gray-300",
};
