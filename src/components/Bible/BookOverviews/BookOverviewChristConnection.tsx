"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

interface BookOverviewChristConnectionProps {
  lang: "en" | "vi";
  /** Summary as array of paragraphs (p1, p2, p3). */
  paragraphs: string[];
  readHref: string;
  bookDisplayName: string;
}

export function BookOverviewChristConnection({
  lang,
  paragraphs,
  readHref,
  bookDisplayName,
}: BookOverviewChristConnectionProps) {
  const { bodyClass, bodyTitleClass } = useBibleFontClasses();
  const isVi = lang === "vi";
  const titleFont = isVi ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = isVi ? "font-vietnamese-flashcard" : undefined;

  const title = isVi ? "Tóm tắt nội dung" : "Book Summary";
  const ctaLabel = isVi ? "Đọc sách trong Kinh Thánh" : `Go read ${bookDisplayName}`;

  if (paragraphs.length === 0) return null;

  return (
    <section
      className="border-primary/20 from-primary/5 hover:border-primary/40 group
        via-primary/[0.07] mb-12 rounded-lg border bg-linear-to-br to-transparent p-0
        transition-all hover:shadow-md"
    >
      <div className="flex gap-3 p-4">
        <div
          className="from-primary via-primary/60 to-primary/20 theme-warm:bg-second/60
            theme-warm:via-second/60 theme-warm:to-second-100/20 mr-3 w-1 shrink-0
            rounded-full bg-linear-to-b"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              `text-primary-700 group-hover:text-primary-900 mb-2 font-semibold
              transition-colors`,
              bodyTitleClass,
              titleFont
            )}
          >
            {title}
          </h2>
          <div
            className={cn(
              "text-muted-foreground space-y-3 text-sm leading-relaxed",
              bodyClass,
              bodyFont
            )}
          >
            {paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href={readHref}
              className="hover:text-primary-900 inline-flex items-center gap-1 text-sm
                font-medium underline underline-offset-4"
            >
              {ctaLabel}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
