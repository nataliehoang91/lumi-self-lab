"use client";

import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhyItMattersProps {
  title: string;
  body?: string;
  children: React.ReactNode;
}

export function LearnWhyItMatters({ title, body, children }: LearnWhyItMattersProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-12 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-xl">
      <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">{title}</h2>
      {body && <p className={cn("leading-relaxed", bodyClass)}>{body}</p>}
      {children}
    </section>
  );
}
