"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { getBookLabelForSelection } from "../utils";
import { cn } from "@/lib/utils";
import type { BibleBook } from "../types";

type Variant = "desktop" | "mobile";

export function SelectPassage({ variant = "desktop" }: { variant?: Variant }) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftBook,
    leftChapter,
    leftVersion,
    rightVersion,
    testamentFilter,
    setTestamentFilterAndAdjustBook,
    otBooks,
    ntBooks,
    handleLeftBookChange,
    handleLeftChapterChange,
  } = useRead();

  const [open, setOpen] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState<string>("");
  const useFullLabel = globalLanguage === "VI" && variant === "desktop";

  if (!leftBook) return null;

  const filteredBooks = testamentFilter === "ot" ? otBooks : ntBooks;

  // Keep accordion in sync with current book; when popover opens, expand current book
  useEffect(() => {
    if (open && leftBook) setOpenAccordionId(leftBook.id);
  }, [open, leftBook?.id]);
  // When testament tab changes, expand first book of that testament if current book not in list
  const firstFilteredBookId = filteredBooks[0]?.id;
  const currentBookInList = filteredBooks.some((b) => b.id === leftBook?.id);
  useEffect(() => {
    if (open && !currentBookInList && firstFilteredBookId)
      setOpenAccordionId(firstFilteredBookId);
  }, [open, testamentFilter, currentBookInList, firstFilteredBookId]);

  function onSelectChapter(book: BibleBook, chapter: number) {
    if (book.id !== leftBook?.id) handleLeftBookChange(book);
    handleLeftChapterChange(chapter);
    setOpen(false);
  }

  const bookName = getBookLabelForSelection(leftBook, leftVersion, rightVersion);
  const labelShort = leftBook && `${bookName} Ch. ${leftChapter}`;
  const labelFull = leftBook && `${bookName} ${t("readChapterN", { n: leftChapter })}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            `hover:bg-muted/50 h-9 shrink-0 gap-1.5 rounded-lg border-0 bg-transparent
            shadow-none`,
            variant === "mobile" && "rounded-md"
          )}
          aria-label={t("readSelectPassage")}
        >
          <span className="max-w-[140px] truncate sm:max-w-[200px] lg:max-w-none">
            <span className="lg:hidden">{labelShort}</span>
            <span className="hidden lg:inline">{labelFull}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className={cn(
          `flex max-h-[85vh] min-h-[420px] min-w-[340px] flex-col overflow-hidden
          rounded-lg p-0 shadow-lg`,
          variant === "mobile" && "rounded-md"
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header: title + close */}
        <div
          className="border-border bg-background flex shrink-0 items-center
            justify-between border-b px-4 py-3"
        >
          <h2 className="text-foreground text-sm font-semibold">
            {t("readSelectPassage")}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-muted h-8 w-8 shrink-0 rounded-md"
            onClick={() => setOpen(false)}
            aria-label={t("readInsightsClose")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs: Old / New Testament */}
        <Tabs
          value={testamentFilter}
          onValueChange={(v) => v && setTestamentFilterAndAdjustBook(v as "ot" | "nt")}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList
            className={cn(
              `bg-muted/80 text-muted-foreground mx-4 mt-3 mb-2 h-9 w-auto shrink-0
              rounded-lg p-[3px]`
            )}
          >
            <TabsTrigger
              value="ot"
              className={cn(
                "rounded-md px-3 text-sm font-medium transition-colors",
                `data-[state=active]:bg-second data-[state=active]:text-second-foreground
                data-[state=active]:shadow-sm`
              )}
            >
              {useFullLabel ? t("readOldTestament") : t("readOldShort")}
            </TabsTrigger>
            <TabsTrigger
              value="nt"
              className={cn(
                "rounded-md px-3 text-sm font-medium transition-colors",
                `data-[state=active]:bg-second data-[state=active]:text-second-foreground
                data-[state=active]:shadow-sm`
              )}
            >
              {useFullLabel ? t("readNewTestament") : t("readNewShort")}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={testamentFilter}
            className="min-h-0 flex-1 overflow-y-auto px-4 pt-0 pb-3
              data-[state=inactive]:hidden"
          >
            <Accordion
              type="single"
              collapsible
              value={openAccordionId}
              onValueChange={(value) => setOpenAccordionId(value ?? "")}
              className="w-full"
            >
              {filteredBooks.map((book) => (
                <AccordionItem
                  key={book.id}
                  value={book.id}
                  className="border-border border-b last:border-b-0"
                >
                  <AccordionTrigger
                    className={cn(
                      "text-foreground py-3 pr-1 pl-0 text-left hover:no-underline",
                      "hover:bg-sage/10 dark:hover:bg-sage/20"
                    )}
                  >
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="font-medium">
                        {getBookLabelForSelection(book, leftVersion, rightVersion)}
                      </span>
                      <span className="text-muted-foreground text-sm font-normal">
                        {book.chapterCount} ch.
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pr-1 pb-3 pl-0">
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map(
                        (ch) => {
                          const isSelected =
                            leftBook?.id === book.id && leftChapter === ch;
                          return (
                            <Button
                              key={ch}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "min-h-9 min-w-9 rounded-md text-sm transition-colors",
                                isSelected
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : `bg-background text-foreground hover:bg-sage/15
                                    hover:text-sage-dark dark:hover:bg-sage/20
                                    dark:hover:text-sage border-border border`
                              )}
                              onClick={() => onSelectChapter(book, ch)}
                            >
                              {ch}
                            </Button>
                          );
                        }
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
