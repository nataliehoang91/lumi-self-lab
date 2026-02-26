"use client";

import { Button } from "@/components/ui/button";
import { useRead } from "../ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

type Variant = "desktop" | "mobile";

export function SyncToggleButton({ variant = "desktop" }: { variant?: Variant }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const { syncMode, setSyncMode, rightVersion, focusMode } = useRead();

  if (focusMode || rightVersion === null) return null;

  const isDesktop = variant === "desktop";

  return (
    <Button
      type="button"
      variant="ghost"
      size={isDesktop ? "sm" : "sm"}
      onClick={() => setSyncMode(!syncMode)}
      className={cn(
        "rounded-lg",
        syncMode
          ? "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700"
          : "bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30 dark:hover:text-rose-200",
        !isDesktop && "rounded-md"
      )}
    >
      {syncMode ? t("readSynced") : t("readIndependent")}
    </Button>
  );
}
