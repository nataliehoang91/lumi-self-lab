import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { connection } from "next/server";
import { getPublishedDeepDiveArchive } from "@/app/actions/admin/deep-dive";

export const metadata: Metadata = {
  title: "Deep Dive",
  description: "Weekly devotional articles for deeper Bible study.",
};

const LABELS = {
  en: {
    eyebrow: "Deep Dive",
    heading: "Articles",
    sub: "Weekly devotionals for deeper study.",
    empty: "No articles published yet.",
    emptySub: "Check back soon for weekly devotional content.",
  },
  vi: {
    eyebrow: "Đào Sâu",
    heading: "Bài Viết",
    sub: "Tĩnh tâm hàng tuần để tìm hiểu sâu hơn.",
    empty: "Chưa có bài viết nào.",
    emptySub: "Hãy quay lại sau để xem nội dung tĩnh tâm hàng tuần.",
  },
};

export default async function DeepDivePage({ params }: { params: Promise<{ lang: string }> }) {
  await connection();
  const { lang } = await params;
  const l = lang === "vi" ? "vi" : "en";
  const labels = LABELS[l];

  const articles = await getPublishedDeepDiveArchive(l);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-1">{labels.eyebrow}</p>
        <h1 className="text-2xl font-bold text-foreground">{labels.heading}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{labels.sub}</p>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground">{labels.empty}</p>
          <p className="mt-1 text-xs text-muted-foreground">{labels.emptySub}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((entry) => (
            <Link
              key={entry.id}
              href={`/bible/${l}/learn/deep-dive/${entry.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-background px-5 py-4 hover:border-primary/30 transition-colors group"
            >
              {entry.coverImage && (
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.coverImage} alt={entry.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate">{entry.title}</p>
                <p className="text-xs text-primary mt-0.5">{entry.scriptureRef}</p>
                {entry.publishedAt && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.publishedAt).toLocaleDateString(l === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
