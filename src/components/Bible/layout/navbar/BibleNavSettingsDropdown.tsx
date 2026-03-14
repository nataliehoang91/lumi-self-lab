"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { ThemeToggleButtonBibleApp } from "@/components/Bible/theme-toggle-in-bible-app";
import { cn } from "@/lib/utils";
import { useBibleNavData } from "./useBibleNavData";

const SECTION_HEADER_CLASS =
  "text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wide uppercase";

const BADGE_BASE =
  "mr-2 flex h-5 w-6 shrink-0 items-center justify-center rounded border text-[10px] font-semibold tabular-nums";

interface BibleNavSettingsDropdownProps {
  variant: "desktop" | "mobile";
}

export function BibleNavSettingsDropdown({ variant }: BibleNavSettingsDropdownProps) {
  const isDesktop = variant === "desktop";
  const {
    fontSize,
    setFontSize,
    globalLanguage,
    showZhLanguage,
    handleLanguageChange,
    intl,
  } = useBibleNavData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={isDesktop ? "w-56" : "w-48"}>
        {/* Font Size Section */}
        <div className={SECTION_HEADER_CLASS}>{intl.t("navSettingsFontSize")}</div>
        <DropdownMenuItem
          onClick={() => setFontSize("small")}
          className="hover:bg-sky-blue/20 focus:bg-sky-blue/20 cursor-pointer text-sm"
        >
          <span
            className={cn(
              BADGE_BASE,
              fontSize === "small"
                ? "border-sky-blue bg-sky-blue text-sky-blue-foreground"
                : "border-sky-blue/40 bg-sky-blue/10 text-sky-blue"
            )}
          >
            A-
          </span>
          <span className={cn("text-muted-foreground", fontSize === "small" && "font-bold")}>
            {intl.t("navSettingsFontSmall")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setFontSize("medium")}
          className="hover:bg-sky-blue/20 focus:bg-sky-blue/20 cursor-pointer text-sm"
        >
          <span
            className={cn(
              BADGE_BASE,
              fontSize === "medium"
                ? "border-sky-blue bg-sky-blue text-sky-blue-foreground"
                : "border-sky-blue/40 bg-sky-blue/10 text-sky-blue"
            )}
          >
            A
          </span>
          <span className={cn("text-muted-foreground", fontSize === "medium" && "font-bold")}>
            {intl.t("navSettingsFontNormal")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setFontSize("large")}
          className="hover:bg-sky-blue/20 focus:bg-sky-blue/20 cursor-pointer text-sm"
        >
          <span
            className={cn(
              BADGE_BASE,
              fontSize === "large"
                ? "border-sky-blue bg-sky-blue text-sky-blue-foreground"
                : "border-sky-blue/40 bg-sky-blue/10 text-sky-blue"
            )}
          >
            A+
          </span>
          <span className={cn("text-muted-foreground", fontSize === "large" && "font-bold")}>
            {intl.t("navSettingsFontLarge")}
          </span>
        </DropdownMenuItem>

        <div className="bg-border my-1 h-px" />

        {/* Language Section */}
        <div className={SECTION_HEADER_CLASS}>{intl.t("navSettingsLanguage")}</div>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("EN")}
          className="hover:bg-sage/20 focus:bg-sage/20 cursor-pointer text-sm"
        >
          <span
            className={cn(
              BADGE_BASE,
              globalLanguage === "EN" || (globalLanguage === "ZH" && !showZhLanguage)
                ? "border-sage bg-sage text-sage-foreground"
                : "border-sage/40 bg-sage/10 text-sage"
            )}
          >
            EN
          </span>
          <span
            className={cn(
              (globalLanguage === "EN" || (globalLanguage === "ZH" && !showZhLanguage)) &&
                "font-bold"
            )}
          >
            {intl.t("navLangEnglish")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("VI")}
          className="hover:bg-sage/20 focus:bg-sage/20 cursor-pointer text-sm"
        >
          <span
            className={cn(
              BADGE_BASE,
              globalLanguage === "VI"
                ? "border-sage bg-sage text-sage-foreground"
                : "border-sage/40 bg-sage/10 text-sage"
            )}
          >
            VI
          </span>
          <span className={cn(globalLanguage === "VI" && "font-bold")}>
            {intl.t("navLangVietnamese")}
          </span>
        </DropdownMenuItem>
        {showZhLanguage && (
          <DropdownMenuItem
            onClick={() => handleLanguageChange("ZH")}
            className="hover:bg-sage/20 focus:bg-sage/20 cursor-pointer text-sm"
          >
            <span
              className={cn(
                BADGE_BASE,
                globalLanguage === "ZH"
                  ? "border-sage bg-sage text-sage-foreground"
                  : "border-sage/40 bg-sage/10 text-sage"
              )}
            >
              中
            </span>
            <span className={cn(globalLanguage === "ZH" && "font-bold")}>
              {intl.t("navLangChinese")}
            </span>
          </DropdownMenuItem>
        )}

        <div className="bg-border my-1 h-px" />

        {/* Theme Section */}

        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className={SECTION_HEADER_CLASS}>{intl.t("navSettingsTheme")}</div>
          <div className="flex items-center gap-2">
            <ThemePaletteSwitch />
            <ThemeToggleButtonBibleApp variant="desktop" />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
