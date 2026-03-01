"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

export function LearnOpenBibleCta() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  return (
    <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium" style={{ color: "oklch(0.75 0.008 85)" }}>
          {intl.t("learnCtaTitle")}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "oklch(0.5 0.008 85)" }}>
          {intl.t("learnCtaSubtitle")}
        </p>
      </div>
      <Link
        href={`/bible/${globalLanguage === "VI" ? "vi" : "en"}/read`}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap hover:opacity-90"
        style={{ background: "oklch(0.92 0.006 85)", color: "oklch(0.22 0.01 85)" }}
      >
        {intl.t("learnOpenBible")} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
