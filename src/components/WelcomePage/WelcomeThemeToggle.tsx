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
        className="relative flex w-10 h-10 shrink-0 items-center justify-center gap-0 rounded-2xl bg-card/60 backdrop-blur border border-border/50 hover:bg-card hover:scale-105 transition-all duration-300 group overflow-hidden [&_svg]:!size-5"
        aria-label="Toggle theme"
      >
        <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
          <Sun
            className={`theme-toggle-icon theme-toggle-sun absolute inset-0 !h-5 !w-5 text-tertiary ${
              displayDark ? "theme-toggle-hidden" : "theme-toggle-visible"
            }`}
          />
          <Moon
            className={`theme-toggle-icon theme-toggle-moon absolute inset-0 !h-5 !w-5 text-sky-blue ${
              displayDark ? "theme-toggle-visible" : "theme-toggle-hidden"
            }`}
          />
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
