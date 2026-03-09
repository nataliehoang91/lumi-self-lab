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

/** Match from API when searching by chapter subtitle (context). */
interface ContextMatch {
  bookId: string;
  nameEn: string;
  nameVi: string;
  nameZh: string | null;
  order: number;
  chapterCount: number;
  chapterNumber: number;
  subtitle: string | null;
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
      const [a, b] = spec
        .split(/[-:]/)
        .map(Number)
        .filter((n) => n >= 1);
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
  const [contextMatches, setContextMatches] = useState<ContextMatch[]>([]);
  const [searching, setSearching] = useState(false);
  const lastRequestRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const { chapterHint, verses } = parseBibleQuery(query);
  const searchLang =
    globalLanguage === "VI"
      ? "vi"
      : globalLanguage === "EN"
        ? "en"
        : langSegment === "vi" || langSegment === "en"
          ? langSegment
          : "en";

  // Debounced API search. Send raw query so API can search by book key and by chapter subtitle (context).
  useEffect(() => {
    const raw = query.trim();

    if (!raw) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      lastRequestRef.current = "";
      setSearching(false);
      void Promise.resolve().then(() => {
        setSearchBook(null);
        setContextMatches([]);
      });
      return;
    }

    const t = setTimeout(() => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requested = raw;
      lastRequestRef.current = requested;
      setSearching(true);

      const params = new URLSearchParams({ q: requested, lang: searchLang });

      fetch(`/api/bible/search?${params}`, { signal: controller.signal })
        .then(async (res) => {
          let data: { book: BibleBook | null; contextMatches?: ContextMatch[] } = {
            book: null,
            contextMatches: [],
          };
          try {
            data = await res.json();
          } catch {
            // non-JSON body — treat as no result
          }
          if (!res.ok) return { book: null, contextMatches: [] };
          return {
            book: data?.book ?? null,
            contextMatches: data?.contextMatches ?? [],
          };
        })
        .then((data) => {
          if (lastRequestRef.current !== requested) return;
          setSearchBook(data.book ?? null);
          setContextMatches(data.contextMatches ?? []);
          setSearching(false);
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === "AbortError") return;
          if (lastRequestRef.current !== requested) return;
          setSearchBook(null);
          setContextMatches([]);
          setSearching(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [query, searchLang]);

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
      const versesParam = verses.length > 0 ? verses : undefined;
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
      const main = verseLabel ? `${baseLabel} ${ch}${verseLabel}` : `${baseLabel} ${ch}`;
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

  const contextSuggestions = useMemo<BibleQuickSuggestion[]>(() => {
    if (contextMatches.length === 0) return [];
    const defaultVersion = defaultVersionFromLanguage(globalLanguage);
    return contextMatches.map((m) => {
      const testament = m.order <= OT_ORDER_MAX ? "ot" : "nt";
      const bookLabel =
        globalLanguage === "VI" ? m.nameVi : globalLanguage === "ZH" ? m.nameZh ?? m.nameEn : m.nameEn;
      const qs = buildReadSearchParams({
        version1: defaultVersion,
        sync: true,
        book1Id: m.bookId,
        chapter1: m.chapterNumber,
        testament1: testament,
      });
      return {
        id: `ctx-${m.bookId}-${m.chapterNumber}`,
        label: `${bookLabel} ${m.chapterNumber}`,
        secondary: m.subtitle ?? intl.t("readChapterN", { n: m.chapterNumber }),
        href: `/bible/${langSegment}/read?${qs}`,
      };
    });
  }, [contextMatches, globalLanguage, langSegment, intl]);

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
          `border-border bg-card text-muted-foreground hover:bg-muted/80
          hover:border-foreground/20`,
          `relative z-[60] flex h-9 items-center justify-center gap-2 rounded-lg border
          px-3 text-xs`,
          "hover:text-foreground shadow-sm transition-all duration-200 hover:shadow-md"
        )}
        aria-label="Open Bible search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden font-medium sm:inline">Search Bible</span>
        <Kbd className="ml-auto hidden text-[10px] sm:inline">⌘K</Kbd>
      </button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-xl gap-0 rounded-xl p-0"
          onEscapeKeyDown={() => setQuery("")}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search Bible</DialogTitle>
            <DialogDescription>Search for a book, chapter, or verse</DialogDescription>
          </DialogHeader>
          <Command
            shouldFilter={false}
            className="w-full rounded-lg border-0"
            aria-label="Search Bible"
          >
            <div
              className="flex w-full cursor-text items-center border-b"
              role="presentation"
              onClick={() => inputRef.current?.focus()}
            >
              <CommandInput
                ref={inputRef}
                placeholder={intl.t("searchPlaceholder")}
                value={query}
                onValueChange={setQuery}
                autoFocus
                className="w-full flex-1"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery("");
                  }}
                  className="text-muted-foreground hover:text-foreground ml-2 shrink-0
                    rounded p-1.5 transition-colors outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <CommandList className="max-h-[450px]">
              {!query.trim() ? (
                <CommandEmpty className="flex flex-col items-center gap-4 px-6 py-10">
                  <div
                    className="bg-primary/10 text-primary flex h-10 w-10 shrink-0
                      items-center justify-center rounded-full"
                    aria-hidden
                  >
                    <Lightbulb className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="w-full max-w-sm text-left">
                    <p
                      className="text-foreground mb-2 text-xs font-medium tracking-wide
                        uppercase"
                    >
                      {intl.t("searchHintTitle")}
                    </p>
                    <ul
                      className="text-muted-foreground list-inside space-y-1.5 text-sm
                        leading-relaxed"
                    >
                      <li>{intl.t("searchHintSingle")}</li>
                      <li>{intl.t("searchHintTwo")}</li>
                      <li>{intl.t("searchHintRange")}</li>
                      <li>{intl.t("searchHintContext")}</li>
                    </ul>
                  </div>
                </CommandEmpty>
              ) : searching ? (
                <CommandEmpty
                  className="flex flex-col items-center justify-center gap-3 py-12"
                >
                  <Loader2 className="text-primary h-5 w-5 animate-spin" aria-hidden />
                  <p className="text-muted-foreground text-sm">
                    {intl.t("searchSearching")}
                  </p>
                </CommandEmpty>
              ) : suggestions.length === 0 && contextSuggestions.length === 0 ? (
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
                <div className="p-1 space-y-1">
                  {contextSuggestions.length > 0 ? (
                    <CommandGroup
                      heading={intl.t("searchContextHeading")}
                      className="overflow-hidden"
                    >
                      {contextSuggestions.map((s) => (
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
                            className="text-sm font-semibold text-slate-900
                              transition-colors group-hover:text-gray-900
                              hover:text-gray-900 dark:text-white"
                          >
                            {s.label}
                          </span>
                          <span
                            className="group-hover:text-foreground text-xs
                              transition-colors"
                          >
                            {s.secondary}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                  {suggestions.length > 0 ? (
                    <CommandGroup
                      heading={intl.t("searchGoTo")}
                      className="overflow-hidden"
                    >
                      {suggestions.map((s) => (
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
                            className="text-sm font-semibold text-slate-900
                              transition-colors group-hover:text-gray-900
                              hover:text-gray-900 dark:text-white"
                          >
                            {s.label}
                          </span>
                          <span
                            className="group-hover:text-foreground text-xs
                              transition-colors"
                          >
                            {s.secondary}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                </div>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
