"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

interface BookOverviewChristConnectionProps {
  lang: "en" | "vi";
  connection: string;
  readHref: string;
  bookDisplayName: string;
}

export function BookOverviewChristConnection({
  lang,
  connection,
  readHref,
  bookDisplayName,
}: BookOverviewChristConnectionProps) {
  const { bodyClass, bodyTitleClass } = useBibleFontClasses();
  const isVi = lang === "vi";
  const titleFont = isVi ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = isVi ? "font-vietnamese-flashcard" : undefined;

  const title = isVi ? "Trọng tâm về Đấng Christ" : "Christ Connection";
  const ctaLabel = isVi ? "Đọc sách trong Kinh Thánh" : `Go read ${bookDisplayName}`;

  return (
    <section
      className="bg-primary-light/10 border-primary-dark/30 mb-12 gap-4 rounded-xl border
        p-6"
    >
      <h2
        className={cn(
          "text-foreground mb-2 font-semibold",
          bodyTitleClass,
          titleFont
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-muted-foreground text-sm leading-relaxed",
          bodyClass,
          bodyFont
        )}
      >
        {connection}
      </p>

      <div className="mt-4 flex justify-end">
        <Link
          href={readHref}
          className="text-second-700 hover:text-second-900 inline-flex items-center gap-1
            text-sm font-medium underline underline-offset-4"
        >
          {ctaLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}

