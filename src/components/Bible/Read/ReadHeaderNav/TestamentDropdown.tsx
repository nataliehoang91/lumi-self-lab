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
import { cn } from "@/lib/utils";

type Variant = "desktop" | "mobile";

export function TestamentDropdown({ variant = "desktop" }: { variant?: Variant }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const { testamentFilter, setTestamentFilterAndAdjustBook } = useRead();

  const isDesktop = variant === "desktop";
  const useFullLabel = globalLanguage === "VI" && isDesktop;
  const label =
    testamentFilter === "ot"
      ? useFullLabel
        ? t("readOldTestament")
        : t("readOldShort")
      : useFullLabel
        ? t("readNewTestament")
        : t("readNewShort");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            `border-second bg-second/5 text-foreground hover:bg-second/10 h-9 shrink-0
            gap-1.5 rounded-lg border`,
            !isDesktop && "min-h-9 rounded-md"
          )}
          aria-label={
            testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")
          }
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          "min-w-[140px] rounded-lg",
          !isDesktop && "min-w-[120px] rounded-md"
        )}
      >
        <DropdownMenuItem
          onClick={() => setTestamentFilterAndAdjustBook("ot")}
          className={cn(
            "cursor-pointer gap-2",
            testamentFilter === "ot"
              ? "bg-second text-second-foreground font-medium"
              : "hover:bg-second/15 hover:text-second-foreground"
          )}
        >
          {testamentFilter === "ot" ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="w-4" />
          )}
          {useFullLabel ? t("readOldTestament") : t("readOldShort")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTestamentFilterAndAdjustBook("nt")}
          className={cn(
            "cursor-pointer gap-2",
            testamentFilter === "nt"
              ? "bg-second text-second-foreground font-medium"
              : "hover:bg-second/15 hover:text-second-foreground"
          )}
        >
          {testamentFilter === "nt" ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="w-4" />
          )}
          {useFullLabel ? t("readNewTestament") : t("readNewShort")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
