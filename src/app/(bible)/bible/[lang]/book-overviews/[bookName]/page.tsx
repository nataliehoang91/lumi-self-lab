import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  getBookOverviewBySlug,
  type BookOverviewLang,
} from "@/app/actions/bible/book-overview";
import { isBibleLocale } from "@/app/(bible)/bible/[lang]/layout";
import { Container } from "@/components/ui/container";

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
  const meta = [
    { l: "Author", v: data.author ?? "—" },
    { l: "Written", v: data.date ?? "—" },
    { l: "Chapters", v: String(chapters) },
    { l: "Audience", v: data.audience ?? "—" },
  ];
  const readHref = `/bible/${normalizedLang}/read?book1=${encodeURIComponent(data.bookId)}`;

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
          <section className="mb-10">
            <h2 className="text-foreground mb-4 font-serif text-xl font-semibold">
              Main Themes
            </h2>
            <div className="flex flex-wrap gap-2">
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
            <div className="space-y-2">
              {data.outline.map((o) => (
                <div
                  key={`${o.chapter}-${o.title}`}
                  className="bg-card border-border flex items-start gap-4 rounded-xl
                    border px-4 py-3"
                >
                  <span
                    className="text-muted-foreground/60 w-12 shrink-0 pt-0.5 font-mono
                      text-xs"
                  >
                    {o.chapter}
                  </span>
                  <span className="text-foreground text-sm">{o.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.keyVerses.length > 0 && (
          <section className="mb-10">
            <h2 className="text-foreground mb-4 font-serif text-xl font-semibold">
              Key Verses
            </h2>
            <div className="space-y-3">
              {data.keyVerses.map((v) => (
                <div key={v.ref} className="bg-card border-border rounded-xl border p-5">
                  <p
                    className="text-foreground font-serif text-base leading-relaxed
                      italic"
                  >
                    &quot;{v.text}&quot;
                  </p>
                  <p className="text-muted-foreground/80 mt-2">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-muted-foreground/60 font-mono text-xs">
                      {" "}
                      {v.ref}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.christConnection && (
          <section className="bg-foreground text-background mb-12 rounded-2xl p-6">
            <h2 className="mb-3 font-serif text-xl font-semibold">Christ Connection</h2>
            <p className="text-sm leading-relaxed opacity-80">{data.christConnection}</p>
          </section>
        )}

        <Link
          href={readHref}
          className="bg-card border-border hover:border-foreground/30 group flex
            items-center justify-between gap-4 rounded-2xl border p-5 transition-all
            hover:shadow-sm"
        >
          <div>
            <p className="text-foreground font-medium">Read {displayName}</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Open in the Bible reader
            </p>
          </div>
          <ArrowRight
            className="text-muted-foreground group-hover:text-foreground h-4 w-4
              transition-all group-hover:translate-x-0.5"
          />
        </Link>
      </Container>
    </main>
  );
}
