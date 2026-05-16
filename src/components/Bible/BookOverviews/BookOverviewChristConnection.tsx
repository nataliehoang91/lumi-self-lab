"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

interface BookOverviewChristConnectionProps {
  lang: "en" | "vi";
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
  const { bodyClass, bodyClassUp, bodyTitleClassUp } = useBibleFontClasses();
  const isVi = lang === "vi";
  const titleFont = isVi ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = isVi ? "font-vietnamese-flashcard" : undefined;

  const title = isVi ? "Tóm tắt nội dung" : "Book Summary";
  const ctaLabel = isVi ? "Đọc sách trong Kinh Thánh" : `Go read ${bookDisplayName}`;

  if (paragraphs.length === 0) return null;

  return (
    <section
      className="bg-primary-light/10 theme-warm:bg-second/8 border-primary-dark/20 theme-warm:border-second/25 mb-10 rounded-2xl border p-6 md:p-8"
    >
      {/* Pill label */}
      <div className="bg-primary/15 theme-warm:bg-second/15 mb-4 inline-flex items-center rounded-full px-3 py-1">
        <span className={cn("text-primary-700 theme-warm:text-second dark:text-primary text-xs font-semibold tracking-wide uppercase", titleFont)}>
          {title}
        </span>
      </div>

      <h2 className={cn("text-foreground mb-4 font-bold leading-snug", bodyTitleClassUp, titleFont)}>
        {title}
      </h2>

      <div className={cn("space-y-3 leading-relaxed", bodyClassUp, bodyFont)}>
        {paragraphs.map((text, i) => (
          <p key={i} className="text-foreground/80">{text}</p>
        ))}
      </div>

      <Link
        href={readHref}
        className={cn(
          "mt-6 inline-flex items-center gap-2 font-semibold transition-opacity hover:opacity-80",
          "text-primary theme-warm:text-second",
          bodyClass,
          bodyFont
        )}
      >
        {ctaLabel} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </section>
  );
}
