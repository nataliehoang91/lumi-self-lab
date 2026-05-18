"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { ThemeToggleButtonBibleApp } from "@/components/Bible/theme-toggle-in-bible-app";
import { cn } from "@/lib/utils";
import { useBibleNavData } from "./useBibleNavData";

const SECTION_HEADER_CLASS =
  "text-muted-foreground px-2 py-1 text-[10px] font-semibold tracking-wide uppercase";

const BADGE_BASE =
  "mr-2 flex h-5 w-6 shrink-0 items-center justify-center rounded border text-[10px] font-semibold tabular-nums";

export function BibleNavGuestDropdown() {
  const { fontSize, setFontSize, globalLanguage, handleLanguageChange, intl } = useBibleNavData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground focus:outline-none"
          aria-label="Menu"
        >
          <UserRound className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60" sideOffset={8}>
        {/* Auth — first row, side by side */}
        <div className="flex gap-2 px-2 py-2">
          <Link
            href="/sign-in"
            className="flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {intl.t("navSignIn")}
          </Link>
          <Link
            href="/sign-up"
            className="flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {intl.t("navSignUp")}
          </Link>
        </div>

        <div className="bg-border my-1 h-px" />

        {/* Font Size */}
        <div className={SECTION_HEADER_CLASS}>{intl.t("navSettingsFontSize")}</div>
        {(["small", "medium", "large"] as const).map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => setFontSize(size)}
            className="hover:bg-sky-blue/20 focus:bg-sky-blue/20 cursor-pointer text-sm"
          >
            <span
              className={cn(
                BADGE_BASE,
                fontSize === size
                  ? "border-sky-blue bg-sky-blue text-sky-blue-foreground"
                  : "border-sky-blue/40 bg-sky-blue/10 text-sky-blue"
              )}
            >
              {size === "small" ? "A-" : size === "medium" ? "A" : "A+"}
            </span>
            <span className={cn("text-muted-foreground", fontSize === size && "font-bold")}>
              {intl.t(size === "small" ? "navSettingsFontSmall" : size === "medium" ? "navSettingsFontNormal" : "navSettingsFontLarge")}
            </span>
          </DropdownMenuItem>
        ))}

        <div className="bg-border my-1 h-px" />

        {/* Language */}
        <div className={SECTION_HEADER_CLASS}>{intl.t("navSettingsLanguage")}</div>
        {(["EN", "VI"] as const).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className="hover:bg-sage/20 focus:bg-sage/20 cursor-pointer text-sm"
          >
            <span
              className={cn(
                BADGE_BASE,
                globalLanguage === lang
                  ? "border-sage bg-sage text-sage-foreground"
                  : "border-sage/40 bg-sage/10 text-sage"
              )}
            >
              {lang}
            </span>
            <span className={cn(globalLanguage === lang && "font-bold")}>
              {intl.t(lang === "EN" ? "navLangEnglish" : "navLangVietnamese")}
            </span>
          </DropdownMenuItem>
        ))}

        <div className="bg-border my-1 h-px" />

        {/* Theme */}
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <span className={SECTION_HEADER_CLASS}>{intl.t("navSettingsTheme")}</span>
          <div className="flex items-center gap-2">
            <ThemePaletteSwitch />
            <ThemeToggleButtonBibleApp variant="desktop" />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
