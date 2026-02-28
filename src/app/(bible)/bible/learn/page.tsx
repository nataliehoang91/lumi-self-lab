"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { Container } from "@/components/ui/container";
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

export default function LearnPage() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  const sizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const h1Class =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";
  const subtitleClass =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";

  return (
    <div className="min-h-screen bg-read font-sans">
      <main>
        <Container maxWidth="5xl" className={cn("px-4 py-16 md:py-24", sizeClass)}>
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {intl.t("learnStartHere")}
            </p>
            <h1
              className={cn("font-bible-english font-semibold leading-tight text-balance", h1Class)}
            >
              {intl.t("learnTitle")}
            </h1>
            <p
              className={cn(
                "mt-4 font-light text-muted-foreground leading-relaxed max-w-xl",
                subtitleClass
              )}
            >
              {intl.t("learnSubtitle")}
            </p>
          </div>

          <div className="space-y-3">
            {MODULES.map((m, i) => (
              <Link
                key={m.num}
                href={HREFS[i]}
                className="group flex flex-col gap-4 p-6 bg-card border border-border rounded-2xl hover:border-foreground/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-6">
                  <span className="font-mono text-sm font-bold text-second pt-0.5 w-6 shrink-0">
                    {m.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold group-hover:text-foreground transition-colors">
                      {intl.t(m.keyTitle)}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground mt-1 leading-relaxed">
                      {intl.t(m.keyDesc)}
                    </p>
                    <p className="text-xs font-light text-muted-foreground mt-2">
                      {intl.t("learnMinRead", { min: m.min })}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="flex items-center gap-1.5 text-sm font-medium rounded-lg border border-primary-dark bg-primary-light text-foreground px-3 py-1.5 transition-all group-hover:gap-2 group-hover:bg-primary-dark/20 group-hover:border-primary-dark">
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

          <div className="mt-12 rounded-2xl px-8 pt-8 pb-6 flex flex-col bg-primary-light/20 gap-6 border border-primary-dark/30">
            <div className="text-left">
              <p className="font-bible-english text-xl md:text-2xl font-normal leading-relaxed  text-balance">
                &ldquo;{intl.t("learnVerse")}&rdquo;
              </p>
              <p className="text-xs font-sans tracking-[0.2em] uppercase mt-3">
                {intl.t("learnVerseRef")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-sm font-medium">{intl.t("learnCtaTitle")}</p>
                <p className="text-sm mt-0.5 text-muted-foreground">{intl.t("learnCtaSubtitle")}</p>
              </div>
              <Link
                href="/bible/read"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap hover:opacity-90 bg-second-dark text-background"
              >
                {intl.t("learnOpenBible")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
