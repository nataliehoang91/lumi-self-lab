"use client";

import { BookPlus, Link2, Unlink2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { VersionChipButtons } from "./VersionChipButtons";
import { SelectPassage } from "./SelectPassage";
import { ReadTextSettings } from "./ReadTextSettings";
import { InsightsButton } from "./InsightsButton";
import { FocusModeButton } from "./FocusModeButton";
import { VersionDropdownMobile } from "./VersionDropdownMobile";

export function ReadHeader() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const { leftVersion, rightVersion, syncMode, focusMode, leftBook, setSyncMode } =
    useRead();

  const hasVersionSelected = leftVersion !== null || rightVersion !== null;
  /** Passage in nav only when synced; when unsynced each panel has its own passage control inside. */
  const showBookChapterNav = hasVersionSelected && leftBook !== null;
  const showPassageInNav = showBookChapterNav && syncMode;
  const showSyncToggle = !focusMode && rightVersion !== null;

  return (
    <header
      className={cn(
        "bg-background/95 border-border sticky z-40 border-b transition-all duration-300",
        focusMode ? "top-0" : "top-14"
      )}
    >
      <Container className="mx-auto px-4 py-3 sm:px-6">
        {/* Desktop */}
        <div className="hidden flex-wrap items-center justify-between gap-4 md:flex">
          <div className="flex min-w-0 items-center gap-3">
            <BookPlus className="text-primary h-5 w-5 shrink-0" />
            <h1 className="text-foreground shrink-0 text-sm font-medium">
              {t("readVersion")}
            </h1>
            <VersionChipButtons />
            {showSyncToggle && (
              <Button
                type="button"
                variant="ghost"
                size={syncMode ? "sm" : "icon"}
                onClick={() => setSyncMode(!syncMode)}
                className={cn(
                  "shrink-0 rounded-lg",
                  syncMode
                    ? `h-8 bg-rose-100 px-2.5 text-rose-900 hover:bg-rose-200
                      dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700`
                    : `bg-muted text-muted-foreground h-8 min-h-8 w-8 min-w-8
                      hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30
                      dark:hover:text-rose-200`
                )}
                title={syncMode ? t("readSynced") : t("readIndependent")}
                aria-label={syncMode ? t("readSynced") : t("readIndependent")}
              >
                {syncMode ? (
                  <Link2 className="h-4 w-4" />
                ) : (
                  <Unlink2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {showBookChapterNav && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {showPassageInNav && <SelectPassage variant="desktop" />}
              <ReadTextSettings />
            </div>
          )}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {!focusMode && <InsightsButton variant="desktop" />}
            <FocusModeButton variant="desktop" />
          </div>
        </div>

        {/* Mobile: version row + sync icon in same flex row */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <VersionDropdownMobile />
            {showSyncToggle && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSyncMode(!syncMode)}
                className={cn(
                  "shrink-0 rounded-md",
                  syncMode
                    ? `h-9 w-9 bg-rose-100 text-rose-900 hover:bg-rose-200
                      dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700`
                    : `bg-muted text-muted-foreground h-8 min-h-8 w-8 min-w-8
                      hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30
                      dark:hover:text-rose-200`
                )}
                title={syncMode ? t("readSynced") : t("readIndependent")}
                aria-label={syncMode ? t("readSynced") : t("readIndependent")}
              >
                {syncMode ? (
                  <Link2 className="h-4 w-4" />
                ) : (
                  <Unlink2 className="h-4 w-4" />
                )}
              </Button>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {!focusMode && <InsightsButton variant="mobile" />}
              <FocusModeButton variant="mobile" />
            </div>
          </div>
          {showBookChapterNav && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {showPassageInNav && <SelectPassage variant="mobile" />}
              <ReadTextSettings />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
