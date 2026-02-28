"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export function ThemePaletteSwitch() {
  const { palette, setPalette } = useTheme();

  const togglePalette = () => {
    setPalette(palette === "default" ? "warm" : "default");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-full shrink-0 border-border bg-background hover:bg-muted"
      aria-label="Toggle color palette"
      onClick={togglePalette}
    >
      <Palette className={`h-4 w-4 ${palette === "default" ? "text-zinc-600" : "text-zinc-700"}`} />
    </Button>
  );
}
