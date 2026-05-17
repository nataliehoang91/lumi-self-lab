"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import type { BibleTopic, TopicCategory } from "@/lib/bible-topics-data";
import { TOPIC_CATEGORIES } from "@/lib/bible-topics-data";
import { TopicCard } from "./TopicCard";

const ALL_KEY = "all";

interface TopicsIndexClientProps {
  topics: BibleTopic[];
  segment: string;
}

export function TopicsIndexClient({ topics, segment }: TopicsIndexClientProps) {
  const isVi = segment === "vi";
  const { h1Class, bodyClass, bodyClassUp, subtitleClass } = useBibleFontClasses();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<TopicCategory | typeof ALL_KEY>(
    ALL_KEY
  );

  const filtered = topics.filter((t) => {
    const name = isVi ? t.nameVi : t.nameEn;
    const matchesSearch =
      search === "" || name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === ALL_KEY || t.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Object.entries(TOPIC_CATEGORIES) as [
    TopicCategory,
    { labelEn: string; labelVi: string },
  ][];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 max-w-2xl"
      >
        <div
          className="bg-second/10 theme-warm:bg-second/15 mb-4 inline-flex items-center
            rounded-full px-3 py-1"
        >
          <span
            className={cn(
              "text-second font-mono font-semibold tracking-widest uppercase",
              bodyClass,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {isVi ? "Chủ đề Kinh Thánh" : "Bible Topics"}
          </span>
        </div>
        <h1
          className={cn(
            "text-foreground font-serif leading-tight font-semibold",
            h1Class,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi ? "Kinh Thánh nói gì?" : "What does the Bible say?"}
        </h1>
        <p
          className={cn(
            "text-muted-foreground mt-4 leading-relaxed",
            subtitleClass,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi
            ? "Khám phá những gì Kinh Thánh dạy về các chủ đề trong cuộc sống — từ đức tin, cảm xúc, đến các mối quan hệ và ý nghĩa sống."
            : "Explore what the Bible teaches about life's most important topics — faith, emotions, relationships, and purpose."}
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
            -translate-y-1/2"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isVi ? "Tìm chủ đề..." : "Search topics..."}
          className={cn(
            `border-border bg-card text-foreground placeholder:text-muted-foreground/50
            focus:ring-second/30 w-full rounded-xl border py-2.5 pr-4 pl-9
            transition-shadow outline-none focus:ring-2`,
            bodyClass,
            isVi && "font-vietnamese-flashcard"
          )}
        />
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(ALL_KEY)}
          className={cn(
            "rounded-full border px-4 py-1.5 transition-all",
            bodyClass,
            isVi && "font-vietnamese-flashcard",
            activeCategory === ALL_KEY
              ? "border-second bg-second/10 text-second font-semibold"
              : "border-border text-muted-foreground hover:border-second/50"
          )}
        >
          {isVi ? "Tất cả" : "All"}
        </button>
        {categories.map(([key, labels]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              "rounded-full border px-4 py-1.5 transition-all",
              bodyClass,
              isVi && "font-vietnamese-flashcard",
              activeCategory === key
                ? "border-second bg-second/10 text-second font-semibold"
                : "border-border text-muted-foreground hover:border-second/50"
            )}
          >
            {isVi ? labels.labelVi : labels.labelEn}
          </button>
        ))}
      </div>

      {/* Count */}
      <p
        className={cn(
          "text-muted-foreground mb-6",
          bodyClass,
          isVi && "font-vietnamese-flashcard"
        )}
      >
        {filtered.length} {isVi ? "chủ đề" : "topics"}
        {activeCategory !== ALL_KEY &&
          ` · ${isVi ? TOPIC_CATEGORIES[activeCategory].labelVi : TOPIC_CATEGORIES[activeCategory].labelEn}`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic, i) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.6) }}
            >
              <TopicCard topic={topic} segment={segment} />
            </motion.div>
          ))}
        </div>
      ) : (
        <p
          className={cn(
            "text-muted-foreground py-12 text-center",
            bodyClassUp,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi ? "Không tìm thấy chủ đề nào." : "No topics found."}
        </p>
      )}
    </div>
  );
}
