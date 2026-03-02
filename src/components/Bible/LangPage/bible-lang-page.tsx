"use client";

import { DailyVerse } from "./shared-components/DailyVerse";
import { LangPageHero } from "./shared-components/LangPageHero";
import { LangPageStats } from "./shared-components/LangPageStats";
import { LangPageJourney } from "./shared-components/LangPageJourney";
import { LangPageCtaBanner } from "./shared-components/LangPageCtaBanner";
import { LangPageFooter } from "./shared-components/LangPageFooter";
import type { JourneyItem, NavLink } from "./shared-components/types";
import type { StatAccent } from "./shared-components/AnimatedStat";
import { getBibleIntlByLocale, type BibleLocale } from "@/lib/bible-intl";
import { BookOpen, BookMarked, Sparkles } from "lucide-react";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

const VERSE_KEYS = [
  { text: "langPageVerse1Text" as const, ref: "langPageVerse1Ref" as const },
  { text: "langPageVerse2Text" as const, ref: "langPageVerse2Ref" as const },
  { text: "langPageVerse3Text" as const, ref: "langPageVerse3Ref" as const },
] as const;

function getJourney(lang: BibleLocale, base: string, t: (k: string) => string): JourneyItem[] {
  return [
    {
      step: "01",
      label: t("langPageJ1Label"),
      headline: t("langPageJ1Headline"),
      body: t("langPageJ1Body"),
      links: [
        { label: t("langPageJ1Link1"), href: `${base}/learn/bible-structure` },
        { label: t("langPageJ1Link2"), href: `${base}/learn/bible-origin` },
        { label: t("langPageJ1Link3"), href: `${base}/learn/who-is-jesus` },
        { label: t("langPageJ1Link4"), href: `${base}/learn/what-is-faith` },
      ],
      cta: { label: t("langPageJ1Cta"), href: `${base}/learn` },
      icon: BookOpen,
      accent: "primary",
    },
    {
      step: "02",
      label: t("langPageJ2Label"),
      headline: t("langPageJ2Headline"),
      body: t("langPageJ2Body"),
      links: [{ label: t("langPageJ2Link1"), href: `${base}/read` }],
      cta: { label: t("langPageJ2Cta"), href: `${base}/read` },
      icon: BookMarked,
      accent: "sage",
    },
    {
      step: "03",
      label: t("langPageJ3Label"),
      headline: t("langPageJ3Headline"),
      body: t("langPageJ3Body"),
      links: [
        { label: t("langPageJ3Link1"), href: `${base}/flashcard` },
        { label: t("langPageJ3Link2"), href: `${base}/glossary` },
      ],
      cta: { label: t("langPageJ3Cta"), href: `${base}/flashcard` },
      icon: Sparkles,
      accent: "coral",
    },
  ];
}

function getNavLinks(base: string, t: (k: string) => string): NavLink[] {
  return [
    { label: t("langPageNavLearn"), href: `${base}/learn` },
    { label: t("langPageNavRead"), href: `${base}/read` },
    { label: t("langPageNavFlashcards"), href: `${base}/flashcard` },
    { label: t("langPageNavGlossary"), href: `${base}/glossary` },
  ];
}

export interface BibleLangPageProps {
  lang: string;
}

export function BibleLangPage({ lang }: BibleLangPageProps) {
  const locale: BibleLocale = lang === "vi" ? "vi" : lang === "zh" ? "zh" : "en";
  const intl = getBibleIntlByLocale(locale);
  const t = intl.t;
  const { subBodyClass, verseClass, bodyClass } = useLearnFontClasses();

  const base = `/bible/${lang}`;
  const journey = getJourney(locale, base, t);
  const navLinks = getNavLinks(base, t);

  const verseIdx = new Date().getDate() % VERSE_KEYS.length;
  const verseKey = VERSE_KEYS[verseIdx];
  const verse = { text: t(verseKey.text), ref: t(verseKey.ref) };

  const stats: { value: string; label: string; accent: StatAccent }[] = [
    { value: "66", label: t("langPageStatBooks"), accent: "primary" },
    { value: "1,189", label: t("langPageStatChapters"), accent: "second" },
    { value: "3,000+", label: t("langPageStatLanguages"), accent: "tertiary" },
    { value: "1", label: t("langPageStatStory"), accent: "sage" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LangPageHero
        eyebrow={t("langPageHeroEyebrow")}
        title1={t("langPageHeroTitle1")}
        title2={t("langPageHeroTitle2")}
        subtitle={t("langPageHeroSubtitle")}
        ctaStartLabel={t("langPageCtaStart")}
        ctaBibleLabel={t("langPageCtaBible")}
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      >
        <div className="relative z-10 mt-20 w-full max-w-2xl mx-auto">
          <DailyVerse
            label={t("langPageVerseOfDay")}
            text={verse.text}
            verseRef={verse.ref}
            readHref={`${base}/read`}
            readLabel={t("langPageReadInContext")}
            labelClassName={subBodyClass}
            quoteClassName={verseClass}
            refClassName={bodyClass}
            linkClassName={bodyClass}
          />
        </div>
      </LangPageHero>

      <LangPageStats stats={stats} />

      <LangPageJourney
        title={t("langPageJourneyTitle")}
        subtitle={t("langPageJourneySubtitle")}
        items={journey}
      />

      <LangPageCtaBanner
        title={t("langPageBannerTitle")}
        paragraph={t("langPageBannerParagraph")}
        newLabel={t("langPageBannerNew")}
        bibleLabel={t("langPageBannerBible")}
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      />

      <LangPageFooter
        tagline={t("langPageFooterTagline")}
        copyright={t("langPageFooterCopyright")}
        navLinks={navLinks}
      />
    </div>
  );
}
