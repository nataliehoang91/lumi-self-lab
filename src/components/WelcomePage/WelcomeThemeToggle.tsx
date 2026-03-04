"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function WelcomeThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [displayDark, setDisplayDark] = useState(isDark);

  useEffect(() => {
    setDisplayDark(isDark);
  }, [isDark]);

  const handleClick = () => {
    setDisplayDark((prev) => !prev);
    toggleTheme();
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="bg-card/60 border-border/50 hover:bg-card group relative flex h-10 w-10
          shrink-0 items-center justify-center gap-0 overflow-hidden rounded-2xl border
          backdrop-blur transition-all duration-300 hover:scale-105 [&_svg]:!size-5"
        aria-label="Toggle theme"
      >
        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <Sun
            className={`theme-toggle-icon theme-toggle-sun text-foreground absolute
              inset-0 !h-5 !w-5 ${
                displayDark ? "theme-toggle-hidden" : "theme-toggle-visible"
              }`}
          />
          <Moon
            className={`theme-toggle-icon theme-toggle-moon text-foreground absolute
              inset-0 !h-5 !w-5 ${
                displayDark ? "theme-toggle-visible" : "theme-toggle-hidden"
              }`}
          />
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
