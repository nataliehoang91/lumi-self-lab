"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronDown, Check, SquareMenu, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function BibleNavBar() {
  const pathname = usePathname();
  const { readFocusMode } = useReadFocus();
  const { globalLanguage, setGlobalLanguage, fontSize, setFontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const isRead = pathname?.includes("/bible/read");
  const isFlashcard = pathname?.includes("/bible/flashcard");
  const isLearn = pathname?.includes("/bible/learn");

  const learnLinks: { href: string; label: string; isActive: boolean }[] = [
    { href: "/bible/learn", label: "Start Here", isActive: pathname === "/bible/learn" },
    {
      href: "/bible/learn/bible-structure",
      label: "Bible Structure",
      isActive: pathname?.startsWith("/bible/learn/bible-structure") ?? false,
    },
    {
      href: "/bible/learn/bible-origin",
      label: "Bible Origin",
      isActive: pathname?.startsWith("/bible/learn/bible-origin") ?? false,
    },
    {
      href: "/bible/learn/who-is-jesus",
      label: "Who is Jesus",
      isActive: pathname?.startsWith("/bible/learn/who-is-jesus") ?? false,
    },
    {
      href: "/bible/learn/what-is-faith",
      label: "What is Faith",
      isActive: pathname?.startsWith("/bible/learn/what-is-faith") ?? false,
    },
  ];

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
          <h1 className="sm:visible invisible text-lg font-semibold truncate">Scripture Memory</h1>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-8 px-4 text-xs font-medium rounded-xl transition-all duration-200 border gap-1 bg-background hover:scale-[1.02] active:scale-[0.98]",
                    isLearn
                      ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90 data-[state=open]:bg-primary-dark data-[state=open]:text-primary-foreground"
                      : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground data-[state=open]:bg-primary/5"
                  )}
                >
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl min-w-40 p-1.5 left-0 overflow-visible data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 origin-top-left">
                  <NavigationMenuLink asChild>
                    <Link
                      href={learnLinks[0].href}
                      className={cn(
                        "group/item relative flex w-full overflow-visible rounded-lg px-2 py-1.5 text-sm outline-none transition-colors duration-200 hover:bg-transparent active:scale-[0.98] text-foreground font-semibold",
                        learnLinks[0].isActive && "bg-primary-light/20"
                      )}
                    >
                      {!learnLinks[0].isActive && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary-dark transition-[width] duration-200 ease-out group-hover/item:w-full" />
                      )}
                      {learnLinks[0].label}
                    </Link>
                  </NavigationMenuLink>
                  <div className="my-1 h-px bg-border" />
                  {learnLinks.slice(1).map((link) => (
                    <NavigationMenuLink key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "group/item relative flex w-full overflow-visible rounded-lg px-2 py-1.5 text-sm outline-none transition-colors duration-200 hover:bg-transparent active:scale-[0.98] text-foreground",
                          link.isActive && "bg-primary-light/20"
                        )}
                      >
                        {!link.isActive && (
                          <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary-dark transition-[width] duration-200 ease-out group-hover/item:w-full" />
                        )}
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/bible/read"
                    className={cn(
                      "inline-flex h-8 items-center justify-center rounded-xl border px-4 text-xs font-medium transition-all duration-200 outline-none hover:scale-[1.02] active:scale-[0.98]",
                      isRead
                        ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90"
                        : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground"
                    )}
                  >
                    Read
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/bible/flashcard"
                    className={cn(
                      "inline-flex h-8 items-center justify-center rounded-xl border px-4 text-xs font-medium transition-all duration-200 outline-none hover:scale-[1.02] active:scale-[0.98]",
                      isFlashcard
                        ? "bg-primary-dark text-primary-foreground border-primary-dark shadow-sm hover:opacity-90"
                        : "border-primary-dark bg-primary/5 hover:bg-primary-dark/10 hover:text-foreground"
                    )}
                  >
                    Flashcard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* 1. Square menu: navigate to Flashcard / Read (mobile only; center Read/Flashcard show from sm) */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 min-h-8 w-8 min-w-8 rounded-lg border border-primary-dark bg-primary-dark text-primary-foreground shadow-sm hover:opacity-90 hover:bg-primary-dark"
                  aria-label="Navigate to Flashcard or Read"
                >
                  <SquareMenu className="h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/bible/read" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Read
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bible/flashcard" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Flashcard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="font-semibold">
                  <Link href="/bible/learn">Start Here</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bible/learn/bible-structure">Bible Structure</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bible/learn/bible-origin">Bible Origin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bible/learn/who-is-jesus">Who is Jesus</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bible/learn/what-is-faith">What is Faith</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 2. Font size */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="skyBlue"
                  size="sm"
                  className="h-8 gap-1 px-2.5 text-sm rounded-md"
                  aria-label={intl.t("navFontMedium")}
                >
                  <span>{fontSize === "small" ? "A-" : fontSize === "large" ? "A+" : "A"}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFontSize("small")}>
                  {fontSize === "small" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                  A- {intl.t("navFontSmall")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize("medium")}>
                  {fontSize === "medium" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                  A {intl.t("navFontMedium")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize("large")}>
                  {fontSize === "large" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                  A+ {intl.t("navFontLarge")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden lg:flex items-center gap-0.5 rounded-lg border border-sky-blue/30 bg-sky-blue/10 p-0.5">
            <Button
              variant={fontSize === "small" ? "skyBlue" : "ghost"}
              size="sm"
              onClick={() => setFontSize("small")}
              className="h-8 px-3 text-sm hover:bg-sky-blue/20"
              title={intl.t("navFontSmall")}
              aria-label={intl.t("navFontSmall")}
            >
              A-
            </Button>
            <Button
              variant={fontSize === "medium" ? "skyBlue" : "ghost"}
              size="sm"
              onClick={() => setFontSize("medium")}
              className="h-8 px-3 text-sm hover:bg-sky-blue/20"
              title={intl.t("navFontMedium")}
              aria-label={intl.t("navFontMedium")}
            >
              A
            </Button>
            <Button
              variant={fontSize === "large" ? "skyBlue" : "ghost"}
              size="sm"
              onClick={() => setFontSize("large")}
              className="h-8 px-3 text-sm hover:bg-sky-blue/20"
              title={intl.t("navFontLarge")}
              aria-label={intl.t("navFontLarge")}
            >
              A+
            </Button>
          </div>

          {/* 3. Language – mint-forest green (on Learn: EN/VI only, no Chinese) */}
          <div className="hidden lg:flex items-center rounded-xl border border-bible-lang/40 bg-bible-lang/10 p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalLanguage("EN")}
              className={cn(
                "h-8 px-2.5 text-sm rounded-lg transition-all",
                globalLanguage === "EN" || (isLearn && globalLanguage === "ZH")
                  ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90"
                  : "text-muted-foreground hover:bg-bible-lang/20 hover:text-foreground"
              )}
            >
              EN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalLanguage("VI")}
              className={cn(
                "h-8 px-2.5 text-sm rounded-lg transition-all",
                globalLanguage === "VI"
                  ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90"
                  : "text-muted-foreground hover:bg-bible-lang/20 hover:text-foreground"
              )}
            >
              VI
            </Button>
            {!isLearn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGlobalLanguage("ZH")}
                className={cn(
                  "h-8 px-2.5 text-sm rounded-lg transition-all",
                  globalLanguage === "ZH"
                    ? "bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90"
                    : "text-muted-foreground hover:bg-bible-lang/20 hover:text-foreground"
                )}
              >
                中
              </Button>
            )}
          </div>
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 px-2.5 text-sm rounded-md bg-bible-lang text-bible-lang-foreground hover:bg-bible-lang/90 border-2 border-bible-lang"
                  aria-label="Language"
                >
                  <span>
                    {isLearn && globalLanguage === "ZH"
                      ? "EN"
                      : globalLanguage === "ZH"
                        ? "中"
                        : globalLanguage}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setGlobalLanguage("EN")}>
                  {globalLanguage === "EN" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="w-4" />
                  )}
                  EN
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGlobalLanguage("VI")}>
                  {globalLanguage === "VI" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="w-4" />
                  )}
                  VI
                </DropdownMenuItem>
                {!isLearn && (
                  <DropdownMenuItem onClick={() => setGlobalLanguage("ZH")}>
                    {globalLanguage === "ZH" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    中
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 4. Palette + Theme */}
          <ThemePaletteSwitch />
          <ThemeToggleButtonBibleApp variant="desktop" />

          {/* 5. User (Clerk) */}
          <SignedIn>
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
          </SignedOut>
        </div>
      </Container>
    </nav>
  );
}
