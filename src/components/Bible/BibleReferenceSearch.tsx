"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useBibleNavData } from "@/components/Bible/layout/navbar/useBibleNavData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import type { BibleBook } from "@/components/Bible/Read/types";
import { OT_ORDER_MAX } from "@/components/Bible/Read/constants";
import {
  buildReadSearchParams,
  defaultVersionFromLanguage,
} from "@/app/(bible)/bible/[lang]/read/params";

interface BibleQuickSuggestion {
  id: string;
  label: string;
  secondary: string;
  href: string;
}

function getBookLabelForLanguage(book: BibleBook, lang: "EN" | "VI" | "ZH"): string {
  if (lang === "VI") return book.nameVi;
  if (lang === "ZH") return book.nameZh ?? book.nameEn;
  return book.nameEn;
}

/**
 * Parse raw input into book query + optional chapter/verse.
 * Normalizes (lowercase, NFD, strip diacritics), then: book = compact string with trailing digits removed; chapter/verse from first two number groups.
 */
function parseBibleQuery(raw: string): {
  bookQuery: string;
  chapterHint?: number;
  verse?: number;
} {
  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\d]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const compact = normalized.replace(/\s+/g, "");
  const book = compact.replace(/\d+$/, "");
  const numbers = normalized.match(/\d+/g) ?? [];
  const chapter = numbers[0] ? Number(numbers[0]) : undefined;
  const verse = numbers[1] ? Number(numbers[1]) : undefined;

  return {
    bookQuery: book,
    chapterHint: chapter,
    verse,
  };
}

const SEARCH_DEBOUNCE_MS = 180;

