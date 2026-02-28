"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronRight, ChevronDown } from "lucide-react";
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

function GlossaryItem({
  term,
  def,
}: {
  term: string;
  def: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left border border-sage-dark/20 rounded-xl overflow-hidden transition-all hover:border-foreground/30"
    >
      <div className="flex items-center justify-between px-5 py-3.5">
        <span className="font-medium text-foreground text-sm">{term}</span>
        <ChevronDown
          className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </div>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
          {def}
        </div>
      )}
    </button>
  );
}

export default function BibleStructurePage() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

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
        <p className="text-xs font-mono text-second mb-3">{intl.t("learnStructModuleNum")}</p>
        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {intl.t("learnModule1Title")}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {intl.t("learnStructIntro1")}
          <strong className="font-semibold text-foreground">{intl.t("learnStructIntro66")}</strong>
          {intl.t("learnStructIntro2")}
          <strong className="font-semibold text-foreground">{intl.t("learnStructIntro1500")}</strong>
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
            <p className="font-bible-english text-3xl font-semibold text-foreground">{s.v}</p>
            <p className="text-xs text-muted-foreground mt-1">{intl.t(s.keyLabel)}</p>
          </div>
        ))}
      </div>

      {/* OT */}
      <section className="mb-12">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          {intl.t("learnStructOTTitle")}
        </h2>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {intl.t("learnStructOTIntro")}
        </p>
        <div className="space-y-2">
          {OT_SECTION_KEYS.map((s) => (
            <div
              key={s.keyName}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-light/20 flex items-center justify-center shrink-0 text-sm font-semibold text-second font-mono">
                {s.books}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">{intl.t(s.keyName)}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
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
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {intl.t("learnStructNTIntro")}
        </p>
        <div className="space-y-2">
          {NT_SECTION_KEYS.map((s) => (
            <div
              key={s.keyName}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-light/20 flex items-center justify-center shrink-0 text-sm font-semibold text-second font-mono">
                {s.books}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">{intl.t(s.keyName)}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {intl.t(s.keyDesc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Central theme */}
      <section className="mb-12 p-6 border border-sage-dark/20 rounded-2xl bg-primary-light/10">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          {intl.t("learnStructCentralTitle")}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {intl.t("learnStructCentralBody")}
        </p>
      </section>

      {/* Glossary */}
      <section className="mb-14">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-4">
          {intl.t("learnStructGlossaryTitle")}
        </h2>
        <div className="space-y-2">
          {GLOSSARY_KEYS.map((g) => (
            <GlossaryItem
              key={g.keyTerm}
              term={intl.t(g.keyTerm)}
              def={intl.t(g.keyDef)}
            />
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-sage-dark/20">
        <Link
          href="/bible/learn"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180 shrink-0" />
          {intl.t("learnStructureAllLessons")}
        </Link>
        <Link
          href="/bible/learn/bible-origin"
          className="flex items-center gap-2 px-5 py-2.5 bg-second-dark text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {intl.t("learnStructureNextOrigin")}
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
