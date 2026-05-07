"use client";

import type { BibleBook } from "@/components/Bible/Read/types";
import { LearnWhatHappensAfterDeathTwoDestinies } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnWhatHappensAfterDeathTwoDestinies";
import { LearnHopeBridge } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnHopeBridge";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { LearnLibraryBlock } from "../../shared-components/LearnLibraryBlock";
import { LearnWhatIsBibleIntro } from "../../WhatIsBible/shared-components/LearnWhatIsBibleIntro";
import {
  LearnWhatIsBibleGlossaryGrid,
  type GlossaryGridItem,
} from "../../WhatIsBible/shared-components/LearnWhatIsBibleGlossaryGrid";
import { LearnWhyItMatters } from "../../WhatIsBible/shared-components/why-it-matters";
import { LearnWhatHappensAfterDeathAccountability } from "../shared-components/LearnWhatHappensAfterDeathAccountability";
import { LearnWhatHappensAfterDeathLifeContinues } from "../shared-components/LearnWhatHappensAfterDeathLifeContinues";
import { RevealSection } from "../../shared-components/RevealSection";
import { LearnHeroImage } from "../../shared-components/LearnHeroImage";
import { NAME_JESUS_EN, TERM_GOD_EN } from "@/components/Bible/Learn/constants";
import { Heart, Scale, Clock, Cloud, Flame, Anchor } from "lucide-react";

const verseLinkTriggerClass =
  "text-second-600 hover:text-second-800 font-mono underline underline-offset-4 decoration-second-600 hover:decoration-second-800 transition-colors";

function buildEnDeathGlossary(): readonly GlossaryGridItem[] {
  return [
    {
      term: "Soul",
      def: `The part of a person that continues after the body dies — the conscious self this lesson describes when it says we do not simply cease to exist.`,
      icon: Heart,
    },
    {
      term: "Judgment",
      def: `Standing before ${TERM_GOD_EN} to give account for our lives; the Bible teaches that people die once, and after that comes judgment.`,
      icon: Scale,
    },
    {
      term: "Eternal life",
      def: `Life that does not end when the body dies — ongoing forever, either with ${TERM_GOD_EN} or apart from him.`,
      icon: Clock,
    },
    {
      term: "Heaven",
      def: `In Scripture, the place where people are with ${TERM_GOD_EN} in peace and joy, without pain or tears.`,
      icon: Cloud,
    },
    {
      term: "Hell",
      def: `In Scripture, a state of separation from ${TERM_GOD_EN} and from the full life and relationship he gives.`,
      icon: Flame,
    },
    {
      term: "Hope (in the Bible)",
      def: `More than a positive feeling — trust in what ${TERM_GOD_EN} has done, especially through ${NAME_JESUS_EN}, so that people can be forgiven and receive eternal life.`,
      icon: Anchor,
    },
  ];
}

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
  const name = nameEn.trim().toLowerCase();
  const book = books.find((b) => b.nameEn.trim().toLowerCase() === name);
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
          triggerClassName={verseLinkTriggerClass}
          previewText="He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away."
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
          triggerClassName={verseLinkTriggerClass}
          previewText="They will be punished with everlasting destruction and shut out from the presence of the Lord and from the majesty of his power"
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
            <span className="font-semibold">{NAME_JESUS_EN}</span>.
          </>
        }
      />

      <RevealSection>
        <LearnHeroImage
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
          alt="Mountain at sunrise — a symbol of what lies beyond"
          credit="Photo on Unsplash"
          creditHref="https://unsplash.com"
        />
      </RevealSection>

      <RevealSection>
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
              <span className="font-semibold">{TERM_GOD_EN}</span> has revealed it to us.
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatHappensAfterDeathLifeContinues
          locale="en"
          heading="Life Continues After Death"
          lead={
            <>
              When a person dies, the body returns to dust — but the person does not cease
              to exist. We continue in another way — our soul, our conscious self, remains.
            </>
          }
          quote={
            <>
              &ldquo;Truly I tell you, today you will be with me in paradise.&rdquo;
            </>
          }
          reference={
            <BibleVerseLink
              langSegment="en"
              version1="niv"
              bookId={findBookIdByEn(books, "Luke")}
              chapter={23}
              verse={43}
              testament="nt"
              linkOnly
              triggerClassName={verseLinkTriggerClass}
            >
              Luke 23:43
            </BibleVerseLink>
          }
          explanation={
            <>
              {NAME_JESUS_EN} said this to the thief on the cross — showing that{" "}
              <strong>after death, we immediately stand before {TERM_GOD_EN}</strong>.
            </>
          }
        />
      </RevealSection>

      <RevealSection>
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
              triggerClassName={verseLinkTriggerClass}
            >
              Hebrews 9:27
            </BibleVerseLink>
          }
          body1={
            <>
              The <span className="font-semibold">Bible</span> says that{" "}
              <span className="font-semibold">{TERM_GOD_EN}</span> knows everything about us — not
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
      </RevealSection>

      <RevealSection>
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
      </RevealSection>

      <RevealSection>
        <LearnHopeBridge locale="en">
          This may sound serious — and it is. But{" "}
          <span className="font-semibold">the Bible</span> does not end with judgment. It
          speaks about <span className="font-semibold">hope</span>.
        </LearnHopeBridge>
      </RevealSection>

      <RevealSection>
        <LearnWhyItMatters locale="en" title="Why Does This Matter?">
          <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
            The Bible says that <span className="font-semibold">{TERM_GOD_EN}</span> does not want
            people to be separated from him. So he made a way — a real hope — that we are
            not left in brokenness or despair.
          </p>

          <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
            That way is <strong>{NAME_JESUS_EN}</strong>. Through him, people can be forgiven and
            receive eternal life.
          </p>

          <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
            If this is true, then the most important question becomes:{" "}
            <span className="font-semibold">
              Who is {NAME_JESUS_EN} — and what does he mean for you?
            </span>
          </p>
        </LearnWhyItMatters>
      </RevealSection>

      <RevealSection>
        <LearnWhatIsBibleGlossaryGrid
          glossaryTitle="Quick Glossary"
          items={buildEnDeathGlossary()}
          locale="en"
        />
      </RevealSection>
    </article>
  );
}
