"use client";

import Link from "next/link";

import type { BookOverviewData } from "@/app/actions/bible/book-overview";
import { Container } from "@/components/ui/container";
import { BookOverviewChristConnection } from "@/components/Bible/BookOverviews/BookOverviewChristConnection";
import { BookOverviewMeta } from "@/components/Bible/BookOverviews/BookOverviewMeta";
import { BookOverviewReadMarker } from "@/components/Bible/BookOverviews/BookOverviewReadMarker";
import { KeyVersesSection } from "@/components/GeneralComponents/verse-ref-layout";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

function formatChapterRange(raw: string, lang: "en" | "vi"): string {
  const nums = raw.match(/\d+/g) ?? [];
  if (nums.length === 0) return raw;
  const start = Number.parseInt(nums[0]!, 10);
  const end = nums.length > 1 ? Number.parseInt(nums[1]!, 10) : start;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return raw;

  if (lang === "vi") {
    return start === end ? `Chương ${start}` : `Chương ${start} → Chương ${end}`;
  }

  return start === end ? `Chapter ${start}` : `Chapter ${start} → Chapter ${end}`;
}

type Props = {
  langSegment: "en" | "vi";
  normalizedLang: string;
  bookSlugEn: string;
  data: BookOverviewData;
  displayName: string;
  testament: "ot" | "nt";
  defaultVersion: "vi" | "niv" | undefined;
  hasOverviewContent: boolean;
};

export function BookOverviewPageClient({
  langSegment,
  normalizedLang,
  bookSlugEn,
  data,
  displayName,
  testament,
  defaultVersion,
  hasOverviewContent,
}: Props) {
  const isVi = langSegment === "vi";
  const { h1Class, bodyClass, subtitleClass, bodyClassUp } =
    useBibleFontClasses();

  const buildReadChapterHref = (chapter: number) => {
    const sp = new URLSearchParams();
    if (defaultVersion) sp.set("version1", defaultVersion);
    sp.set("sync", "true");
    sp.set("book1", data.bookId);
    sp.set("chapter1", String(chapter));
    sp.set("testament1", testament);
    return `/bible/${langSegment}/read?${sp.toString()}`;
  };

  const readHref = buildReadChapterHref(1);

  return (
    <main>
      <BookOverviewReadMarker lang={langSegment} slugEn={bookSlugEn} />
      <Container maxWidth="7xl">
        <div className="mb-10">
          <p
            className={cn(
              "mb-3 font-semibold tracking-[0.2em] uppercase",
              bodyClass,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {langSegment === "vi" ? "TỔNG QUAN SÁCH" : "BOOK OVERVIEW"}
          </p>
          <h1
            className={cn(
              "text-foreground font-serif leading-tight font-semibold",
              h1Class,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {data.order}. {displayName}
          </h1>
        </div>

        <BookOverviewMeta
          lang={langSegment}
          author={data.author}
          authorOccupation={(data as any).authorOccupation ?? null}
          date={data.date}
          audience={data.audience}
          chapters={data.chapterCount}
        />

        {data.themes.length > 0 && (
          <section className="mb-10 w-full">
            <h2
              className={cn(
                "text-foreground mb-4 font-serif font-semibold",
                subtitleClass,
                isVi && "font-vietnamese-flashcard"
              )}
            >
              {langSegment === "vi" ? "Các chủ đề chính" : "Main Themes"}
            </h2>
            <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2">
              {data.themes.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "bg-card border-border text-foreground rounded-lg border px-3 py-1.5",
                    bodyClass,
                    isVi && "font-vietnamese-flashcard"
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.outline.length > 0 && (
          <section className="mb-10">
            <h2
              className={cn(
                "text-foreground mb-4 font-serif font-semibold",
                subtitleClass,
                isVi && "font-vietnamese-flashcard"
              )}
            >
              {langSegment === "vi" ? "Dàn ý các chương" : "Chapter Outline"}
            </h2>
            <div
              className="mx-auto grid grid-cols-1 space-y-3 gap-x-3 gap-y-2
                lg:grid-cols-2"
            >
              {data.outline.map((o, idx) => {
                const chapterLabel = formatChapterRange(o.chapter, langSegment);
                const firstNumberMatch = o.chapter.match(/\d+/);
                const startChapter =
                  firstNumberMatch != null
                    ? Number.parseInt(firstNumberMatch[0], 10)
                    : NaN;

                return (
                  <div
                    key={`${o.chapter}-${o.title}`}
                    className={cn(
                      `bg-card border-sage-dark/20 flex items-start gap-4 rounded-xl
                      border px-4 py-3`
                    )}
                  >
                    <div
                      className="bg-second dark:bg-second-800 text-second-foreground
                        text-md flex h-7 w-7 shrink-0 items-center justify-center
                        rounded-full font-medium"
                      aria-hidden
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p
                        className={cn(
                          "text-foreground",
                          bodyClassUp,
                          isVi && "font-vietnamese-flashcard"
                        )}
                      >
                        {o.title}
                      </p>
                      <p
                        className={cn(
                          `mt-0.5 flex flex-col items-center justify-between opacity-90
                          md:flex-row`,
                          bodyClass,
                          isVi ? "font-vietnamese-flashcard" : "font-mono"
                        )}
                      >
                        <span>{chapterLabel}</span>
                        {Number.isFinite(startChapter) && startChapter > 0 && (
                          <Link
                            href={buildReadChapterHref(startChapter)}
                            className={cn(
                              `text-second-800 dark:text-second-200 hover:text-second-800
                              font-medium underline underline-offset-4`,
                              bodyClass
                            )}
                          >
                            {normalizedLang === "vi"
                              ? "Đọc trong Kinh Thánh"
                              : "Read in Bible"}
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {data.keyVerses.length > 0 && (
          <KeyVersesSection
            keyVerses={data.keyVerses}
            displayName={displayName}
            langSegment={langSegment}
            defaultVersion={defaultVersion}
            bookId={data.bookId}
            testament={testament}
            layout="hybrid"
          />
        )}

        {data.christConnection && (
          <BookOverviewChristConnection
            lang={langSegment}
            connection={data.christConnection}
            readHref={readHref}
            bookDisplayName={displayName}
          />
        )}

        {!hasOverviewContent && (
          <div
            className={cn(
              "mt-8 text-center",
              bodyClass,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {langSegment === "vi"
              ? "Tổng quan cho sách này đang được cập nhật."
              : "This book overview is being updated."}
          </div>
        )}
      </Container>
    </main>
  );
}
