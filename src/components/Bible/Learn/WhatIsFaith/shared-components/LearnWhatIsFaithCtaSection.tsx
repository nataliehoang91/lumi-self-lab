"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsFaithCtaSectionProps {
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ctaHref?: string;
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsFaithCtaSection({
  ctaTitle,
  ctaBody,
  ctaButton,
  ctaHref = "/bible/plans",
  bodyBright,
}: LearnWhatIsFaithCtaSectionProps) {
  const { bodyClass } = useBibleFontClasses();
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <section
      className="bg-card border-sage-dark/20 mb-8 space-y-3 rounded-2xl border p-6"
    >
      <p className="text-foreground font-semibold">{ctaTitle}</p>
      <p className={cn(bodyColor, bodyClass)}>{ctaBody}</p>
      <Link
        href={ctaHref}
        className="bg-foreground text-background inline-flex items-center gap-2
            rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity
            hover:opacity-90"
      >
        {ctaButton} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
