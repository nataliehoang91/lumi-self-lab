"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BibleBook } from "@/components/Bible/Read/types";
import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnWhatHappensAfterDeathLifeAndJudgment } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnWhatHappensAfterDeathLifeAndJudgment";
import { LearnWhatHappensAfterDeathTwoDestinies } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnWhatHappensAfterDeathTwoDestinies";
import { LearnHopeBridge } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnHopeBridge";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { LearnLibraryBlock } from "../../shared-components/LearnLibraryBlock";
import { LearnWhatIsBibleIntro } from "../../WhatIsBible/shared-components/LearnWhatIsBibleIntro";
import { LearnWhyItMatters } from "../../WhatIsBible/shared-components/why-it-matters";
import { LearnWhatHappensAfterDeathAccountability } from "../shared-components/LearnWhatHappensAfterDeathAccountability";
import { LearnWhatHappensAfterDeathLifeContinues } from "../shared-components/LearnWhatHappensAfterDeathLifeContinues";

const COMPARISON = [
  {
    title: "Heaven",
    description:
      "A place where people are with God — no more pain, no more tears, only peace and joy.",
    verses: "John 14:2–3 · Revelation 21:4",
  },
  {
    title: "Hell",
    description:
      "A place of separation from God — without the life and relationship He gives.",
    verses: "2 Thessalonians 1:9 · Revelation 20:15",
  },
] as const;

function findBookIdByEn(books: BibleBook[] | undefined, nameEn: string): string | null {
  if (!books?.length) return null;
  const book = books.find((b) => b.nameEn === nameEn);
  return book?.id ?? null;
}

export function EnWhatHappensAfterDeathPage({ books }: { books: BibleBook[] }) {
  const { bodyClassUp } = useBibleFontClasses();

  const twoDestinyItems = [
    {
      title: COMPARISON[0].title,
      description: COMPARISON[0].description,
      verses: (
        <BibleVerseLink
          langSegment="en"
          version1="niv"
          bookId={findBookIdByEn(books, "Revelation")}
          chapter={21}
          verse={4}
          testament="nt"
        >
          Revelation 21:4
        </BibleVerseLink>
      ),
    },
    {
      title: COMPARISON[1].title,
      description: COMPARISON[1].description,
      verses: (
        <BibleVerseLink
          langSegment="en"
          version1="niv"
          bookId={findBookIdByEn(books, "2 Thessalonians")}
          chapter={1}
          verse={9}
          testament="nt"
        >
          2 Thessalonians 1:9
        </BibleVerseLink>
      ),
    },
  ] as const;

  return (
    <article className="text-foreground" aria-label="Is Death the End?">
      <LearnWhatIsBibleIntro
        locale="en"
        bodyBright
        moduleNum="03 / 05"
        title="What Happens After Death?"
        intro={
          <>
            Is death really the end? <span className="font-semibold">The Bible</span>{" "}
            teaches that after death, every person will stand before God and enter into
            eternity. This lesson helps you explore what{" "}
            <span className="font-semibold">the Bible</span> says about life after death,
            two eternal destinations, and the hope found in{" "}
            <span className="font-semibold">Jesus</span>.
          </>
        }
      />

      <LearnLibraryBlock
        locale="en"
        title="A Question Every Culture Asks"
        firstParagraph={
          <>
            In every culture, people have asked the same question:{" "}
            <span className="font-semibold">what happens after we die?</span>
          </>
        }
        secondParagraph={
          <>
            Some believe death is the end. Others believe in reincarnation or some form of
            spiritual existence. But <span className="font-semibold">the Bible</span> says
            that life after death is real — and that{" "}
            <span className="font-semibold">God</span> has revealed it to us.
          </>
        }
      />

      <LearnWhatHappensAfterDeathLifeContinues
        locale="en"
        heading="Life Continues After Death"
        lead={
          <>
            When a person dies, the body returns to dust — but the person does not cease
            to exist. We continue in another way — our soul, our conscious self, remains.
          </>
        }
        quote={<>“Today you will be with me in paradise”</>}
        reference={
          <BibleVerseLink
            langSegment="en"
            version1="niv"
            bookId={findBookIdByEn(books, "Luke")}
            chapter={23}
            verse={43}
            testament="nt"
            linkOnly
          >
            Luke 23:43
          </BibleVerseLink>
        }
        explanation={
          <>
            These are Jesus’ words to the thief on the cross — showing that{" "}
            <strong>after death, we immediately stand before God</strong>.
          </>
        }
      />

      <LearnWhatHappensAfterDeathAccountability
        locale="en"
        heading="We Will Stand Before God"
        quote={<>People are destined to die once, and after that to face judgment</>}
        reference={
          <BibleVerseLink
            langSegment="en"
            version1="niv"
            bookId={findBookIdByEn(books, "Hebrews")}
            chapter={9}
            verse={27}
            testament="nt"
            linkOnly
          >
            Hebrews 9:27
          </BibleVerseLink>
        }
        body1={
          <>
            The <span className="font-semibold">Bible</span> says that{" "}
            <span className="font-semibold">God</span> knows everything about us — not
            only what we do, but even what is hidden in our hearts.
          </>
        }
        body2={
          <>
            This means life is not random. The way you live and the choices you make today
            matter — they lead somewhere eternal.
          </>
        }
      />

      <LearnWhatHappensAfterDeathTwoDestinies
        locale="en"
        heading="Two Eternal Destinations"
        intro={
          <>
            The Bible teaches that after death, each person will enter one of two
            realities.
          </>
        }
        items={twoDestinyItems}
      />

      <LearnHopeBridge locale="en">
        This may sound serious — and it is. But{" "}
        <span className="font-semibold">the Bible</span> does not end with judgment. It
        speaks about <span className="font-semibold">hope</span>.
      </LearnHopeBridge>

      <LearnWhyItMatters locale="en" title="Why Does This Matter?">
        <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
          The Bible says that <span className="font-semibold">God</span> does not want
          people to be separated from Him. So He made a way — a real hope — that we are
          not left in brokenness or despair.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
          That way is <strong>Jesus</strong>. Through Him, people can be forgiven and
          receive eternal life.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
          If this is true, then the most important question becomes:{" "}
          <span className="font-semibold">
            Who is Jesus — and what does He mean for you?
          </span>
        </p>
      </LearnWhyItMatters>
    </article>
  );
}
