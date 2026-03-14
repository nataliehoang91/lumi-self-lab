"use client";

import Link from "next/link";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BookForToc } from "@/app/actions/bible/book-overview";
import { getBibleIntl, type BibleIntl } from "@/lib/bible-intl";
import type { BookSectionConfig } from "./bookOverviewSections";
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
  isRead?: boolean;
  readLabel?: string;
}

function BookCard({ book, segment, hoverBorderClass, isRead, readLabel }: BookCardProps) {
  const { subBodyClassUp, bodyClass, bodyClassUp } = useBibleFontClasses();
  const name = segment === "vi" ? book.nameVi : book.nameEn;
  const chapterLabel =
    segment === "vi" ? "chương" : book.chapterCount === 1 ? "chapter" : "chapters";

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
            <span className={cn("text-foreground font-bold", bodyClassUp)}>{name}</span>
            <p className={cn("", bodyClass)}>
              {book.chapterCount} {chapterLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRead && (
            <span
              className={cn(
                `text-foreground bg-primary-100 dark:bg-primary-900/30
                dark:text-primary-300 inline-flex items-center gap-1 rounded-full px-2
                py-0.5 text-xs font-medium`,
                subBodyClassUp
              )}
            >
              <BadgeCheck className="h-3 w-3" />
              {readLabel}
            </span>
          )}
          <ChevronRight
            className="group-hover:text-second-700 size-5 shrink-0 opacity-50
              transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>
      </div>
    </Link>
  );
}

/** Props for one testament block (OT or NT). */
interface TestamentSectionProps {
  value: "ot" | "nt";
  titleEn: string;
  titleVi: string;
  introEn: string;
  introVi: string;
  sections: BookSectionConfig[];
  sectionGroups: BookWithSlug[][];
  segment: string;
  readMap: Record<string, boolean>;
  /** AccordionContent padding, e.g. "py-0" or "pt-4 pb-4" */
  contentClassName?: string;
  /** Inner Accordion className, e.g. "space-y-1" */
  innerAccordionClassName?: string;
  /** Wrapper of book cards, e.g. "space-y-1" or "space-y-6" */
  cardsWrapperClassName?: string;
  /** BookCard hover border, e.g. "hover:border-second" */
  hoverBorderClass?: string;
  intl: BibleIntl;
}

