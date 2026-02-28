"use client";

import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const OT_SECTION_KEYS = [
  { keyName: "learnStructOTLaw" as const, keyDesc: "learnStructOTLawDesc" as const, books: 5 },
  {
    keyName: "learnStructOTHistory" as const,
    keyDesc: "learnStructOTHistoryDesc" as const,
    books: 12,
  },
  {
    keyName: "learnStructOTPoetry" as const,
    keyDesc: "learnStructOTPoetryDesc" as const,
    books: 5,
  },
  {
    keyName: "learnStructOTProphets" as const,
    keyDesc: "learnStructOTProphetsDesc" as const,
    books: 17,
  },
] as const;

const NT_SECTION_KEYS = [
  {
    keyName: "learnStructNTGospels" as const,
    keyDesc: "learnStructNTGospelsDesc" as const,
    books: 4,
  },
  {
    keyName: "learnStructNTHistory" as const,
    keyDesc: "learnStructNTHistoryDesc" as const,
    books: 1,
  },
  {
    keyName: "learnStructNTLetters" as const,
    keyDesc: "learnStructNTLettersDesc" as const,
    books: 21,
  },
  {
    keyName: "learnStructNTProphecy" as const,
    keyDesc: "learnStructNTProphecyDesc" as const,
    books: 1,
  },
] as const;

const GLOSSARY_KEYS = [
  { keyTerm: "learnStructGlossCovenant" as const, keyDef: "learnStructGlossCovenantDef" as const },
  { keyTerm: "learnStructGlossGospel" as const, keyDef: "learnStructGlossGospelDef" as const },
  { keyTerm: "learnStructGlossProphet" as const, keyDef: "learnStructGlossProphetDef" as const },
  { keyTerm: "learnStructGlossGrace" as const, keyDef: "learnStructGlossGraceDef" as const },
] as const;

const STAT_KEYS = [
  { v: "66", keyLabel: "learnStructStatBooks" as const },
  { v: "39", keyLabel: "learnStructStatOT" as const },
  { v: "27", keyLabel: "learnStructStatNT" as const },
  { v: "~40", keyLabel: "learnStructStatAuthors" as const },
] as const;

export default function BibleStructurePage() {
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

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-mono text-second mb-3">{intl.t("learnStructModuleNum")}</p>
        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {intl.t("learnModule1Title")}
        </h1>
        <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>
          {intl.t("learnStructIntro1")}
          <strong className="font-semibold text-foreground">{intl.t("learnStructIntro66")}</strong>
          {intl.t("learnStructIntro2")}
          <strong className="font-semibold text-foreground">
            {intl.t("learnStructIntro1500")}
          </strong>
          {intl.t("learnStructIntro3")}
          <strong className="font-semibold text-foreground">{intl.t("learnStructIntro40")}</strong>
          {intl.t("learnStructIntro4")}
        </p>
      </div>

      {/* At a glance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {STAT_KEYS.map((s) => (
          <div
            key={s.keyLabel}
            className="bg-card border border-sage-dark/20 rounded-xl px-4 py-4 text-center"
          >
            <p className="font-bible-english text-3xl font-semibold text-primary-dark">{s.v}</p>
            <p className={cn("font-semibold mt-1", bodyClass)}>{intl.t(s.keyLabel)}</p>
          </div>
        ))}
      </div>

      {/* OT */}
      <section className="mb-12">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          {intl.t("learnStructOTTitle")}
        </h2>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>
          {intl.t("learnStructOTIntro")}
        </p>
        <div className="space-y-2">
          {OT_SECTION_KEYS.map((s) => (
            <div
              key={s.keyName}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-second/30 flex items-center justify-center shrink-0 text-sm font-semibold font-mono">
                {s.books}
              </div>
              <div className="min-w-0">
                <p className={cn("font-medium text-foreground", bodyClass)}>
                  {intl.t(s.keyName)}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                  {intl.t(s.keyDesc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NT */}
      <section className="mb-12">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          {intl.t("learnStructNTTitle")}
        </h2>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>
          {intl.t("learnStructNTIntro")}
        </p>
        <div className="space-y-2">
          {NT_SECTION_KEYS.map((s) => (
            <div
              key={s.keyName}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-second/30 flex items-center justify-center shrink-0 text-sm font-semibold font-mono">
                {s.books}
              </div>
              <div className="min-w-0">
                <p className={cn("font-medium text-foreground", bodyClass)}>
                  {intl.t(s.keyName)}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                  {intl.t(s.keyDesc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Central theme */}
      <section className="mb-12 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-xl">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          {intl.t("learnStructCentralTitle")}
        </h2>
        <p className={cn("leading-relaxed", bodyClass)}>{intl.t("learnStructCentralBody")}</p>
      </section>

      {/* Glossary */}
      <section className="mb-14">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-4">
          {intl.t("learnStructGlossaryTitle")}
        </h2>
        <LearnAccordion
          items={GLOSSARY_KEYS.map((g) => ({
            term: intl.t(g.keyTerm),
            def: intl.t(g.keyDef),
          }))}
        />
      </section>
    </div>
  );
}
