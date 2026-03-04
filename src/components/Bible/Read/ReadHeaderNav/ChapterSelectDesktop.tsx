"use client";

import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

export function ChapterSelectDesktop() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const { leftBook, leftChapter, handleLeftChapterChange } = useRead();

  if (!leftBook) return null;

  return (
    <div className="relative">
      <Select
        value={String(leftChapter)}
        onValueChange={(v) => handleLeftChapterChange(Number(v))}
      >
        <SelectTrigger
          className="border-primary bg-primary/5 hover:bg-primary/10 dark:border-primary
            dark:bg-primary/5 h-10 w-auto min-w-20 shrink-0 gap-1.5 rounded-lg"
        >
          <SelectValue placeholder={t("readChapterN", { n: 1 })}>
            {t("readChapterN", { n: leftChapter })}
          </SelectValue>
          <ChevronDown className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="max-h-80 w-auto rounded-lg
            [&_[data-state]>span:first-child]:invisible"
        >
          <div className="grid grid-cols-5 gap-1 p-2">
            {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map((ch) => (
              <SelectItem
                key={ch}
                value={String(ch)}
                className="data-[highlighted]:bg-accent flex min-h-9 min-w-9 items-center
                  justify-center rounded-md px-2 py-0"
              >
                {ch}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
