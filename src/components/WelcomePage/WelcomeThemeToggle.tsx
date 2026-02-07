"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function WelcomeThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "rounded-2xl ring-1 transition-colors",
          isDark
            ? "bg-red-500/20 text-red-600 hover:bg-red-500/30 ring-red-500/40 hover:ring-red-500/60 dark:text-red-400"
            : "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 ring-blue-500/40 hover:ring-blue-500/60 hover:text-blue-600"
        )}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </div>
  );
}
