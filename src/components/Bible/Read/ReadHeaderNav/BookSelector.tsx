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
          "rounded-lg border border-sage bg-sage/10 text-foreground hover:bg-sage/20 gap-1.5",
          !isDesktop && "rounded-md h-9"
        )}
      >
        {getBookLabelForSelection(leftBook, leftVersion, rightVersion)}
        <ChevronDown className="w-4 h-4" />
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
              "absolute top-full mt-1 left-0 bg-card border border-border shadow-lg z-20 max-h-80 overflow-y-auto min-w-[260px]",
              isDesktop ? "rounded-lg" : "rounded-md"
            )}
          >
            <div className="sticky top-0 bg-muted/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                      ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                      : "text-foreground"
                  )}
                  onClick={() => {
                    handleLeftBookChange(b);
                    setSubNavBookOpen(false);
                  }}
                >
                  <span className="tabular-nums text-muted-foreground shrink-0 w-6 text-right">
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
