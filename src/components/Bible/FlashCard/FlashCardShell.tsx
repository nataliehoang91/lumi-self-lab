"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  Layers,
} from "lucide-react";
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
import { Container } from "@/components/ui/container";

const ALL_BATCH_SIZE = 50;

type CollectionItem = { id: string; name: string };

interface FlashCardShellProps {
  ids: string[];
  index: number;
  layout: LayoutMode;
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
  lang,
  collections,
  collectionId,
  displayCount,
  children,
}: FlashCardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { registerShuffle, fontSize } = useBibleApp();
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
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <label
          htmlFor="collection-select"
          className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-sm
            font-medium"
        >
          <Layers className="text-primary h-5 w-5 shrink-0" />
          {intl.t("collection")}
        </label>
        <Select
          value={collectionId || (collections[0]?.id ?? "")}
          onValueChange={(v) => pushParams({ collection: v, index: 0 })}
        >
          <SelectTrigger
            id="collection-select"
            className={cn(
              "border-border bg-card w-[180px] rounded-lg border sm:w-[200px]",
              `text-foreground hover:bg-second/10 h-9 px-3 py-1.5 text-sm font-medium
                transition-all`,
              `focus:ring-ring focus:ring-offset-background focus:ring-2
                focus:ring-offset-2`
            )}
            aria-label={intl.t("selectCollection")}
          >
            <SelectValue placeholder={intl.t("selectCollection")} />
          </SelectTrigger>
          <SelectContent
            className="border-border bg-popover text-popover-foreground rounded-xl border"
            sideOffset={4}
          >
            {collections.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="focus:bg-muted focus:text-muted-foreground rounded-lg"
              >
                {intl.t("collectionName", { name: c.name }) ?? `Collection ${c.name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ) : null;

  const header = (
    <header
      className="bg-background/95 border-border sticky top-14 z-40 border-b transition-all
        duration-300"
    >
      <Container className="mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {collectionSelectorInline}
          </div>
          {total > 0 && (
            <p className="text-muted-foreground shrink-0 text-sm">
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
            `mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-6xl flex-col
            items-center px-4 sm:px-6`,
            fontSizeClass
          )}
        >
          <div
            className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8"
          >
            <div
              className="bg-card border-border flex w-full max-w-md items-center
                justify-center rounded-xl border p-8 shadow-lg dark:border-zinc-700
                dark:bg-zinc-800"
            >
              <p className="text-muted-foreground text-center">{intl.t("noVerses")}</p>
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
            `mx-auto flex min-h-0 w-full max-w-7xl min-w-0 flex-col items-center
            overflow-x-hidden px-3 sm:px-6`,
            fontSizeClass
          )}
        >
          <div
            className="grid w-full min-w-0 grid-cols-1 gap-3 py-4 sm:grid-cols-2 sm:gap-4
              lg:grid-cols-3 xl:grid-cols-4"
          >
            {children}
          </div>
          <div className="flex w-full flex-col items-center gap-4 py-6 pb-8">
            {hasMoreAll && (
              <Button
                variant="outline"
                className="min-w-[140px]"
                onClick={() =>
                  pushParams({
                    limit: Math.min(
                      total,
                      (currentLimit ?? ALL_BATCH_SIZE) + ALL_BATCH_SIZE
                    ),
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
          "mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6",
          "min-h-[calc(100vh-3.5rem)]",
          fontSizeClass
        )}
      >
        <div className="w-full shrink-0 py-3 text-center">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
            {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => pushParams({ index: idx })}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === index
                    ? "bg-primary w-6 sm:w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
                )}
                aria-label={`Go to verse set ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div
          className="flex min-h-[min(60vh,400px)] w-full flex-1 flex-col items-center
            justify-center px-2 py-4 sm:px-4"
        >
          <div
            className={cn(
              "flex min-h-0 max-w-full flex-1 items-center justify-center gap-4",
              isVertical ? "w-full flex-col" : "w-full flex-row"
            )}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => pushParams({ index: index - 1 })}
              disabled={!showPrev}
              className={cn(
                "h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12",
                isVertical && "order-first"
              )}
              aria-label={isVertical ? "Previous (up)" : "Previous (left)"}
            >
              {isVertical ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>

            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 items-center justify-center gap-3 sm:gap-4",
                isVertical
                  ? "w-full flex-col self-stretch overflow-y-auto"
                  : "shrink-0 flex-row overflow-x-auto overflow-y-hidden"
              )}
            >
              {isVertical ? (
                <div
                  className="flex w-full max-w-lg min-w-0 flex-col items-center
                    justify-center self-stretch px-1"
                >
                  {children}
                </div>
              ) : (
                <>
                  {Array.from({ length: React.Children.count(children) }).map((_, i) => (
                    <div
                      key={i}
                      className="flex w-[min(100%,320px)] max-w-lg shrink-0
                        basis-[min(100%,320px)] items-center justify-center
                        sm:w-[min(100%,28rem)] sm:basis-md"
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
              className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12"
              aria-label={isVertical ? "Next (down)" : "Next (right)"}
            >
              {isVertical ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-muted-foreground mt-4 text-center text-xs">
            {isVertical ? intl.t("useArrowKeysVertical") : intl.t("useArrowKeys")}
          </p>
          <p className="text-muted-foreground text-center text-xs">
            {intl.t("keyboardHint")}
          </p>
        </div>
      </div>
    </>
  );
}
