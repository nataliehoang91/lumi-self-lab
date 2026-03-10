"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BookForToc } from "@/app/actions/bible/book-overview";

interface BookOverviewsPageContentProps {
  segment: string;
  otBooks: (BookForToc & { slugEn: string })[];
  ntBooks: (BookForToc & { slugEn: string })[];
  totalChapters: number;
}

export function BookOverviewsPageContent({
  segment,
  otBooks,
  ntBooks,
  totalChapters,
}: BookOverviewsPageContentProps) {
  const { bodyClass, h1Class, subBodyClassUp, statValueClassDown } =
    useBibleFontClasses();

  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <p
          className={cn(
            "text-muted-foreground mb-3 font-semibold tracking-[0.2em] uppercase",
            subBodyClassUp
          )}
        >
          Table of Contents
        </p>
        <h1
          className={cn(
            "text-foreground font-serif leading-tight font-semibold",
            h1Class
          )}
        >
          The 66 Books of the Bible
        </h1>
        <p className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClass)}>
          Explore each book with detailed overviews, themes, key verses, and connections
          to Christ.
        </p>
      </div>

      {/* Stats */}
      <div
        className="border-border/50 bg-card grid grid-cols-3 gap-4 rounded-xl border p-6"
      >
        <div className="text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>66</p>
          <p className={cn("text-muted-foreground mt-1", subBodyClassUp)}>Total Books</p>
        </div>
        <div className="border-border/30 border-r border-l text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>
            {otBooks.length + ntBooks.length}
          </p>
          <p className={cn("text-muted-foreground mt-1", subBodyClassUp)}>Books Listed</p>
        </div>
        <div className="text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>
            {totalChapters.toLocaleString()}
          </p>
          <p className={cn("text-muted-foreground mt-1", subBodyClassUp)}>
            Total Chapters
          </p>
        </div>
      </div>

      {/* Collapsible: Old Testament & New Testament */}
      <Accordion type="multiple" defaultValue={["ot", "nt"]} className="mb-16 space-y-6">
        <AccordionItem value="ot" className="rounded-lg border-0 bg-transparent px-0">
          <AccordionTrigger
            className={cn(
              `border-primary bg-card data-[state=open]:text-primary-600 rounded-lg
              border-l-4 px-4 font-serif font-semibold hover:no-underline
              data-[state=open]:border-l-0 data-[state=open]:bg-transparent
              data-[state=open]:font-extrabold [&[data-state=open]>svg]:rotate-180`,
              bodyClass
            )}
          >
            <span className="text-left">
              <span className="block">Old Testament</span>
              <span className={cn("font-normal opacity-70", subBodyClassUp)}>
                ({otBooks.length} books)
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-transparent px-0 pt-4 pb-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {otBooks.map((book) => {
                const name = segment === "vi" ? book.nameVi : book.nameEn;
                return (
                  <Link
                    key={book.slugEn}
                    href={`/bible/${segment}/book-overviews/${book.slugEn}`}
                    className="group border-border/50 bg-card hover:border-second
                      hover:bg-card/80 rounded-lg border p-4 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-2">
                        <p
                          className={cn(
                            "font-medium transition-colors group-hover:font-bold",
                            bodyClass
                          )}
                        >
                          <span className="text-second-600 font-mono">
                            {book.order}.
                          </span>{" "}
                        </p>
                        <div className="flex flex-col justify-start gap-1">
                          <p
                            className={cn(
                              "font-medium transition-colors group-hover:font-bold",
                              bodyClass
                            )}
                          >
                            <span className="text-foreground font-semibold">{name}</span>
                          </p>
                          <p className={cn("", subBodyClassUp)}>
                            {book.chapterCount} chapters
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="group-hover:text-second-700 size-5 shrink-0 opacity-50
                          transition-all group-hover:translate-x-0.5
                          group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nt" className="rounded-lg border-0 bg-transparent px-0">
          <AccordionTrigger
            className={cn(
              `border-primary bg-card rounded-lg border-l-4 px-4 font-serif font-semibold
              hover:no-underline data-[state=open]:border-l-0
              data-[state=open]:bg-transparent data-[state=open]:font-extrabold
              [&[data-state=open]>svg]:rotate-180`,
              bodyClass
            )}
          >
            <span className="text-left">
              <span className="block">New Testament</span>
              <span className={cn("font-normal opacity-70", subBodyClassUp)}>
                ({ntBooks.length} books)
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-transparent px-0 pt-4 pb-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {ntBooks.map((book) => {
                const name = segment === "vi" ? book.nameVi : book.nameEn;
                return (
                  <Link
                    key={book.slugEn}
                    href={`/bible/${segment}/book-overviews/${book.slugEn}`}
                    className="group border-border/50 bg-card hover:border-second-700/50
                      hover:bg-card/80 rounded-lg border p-4 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-2">
                        <p
                          className={cn(
                            "font-medium transition-colors group-hover:font-bold",
                            bodyClass
                          )}
                        >
                          <span className="text-second-600 font-mono">
                            {book.order}.
                          </span>{" "}
                        </p>
                        <div className="flex flex-col justify-start gap-1">
                          <p
                            className={cn(
                              "font-medium transition-colors group-hover:font-bold",
                              bodyClass
                            )}
                          >
                            <span className="text-foreground font-semibold">{name}</span>
                          </p>
                          <p className={cn("", subBodyClassUp)}>
                            {book.chapterCount} chapters
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="group-hover:text-second-700 size-5 shrink-0 opacity-50
                          transition-all group-hover:translate-x-0.5
                          group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
