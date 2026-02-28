"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const PROPHECY_KEYS = [
  {
    keyP: "learnJesusP1Prophecy" as const,
    keyRef: "learnJesusP1Ref" as const,
    keyFulfilled: "learnJesusP1Fulfilled" as const,
  },
  {
    keyP: "learnJesusP2Prophecy" as const,
    keyRef: "learnJesusP2Ref" as const,
    keyFulfilled: "learnJesusP2Fulfilled" as const,
  },
  {
    keyP: "learnJesusP3Prophecy" as const,
    keyRef: "learnJesusP3Ref" as const,
    keyFulfilled: "learnJesusP3Fulfilled" as const,
  },
  {
    keyP: "learnJesusP4Prophecy" as const,
    keyRef: "learnJesusP4Ref" as const,
    keyFulfilled: "learnJesusP4Fulfilled" as const,
  },
  {
    keyP: "learnJesusP5Prophecy" as const,
    keyRef: "learnJesusP5Ref" as const,
    keyFulfilled: "learnJesusP5Fulfilled" as const,
  },
  {
    keyP: "learnJesusP6Prophecy" as const,
    keyRef: "learnJesusP6Ref" as const,
    keyFulfilled: "learnJesusP6Fulfilled" as const,
  },
] as const;

function getJesusRichParams(intl: ReturnType<typeof getBibleIntl>) {
  const isVi = intl.locale === "vi";
  const jesus = isVi ? "Chúa Jêsus" : "Jesus";
  const he = isVi ? "Ngài" : "He";
  const him = isVi ? "Ngài" : "him";
  const his = isVi ? "Ngài" : "His";

  return {
    jesus: <strong>{jesus}</strong>,
    he: <strong>{he}</strong>,
    him: <strong>{him}</strong>,
    his: <strong>{his}</strong>,
  };
}

export default function WhoIsJesusPage() {
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
      <div className="mb-12">
        <p className="text-xs font-mono text-second mb-3">{intl.t("learnJesusModuleNum")}</p>

        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {intl.t("learnJesusTitle")}
        </h1>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          {intl.rich("learnJesusIntro1", getJesusRichParams(intl))}
        </p>

        <blockquote className="mt-3 pl-4 border-l-2 border-primary/40 not-italic">
          <p className="font-semibold text-foreground leading-relaxed">
            &ldquo;{intl.t("learnJesusIntro1Quote")}&rdquo;
          </p>
        </blockquote>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          {intl.rich("learnJesusIntro2", getJesusRichParams(intl))}
        </p>
      </div>

      {/* Fully God / Fully Man */}
      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-4">
          {intl.t("learnJesusFullyTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 bg-card border border-sage-dark/20 rounded-2xl">
            <p className="font-semibold text-foreground mb-2">{intl.t("learnJesusHumanTitle")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {intl.rich("learnJesusHumanBody", getJesusRichParams(intl))}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
              {intl.t("learnJesusHumanRef")}
            </p>
          </div>

          <div className="p-5 bg-card border border-sage-dark/20 rounded-2xl">
            <p className="font-semibold text-foreground mb-2">{intl.t("learnJesusDivineTitle")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {intl.rich("learnJesusDivineBody", getJesusRichParams(intl))}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
              {intl.t("learnJesusDivineRef")}
            </p>
          </div>
        </div>
      </section>

      {/* Cross */}
      <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          {intl.t("learnJesusCrossTitle")}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {intl.rich("learnJesusCrossP1", getJesusRichParams(intl))}
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {intl.rich("learnJesusCrossP2", getJesusRichParams(intl))}
        </p>

        <p className="text-xs font-mono text-muted-foreground/60 mt-4">
          {intl.t("learnJesusCrossRef")}
        </p>
      </section>

      {/* Prophecies */}
      <section className="mb-10">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-2">
          {intl.t("learnJesusProphecyTitle")}
        </h2>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {intl.rich("learnJesusProphecyIntro", getJesusRichParams(intl))}
        </p>

        <div className="space-y-2">
          {PROPHECY_KEYS.map((p) => (
            <div
              key={p.keyP}
              className="flex items-start gap-4 px-4 py-3 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0 mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{intl.t(p.keyP)}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5 font-mono">
                  {intl.t(p.keyRef)} → {intl.t(p.keyFulfilled)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section className="mb-10 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold mb-3">
          {intl.t("learnJesusWhyTitle")}
        </h2>

        <p className="text-sm leading-relaxed opacity-80">
          {intl.rich("learnJesusWhyP1", getJesusRichParams(intl))}
        </p>

        <p className="text-sm leading-relaxed opacity-80 mt-3">
          {intl.rich("learnJesusWhyP2", getJesusRichParams(intl))}
        </p>

        <Link
          href="/bible/read"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100 transition-opacity"
        >
          {intl.t("learnJesusReadGospels")} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
