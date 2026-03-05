"use client";

import { BookOpen, BookMarked, Sparkles, BookPlus } from "lucide-react";
import { DailyVerse } from "../shared-components/DailyVerse";
import { LangPageHero } from "../shared-components/LangPageHero";
import { LangPageStats } from "../shared-components/LangPageStats";
import { LangPageJourney } from "../shared-components/LangPageJourney";
import { LangPageCtaBanner } from "../shared-components/LangPageCtaBanner";
import { LangPageFooter } from "../shared-components/LangPageFooter";
import type { JourneyItem, NavLink } from "../shared-components/types";
import type { StatAccent } from "../shared-components/AnimatedStat";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import type { BibleBook } from "@/components/Bible/Read/types";

function buildReadHrefEn(
  bookId: string | null,
  chapter: number,
  verse: number,
  testament: "ot" | "nt"
): string {
  if (!bookId) return "#";
  const sp = new URLSearchParams();
  sp.set("version1", "niv");
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));
  return `/bible/en/read?${sp.toString()}`;
}

function findBookIdByEn(books: BibleBook[] | undefined, nameEn: string): string | null {
  if (!books?.length) return null;
  const book = books.find((b) => b.nameEn === nameEn);
  return book?.id ?? null;
}

const DAILY_VERSES_EN = [
  {
    text: "Your word is a lamp to my feet and a light to my path.",
    ref: "Psalm 119:105",
    bookEn: "Psalms",
    chapter: 119,
    verse: 105,
    testament: "ot" as const,
  },
  {
    text: "Trust in the Lord with all your heart.",
    ref: "Proverbs 3:5",
    bookEn: "Proverbs",
    chapter: 3,
    verse: 5,
    testament: "ot" as const,
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    ref: "Philippians 4:13",
    bookEn: "Philippians",
    chapter: 4,
    verse: 13,
    testament: "nt" as const,
  },
];

function getJourneyEn(base: string): JourneyItem[] {
  return [
    {
      step: "01",
      label: "Learn",
      headline: "Begin with the foundations.",
      body: "Explore what the Bible is, who Jesus is, and what faith means — before you start reading.",
      links: [
        { label: "Bible Structure", href: `${base}/learn/bible-structure` },
        { label: "Bible Origin", href: `${base}/learn/bible-origin` },
        { label: "Who is Jesus?", href: `${base}/learn/who-is-jesus` },
        { label: "What is Faith?", href: `${base}/learn/what-is-faith` },
      ],
      cta: { label: "Start Exploring", href: `${base}/learn` },
      icon: BookOpen,
      accent: "coral",
    },
    {
      step: "02",
      label: "Read",
      headline: "Read Scripture with clarity.",
      body: "Side-by-side translations and a clean reading space designed for focus.",
      links: [{ label: "Split View", href: `${base}/read` }],
      cta: { label: "Open the Bible", href: `${base}/read` },
      icon: BookPlus,
      accent: "gray",
    },
    {
      step: "03",
      label: "Remember",
      headline: "Reflect and remember.",
      body: "Use flashcards and the glossary to deepen your understanding and retain what you read.",
      links: [
        { label: "Flashcards", href: `${base}/flashcard` },
        { label: "Glossary", href: `${base}/glossary` },
      ],
      cta: { label: "Open Flashcards", href: `${base}/flashcard` },
      icon: Sparkles,
      accent: "sage",
    },
  ];
}

function getNavLinksEn(base: string): NavLink[] {
  return [
    { label: "Learn", href: `${base}/learn` },
    { label: "Read", href: `${base}/read` },
    { label: "Flashcards", href: `${base}/flashcard` },
    { label: "Glossary", href: `${base}/glossary` },
  ];
}

export interface EnBibleLangPageProps {
  lang: string;
  books: BibleBook[];
}

export function EnBibleLangPage({ lang, books }: EnBibleLangPageProps) {
  const base = `/bible/${lang}`;
  const { subBodyClass, verseClass, bodyClass } = useBibleFontClasses();

  const verseIdx = new Date().getDate() % DAILY_VERSES_EN.length;
  const verse = DAILY_VERSES_EN[verseIdx];
  const verseRefHref = buildReadHrefEn(
    findBookIdByEn(books, verse.bookEn),
    verse.chapter,
    verse.verse,
    verse.testament
  );
  const journey = getJourneyEn(base);
  const navLinks = getNavLinksEn(base);

  return (
    <div className="bg-body text-foreground min-h-screen font-sans">
      <LangPageHero
        eyebrow="A quiet, focused space to learn and read Scripture at your own pace."
        title1="Know yourself."
        title2="Know Scripture."
        subtitle="A calm space to understand and read the Bible."
        ctaStartLabel="Start Here"
        ctaBibleLabel="Open Bible"
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      >
        <div className="max-w-2x relative z-10 mx-auto mt-20">
          <DailyVerse
            label="Verse of the Day"
            text={verse.text}
            verseRef={verse.ref}
            verseRefHref={verseRefHref}
            readHref={`${base}/read`}
            readLabel="Read in context"
            labelClassName={subBodyClass}
            quoteClassName={verseClass}
            refClassName={bodyClass}
            linkClassName={bodyClass}
          />
        </div>
      </LangPageHero>

      {/* <LangPageStats stats={stats} /> */}

      <LangPageJourney
        title="Your Journey"
        subtitle="From first questions to deeper faith."
        items={journey}
      />

      <LangPageCtaBanner
        title="Start where you are."
        paragraph="Whether you are just beginning or have been reading for years, there is always more to explore."
        newLabel="I'm new here"
        bibleLabel="Take me to the Bible"
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      />

      <LangPageFooter
        tagline="A quiet place to know God."
        copyright="A quiet place to read Scripture."
        navLinks={navLinks}
      />
    </div>
  );
}
