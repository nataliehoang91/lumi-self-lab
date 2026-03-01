"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LearnWhyCtaSectionProps {
  title: string;
  paragraph1: ReactNode;
  paragraph2: ReactNode;
  linkHref: string;
  linkLabel: string;
  bodyClassName?: string;
}

export function LearnWhyCtaSection({
  title,
  paragraph1,
  paragraph2,
  linkHref,
  linkLabel,
  bodyClassName,
}: LearnWhyCtaSectionProps) {
  return (
    <section className="mb-10 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-2xl" aria-labelledby="why-cta-title">
      <h2 id="why-cta-title" className="font-bible-english text-xl font-semibold mb-3">{title}</h2>
      <p className={cn("text-sm leading-relaxed opacity-80", bodyClassName)}>{paragraph1}</p>
      <p className={cn("text-sm leading-relaxed opacity-80 mt-3", bodyClassName)}>{paragraph2}</p>
      <Link
        href={linkHref}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      >
        {linkLabel} <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
      </Link>
    </section>
  );
}
