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
      <Select value={String(leftChapter)} onValueChange={(v) => handleLeftChapterChange(Number(v))}>
        <SelectTrigger className="w-auto min-w-20 rounded-lg border-primary bg-primary/5 h-10 shrink-0 hover:bg-primary/10 dark:border-primary dark:bg-primary/5 gap-1.5">
          <SelectValue placeholder={t("readChapterN", { n: 1 })}>
            {t("readChapterN", { n: leftChapter })}
          </SelectValue>
          <ChevronDown className="w-4 h-4" />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="rounded-lg max-h-80 w-auto [&_[data-state]>span:first-child]:invisible"
        >
          <div className="grid grid-cols-5 gap-1 p-2">
            {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map((ch) => (
              <SelectItem
                key={ch}
                value={String(ch)}
                className="min-w-9 min-h-9 flex items-center justify-center rounded-md py-0 px-2 data-[highlighted]:bg-accent"
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
