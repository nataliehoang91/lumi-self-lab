"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { getBibleIntl } from "@/lib/bible-intl";
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

export function BibleReferenceSearch({
  langSegment,
  globalLanguage,
}: {
  langSegment: "en" | "vi" | "zh";
  globalLanguage: "EN" | "VI" | "ZH";
}) {
  const router = useRouter();
  const intl = useMemo(() => getBibleIntl(globalLanguage), [globalLanguage]);
  const [query, setQuery] = useState("");
  const [searchBook, setSearchBook] = useState<BibleBook | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastRequestRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const itemRefsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const { bookQuery, chapterHint, verse } = parseBibleQuery(query);
  // Prefer global language so "gia" searches VI keys when user has Vietnamese selected
  const searchLang =
    globalLanguage === "VI"
      ? "vi"
      : globalLanguage === "EN"
        ? "en"
        : langSegment === "vi" || langSegment === "en"
          ? langSegment
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
        sync: true,
        book1Id: book.id,
        chapter1: ch,
        testament1: testament,
        verses: versesParam,
      });
      const href = `/bible/${langSegment}/read?${qs}`;
      const main =
        verse && verse >= 1 ? `${baseLabel} ${ch}:${verse}` : `${baseLabel} ${ch}`;
      const secondary =
        verse && verse >= 1
          ? intl.t("readChapterVerse", { ch, v: verse })
          : intl.t("readChapterN", { n: ch });
      items.push({
        id: `${book.id}-${ch}-${verse ?? "all"}`,
        label: main,
        secondary,
        href,
      });
    }
    return items;
  }, [searchBook, chapterHint, verse, globalLanguage, langSegment, intl]);

  const [open, setOpen] = useState(false);

  const clampedIndex =
    suggestions.length > 0 ? Math.min(selectedIndex, suggestions.length - 1) : 0;

  // Reset selection to first item when suggestions change (defer to avoid setState-in-effect lint)
  const suggestionsKey = suggestions.map((s) => s.id).join(",");
  useEffect(() => {
    const id = requestAnimationFrame(() => setSelectedIndex(0));
    return () => cancelAnimationFrame(id);
  }, [suggestionsKey]);

  // Scroll selected item into view when selection changes
  useEffect(() => {
    if (suggestions.length === 0) return;
    const el = itemRefsRef.current[clampedIndex];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [clampedIndex, suggestions.length]);

  // Keyboard: Arrow Up/Down to move selection, Enter to open selected suggestion
  useEffect(() => {
    if (!open || suggestions.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Enter" && !e.repeat) {
        const s = suggestions[clampedIndex];
        if (s) {
          e.preventDefault();
          router.push(s.href);
          setOpen(false);
          setQuery("");
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [open, suggestions, clampedIndex, router]);

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
          `border-border hover:bg-muted/80 bg-card text-muted-foreground flex h-8
          items-center justify-center gap-1.5 rounded-full border px-2 text-xs
          transition-colors`
        )}
        aria-label="Open Bible search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">Search</span>
        <Kbd className="hidden xl:inline-flex">⌘K</Kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        className="w-full max-w-xl rounded-xl"
      >
        <Command
          shouldFilter={false}
          className="rounded-lg border-0"
          aria-label="Search Bible"
        >
          <div className="flex w-full items-center border-b">
            <div className="min-w-0 flex-1">
              <CommandInput
                placeholder={intl.t("searchPlaceholder")}
                value={query}
                onValueChange={setQuery}
                autoFocus
              />
            </div>
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                tabIndex={0}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuery("");
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuery("");
                }}
                className="text-foreground hover:bg-muted hover:text-foreground
                  focus-visible:ring-ring pointer-events-auto shrink-0 cursor-pointer
                  rounded p-1.5 transition-colors outline-none focus-visible:ring-2
                  focus-visible:ring-offset-2"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <CommandList>
            {suggestions.length === 0 ? (
              <CommandEmpty>
                {searching ? intl.t("searchSearching") : intl.t("searchNoResults")}
              </CommandEmpty>
            ) : (
              <div className="p-1">
                <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                  {intl.t("searchGoTo")}
                </div>
                {suggestions.map((s, index) => (
                  <Link
                    key={s.id}
                    ref={(el) => {
                      itemRefsRef.current[index] = el;
                    }}
                    href={s.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      `flex w-full cursor-pointer flex-col items-start rounded-sm px-2
                        py-1.5 text-left transition-colors outline-none`,
                      `hover:bg-primary-100 dark:hover:bg-primary-dark/10
                        focus-visible:ring-ring focus-visible:ring-2
                        focus-visible:ring-offset-2`,
                      index === clampedIndex && "bg-primary-50 dark:bg-primary-dark/10"
                    )}
                  >
                    <span className="text-foreground text-sm font-medium">{s.label}</span>
                    <span className="text-foreground/70 text-xs">{s.secondary}</span>
                  </Link>
                ))}
              </div>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
