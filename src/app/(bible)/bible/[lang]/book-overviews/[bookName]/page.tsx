import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  getBookOverviewBySlug,
  type BookOverviewLang,
} from "@/app/actions/bible/book-overview";
import { isBibleLocale } from "@/app/(bible)/bible/[lang]/layout";

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
  const overviewLang: BookOverviewLang =
    normalizedLang === "vi" ? "vi" : "en";
  const data = await getBookOverviewBySlug(bookName, overviewLang);
  if (!data) notFound();

  const displayName = overviewLang === "vi" ? data.nameVi : data.nameEn;
  const chapters = data.chapterCount;
  const meta = [
    { l: "Author", v: data.author ?? "—" },
    { l: "Written", v: data.date ?? "—" },
    { l: "Chapters", v: String(chapters) },
    { l: "Audience", v: data.audience ?? "—" },
  ];
  const readHref = `/bible/${normalizedLang}/read?book1=${encodeURIComponent(data.bookId)}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-10">
          <Link
            href={`/bible/${normalizedLang}/book-overviews`}
            className="hover:text-foreground transition-colors"
          >
            Book Overviews
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{displayName}</span>
        </div>

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Book Overview
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            {data.order}. {displayName}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {meta.map((m) => (
            <div
              key={m.l}
              className="p-4 bg-card border border-border rounded-xl"
            >
              <p className="text-xs text-muted-foreground">{m.l}</p>
              <p className="text-sm font-medium text-foreground mt-1 leading-snug">
                {m.v}
              </p>
            </div>
          ))}
        </div>

        {data.themes.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Main Themes
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.themes.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.outline.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Chapter Outline
            </h2>
            <div className="space-y-2">
              {data.outline.map((o) => (
                <div
                  key={`${o.chapter}-${o.title}`}
                  className="flex items-start gap-4 px-4 py-3 bg-card border border-border rounded-xl"
                >
                  <span className="font-mono text-xs text-muted-foreground/60 w-12 shrink-0 pt-0.5">
                    {o.chapter}
                  </span>
                  <span className="text-sm text-foreground">{o.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.keyVerses.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Key Verses
            </h2>
            <div className="space-y-3">
              {data.keyVerses.map((v) => (
                <div
                  key={v.ref}
                  className="p-5 bg-card border border-border rounded-xl"
                >
                  <p className="font-serif text-base text-foreground leading-relaxed italic">
                    &quot;{v.text}&quot;
                  </p>
                  <p className="mt-2 text-muted-foreground/80">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="font-mono text-xs text-muted-foreground/60"> {v.ref}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.christConnection && (
          <section className="mb-12 p-6 bg-foreground text-background rounded-2xl">
            <h2 className="font-serif text-xl font-semibold mb-3">
              Christ Connection
            </h2>
            <p className="text-sm leading-relaxed opacity-80">
              {data.christConnection}
            </p>
          </section>
        )}

        <Link
          href={readHref}
          className="flex items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl hover:border-foreground/30 hover:shadow-sm transition-all group"
        >
          <div>
            <p className="font-medium text-foreground">Read {displayName}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Open in the Bible reader
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </Link>
      </main>
    </div>
  );
}
