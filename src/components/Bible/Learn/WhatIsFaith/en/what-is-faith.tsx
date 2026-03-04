"use client";

import { LearnWhatIsFaithIntro } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithIntro";
import { LearnWhatIsFaithGraceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithGraceSection";
import { LearnWhatIsFaithRepentanceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithRepentanceSection";
import {
  LearnWhatIsFaithPrayerSection,
  type PrayerStep,
} from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithPrayerSection";
import { LearnWhyItMatters } from "../../WhatIsBible/shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "../../useLearnFontClasses";
import {
  type GlossaryItem,
  LearnWhatIsFaithGlossary,
} from "../shared-components/LearnWhatIsFaithGlossary";

const PRAYER_STEPS_EN: readonly PrayerStep[] = [
  {
    letter: "A",
    stepName: "Adoration",
    desc: "Begin by recognising who God is — not what you want from him, but who he truly is. Praise him.",
  },
  {
    letter: "C",
    stepName: "Confession",
    desc: "Be honest about where you have fallen short. God already knows; this is for your freedom.",
  },
  {
    letter: "T",
    stepName: "Thanksgiving",
    desc: "Name specific things you are grateful for, however small.",
  },
  {
    letter: "S",
    stepName: "Supplication",
    desc: "Bring your requests — for yourself, for others, and for the world.",
  },
];

const EN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Grace",
    def: "God’s undeserved gift. In Christian faith, salvation is not earned by human effort but given freely by God.",
  },
  {
    term: "Salvation",
    def: "Being rescued from sin and restored into a right relationship with God.",
  },
  {
    term: "Repentance",
    def: "A real change of direction — turning away from sin and turning toward God.",
  },
  {
    term: "Gospel",
    def: "Literally “good news” — the message that Jesus lived, died, and rose again to bring forgiveness and hope.",
  },
  {
    term: "Church",
    def: "The community of people who follow Jesus. Not just a building, but a spiritual family.",
  },
  {
    term: "Prayer",
    def: "Talking with God. Not a complex ritual, but a relationship.",
  },
];

export function EnWhatIsFaithPage() {
  const { bodyClass } = useLearnFontClasses();

  return (
    <div>
      <LearnWhatIsFaithIntro
        moduleNum="04 / 04"
        title="What Is Faith?"
        intro="Faith is not blind optimism or religious effort to become better. In the Bible, faith means trusting God — trusting that what he says is true and that Jesus is who he revealed himself to be."
      />

      {/* Relationship Block (aligned with VN version) */}
      <blockquote
        className="bg-primary-light/5 border-l-primary mb-12 space-y-4 rounded-r-xl
          border-l-4 py-6 pr-6 pl-6 not-italic"
      >
        <p className="text-lg leading-snug font-semibold">
          A Relationship, Not a Religion
        </p>
        <p className="text-sm leading-relaxed opacity-90">
          Christianity is not simply a system of rules to follow, but a relationship to
          enter. Jesus said he came so that people “may have life, and have it to the
          full” (John 10:10). The goal is not perfection, but walking in a real
          relationship with God.
        </p>
        <p className="border-border border-t pt-4 text-sm leading-relaxed opacity-80">
          Reading Scripture, praying, and gathering with other believers are ways of
          growing in that relationship — not conditions for being accepted.
        </p>
      </blockquote>

      <LearnWhatIsFaithGraceSection
        graceTitle="Salvation by Grace"
        graceBody="The central message of Christianity is salvation — being reconciled to God. This is not achieved by good works, but received as a gift through faith in what Jesus has done."
        graceQuote="For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God."
        graceRef="Ephesians 2:8"
      />

      <LearnWhatIsFaithRepentanceSection
        repentanceTitle="Repentance"
        repentanceBody="Repentance is more than feeling guilty. It is a genuine change of direction — turning away from a self-ruled life and turning toward God. When Jesus began his ministry, he said, 'Repent and believe the good news.'"
        repentanceRef="Mark 1:15"
      />

      <LearnWhatIsFaithPrayerSection
        prayerTitle="Where does faith begin?"
        prayerIntro="Faith does not begin with trying to become a better person. It begins with trust — trusting that God is real and that Jesus is who he revealed himself to be."
        steps={[
          {
            letter: "1",
            stepName: "Hear",
            desc: "Listen to the message of the Gospel — what the Bible says about God and humanity.",
          },
          {
            letter: "2",
            stepName: "Trust",
            desc: "Place your trust in Jesus, not in your own effort.",
          },
          {
            letter: "3",
            stepName: "Read",
            desc: "Begin reading the Bible — especially the Gospels — to understand who Jesus is.",
          },
          {
            letter: "4",
            stepName: "Follow",
            desc: "Live daily in that trust, even while you are still learning.",
          },
        ]}
      />

      <LearnWhyItMatters title="Why does faith matter?">
        <p className={cn("leading-relaxed", bodyClass)}>
          Everyone places trust in something — in their own strength, in relationships, in
          success, or in ideas about meaning and hope. The question is not whether you
          have faith, but where you place it.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          If faith is only positive thinking, it collapses when circumstances change. But
          if faith rests in God — who does not change — it becomes a steady foundation in
          the middle of anxiety, failure, and uncertainty.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          Christian faith does not only answer “What should I do?” It answers “Who am I?”
          and “To whom do I belong?” It does not merely adjust behaviour — it reshapes the
          foundation of your life.
        </p>
      </LearnWhyItMatters>

      <LearnWhatIsFaithGlossary glossaryTitle="Quick Glossary" glossary={EN_GLOSSARY} />
    </div>
  );
}
