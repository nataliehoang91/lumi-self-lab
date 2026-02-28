"use client";

import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "../ui/button";

export function ThemeToggleButtonBibleApp({ variant }: { variant: "desktop" | "mobile" }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      data-variant={variant}
      className="h-8 w-8 rounded-full shrink-0 overflow-hidden border-border bg-background hover:bg-muted"
      aria-label="Toggle theme"
    >
      <div className="relative flex h-4 w-4 items-center justify-center shrink-0">
        <Sun
          className={cn(
            "theme-toggle-icon theme-toggle-sun absolute inset-0 h-4 w-4 text-foreground",
            isLight ? "theme-toggle-visible" : "theme-toggle-hidden"
          )}
        />
        <Moon
          className={cn(
            "theme-toggle-icon theme-toggle-moon absolute inset-0 h-4 w-4 text-foreground",
            isLight ? "theme-toggle-hidden" : "theme-toggle-visible"
          )}
        />
      </div>
    </Button>
  );
}
