"use client";

import Link from "next/link";
import {
  Flame, Sparkles, RefreshCcw, Droplets, Wind, Heart, Shield, CloudRain,
  Sun, Zap, User, Sunrise, Anchor, Home, Users, HeartHandshake, Baby,
  Compass, GitBranch, Lock, CheckCircle, Coins, Briefcase, Star, Gem,
  Target, ArrowDown, Music, Moon, Gift, BookOpen, Eye, Clock, Scale,
  Cloud, Infinity, ArrowUp, Crown, Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BibleTopic } from "@/lib/bible-topics-data";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Sparkles, RefreshCcw, Droplets, Wind, Heart, Shield, CloudRain,
  Sun, Zap, User, Sunrise, Anchor, Home, Users, HeartHandshake, Baby,
  Compass, GitBranch, Lock, CheckCircle, Coins, Briefcase, Star, Gem,
  Target, ArrowDown, Music, Moon, Gift, BookOpen, Eye, Clock, Scale,
  Cloud, Infinity, ArrowUp, Crown, Swords,
};

const CATEGORY_COLORS: Record<string, { bg: string; icon: string; border: string }> = {
  faith:         { bg: "bg-violet-50 dark:bg-violet-950/20",  icon: "text-violet-600 dark:text-violet-400",  border: "border-violet-200/60 dark:border-violet-800/30 hover:border-violet-400/60" },
  emotions:      { bg: "bg-rose-50 dark:bg-rose-950/20",      icon: "text-rose-600 dark:text-rose-400",      border: "border-rose-200/60 dark:border-rose-800/30 hover:border-rose-400/60" },
  relationships: { bg: "bg-pink-50 dark:bg-pink-950/20",      icon: "text-pink-600 dark:text-pink-400",      border: "border-pink-200/60 dark:border-pink-800/30 hover:border-pink-400/60" },
  guidance:      { bg: "bg-blue-50 dark:bg-blue-950/20",      icon: "text-blue-600 dark:text-blue-400",      border: "border-blue-200/60 dark:border-blue-800/30 hover:border-blue-400/60" },
  identity:      { bg: "bg-amber-50 dark:bg-amber-950/20",    icon: "text-amber-600 dark:text-amber-400",    border: "border-amber-200/60 dark:border-amber-800/30 hover:border-amber-400/60" },
  prayer:        { bg: "bg-indigo-50 dark:bg-indigo-950/20",  icon: "text-indigo-600 dark:text-indigo-400",  border: "border-indigo-200/60 dark:border-indigo-800/30 hover:border-indigo-400/60" },
  wisdom:        { bg: "bg-emerald-50 dark:bg-emerald-950/20",icon: "text-emerald-600 dark:text-emerald-400",border: "border-emerald-200/60 dark:border-emerald-800/30 hover:border-emerald-400/60" },
  eternity:      { bg: "bg-sky-50 dark:bg-sky-950/20",        icon: "text-sky-600 dark:text-sky-400",        border: "border-sky-200/60 dark:border-sky-800/30 hover:border-sky-400/60" },
};

interface TopicCardProps {
  topic: BibleTopic;
  segment: string;
}

export function TopicCard({ topic, segment }: TopicCardProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const isVi = segment === "vi";
  const colors = CATEGORY_COLORS[topic.category] ?? CATEGORY_COLORS.faith;
  const Icon = ICON_MAP[topic.icon] ?? Flame;
  const name = isVi ? topic.nameVi : topic.nameEn;
  const firstVerse = topic.verses[0];

  return (
    <Link
      href={`/bible/${segment}/topics/${topic.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:shadow-md",
        "bg-card",
        colors.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colors.bg)}>
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <span className={cn("text-muted-foreground/60 shrink-0 font-mono text-xs tabular-nums")}>
          {topic.verses.length} verses
        </span>
      </div>

      <div>
        <p className={cn("text-foreground font-semibold leading-snug", bodyClassUp, isVi && "font-vietnamese-flashcard")}>
          {name}
        </p>
        {firstVerse && (
          <p className={cn("text-muted-foreground mt-1.5 line-clamp-2 italic leading-relaxed", bodyClass, isVi && "font-vietnamese-flashcard")}>
            &ldquo;{isVi ? firstVerse.textVi : firstVerse.textEn}&rdquo;
          </p>
        )}
      </div>

      <p className={cn("text-muted-foreground/50 font-mono text-xs", isVi && "font-vietnamese-flashcard")}>
        {firstVerse?.ref}
      </p>
    </Link>
  );
}
