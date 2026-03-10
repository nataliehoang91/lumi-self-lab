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
import { OT_SECTIONS, NT_SECTIONS } from "./bookOverviewSections";

type BookWithSlug = BookForToc & { slugEn: string };

/** Split books into chunks by section book counts (e.g. [5, 12, 5, 17] for OT). */
function chunkBooksBySections(books: BookWithSlug[], counts: number[]): BookWithSlug[][] {
  const result: BookWithSlug[][] = [];
  let offset = 0;
  for (const count of counts) {
    result.push(books.slice(offset, offset + count));
    offset += count;
  }
  return result;
}

/** Arrange books into visual rows so that numbers run 1,2,3… down the first column, then continue in the second. */
function toTwoColumnRows(items: BookWithSlug[]): [BookWithSlug, BookWithSlug | null][] {
  const midpoint = Math.ceil(items.length / 2);
  const left = items.slice(0, midpoint);
  const right = items.slice(midpoint);

  return left.map((item, index) => [item, right[index] ?? null]);
}

function slugifySection(prefix: "ot" | "nt", title: string): string {
  return `${prefix}-${title.toLowerCase().replace(/\s+/g, "-")}`;
}

interface BookCardProps {
  book: BookWithSlug;
  segment: string;
  subBodyClassUp: string;
  hoverBorderClass?: string;
}

