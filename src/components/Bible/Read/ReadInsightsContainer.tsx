"use client";

import { useEffect, useState } from "react";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { getInsightsForChapter } from "@/app/actions/bible/insights";
import { ReadInsights } from "./ReadInsights";

/**
 * Fetches insight data for the current book/chapter and renders ReadInsights.
 * Lives in the shell so insight loading is outside ReadMain.
 */
export function ReadInsightsContainer() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const { focusMode, leftBook, leftChapter, insightOpen, setInsightOpen } = useRead();

  const [insightFromDb, setInsightFromDb] = useState<{
    context: string | null;
    explanation: string | null;
    reflections: string[];
  } | null>(null);
  const [insightFromAi, setInsightFromAi] = useState<{
    context: string | null;
    explanation: string | null;
    reflections: string[];
  } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightCache, setInsightCache] = useState<
    Record<
      string,
      {
        db: { context: string | null; explanation: string | null; reflections: string[] } | null;
        ai: { context: string | null; explanation: string | null; reflections: string[] } | null;
      }
    >
  >({});

  useEffect(() => {
    if (!insightOpen || !leftBook) return;

    const cacheKey = `${leftBook.id}:${leftChapter}:${globalLanguage}`;
    const cached = insightCache[cacheKey];

    if (cached) {
      setTimeout(() => {
        setInsightFromDb(cached.db);
        setInsightFromAi(cached.ai);
        setLoadingInsight(false);
      }, 0);
      return;
    }

    let cancelled = false;
    const tid = setTimeout(() => {
      if (!cancelled) setLoadingInsight(true);
    }, 0);

    getInsightsForChapter(leftBook.id, leftChapter, globalLanguage)
      .then(({ db, ai }) => {
        if (cancelled) return;
        const dbValue = db
          ? { context: db.context, explanation: db.explanation, reflections: db.reflections }
          : null;
        const aiValue = ai
          ? { context: ai.context, explanation: ai.explanation, reflections: ai.reflections }
          : null;

        setInsightFromDb(dbValue);
        setInsightFromAi(aiValue);

        setInsightCache((prev) => ({
          ...prev,
          [cacheKey]: { db: dbValue, ai: aiValue },
        }));
      })
      .finally(() => {
        if (!cancelled) setLoadingInsight(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [insightOpen, leftBook, leftChapter, globalLanguage, insightCache]);

  const john3Fallback =
    leftBook && leftBook.nameEn === "John" && leftChapter === 3
      ? {
          context:
            t("readInsightJohn3Context") ??
            "This conversation between Jesus and Nicodemus takes place early in Jesus' ministry and introduces the theme of spiritual rebirth.",
          explanation:
            t("readInsightJohn3Explanation") ??
            "Jesus explains that being \"born again\" is a spiritual transformation through the Spirit, not a physical rebirth. John 3:16 reveals God's love and the gift of eternal life through belief in Jesus.",
          reflections: [
            t("readInsightJohn3Reflection1") ??
              'What does "being born again" mean to you personally?',
            t("readInsightJohn3Reflection2") ??
              "How does the image of the wind help you understand spiritual transformation?",
          ],
        }
      : null;

  const currentInsight = insightFromDb ?? insightFromAi ?? john3Fallback;

  return (
    <ReadInsights
      insightOpen={insightOpen}
      focusMode={focusMode}
      leftBook={leftBook}
      leftChapter={leftChapter}
      loadingInsight={loadingInsight}
      currentInsight={currentInsight}
      t={t}
      onClose={() => setInsightOpen(false)}
    />
  );
}
