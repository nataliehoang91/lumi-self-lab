"use client";

import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadInsights } from "./ReadInsights";

/**
 * Temporary placeholder: no network fetch.
 * Always shows the \"coming soon\" message when insights are opened.
 */
export function ReadInsightsContainer() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const { focusMode, leftBook, leftChapter, insightOpen, setInsightOpen } = useRead();

  return (
    <ReadInsights
      insightOpen={insightOpen}
      focusMode={focusMode}
      leftBook={leftBook}
      leftChapter={leftChapter}
      loadingInsight={false}
      currentInsight={null}
      t={t}
      onClose={() => setInsightOpen(false)}
    />
  );
}
