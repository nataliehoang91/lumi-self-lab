"use client";

import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "../ui/button";

export function ThemeToggleButtonBibleApp({
  variant,
}: {
  variant: "desktop" | "mobile";
}) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      data-variant={variant}
      className="border-border bg-background hover:bg-muted h-8 w-8 shrink-0
        overflow-hidden rounded-full"
      aria-label="Toggle theme"
    >
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <Sun
          className={cn(
            "theme-toggle-icon theme-toggle-sun text-foreground absolute inset-0 h-4 w-4",
            isLight ? "theme-toggle-visible" : "theme-toggle-hidden"
          )}
        />
        <Moon
          className={cn(
            "theme-toggle-icon theme-toggle-moon text-foreground absolute inset-0 h-4 w-4",
            isLight ? "theme-toggle-hidden" : "theme-toggle-visible"
          )}
        />
      </div>
    </Button>
  );
}
