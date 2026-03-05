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
  BOOK_PSALMS_EN,
  BOOK_MICAH_EN,
  BOOK_ZECHARIAH_EN,
  TERM_GOD_EN,
  TERM_BIBLE_EN,
  TERM_OLD_TESTAMENT_EN,
  TERM_NEW_TESTAMENT_EN,
} from "@/components/Bible/Learn/constants";
import {
  GlossaryItem,
  LearnWhatIsBibleGlossary,
} from "../../WhatIsBible/shared-components/LearnWhatIsBibleGlossary";
import type { BibleBook } from "@/components/Bible/Read/types";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import type { LearnProphecyItem } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";

/** NIV verse previews for popover (Who Is Jesus lesson). Fixed content, no API. */
const VERSE_PREVIEW_EN: Record<string, string> = {
  "John 11:35": "Jesus wept.",
  "Hebrews 4:15":
    "For we do not have a high priest who is unable to empathize with our weaknesses, but we have one who has been tempted in every way, just as we are—yet he did not sin.",
  "John 1:1":
    "In the beginning was the Word, and the Word was with God, and the Word was God.",
  "Colossians 2:9":
    "For in Christ all the fullness of the Deity lives in bodily form.",
  // Prophecy section
  "Micah 5:2":
    "But you, Bethlehem Ephrathah... out of you will come for me one who will be ruler over Israel.",
  "Matthew 2:1": "After Jesus was born in Bethlehem...",
  "Isaiah 7:14": "The virgin will conceive and give birth to a son...",
  "Luke 1:27": "...to a virgin pledged to be married to a man named Joseph...",
  "Zechariah 9:9": "Your king comes to you... riding on a donkey.",
  "Mark 11:7": "They brought the donkey to Jesus and threw their cloaks on it...",
  "Zechariah 11:12": "...So they paid me thirty pieces of silver.",
  "Matthew 26:15": "...And they paid him thirty pieces of silver.",
  "Psalms 22:16": "They pierce my hands and my feet.",
  "Luke 24:39": "Look at my hands and my feet...",
  "Psalms 16:10": "Because you will not abandon me to the realm of the dead...",
  "Acts 2:31": "...the Messiah would rise from the dead...",
  "1 Corinthians 15:3–8":
    "Christ died for our sins according to the Scriptures... he was raised on the third day according to the Scriptures.",
};

const EN_JESUS_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Messiah",
    def: (
      <>
        A Hebrew word meaning “anointed one.” In the {TERM_BIBLE_EN}, it refers to the
        promised king and deliverer expected by Israel. The {TERM_NEW_TESTAMENT_EN}{" "}
        presents <strong>Jesus</strong> as that Messiah.
      </>
    ),
  },
  {
    term: "Incarnation",
    def: (
      <>
        The Christian belief that {TERM_GOD_EN} took on human nature in the person of{" "}
        <strong>Jesus</strong>. Not merely a messenger, but {TERM_GOD_EN} entering human
        history.
      </>
    ),
  },
  {
    term: "Resurrection",
    def: (
      <>
        The belief that <strong>Jesus</strong> rose bodily from the dead on the third day
        after <strong>His</strong> crucifixion. For Christians, this event stands at the
        heart of their faith.
      </>
    ),
  },
];

