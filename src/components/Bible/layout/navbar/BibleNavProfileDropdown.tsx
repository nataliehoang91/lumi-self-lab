"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, User, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
  "text-muted-foreground px-2 py-1 text-[10px] font-semibold tracking-wide uppercase";

const BADGE_BASE =
  "mr-2 flex h-5 w-6 shrink-0 items-center justify-center rounded border text-[10px] font-semibold tabular-nums";

export function BibleNavProfileDropdown() {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const { fontSize, setFontSize, globalLanguage, handleLanguageChange, intl } = useBibleNavData();

  const avatarUrl = user?.imageUrl;
  const displayName = user?.fullName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-8 w-8 overflow-hidden rounded-xl shadow-sm ring-1 ring-border/40 transition-all hover:scale-105 hover:ring-border focus:outline-none"
          aria-label="Profile menu"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-light text-xs font-semibold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60" sideOffset={8}>
        {/* User info */}
        <div className="px-3 py-2.5">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
        </div>

        <div className="bg-border my-1 h-px" />

        {/* Profile settings — opens Clerk modal */}
        <DropdownMenuItem
          onClick={() => openUserProfile()}
          className="cursor-pointer gap-2 text-sm"
        >
          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {intl.t("navProfileSettings")}
        </DropdownMenuItem>

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

        <div className="bg-border my-1 h-px" />

        {/* Sign out */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer overflow-hidden p-0 focus:bg-transparent"
        >
          <div className="relative w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {!confirmSignOut ? (
                <motion.button
                  key="signout"
                  type="button"
                  onClick={() => setConfirmSignOut(true)}
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/8 rounded-sm transition-colors"
                  initial={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeIn" }}
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" />
                  {intl.t("navSignOut")}
                </motion.button>
              ) : (
                <motion.div
                  key="confirm"
                  className="flex w-full items-center gap-2 px-2 py-1.5"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <span className="flex-1 text-xs text-muted-foreground">
                    {globalLanguage === "VI" ? "Xác nhận?" : "Confirm?"}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut({ redirectUrl: "/bible" })}
                    className="flex items-center gap-1 rounded-lg bg-destructive px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmSignOut(false)}
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
