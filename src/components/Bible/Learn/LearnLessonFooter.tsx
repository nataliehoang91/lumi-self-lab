"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const LESSON_ORDER = ["bible-structure", "bible-origin", "who-is-jesus", "what-is-faith"] as const;

const MODULE_TITLE_KEYS = [
  "learnModule1Title",
  "learnModule2Title",
  "learnModule3Title",
  "learnModule4Title",
] as const;

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
  const isStructureLesson = segment === "bible-structure";

  const prevSegment = currentIndex > 0 ? LESSON_ORDER[currentIndex - 1] : null;
  const prevLabel = prevSegment ? intl.t(MODULE_TITLE_KEYS[currentIndex - 1]) : null;
  const prevHref = prevSegment ? `/bible/${lang}/learn/${prevSegment}` : null;

  let nextHref: string | null = null;
  let nextLabel: string | null = null;
  let structureNextLabel: string | null = null;
  if (isStructureLesson) {
    nextHref = `/bible/${lang}/learn/bible-origin`;
    structureNextLabel = intl.t("learnStructureNextOrigin");
  } else if (currentIndex >= 0 && currentIndex < LESSON_ORDER.length - 1) {
    const nextSegment = LESSON_ORDER[currentIndex + 1];
    nextHref = `/bible/${lang}/learn/${nextSegment}`;
    nextLabel = intl.t(MODULE_TITLE_KEYS[currentIndex + 1]);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-sage-dark/20">
      <div className="flex flex-wrap items-center gap-3 order-1">
        {prevHref && prevLabel ? (
          <Link
            href={prevHref}
            className={cn(
              "flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors",
              bodyClass
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {intl.t("learnStructurePrevious")}: <span className="font-semibold">{prevLabel}</span>
          </Link>
        ) : null}
      </div>

      {nextHref && (structureNextLabel || nextLabel) ? (
        <Link
          href={nextHref}
          className={cn(
            "flex items-center w-full sm:w-auto justify-end sm:justify-center gap-2 px-5 py-2.5 bg-primary-light rounded-xl font-medium hover:opacity-90 transition-opacity order-2",
            bodyClass
          )}
        >
          {isStructureLesson && structureNextLabel ? (
            <span className="font-bold">{structureNextLabel}</span>
          ) : (
            <>
              {intl.t("learnStructureNext")}: <span className="font-bold">{nextLabel}</span>
            </>
          )}
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      ) : (
        <div className="order-2" />
      )}
    </div>
  );
}