function getProphecyItems(
  books: BibleBook[],
  findBookId: (books: BibleBook[], nameEn: string) => string | null,
  subBodyClass: string
): LearnProphecyItem[] {
  return [
    {
      prophecy: "Born in Bethlehem",
      ref: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_MICAH_EN)}
          chapter={5}
          verse={2}
          testament="ot"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_MICAH_EN} 5:2`]}
        >
          {BOOK_MICAH_EN} 5:2
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_MATTHEW_EN)}
          chapter={2}
          verse={1}
          testament="nt"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_MATTHEW_EN} 2:1`]}
        >
          {BOOK_MATTHEW_EN} 2:1
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Born of a virgin",
      ref: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_ISAIAH_EN)}
          chapter={7}
          verse={14}
          testament="ot"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_ISAIAH_EN} 7:14`]}
        >
          {BOOK_ISAIAH_EN} 7:14
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_LUKE_EN)}
          chapter={1}
          verse={27}
          testament="nt"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_LUKE_EN} 1:27`]}
        >
          {BOOK_LUKE_EN} 1:27
        </BibleVerseLink>
      ),
    },
    {
      prophecy: `Entered ${PLACE_JERUSALEM_EN} on a donkey`,
      ref: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_ZECHARIAH_EN)}
          chapter={9}
          verse={9}
          testament="ot"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_ZECHARIAH_EN} 9:9`]}
        >
          {BOOK_ZECHARIAH_EN} 9:9
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_MARK_EN)}
          chapter={11}
          verse={7}
          testament="nt"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_MARK_EN} 11:7`]}
        >
          {BOOK_MARK_EN} 11:7
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Betrayed for 30 pieces of silver",
      ref: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_ZECHARIAH_EN)}
          chapter={11}
          verse={12}
          testament="ot"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_ZECHARIAH_EN} 11:12`]}
        >
          {BOOK_ZECHARIAH_EN} 11:12
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_MATTHEW_EN)}
          chapter={26}
          verse={15}
          testament="nt"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_MATTHEW_EN} 26:15`]}
        >
          {BOOK_MATTHEW_EN} 26:15
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Crucified, hands and feet pierced",
      ref: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_PSALMS_EN)}
          chapter={22}
          verse={16}
          testament="ot"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_PSALMS_EN} 22:16`]}
        >
          {BOOK_PSALMS_EN} 22:16
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_LUKE_EN)}
          chapter={24}
          verse={39}
          testament="nt"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_LUKE_EN} 24:39`]}
        >
          {BOOK_LUKE_EN} 24:39
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Rose from the dead",
      ref: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_PSALMS_EN)}
          chapter={16}
          verse={10}
          testament="ot"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_PSALMS_EN} 16:10`]}
        >
          {BOOK_PSALMS_EN} 16:10
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="en"
          bookId={findBookId(books, BOOK_ACTS_EN)}
          chapter={2}
          verse={31}
          testament="nt"
          triggerClassName={subBodyClass}
          previewText={VERSE_PREVIEW_EN[`${BOOK_ACTS_EN} 2:31`]}
        >
          {BOOK_ACTS_EN} 2:31
        </BibleVerseLink>
      ),
    },
  ];
}

function findBookIdByEn(books: BibleBook[], nameEn: string): string | null {
  const book = books.find((b) => b.nameEn === nameEn);
  return book?.id ?? null;
}

export function EnWhoIsJesus({ books }: { books: BibleBook[] }) {
  const { subBodyClass } = useBibleFontClasses();
  return (
    <article aria-label={`Who Is ${NAME_JESUS_EN}? lesson`}>
      <LearnLessonIntro
        moduleNum="03 / 04"
        title={`Who Is ${NAME_JESUS_EN}?`}
        intro1={
          <>
            For over two thousand years, people have debated who{" "}
            <strong>{NAME_JESUS_EN}</strong> really was.{" "}
          </>
        }
        intro1Quote={`A teacher? A prophet? A revolutionary? A myth? A Son of ${TERM_GOD_EN}? Or someone who is far greater than we can imagine?`}
      >
        <>
          <strong>{NAME_JESUS_EN}</strong> of Nazareth is the central figure of the{" "}
          {TERM_NEW_TESTAMENT_EN} and holds a unique place in the whole {TERM_BIBLE_EN}.
          Many Christians understand the {TERM_OLD_TESTAMENT_EN} as anticipating{" "}
          <strong>Him</strong>, and the story that follows as shaped by{" "}
          <strong>His</strong> life and teaching.
        </>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        sectionTitle={`Fully ${TERM_GOD_EN}. Fully Man.`}
        leftTitle="Fully Human"
        leftBody={
          <>
            <strong>{NAME_JESUS_EN}</strong> was born, grew up in an ordinary family, felt
            hunger and exhaustion, experienced sorrow, and ultimately faced death.{" "}
            <strong>He</strong> entered the human condition fully — not from a distance,
            but from within.
          </>
        }
        leftRef={
          <>
            <BibleVerseLink
              langSegment="en"
              bookId={findBookIdByEn(books, "John")}
              chapter={11}
              verse={35}
              testament="nt"
              previewText={VERSE_PREVIEW_EN["John 11:35"]}
            >
              John 11:35
            </BibleVerseLink>
            {" · "}
            <BibleVerseLink
              langSegment="en"
              bookId={findBookIdByEn(books, "Hebrews")}
              chapter={4}
              verse={15}
              testament="nt"
              previewText={VERSE_PREVIEW_EN["Hebrews 4:15"]}
            >
              Hebrews 4:15
            </BibleVerseLink>
          </>
        }
        rightTitle="Fully Divine"
        rightBody={
          <>
            Yet <strong>He</strong> also forgave sins, commanded the wind and waves,
            received worship, and rose from the dead. The {TERM_NEW_TESTAMENT_EN} presents{" "}
            <strong>Him</strong> not merely as a messenger of {TERM_GOD_EN}, but as{" "}
            {TERM_GOD_EN} in human form.
          </>
        }
        rightRef={
          <>
            <BibleVerseLink
              langSegment="en"
              bookId={findBookIdByEn(books, "John")}
              chapter={1}
              verse={1}
              testament="nt"
              previewText={VERSE_PREVIEW_EN["John 1:1"]}
            >
              John 1:1
            </BibleVerseLink>
            {" · "}
            <BibleVerseLink
              langSegment="en"
              bookId={findBookIdByEn(books, "Colossians")}
              chapter={2}
              verse={9}
              testament="nt"
              previewText={VERSE_PREVIEW_EN["Colossians 2:9"]}
            >
              Colossians 2:9
            </BibleVerseLink>
          </>
        }
      />

      <LearnCrossSection
        title="The Cross & Resurrection"
        paragraph1={
          <>
            Around 30 AD, <strong>{NAME_JESUS_EN}</strong> was crucified under the Roman
            governor Pontius Pilate. Christians believe this was not a tragic accident of
            history, but the center of {TERM_GOD_EN}&apos;s redemptive plan. On the cross,{" "}
            <strong>He</strong> willingly bore the weight of human sin — opening the way
            for forgiveness and reconciliation with {TERM_GOD_EN}.
          </>
        }
        paragraph2={
          <>
            On the third day, <strong>He</strong> was proclaimed to have risen bodily from
            the dead. This message was announced from the earliest days of the church and
            recorded in the {TERM_NEW_TESTAMENT_EN} writings. For Christians, the
            resurrection is not symbolic, but the decisive turning point of history.
          </>
        }
        refText={
          <BibleVerseLink
            langSegment="en"
            bookId={findBookIdByEn(books, "1 Corinthians")}
            chapter={15}
            verse={3}
            verseEnd={8}
            testament="nt"
            triggerClassName={subBodyClass}
            previewText={VERSE_PREVIEW_EN["1 Corinthians 15:3–8"]}
          >
            1 Corinthians 15:3–8
          </BibleVerseLink>
        }
      />

      <LearnProphecySection
        title="Fulfilment of Prophecy"
        intro={
          <>
            Long before <strong>{NAME_JESUS_EN}</strong> was born, the Hebrew Scriptures
            spoke of a coming Messiah — describing <strong>His</strong> birthplace,{" "}
            <strong>His</strong> suffering, and even the manner of <strong>His</strong>{" "}
            death. Christians believe these promises converged in <strong>Him</strong>.
            The interpretation of these prophecies, however, has been discussed and
            debated for centuries.
          </>
        }
        items={getProphecyItems(books, findBookIdByEn, subBodyClass)}
      />

      <LearnWhyCtaSection
        title={`Why Does ${NAME_JESUS_EN} Matter Today?`}
        paragraph1={
          <>
            If <strong>{NAME_JESUS_EN}</strong> truly rose from the dead, then{" "}
            <strong>His</strong> life cannot be reduced to a moral example or an inspiring
            story. <strong>He</strong> claimed to be “the way, the truth, and the life”
            (John 14:6) — not merely offering advice, but inviting people into a restored
            relationship with {TERM_GOD_EN}.
          </>
        }
        paragraph2={
          <>
            For Christians, faith in <strong>{NAME_JESUS_EN}</strong> is not merely belief
            in a doctrine, but trust in a living person — one who offers forgiveness,
            purpose, and eternal hope.
          </>
        }
        linkHref="/bible/en/read"
        linkLabel="Read the Gospels"
      />
      <LearnWhatIsBibleGlossary
        glossaryTitle="Quick Glossary"
        glossary={EN_JESUS_GLOSSARY}
      />
    </article>
  );
}
