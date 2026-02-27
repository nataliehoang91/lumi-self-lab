"use client";

import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { TRANSLATIONS, VERSION_BADGE_CLASS } from "../constants";
import { cn } from "@/lib/utils";

export function VersionDropdownMobile() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const { leftVersion, rightVersion, handleVersionChipClick } = useRead();

  return (
    <div className="flex items-center gap-2 min-w-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-md border-border bg-card text-foreground hover:bg-muted/50 min-h-9"
            aria-label={t("readVersion")}
          >
            <span className="truncate">{t("readVersion")}</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px] rounded-md">
          {TRANSLATIONS.map((trans) => (
            <DropdownMenuItem
              key={trans.id}
              onClick={() => handleVersionChipClick(trans.id)}
              className="gap-2"
            >
              {leftVersion === trans.id || rightVersion === trans.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="w-4" />
              )}
              {trans.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {(leftVersion !== null || rightVersion !== null) && (
        <div className="flex items-center gap-1.5 shrink-0">
          {leftVersion !== null && (
            <button
              type="button"
              onClick={() => handleVersionChipClick(leftVersion)}
              className={cn(
                "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm",
                "transition-colors hover:brightness-95",
                VERSION_BADGE_CLASS[leftVersion]
              )}
            >
              {TRANSLATIONS.find((tr) => tr.id === leftVersion)?.name ?? leftVersion}
            </button>
          )}
          {rightVersion !== null && (
            <button
              type="button"
              onClick={() => handleVersionChipClick(rightVersion)}
              className={cn(
                "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm",
                "transition-colors hover:brightness-95",
                VERSION_BADGE_CLASS[rightVersion]
              )}
            >
              {TRANSLATIONS.find((tr) => tr.id === rightVersion)?.name ?? rightVersion}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
