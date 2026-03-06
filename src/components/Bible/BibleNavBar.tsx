"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SquareMenu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/bible-navigation-menu";
import { cn } from "@/lib/utils";
import { useBibleApp } from "./BibleAppContext";
import { useReadFocus } from "./ReadFocusContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { Container } from "../ui/container";
import { BibleLogo, WhiteBibleLogo } from "./BibleLogo";
import { ThemeToggleButtonBibleApp } from "./theme-toggle-in-bible-app";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { Kbd } from "@/components/ui/kbd";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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

function BibleReferenceSearch({
  langSegment,
  globalLanguage,
}: {
  langSegment: "en" | "vi" | "zh";
  globalLanguage: "EN" | "VI" | "ZH";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchBook, setSearchBook] = useState<BibleBook | null>(null);
  const [searching, setSearching] = useState(false);
  const lastRequestRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

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
        verse && verse >= 1 ? `Chapter ${ch}, verse ${verse}` : `Chapter ${ch}`;
      items.push({
        id: `${book.id}-${ch}-${verse ?? "all"}`,
        label: main,
        secondary,
        href,
      });
    }
    return items;
  }, [searchBook, chapterHint, verse, globalLanguage, langSegment]);

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
      {open && (
        <div
          className="bg-background/70 fixed inset-0 z-50 flex items-center justify-center
            backdrop-blur-sm"
          onClick={() => {
            setOpen(false);
            setQuery("");
          }}
        >
          <div
            className="bg-card border-border w-full max-w-xl rounded-xl border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search book, chapter, verse…"
                value={query}
                onValueChange={setQuery}
                autoFocus
              />
              <CommandList>
                <CommandEmpty>
                  {searching
                    ? "Searching…"
                    : 'No results. Try "John 3 16" or "Ma-thi-ơ 1".'}
                </CommandEmpty>
                <CommandGroup heading="Go to">
                  {suggestions.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={s.label}
                      onSelect={() => {
                        router.push(s.href);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="hover:bg-primary/20 text-black dark:text-white"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{s.label}</span>
                        <span className="text-muted-foreground text-xs">
                          {s.secondary}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

/** Shared nav menu trigger classes so Learn, Bible, Glossary match (outline, px, hover, etc.) */
const NAV_MENU_TRIGGER_BASE =
  "h-auto rounded-lg border-0 px-2 py-1 text-sm font-medium shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const NAV_MENU_TRIGGER_HOVER = "hover:bg-coral/20 focus:bg-coral/20";
const NAV_MENU_TRIGGER_ACTIVE =
  "bg-[var(--coral)] text-[var(--coral-foreground)] data-[state=open]:bg-[var(--coral)] data-[state=open]:text-[var(--coral-foreground)]";
const NAV_MENU_TRIGGER_INACTIVE = "bg-transparent text-foreground";

/** Route segment for /bible/[lang]/... */
function languageToSegment(lang: "EN" | "VI" | "ZH"): "en" | "vi" | "zh" {
  if (lang === "VI") return "vi";
  if (lang === "ZH") return "zh";
  return "en";
}

/** If pathname is /bible/{en|vi|zh}/..., return path with new lang segment; else null. */
function pathWithLang(
  pathname: string | null,
  newSegment: "en" | "vi" | "zh"
): string | null {
  if (!pathname?.startsWith("/bible/")) return null;
  const match = pathname.match(/^\/bible\/(en|vi|zh)(\/.*)?$/);
  if (!match) return null;
  return `/bible/${newSegment}${match[2] ?? ""}`;
}

export function BibleNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { readFocusMode } = useReadFocus();
  const { globalLanguage, setGlobalLanguage, fontSize, setFontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const isLearn = pathname?.includes("/bible/") && pathname?.includes("/learn");

  function handleLanguageChange(lang: "EN" | "VI" | "ZH") {
    setGlobalLanguage(lang);
    const segment = languageToSegment(lang);
    const newPath =
      pathname === "/bible" || pathname === "/bible/"
        ? `/bible/${segment}`
        : pathWithLang(pathname, segment);
    if (newPath) {
      const qs = searchParams?.toString();
      router.replace(qs ? `${newPath}?${qs}` : newPath);
    }
  }
  const isBible =
    pathname?.includes("/bible/") &&
    (pathname?.includes("/read") ||
      pathname?.includes("/book-overviews") ||
      pathname?.includes("/topics") ||
      pathname?.includes("/topics-timeline"));
  // const isReflect = pathname?.includes("/bible/") && pathname?.includes("/reflect");
  const isGlossary =
    pathname?.includes("/bible/") &&
    (pathname?.includes("/flashcard") || pathname?.includes("/glossary"));

  /** ZH is only supported on read and flashcard; hide on learn, book-overviews, topics, reflect, study, glossary. */
  const showZhLanguage =
    (pathname?.includes("/bible/") && pathname?.includes("/read")) ||
    (pathname?.includes("/bible/") && pathname?.includes("/flashcard"));

  const learnLang = globalLanguage === "VI" ? "vi" : "en";
  const langSegment = pathname?.match(/^\/bible\/(en|vi|zh)/)?.[1] ?? learnLang;
  const learnLinks: {
    href: string;
    label: string;
    isActive: boolean;
    comingSoon?: boolean;
  }[] = [
    {
      href: `/bible/${learnLang}/learn`,
      label: intl.t("langPageCtaStart"),
      isActive: pathname === `/bible/${learnLang}/learn`,
    },
    {
      href: `/bible/${learnLang}/learn/bible-structure`,
      label: intl.t("langPageJ1Link1"),
      isActive:
        (pathname?.startsWith("/bible/") &&
          pathname?.includes("/learn/bible-structure")) ??
        false,
    },
    {
      href: `/bible/${learnLang}/learn/bible-origin`,
      label: intl.t("langPageJ1Link2"),
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/bible-origin")) ??
        false,
    },
    {
      href: `/bible/${learnLang}/learn/who-is-jesus`,
      label: intl.t("langPageJ1Link3"),
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/who-is-jesus")) ??
        false,
    },
    {
      href: `/bible/${learnLang}/learn/what-is-faith`,
      label: intl.t("langPageJ1Link4"),
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/what-is-faith")) ??
        false,
    },
  ];

  const bibleLinks: {
    href: string;
    label: string;
    isActive: boolean;
    comingSoon?: boolean;
  }[] = [
    {
      href: `/bible/${langSegment}/read`,
      label: intl.t("langPageNavRead"),
      isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/read")) ?? false,
    },
    {
      href: `/bible/${langSegment}/book-overviews`,
      label: intl.t("navBookOverviews"),
      isActive: pathname?.includes("/book-overviews") ?? false,
      comingSoon: true,
    },
    {
      href: `/bible/${langSegment}/topics`,
      label: intl.t("navTopicsExplorer"),
      isActive:
        (pathname?.includes("/topics") && !pathname?.includes("/topics-timeline")) ??
        false,
      comingSoon: true,
    },
    {
      href: `/bible/${langSegment}/topics-timeline`,
      label: intl.t("navTopicsTimeline"),
      isActive: pathname?.includes("/topics-timeline") ?? false,
      comingSoon: true,
    },
  ];

  // Reflect – nothing there yet
  // const reflectLinks: { href: string; label: string; isActive: boolean; comingSoon?: boolean }[] = [
  //   { href: `/bible/${langSegment}/reflect/journal`, label: "Journal", isActive: pathname?.includes("/reflect/journal") ?? false, comingSoon: true },
  //   { href: `/bible/${langSegment}/reflect/devotional`, label: "Devotional", isActive: pathname?.includes("/reflect/devotional") ?? false, comingSoon: true },
  // ];

  const glossaryLinks: {
    href: string;
    label: string;
    isActive: boolean;
    comingSoon?: boolean;
  }[] = [
    {
      href: `/bible/${langSegment}/flashcard`,
      label: intl.t("langPageNavFlashcards"),
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/flashcard")) ?? false,
    },
    {
      href: `/bible/${langSegment}/glossary/other`,
      label: intl.t("navOther"),
      isActive: pathname?.includes("/glossary/other") ?? false,
      comingSoon: true,
    },
  ];

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLangLanding = /^\/bible\/(en|vi|zh)$/.test(pathname ?? "");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function renderDropdownLinks(links: typeof learnLinks, firstBold = false) {
    return links.map((link, index) => (
      <NavigationMenuLink key={link.href} asChild>
        <Link
          href={link.href}
          className={cn(
            `group/item relative flex w-full flex-row items-center justify-start
            overflow-visible`,
            "rounded-lg px-2 py-1.5 text-left text-sm outline-none",
            `text-foreground transition-colors duration-200 hover:bg-transparent
            active:scale-[0.98]`,
            index === 0 && firstBold && "font-semibold",
            link.isActive && "bg-primary-light/20"
          )}
        >
          {!link.isActive && (
            <span
              className={cn(
                "bg-primary-dark absolute bottom-0 left-0 h-0.5 w-0 rounded-full",
                "transition-[width] duration-200 ease-out group-hover/item:w-full"
              )}
            />
          )}
          <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
            <span className="whitespace-nowrap">{link.label}</span>
            {link.comingSoon && (
              <span
                className="text-muted-foreground shrink-0 text-[10px] tracking-wide
                  uppercase"
              >
                {intl.t("navSoon")}
              </span>
            )}
          </span>
        </Link>
      </NavigationMenuLink>
    ));
  }

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300",
        readFocusMode &&
          "pointer-events-none h-0 overflow-hidden border-transparent opacity-0",
        !readFocusMode && "opacity-100",
        !readFocusMode &&
          (isLangLanding
            ? scrolled
              ? "border-border/60 bg-card/95 border-b shadow-sm"
              : "bg-transparent"
            : "border-border/60 bg-card/95 border-b shadow-sm")
      )}
    >
      <Container
        className="relative flex h-14 w-full items-center justify-between gap-2 px-4 py-3
          sm:px-6"
      >
        <Link href="/bible" className="flex min-w-0 items-center gap-6">
          <WhiteBibleLogo />
          <h1 className="invisible truncate text-lg font-semibold xl:visible">
            Scripture·Space
          </h1>
        </Link>
        <div
          className={cn(
            `absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2
            items-center justify-center xl:flex`
          )}
        >
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    NAV_MENU_TRIGGER_BASE,
                    NAV_MENU_TRIGGER_HOVER,
                    isLearn ? NAV_MENU_TRIGGER_ACTIVE : NAV_MENU_TRIGGER_INACTIVE
                  )}
                  style={
                    isLearn
                      ? {
                          backgroundColor: "var(--coral)",
                          color: "var(--coral-foreground)",
                        }
                      : undefined
                  }
                >
                  {intl.t("langPageNavLearn")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink asChild>
                    <Link
                      href={learnLinks[0].href}
                      className={cn(
                        `group/item text-foreground relative flex w-full flex-row
                        items-center justify-start overflow-visible rounded-lg px-2 py-1.5
                        text-left text-sm font-semibold whitespace-nowrap
                        transition-colors duration-200 outline-none hover:bg-transparent
                        active:scale-[0.98]`,
                        learnLinks[0].isActive && "bg-primary-light/20"
                      )}
                    >
                      {!learnLinks[0].isActive && (
                        <span
                          className="bg-primary-dark absolute bottom-0 left-0 h-0.5 w-0
                            rounded-full transition-[width] duration-200 ease-out
                            group-hover/item:w-full"
                        />
                      )}
                      <span className="whitespace-nowrap">{learnLinks[0].label}</span>
                    </Link>
                  </NavigationMenuLink>
                  <div className="bg-border my-1 h-px" />
                  {learnLinks.slice(1).map((link) => (
                    <NavigationMenuLink key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          `group/item text-foreground relative flex w-full flex-row
                          items-center justify-start overflow-visible rounded-lg px-2
                          py-1.5 text-left text-sm whitespace-nowrap transition-colors
                          duration-200 outline-none hover:bg-transparent
                          active:scale-[0.98]`,
                          link.isActive && "bg-primary-light/20"
                        )}
                      >
                        {!link.isActive && (
                          <span
                            className="bg-primary-dark absolute bottom-0 left-0 h-0.5 w-0
                              rounded-full transition-[width] duration-200 ease-out
                              group-hover/item:w-full"
                          />
                        )}
                        <span className="whitespace-nowrap">{link.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <span className="bg-border mx-2 h-4 w-px" aria-hidden />
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    NAV_MENU_TRIGGER_BASE,
                    NAV_MENU_TRIGGER_HOVER,
                    isBible ? NAV_MENU_TRIGGER_ACTIVE : NAV_MENU_TRIGGER_INACTIVE
                  )}
                  style={
                    isBible
                      ? {
                          backgroundColor: "var(--coral)",
                          color: "var(--coral-foreground)",
                        }
                      : undefined
                  }
                >
                  {intl.t("navBible")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {renderDropdownLinks(bibleLinks, true)}
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Reflect – nothing there yet
              <span className="h-4 w-px bg-border mx-1" aria-hidden />
              <NavigationMenuItem>
                <NavigationMenuTrigger ...>Reflect</NavigationMenuTrigger>
                <NavigationMenuContent>{renderDropdownLinks(reflectLinks)}</NavigationMenuContent>
              </NavigationMenuItem>
              */}
              <span className="bg-border mx-2 h-4 w-px" aria-hidden />
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    NAV_MENU_TRIGGER_BASE,
                    NAV_MENU_TRIGGER_HOVER,
                    isGlossary ? NAV_MENU_TRIGGER_ACTIVE : NAV_MENU_TRIGGER_INACTIVE
                  )}
                  style={
                    isGlossary
                      ? {
                          backgroundColor: "var(--coral)",
                          color: "var(--coral-foreground)",
                        }
                      : undefined
                  }
                >
                  {intl.t("langPageNavGlossary")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {renderDropdownLinks(glossaryLinks, true)}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* 0. Quick Bible reference search (desktop) */}
          <BibleReferenceSearch
            langSegment={langSegment as "en" | "vi" | "zh"}
            globalLanguage={globalLanguage}
          />

          {/* 1. Font size – single trigger + vertical dropdown (all screen sizes) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="border-sky-blue/40 bg-sky-blue text-sky-blue-foreground h-8
                  rounded-md border px-3 text-sm transition-all"
                aria-label={intl.t("navFontMedium")}
                title={
                  fontSize === "small"
                    ? intl.t("navFontSmall")
                    : fontSize === "large"
                      ? intl.t("navFontLarge")
                      : intl.t("navFontMedium")
                }
              >
                {fontSize === "small" ? "A-" : fontSize === "large" ? "A+" : "A"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-sky-blue/40 min-w-14 rounded-lg border bg-blue-50 p-1.5"
            >
              <DropdownMenuItem
                onClick={() => setFontSize("small")}
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                  fontSize === "small"
                    ? "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue"
                    : `text-muted-foreground hover:bg-primary/20 hover:text-foreground
                      focus:bg-primary/20 focus:text-foreground`
                )}
              >
                A-
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFontSize("medium")}
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                  fontSize === "medium"
                    ? "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue"
                    : `text-muted-foreground hover:bg-primary/20 hover:text-foreground
                      focus:bg-primary/20 focus:text-foreground`
                )}
              >
                A
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFontSize("large")}
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                  fontSize === "large"
                    ? "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue"
                    : `text-muted-foreground hover:bg-primary/20 hover:text-foreground
                      focus:bg-primary/20 focus:text-foreground`
                )}
              >
                A+
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. Language – single trigger + vertical dropdown (all screen sizes) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="border-bible-lang/40 bg-bible-lang text-bible-lang-foreground
                  h-8 rounded-md border px-3 text-sm transition-all"
                aria-label="Language"
              >
                {globalLanguage === "ZH" && !showZhLanguage
                  ? "EN"
                  : globalLanguage === "ZH"
                    ? "中"
                    : globalLanguage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-bible-lang/40 min-w-14 rounded-lg border bg-emerald-50
                p-1.5"
            >
              <DropdownMenuItem
                onClick={() => handleLanguageChange("EN")}
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                  globalLanguage === "EN" || (globalLanguage === "ZH" && !showZhLanguage)
                    ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang"
                    : `text-muted-foreground hover:bg-primary/20 hover:text-foreground
                      focus:bg-primary/20 focus:text-foreground`
                )}
              >
                EN
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("VI")}
                className={cn(
                  "h-8 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                  globalLanguage === "VI"
                    ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang"
                    : `text-muted-foreground hover:bg-primary/20 hover:text-foreground
                      focus:bg-primary/20 focus:text-foreground`
                )}
              >
                VI
              </DropdownMenuItem>
              {showZhLanguage && (
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("ZH")}
                  className={cn(
                    "h-8 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors",
                    globalLanguage === "ZH"
                      ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang"
                      : `text-muted-foreground hover:bg-primary/20 hover:text-foreground
                        focus:bg-primary/20 focus:text-foreground`
                  )}
                >
                  中
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 4. Palette + Theme */}
          <ThemePaletteSwitch />
          <ThemeToggleButtonBibleApp variant="desktop" />

          {/* 5. Mobile nav: sheet after theme toggle */}
          <div className="xl:hidden">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-primary-dark bg-primary-dark text-primary-foreground
                    hover:bg-primary-dark focus-visible:ring-ring h-8 w-8 rounded-lg
                    shadow-sm hover:opacity-90 focus-visible:ring-2
                    focus-visible:ring-offset-2"
                  aria-label="Open menu"
                >
                  <SquareMenu className="h-4 w-4 shrink-0" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-full max-w-[min(20rem,85vw)] flex-col border-l p-0
                  sm:max-w-sm"
              >
                <SheetHeader
                  className="flex flex-row items-center gap-3 border-b px-4 py-3 pr-12"
                >
                  <BibleLogo />
                  <SheetTitle className="truncate text-left text-lg font-semibold">
                    {intl.t("navAppName")}
                  </SheetTitle>
                  <div className="ml-auto flex items-center gap-1">
                    <ThemePaletteSwitch />
                    <ThemeToggleButtonBibleApp variant="desktop" />
                  </div>
                </SheetHeader>
                <nav className="flex-1 overflow-y-auto px-4 py-3">
                  <div className="space-y-6">
                    <section>
                      <h2
                        className="text-muted-foreground mb-2 text-xs font-semibold
                          tracking-wide uppercase"
                      >
                        {intl.t("langPageNavLearn")}
                      </h2>
                      <ul className="space-y-0.5">
                        {learnLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                `hover:bg-muted block rounded-lg px-3 py-2.5 text-sm
                                transition-colors`,
                                link.isActive &&
                                  "bg-primary-light/20 text-foreground font-medium"
                              )}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h2
                        className="text-muted-foreground mb-2 text-xs font-semibold
                          tracking-wide uppercase"
                      >
                        {intl.t("navBible")}
                      </h2>
                      <ul className="space-y-0.5">
                        {bibleLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                `hover:bg-muted flex items-center justify-between
                                rounded-lg px-3 py-2.5 text-sm transition-colors`,
                                link.isActive &&
                                  "bg-primary-light/20 text-foreground font-medium"
                              )}
                            >
                              <span>{link.label}</span>
                              {link.comingSoon && (
                                <span
                                  className="text-muted-foreground text-[10px]
                                    tracking-wide uppercase"
                                >
                                  {intl.t("navSoon")}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                    {/* Reflect – nothing there yet
                    <section>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reflect</h2>
                      <ul className="space-y-0.5">
                        {reflectLinks.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} onClick={() => setMobileNavOpen(false)} className={cn(...)}>
                              <span>{link.label}</span>
                              {link.comingSoon && <span className="...">{intl.t("navSoon")}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                    */}
                    <section>
                      <h2
                        className="text-muted-foreground mb-2 text-xs font-semibold
                          tracking-wide uppercase"
                      >
                        {intl.t("langPageNavGlossary")}
                      </h2>
                      <ul className="space-y-0.5">
                        {glossaryLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                `hover:bg-muted flex items-center justify-between
                                rounded-lg px-3 py-2.5 text-sm transition-colors`,
                                link.isActive &&
                                  "bg-primary-light/20 text-foreground font-medium"
                              )}
                            >
                              <span>{link.label}</span>
                              {link.comingSoon && (
                                <span
                                  className="text-muted-foreground text-[10px]
                                    tracking-wide uppercase"
                                >
                                  {intl.t("navSoon")}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </nav>
                <SheetFooter className="border-t py-3">
                  <Button
                    asChild
                    className="bg-primary-dark text-primary-foreground
                      hover:bg-primary-dark w-full hover:opacity-90"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Link href={`/bible/${learnLang}/read`}>Open Bible</Link>
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* 6. User (Clerk) */}
          {/* <SignedIn>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/bible" />
            </div>
          </SignedIn>
          <SignedOut>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/sign-in?redirect_url=/bible">Sign in</Link>
            </Button>
          </SignedOut> */}
        </div>
      </Container>
    </nav>
  );
}
