"use client";

import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { BookOpenIcon } from "lucide-react";

export function EmptyReadState() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  return (
    <div className="flex flex-1 w-full min-h-[calc(100vh-20rem)] items-center justify-center py-16">
      <div className="text-center text-muted-foreground space-y-2">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border">
          <BookOpenIcon className="h-5 w-5" />
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
