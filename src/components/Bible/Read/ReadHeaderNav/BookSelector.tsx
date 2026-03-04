"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { getBookLabelForSelection } from "../utils";
import { cn } from "@/lib/utils";

type Variant = "desktop" | "mobile";

export function BookSelector({ variant = "desktop" }: { variant?: Variant }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftBook,
    leftVersion,
    rightVersion,
    testamentFilter,
    subNavBookOpen,
    setSubNavBookOpen,
    setSubNavChapterOpen,
    filteredBooks,
    handleLeftBookChange,
  } = useRead();

  const isDesktop = variant === "desktop";

  if (!leftBook) return null;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setSubNavChapterOpen(false);
          setSubNavBookOpen(!subNavBookOpen);
        }}
        className={cn(
          `border-sage bg-sage/10 text-foreground hover:bg-sage/20 gap-1.5 rounded-lg
          border`,
          !isDesktop && "h-9 rounded-md"
        )}
      >
        {getBookLabelForSelection(leftBook, leftVersion, rightVersion)}
        <ChevronDown className="h-4 w-4" />
      </Button>
      {subNavBookOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setSubNavBookOpen(false)}
            aria-hidden
          />
          <div
            className={cn(
              `bg-card border-border absolute top-full left-0 z-20 mt-1 max-h-80
              min-w-[260px] overflow-y-auto border shadow-lg`,
              isDesktop ? "rounded-lg" : "rounded-md"
            )}
          >
            <div
              className="bg-muted/80 text-muted-foreground sticky top-0 px-3 py-1.5
                text-xs font-semibold tracking-wide uppercase"
            >
              {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
            </div>
            <div className="px-1">
              {filteredBooks.map((b) => (
                <Button
                  key={b.id}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-3 py-2 text-sm transition-all",
                    "hover:bg-sage/15 hover:text-sage-dark dark:hover:text-sage",
                    b.id === leftBook.id
                      ? "bg-sage/20 text-sage-dark dark:text-sage font-medium"
                      : "text-foreground"
                  )}
                  onClick={() => {
                    handleLeftBookChange(b);
                    setSubNavBookOpen(false);
                  }}
                >
                  <span
                    className="text-muted-foreground w-6 shrink-0 text-right tabular-nums"
                  >
                    {b.chapterCount}
                  </span>
                  <span className="ml-2">
                    {getBookLabelForSelection(b, leftVersion, rightVersion)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
