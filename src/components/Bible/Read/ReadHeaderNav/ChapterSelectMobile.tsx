"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

export function ChapterSelectMobile() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftBook,
    leftChapter,
    subNavChapterOpen,
    setSubNavChapterOpen,
    setSubNavBookOpen,
    handleLeftChapterChange,
  } = useRead();

  if (!leftBook) return null;

  return (
    <div className="relative flex justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setSubNavBookOpen(false);
          setSubNavChapterOpen(!subNavChapterOpen);
        }}
        className="rounded-md h-9 border border-primary bg-primary/5 text-foreground hover:bg-primary/10 gap-1.5 dark:border-primary dark:bg-primary/5"
        aria-label={t("readChapterN", { n: leftChapter })}
      >
        {leftChapter}
        <ChevronDown className="w-4 h-4" />
      </Button>
      {subNavChapterOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setSubNavChapterOpen(false)}
            aria-hidden
          />
          <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-md shadow-lg z-20 max-h-80 overflow-y-auto w-40 min-w-0 max-w-[min(14rem,calc(100vw-2rem))] p-2">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map((ch) => (
                <Button
                  key={ch}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLeftChapterChange(ch);
                    setSubNavChapterOpen(false);
                  }}
                  className={cn(
                    "min-w-9 min-h-9 rounded-md text-sm hover:bg-accent transition-all",
                    ch === leftChapter
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground"
                  )}
                >
                  {ch}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
