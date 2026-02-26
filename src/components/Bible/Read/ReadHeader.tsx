"use client";

import { useMemo } from "react";
import { BookOpen, Maximize2, Minimize2, ChevronDown, Check, Lightbulb } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useRead } from "./ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { TRANSLATIONS, VERSION_CHIP_STYLES, VERSION_BADGE_CLASS } from "./constants";
import { getBookLabelForSelection } from "./utils";
import type { VersionId } from "./constants";
import { buildReadSearchParams, defaultVersionFromLanguage } from "@/app/(bible)/bible/read/params";
import { NavigationButton } from "@/components/CoreAdvancedComponent/behaviors/navigation-form";

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

export function ReadHeader() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const {
    leftVersion,
    rightVersion,
    syncMode,
    setSyncMode,
    focusMode,
    setFocusMode,
    leftBook,
    leftChapter,
    rightBook,
    rightChapter,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    subNavBookOpen,
    setSubNavBookOpen,
    subNavChapterOpen,
    setSubNavChapterOpen,
    handleVersionChipClick,
    handleLeftBookChange,
    handleLeftChapterChange,
    setTestamentFilterAndAdjustBook,
    filteredBooks,
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
            <div className="flex items-center gap-1.5 flex-wrap">
              {TRANSLATIONS.map((trans) => (
                <Button
                  key={trans.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVersionChipClick(trans.id)}
                  className={cn(
                    "shrink-0 border",
                    chipSelectedStyle(trans.id, leftVersion, rightVersion)
                  )}
                >
                  {trans.name}
                </Button>
              ))}
            </div>
          </div>
          {(leftVersion !== null || rightVersion !== null) && leftBook && syncMode && (
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-lg border border-second bg-second/5 text-foreground h-9 shrink-0 hover:bg-second/10"
                    aria-label={t("readOldTestament")}
                  >
                    <span className="truncate">
                      {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[140px] rounded-lg">
                  <DropdownMenuItem
                    onClick={() => setTestamentFilterAndAdjustBook("ot")}
                    className="gap-2"
                  >
                    {testamentFilter === "ot" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    {t("readOldTestament")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTestamentFilterAndAdjustBook("nt")}
                    className="gap-2"
                  >
                    {testamentFilter === "nt" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    {t("readNewTestament")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSubNavChapterOpen(false);
                    setSubNavBookOpen(!subNavBookOpen);
                  }}
                  className="rounded-lg border border-sage bg-sage/10 text-foreground hover:bg-sage/20 gap-1.5"
                >
                  {getBookLabelForSelection(leftBook, leftVersion, rightVersion)}
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {subNavBookOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSubNavBookOpen(false)}
                      aria-hidden
                    />
                    <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-48 min-w-48">
                      <div className="sticky top-0 bg-muted/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                      </div>
                      {filteredBooks.map((b) => (
                        <Button
                          key={b.id}
                          type="button"
                          variant="ghost"
                          className={cn(
                            "w-full justify-start px-3 py-2 text-sm hover:bg-accent transition-all",
                            b.id === leftBook.id
                              ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                              : "text-foreground"
                          )}
                          onClick={() => {
                            handleLeftBookChange(b);
                            setSubNavBookOpen(false);
                          }}
                        >
                          {getBookLabelForSelection(b, leftVersion, rightVersion)}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <Select
                  value={String(leftChapter)}
                  onValueChange={(v) => handleLeftChapterChange(Number(v))}
                >
                  <SelectTrigger className="w-auto min-w-[5rem] rounded-lg border-primary bg-primary/5 h-10 shrink-0 hover:bg-primary/10 dark:border-primary dark:bg-primary/5 gap-1.5">
                    <SelectValue placeholder={t("readChapterN", { n: 1 })}>
                      {t("readChapterN", { n: leftChapter })}
                    </SelectValue>
                    <ChevronDown className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    className="rounded-lg max-h-80 w-auto [&_[data-state]>span:first-child]:invisible"
                  >
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map((ch) => (
                        <SelectItem
                          key={ch}
                          value={String(ch)}
                          className="min-w-9 min-h-9 flex items-center justify-center rounded-md py-0 px-2 data-[highlighted]:bg-accent"
                        >
                          {ch}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!focusMode && rightVersion !== null && (
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
            {/* Insights button (desktop) */}
            {!focusMode && (
              <NavigationButton searchParams={insightsToggleSearchParams} asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-lg gap-1.5",
                    insightOpen
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                      : "bg-muted text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-200"
                  )}
                  title={t("readInsights") ?? "Insights"}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {t("readInsightsLabel") ?? "Insights"}
                  </span>
                </Button>
              </NavigationButton>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setFocusMode(!focusMode)}
              title={focusMode ? t("readExitFocus") : t("readFocusMode")}
              className={cn(
                "rounded-lg",
                focusMode
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-md border-border bg-card text-foreground hover:bg-muted/50 min-h-9"
                    aria-label={t("readVersion")}
                  >
                    <span className="truncate">{t("readVersion")}</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[140px] rounded-md">
                  {TRANSLATIONS.map((trans) => (
                    <DropdownMenuItem
                      key={trans.id}
                      onClick={() => handleVersionChipClick(trans.id)}
                      className="gap-2"
                    >
                      {leftVersion === trans.id || rightVersion === trans.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="w-4" />
                      )}
                      {trans.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {(leftVersion !== null || rightVersion !== null) && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {leftVersion !== null && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm",
                        VERSION_BADGE_CLASS[leftVersion]
                      )}
                    >
                      {TRANSLATIONS.find((tr) => tr.id === leftVersion)?.name ?? leftVersion}
                    </span>
                  )}
                  {rightVersion !== null && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm",
                        VERSION_BADGE_CLASS[rightVersion]
                      )}
                    >
                      {TRANSLATIONS.find((tr) => tr.id === rightVersion)?.name ?? rightVersion}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!focusMode && rightVersion !== null && (
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
              {/* Insights button (mobile) */}
              {!focusMode && (
                <NavigationButton searchParams={insightsToggleSearchParams} asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-md",
                      insightOpen
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                        : "bg-muted text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-200"
                    )}
                    title={t("readInsights") ?? "Insights"}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </Button>
                </NavigationButton>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setFocusMode(!focusMode)}
                title={focusMode ? t("readExitFocus") : t("readFocusMode")}
                className={cn(
                  "rounded-md",
                  focusMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {(leftVersion !== null || rightVersion !== null) && leftBook && syncMode && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-md border border-second bg-second/5 text-foreground min-h-9 shrink-0 hover:bg-second/10"
                    aria-label={t("readOldTestament")}
                  >
                    <span className="truncate">{testamentFilter === "ot" ? "Old" : "New"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px] rounded-md">
                  <DropdownMenuItem
                    onClick={() => setTestamentFilterAndAdjustBook("ot")}
                    className="gap-2"
                  >
                    {testamentFilter === "ot" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    Old
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTestamentFilterAndAdjustBook("nt")}
                    className="gap-2"
                  >
                    {testamentFilter === "nt" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    New
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSubNavChapterOpen(false);
                    setSubNavBookOpen(!subNavBookOpen);
                  }}
                  className="rounded-md h-9 border border-sage bg-sage/10 text-foreground hover:bg-sage/20 gap-1.5"
                >
                  {getBookLabelForSelection(leftBook, leftVersion, rightVersion)}
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {subNavBookOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSubNavBookOpen(false)}
                      aria-hidden
                    />
                    <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-lg z-20 max-h-80 overflow-y-auto w-48 min-w-48">
                      <div className="sticky top-0 bg-muted/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                      </div>
                      {filteredBooks.map((b) => (
                        <Button
                          key={b.id}
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            handleLeftBookChange(b);
                            setSubNavBookOpen(false);
                          }}
                          className={cn(
                            "w-full justify-start px-3 py-2 text-sm hover:bg-accent transition-all",
                            b.id === leftBook.id
                              ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                              : "text-foreground"
                          )}
                        >
                          {getBookLabelForSelection(b, leftVersion, rightVersion)}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSubNavBookOpen(false);
                    setSubNavChapterOpen(!subNavChapterOpen);
                  }}
                  className="rounded-md h-9 border border-primary bg-primary/5 text-foreground hover:bg-primary/10 gap-1.5 dark:border-primary dark:bg-primary/5"
                  aria-label={t("readChapterN", { n: leftChapter })}
                >
                  {leftChapter}
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {subNavChapterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSubNavChapterOpen(false)}
                      aria-hidden
                    />
                    <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-lg z-20 max-h-80 overflow-y-auto w-40 min-w-0 max-w-[min(14rem,calc(100vw-2rem))] p-2">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map(
                          (ch) => (
                            <Button
                              key={ch}
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleLeftChapterChange(ch);
                                setSubNavChapterOpen(false);
                              }}
                              className={cn(
                                "min-w-9 min-h-9 rounded-md text-sm hover:bg-accent transition-all",
                                ch === leftChapter
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-foreground"
                              )}
                            >
                              {ch}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
