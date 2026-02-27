"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

type Variant = "desktop" | "mobile";

export function FocusModeButton({ variant = "desktop" }: { variant?: Variant }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const { focusMode, setFocusMode } = useRead();

  const isDesktop = variant === "desktop";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setFocusMode(!focusMode)}
      title={focusMode ? t("readExitFocus") : t("readFocusMode")}
      className={cn(
        "rounded-lg",
        focusMode
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent",
        !isDesktop && "rounded-md"
      )}
    >
      {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
    </Button>
  );
}
