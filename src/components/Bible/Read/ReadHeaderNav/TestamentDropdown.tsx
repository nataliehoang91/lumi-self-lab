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
  const label =
    testamentFilter === "ot" ? t("readOldShort") : t("readNewShort");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 rounded-lg border border-second bg-second/5 text-foreground h-9 shrink-0 hover:bg-second/10",
            !isDesktop && "rounded-md min-h-9"
          )}
          aria-label={testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn("min-w-[140px] rounded-lg", !isDesktop && "min-w-[120px] rounded-md")}
      >
        <DropdownMenuItem
          onClick={() => setTestamentFilterAndAdjustBook("ot")}
          className={cn(
            "gap-2 cursor-pointer",
            testamentFilter === "ot"
              ? "bg-second text-second-foreground font-medium"
              : "hover:bg-second/15 hover:text-second-foreground"
          )}
        >
          {testamentFilter === "ot" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
          {t("readOldShort")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTestamentFilterAndAdjustBook("nt")}
          className={cn(
            "gap-2 cursor-pointer",
            testamentFilter === "nt"
              ? "bg-second text-second-foreground font-medium"
              : "hover:bg-second/15 hover:text-second-foreground"
          )}
        >
          {testamentFilter === "nt" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
          {t("readNewShort")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
