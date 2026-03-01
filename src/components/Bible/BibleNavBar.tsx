"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SquareMenu } from "lucide-react";
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
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useBibleApp } from "./BibleAppContext";
import { useReadFocus } from "./ReadFocusContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { Container } from "../ui/container";
import { BibleLogo } from "./BibleLogo";
import { ThemeToggleButtonBibleApp } from "./theme-toggle-in-bible-app";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";

/** Route segment for /bible/[lang]/... */
function languageToSegment(lang: "EN" | "VI" | "ZH"): "en" | "vi" | "zh" {
  if (lang === "VI") return "vi";
  if (lang === "ZH") return "zh";
  return "en";
}

/** If pathname is /bible/{en|vi|zh}/..., return path with new lang segment; else null. */
function pathWithLang(pathname: string | null, newSegment: "en" | "vi" | "zh"): string | null {
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
  const isLearn = pathname?.includes("/bible/learn");

  function handleLanguageChange(lang: "EN" | "VI" | "ZH") {
    setGlobalLanguage(lang);
    const segment = languageToSegment(lang);
    const newPath = pathWithLang(pathname, segment);
    if (newPath) {
      const qs = searchParams?.toString();
      router.replace(qs ? `${newPath}?${qs}` : newPath);
    }
  }
  const isBible =
    pathname?.startsWith("/bible/read") ||
    pathname?.startsWith("/bible/book-overviews") ||
    pathname?.startsWith("/bible/topics") ||
    pathname?.startsWith("/bible/topics-timeline");
  const isReflect = pathname?.startsWith("/bible/reflect");
  const isGlossary =
    pathname?.includes("/bible/flashcard") || pathname?.startsWith("/bible/glossary");

  const learnLang = globalLanguage === "VI" ? "vi" : "en";
  const learnLinks: { href: string; label: string; isActive: boolean; comingSoon?: boolean }[] = [
    {
      href: `/bible/${learnLang}/learn`,
      label: "Start Here",
      isActive: pathname === `/bible/${learnLang}/learn`,
    },
    {
      href: `/bible/${learnLang}/learn/bible-structure`,
      label: "Bible Structure",
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/bible-structure")) ?? false,
    },
    {
      href: `/bible/${learnLang}/learn/bible-origin`,
      label: "Bible Origin",
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/bible-origin")) ?? false,
    },
    {
      href: `/bible/${learnLang}/learn/who-is-jesus`,
      label: "Who is Jesus",
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/who-is-jesus")) ?? false,
    },
    {
      href: `/bible/${learnLang}/learn/what-is-faith`,
      label: "What is Faith",
      isActive:
        (pathname?.startsWith("/bible/") && pathname?.includes("/learn/what-is-faith")) ?? false,
    },
  ];

  const bibleLinks: { href: string; label: string; isActive: boolean; comingSoon?: boolean }[] = [
    {
      href: `/bible/${learnLang}/read`,
      label: "Read",
      isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/read")) ?? false,
    },
    {
      href: "/bible/book-overviews",
      label: "Book Overviews",
      isActive: pathname === "/bible/book-overviews",
      comingSoon: true,
    },
    {
      href: "/bible/topics",
      label: "Topics Explorer",
      isActive: pathname === "/bible/topics",
      comingSoon: true,
    },
    {
      href: "/bible/topics-timeline",
      label: "Topics Timeline",
      isActive: pathname === "/bible/topics-timeline",
      comingSoon: true,
    },
  ];

  const reflectLinks: { href: string; label: string; isActive: boolean; comingSoon?: boolean }[] = [
    {
      href: "/bible/reflect/journal",
      label: "Journal",
      isActive: pathname?.startsWith("/bible/reflect/journal") ?? false,
      comingSoon: true,
    },
    {
      href: "/bible/reflect/devotional",
      label: "Devotional",
      isActive: pathname?.startsWith("/bible/reflect/devotional") ?? false,
      comingSoon: true,
    },
  ];

  const glossaryLinks: { href: string; label: string; isActive: boolean; comingSoon?: boolean }[] =
    [
      {
        href: `/bible/${learnLang}/flashcard`,
        label: "Flashcard",
        isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/flashcard")) ?? false,
      },
      {
        href: "/bible/glossary/other",
        label: "Other",
        isActive: pathname?.startsWith("/bible/glossary/other") ?? false,
        comingSoon: true,
      },
    ];

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function renderDropdownLinks(links: typeof learnLinks, firstBold = false) {
    return links.map((link, index) => (
      <NavigationMenuLink key={link.href} asChild>
        <Link
          href={link.href}
          className={cn(
            "group/item relative flex w-full flex-row items-center justify-start overflow-visible rounded-lg px-2 py-1.5 text-left text-sm outline-none transition-colors duration-200 hover:bg-transparent active:scale-[0.98] text-foreground",
            index === 0 && firstBold && "font-semibold",
            link.isActive && "bg-primary-light/20"
          )}
        >
          {!link.isActive && (
            <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary-dark transition-[width] duration-200 ease-out group-hover/item:w-full" />
          )}
          <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
            <span className="whitespace-nowrap">{link.label}</span>
            {link.comingSoon && (
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                Soon
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
        "fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 transition-all duration-300",
        readFocusMode
          ? "opacity-0 pointer-events-none h-0 overflow-hidden border-transparent"
          : "opacity-100"
      )}
    >
      <Container className="relative w-full h-14 flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-6 min-w-0">
          <BibleLogo />
          <h1 className="xl:visible invisible text-lg font-semibold truncate">Scripture Memory</h1>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-8 px-4 text-xs font-medium rounded-xl transition-all duration-200 border gap-1 bg-background hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isLearn
                      ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90 focus:bg-primary-dark focus:text-primary-foreground data-[state=open]:bg-primary-dark data-[state=open]:text-primary-foreground"
                      : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground focus:bg-primary/5 focus:text-foreground data-[state=open]:bg-primary/5"
                  )}
                >
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl min-w-40 p-1.5 left-0 overflow-visible data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 origin-top-left">
                  <NavigationMenuLink asChild>
                    <Link
                      href={learnLinks[0].href}
                      className={cn(
                        "group/item relative flex w-full flex-row items-center justify-start overflow-visible rounded-lg px-2 py-1.5 text-left text-sm outline-none transition-colors duration-200 hover:bg-transparent active:scale-[0.98] text-foreground font-semibold whitespace-nowrap",
                        learnLinks[0].isActive && "bg-primary-light/20"
                      )}
                    >
                      {!learnLinks[0].isActive && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary-dark transition-[width] duration-200 ease-out group-hover/item:w-full" />
                      )}
                      <span className="whitespace-nowrap">{learnLinks[0].label}</span>
                    </Link>
                  </NavigationMenuLink>
                  <div className="my-1 h-px bg-border" />
                  {learnLinks.slice(1).map((link) => (
                    <NavigationMenuLink key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "group/item relative flex w-full flex-row items-center justify-start overflow-visible rounded-lg px-2 py-1.5 text-left text-sm outline-none transition-colors duration-200 hover:bg-transparent active:scale-[0.98] text-foreground whitespace-nowrap",
                          link.isActive && "bg-primary-light/20"
                        )}
                      >
                        {!link.isActive && (
                          <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary-dark transition-[width] duration-200 ease-out group-hover/item:w-full" />
                        )}
                        <span className="whitespace-nowrap">{link.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-8 px-4 text-xs font-medium rounded-xl transition-all duration-200 border gap-1 bg-background hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isBible
                      ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90 focus:bg-primary-dark focus:text-primary-foreground data-[state=open]:bg-primary-dark data-[state=open]:text-primary-foreground"
                      : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground focus:bg-primary/5 focus:text-foreground data-[state=open]:bg-primary/5"
                  )}
                >
                  Bible
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl min-w-40 p-1.5 left-0 overflow-visible data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 origin-top-left">
                  {renderDropdownLinks(bibleLinks, true)}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-8 px-4 text-xs font-medium rounded-xl transition-all duration-200 border gap-1 bg-background hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isReflect
                      ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90 focus:bg-primary-dark focus:text-primary-foreground data-[state=open]:bg-primary-dark data-[state=open]:text-primary-foreground"
                      : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground focus:bg-primary/5 focus:text-foreground data-[state=open]:bg-primary/5"
                  )}
                >
                  Reflect
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl min-w-40 p-1.5 left-0 overflow-visible data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 origin-top-left">
                  {renderDropdownLinks(reflectLinks)}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-8 px-4 text-xs font-medium rounded-xl transition-all duration-200 border gap-1 bg-background hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isGlossary
                      ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90 focus:bg-primary-dark focus:text-primary-foreground data-[state=open]:bg-primary-dark data-[state=open]:text-primary-foreground"
                      : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground focus:bg-primary/5 focus:text-foreground data-[state=open]:bg-primary/5"
                  )}
                >
                  Glossary
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl min-w-40 p-1.5 left-0 overflow-visible data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 origin-top-left">
                  {renderDropdownLinks(glossaryLinks, true)}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* 1. Font size – single trigger + vertical dropdown (all screen sizes) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm rounded-md border border-sky-blue/40 bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue/90 transition-all"
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
              className="rounded-md min-w-14 border border-sky-blue/40 bg-sky-blue/10 p-1"
            >
              <DropdownMenuItem
                onClick={() => setFontSize("small")}
                className={cn(
                  "h-8 px-2.5 text-sm rounded-md transition-all cursor-pointer",
                  fontSize === "small"
                    ? "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue/90"
                    : "text-muted-foreground hover:bg-sky-blue/20 hover:text-foreground focus:bg-sky-blue/20 focus:text-foreground"
                )}
              >
                A-
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFontSize("medium")}
                className={cn(
                  "h-8 px-2.5 text-sm rounded-md transition-all cursor-pointer",
                  fontSize === "medium"
                    ? "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue/90"
                    : "text-muted-foreground hover:bg-sky-blue/20 hover:text-foreground focus:bg-sky-blue/20 focus:text-foreground"
                )}
              >
                A
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFontSize("large")}
                className={cn(
                  "h-8 px-2.5 text-sm rounded-md transition-all cursor-pointer",
                  fontSize === "large"
                    ? "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue/90"
                    : "text-muted-foreground hover:bg-sky-blue/20 hover:text-foreground focus:bg-sky-blue/20 focus:text-foreground"
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
                className="h-8 px-3 text-sm rounded-md border border-bible-lang/40 bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90 transition-all"
                aria-label="Language"
              >
                {isLearn && globalLanguage === "ZH"
                  ? "EN"
                  : globalLanguage === "ZH"
                    ? "中"
                    : globalLanguage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-md min-w-14 border border-bible-lang/40 bg-bible-lang/10 p-1"
            >
              <DropdownMenuItem
                onClick={() => handleLanguageChange("EN")}
                className={cn(
                  "h-8 px-2.5 text-sm rounded-md transition-all cursor-pointer",
                  globalLanguage === "EN" || (isLearn && globalLanguage === "ZH")
                    ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90"
                    : "text-muted-foreground hover:bg-bible-lang/20 hover:text-foreground focus:bg-bible-lang/20 focus:text-foreground"
                )}
              >
                EN
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("VI")}
                className={cn(
                  "h-8 px-2.5 text-sm rounded-md transition-all cursor-pointer",
                  globalLanguage === "VI"
                    ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90"
                    : "text-muted-foreground hover:bg-bible-lang/20 hover:text-foreground focus:bg-bible-lang/20 focus:text-foreground"
                )}
              >
                VI
              </DropdownMenuItem>
              {!isLearn && (
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("ZH")}
                  className={cn(
                    "h-8 px-2.5 text-sm rounded-md transition-all cursor-pointer",
                    globalLanguage === "ZH"
                      ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90"
                      : "text-muted-foreground hover:bg-bible-lang/20 hover:text-foreground focus:bg-bible-lang/20 focus:text-foreground"
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
                  className="h-8 w-8 rounded-lg border-primary-dark bg-primary-dark text-primary-foreground shadow-sm hover:opacity-90 hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Open menu"
                >
                  <SquareMenu className="h-4 w-4 shrink-0" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-full max-w-[min(20rem,85vw)] flex-col border-l p-0 sm:max-w-sm"
              >
                <SheetHeader className="flex flex-row items-center gap-3 border-b px-4 py-3 pr-12">
                  <BibleLogo />
                  <SheetTitle className="text-left text-lg font-semibold truncate">
                    Scripture Memory
                  </SheetTitle>
                  <div className="ml-auto flex items-center gap-1">
                    <ThemePaletteSwitch />
                    <ThemeToggleButtonBibleApp variant="desktop" />
                  </div>
                </SheetHeader>
                <nav className="flex-1 overflow-y-auto px-4 py-3">
                  <div className="space-y-6">
                    <section>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Learn
                      </h2>
                      <ul className="space-y-0.5">
                        {learnLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                                link.isActive && "bg-primary-light/20 font-medium text-foreground"
                              )}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Bible
                      </h2>
                      <ul className="space-y-0.5">
                        {bibleLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                                link.isActive && "bg-primary-light/20 font-medium text-foreground"
                              )}
                            >
                              <span>{link.label}</span>
                              {link.comingSoon && (
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                  Soon
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Reflect
                      </h2>
                      <ul className="space-y-0.5">
                        {reflectLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                                link.isActive && "bg-primary-light/20 font-medium text-foreground"
                              )}
                            >
                              <span>{link.label}</span>
                              {link.comingSoon && (
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                  Soon
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Glossary
                      </h2>
                      <ul className="space-y-0.5">
                        {glossaryLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                                link.isActive && "bg-primary-light/20 font-medium text-foreground"
                              )}
                            >
                              <span>{link.label}</span>
                              {link.comingSoon && (
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                  Soon
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
                    className="w-full bg-primary-dark text-primary-foreground hover:opacity-90 hover:bg-primary-dark"
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
