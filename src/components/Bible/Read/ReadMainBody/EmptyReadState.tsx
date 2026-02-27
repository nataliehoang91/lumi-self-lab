"use client";

import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

export function EmptyReadState() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  return (
    <div className="flex-1 flex items-center justify-center py-16 w-full">
      <div className="text-center text-muted-foreground space-y-2">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border">
          <span className="text-lg">📖</span>
        </div>
        <p className="text-sm font-medium">
          {t("readEmptyStateTitle") ?? "Select a translation above"}
        </p>
        <p className="text-xs">
          {t("readEmptyStateSubtitle") ?? "Choose one or two versions to compare."}
        </p>
      </div>
    </div>
  );
}
