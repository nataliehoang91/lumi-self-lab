"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Palette } from "lucide-react";

export function ThemePaletteSwitch() {
  const { palette, setPalette } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full shrink-0 border-border bg-background hover:bg-muted"
          aria-label="Choose color palette"
        >
          <Palette className="h-4 w-4 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem onClick={() => setPalette("default")} className="gap-2">
          {palette === "default" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPalette("warm")} className="gap-2">
          {palette === "warm" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
          Warm B&W
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
