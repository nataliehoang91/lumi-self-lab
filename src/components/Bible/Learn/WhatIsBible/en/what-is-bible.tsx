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
  BOOK_2_SAMUEL_EN,
  BOOK_2_TIMOTHY_EN,
  BOOK_AMOS_EN,
  BOOK_COLOSSIANS_EN,
  BOOK_DANIEL_EN,
} from "@/components/Bible/Learn/constants";
import { LearnWhyItMatters } from "../shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";
import { LearnWhatIsBibleAuthorsSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleAuthorsSection";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import type { BibleBook } from "@/components/Bible/Read/types";

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

const VERSE_PREVIEW_EN_AUTHORS: Record<string, string> = {
  "2 Samuel 5:4-5":
    "David was thirty years old when he became king, and he reigned forty years. In Hebron he reigned over Judah seven years and six months, and in Jerusalem he reigned over all Israel and Judah thirty-three years.",
  "Amos 1:1": "The words of Amos, one of the shepherds of Tekoa...",
  "Daniel 2:48":
    "Then the king placed Daniel in a high position and lavished many gifts on him... He made him ruler over the entire province of Babylon.",
  "Colossians 4:14": "Our dear friend Luke, the doctor, and Demas send greetings.",
  "Matthew 4:18-21":
    "As Jesus was walking beside the Sea of Galilee... he saw two brothers, Simon called Peter and his brother Andrew... He said to them, “Come, follow me.”",
  "Matthew 10:3": "Philip and Bartholomew; Thomas and Matthew the tax collector...",
  "2 Timothy 3:16":
    "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.",
};

function buildReadHrefEn(
  bookId: string | null,
  chapter: number,
  verse: number,
  testament: "ot" | "nt"
): string {
  if (!bookId) return "#";
  const sp = new URLSearchParams();
  sp.set("version1", "niv");
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));
  return `/bible/en/read?${sp.toString()}`;
}

function findBookIdByEn(books: BibleBook[] | undefined, nameEn: string): string | null {
  if (!books?.length) return null;
  const book = books.find((b) => b.nameEn === nameEn);
  return book?.id ?? null;
}

