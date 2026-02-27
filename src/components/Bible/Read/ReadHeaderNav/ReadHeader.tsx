"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { VersionChipButtons } from "./VersionChipButtons";
import { TestamentDropdown } from "./TestamentDropdown";
import { BookSelector } from "./BookSelector";
import { ChapterSelectDesktop } from "./ChapterSelectDesktop";
import { ChapterSelectMobile } from "./ChapterSelectMobile";
import { InsightsButton } from "./InsightsButton";
import { FocusModeButton } from "./FocusModeButton";
import { VersionDropdownMobile } from "./VersionDropdownMobile";

export function ReadHeader() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const { leftVersion, rightVersion, syncMode, focusMode, leftBook, setSyncMode } = useRead();

  const hasVersionSelected = leftVersion !== null || rightVersion !== null;
  const showBookChapterNav = hasVersionSelected && leftBook !== null && syncMode;
  const showSyncToggle = !focusMode && rightVersion !== null;

  return (
    <header
      className={cn(
        "sticky z-40 bg-background/95 border-b border-border transition-all duration-300",
        focusMode ? "top-0" : "top-14"
      )}
    >
      <Container className="mx-auto px-4 sm:px-6 py-3">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-sm font-medium text-foreground shrink-0">{t("readVersion")}</h1>
            <VersionChipButtons />
          </div>
          {showBookChapterNav && (
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <TestamentDropdown variant="desktop" />
              <BookSelector variant="desktop" />
              <ChapterSelectDesktop />
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {showSyncToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSyncMode(!syncMode)}
                className={cn(
                  "rounded-lg",
                  syncMode
                    ? "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700"
                    : "bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30 dark:hover:text-rose-200"
                )}
              >
                {syncMode ? t("readSynced") : t("readIndependent")}
              </Button>
            )}
            {!focusMode && <InsightsButton variant="desktop" />}
            <FocusModeButton variant="desktop" />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <VersionDropdownMobile />
            <div className="flex items-center gap-2 shrink-0">
              {showSyncToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSyncMode(!syncMode)}
                  className={cn(
                    "rounded-md",
                    syncMode
                      ? "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700"
                      : "bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30 dark:hover:text-rose-200"
                  )}
                >
                  {syncMode ? t("readSynced") : t("readIndependent")}
                </Button>
              )}
              {!focusMode && <InsightsButton variant="mobile" />}
              <FocusModeButton variant="mobile" />
            </div>
          </div>
          {showBookChapterNav && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <TestamentDropdown variant="mobile" />
              <BookSelector variant="mobile" />
              <ChapterSelectMobile />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
