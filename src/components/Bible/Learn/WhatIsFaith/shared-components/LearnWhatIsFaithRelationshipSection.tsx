"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsFaithRelationshipSectionProps {
  relationshipTitle: string;
  relationshipP1: string;
  relationshipP2: string;
}

export function LearnWhatIsFaithRelationshipSection({
  relationshipTitle,
  relationshipP1,
  relationshipP2,
}: LearnWhatIsFaithRelationshipSectionProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <section className="bg-foreground text-background mb-12 rounded-2xl p-6">
      <h2 className="font-bible-english mb-3 text-xl font-semibold">
        {relationshipTitle}
      </h2>
      <p className={cn("mb-4 leading-relaxed opacity-80", bodyClass)}>
        {relationshipP1}
      </p>
      <p className={cn("leading-relaxed opacity-80", bodyClass)}>
        {relationshipP2}
      </p>
    </section>
  );
}
