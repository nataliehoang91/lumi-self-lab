"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import {
  Flame, Sparkles, RefreshCcw, Droplets, Wind, Heart, Shield, CloudRain,
  Sun, Zap, User, Sunrise, Anchor, Home, Users, HeartHandshake, Baby,
  Compass, GitBranch, Lock, CheckCircle, Coins, Briefcase, Star, Gem,
  Target, ArrowDown, Music, Moon, Gift, Eye, Clock, Scale,
  Cloud, Infinity, ArrowUp, Crown, Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { trackTopicView } from "./useRecentTopics";
import type { BibleTopic } from "@/lib/bible-topics-data";
import { TOPIC_CATEGORIES } from "@/lib/bible-topics-data";
import type { TopicVerseText } from "@/app/actions/bible/topic-verses";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Sparkles, RefreshCcw, Droplets, Wind, Heart, Shield, CloudRain,
  Sun, Zap, User, Sunrise, Anchor, Home, Users, HeartHandshake, Baby,
  Compass, GitBranch, Lock, CheckCircle, Coins, Briefcase, Star, Gem,
  Target, ArrowDown, Music, Moon, Gift, BookOpen, Eye, Clock, Scale,
  Cloud, Infinity, ArrowUp, Crown, Swords,
};

const CATEGORY_COLORS: Record<string, { bg: string; icon: string; pill: string }> = {
  faith:         { bg: "bg-violet-50 dark:bg-violet-950/20",  icon: "text-violet-600 dark:text-violet-400",  pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  emotions:      { bg: "bg-rose-50 dark:bg-rose-950/20",      icon: "text-rose-600 dark:text-rose-400",      pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  relationships: { bg: "bg-pink-50 dark:bg-pink-950/20",      icon: "text-pink-600 dark:text-pink-400",      pill: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
  guidance:      { bg: "bg-blue-50 dark:bg-blue-950/20",      icon: "text-blue-600 dark:text-blue-400",      pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  identity:      { bg: "bg-amber-50 dark:bg-amber-950/20",    icon: "text-amber-600 dark:text-amber-400",    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  prayer:        { bg: "bg-indigo-50 dark:bg-indigo-950/20",  icon: "text-indigo-600 dark:text-indigo-400",  pill: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
  wisdom:        { bg: "bg-emerald-50 dark:bg-emerald-950/20",icon: "text-emerald-600 dark:text-emerald-400",pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  eternity:      { bg: "bg-sky-50 dark:bg-sky-950/20",        icon: "text-sky-600 dark:text-sky-400",        pill: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
};

interface TopicDetailClientProps {
  topic: BibleTopic;
  segment: string;
  relatedTopics: BibleTopic[];
  verseTextMap?: Record<string, TopicVerseText>;
}

export function TopicDetailClient({ topic, segment, relatedTopics, verseTextMap = {} }: TopicDetailClientProps) {
  const isVi = segment === "vi";
  const { h1Class, bodyClass, bodyClassUp, bodyTitleClassUp } = useBibleFontClasses();

  useEffect(() => { trackTopicView(topic.slug); }, [topic.slug]);
  const colors = CATEGORY_COLORS[topic.category] ?? CATEGORY_COLORS.faith;
  const Icon = ICON_MAP[topic.icon] ?? Flame;
  const name = isVi ? topic.nameVi : topic.nameEn;
  const intro = isVi ? topic.introVi : topic.introEn;
  const categoryLabel = isVi
    ? TOPIC_CATEGORIES[topic.category].labelVi
    : TOPIC_CATEGORIES[topic.category].labelEn;

  return (
    <article>
      {/* Back link */}
      <Link
        href={`/bible/${segment}/topics`}
        className={cn("text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 transition-colors", bodyClass)}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {isVi ? "Tất cả chủ đề" : "All Topics"}
      </Link>

      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", colors.bg)}>
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide", colors.pill)}>
            {categoryLabel}
          </span>
        </div>
        <h1 className={cn("text-foreground font-serif font-semibold leading-tight", h1Class, isVi && "font-vietnamese-flashcard")}>
          {name}
        </h1>
        {intro && (
          <p className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClassUp, isVi && "font-vietnamese-flashcard")}>
            {intro}
          </p>
        )}
      </div>

      {/* Verses */}
      <div className="space-y-4">
        {topic.verses.map((v, i) => {
          const dbKey = `${v.bookSlug}-${v.chapter}-${v.verse}`;
          const dbVerse = verseTextMap[dbKey];

          // Use real DB text if available, fall back to generated
          const text = isVi
            ? (dbVerse?.textVi ?? v.textVi)
            : (dbVerse?.textEn ?? v.textEn);

          // Build ref display — use VI book name in VI mode if available
          const bookDisplayName = isVi
            ? (dbVerse?.bookNameVi ?? v.ref.split(" ").slice(0, -1).join(" "))
            : (dbVerse?.bookNameEn ?? v.ref.split(" ").slice(0, -1).join(" "));
          const displayRef = `${bookDisplayName} ${v.chapter}:${v.verse}`;

          const note = isVi ? v.noteVi : v.noteEn;
          const explanation = isVi ? v.explanationVi : v.explanationEn;
          // book1 param must be a DB bookId (cuid), not a slug
          const bookIdParam = dbVerse?.bookId ?? v.bookSlug;
          const readHref = `/bible/${segment}/read?book1=${bookIdParam}&chapter1=${v.chapter}&verse1=${v.verse}&version1=${isVi ? "vi" : "niv"}`;

          return (
            <div
              key={`${v.ref}-${i}`}
              className="bg-card border-border group overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
            >
              {/* Number + ref header */}
              <div className="border-border/50 bg-muted/30 flex items-center justify-between border-b px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold",
                    "bg-second/10 text-second"
                  )}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={readHref}
                    className={cn(
                      "text-muted-foreground hover:text-second font-mono text-sm font-medium transition-colors",
                      isVi && "font-vietnamese-flashcard"
                    )}
                  >
                    {displayRef}
                  </Link>
                </div>
                <Link
                  href={readHref}
                  className={cn(
                    "text-second hover:text-second/80 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 transition-colors",
                    isVi && "font-vietnamese-flashcard"
                  )}
                >
                  <BookOpen className="h-3 w-3" />
                  {isVi ? "Đọc" : "Read"}
                </Link>
              </div>

              {/* Verse text */}
              <div className="px-5 py-4">
                <p className={cn(
                  "text-foreground font-medium italic leading-relaxed",
                  bodyClassUp,
                  isVi ? "font-vietnamese" : "font-serif"
                )}>
                  &ldquo;{text}&rdquo;
                </p>
                {explanation ? (
                  <p className={cn("text-muted-foreground mt-3 leading-relaxed", bodyClass, isVi && "font-vietnamese-flashcard")}>
                    {explanation}
                  </p>
                ) : note ? (
                  <p className={cn("text-muted-foreground mt-3 leading-relaxed", bodyClass, isVi && "font-vietnamese-flashcard")}>
                    {note}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Related topics */}
      {relatedTopics.length > 0 && (
        <section className="mt-12">
          <h2 className={cn("text-foreground mb-4 font-semibold", bodyTitleClassUp, isVi && "font-vietnamese-flashcard")}>
            {isVi ? "Chủ đề liên quan" : "Related Topics"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/bible/${segment}/topics/${t.slug}`}
                className={cn(
                  "border-border hover:border-second/50 hover:text-second inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 transition-all",
                  bodyClass,
                  isVi && "font-vietnamese-flashcard"
                )}
              >
                {isVi ? t.nameVi : t.nameEn}
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
