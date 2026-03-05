"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

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
  const { bodyClass, bodyTitleClass, subBodyClass, buttonClass } = useBibleFontClasses();

  if (!result) return null;
  const { lang } = result;

  return (
    <Card className="border-l-second/80 overflow-hidden rounded-2xl border-l-4 px-2 py-2">
      <CardHeader className="border-border/80 space-y-0 border-b py-2">
        <p
          className={cn(
            `text-foreground text-center font-serif leading-relaxed text-balance
            sm:text-left`,
            bodyTitleClass
          )}
        >
          {intl.t("learnDeepDiveTitle")}
        </p>
        <p
          className={cn(
            `text-second mt-2 text-center font-medium tracking-[0.2em] uppercase
            sm:text-left`,
            subBodyClass
          )}
        >
          {intl.t("learnDeepDiveLabel")}
        </p>
      </CardHeader>

      <CardFooter
        className="flex flex-col justify-between gap-4 py-2 sm:flex-row sm:items-center"
      >
        <p
          className={cn(
            "text-muted-foreground text-center leading-relaxed sm:text-left",
            bodyClass
          )}
        >
          {intl.t("learnDeepDiveDescription")}
        </p>
        <Link
          href={`/bible/${lang}/learn/deep-dive`}
          className={cn(
            `flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-semibold
            whitespace-nowrap transition-all`,
            "bg-second text-second-foreground hover:bg-second/90",
            buttonClass
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {intl.t("learnDeepDiveButton")}
        </Link>
      </CardFooter>
    </Card>
  );
}
