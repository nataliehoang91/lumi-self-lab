"use client";

import { useState } from "react";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const TIMELINE_KEYS = [
  { keyYear: "learnOriginT1Year" as const, keyEvent: "learnOriginT1Event" as const },
  { keyYear: "learnOriginT2Year" as const, keyEvent: "learnOriginT2Event" as const },
  { keyYear: "learnOriginT3Year" as const, keyEvent: "learnOriginT3Event" as const },
  { keyYear: "learnOriginT4Year" as const, keyEvent: "learnOriginT4Event" as const },
  { keyYear: "learnOriginT5Year" as const, keyEvent: "learnOriginT5Event" as const },
  { keyYear: "learnOriginT6Year" as const, keyEvent: "learnOriginT6Event" as const },
  { keyYear: "learnOriginT7Year" as const, keyEvent: "learnOriginT7Event" as const },
] as const;

const LANG_KEYS = [
  {
    pct: "79%",
    keyLang: "learnOriginLangHebrew" as const,
    keyNote: "learnOriginLangHebrewNote" as const,
  },
  {
    pct: "18%",
    keyLang: "learnOriginLangGreek" as const,
    keyNote: "learnOriginLangGreekNote" as const,
  },
  {
    pct: "3%",
    keyLang: "learnOriginLangAramaic" as const,
    keyNote: "learnOriginLangAramaicNote" as const,
  },
] as const;

const FAQ_KEYS = [
  { keyQ: "learnOriginFAQ1Q" as const, keyA: "learnOriginFAQ1A" as const },
  { keyQ: "learnOriginFAQ2Q" as const, keyA: "learnOriginFAQ2A" as const },
  { keyQ: "learnOriginFAQ3Q" as const, keyA: "learnOriginFAQ3A" as const },
  { keyQ: "learnOriginFAQ4Q" as const, keyA: "learnOriginFAQ4A" as const },
] as const;

export default function BibleOriginPage() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const [showDeep, setShowDeep] = useState(false);

  const h1Class =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";

  return (
    <div>
      <div className="mb-12">
        <p className="text-xs font-mono text-second mb-3">{intl.t("learnOriginModuleNum")}</p>
        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {intl.t("learnOriginTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">{intl.t("learnOriginIntro")}</p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          type="button"
          onClick={() => setShowDeep(false)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            !showDeep
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {intl.t("learnOriginSummary")}
        </button>
        <button
          type="button"
          onClick={() => setShowDeep(true)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            showDeep
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {intl.t("learnOriginDeepDive")}
        </button>
      </div>

      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-4">
          {intl.t("learnOriginOriginalLanguages")}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {LANG_KEYS.map((l) => (
            <div
              key={l.keyLang}
              className="p-4 bg-card border border-sage-dark/20 rounded-xl text-center"
            >
              <p className="font-bible-english text-2xl font-semibold text-foreground">{l.pct}</p>
              <p className="font-medium text-sm text-foreground mt-1">{intl.t(l.keyLang)}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {intl.t(l.keyNote)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-5">
          {intl.t("learnOriginTimeline")}
        </h2>
        <div className="relative">
          <div className="absolute left-[52px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {TIMELINE_KEYS.map((t) => {
              const year = intl.t(t.keyYear);
              return (
                <div key={t.keyYear} className="flex gap-4 items-start">
                  <span className="text-xs font-mono text-muted-foreground/70 w-14 shrink-0 pt-0.5 text-right">
                    {year}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-border border-2 border-background shrink-0 mt-1.5 z-10" />
                  <div className="flex-1 pb-1">
                    <p className="text-sm text-foreground leading-snug">{intl.t(t.keyEvent)}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{year}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showDeep && (
        <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl space-y-4 animate-in fade-in duration-300">
          <h2 className="font-bible-english text-xl font-semibold text-foreground">
            {intl.t("learnOriginReliableTitle")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {intl.t("learnOriginReliableP1")}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {intl.t("learnOriginReliableP2")}
          </p>
        </section>
      )}

      <section className="mb-14">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-4">
          {intl.t("learnOriginFAQTitle")}
        </h2>
        <LearnAccordion
          items={FAQ_KEYS.map((f) => ({
            term: intl.t(f.keyQ),
            def: intl.t(f.keyA),
          }))}
        />
      </section>
    </div>
  );
}
