"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

const LESSON_ORDER = ["bible-structure", "bible-origin", "who-is-jesus", "what-is-faith"] as const;

const MODULE_TITLE_KEYS = [
  "learnModule1Title",
  "learnModule2Title",
  "learnModule3Title",
  "learnModule4Title",
] as const;

function getCurrentSegment(pathname: string | null): string | null {
  if (!pathname || !pathname.startsWith("/bible/learn/")) return null;
  const segment = pathname.replace("/bible/learn/", "").split("/")[0];
  return segment && LESSON_ORDER.includes(segment as (typeof LESSON_ORDER)[number])
    ? segment
    : null;
}

export function LearnLessonFooter() {
  const pathname = usePathname();
  const segment = getCurrentSegment(pathname);
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  if (!segment) return null;

  const currentIndex = LESSON_ORDER.indexOf(segment as (typeof LESSON_ORDER)[number]);
  const nextSegment =
    currentIndex >= 0 && currentIndex < LESSON_ORDER.length - 1
      ? LESSON_ORDER[currentIndex + 1]
      : null;
  const nextLabel = nextSegment ? intl.t(MODULE_TITLE_KEYS[currentIndex + 1]) : null;
  const nextHref = nextSegment ? `/bible/learn/${nextSegment}` : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-sage-dark/20">
      <Link
        href="/bible/learn"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 order-2 sm:order-1"
      >
        <ChevronRight className="w-3.5 h-3.5 rotate-180 shrink-0" />
        {intl.t("learnStructureAllLessons")}
      </Link>

      {nextHref && nextLabel ? (
        <Link
          href={nextHref}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-light  rounded-xl text-sm font-medium hover:opacity-90 transition-opacity order-3"
        >
          {intl.t("learnStructureNext")}: <span className="font-bold">{nextLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      ) : (
        <div className="order-3" />
      )}
    </div>
  );
}
