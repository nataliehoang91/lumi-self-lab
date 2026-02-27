"use client";

import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { buildReadSearchParams, defaultVersionFromLanguage } from "@/app/(bible)/bible/read/params";
import {
  NavigationButton,
  NavigationSubmitMessage,
  NavigationLoadingMessage,
} from "@/components/CoreAdvancedComponent/behaviors/navigation-form";
import { cn } from "@/lib/utils";

type Variant = "desktop" | "mobile";

export function InsightsButton({ variant = "desktop" }: { variant?: Variant }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
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
  } = useRead();

  const insightsToggleSearchParams = useMemo(() => {
    const v1 = leftVersion ?? defaultVersionFromLanguage(globalLanguage);
    const leftTestament = syncMode ? testamentFilter : leftTestamentFilter;
    const rightTestament = syncMode ? testamentFilter : rightTestamentFilter;
    const qs = buildReadSearchParams({
      version1: v1,
      version2: rightVersion,
      sync: syncMode,
      book1Id: leftBook?.id ?? undefined,
      chapter1: leftChapter,
      testament1: leftTestament,
      book2Id: rightVersion && !syncMode ? (rightBook?.id ?? undefined) : undefined,
      chapter2: rightVersion && !syncMode ? rightChapter : undefined,
      testament2: rightVersion && !syncMode ? rightTestament : undefined,
      insights: !insightOpen,
    });
    return new URLSearchParams(qs);
  }, [
    leftVersion,
    rightVersion,
    syncMode,
    leftBook?.id,
    leftChapter,
    rightBook?.id,
    rightChapter,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    insightOpen,
    globalLanguage,
  ]);

  const isDesktop = variant === "desktop";

  return (
    <NavigationButton searchParams={insightsToggleSearchParams} asChild>
      <Button
        type="button"
        variant="ghost"
        size={isDesktop ? "sm" : "icon"}
        className={cn(
          "rounded-lg gap-1.5",
          insightOpen
            ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            : "bg-muted text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-200",
          !isDesktop && "rounded-md"
        )}
        title={t("readInsights") ?? "Insights"}
      >
        <NavigationSubmitMessage>
          {isDesktop ? (
            <>
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">
                {t("readInsightsLabel") ?? "Insights"}
              </span>
            </>
          ) : (
            <Lightbulb className="w-4 h-4" />
          )}
        </NavigationSubmitMessage>
        <NavigationLoadingMessage>
          {isDesktop ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline text-sm font-medium">
                {t("readInsightsLabel") ?? "Insights"}
              </span>
            </>
          ) : (
            <div className="opacity-60 cursor-wait animate-pulse">
              <Lightbulb className="w-4 h-4" />
            </div>
          )}
        </NavigationLoadingMessage>
      </Button>
    </NavigationButton>
  );
}
