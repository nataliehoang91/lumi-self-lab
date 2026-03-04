"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useReadPanel } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { getBookDisplayName } from "../utils";

/**
 * Control header for the reading panel. Renders when not in focus mode:
 * - Full controls (testament + book + chapter) when showControls && showBookChapterSelectors
 * - Simple title (version + book chapter) otherwise
 * Uses useReadPanel(side) from context for all panel-derived state.
 */
export function ReadingPanelControlHeader({ side }: { side: "left" | "right" }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const {
    focusMode,
    version,
    book,
    chapter,
    testamentFilterForPanel,
    onTestamentFilterChange,
    onBookChange,
    onChapterChange,
    showControls,
    showBookChapterSelectors,
    versionName,
    maxChapters,
    panelFilteredBooks,
  } = useReadPanel(side);

  if (focusMode || version === null) return null;

  if (showControls && showBookChapterSelectors) {
    return (
      <div className="mb-6 space-y-4">
        <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {versionName}
        </div>
        <div className="flex flex-row flex-wrap items-center gap-4">
          {onTestamentFilterChange && (
            <Select
              value={testamentFilterForPanel}
              onValueChange={(v) => v && onTestamentFilterChange(v as "ot" | "nt")}
            >
              <SelectTrigger
                className="border-second bg-second/5 hover:bg-second/10 h-10 w-auto
                  min-w-24 shrink-0 rounded-lg"
              >
                <SelectValue placeholder={t("readOldShort")} />
              </SelectTrigger>
              <SelectContent align="start" className="rounded-lg">
                <SelectItem value="ot">{t("readOldShort")}</SelectItem>
                <SelectItem value="nt">{t("readNewShort")}</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Select
            value={book?.id ?? ""}
            onValueChange={(id) => {
              const b = panelFilteredBooks.find((x) => x.id === id);
              if (b) onBookChange(b);
            }}
          >
            <SelectTrigger
              className="border-sage bg-sage/10 hover:bg-sage/20 h-10 w-auto min-w-20
                shrink-0 rounded-lg"
            >
              <SelectValue placeholder={t("readBook")}>
                {book ? getBookDisplayName(book, version) : t("readBook")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="max-h-80 rounded-lg">
              {panelFilteredBooks.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {getBookDisplayName(b, version)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(chapter)}
            onValueChange={(v) => onChapterChange(Number(v))}
          >
            <SelectTrigger
              className="border-primary bg-primary/5 hover:bg-primary/10
                dark:border-primary dark:bg-primary/5 h-10 w-auto min-w-20 shrink-0
                rounded-lg"
            >
              <SelectValue placeholder={t("readChapterN", { n: 1 })} />
            </SelectTrigger>
            <SelectContent
              align="start"
              className="max-h-80 w-auto rounded-lg
                [&_[data-state]>span:first-child]:invisible"
            >
              <div className="grid grid-cols-3 gap-1 p-2 sm:grid-cols-4">
                {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                  <SelectItem
                    key={ch}
                    value={String(ch)}
                    className="data-highlighted:bg-accent flex min-h-9 min-w-9
                      items-center justify-center rounded-md px-2 py-0"
                  >
                    {ch}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div
        className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase"
      >
        {versionName}
      </div>
      <div
        className={cn(
          "text-foreground text-2xl",
          version === "vi" ? "font-vietnamese" : "font-bible-english"
        )}
      >
        {book ? getBookDisplayName(book, version) : ""} {chapter}
      </div>
    </div>
  );
}
