"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, BookMarked, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyVerse } from "../shared-components/DailyVerse";
import { FadeIn } from "../shared-components/FadeIn";
import { AnimatedStat } from "../shared-components/AnimatedStat";
import type { JourneyItem, NavLink, JourneyAccent } from "../shared-components/types";

const JOURNEY_STRIP_CLASS: Record<JourneyAccent, string> = {
  primary: "bg-primary/80",
  second: "bg-second/80",
  tertiary: "bg-tertiary/80",
  sage: "bg-sage/80",
  coral: "bg-coral/80",
};

const JOURNEY_ICON_CLASS: Record<JourneyAccent, string> = {
  primary: "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  second: "bg-second/20 text-second group-hover:bg-second group-hover:text-second-foreground",
  tertiary:
    "bg-tertiary/20 text-tertiary group-hover:bg-tertiary group-hover:text-tertiary-foreground",
  sage: "bg-sage/20 text-sage group-hover:bg-sage group-hover:text-sage-foreground",
  coral: "bg-coral/20 text-coral group-hover:bg-coral group-hover:text-coral-foreground",
};

const DAILY_VERSES = [
  { text: "Your word is a lamp to my feet and a light to my path.", ref: "Psalm 119:105" },
  { text: "Trust in the Lord with all your heart.", ref: "Proverbs 3:5" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
];

function getJourney(lang: string): JourneyItem[] {
  const base = `/bible/${lang}`;
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
      cta: { label: "Start Learning", href: `${base}/learn` },
      icon: BookOpen,
      accent: "primary",
    },
    {
      step: "02",
      label: "Read",
      headline: "Read Scripture with clarity.",
      body: "Side-by-side translations and a clean reading space designed for focus.",
      links: [{ label: "Split View", href: `${base}/read` }],
      cta: { label: "Open the Bible", href: `${base}/read` },
      icon: BookMarked,
      accent: "sage",
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
      accent: "coral",
    },
  ];
}

function getNavLinks(lang: string): NavLink[] {
  const base = `/bible/${lang}`;
  return [
    { label: "Learn", href: `${base}/learn` },
    { label: "Read", href: `${base}/read` },
    { label: "Flashcards", href: `${base}/flashcard` },
    { label: "Glossary", href: `${base}/glossary` },
  ];
}

export interface EnBibleLangPageProps {
  lang: string;
}

export function EnBibleLangPage({ lang }: EnBibleLangPageProps) {
  const today = new Date();
  const verseIdx = today.getDate() % DAILY_VERSES.length;
  const verse = DAILY_VERSES[verseIdx];
  const journey = getJourney(lang);
  const navLinks = getNavLinks(lang);
  const base = `/bible/${lang}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-border/30"
              style={{ top: `${(i + 1) * 14}%` }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-second/60 bg-second/10 text-xs font-medium text-second tracking-wide uppercase">
            A quiet, focused space to learn and read Scripture at your own pace.{" "}
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground leading-[1.05] tracking-tight text-balance">
            Know yourself.
            <br />
            <span className="text-primary">Know Scripture.</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed text-pretty">
            A calm space to learn and read the Bible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`${base}/learn`}
              className="px-7 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Start Here
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`${base}/read`}
              className="px-7 py-3.5 border border-second bg-transparent rounded-xl text-sm font-medium text-second hover:bg-second hover:text-second-foreground transition-colors"
            >
              Open Bible
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-20 w-full max-w-2xl mx-auto">
          <DailyVerse
            label="Verse of the Day"
            text={verse.text}
            verseRef={verse.ref}
            readHref={`${base}/read`}
            readLabel="Read in context"
          />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-foreground/40 animate-pulse" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <AnimatedStat value="66" label="Books" accent="primary" />
          <AnimatedStat value="1,189" label="Chapters" accent="second" />
          <AnimatedStat value="3,000+" label="Languages" accent="tertiary" />
          <AnimatedStat value="1" label="Unified Story" accent="sage" />{" "}
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Your Journey
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-balance leading-tight max-w-xl">
                From first questions to deeper faith.{" "}
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {journey.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.step} delay={i * 80}>
                  <div className="group relative border border-border hover:border-foreground/40 rounded-2xl p-6 md:p-8 bg-card hover:shadow-md transition-all overflow-hidden">
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                        JOURNEY_STRIP_CLASS[item.accent]
                      )}
                    />
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex items-center gap-4 md:w-48 shrink-0">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            JOURNEY_ICON_CLASS[item.accent]
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-muted-foreground/60">{item.step}</p>
                          <p className="font-semibold text-foreground">{item.label}</p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground mb-1">{item.headline}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.links.map((l) => (
                            <Link
                              key={l.href}
                              href={l.href}
                              className="px-3 py-1 text-xs border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Link
                          href={item.cta.href}
                          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                          {item.cta.label}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground leading-tight text-balance">
              Start where you are.{" "}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty">
              Whether you are just beginning or have been reading for years, there is always more to
              explore.{" "}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`${base}/learn`}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                I&apos;m new here <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`${base}/read`}
                className="px-8 py-4 border border-second bg-transparent rounded-xl text-base font-medium text-second hover:bg-second hover:text-second-foreground transition-colors"
              >
                Take me to the Bible
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-serif font-semibold text-foreground text-lg">SelfWithin</p>
            <p className="text-sm text-muted-foreground mt-1">A quiet place to know God.</p>
          </div>
          <nav className="grid grid-cols-2 md:flex gap-x-10 gap-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border/40 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} A quiet place to read Scripture.
          </p>
        </div>
      </footer>
    </div>
  );
}
