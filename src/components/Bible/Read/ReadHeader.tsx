"use client";

import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useRead } from "./ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { VersionChipButtons } from "./ReadHeaderNav/VersionChipButtons";
import { TestamentDropdown } from "./ReadHeaderNav/TestamentDropdown";
import { BookSelector } from "./ReadHeaderNav/BookSelector";
import { ChapterSelectDesktop } from "./ReadHeaderNav/ChapterSelectDesktop";
import { ChapterSelectMobile } from "./ReadHeaderNav/ChapterSelectMobile";
import { SyncToggleButton } from "./ReadHeaderNav/SyncToggleButton";
import { InsightsButton } from "./ReadHeaderNav/InsightsButton";
import { FocusModeButton } from "./ReadHeaderNav/FocusModeButton";
import { VersionDropdownMobile } from "./ReadHeaderNav/VersionDropdownMobile";

export function ReadHeader() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const { leftVersion, rightVersion, syncMode, focusMode, leftBook } = useRead();

  const hasVersionSelected = leftVersion !== null || rightVersion !== null;
  const showBookChapterNav = hasVersionSelected && leftBook !== null && syncMode;

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
            <SyncToggleButton variant="desktop" />
            {!focusMode && <InsightsButton variant="desktop" />}
            <FocusModeButton variant="desktop" />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <VersionDropdownMobile />
            <div className="flex items-center gap-2 shrink-0">
              <SyncToggleButton variant="mobile" />
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
