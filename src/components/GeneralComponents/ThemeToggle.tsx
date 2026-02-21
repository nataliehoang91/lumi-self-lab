"use client";

import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ variant }: { variant: "desktop" | "mobile" }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      data-variant={variant}
      className={cn(
        "h-8 w-8 rounded-full shrink-0 overflow-hidden",
        isLight ? "bg-amber-50 border-amber-300" : "border-blue-600/60 bg-transparent",
        variant === "mobile" && "w-full justify-start"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative flex h-4 w-4 items-center justify-center shrink-0">
        <Sun
          className={cn(
            "theme-toggle-icon theme-toggle-sun absolute inset-0 h-4 w-4 text-amber-700",
            isLight ? "theme-toggle-visible" : "theme-toggle-hidden"
          )}
        />
        <Moon
          className={cn(
            "theme-toggle-icon theme-toggle-moon absolute inset-0 h-4 w-4 text-blue-400",
            isLight ? "theme-toggle-hidden" : "theme-toggle-visible"
          )}
        />
      </div>
    </Button>
  );
}
