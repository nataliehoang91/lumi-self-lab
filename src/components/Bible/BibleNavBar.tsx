"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SquareMenu, Settings } from "lucide-react";
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
import { BibleReferenceSearch } from "./BibleReferenceSearch";

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
            ScriptureSpace
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

        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop: Search + Settings dropdown */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Smart Search */}
            <BibleReferenceSearch
              langSegment={langSegment as "en" | "vi" | "zh"}
              globalLanguage={globalLanguage}
            />

            {/* All settings in one dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Font Size Section */}
                <div
                  className="text-muted-foreground px-2 py-1.5 text-xs font-semibold
                    tracking-wide uppercase"
                >
                  Font Size
                </div>
                <DropdownMenuItem
                  onClick={() => setFontSize("small")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sky-blue/20 focus:bg-sky-blue/20",
                    fontSize === "small" && "bg-sky-blue/20"
                  )}
                >
                  <span className="w-6">A-</span>
                  <span className="text-muted-foreground">Small</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFontSize("medium")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sky-blue/20 focus:bg-sky-blue/20",
                    fontSize === "medium" && "bg-sky-blue/20"
                  )}
                >
                  <span className="w-6">A</span>
                  <span className="text-muted-foreground">Normal</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFontSize("large")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sky-blue/20 focus:bg-sky-blue/20",
                    fontSize === "large" && "bg-sky-blue/20"
                  )}
                >
                  <span className="w-6">A+</span>
                  <span className="text-muted-foreground">Large</span>
                </DropdownMenuItem>

                <div className="bg-border my-1 h-px" />

                {/* Language Section */}
                <div
                  className="text-muted-foreground px-2 py-1.5 text-xs font-semibold
                    tracking-wide uppercase"
                >
                  Language
                </div>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("EN")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sage/20 focus:bg-sage/20",
                    (globalLanguage === "EN" ||
                      (globalLanguage === "ZH" && !showZhLanguage)) &&
                      "bg-emerald-100/50"
                  )}
                >
                  <span
                    className="mr-2 flex h-5 w-6 shrink-0 items-center justify-center
                      rounded bg-muted text-[10px] font-semibold tabular-nums
                      text-muted-foreground"
                    aria-hidden
                  >
                    EN
                  </span>
                  <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("VI")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sage/20 focus:bg-sage/20",
                    globalLanguage === "VI" && "bg-emerald-100/50"
                  )}
                >
                  <span
                    className="mr-2 flex h-5 w-6 shrink-0 items-center justify-center
                      rounded bg-muted text-[10px] font-semibold tabular-nums
                      text-muted-foreground"
                    aria-hidden
                  >
                    VI
                  </span>
                  <span>Tiếng Việt</span>
                </DropdownMenuItem>
                {showZhLanguage && (
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("ZH")}
                    className={cn(
                      "cursor-pointer text-sm hover:bg-sage/20 focus:bg-sage/20",
                      globalLanguage === "ZH" && "bg-emerald-100/50"
                    )}
                  >
                    <span
                      className="mr-2 flex h-5 w-6 shrink-0 items-center justify-center
                        rounded bg-muted text-[10px] font-semibold tabular-nums
                        text-muted-foreground"
                      aria-hidden
                    >
                      ZH
                    </span>
                    <span>中文</span>
                  </DropdownMenuItem>
                )}

                <div className="bg-border my-1 h-px" />

                {/* Theme Palette + Appearance Section - Compact flex row */}
                <div
                  className="text-muted-foreground flex items-center justify-between px-2
                    py-1.5 text-xs font-semibold tracking-wide uppercase"
                >
                  <p>Theme</p>
                  <span className="flex items-center gap-2">
                    <ThemePaletteSwitch />
                    <ThemeToggleButtonBibleApp variant="desktop" />
                  </span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile: Compact settings menu + theme toggles */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Search (compact) */}
            <div className="max-w-[160px]">
              <BibleReferenceSearch
                langSegment={langSegment as "en" | "vi" | "zh"}
                globalLanguage={globalLanguage}
              />
            </div>

            {/* Settings dropdown for mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Font Size Section */}
                <div
                  className="text-muted-foreground px-2 py-1.5 text-xs font-semibold
                    tracking-wide uppercase"
                >
                  Font Size
                </div>
                <DropdownMenuItem
                  onClick={() => setFontSize("small")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sky-blue/20 focus:bg-sky-blue/20",
                    fontSize === "small" && "bg-sky-blue/20"
                  )}
                >
                  <span className="w-6">A-</span>
                  <span className="text-muted-foreground">Small</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFontSize("medium")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sky-blue/20 focus:bg-sky-blue/20",
                    fontSize === "medium" && "bg-sky-blue/20"
                  )}
                >
                  <span className="w-6">A</span>
                  <span className="text-muted-foreground">Normal</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFontSize("large")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sky-blue/20 focus:bg-sky-blue/20",
                    fontSize === "large" && "bg-sky-blue/20"
                  )}
                >
                  <span className="w-6">A+</span>
                  <span className="text-muted-foreground">Large</span>
                </DropdownMenuItem>

                <div className="bg-border my-1 h-px" />

                {/* Language Section */}
                <div
                  className="text-muted-foreground px-2 py-1.5 text-xs font-semibold
                    tracking-wide uppercase"
                >
                  Language
                </div>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("EN")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sage/20 focus:bg-sage/20",
                    (globalLanguage === "EN" ||
                      (globalLanguage === "ZH" && !showZhLanguage)) &&
                      "bg-emerald-100/50"
                  )}
                >
                  <span
                    className="mr-2 flex h-5 w-6 shrink-0 items-center justify-center
                      rounded bg-muted text-[10px] font-semibold tabular-nums
                      text-muted-foreground"
                    aria-hidden
                  >
                    EN
                  </span>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("VI")}
                  className={cn(
                    "cursor-pointer text-sm hover:bg-sage/20 focus:bg-sage/20",
                    globalLanguage === "VI" && "bg-emerald-100/50"
                  )}
                >
                  <span
                    className="mr-2 flex h-5 w-6 shrink-0 items-center justify-center
                      rounded bg-muted text-[10px] font-semibold tabular-nums
                      text-muted-foreground"
                    aria-hidden
                  >
                    VI
                  </span>
                  Tiếng Việt
                </DropdownMenuItem>
                {showZhLanguage && (
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("ZH")}
                    className={cn(
                      "cursor-pointer text-sm hover:bg-sage/20 focus:bg-sage/20",
                      globalLanguage === "ZH" && "bg-emerald-100/50"
                    )}
                  >
                    <span
                      className="mr-2 flex h-5 w-6 shrink-0 items-center justify-center
                        rounded bg-muted text-[10px] font-semibold tabular-nums
                        text-muted-foreground"
                      aria-hidden
                    >
                      ZH
                    </span>
                    中文
                  </DropdownMenuItem>
                )}

                <div className="bg-border my-1 h-px" />

                {/* Theme Section */}
                <div
                  className="text-muted-foreground px-2 py-1.5 text-xs font-semibold
                    tracking-wide uppercase"
                >
                  Theme
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <span className="text-foreground text-sm">Palette</span>
                  <ThemePaletteSwitch />
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <span className="text-foreground text-sm">Dark Mode</span>
                  <ThemeToggleButtonBibleApp variant="desktop" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
