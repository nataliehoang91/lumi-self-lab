"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

const LESSON_SEGMENTS = [
  "bible-structure",
  "bible-origin",
  "who-is-jesus",
  "what-is-faith",
] as const;

function getSegmentAndLang(pathname: string | null): { lang: string } | null {
  if (!pathname || !pathname.includes("/learn/")) return null;
  const parts = pathname.split("/");
  const langIdx = parts.indexOf("bible") + 1;
  const learnIdx = parts.indexOf("learn");
  const lang = parts[langIdx] === "vi" ? "vi" : "en";
  const segment = learnIdx >= 0 && parts[learnIdx + 1] ? parts[learnIdx + 1] : null;
  if (!segment || segment === "deep-dive") return null;
  if (!LESSON_SEGMENTS.includes(segment as (typeof LESSON_SEGMENTS)[number])) return null;
  return { lang };
}

export function LearnDeepDiveCta() {
  const pathname = usePathname();
  const result = getSegmentAndLang(pathname);
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const { bodyClass, bodyTitleClass, subBodyClass, buttonClass } = useLearnFontClasses();

  if (!result) return null;
  const { lang } = result;

  return (
    <Card className="py-0 px-2 rounded-2xl overflow-hidden border-l-4 border-l-second/80">
      <CardHeader className="py-2 border-b border-border/80 space-y-0">
        <p
          className={cn(
            "font-serif sm:text-left text-center leading-relaxed text-balance text-foreground",
            bodyTitleClass
          )}
        >
          {intl.t("learnDeepDiveTitle")}
        </p>
        <p
          className={cn(
            "mt-2 font-medium tracking-[0.2em] uppercase text-second sm:text-left text-center",
            subBodyClass
          )}
        >
          {intl.t("learnDeepDiveLabel")}
        </p>
      </CardHeader>

      <CardFooter className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p
          className={cn(
            "text-muted-foreground sm:text-left text-center leading-relaxed",
            bodyClass
          )}
        >
          {intl.t("learnDeepDiveDescription")}
        </p>
        <Link
          href={`/bible/${lang}/learn/deep-dive`}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all shrink-0",
            "bg-second text-second-foreground hover:bg-second/90",
            buttonClass
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {intl.t("learnDeepDiveButton")}
        </Link>
      </CardFooter>
    </Card>
  );
}
