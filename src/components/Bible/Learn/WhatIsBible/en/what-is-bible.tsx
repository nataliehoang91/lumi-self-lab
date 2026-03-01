"use client";

import { LearnWhatIsBibleIntro } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleIntro";
import { LearnWhatIsBibleStats } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleStats";
import { LearnWhatIsBibleTestamentSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleTestamentSection";
import {
  LearnWhatIsBibleGlossary,
  type GlossaryItem,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleGlossary";
import {
  OT_SECTIONS,
  NT_SECTIONS,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/constants";
import {
  NAME_JESUS_EN,
  NAME_PAUL_EN,
  LANG_HEBREW_EN,
  LANG_ARAMAIC_EN,
  LANG_GREEK_EN,
  PLACE_ISRAEL_EN,
  PLACE_JERUSALEM_EN,
  BOOK_GENESIS_EN,
  BOOK_DEUTERONOMY_EN,
  BOOK_JOSHUA_EN,
  BOOK_ESTHER_EN,
  BOOK_JOB_EN,
  BOOK_ISAIAH_EN,
  BOOK_MALACHI_EN,
  BOOK_MATTHEW_EN,
  BOOK_MARK_EN,
  BOOK_LUKE_EN,
  BOOK_JOHN_EN,
  BOOK_ACTS_EN,
  BOOK_ROMANS_EN,
  BOOK_JUDE_EN,
  BOOK_REVELATION_EN,
  TERM_GOD_EN,
  TERM_BIBLE_EN,
  TERM_CHRIST_EN,
  TERM_OLD_TESTAMENT_EN,
  TERM_NEW_TESTAMENT_EN,
} from "@/components/Bible/Learn/constants";
import { LearnWhyItMatters } from "../shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "../../useLearnFontClasses";

const EN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: TERM_OLD_TESTAMENT_EN,
    def: `The first section of the ${TERM_BIBLE_EN}, containing ${PLACE_ISRAEL_EN}'s history, law, poetry, and prophetic writings before the time of ${NAME_JESUS_EN}.`,
  },
  {
    term: TERM_NEW_TESTAMENT_EN,
    def: `The second section of the ${TERM_BIBLE_EN}, beginning with the Gospels and continuing with the growth of the early church.`,
  },
  {
    term: "Canon",
    def: "The recognised collection of books considered authoritative Scripture within the Christian tradition.",
  },
  {
    term: "Covenant",
    def: `A relational commitment between ${TERM_GOD_EN} and His people, a theme that runs throughout both Testaments.`,
  },
  {
    term: "Gospel",
    def: `Literally "good news" — referring to the message about ${NAME_JESUS_EN} and the significance of His life, death, and resurrection.`,
  },
  {
    term: "Prophet",
    def: `A messenger called to speak ${TERM_GOD_EN}'s message within a specific historical context.`,
  },
  {
    term: "Revelation (Apocalyptic)",
    def: "A symbolic literary style that uses imagery to describe judgment, hope, and the ultimate restoration of creation.",
  },
];

export function EnWhatIsBiblePage() {
  const { bodyClass } = useLearnFontClasses();
  return (
    <article aria-label="What Is the Bible?">
      <LearnWhatIsBibleIntro
        moduleNum="01 / 04"
        title="What Is the Bible?"
        introParts={[
          "The Bible is not just a single book — it is a collection of ",
          "66 writings",
          " shaped across ",
          "1,500 years",
          " by around ",
          "40 different authors",
          `. Though formed across centuries and cultures, many Christians understand it as telling one unified story — a story about the relationship between ${TERM_GOD_EN} and humanity.`,
        ]}
      />

      <blockquote className="mb-12 pl-6 pr-6 py-6 border-l-4 bg-primary-light/5 border-l-primary rounded-r-xl not-italic space-y-4">
        <p className="text-lg font-semibold leading-snug">
          The {TERM_BIBLE_EN} is a library, not a single book.
        </p>
        <p className="leading-relaxed text-sm opacity-90">
          The word <strong>&quot;Bible&quot;</strong> comes from the {LANG_GREEK_EN} <strong>&quot;biblia&quot;</strong>
          , meaning “books.” Understanding this helps us avoid reading the {TERM_BIBLE_EN} as one uniform text,
          and instead as a collection of interconnected writings.
        </p>
        <p className="leading-relaxed text-sm opacity-80 border-t border-border pt-4">
          The {TERM_BIBLE_EN} includes multiple genres: history, poetry, law, letters, and apocalyptic vision.
          Not every part should be read in the same way.
        </p>
      </blockquote>

      <LearnWhatIsBibleStats
        statLabels={["Books total", TERM_OLD_TESTAMENT_EN, TERM_NEW_TESTAMENT_EN, "Authors"]}
      />

      <LearnWhatIsBibleTestamentSection
        title={TERM_OLD_TESTAMENT_EN}
        intro={`Written primarily in ${LANG_HEBREW_EN} (with portions in ${LANG_ARAMAIC_EN}), the ${TERM_OLD_TESTAMENT_EN} records ${PLACE_ISRAEL_EN}'s history, law, poetry, and prophetic writings. It begins with creation and traces the unfolding relationship between ${TERM_GOD_EN} and His people, including the long-standing promise of a coming Messiah.`}
        sectionNames={["Law", "History", "Poetry & Wisdom", "Prophets"]}
        sectionDescs={[
          `${BOOK_GENESIS_EN} through ${BOOK_DEUTERONOMY_EN} — creation, the fall, and ${TERM_GOD_EN}'s covenant with ${PLACE_ISRAEL_EN}.`,
          `${BOOK_JOSHUA_EN} through ${BOOK_ESTHER_EN} — ${PLACE_ISRAEL_EN}'s story in the Promised Land, kings, exile, and return.`,
          `${BOOK_JOB_EN} through Song of Solomon — reflection on suffering, praise, wisdom, and love.`,
          `${BOOK_ISAIAH_EN} through ${BOOK_MALACHI_EN} — ${TERM_GOD_EN}'s messengers calling ${PLACE_ISRAEL_EN} back, pointing forward to ${TERM_CHRIST_EN}.`,
        ]}
        sections={OT_SECTIONS}
      />

      <LearnWhatIsBibleTestamentSection
        title={TERM_NEW_TESTAMENT_EN}
        intro={`Written in Koine ${LANG_GREEK_EN}, the ${TERM_NEW_TESTAMENT_EN} begins with four Gospel accounts of ${NAME_JESUS_EN}'s life, ministry, death, and resurrection. It continues with the growth of the early church and concludes with a vision of history's ultimate restoration in ${TERM_CHRIST_EN}.`}
        sectionNames={["Gospels", "History", "Letters", "Prophecy"]}
        sectionDescs={[
          `${BOOK_MATTHEW_EN}, ${BOOK_MARK_EN}, ${BOOK_LUKE_EN}, ${BOOK_JOHN_EN} — four accounts of ${NAME_JESUS_EN}'s life, ministry, death, and resurrection.`,
          `${BOOK_ACTS_EN} — the story of the early church spreading from ${PLACE_JERUSALEM_EN} to the ends of the earth.`,
          `${BOOK_ROMANS_EN} through ${BOOK_JUDE_EN} — ${NAME_PAUL_EN} and others writing to churches and individuals about faith and life.`,
          `${BOOK_REVELATION_EN} — a vision of the end of history and the victory of ${TERM_CHRIST_EN}.`,
        ]}
        sections={NT_SECTIONS}
      />

      <LearnWhyItMatters title="The Central Story — and Why It Matters">
        <p className={cn(" leading-relaxed", bodyClass)}>
          {" "}
          Though written across centuries by many voices, the {TERM_BIBLE_EN} presents one sweeping
          narrative: {TERM_GOD_EN} creates the world, humanity turns away, and a long story of
          promise, hope, and restoration unfolds. The {TERM_NEW_TESTAMENT_EN} presents{" "}
          {NAME_JESUS_EN} {TERM_CHRIST_EN} as the climax of that story. If the {TERM_BIBLE_EN} is
          merely a collection of ancient texts, it remains a valuable historical resource.{" "}
        </p>
        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          {" "}
          But if it truly tells a coherent story about {TERM_GOD_EN} and humanity, then its claims about life,
          suffering, and hope deserve thoughtful consideration.
        </p>
      </LearnWhyItMatters>
      <LearnWhatIsBibleGlossary glossaryTitle="Quick Glossary" glossary={EN_GLOSSARY} />
    </article>
  );
}
