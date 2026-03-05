"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

export function LearnOpenBibleCta() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  return (
    <div
      className="flex flex-col justify-between gap-4 px-8 py-6 sm:flex-row
        sm:items-center"
    >
      <div>
        <p className="text-sm font-medium" style={{ color: "oklch(0.75 0.008 85)" }}>
          {intl.t("learnCtaTitle")}
        </p>
        <p className="mt-0.5 text-sm" style={{ color: "oklch(0.5 0.008 85)" }}>
          {intl.t("learnCtaSubtitle")}
        </p>
      </div>
      <Link
        href={`/bible/${globalLanguage === "VI" ? "vi" : "en"}/read`}
        className="group flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm
          font-semibold whitespace-nowrap transition-all hover:opacity-90"
        style={{ background: "oklch(0.92 0.006 85)", color: "oklch(0.22 0.01 85)" }}
      >
        {intl.t("learnOpenBible")}{" "}
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200
            group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  );
}
