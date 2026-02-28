"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    num: "01",
    keyTitle: "learnModule1Title" as const,
    keyDesc: "learnModule1Desc" as const,
    min: 5,
  },
  {
    num: "02",
    keyTitle: "learnModule2Title" as const,
    keyDesc: "learnModule2Desc" as const,
    min: 8,
  },
  {
    num: "03",
    keyTitle: "learnModule3Title" as const,
    keyDesc: "learnModule3Desc" as const,
    min: 6,
  },
  {
    num: "04",
    keyTitle: "learnModule4Title" as const,
    keyDesc: "learnModule4Desc" as const,
    min: 5,
  },
] as const;

const HREFS = [
  "/bible/learn/bible-structure",
  "/bible/learn/bible-origin",
  "/bible/learn/who-is-jesus",
  "/bible/learn/what-is-faith",
] as const;

function getJesusRichParams(intl: ReturnType<typeof getBibleIntl>) {
  const isVi = intl.locale === "vi";
  const jesus = isVi ? "Chúa Jêsus" : "Jesus";
  const he = isVi ? "Ngài" : "He";
  const him = isVi ? "Ngài" : "Him";
  const his = isVi ? "Ngài" : "His";

  return {
    jesus: <strong>{jesus}</strong>,
    he: <strong>{he}</strong>,
    him: <strong>{him}</strong>,
    his: <strong>{his}</strong>,
  };
}

export default function LearnPage() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";
  const h1Class =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";
  const subtitleClass =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";
  const verseClass =
    fontSize === "small"
      ? "text-lg md:text-xl"
      : fontSize === "large"
        ? "text-2xl md:text-3xl"
        : "text-xl md:text-2xl";

  return (
    <div>
      <div className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          {intl.t("learnStartHere")}
        </p>
        <h1 className={cn("font-bible-english font-semibold leading-tight text-balance", h1Class)}>
          {intl.t("learnTitle")}
        </h1>
        <p
          className={cn(
            "mt-4 font-light text-muted-foreground leading-relaxed max-w-xl",
            subtitleClass
          )}
        >
          {intl.rich("learnSubtitle", { jesus: <strong>{intl.t("jesus")}</strong> })}
        </p>
      </div>

      <div className="space-y-3">
        {MODULES.map((m, i) => (
          <Link
            key={m.num}
            href={HREFS[i]}
            className="group flex flex-col px-6 py-4 bg-card border  rounded-2xl hover:border-primary/60 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-6">
              <span className="font-mono text-sm font-semibold text-second pt-0.5 w-6 ">
                {m.num}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold group-hover:text-foreground transition-colors",
                    bodyClass
                  )}
                >
                  {intl.rich(m.keyTitle, getJesusRichParams(intl))}
                </p>
                <p
                  className={cn(
                    "font-normal text-muted-foreground mt-1 leading-relaxed",
                    bodyClass
                  )}
                >
                  {intl.rich(m.keyDesc, getJesusRichParams(intl))}
                </p>
              </div>
            </div>
            <div className="flex justify-between  mt-4">
              <p className={cn("font-light pl-12 text-muted-foreground text-xs", bodyClass)}>
                {intl.t("learnMinRead", { min: m.min })}
              </p>
              <span className="flex items-center gap-1.5 text-sm font-medium rounded-lg   bg-primary-light/80 text-foreground px-3 py-1.5 shrink-0 transition-all group-hover:bg-primary/25 group-hover:border-primary/70">
                {intl.t("readPageTitle")}
                <ChevronRight
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl px-8 pt-8 pb-6 flex flex-col bg-primary-light/10 gap-6 border border-primary-dark/30">
        <div className="text-left">
          <p
            className={cn(
              "font-bible-english font-normal leading-relaxed text-balance",
              verseClass
            )}
          >
            &ldquo;{intl.t("learnVerse")}&rdquo;
          </p>
          <p className="text-xs font-sans tracking-[0.2em] uppercase mt-3">
            {intl.t("learnVerseRef")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <p className={cn("font-medium", bodyClass)}>{intl.t("learnCtaTitle")}</p>
            <p className={cn("mt-0.5 text-muted-foreground", bodyClass)}>
              {intl.t("learnCtaSubtitle")}
            </p>
          </div>
          <Link
            href="/bible/read"
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap hover:opacity-90 bg-primary text-primary-foreground",
              bodyClass
            )}
          >
            {intl.t("learnOpenBible")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