export function BibleReferenceSearch() {
  const router = useRouter();
  const { langSegment, globalLanguage, intl } = useBibleNavData();
  const [query, setQuery] = useState("");
  const [searchBook, setSearchBook] = useState<BibleBook | null>(null);
  const [searching, setSearching] = useState(false);
  const lastRequestRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const seg = langSegment as "en" | "vi" | "zh";
  const { bookQuery, chapterHint, verse } = parseBibleQuery(query);
  // Prefer global language so "gia" searches VI keys when user has Vietnamese selected
  const searchLang =
    globalLanguage === "VI"
      ? "vi"
      : globalLanguage === "EN"
        ? "en"
        : seg === "vi" || seg === "en"
          ? seg
          : "en";

  // Debounced API search. Abort in-flight requests so only the latest response applies.
  useEffect(() => {
    const raw = bookQuery ?? "";
    // Re-normalise to match what the API's parseQuery will receive
    const q = raw
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\p{L}\d]/gu, " ")
      .replace(/\s+/g, "")
      .trim();

    if (!q) {
      // Clear immediately — no debounce needed for empty input
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      lastRequestRef.current = "";
      setSearchBook(null);
      setSearching(false);
      return;
    }

    const t = setTimeout(() => {
      // Abort any previous in-flight request before starting a new one
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requested = q;
      lastRequestRef.current = requested;
      setSearching(true);

      const params = new URLSearchParams({ q: requested, lang: searchLang });

      fetch(`/api/bible/search?${params}`, { signal: controller.signal })
        .then(async (res) => {
          // Parse body first, then check ok — avoids double-consume of the stream
          let data: { book: BibleBook | null } = { book: null };
          try {
            data = await res.json();
          } catch {
            // non-JSON body (e.g. 500 HTML error page) — treat as no result
          }
          if (!res.ok) return { book: null };
          return data;
        })
        .then((data) => {
          // Stale response guard: discard if a newer request has already been issued
          if (lastRequestRef.current !== requested) return;
          setSearchBook(data?.book ?? null);
          setSearching(false);
        })
        .catch((err: unknown) => {
          // AbortError is expected when a newer keystroke cancels this request — ignore silently
          if (err instanceof Error && err.name === "AbortError") return;
          if (lastRequestRef.current !== requested) return;
          setSearchBook(null);
          setSearching(false);
        });
      // Note: no .finally — setSearching(false) is handled in .then and .catch above
      // so aborted requests never accidentally clear the "searching" state for the live request
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [bookQuery, searchLang]);

  const suggestions = useMemo<BibleQuickSuggestion[]>(() => {
    if (!searchBook) return [];
    const book = searchBook;
    const baseLabel = getBookLabelForLanguage(book, globalLanguage);
    const totalChapters = book.chapterCount;
    const startChapter =
      chapterHint && chapterHint >= 1 && chapterHint <= totalChapters ? chapterHint : 1;
    const maxSuggestions = 5;
    const items: BibleQuickSuggestion[] = [];
    const defaultVersion = defaultVersionFromLanguage(globalLanguage);
    const testament = book.order <= OT_ORDER_MAX ? "ot" : "nt";

    for (
      let ch = startChapter;
      ch <= totalChapters && items.length < maxSuggestions;
      ch++
    ) {
      const versesParam = verse && verse >= 1 ? [verse] : undefined;
      const qs = buildReadSearchParams({
        version1: defaultVersion,
        book1Id: book.id,
        chapter1: ch,
        testament1: testament,
        verses: versesParam,
      });
      const href = `/bible/${seg}/read?${qs}`;
      const main =
        verse && verse >= 1 ? `${baseLabel} ${ch}:${verse}` : `${baseLabel} ${ch}`;
      const secondary =
        verse && verse >= 1 ? `Chapter ${ch}, verse ${verse}` : `Chapter ${ch}`;
      items.push({
        id: `${book.id}-${ch}-${verse ?? "all"}`,
        label: main,
        secondary,
        href,
      });
    }
    return items;
  }, [searchBook, chapterHint, verse, globalLanguage, seg]);

  const [open, setOpen] = useState(false);

  // Support ⌘K / Ctrl+K to toggle the search palette
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmdOrCtrlK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isCmdOrCtrlK) return;
      event.preventDefault();
      setOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className={cn(
          `group relative z-60 flex h-8 items-center justify-center gap-1.5 rounded-lg
          border px-2.5 text-xs font-medium transition-all duration-300 shadow-sm
          hover:shadow-md`,
          "border-second-200 bg-second-50/80 dark:bg-second-900/30 dark:border-second-700",
          "hover:bg-second-100 hover:border-second-300 dark:hover:bg-second-800/50 dark:hover:border-second-600",
          "text-second-800 dark:text-second-200",
          "theme-warm:border-border theme-warm:bg-muted/70 theme-warm:text-foreground",
          "theme-warm:hover:bg-muted theme-warm:hover:border-foreground/20",
          "theme-warm-dark:border-muted-foreground/30 theme-warm-dark:bg-muted/40",
          "theme-warm-dark:text-foreground theme-warm-dark:hover:bg-muted/60",
          "theme-warm-dark:hover:border-muted-foreground/50"
        )}
        aria-label="Open smart Bible search"
      >
        {/* Search icon with hover effect */}
        <Search
          className="text-second-500 dark:text-second-400 group-hover:text-second-700
            dark:group-hover:text-second-300 h-3.5 w-3.5 shrink-0 transition-colors
            theme-warm:text-muted-foreground theme-warm:group-hover:text-foreground
            theme-warm-dark:text-foreground/80 theme-warm-dark:group-hover:text-foreground"
        />

        {/* Smart label */}
        <span
          className="text-second-800 dark:text-second-200 hidden text-[11px] font-semibold
            tracking-tight sm:inline theme-warm:text-foreground theme-warm-dark:text-foreground"
        >
          Smart Search
        </span>

        {/* Keyboard hint */}
        <Kbd
          className="border-second-300 bg-second-100/80 text-second-700
            group-hover:border-second-400 group-hover:bg-second-200/80
            dark:border-second-600 dark:bg-second-800/60 dark:text-second-300
            dark:group-hover:border-second-500 dark:group-hover:bg-second-700/80
            theme-warm:border-border theme-warm:bg-muted theme-warm:text-muted-foreground
            theme-warm:group-hover:bg-muted theme-warm:group-hover:text-foreground
            theme-warm-dark:border-muted-foreground/40 theme-warm-dark:bg-muted/50
            theme-warm-dark:text-foreground/90 theme-warm-dark:group-hover:bg-muted/70
            hidden text-[14px] font-medium transition-all sm:inline"
        >
          ⌘K
        </Kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-xl gap-0 rounded-xl p-0"
          onEscapeKeyDown={() => {
            setQuery("");
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{intl.t("searchDialogTitle")}</DialogTitle>
            <DialogDescription>{intl.t("searchDialogDescription")}</DialogDescription>
          </DialogHeader>
          <Command shouldFilter={false} className="rounded-lg border-0">
            <div className="flex items-center border-b">
              <CommandInput
                placeholder={intl.t("searchPlaceholder")}
                value={query}
                onValueChange={setQuery}
                autoFocus
              />
              {query ? (
                <button
                  type="button"
                  aria-label={intl.t("searchClearLabel")}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery("");
                  }}
                  className="text-muted-foreground hover:text-foreground shrink-0 rounded
                    p-1.5 transition-colors outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <CommandList className="max-h-[450px]">
              {!query.trim() ? (
                <CommandEmpty className="flex flex-col items-center gap-4 px-6 py-10">
                  <div
                    className="bg-primary/10 text-primary flex h-10 w-10 items-center
                      justify-center rounded-full"
                    aria-hidden
                  >
                    <Lightbulb className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="w-full max-w-sm text-center">
                    <p
                      className="text-foreground mb-3 text-xs font-semibold tracking-wide
                        uppercase"
                    >
                      {intl.t("searchHintTrySearchingFor")}
                    </p>
                    <ul
                      className="text-muted-foreground space-y-2 text-sm leading-relaxed"
                    >
                      <li>
                        {intl.t("searchHintSingleBook")}{" "}
                        <span className="text-foreground font-mono text-xs">
                          &quot;John&quot;
                        </span>
                      </li>
                      <li>
                        {intl.t("searchHintBookChapter")}{" "}
                        <span className="text-foreground font-mono text-xs">
                          &quot;Psalm 119&quot;
                        </span>
                      </li>
                      <li>
                        {intl.t("searchHintBookVerse")}{" "}
                        <span className="text-foreground font-mono text-xs">
                          &quot;Gen 1:1&quot;
                        </span>
                      </li>
                    </ul>
                  </div>
                </CommandEmpty>
              ) : searching ? (
                <CommandEmpty
                  className="flex flex-col items-center justify-center gap-3 py-12"
                >
                  <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  <p className="text-muted-foreground text-sm">{intl.t("searchSearching")}</p>
                </CommandEmpty>
              ) : suggestions.length === 0 ? (
                <CommandEmpty className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    {intl.t("searchNoResultsFor")}{" "}
                    <span className="text-foreground font-semibold">
                      &quot;{query}&quot;
                    </span>
                  </p>
                  <p className="text-muted-foreground/60 mt-1 text-xs">
                    {intl.t("searchNoResultsTry")}
                  </p>
                </CommandEmpty>
              ) : (
                <div className="p-1">
                  <CommandGroup heading="Quick jump to" className="overflow-hidden">
                    {suggestions.map((s, idx) => (
                      <CommandItem
                        key={s.id}
                        value={s.label}
                        onSelect={() => {
                          router.push(s.href);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="group hover:bg-primary/15 focus-visible:bg-primary/15
                          flex cursor-pointer flex-col items-start rounded-md px-2 py-2.5
                          transition-colors focus-visible:ring-0 data-disabled:opacity-50"
                      >
                        <span
                          className="text-foreground group-hover:text-primary text-sm
                            font-semibold transition-colors"
                        >
                          {s.label}
                        </span>
                        <span
                          className="text-muted-foreground/70
                            group-hover:text-muted-foreground text-xs transition-colors"
                        >
                          {s.secondary}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
