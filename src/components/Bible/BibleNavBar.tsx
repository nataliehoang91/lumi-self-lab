"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBibleApp } from "./BibleAppContext";
import { useReadFocus } from "./ReadFocusContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { Container } from "../ui/container";
import { BibleLogo } from "./BibleLogo";
import { ThemeToggleButtonBibleApp } from "./theme-toggle-in-bible-app";

export function BibleNavBar() {
  const pathname = usePathname();
  const { readFocusMode } = useReadFocus();
  const { globalLanguage, setGlobalLanguage, fontSize, setFontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const isRead = pathname?.includes("/bible/read");
  const isFlashcard = pathname?.includes("/bible/flashcard");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-300 ${
        readFocusMode ? "opacity-0 pointer-events-none h-0 overflow-hidden border-transparent" : "opacity-100"
      }`}
    >
      <Container className=" w-full h-14 flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <BibleLogo />
          <h1 className="sm:visible invisible text-lg font-semibold truncate">Scripture Memory</h1>
          <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
            <Button
              variant={isFlashcard ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              asChild
            >
              <Link href="/bible/flashcard">Flashcard</Link>
            </Button>
            <Button
              variant={isRead ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              asChild
            >
              <Link href="/bible/read">Read</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* 1. Font size */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="skyBlue"
                  size="sm"
                  className="h-8 gap-1 px-2.5 text-sm"
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
          <div className="hidden md:flex items-center gap-0.5 rounded-lg border border-sky-blue/30 bg-sky-blue/10 p-0.5">
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

          {/* 2. Language (coral — same as previous grid) */}
          <div className="hidden md:flex items-center rounded-lg border border-coral/30 bg-coral/10 p-0.5">
            <Button
              variant={globalLanguage === "EN" ? "coral" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("EN")}
              className="h-8 px-2.5 text-sm hover:bg-coral/20"
            >
              EN
            </Button>
            <Button
              variant={globalLanguage === "VI" ? "coral" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("VI")}
              className="h-8 px-2.5 text-sm hover:bg-coral/20"
            >
              VI
            </Button>
            <Button
              variant={globalLanguage === "ZH" ? "coral" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("ZH")}
              className="h-8 px-2.5 text-sm hover:bg-coral/20"
            >
              中
            </Button>
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="coral"
                  size="sm"
                  className="h-8 gap-1 px-2.5 text-sm"
                  aria-label="Language"
                >
                  <span>{globalLanguage === "ZH" ? "中" : globalLanguage}</span>
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
                <DropdownMenuItem onClick={() => setGlobalLanguage("ZH")}>
                  {globalLanguage === "ZH" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="w-4" />
                  )}
                  中
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 3. Grid (layout) — second color; light: tint, dark: solid fill */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-second/30 bg-second/10 text-second dark:bg-second-dark dark:border-second-dark dark:text-second-foreground"
            title={intl.t("navLayoutShowAll")}
            aria-hidden
          >
            <LayoutGrid className="h-4 w-4" />
          </div>

          {/* 4. Theme */}
          <ThemeToggleButtonBibleApp variant="desktop" />
        </div>
      </Container>
    </nav>
  );
}
