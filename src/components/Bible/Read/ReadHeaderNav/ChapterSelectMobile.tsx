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
        className="border-primary bg-primary/5 text-foreground hover:bg-primary/10
          dark:border-primary dark:bg-primary/5 h-9 gap-1.5 rounded-md border"
        aria-label={t("readChapterN", { n: leftChapter })}
      >
        {leftChapter}
        <ChevronDown className="h-4 w-4" />
      </Button>
      {subNavChapterOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setSubNavChapterOpen(false)}
            aria-hidden
          />
          <div
            className="bg-card border-border absolute top-full right-0 z-20 mt-1 max-h-80
              w-40 max-w-[min(14rem,calc(100vw-2rem))] min-w-0 overflow-y-auto rounded-md
              border p-2 shadow-lg"
          >
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map(
                (ch) => (
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
                      "hover:bg-accent min-h-9 min-w-9 rounded-md text-sm transition-all",
                      ch === leftChapter
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground"
                    )}
                  >
                    {ch}
                  </Button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
