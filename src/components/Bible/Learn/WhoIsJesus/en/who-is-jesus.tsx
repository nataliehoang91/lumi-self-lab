"use client";

import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnFullyGodManSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnFullyGodManSection";
import { LearnVerseBulletItem } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnVerseBulletItem";
import { LearnCrossSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnCrossSection";
import {
  LearnProphecySection,
  type ProphecyConfidenceLevel,
} from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";
import { LearnWhyCtaSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnWhyCtaSection";
import {
  NAME_JESUS_EN,
  TERM_BIBLE_EN,
  TERM_GOD_EN,
  TERM_OLD_TESTAMENT_EN,
  TERM_NEW_TESTAMENT_EN,
} from "@/components/Bible/Learn/constants";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import {
  LearnWhatIsBibleGlossaryGrid,
  type GlossaryGridItem,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleGlossaryGrid";
import { RevealSection } from "@/components/Bible/Learn/shared-components/RevealSection";
import { LearnHeroImage } from "@/components/Bible/Learn/shared-components/LearnHeroImage";
import type { BibleBook } from "@/components/Bible/Read/types";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { Crown, User, Sun } from "lucide-react";

const EN_JESUS_GLOSSARY: readonly GlossaryGridItem[] = [
  {
    term: "Messiah",
    def: (
      <>
        From Hebrew, meaning &ldquo;anointed one.&rdquo; In Scripture, this term refers to
        the king and savior Israel awaited. The New Testament presents{" "}
        <strong>Jesus</strong> as this Messiah.
      </>
    ),
    icon: Crown,
  },
  {
    term: "Incarnation",
    def: (
      <>
        The belief that <strong>God</strong> came in human form in <strong>Jesus</strong>.
        Not merely a messenger, but <strong>God</strong> entering human history.
      </>
    ),
    icon: User,
  },
  {
    term: "Resurrection",
    def: (
      <>
        The belief that <strong>Jesus</strong> physically rose from the dead on the third
        day after crucifixion. For Christians, this is central to faith and a decisive
        turning point in history.
      </>
    ),
    icon: Sun,
  },
];

/** Verse text for hover preview; stored locally, no API. */
const VERSE_PREVIEW_EN: Record<string, string> = {
  "John 11:35": "Jesus wept.",
  "Hebrews 4:15":
    "For we do not have a high priest who is unable to empathize with our weaknesses, but we have one who has been tempted in every way, just as we are—yet he did not sin.",
  "John 1:1":
    "In the beginning was the Word, and the Word was with God, and the Word was God.",
  "Colossians 2:9": "For in Christ all the fullness of the Deity lives in bodily form.",
  "Mark 3:5":
    "He looked around at them in anger and, deeply distressed at their stubborn hearts, said to the man, 'Stretch out your hand.'",
  "John 19:28":
    "Later, knowing that everything had now been finished, and so that Scripture would be fulfilled, Jesus said, 'I am thirsty.'",
  "Mark 4:39":
    "He got up, rebuked the wind and said to the waves, 'Quiet! Be still!' Then the wind died down and it was completely calm.",
  "Luke 5:20": "When Jesus saw their faith, he said, 'Friend, your sins are forgiven.'",
  "John 11:43":
    "When he had said this, Jesus called in a loud voice, 'Lazarus, come out!'",
  "John 11:43-44":
    "When he had said this, Jesus called in a loud voice, 'Lazarus, come out!' The dead man came out, his hands and feet wrapped with strips of linen, and a cloth around his face.",
  "1 Corinthians 15:3-8":
    "For what I received I passed on to you as of first importance: that Christ died for our sins according to the Scriptures, that he was buried, that he was raised on the third day according to the Scriptures...",
  "Micah 5:2":
    "But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel...",
  "Matthew 2:1": "After Jesus was born in Bethlehem in Judea...",
  "Isaiah 7:14":
    "Therefore the Lord himself will give you a sign: The virgin will conceive and give birth to a son...",
  "Luke 1:27":
    "...to a virgin pledged to be married to a man named Joseph, a descendant of David. The virgin's name was Mary.",
  "Zechariah 9:9":
    "Rejoice greatly, Daughter Zion! Shout, Daughter Jerusalem! See, your king comes to you, righteous and victorious, lowly and riding on a donkey...",
  "Mark 11:7":
    "When they brought the donkey to Jesus and threw their cloaks over it, he sat on it.",
  "Zechariah 11:12":
    "I told them, 'If you think it best, give me my pay; but if not, keep it.' So they paid me thirty pieces of silver.",
  "Matthew 26:15": "...So he agreed with them for thirty pieces of silver.",
  "Psalms 22:16":
    "Dogs surround me, a pack of villains encircles me; they pierce my hands and my feet.",
  "Luke 24:39": "'Look at my hands and my feet. It is I myself!'",
  "Psalms 16:10":
    "Because you will not abandon me to the realm of the dead, nor will you let your faithful one see decay.",
  "Acts 2:31": "Seeing what was ahead, he spoke of the resurrection of the Messiah...",
};

type ProphecyRefDef = {
  bookEn: string;
  bookVi?: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
};

type ProphecySourceEN = {
  title: string;
  confidenceLevel: ProphecyConfidenceLevel;
  confidence: string;
  explanation: string;
  otRef: ProphecyRefDef;
  ntRef: ProphecyRefDef;
};

function versePreviewKeyEn(ref: ProphecyRefDef): string {
  if (ref.verseEnd != null && ref.verseEnd !== ref.verse) {
    return `${ref.bookEn} ${ref.chapter}:${ref.verse}-${ref.verseEnd}`;
  }
  return `${ref.bookEn} ${ref.chapter}:${ref.verse}`;
}

function refLinkLabelEn(ref: ProphecyRefDef): string {
  if (ref.verseEnd != null && ref.verseEnd !== ref.verse) {
    return `${ref.bookEn} ${ref.chapter}:${ref.verse}–${ref.verseEnd}`;
  }
  return `${ref.bookEn} ${ref.chapter}:${ref.verse}`;
}

const PROPHECY_SOURCES_EN: ProphecySourceEN[] = [
  {
    title: "Born in Bethlehem",
    confidenceLevel: "very_clear",
    confidence: "Very clear",
    explanation:
      "Micah speaks of where the long-awaited ruler would appear, and Matthew records Jesus being born in Bethlehem.",
    otRef: { bookEn: "Micah", chapter: 5, verse: 2 },
    ntRef: { bookEn: "Matthew", chapter: 2, verse: 1 },
  },
  {
    title: "Born of a virgin",
    confidenceLevel: "widely_discussed",
    confidence: "Widely compared",
    explanation:
      "Isaiah 7:14 speaks of the Messiah's extraordinary birth, and Luke records the birth of Jesus.",
    otRef: { bookEn: "Isaiah", chapter: 7, verse: 14 },
    ntRef: { bookEn: "Luke", chapter: 1, verse: 27 },
  },
  {
    title: "Entering Jerusalem on a donkey",
    confidenceLevel: "very_clear",
    confidence: "Very clear",
    explanation:
      "Zechariah describes a humble king riding a donkey; the Gospels record Jesus entering the city in the same way.",
    otRef: { bookEn: "Zechariah", chapter: 9, verse: 9 },
    ntRef: { bookEn: "Mark", chapter: 11, verse: 7 },
  },
  {
    title: "Betrayed for thirty pieces of silver",
    confidenceLevel: "very_clear",
    confidence: "Very clear",
    explanation:
      "Zechariah describes wages being weighed out; Matthew records Judas receiving thirty pieces of silver.",
    otRef: { bookEn: "Zechariah", chapter: 11, verse: 12 },
    ntRef: { bookEn: "Matthew", chapter: 26, verse: 15 },
  },
  {
    title: "Hands and feet pierced",
    confidenceLevel: "widely_discussed",
    confidence: "Widely compared",
    explanation:
      "Psalm 22 depicts suffering that closely echoes the crucifixion, and Luke records Jesus inviting his disciples to see his wounds.",
    otRef: { bookEn: "Psalms", chapter: 22, verse: 16 },
    ntRef: { bookEn: "Luke", chapter: 24, verse: 39 },
  },
  {
    title: "Rising from the dead",
    confidenceLevel: "very_clear",
    confidence: "Very clear",
    explanation:
      "The psalm says the soul is not left in the realm of the dead forever, and Acts quotes it when speaking of the Messiah's resurrection.",
    otRef: { bookEn: "Psalms", chapter: 16, verse: 10 },
    ntRef: { bookEn: "Acts", chapter: 2, verse: 31 },
  },
];

function getProphecyItems(
  books: BibleBook[],
  findBookId: (books: BibleBook[], nameEn: string) => string | null,
  bodyTitleClassUp: string
) {
  return PROPHECY_SOURCES_EN.map((item) => {
    const otBookId = findBookId(books, item.otRef.bookEn);
    const ntBookId = findBookId(books, item.ntRef.bookEn);
    const otKey = versePreviewKeyEn(item.otRef);
    const ntKey = versePreviewKeyEn(item.ntRef);

    return {
      title: item.title,
      confidenceLevel: item.confidenceLevel,
      confidence: item.confidence,
      explanation: item.explanation,
      otQuote: VERSE_PREVIEW_EN[otKey],
      ntQuote: VERSE_PREVIEW_EN[ntKey],
      otLink: (
        <BibleVerseLink
          langSegment="en"
          version1="niv"
          bookId={otBookId}
          chapter={item.otRef.chapter}
          verse={item.otRef.verse}
          verseEnd={item.otRef.verseEnd}
          testament="ot"
          linkOnly
          triggerClassName={cn(
            bodyTitleClassUp,
            "text-second-600! hover:text-second-800! inline-block text-xs underline underline-offset-4"
          )}
        >
          {refLinkLabelEn(item.otRef)}
        </BibleVerseLink>
      ),
      ntLink: (
        <BibleVerseLink
          langSegment="en"
          version1="niv"
          bookId={ntBookId}
          chapter={item.ntRef.chapter}
          verse={item.ntRef.verse}
          verseEnd={item.ntRef.verseEnd}
          testament="nt"
          linkOnly
          triggerClassName={cn(
            bodyTitleClassUp,
            "text-sage-600! hover:text-sage-800! inline-block text-xs underline underline-offset-4"
          )}
        >
          {refLinkLabelEn(item.ntRef)}
        </BibleVerseLink>
      ),
    };
  });
}

function findBookIdByEn(books: BibleBook[], nameEn: string): string | null {
  const name = nameEn.trim().toLowerCase();
  const book = books.find((b) => b.nameEn.trim().toLowerCase() === name);
  return book ? book.id : null;
}

export function EnWhoIsJesus({ books }: { books: BibleBook[] }) {
  const { subBodyClassUp, bodyClassUp, bodyTitleClassUp } = useBibleFontClasses();

  return (
    <article aria-label="Lesson: Who is Jesus?" className="text-foreground">
      <LearnLessonIntro
        bodyBright
        locale="en"
        moduleNum="03 / 05"
        title="Who Is Jesus?"
        intro1={
          <p className={cn("my-4 leading-relaxed", bodyClassUp)}>
            For more than two thousand years, people have debated the nature of{" "}
            <strong>{NAME_JESUS_EN}</strong>.
          </p>
        }
        intro1Quote={
          <>
            Was <strong>he</strong> a teacher? A prophet? A revolutionary? A legend? The{" "}
            <strong>Son of {TERM_GOD_EN}</strong>? Or something beyond our imagination?
          </>
        }
      >
        <p className={cn("my-4 leading-relaxed", bodyClassUp)}>
          <strong>{NAME_JESUS_EN}</strong> of Nazareth is the central figure of the{" "}
          {TERM_NEW_TESTAMENT_EN} and holds a unique place throughout the entire{" "}
          {TERM_BIBLE_EN}. Many believe the {TERM_OLD_TESTAMENT_EN} prepared for{" "}
          <strong>his</strong> coming, and everything after was profoundly shaped by{" "}
          <strong>him</strong>.
        </p>
      </LearnLessonIntro>

      <RevealSection>
        <LearnHeroImage
          src="https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=1200&q=80"
          alt="Soft sky — who is Jesus?"
          overlay={
            <span className="text-[120px] font-bold leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] select-none">
              ?
            </span>
          }
          credit="Photo on Unsplash"
          creditHref="https://unsplash.com"
        />
      </RevealSection>

      <RevealSection>
        <LearnFullyGodManSection
          bodyBright
          locale="en"
          sectionTitle={`Fully ${TERM_GOD_EN}, Fully Human`}
          leftTitle="Fully Human"
          leftBody={
            <>
              Jesus did not stand apart from ordinary human life. Scripture records that he
              wept, grieved, grew tired, felt thirst, and suffered pain as we do.
              <ul className={cn("my-8 space-y-1", bodyClassUp)}>
                <LearnVerseBulletItem
                  label="Wept with sorrow"
                  reference={
                    <BibleVerseLink
                      langSegment="en"
                      version1="niv"
                      bookId={findBookIdByEn(books, "John")}
                      chapter={11}
                      verse={35}
                      testament="nt"
                      previewText={VERSE_PREVIEW_EN["John 11:35"]}
                      triggerClassName={subBodyClassUp}
                    >
                      John 11:35
                    </BibleVerseLink>
                  }
                />
                <LearnVerseBulletItem
                  label="Angered by injustice"
                  reference={
                    <BibleVerseLink
                      langSegment="en"
                      version1="niv"
                      bookId={findBookIdByEn(books, "Mark")}
                      chapter={3}
                      verse={5}
                      testament="nt"
                      previewText={VERSE_PREVIEW_EN["Mark 3:5"]}
                      triggerClassName={subBodyClassUp}
                    >
                      Mark 3:5
                    </BibleVerseLink>
                  }
                />
                <LearnVerseBulletItem
                  label="Thirsted while suffering"
                  reference={
                    <BibleVerseLink
                      langSegment="en"
                      version1="niv"
                      bookId={findBookIdByEn(books, "John")}
                      chapter={19}
                      verse={28}
                      testament="nt"
                      previewText={VERSE_PREVIEW_EN["John 19:28"]}
                      triggerClassName={subBodyClassUp}
                    >
                      John 19:28
                    </BibleVerseLink>
                  }
                />
              </ul>
              <p className={cn("mt-3", bodyClassUp)}>
                These details show that <strong>he</strong> truly shared human life, rather
                than standing outside it.
              </p>
            </>
          }
          rightTitle={`Fully ${TERM_GOD_EN}`}
          rightBody={
            <>
              At the same time, Jesus did what lies beyond human power: he stilled the
              storm, forgave sins, and called the dead to life.
              <ul className={cn("my-8 space-y-1", bodyClassUp)}>
                <LearnVerseBulletItem
                  label="Performed miracles and commanded nature"
                  reference={
                    <BibleVerseLink
                      langSegment="en"
                      version1="niv"
                      bookId={findBookIdByEn(books, "Mark")}
                      chapter={4}
                      verse={39}
                      testament="nt"
                      previewText={VERSE_PREVIEW_EN["Mark 4:39"]}
                      triggerClassName={subBodyClassUp}
                    >
                      Mark 4:39
                    </BibleVerseLink>
                  }
                />
                <LearnVerseBulletItem
                  label="Had authority to forgive sins"
                  reference={
                    <BibleVerseLink
                      langSegment="en"
                      version1="niv"
                      bookId={findBookIdByEn(books, "Luke")}
                      chapter={5}
                      verse={20}
                      testament="nt"
                      previewText={VERSE_PREVIEW_EN["Luke 5:20"]}
                      triggerClassName={subBodyClassUp}
                    >
                      Luke 5:20
                    </BibleVerseLink>
                  }
                />
                <LearnVerseBulletItem
                  label="Raised the dead"
                  reference={
                    <BibleVerseLink
                      langSegment="en"
                      version1="niv"
                      bookId={findBookIdByEn(books, "John")}
                      chapter={11}
                      verse={43}
                      verseEnd={44}
                      testament="nt"
                      previewText={VERSE_PREVIEW_EN["John 11:43-44"]}
                      triggerClassName={subBodyClassUp}
                    >
                      John 11:43-44
                    </BibleVerseLink>
                  }
                />
              </ul>
              <p className={cn("mt-3", bodyClassUp)}>
                Because of this, many believe he was not merely a teacher or prophet, but
                the <strong>Son of {TERM_GOD_EN}</strong>.
              </p>
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnCrossSection
          bodyBright
          locale="en"
          title="His Death and Resurrection"
          paragraph1={
            <>
              According to the New Testament, Jesus was crucified under Pontius Pilate. For
              many believers, his death was not only a historical event, but an act of
              redemption.
            </>
          }
          paragraph2={
            <>
              According to the {TERM_NEW_TESTAMENT_EN}, on the third day <strong>he</strong>{" "}
              rose again. This is not only a symbol, but the foundation of hope and faith.
            </>
          }
          refText={
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, "1 Corinthians")}
              chapter={15}
              verse={3}
              verseEnd={8}
              testament="nt"
              previewText={VERSE_PREVIEW_EN["1 Corinthians 15:3-8"]}
              triggerClassName={subBodyClassUp}
            >
              1 Corinthians 15:3–8
            </BibleVerseLink>
          }
        />
      </RevealSection>

      <RevealSection>
        <div className="my-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-border h-px w-16" />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-primary/50">
              <rect x="8.5" y="1" width="3" height="18" rx="1.5" fill="currentColor"/>
              <rect x="3" y="6" width="14" height="3" rx="1.5" fill="currentColor"/>
            </svg>
            <div className="bg-border h-px w-16" />
          </div>
          <p className="text-muted-foreground/60 text-xs tracking-widest uppercase">
            Prophecy &amp; Fulfillment
          </p>
        </div>
      </RevealSection>

      <RevealSection>
        <LearnProphecySection
          bodyBright
          locale="en"
          title="Prophecies Often Compared"
          intro={
            <>
              In the Old Testament, many passages are understood by believers as pointing
              toward the Messiah. This section presents several prophecies often compared
              with the life, death, and resurrection of Jesus. Some connections are seen as
              very clear, while others are still discussed in different ways.
            </>
          }
          items={getProphecyItems(books, findBookIdByEn, bodyTitleClassUp)}
          prophecyColumnLabel="Prophecy"
          fulfilmentColumnLabel="Fulfilled"
        />
      </RevealSection>

      <RevealSection>
        <LearnWhyCtaSection
          locale="en"
          title="Why Does This Still Matter?"
          paragraph1={
            <>
              If Jesus truly rose from the dead, then he cannot be only a figure from
              history or a moral teacher. That means he is still alive—and the promises of
              hope and forgiveness are not mere theories; they can become real in
              people&apos;s lives.
            </>
          }
          paragraph2={
            <>
              Yet this is not only something to know, but something to respond to. Scripture
              says that receiving those promises takes faith: not only assent to a fact, but
              trust placed in Jesus himself.{" "}
              <span className="mt-4 block font-semibold">
                What, then, is real faith? And what does that have to do with you?
              </span>
            </>
          }
          linkHref="/bible/en/read"
          linkLabel="Read the Bible"
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatIsBibleGlossaryGrid
          glossaryTitle="Quick Glossary"
          items={EN_JESUS_GLOSSARY}
          locale="en"
        />
      </RevealSection>
    </article>
  );
}
