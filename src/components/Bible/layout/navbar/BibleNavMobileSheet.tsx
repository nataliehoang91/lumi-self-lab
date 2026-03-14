"use client";

import Link from "next/link";
import { SquareMenu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { BibleLogo } from "@/components/Bible/BibleLogo";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { ThemeToggleButtonBibleApp } from "@/components/Bible/theme-toggle-in-bible-app";
import { cn } from "@/lib/utils";
import { useBibleNavData } from "./useBibleNavData";

interface BibleNavMobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BibleNavMobileSheet({ open, onOpenChange }: BibleNavMobileSheetProps) {
  const { learnLinks, bibleLinks, glossaryLinks, learnLang, intl } = useBibleNavData();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-primary-dark bg-primary-dark text-primary-foreground hover:bg-primary-dark focus-visible:ring-ring h-8 w-8 rounded-lg shadow-sm hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Open menu"
        >
          <SquareMenu className="h-4 w-4 shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full max-w-[min(20rem,85vw)] flex-col border-l p-0 sm:max-w-sm"
      >
        <SheetHeader className="flex flex-row items-center gap-3 border-b px-4 py-3 pr-12">
          <BibleLogo />
          <SheetTitle className="truncate text-left text-lg font-semibold">
            {intl.t("navAppName")}
          </SheetTitle>
          <div className="ml-auto flex items-center gap-1">
            <ThemePaletteSwitch />
            <ThemeToggleButtonBibleApp variant="desktop" />
          </div>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-6">
            <section>
              <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {intl.t("langPageNavLearn")}
              </h2>
              <ul className="space-y-0.5">
                {learnLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "hover:bg-muted block rounded-lg px-3 py-2.5 text-sm transition-colors",
                        link.isActive && "bg-primary-light/20 text-foreground font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {intl.t("navBible")}
              </h2>
              <ul className="space-y-0.5">
                {bibleLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                        link.isActive && "bg-primary-light/20 text-foreground font-medium"
                      )}
                    >
                      <span>{link.label}</span>
                      {link.comingSoon && (
                        <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
                          {intl.t("navSoon")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {intl.t("langPageNavGlossary")}
              </h2>
              <ul className="space-y-0.5">
                {glossaryLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                        link.isActive && "bg-primary-light/20 text-foreground font-medium"
                      )}
                    >
                      <span>{link.label}</span>
                      {link.comingSoon && (
                        <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
                          {intl.t("navSoon")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </nav>
        <SheetFooter className="border-t py-3">
          <Button
            asChild
            className="bg-primary-dark text-primary-foreground hover:bg-primary-dark w-full hover:opacity-90"
            onClick={() => onOpenChange(false)}
          >
            <Link href={`/bible/${learnLang}/read`}>Open Bible</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
