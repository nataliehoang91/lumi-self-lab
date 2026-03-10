import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import {
  getBookOverviewBySlug,
  type BookOverviewLang,
  type KeyVerseRow,
} from "@/app/actions/bible/book-overview";
import { isBibleLocale } from "@/app/(bible)/bible/[lang]/layout";
import { Container } from "@/components/ui/container";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { cn } from "@/lib/utils";
import { BookOverviewChristConnection } from "@/components/Bible/BookOverviews/BookOverviewChristConnection";

function formatChapterRange(raw: string, lang: "en" | "vi"): string {
  const nums = raw.match(/\d+/g) ?? [];
  if (nums.length === 0) return raw;
  const start = Number.parseInt(nums[0]!, 10);
  const end = nums.length > 1 ? Number.parseInt(nums[1]!, 10) : start;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return raw;

  if (lang === "vi") {
    return start === end ? `Chương ${start}` : `Chương ${start} → Chương ${end}`;
  }

  // English
  return start === end ? `Chapter ${start}` : `Chapter ${start} → Chapter ${end}`;
}

type Params = Promise<{ lang: string; bookName: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang, bookName } = await params;
  const overviewLang: BookOverviewLang = lang === "vi" ? "vi" : "en";
  const data = await getBookOverviewBySlug(bookName, overviewLang);
  if (!data) {
    return { title: "Book Overview" };
  }
  const name = overviewLang === "vi" ? data.nameVi : data.nameEn;
  return {
    title: `${name} – Book Overview`,
    description: `Overview of ${name}: themes, outline, key verses, and Christ connection.`,
  };
}

export default async function BookOverviewPage({ params }: { params: Params }) {
  const { lang, bookName } = await params;
  const normalizedLang = lang?.toLowerCase();
  if (!normalizedLang || !isBibleLocale(normalizedLang)) {
    notFound();
  }
  const overviewLang: BookOverviewLang = normalizedLang === "vi" ? "vi" : "en";
  const data = await getBookOverviewBySlug(bookName, overviewLang);
  if (!data) notFound();

  const displayName = overviewLang === "vi" ? data.nameVi : data.nameEn;
  const chapters = data.chapterCount;
  const testament: "ot" | "nt" = data.order <= 39 ? "ot" : "nt";
  const langSegment: "en" | "vi" = normalizedLang === "vi" ? "vi" : "en";
  const defaultVersion: "vi" | "niv" | undefined = langSegment === "vi" ? "vi" : "niv";
  const meta = [
    { l: "Author", v: data.author ?? "—" },
    { l: "Written", v: data.date ?? "—" },
    { l: "Chapters", v: String(chapters) },
    { l: "Audience", v: data.audience ?? "—" },
  ];
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

  const getKeyVerseLocation = (
    v: KeyVerseRow
  ): { chapter: number; verse: number } | null => {
    if (v.chapter != null && v.verse != null) {
      return { chapter: v.chapter, verse: v.verse };
    }
    const match = v.ref.match(/(\d+):(\d+)/);
    if (!match) return null;
    const chapterNum = Number.parseInt(match[1], 10);
    const verseNum = Number.parseInt(match[2], 10);
    if (!Number.isFinite(chapterNum) || !Number.isFinite(verseNum)) return null;
    return { chapter: chapterNum, verse: verseNum };
  };

  return (
    <main>
      <Container maxWidth="7xl">
        <div className="mb-10">
          <p
            className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.2em]
              uppercase"
          >
            Book Overview
          </p>
          <h1
            className="text-foreground font-serif text-4xl leading-tight font-semibold
              md:text-5xl"
          >
            {data.order}. {displayName}
          </h1>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.l} className="bg-card border-border rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">{m.l}</p>
              <p className="text-foreground mt-1 text-sm leading-snug font-medium">
                {m.v}
              </p>
            </div>
          ))}
        </div>

        {data.themes.length > 0 && (
          <section className="mb-10 w-full">
            <h2 className="text-foreground mb-4 font-serif text-xl font-semibold">
              Main Themes
            </h2>
            <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2">
              {data.themes.map((t) => (
                <span
                  key={t}
                  className="bg-card border-border text-foreground rounded-lg border px-3
                    py-1.5 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.outline.length > 0 && (
          <section className="mb-10">
            <h2 className="text-foreground mb-4 font-serif text-xl font-semibold">
              Chapter Outline
            </h2>
            <div className="mx-auto grid grid-cols-1 gap-2 lg:grid-cols-2">
              {data.outline.map((o, idx) => {
                const chapterLabel = formatChapterRange(o.chapter, langSegment);
                return (
                  <div
                    key={`${o.chapter}-${o.title}`}
                    className={cn(
                      "bg-card border-sage-dark/20 flex items-start gap-4 rounded-xl",
                      "border px-4 py-3"
                    )}
                  >
                    <div
                      className="bg-muted-foreground/10 text-muted-foreground flex h-7 w-7
                        shrink-0 items-center justify-center rounded-full text-xs
                        font-medium"
                      aria-hidden
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm">{o.title}</p>
                      <p
                        className="text-muted-foreground/80 mt-0.5 flex items-center
                          justify-between font-mono text-xs"
                      >
                        <span>{chapterLabel}</span>
                        {(() => {
                          const firstNumberMatch = o.chapter.match(/\d+/);
                          const startChapter =
                            firstNumberMatch != null
                              ? Number.parseInt(firstNumberMatch[0], 10)
                              : NaN;
                          if (!Number.isFinite(startChapter) || startChapter <= 0) {
                            return null;
                          }
                          return (
                            <Link
                              href={buildReadChapterHref(startChapter)}
                              className="text-second-600 hover:text-second-800 text-xs font-medium underline underline-offset-4"
                            >
                              {normalizedLang === "vi"
                                ? "Đọc trong Kinh Thánh"
                                : "Read in Bible"}
                            </Link>
                          );
                        })()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {data.keyVerses.length > 0 && (
          <section className="mb-10">
            <h2 className="text-foreground mb-4 font-serif text-xl font-semibold">
              Key Verses
            </h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {data.keyVerses.map((v) => (
                <div
                  key={v.ref}
                  className="border-border/50 bg-card rounded-lg border p-4
                    transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-foreground flex-1 text-sm italic">
                      &quot;{v.text}&quot;
                    </p>
                    {(() => {
                      const label = `${displayName} ${v.ref}`;
                      const loc = getKeyVerseLocation(v);
                      if (!loc) {
                        return (
                          <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
                            <BookOpen className="h-3 w-3" />
                            {label}
                          </span>
                        );
                      }
                      return (
                        <BibleVerseLink
                          langSegment={langSegment}
                          version1={defaultVersion}
                          bookId={data.bookId}
                          chapter={loc.chapter}
                          verse={loc.verse}
                          testament={testament}
                          triggerClassName="inline-flex items-center gap-1 rounded-full
                            bg-primary/10 px-2 py-1 text-xs font-medium text-primary-700"
                        >
                          <BookOpen className="h-3 w-3" />
                          {label}
                        </BibleVerseLink>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.christConnection && (
          <BookOverviewChristConnection
            lang={langSegment}
            connection={data.christConnection}
            readHref={readHref}
            bookDisplayName={displayName}
          />
        )}
      </Container>
    </main>
  );
}
