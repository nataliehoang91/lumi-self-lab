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
        <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          {versionName}
        </div>
        <div className="flex flex-row items-center gap-4 flex-wrap">
          {onTestamentFilterChange && (
            <Select
              value={testamentFilterForPanel}
              onValueChange={(v) => v && onTestamentFilterChange(v as "ot" | "nt")}
            >
              <SelectTrigger className="w-auto min-w-24 rounded-lg border-second bg-second/5 h-10 shrink-0 hover:bg-second/10">
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
            <SelectTrigger className="w-auto min-w-20 rounded-lg border-sage bg-sage/10 h-10 shrink-0 hover:bg-sage/20">
              <SelectValue placeholder={t("readBook")}>
                {book ? getBookDisplayName(book, version) : t("readBook")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="rounded-lg max-h-80">
              {panelFilteredBooks.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {getBookDisplayName(b, version)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(chapter)} onValueChange={(v) => onChapterChange(Number(v))}>
            <SelectTrigger className="w-auto min-w-20 rounded-lg border-primary bg-primary/5 h-10 shrink-0 hover:bg-primary/10 dark:border-primary dark:bg-primary/5">
              <SelectValue placeholder={t("readChapterN", { n: 1 })} />
            </SelectTrigger>
            <SelectContent
              align="start"
              className="rounded-lg max-h-80 w-auto [&_[data-state]>span:first-child]:invisible"
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
                {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                  <SelectItem
                    key={ch}
                    value={String(ch)}
                    className="min-w-9 min-h-9 flex items-center justify-center rounded-md py-0 px-2 data-highlighted:bg-accent"
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
      <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-2">
        {versionName}
      </div>
      <div
        className={cn(
          "text-2xl text-foreground",
          version === "vi" ? "font-vietnamese" : "font-bible-english"
        )}
      >
        {book ? getBookDisplayName(book, version) : ""} {chapter}
      </div>
    </div>
  );
}