function BookCard({ book, segment, subBodyClassUp, hoverBorderClass }: BookCardProps) {
  const name = segment === "vi" ? book.nameVi : book.nameEn;
  const chapterLabel =
    segment === "vi"
      ? "chương"
      : book.chapterCount === 1
        ? "chapter"
        : "chapters";

  return (
    <Link
      key={book.slugEn}
      href={`/bible/${segment}/book-overviews/${book.slugEn}`}
      className={cn(
        `group border-border/50 bg-card hover:bg-card/80 rounded-lg border p-4
        transition-all`,
        hoverBorderClass ?? "hover:border-second-700/50"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-normal">{book.order}.</span>
          <div className="flex flex-col gap-1">
            <span className={cn("text-foreground font-bold", subBodyClassUp)}>
              {name}
            </span>
            <p className={cn("", subBodyClassUp)}>
              {book.chapterCount} {chapterLabel}
            </p>
          </div>
        </div>
        <ChevronRight
          className="group-hover:text-second-700 size-5 shrink-0 opacity-50 transition-all
            group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>
    </Link>
  );
}

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
  const isVi = segment === "vi";

  const otSectionGroups = chunkBooksBySections(
    otBooks,
    OT_SECTIONS.map((s) => s.bookCount)
  );
  const ntSectionGroups = chunkBooksBySections(
    ntBooks,
    NT_SECTIONS.map((s) => s.bookCount)
  );

  return (
    <>
      {/* Header */}
      <div className="mb-12 space-y-5">
        <p
          className={cn(
            "text-muted-foreground font-semibold tracking-[0.2em] uppercase",
            subBodyClassUp
          )}
        >
          {isVi ? "Mục lục" : "Table of Contents"}
        </p>
        <h1
          className={cn(
            "text-foreground font-serif leading-tight font-semibold",
            h1Class
          )}
        >
          {isVi ? "66 Sách trong Kinh Thánh" : "The 66 Books of the Bible"}
        </h1>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
          {isVi
            ? "Khám phá từng sách với phần giới thiệu, chủ đề chính, câu gốc và cách mỗi sách trỏ về Đấng Christ."
            : "Explore each book with detailed overviews, themes, key verses, and connections to Christ."}
        </p>
      </div>

      {/* Stats */}
      <div
        className="border-border/50 bg-card grid grid-cols-3 gap-4 rounded-xl border p-6"
      >
        <div className="text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>66</p>
          <p className={cn("text-muted-foreground mt-1", subBodyClassUp)}>
            {isVi ? "Tổng số sách" : "Total Books"}
          </p>
        </div>
        <div className="border-border/30 border-r border-l text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>
            {otBooks.length + ntBooks.length}
          </p>
          <p className={cn("text-muted-foreground mt-1", subBodyClassUp)}>
            {isVi ? "Sách đang hiển thị" : "Books Listed"}
          </p>
        </div>
        <div className="text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>
            {totalChapters.toLocaleString()}
          </p>
          <p className={cn("text-muted-foreground mt-1", subBodyClassUp)}>
            {isVi ? "Tổng số chương" : "Total Chapters"}
          </p>
        </div>
      </div>

      {/* Collapsible: Old Testament & New Testament */}
      <Accordion type="multiple" defaultValue={["ot", "nt"]} className="my-6 space-y-8">
        <AccordionItem value="ot" className="rounded-lg border-0 bg-transparent px-0">
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
              <span className="block">{isVi ? "Cựu Ước" : "Old Testament"}</span>
              <span className={cn("font-normal", subBodyClassUp)}>
                ({otBooks.length} books)
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-transparent px-0 py-0">
            <p
              className={cn("text-muted-foreground mb-4 leading-relaxed", subBodyClassUp)}
            >
              {isVi
                ? "Được viết chủ yếu bằng tiếng Hê-bơ-rơ (và một phần A-ram), Cựu Ước kể lại lịch sử, luật pháp, thi ca và các lời tiên tri dành cho dân Ít-ra-ên, từ sự sáng tạo cho đến trước khi Chúa Jêsus giáng sinh."
                : "Written primarily in Hebrew (with portions in Aramaic), the Old Testament records Israel's history, law, poetry, and prophetic writings. It begins with creation and traces the unfolding relationship between God and His people, including the long-standing promise of a coming Messiah."}
            </p>
            <Accordion
              type="multiple"
              className="py-0"
              defaultValue={OT_SECTIONS.map((s) => slugifySection("ot", s.title))}
            >
              {otSectionGroups.map((sectionBooks, idx) => {
                const section = OT_SECTIONS[idx];
                if (!section || sectionBooks.length === 0) return null;
                const value = slugifySection("ot", section.title);
                return (
                  <AccordionItem
                    key={section.title}
                    value={value}
                    className="border-0 bg-transparent px-0 py-0"
                  >
                    <AccordionTrigger
                      className={cn(
                        "group px-0 hover:no-underline [&>svg]:hidden",
                        "[&[data-state=open]>div]:bg-second-50/50 py-2",
                        bodyClass
                      )}
                    >
                      <div
                        className="border-border/50 bg-card flex w-full items-center
                          justify-between gap-4 rounded-xl border p-4 text-left
                          transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="bg-second/30 flex h-14 w-14 shrink-0 flex-col
                              items-center justify-center rounded-full font-mono text-xs
                              leading-tight font-semibold"
                          >
                            <span className="font-mono">{section.bookCount}</span>
                            <span className="">
                              {section.bookCount === 1 ? "book" : "books"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className={cn("font-semibold", subBodyClassUp)}>
                              {isVi && section.titleVi ? section.titleVi : section.title}
                            </p>
                            <p className={cn("mt-0.5 leading-relaxed", subBodyClassUp)}>
                              {isVi && section.descriptionVi
                                ? section.descriptionVi
                                : section.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className="text-muted-foreground/80 font-mono text-xl
                            leading-none group-data-[state=open]:hidden"
                          aria-hidden="true"
                        >
                          +
                        </span>
                        <span
                          className="text-muted-foreground/80 hidden font-mono text-xl
                            leading-none group-data-[state=open]:inline"
                          aria-hidden="true"
                        >
                          -
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent px-0 pt-1.5 pb-1">
                      <div className="space-y-1">
                        {toTwoColumnRows(sectionBooks).map(([left, right], rowIndex) => (
                          <div
                            key={`${section.title}-row-${rowIndex}`}
                            className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2"
                          >
                            <BookCard
                              book={left}
                              segment={segment}
                              subBodyClassUp={subBodyClassUp}
                              hoverBorderClass="hover:border-second"
                            />
                            {right && (
                              <BookCard
                                book={right}
                                segment={segment}
                                subBodyClassUp={subBodyClassUp}
                                hoverBorderClass="hover:border-second"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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
              <span className="block">{isVi ? "Tân Ước" : "New Testament"}</span>
              <span className={cn("font-normal", subBodyClassUp)}>
                ({ntBooks.length} books)
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="bg-transparent px-0 pt-4 pb-4">
            <p
              className={cn("text-muted-foreground mb-6 leading-relaxed", subBodyClassUp)}
            >
              {isVi
                ? "Được viết bằng tiếng Hy Lạp (Koine), Tân Ước mở đầu bằng bốn sách Phúc Âm kể về cuộc đời, chức vụ, sự chết và sự sống lại của Chúa Jêsus; tiếp theo là câu chuyện Hội Thánh đầu tiên lan rộng và kết thúc bằng khải tượng về sự hoàn tất của lịch sử trong Đấng Christ."
                : "Written in Koine Greek, the New Testament begins with four Gospel accounts of Jesus' life, ministry, death, and resurrection. It continues with the growth of the early church and concludes with a vision of history's ultimate restoration in Christ."}
            </p>
            <Accordion
              type="multiple"
              defaultValue={NT_SECTIONS.map((s) => slugifySection("nt", s.title))}
              className="space-y-1"
            >
              {ntSectionGroups.map((sectionBooks, idx) => {
                const section = NT_SECTIONS[idx];
                if (!section || sectionBooks.length === 0) return null;
                const value = slugifySection("nt", section.title);
                return (
                  <AccordionItem
                    key={section.title}
                    value={value}
                    className="border-0 bg-transparent px-0 py-0"
                  >
                    <AccordionTrigger
                      className={cn(
                        "group px-0 hover:no-underline [&>svg]:hidden",
                        "[&[data-state=open]>div]:bg-second-50/50 py-2",
                        bodyClass
                      )}
                    >
                      <div
                        className="border-border/50 bg-card flex w-full items-center
                          justify-between gap-4 rounded-xl border p-4 text-left
                          transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="bg-second/30 flex h-14 w-14 shrink-0 flex-col
                              items-center justify-center rounded-full font-mono text-xs
                              leading-tight font-semibold"
                          >
                            <span className="font-mono">{section.bookCount}</span>
                            <span className="">
                              {section.bookCount === 1 ? "book" : "books"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className={cn("font-semibold", subBodyClassUp)}>
                              {isVi && section.titleVi ? section.titleVi : section.title}
                            </p>
                            <p className={cn("mt-0.5 leading-relaxed", subBodyClassUp)}>
                              {isVi && section.descriptionVi
                                ? section.descriptionVi
                                : section.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className="text-muted-foreground/80 font-mono text-xl
                            leading-none group-data-[state=open]:hidden"
                          aria-hidden="true"
                        >
                          +
                        </span>
                        <span
                          className="text-muted-foreground/80 hidden font-mono text-xl
                            leading-none group-data-[state=open]:inline"
                          aria-hidden="true"
                        >
                          -
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent px-0 pt-1.5 pb-1">
                      <div className="space-y-6">
                        {toTwoColumnRows(sectionBooks).map(([left, right], rowIndex) => (
                          <div
                            key={`${section.title}-row-${rowIndex}`}
                            className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2"
                          >
                            <BookCard
                              book={left}
                              segment={segment}
                              subBodyClassUp={subBodyClassUp}
                            />
                            {right && (
                              <BookCard
                                book={right}
                                segment={segment}
                                subBodyClassUp={subBodyClassUp}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
