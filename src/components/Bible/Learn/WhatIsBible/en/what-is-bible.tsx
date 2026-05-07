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
import { LearnWhyItMatters } from "../shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { BibleSacredQuote } from "@/components/Bible/Learn/WhatIsBible/shared-components/BibleSacredQuote";
import { LearnWhatIsBibleAuthorsSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleAuthorsSection";
import { AuthorOccupationGrid } from "@/components/Bible/Learn/WhatIsBible/shared-components/AuthorOccupationGrid";
import { BibleTestamentSplitBlock } from "@/components/Bible/Learn/WhatIsBible/shared-components/BibleTestamentSplitBlock";
import { LearnLibraryBlock } from "@/components/Bible/Learn/shared-components/LearnLibraryBlock";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import type { BibleBook } from "@/components/Bible/Read/types";

const EN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Old Testament",
    def: "The first section of the Bible, containing Israel's history, law, poetry, and prophetic writings before the time of Jesus.",
  },
  {
    term: "New Testament",
    def: "The second section of the Bible, beginning with the Gospels and continuing with the growth of the early church.",
  },
  {
    term: "Canon",
    def: "The recognised collection of books considered authoritative Scripture within the Christian tradition.",
  },
  {
    term: "Covenant",
    def: "A relational commitment between God and His people, a theme that runs throughout both Testaments.",
  },
  {
    term: "Gospel",
    def: 'Literally "good news" — referring to the message about Jesus and the significance of His life, death, and resurrection.',
  },
  {
    term: "Prophet",
    def: "A messenger called to speak God's message within a specific historical context.",
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
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  return (
    <article aria-label="What Is the Bible?" className="text-foreground">
      <LearnWhatIsBibleIntro
        bodyBright
        moduleNum="01 / 05"
        title="What Is the Bible?"
        introParts={[
          "The Bible is not just a single book — it is a collection of ",
          "66 writings",
          " shaped across ",
          "1,500 years",
          " by around ",
          "40 different authors",
          ". Though formed across centuries and cultures, many Christians understand it as telling one unified story — a story about the relationship between God and humanity.",
        ]}
      />

      <LearnLibraryBlock
        locale="en"
        title="The Bible is a library, not a single book."
        firstParagraph={
          <>
            The word &quot;Bible&quot; comes from the Greek &quot;biblia&quot;, meaning
            “books.” Understanding this helps us avoid reading the Bible as one uniform
            text, and instead as a collection of interconnected writings.
          </>
        }
        secondParagraph={
          <>
            The Bible includes multiple genres: history, poetry, law, letters, and
            apocalyptic vision. Not every part should be read in the same way.
          </>
        }
      />

      <LearnWhatIsBibleStats
        locale="en"
        statLabels={["Books total", "Old Testament", "New Testament", "Authors"]}
      />

      <LearnWhatIsBibleAuthorsSection
        locale="en"
        title="Written by people from many different backgrounds"
        intro={
          <>
            The writings of the Bible were not produced by a single type of author. They
            came from people in very different roles and stages of life.
          </>
        }
        bulletItems={[
          <AuthorOccupationGrid
            key="grid"
            locale="en"
            cards={[
              {
                icon: "crown",
                role: "King",
                person: "such as David",
                verseLink: (
                  <BibleVerseLink
                    langSegment="en"
                    version1="niv"
                    bookId={findBookIdByEn(books, "2 Samuel")}
                    chapter={5}
                    verse={4}
                    verseEnd={5}
                    testament="ot"
                    triggerClassName="underline underline-offset-2 text-second-dark dark:text-second"
                    previewText={VERSE_PREVIEW_EN_AUTHORS["2 Samuel 5:4-5"]}
                  >
                    2 Samuel 5:4–5
                  </BibleVerseLink>
                ),
              },
              {
                icon: "shepherd",
                role: "Shepherd",
                person: "such as Amos",
                verseLink: (
                  <BibleVerseLink
                    langSegment="en"
                    version1="niv"
                    bookId={findBookIdByEn(books, "Amos")}
                    chapter={1}
                    verse={1}
                    testament="ot"
                    triggerClassName="underline underline-offset-2 text-second-dark dark:text-second"
                    previewText={VERSE_PREVIEW_EN_AUTHORS["Amos 1:1"]}
                  >
                    Amos 1:1
                  </BibleVerseLink>
                ),
              },
              {
                icon: "scroll",
                role: "Government Official",
                person: "such as Daniel",
                verseLink: (
                  <BibleVerseLink
                    langSegment="en"
                    version1="niv"
                    bookId={findBookIdByEn(books, "Daniel")}
                    chapter={2}
                    verse={48}
                    testament="ot"
                    triggerClassName="underline underline-offset-2 text-second-dark dark:text-second"
                    previewText={VERSE_PREVIEW_EN_AUTHORS["Daniel 2:48"]}
                  >
                    Daniel 2:48
                  </BibleVerseLink>
                ),
              },
              {
                icon: "cross",
                role: "Physician",
                person: "such as Luke",
                verseLink: (
                  <BibleVerseLink
                    langSegment="en"
                    version1="niv"
                    bookId={findBookIdByEn(books, "Colossians")}
                    chapter={4}
                    verse={14}
                    testament="nt"
                    triggerClassName="underline underline-offset-2 text-second-dark dark:text-second"
                    previewText={VERSE_PREVIEW_EN_AUTHORS["Colossians 4:14"]}
                  >
                    Colossians 4:14
                  </BibleVerseLink>
                ),
              },
              {
                icon: "fish",
                role: "Fisherman",
                person: "such as Peter",
                verseLink: (
                  <BibleVerseLink
                    langSegment="en"
                    version1="niv"
                    bookId={findBookIdByEn(books, "Matthew")}
                    chapter={4}
                    verse={18}
                    verseEnd={21}
                    testament="nt"
                    triggerClassName="underline underline-offset-2 text-second-dark dark:text-second"
                    previewText={VERSE_PREVIEW_EN_AUTHORS["Matthew 4:18-21"]}
                  >
                    Matthew 4:18–21
                  </BibleVerseLink>
                ),
              },
              {
                icon: "coins",
                role: "Tax Collector",
                person: "such as Matthew",
                verseLink: (
                  <BibleVerseLink
                    langSegment="en"
                    version1="niv"
                    bookId={findBookIdByEn(books, "Matthew")}
                    chapter={10}
                    verse={3}
                    testament="nt"
                    triggerClassName="underline underline-offset-2 text-second-dark dark:text-second"
                    previewText={VERSE_PREVIEW_EN_AUTHORS["Matthew 10:3"]}
                  >
                    Matthew 10:3
                  </BibleVerseLink>
                ),
              },
            ]}
          />,
        ]}
        conclusion={
          <p className={cn("mt-6 leading-relaxed", bodyClassUp)}>
            Despite their different backgrounds, many readers believe these writings
            together form a coherent story about God and humanity.
          </p>
        }
        quoteContainerClassName="mt-6"
        quoteBlocks={[
          <BibleSacredQuote
            key="2tim316"
            quote="All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness."
            reference="2 Timothy 3:16"
            referenceHref={buildReadHrefEn(
              findBookIdByEn(books, "2 Timothy"),
              3,
              16,
              "nt"
            )}
          />,
        ]}
      />

      <section
        aria-labelledby="en-testament-split-intro"
        className="mt-12 border-border/40 border-t pt-10"
      >
        <h2
          id="en-testament-split-intro"
          className={cn("text-foreground mb-3 text-xl font-semibold", "font-bible-english")}
        >
          Two main parts: Old Testament and New Testament
        </h2>
        <p className={cn("leading-relaxed", bodyClass)}>
          The Bible is often summarized as two large collections — each written in
          different languages and genres, yet telling one continuous story. The cards
          below give a quick sense of how the two parts differ and how they fit
          together.
        </p>
      </section>

      <BibleTestamentSplitBlock
        className="mt-8"
        locale="en"
        otTitle="Old Testament"
        ntTitle="New Testament"
        otLang="Hebrew & Aramaic"
        ntLang="Greek"
        otTagline="Creation · Law · Promise"
        ntTagline="Jesus · The Church"
        otDesc="The Old Testament was written mainly in Hebrew (with some parts in Aramaic). It tells the story from creation to the time before Jesus was born — about God, His people Israel, and the promise of a coming Saviour."
        ntDesc="The New Testament was written in Greek. It begins with four Gospels about the life, death, and resurrection of Jesus. It then tells how the early church spread, and points to the future when everything will be made complete in Him."
      />

      <LearnWhatIsBibleTestamentSection
        bodyBright
        title="Old Testament"
        sectionNames={["Law", "History", "Poetry & Wisdom", "Prophets"]}
        sectionDescs={[
          "Genesis through Deuteronomy — creation, the fall, and God's covenant with Israel.",
          "Joshua through Esther — Israel's story in the Promised Land, kings, exile, and return.",
          "Job through Song of Solomon — reflection on suffering, praise, wisdom, and love.",
          "Isaiah through Malachi — God's messengers calling Israel back, pointing forward to Christ.",
        ]}
        sections={OT_SECTIONS}
        bookLabelSingular="book"
        bookLabelPlural="books"
      />

      <LearnWhatIsBibleTestamentSection
        bodyBright
        title="New Testament"
        sectionNames={["Gospels", "History", "Letters", "Prophecy"]}
        sectionDescs={[
          "Matthew, Mark, Luke, John — four accounts of Jesus's life, ministry, death, and resurrection.",
          "Acts — the story of the early church spreading from Jerusalem to the ends of the earth.",
          "Romans through Jude — Paul and others writing to churches and individuals about faith and life.",
          "Revelation — a vision of the end of history and the victory of Christ.",
        ]}
        sections={NT_SECTIONS}
        bookLabelSingular="book"
        bookLabelPlural="books"
      />

      <LearnWhyItMatters title="Why It Matters">
        <p className={cn("leading-relaxed", bodyClass)}>
          If the Bible were just ancient literature, it would only matter to historians.
          You might respect it, but have no reason to care.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          But the Bible tells the big human story — from the world&apos;s creation to
          humanity&apos;s ultimate future. And that story includes you. So... should you
          care?
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          The real question isn&apos;t &quot;What does the Bible say?&quot; It&apos;s:
          &quot;Do you want to know your own future?&quot;
        </p>
      </LearnWhyItMatters>
      <LearnWhatIsBibleGlossary glossaryTitle="Quick Glossary" glossary={EN_GLOSSARY} />
    </article>
  );
}
