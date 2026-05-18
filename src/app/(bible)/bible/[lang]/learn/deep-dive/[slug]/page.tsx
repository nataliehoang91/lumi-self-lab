import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDeepDiveTranslation } from "@/app/actions/admin/deep-dive";

const LABELS = {
  en: {
    back: "Back", scripture: "Scripture", reflection: "Reflection",
    application: "Application", prayer: "Prayer",
    originalBadge: "Original EN",
    translationBadge: "Translation VI",
  },
  vi: {
    back: "Quay lại", scripture: "Kinh Thánh", reflection: "Suy gẫm",
    application: "Ứng dụng", prayer: "Cầu nguyện",
    originalBadge: "Bản gốc EN",
    translationBadge: "Bản dịch VI",
  },
};

async function getArticle(slug: string, lang: string) {
  return prisma.bibleDeepDive.findUnique({
    where: { slug_lang: { slug, lang } },
  });
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const article = await getArticle(slug, sp.lang === "vi" ? "vi" : "en");
  if (!article) return {};
  return { title: article.title, description: article.scriptureRef };
}

export default async function DeepDiveArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: siteLang, slug } = await params;
  const sp = await searchParams;

  // Article language from search param; default is always EN (original)
  const articleLang = sp.lang === "vi" ? "vi" : "en";
  const otherLang = articleLang === "en" ? "vi" : "en";
  const labels = LABELS[articleLang];

  const [article, translation] = await Promise.all([
    getArticle(slug, articleLang),
    getDeepDiveTranslation(slug, otherLang),
  ]);

  if (!article || !article.isPublished) notFound();

  // Badge hrefs — keep same path, just swap ?lang param
  const basePath = `/bible/${siteLang}/learn/deep-dive/${slug}`;
  const enBadgeHref = `${basePath}?lang=en`;
  const viBadgeHref = `${basePath}?lang=vi`;

  return (
    <article className="space-y-8">
      <Link
        href={`/bible/${siteLang}/learn/deep-dive`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {labels.back}
      </Link>

      {article.coverImage && (
        <div className="overflow-hidden rounded-2xl aspect-[2/1] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString(articleLang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>

        {/* Language switcher badges */}
        <div className="flex items-center gap-1.5">
          <Link
            href={enBadgeHref}
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
              articleLang === "en"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels.originalBadge}
          </Link>
          {translation?.isPublished && (
            <Link
              href={viBadgeHref}
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                articleLang === "vi"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels.translationBadge}
            </Link>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground leading-tight mb-2">{article.title}</h1>
        <p className="text-base font-medium text-primary">{article.scriptureRef}</p>
      </div>

      <div className="rounded-2xl border border-border bg-primary/5 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">{labels.scripture}</p>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap italic">{article.scriptureText}</p>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{labels.reflection}</h2>
        <div className="deep-dive-content text-sm leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: article.reflection }} />
      </div>

      {article.application && (
        <div className="rounded-2xl border border-border bg-muted/30 px-6 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{labels.application}</h2>
          <div className="deep-dive-content text-sm leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: article.application }} />
        </div>
      )}

      {article.prayer && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{labels.prayer}</h2>
          <p className="text-sm leading-relaxed text-foreground italic whitespace-pre-wrap">{article.prayer}</p>
        </div>
      )}

      {article.sourceLabel && (
        <p className="text-xs text-muted-foreground border-t border-border pt-6">
          {articleLang === "vi" ? "Tham khảo: " : "Source: "}
          {article.sourceUrl ? (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
              {article.sourceLabel}
            </a>
          ) : (
            article.sourceLabel
          )}
        </p>
      )}
    </article>
  );
}