export function EnWhatIsBiblePage({ books }: { books: BibleBook[] }) {
  const { bodyClass, bodyTitleClass } = useBibleFontClasses();
  return (
    <article aria-label="What Is the Bible?" className="text-foreground">
      <LearnWhatIsBibleIntro
        bodyBright
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

      <blockquote
        className="bg-primary-light/5 border-l-primary mb-12 space-y-4 rounded-r-xl
          border-l-4 py-6 pr-6 pl-6 not-italic"
      >
        <p
          className={cn("font-bible-english leading-snug font-semibold", bodyTitleClass)}
        >
          The {TERM_BIBLE_EN} is a library, not a single book.
        </p>
        <p className={cn("leading-relaxed", bodyClass)}>
          The word <strong>&quot;Bible&quot;</strong> comes from the {LANG_GREEK_EN}{" "}
          <strong>&quot;biblia&quot;</strong>, meaning “books.” Understanding this helps
          us avoid reading the {TERM_BIBLE_EN} as one uniform text, and instead as a
          collection of interconnected writings.
        </p>
        <p
          className={cn(
            "border-border border-t pt-4 leading-relaxed",
            bodyClass
          )}
        >
          The {TERM_BIBLE_EN} includes multiple genres: history, poetry, law, letters, and
          apocalyptic vision. Not every part should be read in the same way.
        </p>
      </blockquote>

      <LearnWhatIsBibleStats
        statLabels={[
          "Books total",
          TERM_OLD_TESTAMENT_EN,
          TERM_NEW_TESTAMENT_EN,
          "Authors",
        ]}
      />

      <LearnWhatIsBibleAuthorsSection
        title="Written by people from many different backgrounds"
        intro={
          <>
            The writings of the {TERM_BIBLE_EN} were not produced by a single type of
            author. They came from people in very different roles and stages of life.
          </>
        }
        bulletItems={[
          <div key="1" className="flex items-baseline gap-x-2">
            <span className="">• Kings — such as David</span>
            <span className="shrink-0">—</span>
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, BOOK_2_SAMUEL_EN)}
              chapter={5}
              verse={4}
              verseEnd={5}
              testament="ot"
              triggerClassName={bodyClass}
              previewText={VERSE_PREVIEW_EN_AUTHORS["2 Samuel 5:4-5"]}
            >
              2 Samuel 5:4–5
            </BibleVerseLink>
          </div>,
          <div key="2" className="flex items-baseline gap-x-2">
            <span className="">• Shepherds — such as Amos</span>
            <span className="shrink-0">—</span>
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, BOOK_AMOS_EN)}
              chapter={1}
              verse={1}
              testament="ot"
              triggerClassName={bodyClass}
              previewText={VERSE_PREVIEW_EN_AUTHORS["Amos 1:1"]}
            >
              Amos 1:1
            </BibleVerseLink>
          </div>,
          <div key="3" className="flex items-baseline gap-x-2">
            <span className="">• Government officials — such as Daniel</span>
            <span className="shrink-0">—</span>
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, BOOK_DANIEL_EN)}
              chapter={2}
              verse={48}
              testament="ot"
              triggerClassName={bodyClass}
              previewText={VERSE_PREVIEW_EN_AUTHORS["Daniel 2:48"]}
            >
              Daniel 2:48
            </BibleVerseLink>
          </div>,
          <div key="4" className="flex items-baseline gap-x-2">
            <span className="">• Physicians — such as Luke</span>
            <span className="shrink-0">—</span>
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, BOOK_COLOSSIANS_EN)}
              chapter={4}
              verse={14}
              testament="nt"
              triggerClassName={bodyClass}
              previewText={VERSE_PREVIEW_EN_AUTHORS["Colossians 4:14"]}
            >
              Colossians 4:14
            </BibleVerseLink>
          </div>,
          <div key="5" className="flex items-baseline gap-x-2">
            <span className="">• Fishermen — such as Peter</span>
            <span className="shrink-0">—</span>
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, BOOK_MATTHEW_EN)}
              chapter={4}
              verse={18}
              verseEnd={21}
              testament="nt"
              triggerClassName={bodyClass}
              previewText={VERSE_PREVIEW_EN_AUTHORS["Matthew 4:18-21"]}
            >
              Matthew 4:18–21
            </BibleVerseLink>
          </div>,
          <div key="6" className="flex items-baseline gap-x-2">
            <span className="">• Tax collectors — such as Matthew</span>
            <span className="shrink-0">—</span>
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, BOOK_MATTHEW_EN)}
              chapter={10}
              verse={3}
              testament="nt"
              triggerClassName={bodyClass}
              previewText={VERSE_PREVIEW_EN_AUTHORS["Matthew 10:3"]}
            >
              Matthew 10:3
            </BibleVerseLink>
          </div>,
        ]}
        conclusion={
          <p className={cn("mt-6 leading-relaxed", bodyClass)}>
            Despite their different backgrounds, many readers believe these writings
            together form a coherent story about {TERM_GOD_EN} and humanity.
          </p>
        }
        quoteBlocks={[
          <QuoteCard
            key="2tim316"
            quote="All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness."
            footnote="2 Timothy 3:16"
            footnoteAlign="center"
            footnoteHref={buildReadHrefEn(
              findBookIdByEn(books, BOOK_2_TIMOTHY_EN),
              3,
              16,
              "nt"
            )}
          />,
        ]}
      />
      <div className="my-8 h-px" />

      <LearnWhatIsBibleTestamentSection
        bodyBright
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
        bookLabelSingular="book"
        bookLabelPlural="books"
      />

      <LearnWhatIsBibleTestamentSection
        bodyBright
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
        bookLabelSingular="book"
        bookLabelPlural="books"
      />

      <LearnWhyItMatters title="The Central Story — and Why It Matters">
        <p className={cn("leading-relaxed", bodyClass)}>
          Though written over many centuries by different authors, the {TERM_BIBLE_EN} is
          not a random collection of books. It tells one central story:{" "}
          <strong>{TERM_GOD_EN}</strong> creates humanity, humanity turns away, and{" "}
          <strong>{TERM_GOD_EN}</strong> moves toward people with promise and hope. The{" "}
          {TERM_NEW_TESTAMENT_EN} presents <strong>{NAME_JESUS_EN}</strong>{" "}
          <strong>{TERM_CHRIST_EN}</strong> as the turning point of that story.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          If the <strong>{TERM_BIBLE_EN}</strong> is only ancient literature, then it
          belongs to the past. But if this story is true, it speaks directly to you — to
          who you are, why the world feels broken, and where real hope might be found.
        </p>
      </LearnWhyItMatters>
      <LearnWhatIsBibleGlossary glossaryTitle="Quick Glossary" glossary={EN_GLOSSARY} />
    </article>
  );
}
