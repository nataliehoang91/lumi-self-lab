"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBibleIntl } from "@/lib/bible-intl";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

const SEGMENT_TITLE_KEYS: Record<string, string> = {
  "bible-structure": "learnModule1Title",
  "bible-origin": "learnOriginTitle",
  "what-happens-after-death": "learnModule4Title",
  "who-is-jesus": "learnJesusTitle",
  "what-is-faith": "learnModule5Title",
};

export function LearnBreadcrumb({ lang }: { lang: string }) {
  const pathname = usePathname();
  const { bodyClass } = useBibleFontClasses();
  const parts = pathname?.split("/") ?? [];
  const segment = parts[3] === "learn" && parts[4] ? parts[4] : null;

  const intl = getBibleIntl(lang === "vi" ? "VI" : "EN");
  const titleKey = segment ? SEGMENT_TITLE_KEYS[segment] : null;
  const currentLabel = titleKey ? intl.t(titleKey) : null;

  if (!pathname?.includes("/learn") || segment == null) return null;

  return (
    <div
      className={cn(
        "text-muted-foreground mb-8 flex items-center gap-2",
        bodyClass,
        lang === "vi" && "font-vietnamese-flashcard"
      )}
    >
      <Link
        href={`/bible/${lang}/learn`}
        className="hover:text-foreground font-medium transition-colors"
      >
        {intl.t("langPageNavLearn")}
      </Link>
      {currentLabel && (
        <>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{currentLabel}</span>
        </>
      )}
    </div>
  );
}
