"use client";

import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnFullyGodManSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnFullyGodManSection";
import { LearnCrossSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnCrossSection";
import { LearnProphecySection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";
import { LearnWhyCtaSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnWhyCtaSection";
import {
  NAME_JESUS_EN,
  PLACE_JERUSALEM_EN,
  BOOK_MATTHEW_EN,
  BOOK_LUKE_EN,
  BOOK_MARK_EN,
  BOOK_ACTS_EN,
  BOOK_ISAIAH_EN,
  TERM_GOD_EN,
  TERM_BIBLE_EN,
  TERM_OLD_TESTAMENT_EN,
  TERM_NEW_TESTAMENT_EN,
} from "@/components/Bible/Learn/constants";
import {
  GlossaryItem,
  LearnWhatIsBibleGlossary,
} from "../../WhatIsBible/shared-components/LearnWhatIsBibleGlossary";

const EN_JESUS_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Messiah",
    def: "A Hebrew word meaning “anointed one.” In the Bible, it refers to the promised king and deliverer expected by Israel. The New Testament presents Jesus as that Messiah.",
  },
  {
    term: "Incarnation",
    def: "The Christian belief that God took on human nature in the person of Jesus. Not merely a messenger, but God entering human history.",
  },
  {
    term: "Resurrection",
    def: "The belief that Jesus rose bodily from the dead on the third day after His crucifixion. For Christians, this event stands at the heart of their faith.",
  },
];

const PROPHECY_ITEMS = [
  { prophecy: "Born in Bethlehem", ref: "Micah 5:2", fulfilled: `${BOOK_MATTHEW_EN} 2:1` },
  {
    prophecy: "Born of a virgin",
    ref: `${BOOK_ISAIAH_EN} 7:14`,
    fulfilled: `${BOOK_LUKE_EN} 1:27`,
  },
  {
    prophecy: `Entered ${PLACE_JERUSALEM_EN} on a donkey`,
    ref: "Zechariah 9:9",
    fulfilled: `${BOOK_MARK_EN} 11:7`,
  },
  {
    prophecy: "Betrayed for 30 pieces of silver",
    ref: "Zechariah 11:12",
    fulfilled: `${BOOK_MATTHEW_EN} 26:15`,
  },
  {
    prophecy: "Crucified, hands and feet pierced",
    ref: "Psalm 22:16",
    fulfilled: `${BOOK_LUKE_EN} 24:39`,
  },
  { prophecy: "Rose from the dead", ref: "Psalm 16:10", fulfilled: `${BOOK_ACTS_EN} 2:31` },
];

export function EnWhoIsJesus() {
  return (
    <article aria-label={`Who Is ${NAME_JESUS_EN}? lesson`}>
      <LearnLessonIntro
        moduleNum="03 / 04"
        title={`Who Is ${NAME_JESUS_EN}?`}
        intro1={
          <>
            For over two thousand years, people have debated who <strong>{NAME_JESUS_EN}</strong>{" "}
            really was.{" "}
          </>
        }
        intro1Quote={`A teacher? A prophet? A revolutionary? A myth? A Son of ${TERM_GOD_EN}? Or someone who is far greater than we can imagine?`}
      >
        <>
          <strong>{NAME_JESUS_EN}</strong> of Nazareth is the central figure of the{" "}
          {TERM_NEW_TESTAMENT_EN} and holds a unique place in the whole {TERM_BIBLE_EN}. Many
          Christians understand the {TERM_OLD_TESTAMENT_EN} as anticipating <strong>Him</strong>,
          and the story that follows as shaped by <strong>His</strong> life and teaching.
        </>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        sectionTitle={`Fully ${TERM_GOD_EN}. Fully Man.`}
        leftTitle="Fully Human"
        leftBody={
          <>
            {NAME_JESUS_EN} was born, grew up in an ordinary family, felt hunger and exhaustion,
            experienced sorrow, and ultimately faced death. <strong>He</strong> entered the human
            condition fully — not from a distance, but from within.
          </>
        }
        leftRef="John 11:35 · Hebrews 4:15"
        rightTitle="Fully Divine"
        rightBody={
          <>
            Yet <strong>He</strong> also forgave sins, commanded the wind and waves, received
            worship, and rose from the dead. The {TERM_NEW_TESTAMENT_EN} presents{" "}
            <strong>Him</strong> not merely as a messenger of {TERM_GOD_EN}, but as {TERM_GOD_EN} in
            human form.
          </>
        }
        rightRef="John 1:1 · Colossians 2:9"
      />

      <LearnCrossSection
        title="The Cross & Resurrection"
        paragraph1={
          <>
            Around 30 AD, {NAME_JESUS_EN} was crucified under the Roman governor Pontius Pilate.
            Christians believe this was not a tragic accident of history, but the center of{" "}
            {TERM_GOD_EN}&apos;s redemptive plan. On the cross, <strong>He</strong> willingly bore
            the weight of human sin — opening the way for forgiveness and reconciliation with{" "}
            {TERM_GOD_EN}.
          </>
        }
        paragraph2={
          <>
            On the third day, <strong>He</strong> was proclaimed to have risen bodily from the dead.
            This message was announced from the earliest days of the church and recorded in the{" "}
            {TERM_NEW_TESTAMENT_EN} writings. For Christians, the resurrection is not symbolic, but
            the decisive turning point of history.
          </>
        }
        refText="1 Corinthians 15:3–8"
      />

      <LearnProphecySection
        title="Fulfilment of Prophecy"
        intro={
          <>
            Long before {NAME_JESUS_EN} was born, the Hebrew Scriptures spoke of a coming Messiah —
            describing <strong>His</strong> birthplace, <strong>His</strong> suffering, and even the
            manner of <strong>His</strong> death. Christians believe these promises converged in{" "}
            <strong>Him</strong>. The interpretation of these prophecies, however, has been
            discussed and debated for centuries.
          </>
        }
        items={PROPHECY_ITEMS}
      />

      <LearnWhyCtaSection
        title={`Why Does ${NAME_JESUS_EN} Matter Today?`}
        paragraph1={
          <>
            If {NAME_JESUS_EN} truly rose from the dead, then <strong>His</strong> life cannot be
            reduced to a moral example or an inspiring story. <strong>He</strong> claimed to be “the
            way, the truth, and the life” (John 14:6) — not merely offering advice, but inviting
            people into a restored relationship with {TERM_GOD_EN}.
          </>
        }
        paragraph2={
          <>
            For Christians, faith in {NAME_JESUS_EN} is not merely belief in a doctrine, but trust
            in a living person — one who offers forgiveness, purpose, and eternal hope.
          </>
        }
        linkHref="/bible/en/read"
        linkLabel="Read the Gospels"
      />
      <LearnWhatIsBibleGlossary glossaryTitle="Quick Glossary" glossary={EN_JESUS_GLOSSARY} />
    </article>
  );
}
