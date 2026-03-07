"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Loader2, Search, X } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
 * Parse raw input into book query + optional chapter + verses.
 * Simple rules: "book ch v1 v2" = separate verses; "book ch v1-v2" or "v1:v2" = continuous range.
 * Normalizes (lowercase, NFD, strip diacritics) but keeps hyphen and colon for range.
 */
function parseBibleQuery(raw: string): {
  bookQuery: string;
  chapterHint?: number;
  verses: number[];
} {
  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\d\-:]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Verse specs: "12", "12-34", or "12:34" (range). Match in order.
  const verseSpecs = normalized.match(/\d+(?:[-\:]\d+)?/g) ?? [];
  const chapterHint = verseSpecs[0] ? Number(verseSpecs[0]) : undefined;
  const specs = verseSpecs.slice(1);

  const isRangeSpec = (s: string) => s.includes("-") || s.includes(":");
  const verses: number[] = [];
  for (const spec of specs) {
    if (isRangeSpec(spec)) {
      const [a, b] = spec.split(/[-:]/).map(Number).filter((n) => n >= 1);
      if (a != null && b != null && b >= a) {
        for (let i = a; i <= b; i++) verses.push(i);
      }
    } else {
      const n = Number(spec);
      if (n >= 1) verses.push(n);
    }
  }
  if (verses.length > 1 && verseSpecs.slice(1).every((s) => !isRangeSpec(s))) {
    verses.sort((a, b) => a - b);
  }

  // Book: remove all number and number-range tokens, then compact
  const bookPart = normalized
    .replace(/\d+(?:[-\:]\d+)?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const bookQuery = bookPart.replace(/\s+/g, "");

  return { bookQuery, chapterHint, verses };
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
  const lastRequestRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const { bookQuery, chapterHint, verses } = parseBibleQuery(query);
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
      const versesParam =
        verses.length > 0 ? verses : undefined;
      const qs = buildReadSearchParams({
        version1: defaultVersion,
        sync: true,
        book1Id: book.id,
        chapter1: ch,
        testament1: testament,
        verses: versesParam,
      });
      const href = `/bible/${langSegment}/read?${qs}`;
      const isContiguousRange =
        verses.length > 1 &&
        verses[verses.length - 1]! - verses[0]! === verses.length - 1;
      const verseLabel =
        verses.length === 0
          ? ""
          : verses.length === 1
            ? `:${verses[0]}`
            : isContiguousRange
              ? `:${verses[0]}-${verses[verses.length - 1]}`
              : `:${verses.join(",")}`;
      const main =
        verseLabel ? `${baseLabel} ${ch}${verseLabel}` : `${baseLabel} ${ch}`;
      const secondary =
        verses.length > 0
          ? intl.t("readChapterVerse", { ch, v: verses[0]! }) +
            (verses.length > 1 ? `–${verses[verses.length - 1]}` : "")
          : intl.t("readChapterN", { n: ch });
      items.push({
        id: `${book.id}-${ch}-${verses.join(",") || "all"}`,
        label: main,
        secondary,
        href,
      });
    }
    return items;
  }, [searchBook, chapterHint, verses, globalLanguage, langSegment, intl]);

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
        onClick={() => setOpen(true)}
        className={cn(
          "border-border bg-card text-muted-foreground hover:bg-muted/80 hover:border-foreground/20",
          "flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs",
          "transition-all duration-200 shadow-sm hover:shadow-md hover:text-foreground"
        )}
        aria-label="Open Bible search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Search Bible</span>
        <Kbd className="hidden sm:inline ml-auto text-[10px]">⌘K</Kbd>
      </button>
      <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) setQuery(""); }}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-xl rounded-xl p-0 gap-0"
          onEscapeKeyDown={() => setQuery("")}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search Bible</DialogTitle>
            <DialogDescription>Search for a book, chapter, or verse</DialogDescription>
          </DialogHeader>
          <Command shouldFilter={false} className="rounded-lg border-0" aria-label="Search Bible">
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
                  aria-label="Clear search"
                  onMouseDown={(e) => { e.preventDefault(); setQuery(""); }}
                  className="text-muted-foreground hover:text-foreground ml-2 shrink-0 rounded p-1.5 transition-colors outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <CommandList className="max-h-[450px]">
              {!query.trim() ? (
                <CommandEmpty className="flex flex-col items-center gap-4 px-6 py-10">
                  <div
                    className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    aria-hidden
                  >
                    <Lightbulb className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="w-full max-w-sm text-left">
                    <p className="text-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                      {intl.t("searchHintTitle")}
                    </p>
                    <ul className="text-muted-foreground list-inside space-y-1.5 text-sm leading-relaxed">
                      <li>{intl.t("searchHintSingle")}</li>
                      <li>{intl.t("searchHintTwo")}</li>
                      <li>{intl.t("searchHintRange")}</li>
                    </ul>
                  </div>
                </CommandEmpty>
              ) : searching ? (
                <CommandEmpty className="flex flex-col items-center justify-center gap-3 py-12">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" aria-hidden />
                  <p className="text-sm text-muted-foreground">{intl.t("searchSearching")}</p>
                </CommandEmpty>
              ) : suggestions.length === 0 ? (
                <CommandEmpty className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {intl.t("searchNoResultsFor")}{" "}
                    <span className="text-foreground font-semibold">&quot;{query}&quot;</span>
                  </p>
                  <p className="text-muted-foreground/60 mt-1 text-xs">
                    {intl.t("searchNoResultsTry")}
                  </p>
                </CommandEmpty>
              ) : (
                <div className="p-1">
                  <CommandGroup heading={intl.t("searchGoTo")} className="overflow-hidden">
                    {suggestions.map((s) => (
                      <CommandItem
                        key={s.id}
                        value={s.label}
                        onSelect={() => {
                          router.push(s.href);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="group flex cursor-pointer flex-col items-start rounded-md px-2 py-2.5 transition-colors hover:bg-primary/15 focus-visible:bg-primary/15 focus-visible:ring-0 data-[disabled]:opacity-50"
                      >
                        <span className="text-foreground text-sm font-semibold transition-colors group-hover:text-primary">
                          {s.label}
                        </span>
                        <span className="text-muted-foreground/70 text-xs transition-colors group-hover:text-muted-foreground">
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
