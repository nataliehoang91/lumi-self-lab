import type { ReadVersionId } from "@/app/(bible)/bible/[lang]/read/params";

export const TRANSLATIONS: ReadonlyArray<{
  id: ReadVersionId;
  name: string;
  fullName: string;
}> = [
  { id: "vi", name: "VI", fullName: "Vietnamese Bible" },
  { id: "niv", name: "NIV", fullName: "New International Version" },
  { id: "kjv", name: "KJV", fullName: "King James Version" },
  { id: "zh", name: "中文", fullName: "Chinese Union Version" },
] as const;

export type VersionId = ReadVersionId;

/** Old Testament = order 1–39, New Testament = 40–66 */
export const OT_ORDER_MAX = 39;

export type TestamentFilter = "ot" | "nt";

export const VERSION_CHIP_STYLES: Record<
  VersionId,
  { unselected: string; selected: string }
> = {
  vi: {
    unselected:
      "bg-card text-muted-foreground border border-border hover:bg-coral/20 hover:border-coral/50 hover:text-coral-foreground",
    selected: "bg-coral text-coral-foreground shadow-sm",
  },
  kjv: {
    unselected:
      "bg-card text-muted-foreground border border-border hover:bg-sage/20 hover:border-sage/50 hover:text-sage-foreground",
    selected: "bg-sage text-sage-foreground shadow-sm",
  },
  niv: {
    unselected:
      "bg-card text-muted-foreground border border-border hover:bg-sky-blue/20 hover:border-sky-blue/50 hover:text-sky-blue-foreground",
    selected: "bg-sky-blue text-sky-blue-foreground shadow-sm",
  },
  zh: {
    unselected:
      "bg-card text-muted-foreground border border-border hover:bg-tertiary/20 hover:border-tertiary/50 hover:text-tertiary-foreground",
    selected: "bg-tertiary dark:bg-yellow-600 text-sky-blue-foreground shadow-sm",
  },
};

export const VERSION_BADGE_CLASS: Record<VersionId, string> = {
  vi: "bg-coral text-coral-foreground",
  kjv: "bg-sage text-sage-foreground",
  niv: "bg-sky-blue text-sky-blue-foreground",
  zh: "bg-tertiary text-tertiary-foreground dark:bg-yellow-600 dark:text-yellow-950",
};
