"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const LESSON_ORDER = [
  "what-is-bible",
  "bible-origin",
  "who-is-jesus",
  "what-happens-after-death",
  "what-is-faith",
] as const;

const LESSON_TITLES: Record<(typeof LESSON_ORDER)[number], { en: string; vi: string }> = {
  "what-is-bible": {
    en: "What Is the Bible?",
    vi: "Kinh thánh là gì?",
  },
  "bible-origin": {
    en: "Where Did the Bible Come From?",
    vi: "Kinh Thánh đến với chúng ta như thế nào?",
  },
  "who-is-jesus": {
    en: "Who Is Jesus?",
    vi: "Chúa Giê-xu là ai?",
  },
  "what-happens-after-death": {
    en: "What Happens After Death?",
    vi: "Cái chết không phải là hết – Thật không?",
  },
  "what-is-faith": {
    en: "What Is Faith?",
    vi: "Đức tin là gì?",
  },
};

function getCurrentSegmentAndLang(
  pathname: string | null
): { segment: string; lang: string } | null {
  if (!pathname || !pathname.includes("/learn/")) return null;
  const parts = pathname.split("/");
  // /bible/en/learn or /bible/en/learn/bible-origin
  const langIdx = parts.indexOf("bible") + 1;
  const learnIdx = parts.indexOf("learn");
  const lang = parts[langIdx] === "vi" ? "vi" : "en";
  const segment = learnIdx >= 0 && parts[learnIdx + 1] ? parts[learnIdx + 1] : null;
  return segment && LESSON_ORDER.includes(segment as (typeof LESSON_ORDER)[number])
    ? { segment, lang }
    : null;
}

export function LearnLessonFooter() {
  const pathname = usePathname();
  const result = getCurrentSegmentAndLang(pathname);
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  if (!result) return null;
  const { segment, lang } = result;

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";

  const currentIndex = LESSON_ORDER.indexOf(segment as (typeof LESSON_ORDER)[number]);
  const isLastLesson = currentIndex === LESSON_ORDER.length - 1;

  const prevSegment = currentIndex > 0 ? LESSON_ORDER[currentIndex - 1] : null;
  const prevLabel = prevSegment
    ? LESSON_TITLES[prevSegment][lang === "vi" ? "vi" : "en"]
    : null;
  const prevHref = prevSegment ? `/bible/${lang}/learn/${prevSegment}` : null;

  let nextHref: string | null = null;
  let nextLabel: string | null = null;
  if (currentIndex >= 0 && currentIndex < LESSON_ORDER.length - 1) {
    const nextSegment = LESSON_ORDER[currentIndex + 1];
    nextHref = `/bible/${lang}/learn/${nextSegment}`;
    nextLabel = LESSON_TITLES[nextSegment][lang === "vi" ? "vi" : "en"];
  }

  const readHref = `/bible/${lang}/read`;
  const startReadingLabel = intl.t("learnFooterStartReading");
  const contentFont = lang === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <div
      className={cn(
        "border-sage-dark/20 flex flex-col justify-between gap-4 border-t pt-6",
        "sm:flex-row sm:items-center",
        contentFont
      )}
    >
      <div className="order-1 flex flex-wrap items-center gap-3">
        {prevHref && prevLabel ? (
          <Link
            href={prevHref}
            className={cn(
              `text-foreground hover:text-foreground flex items-center gap-1.5
                transition-colors`,
              bodyClass
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {intl.t("learnStructurePrevious")}:{" "}
            <span className="font-semibold">{prevLabel}</span>
          </Link>
        ) : null}
      </div>

      {nextHref && nextLabel ? (
        <Link
          href={nextHref}
          className={cn(
            `bg-primary-light theme-warm:bg-primary theme-warm:text-primary-foreground
              dark:bg-primary-dark order-2 flex w-full items-center justify-end gap-2
              rounded-xl px-5 py-2.5 font-medium text-black transition-opacity
              hover:opacity-90 sm:w-auto sm:justify-center`,
            bodyClass
          )}
        >
          {intl.t("learnStructureNext")}:{" "}
          <span className="font-bold">{nextLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      ) : isLastLesson ? (
        <Link
          href={readHref}
          className={cn(
            `bg-primary-light theme-warm:bg-primary theme-warm:text-primary-foreground
              dark:bg-primary-dark order-2 flex w-full items-center justify-end gap-2
              rounded-xl px-5 py-2.5 font-medium text-black transition-opacity
              hover:opacity-90 sm:w-auto sm:justify-center`,
            bodyClass
          )}
        >
          <span className="font-bold">{startReadingLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      ) : (
        <div className="order-2" />
      )}
    </div>
  );
}
