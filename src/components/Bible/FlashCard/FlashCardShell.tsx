"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUp, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getBibleIntl } from "@/lib/bible-intl";
import type { Language, FontSize, LayoutMode } from "@/components/Bible/BibleAppContext";
import { buildFlashcardSearchParams } from "@/app/(bible)/bible/flashcard/params";
import { Container } from "@/components/ui/container";

const ALL_BATCH_SIZE = 50;

type CollectionItem = { id: string; name: string };

interface FlashCardShellProps {
  ids: string[];
  index: number;
  layout: LayoutMode;
  fontSize: FontSize;
  lang: Language;
  collections: CollectionItem[];
  collectionId?: string;
  /** For "all" mode: how many ids we're showing in this render (e.g. limit from URL). */
  displayCount?: number;
  children: React.ReactNode;
}

export function FlashCardShell({
  ids,
  index,
  layout,
  fontSize,
  lang,
  collections,
  collectionId,
  displayCount,
  children,
}: FlashCardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { registerShuffle } = useBibleApp();
  const intl = getBibleIntl(lang);

  const pushParams = useCallback(
    (updates: {
      index?: number;
      layout?: LayoutMode;
      font?: FontSize;
      lang?: Language;
      limit?: number;
      collection?: string;
    }) => {
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      if (updates.index !== undefined) next.set("index", String(updates.index));
      if (updates.layout) next.set("layout", updates.layout ?? "");
      if (updates.font) next.set("font", updates.font ?? "");
      if (updates.lang) next.set("lang", updates.lang ?? "");
      if (updates.limit !== undefined) next.set("limit", String(updates.limit));
      if (updates.collection !== undefined) next.set("collection", updates.collection);
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const total = ids.length;
  const isAll = layout === "all";
  const isVertical = layout === "vertical";
  const visibleCount = isAll ? (displayCount ?? total) : 1;
  const maxIndex = Math.max(0, total - (isAll ? 0 : 1));
  const showPrev = !isAll && index > 0;
  const showNext = !isAll && index < maxIndex;
  const hasMoreAll = isAll && (displayCount ?? 0) < total;
  const currentLimit = isAll ? (displayCount ?? ALL_BATCH_SIZE) : undefined;

  const handleShuffle = useCallback(() => {
    const nextIndex = Math.floor(Math.random() * Math.max(1, total));
    pushParams({ index: nextIndex });
  }, [total, pushParams]);

  useEffect(() => {
    return registerShuffle(handleShuffle);
  }, [registerShuffle, handleShuffle]);

  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  const collectionSelectorInline =
    collections.length > 0 ? (
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <label htmlFor="collection-select" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0">
          <Layers className="w-5 h-5 text-primary shrink-0" />
          {intl.t("collection")}
        </label>
        <Select
          value={collectionId || (collections[0]?.id ?? "")}
          onValueChange={(v) => pushParams({ collection: v, index: 0 })}
        >
          <SelectTrigger
            id="collection-select"
            className={cn(
              "w-[180px] sm:w-[200px] rounded-lg border border-border bg-card",
              "px-3 py-1.5 h-9 text-sm font-medium text-foreground hover:bg-second/10 transition-all",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            )}
            aria-label={intl.t("selectCollection")}
          >
            <SelectValue placeholder={intl.t("selectCollection")} />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl border border-border bg-popover text-popover-foreground"
            sideOffset={4}
          >
            {collections.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="rounded-lg focus:bg-muted focus:text-muted-foreground"
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ) : null;

  const header = (
    <header className="sticky z-40 top-14 bg-background/95 border-b border-border transition-all duration-300">
      <Container className="mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            {collectionSelectorInline}
          </div>
          {total > 0 && (
            <p className="text-sm text-muted-foreground shrink-0">
              {isAll
                ? intl.t("showing", { from: 1, to: visibleCount, total })
                : intl.t("verseOf", { current: index + 1, total })}
            </p>
          )}
        </div>
      </Container>
    </header>
  );

  if (total === 0) {
    return (
      <>
        {header}
        <div
          className={cn(
            "w-full flex flex-col items-center px-4 sm:px-6 max-w-6xl mx-auto min-h-[calc(100vh-3.5rem)]",
            fontSizeClass
          )}
        >
          <div className="w-full flex-1 flex flex-col items-center justify-center py-8 px-4">
            <div className="rounded-xl bg-card dark:bg-slate-800 border border-border dark:border-slate-700 p-8 shadow-lg w-full max-w-md flex items-center justify-center">
              <p className="text-center text-muted-foreground">{intl.t("noVerses")}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isAll) {
    return (
      <>
        {header}
        <div
          className={cn(
            "w-full min-w-0 flex flex-col items-center min-h-0 px-3 sm:px-6 max-w-7xl mx-auto overflow-x-hidden",
            fontSizeClass
          )}
        >
          <div className="w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 py-4">
            {children}
          </div>
          <div className="w-full flex flex-col items-center gap-4 py-6 pb-8">
            {hasMoreAll && (
              <Button
                variant="outline"
                className="min-w-[140px]"
                onClick={() =>
                  pushParams({
                    limit: Math.min(total, (currentLimit ?? ALL_BATCH_SIZE) + ALL_BATCH_SIZE),
                  })
                }
              >
                {intl.t("loadMore")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp className="h-4 w-4" />
              {intl.t("backToTop")}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {header}
      <div
        className={cn(
          "w-full flex flex-col items-center px-4 sm:px-6 max-w-6xl mx-auto",
          "min-h-[calc(100vh-3.5rem)]",
          fontSizeClass
        )}
      >
        <div className="w-full text-center py-3 shrink-0">
          <div className="flex justify-center gap-1 sm:gap-1.5 flex-wrap">
            {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => pushParams({ index: idx })}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === index
                    ? "w-6 sm:w-8 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to verse set ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-4 min-h-[min(60vh,400px)]">
        <div
          className={cn(
            "flex items-center justify-center gap-4 max-w-full flex-1 min-h-0",
            isVertical ? "flex-col w-full" : "flex-row w-full"
          )}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => pushParams({ index: index - 1 })}
            disabled={!showPrev}
            className={cn(
              "shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full",
              isVertical && "order-first"
            )}
            aria-label={isVertical ? "Previous (up)" : "Previous (left)"}
          >
            {isVertical ? <ChevronUp className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>

          <div
            className={cn(
              "flex gap-3 sm:gap-4 min-h-0 flex-1 items-center justify-center min-w-0",
              isVertical
                ? "flex-col w-full self-stretch overflow-y-auto"
                : "flex-row overflow-x-auto overflow-y-hidden shrink-0"
            )}
          >
            {isVertical ? (
              <div className="w-full min-w-0 max-w-lg self-stretch flex flex-col items-center justify-center px-1">
                {children}
              </div>
            ) : (
              <>
                {Array.from({ length: React.Children.count(children) }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[min(100%,320px)] sm:w-[min(100%,28rem)] max-w-lg flex items-center justify-center basis-[min(100%,320px)] sm:basis-md"
                  >
                    {React.Children.toArray(children)[i]}
                  </div>
                ))}
              </>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => pushParams({ index: index + 1 })}
            disabled={!showNext}
            className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
            aria-label={isVertical ? "Next (down)" : "Next (right)"}
          >
            {isVertical ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {isVertical ? intl.t("useArrowKeysVertical") : intl.t("useArrowKeys")}
        </p>
        <p className="text-xs text-muted-foreground text-center">{intl.t("keyboardHint")}</p>
        </div>
      </div>
    </>
  );
}
