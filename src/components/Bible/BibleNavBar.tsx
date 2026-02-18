"use client";

import Link from "next/link";
import { Moon, Sun, Shuffle, ArrowUpDown, ArrowLeftRight, LayoutGrid } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useBibleApp } from "./BibleAppContext";
import { Container } from "../ui/container";
import { cn } from "@/lib/utils";

export function BibleNavBar() {
  const { theme, setTheme } = useTheme();
  const {
    globalLanguage,
    setGlobalLanguage,
    fontSize,
    setFontSize,
    layoutMode,
    setLayoutMode,
    triggerShuffle,
  } = useBibleApp();

  return (
    <nav className=" fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-sm">
      <Container className=" w-full h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-lg bg-coral text-white  dark:bg-primary-dark flex items-center justify-center shrink-0">
            <span className="text-4xl">✝</span>
          </div>
          <h1 className="text-lg font-semibold truncate">Scripture Memory</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Language: second (purple) */}
          <div className="flex items-center gap-0.5 rounded-lg border border-second/30 bg-second/10 p-0.5">
            <Button
              variant={globalLanguage === "EN" ? "secondaryLight" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("EN")}
              className="h-8 px-2.5 text-sm"
            >
              EN
            </Button>
            <Button
              variant={globalLanguage === "VI" ? "secondaryLight" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("VI")}
              className="h-8 px-2.5 text-sm"
            >
              VI
            </Button>
            <Button
              variant={globalLanguage === "ZH" ? "secondaryLight" : "ghost"}
              size="sm"
              onClick={() => setGlobalLanguage("ZH")}
              className="h-8 px-2.5 text-sm"
            >
              中
            </Button>
          </div>

          {/* View: coral */}
          <div className="flex items-center gap-0.5 rounded-lg border border-coral/30 bg-coral/10 p-0.5">
            <Button
              variant={layoutMode === "vertical" ? "coral" : "ghost"}
              size="icon"
              onClick={() => setLayoutMode("vertical")}
              className="h-8 w-8 hover:bg-coral/20"
              title="Vertical"
              aria-label="Vertical layout"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutMode === "horizontal" ? "coral" : "ghost"}
              size="icon"
              onClick={() => setLayoutMode("horizontal")}
              className="h-8 w-8 hover:bg-coral/20"
              title="Horizontal"
              aria-label="Horizontal layout"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutMode === "all" ? "coral" : "ghost"}
              size="icon"
              onClick={() => setLayoutMode("all")}
              className="h-8 w-8 hover:bg-coral/20"
              title="Show all"
              aria-label="Show all cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Font size: sky blue */}
          <div className="flex items-center gap-0.5 rounded-lg border border-sky-blue/30 bg-sky-blue/10 p-0.5">
            <Button
              variant={fontSize === "small" ? "skyBlue" : "ghost"}
              size="sm"
              onClick={() => setFontSize("small")}
              className="h-8 px-3 text-sm hover:bg-sky-blue/20"
              title="Smaller text"
              aria-label="Font size small"
            >
              A-
            </Button>
            <Button
              variant={fontSize === "medium" ? "skyBlue" : "ghost"}
              size="sm"
              onClick={() => setFontSize("medium")}
              className="h-8 px-3 text-sm hover:bg-sky-blue/20"
              title="Medium text"
              aria-label="Font size medium"
            >
              A
            </Button>
            <Button
              variant={fontSize === "large" ? "skyBlue" : "ghost"}
              size="sm"
              onClick={() => setFontSize("large")}
              className="h-8 px-3 text-sm hover:bg-sky-blue/20"
              title="Larger text"
              aria-label="Font size large"
            >
              A+
            </Button>
          </div>

          {/* <Button
            variant="ghost"
            size="icon"
            onClick={triggerShuffle}
            className="h-8 w-8"
            title="Shuffle"
          >
            <Shuffle className="h-4 w-4" />
          </Button> */}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "h-8 w-8 bg-amber-50 border-amber-300 rounded-full",
              theme === "light" ? "bg-amber-50" : "border-blue-600/60 bg-transparent"
            )}
          >
            {theme === "light" ? (
              <Sun className="h-4 w-4 text-amber-700" />
            ) : (
              <Moon className="h-4 w-4 text-blue-400" />
            )}
          </Button>

          <Link
            href="/bible/admin"
            className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm font-medium hover:bg-primary/10 h-8 flex items-center"
          >
            Admin
          </Link>
        </div>
      </Container>
    </nav>
  );
}
