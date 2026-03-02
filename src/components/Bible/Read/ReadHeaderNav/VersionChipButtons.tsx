"use client";

import { cn } from "@/lib/utils";
import { useRead } from "../context/ReadContext";
import { TRANSLATIONS, VERSION_CHIP_STYLES } from "../constants";
import type { VersionId } from "../constants";
import { buildReadSearchParams } from "@/app/(bible)/bible/[lang]/read/params";
import {
  NavigationButton,
  NavigationSubmitMessage,
  NavigationLoadingMessage,
} from "@/components/CoreAdvancedComponent/behaviors/navigation-form";
import { ReserveLayout } from "@/components/ui/reverse-layout";

function chipSelectedStyle(
  transId: VersionId,
  leftVersion: VersionId | null,
  rightVersion: VersionId | null
): string {
  const base = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0 ";
  const isSelected = leftVersion === transId || rightVersion === transId;
  if (!isSelected) return base + VERSION_CHIP_STYLES[transId].unselected;
  return base + VERSION_CHIP_STYLES[transId].selected;
}

export function VersionChipButtons() {
  const {
    leftVersion,
    rightVersion,
    syncMode,
    leftBook,
    leftChapter,
    rightBook,
    rightChapter,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    insightOpen,
    focusMode,
  } = useRead();

  function buildVersionToggleSearchParams(transId: VersionId) {
    let nextLeft = leftVersion;
    let nextRight = rightVersion;
    const isLeft = leftVersion === transId;
    const isRight = rightVersion === transId;
    if (isLeft) {
      nextLeft = rightVersion;
      nextRight = null;
    } else if (isRight) {
      nextRight = null;
    } else if (leftVersion === null && rightVersion === null) {
      nextLeft = transId;
    } else if (rightVersion === null) {
      nextRight = transId;
    } else {
      nextRight = transId;
    }
    const leftTestament = syncMode ? testamentFilter : leftTestamentFilter;
    const rightTestament = syncMode ? testamentFilter : rightTestamentFilter;
    const qs = buildReadSearchParams({
      version1: nextLeft ?? undefined,
      version2: nextRight,
      sync: syncMode,
      book1Id: leftBook?.id ?? undefined,
      chapter1: leftChapter,
      testament1: leftTestament,
      book2Id: nextRight && !syncMode ? (rightBook?.id ?? undefined) : undefined,
      chapter2: nextRight && !syncMode ? rightChapter : undefined,
      testament2: nextRight && !syncMode ? rightTestament : undefined,
      insights: insightOpen || undefined,
      focus: focusMode || undefined,
    });
    return new URLSearchParams(qs);
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {TRANSLATIONS.map((trans) => (
        <NavigationButton
          key={trans.id}
          searchParams={buildVersionToggleSearchParams(trans.id)}
          asChild
        >
          <ReserveLayout>
            <NavigationSubmitMessage>
              <span
                className={cn(
                  "shrink-0 border hover:text-muted-foreground",
                  chipSelectedStyle(trans.id, leftVersion, rightVersion)
                )}
              >
                {trans.name}
              </span>
            </NavigationSubmitMessage>
            <NavigationLoadingMessage>
              <span
                className={cn(
                  "shrink-0 border cursor-wait animate-pulse",
                  chipSelectedStyle(trans.id, leftVersion, rightVersion)
                )}
              >
                {trans.name}
              </span>
            </NavigationLoadingMessage>
          </ReserveLayout>
        </NavigationButton>
      ))}
    </div>
  );
}
