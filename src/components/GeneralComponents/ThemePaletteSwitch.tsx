"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemePaletteSwitch() {
  const { palette, setPalette, theme } = useTheme();
  const isDark = theme === "dark";

  const togglePalette = () => {
    setPalette(palette === "default" ? "warm" : "default");
  };

  const isWarm = palette === "warm";

  // Color classes based on light/dark theme
  const colorfulColor = isDark
    ? "text-gray-900 theme-warm:text-white"
    : "text-gray-800 theme-warm:text-second-900";
  const grayscaleColor = isDark
    ? "text-gray-400 theme-warm:text-gray-600 theme-warm:dark:text-white"
    : "text-second-600 theme-warm:text-second-900";

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "border-border h-8 w-8 shrink-0 overflow-hidden rounded-full",
        isDark
          ? `bg-coral hover:bg-coral-dark theme-warm:bg-muted
            dark:theme-warm:bg-muted-dark`
          : `hover:bg-muted from-primary-50 to-second-50 theme-warm:bg-muted
            theme-warm:hover:bg-muted-dark`
      )}
      aria-label="Toggle color palette"
      onClick={togglePalette}
    >
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        {/* Colorful Palette Icon - for default/normal theme */}
        <Palette
          className={cn(
            "palette-toggle-icon palette-toggle-colorful absolute inset-0 h-4 w-4",
            colorfulColor,
            isWarm ? "palette-toggle-hidden" : "palette-toggle-visible"
          )}
        />
        {/* Grayscale/B&W Palette Icon - for warm theme */}
        <Palette
          className={cn(
            "palette-toggle-icon palette-toggle-bw absolute inset-0 h-4 w-4",
            grayscaleColor,
            isWarm ? "palette-toggle-visible" : "palette-toggle-hidden"
          )}
        />
      </div>
    </Button>
  );
}
