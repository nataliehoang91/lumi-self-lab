"use client";

import { BookOpen, Link2, Unlink2 } from "lucide-react";
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
            {showSyncToggle && (
              <Button
                type="button"
                variant="ghost"
                size={syncMode ? "sm" : "icon"}
                onClick={() => setSyncMode(!syncMode)}
                className={cn(
                  "shrink-0 rounded-lg",
                  syncMode
                    ? "h-8 px-2.5 bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700"
                    : "h-8 w-8 min-h-8 min-w-8 bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30 dark:hover:text-rose-200"
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
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <TestamentDropdown variant="desktop" />
              <BookSelector variant="desktop" />
              <ChapterSelectDesktop />
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!focusMode && <InsightsButton variant="desktop" />}
            <FocusModeButton variant="desktop" />
          </div>
        </div>

        {/* Mobile: version row + sync icon in same flex row */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
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
                    ? "h-9 w-9 bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-100 dark:hover:bg-rose-700"
                    : "h-8 w-8 min-h-8 min-w-8 bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/30 dark:hover:text-rose-200"
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
            <div className="flex items-center gap-2 shrink-0 ml-auto">
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
