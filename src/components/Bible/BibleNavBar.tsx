"use client";

import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  ArrowUpDown,
  ArrowLeftRight,
  LayoutGrid,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBibleApp } from "./BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { Container } from "../ui/container";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function BibleNavBar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { globalLanguage, setGlobalLanguage, fontSize, setFontSize, layoutMode, setLayoutMode } =
    useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <nav className=" fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-sm">
      <Container className=" w-full h-14 flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/bible"
            className="size-10 rounded-lg bg-linear-to-br from-primary-light via-coral to-yellow-200 text-stone-800 flex items-center justify-center shrink-0"
          >
            <span className="text-4xl">✝</span>
          </Link>
          <h1 className="sm:visible invisible text-lg font-semibold truncate">Scripture Memory</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Desktop: language as button group */}
          <div className="hidden md:flex items-center  rounded-lg border border-second/30 bg-second/10 p-0.5">
            <Button
              variant={globalLanguage === "EN" ? "secondaryLight" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("EN")}
              className="h-8 px-2.5 text-sm"
            >
              EN
            </Button>
            <Button
              variant={globalLanguage === "VI" ? "secondaryLight" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("VI")}
              className="h-8 px-2.5 text-sm"
            >
              VI
            </Button>
            <Button
              variant={globalLanguage === "ZH" ? "secondaryLight" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("ZH")}
              className="h-8 px-2.5 text-sm"
            >
              中
            </Button>
          </div>

          {/* Mobile: language dropdown — trigger = current language (full color like desktop active) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondaryLight"
                  size="sm"
                  className="h-8 gap-1 px-2.5 text-sm border border-second"
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

          {/* Mobile: layout dropdown — trigger = current layout icon (full color like desktop active) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="coral"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={intl.t("navLayoutShowAll")}
                >
                  {layoutMode === "vertical" ? (
                    <ArrowUpDown className="h-4 w-4" />
                  ) : layoutMode === "horizontal" ? (
                    <ArrowLeftRight className="h-4 w-4" />
                  ) : (
                    <LayoutGrid className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLayoutMode("vertical")}>
                  {layoutMode === "vertical" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="w-4" />
                  )}
                  <ArrowUpDown className="h-4 w-4" />
                  {intl.t("navLayoutVertical")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLayoutMode("horizontal")}>
                  {layoutMode === "horizontal" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="w-4" />
                  )}
                  <ArrowLeftRight className="h-4 w-4" />
                  {intl.t("navLayoutHorizontal")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLayoutMode("all")}>
                  {layoutMode === "all" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                  <LayoutGrid className="h-4 w-4" />
                  {intl.t("navLayoutShowAll")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile: font size dropdown — trigger = current font size (full color like desktop active) */}
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

          {/* Desktop: inline layout + font size */}
          <div className="hidden md:flex items-center gap-4">
            {/* View: coral */}
            <div className="flex items-center gap-0.5 rounded-lg border border-coral/30 bg-coral/10 p-0.5">
              <Button
                variant={layoutMode === "vertical" ? "coral" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("vertical")}
                className="h-8 w-8 hover:bg-coral/20"
                title={intl.t("navLayoutVertical")}
                aria-label={intl.t("navLayoutVertical")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === "horizontal" ? "coral" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("horizontal")}
                className="h-8 w-8 hover:bg-coral/20"
                title={intl.t("navLayoutHorizontal")}
                aria-label={intl.t("navLayoutHorizontal")}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === "all" ? "coral" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("all")}
                className="h-8 w-8 hover:bg-coral/20"
                title={intl.t("navLayoutShowAll")}
                aria-label={intl.t("navLayoutShowAll")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            {/* Font size: sky blue */}
            <div className="flex items-center gap-0.5 rounded-lg border border-sky-blue/30 bg-sky-blue/10 p-0.5">
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
          </div>

          {/* Theme button — same on mobile and desktop */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "h-8 w-8 rounded-full shrink-0",
              mounted && theme === "light"
                ? "bg-amber-50 border-amber-300"
                : "border-blue-600/60 bg-transparent"
            )}
          >
            {!mounted ? (
              <span className="h-4 w-4" aria-hidden />
            ) : theme === "light" ? (
              <Sun className="h-4 w-4 text-amber-700" />
            ) : (
              <Moon className="h-4 w-4 text-blue-400" />
            )}
          </Button>
        </div>
      </Container>
    </nav>
  );
}