function TestamentSection({
  value,
  titleEn,
  titleVi,
  introEn,
  introVi,
  sections,
  sectionGroups,
  segment,
  readMap,
  intl,
  contentClassName = "px-0 py-0",
  innerAccordionClassName,
  cardsWrapperClassName = "space-y-1",
  hoverBorderClass,
}: TestamentSectionProps) {
  const isVi = segment === "vi";
  const { bodyClass, bodyClassUp, langBodyTitleClass } = useBibleFontClasses();

  const defaultValue = sections.map((s) => slugifySection(value, s.title));

  return (
    <AccordionItem value={value} className="rounded-lg border-0 bg-transparent px-0">
      <AccordionTrigger
        className={cn(
          `border-primary bg-card rounded-lg border-l-4 px-4 font-serif font-semibold
          hover:no-underline data-[state=open]:border-l-0 data-[state=open]:bg-transparent
          data-[state=open]:pl-0 data-[state=open]:font-extrabold
          [&[data-state=open]>svg]:rotate-180`,
          langBodyTitleClass
        )}
      >
        <span className="text-left">
          <span className="block">{isVi ? titleVi : titleEn}</span>
          <span className={cn("font-normal", bodyClass)}>
            ({sectionGroups.flat().length} {intl.t("tocBooks")})
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className={cn("bg-transparent px-0", contentClassName)}>
        <p className={cn("text-muted-foreground mb-4 leading-relaxed", bodyClassUp)}>
          {isVi ? introVi : introEn}
        </p>
        <Accordion
          type="multiple"
          defaultValue={defaultValue}
          className={innerAccordionClassName}
        >
          {sectionGroups.map((sectionBooks, idx) => {
            const section = sections[idx];
            if (!section || sectionBooks.length === 0) return null;
            const sectionValue = slugifySection(value, section.title);
            return (
              <AccordionItem
                key={section.title}
                value={sectionValue}
                className="border-0 bg-transparent px-0 py-0"
              >
                <AccordionTrigger
                  className={cn(
                    "group px-0 hover:no-underline [&>svg]:hidden",
                    `[&[data-state=open]>div]:bg-second-50/50
                    [&[data-state=open]>div]:dark:bg-second-900/30
                    [&[data-state=open]>div]:theme-warm:bg-second-800/80
                    [&[data-state=open]>div]:theme-warm:dark:bg-second/30
                    [&:not([data-state=open])>div]:theme-warm:text-gray-900
                    [&:not([data-state=open])>div_p]:theme-warm:text-gray-900! py-2`,
                    bodyClassUp
                  )}
                >
                  <div
                    className="border-border/50 bg-card theme-warm:bg-second-800/10 flex
                      w-full items-center justify-between gap-4 rounded-xl border px-4
                      pt-4 pb-3 text-left transition-colors hover:opacity-90"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="bg-second/30 theme-warm:bg-second-900
                          theme-warm:text-second-foreground theme-warm:dark:text-gray-900
                          flex h-14 w-14 shrink-0 flex-col items-center justify-center
                          rounded-full font-mono text-xs leading-tight font-semibold"
                      >
                        <span className="font-mono">{section.bookCount}</span>
                        <span className="">
                          {section.bookCount === 1
                            ? intl.t("tocBook")
                            : intl.t("tocBooks")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "theme-warm:text-second-foreground font-semibold",
                            bodyClassUp
                          )}
                        >
                          {isVi && section.titleVi ? section.titleVi : section.title}
                        </p>
                        <p
                          className={cn(
                            "theme-warm:text-second-foreground mt-0.5 leading-relaxed",
                            bodyClass
                          )}
                        >
                          {isVi && section.descriptionVi
                            ? section.descriptionVi
                            : section.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-muted-foreground/80 font-mono text-xl leading-none
                        group-data-[state=open]:hidden"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span
                      className="text-muted-foreground/80
                        theme-warm:text-second-foreground hidden font-mono text-xl
                        leading-none group-data-[state=open]:inline"
                      aria-hidden="true"
                    >
                      -
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-transparent px-0 pt-1.5 pb-1">
                  <div className={cn("mb-8", cardsWrapperClassName)}>
                    {toTwoColumnRows(sectionBooks).map(([left, right], rowIndex) => (
                      <div
                        key={`${section.title}-row-${rowIndex}`}
                        className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2"
                      >
                        <BookCard
                          book={left}
                          segment={segment}
                          subBodyClassUp={bodyClass}
                          hoverBorderClass={hoverBorderClass}
                          isRead={readMap[left.slugEn]}
                          readLabel={isVi ? "Đã đọc" : "Read"}
                        />
                        {right && (
                          <BookCard
                            book={right}
                            segment={segment}
                            subBodyClassUp={bodyClass}
                            hoverBorderClass={hoverBorderClass}
                            isRead={readMap[right.slugEn]}
                            readLabel={isVi ? "Đã đọc" : "Read"}
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
  const { bodyClass, h1Class, statValueClassDown, bodyClassUp } = useBibleFontClasses();
  const isVi = segment === "vi";
  const intl = getBibleIntl(segment === "vi" ? "VI" : "EN");
  const readMap = useMemo(() => {
    if (typeof window === "undefined") return {};
    const all = [...otBooks, ...ntBooks];
    const map: Record<string, boolean> = {};
    for (const b of all) {
      const key = `book-overview-read:${isVi ? "vi" : "en"}:${b.slugEn.toLowerCase()}`;
      if (window.localStorage.getItem(key) === "1") {
        map[b.slugEn] = true;
      }
    }
    return map;
  }, [isVi, otBooks, ntBooks]);

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
            bodyClass
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
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          {isVi
            ? "Khám phá từng sách với phần giới thiệu, chủ đề chính, câu gốc và nội dung chính."
            : "Explore each book with detailed overviews, themes, key verses, and main content."}
        </p>
      </div>

      {/* Stats */}
      <div
        className="border-border/50 bg-card grid grid-cols-3 gap-4 rounded-xl border p-6"
      >
        <div className="text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>66</p>
          <p className={cn("text-muted-foreground mt-1", bodyClass)}>
            {isVi ? "Tổng số sách" : "Total Books"}
          </p>
        </div>
        <div className="border-border/30 border-r border-l text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>
            {otBooks.length + ntBooks.length}
          </p>
          <p className={cn("text-muted-foreground mt-1", bodyClass)}>
            {isVi ? "Sách đang hiển thị" : "Books Listed"}
          </p>
        </div>
        <div className="text-center">
          <p className={cn("text-foreground font-semibold", statValueClassDown)}>
            {totalChapters.toLocaleString()}
          </p>
          <p className={cn("text-muted-foreground mt-1", bodyClass)}>
            {isVi ? "Tổng số chương" : "Total Chapters"}
          </p>
        </div>
      </div>

      {/* Collapsible: Old Testament & New Testament */}
      <Accordion type="multiple" defaultValue={["ot", "nt"]} className="my-6 space-y-8">
        <TestamentSection
          value="ot"
          titleEn="Old Testament"
          titleVi="Cựu Ước"
          introEn="Written primarily in Hebrew (with portions in Aramaic), the Old Testament records Israel's history, law, poetry, and prophetic writings. It begins with creation and traces the unfolding relationship between God and His people, including the long-standing promise of a coming Messiah."
          introVi="Được viết chủ yếu bằng tiếng Hê-bơ-rơ (và một phần A-ram), Cựu Ước kể lại lịch sử, luật pháp, thi ca và các lời tiên tri dành cho dân Ít-ra-ên, từ sự sáng tạo cho đến trước khi Chúa Jêsus giáng sinh."
          sections={OT_SECTIONS}
          sectionGroups={otSectionGroups}
          segment={segment}
          readMap={readMap}
          intl={intl}
          contentClassName="px-0 py-0"
          cardsWrapperClassName="space-y-1"
          hoverBorderClass="hover:border-second"
        />
        <TestamentSection
          value="nt"
          titleEn="New Testament"
          titleVi="Tân Ước"
          introEn="Written in Koine Greek, the New Testament begins with four Gospel accounts of Jesus' life, ministry, death, and resurrection. It continues with the growth of the early church and concludes with a vision of history's ultimate restoration in Christ."
          introVi="Được viết bằng tiếng Hy Lạp (Koine), Tân Ước mở đầu bằng bốn sách Phúc Âm kể về cuộc đời, chức vụ, sự chết và sự sống lại của Chúa Jêsus; tiếp theo là câu chuyện Hội Thánh đầu tiên lan rộng và kết thúc bằng khải tượng về sự hoàn tất của lịch sử trong Đấng Christ."
          sections={NT_SECTIONS}
          sectionGroups={ntSectionGroups}
          segment={segment}
          readMap={readMap}
          intl={intl}
          contentClassName="px-0 pt-4 pb-4"
          innerAccordionClassName="space-y-1"
          cardsWrapperClassName="space-y-6"
        />
      </Accordion>
    </>
  );
}
