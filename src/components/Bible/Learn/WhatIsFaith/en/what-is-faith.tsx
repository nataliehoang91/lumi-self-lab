"use client";

import Link from "next/link";
import { LearnWhatIsFaithIntro } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithIntro";
import { LearnWhatIsFaithGraceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithGraceSection";
import { LearnWhatIsFaithRepentanceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithRepentanceSection";
import { LearnWhatIsFaithPrayerSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithPrayerSection";
import { LearnWhatIsFaithRelationshipBlock } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithRelationshipBlock";
import { LearnWhyItMatters } from "../../WhatIsBible/shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import {
  type GlossaryItem,
  LearnWhatIsFaithGlossary,
} from "../shared-components/LearnWhatIsFaithGlossary";
import type { BibleBook } from "@/components/Bible/Read/types";

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

const EN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Grace",
    def: "God’s undeserved gift. In Christian faith, salvation is not based on human merit, but is a gift from him.",
  },
  {
    term: "Salvation",
    def: "Being rescued from sin and reconciled to God, opening a new relationship with him.",
  },
  {
    term: "Repentance",
    def: "A real change of direction — turning away from sin and turning back to God. More than a feeling of guilt; it is a decision.",
  },
  {
    term: "Gospel",
    def: "The good news of salvation through Jesus — that he died and rose again to bring forgiveness and hope.",
  },
  {
    term: "Church",
    def: "The community of people who believe in Jesus. Not only a building, but a family of faith.",
  },
  {
    term: "Prayer",
    def: "Conversation with God. Not a complicated ritual, but a relationship.",
  },
];

export function EnWhatIsFaithPage({ books }: { books: BibleBook[] }) {
  const { bodyClassUp } = useBibleFontClasses();

  const johnHref = buildReadHrefEn(findBookIdByEn(books, "John"), 10, 10, "nt");

  return (
    <article className="text-foreground" aria-label="What Is Faith?">
      <LearnWhatIsFaithIntro
        bodyBright
        locale="en"
        moduleNum="05 / 05"
        title="What Is Faith?"
        intro={`Faith is not blind optimism or trying to become better through your own effort alone.

In the Bible, faith means placing your trust in God — believing that what he says is true, and that Jesus is the one he has made known.`}
      />

      <LearnWhatIsFaithRelationshipBlock
        title="A Relationship, Not a Religion"
        main={
          <>
            Christianity is not simply a system of rules to follow, but a relationship to
            enter. Jesus said he came so that people &ldquo;may have life, and have it to
            the full&rdquo;{" "}
            <Link
              href={johnHref}
              className="text-md text-second-600 hover:text-second-800 font-mono underline
                underline-offset-4 transition-colors"
            >
              (John 10:10)
            </Link>
            . The goal is not perfection, but walking in a real relationship with God.
          </>
        }
        footer={
          <>
            Reading Scripture, praying, and gathering with other believers are ways of
            growing in that relationship — not conditions for being accepted.
          </>
        }
      />

      <LearnWhatIsFaithGraceSection
        bodyBright
        locale="en"
        graceTitle="Salvation by Grace"
        graceBody="The central message of Christianity is salvation — being reconciled to God. This is not earned by good deeds, but received as a gift, through faith in what Jesus has done."
        graceQuote="For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God."
        graceRef="Ephesians 2:8"
        graceFootnoteHref={buildReadHrefEn(
          findBookIdByEn(books, "Ephesians"),
          2,
          8,
          "nt"
        )}
      />

      <LearnWhatIsFaithRepentanceSection
        bodyBright
        locale="en"
        repentanceTitle="Repentance"
        repentanceBody='Repentance is more than a feeling of guilt. It is a change of direction — turning away from a life ruled by self and turning back to God. When Jesus began his ministry, he said, &ldquo;Repent and believe the good news.&rdquo;'
        repentanceRef="Mark 1:15"
        repentanceRefHref={buildReadHrefEn(findBookIdByEn(books, "Mark"), 1, 15, "nt")}
      />

      <LearnWhatIsFaithPrayerSection
        bodyBright
        locale="en"
        prayerTitle="Where does faith begin?"
        prayerIntro="Faith does not begin with trying to make yourself a better person. It begins with trust — trusting that God is real and that Jesus is the one he has revealed."
        steps={[
          {
            letter: "1",
            stepName: "Hear",
            desc: "Listen to the message of the Gospel — what the Bible says about God and human beings.",
          },
          {
            letter: "2",
            stepName: "Trust",
            desc: "Place your trust in Jesus, not in your own striving.",
          },
          {
            letter: "3",
            stepName: "Read",
            desc: "Begin reading the Bible — especially the Gospels — to understand more clearly who Jesus is.",
          },
          {
            letter: "4",
            stepName: "Follow",
            desc: "Live in that trust each day, even while much is still unclear.",
          },
        ]}
      />

      <LearnWhyItMatters locale="en" title="Why does faith matter?">
        <div className="space-y-4">
          <p className={cn("leading-relaxed", bodyClassUp)}>
            Everyone is already trusting something — about their own worth, about what
            brings hope, and about what helps them stand firm when everything shakes. The
            question is not whether you have faith, but where you are placing it.
          </p>

          <p className={cn("leading-relaxed", bodyClassUp)}>
            If faith is only positive thinking, it easily falls apart when circumstances
            change. But if{" "}
            <span className="font-semibold">faith is placed in Jesus</span> — the one who
            rose from the dead and does not change — it becomes a{" "}
            <span className="font-semibold">firm foundation</span> amid anxiety and
            uncertainty.
          </p>

          <p className={cn("leading-relaxed", bodyClassUp)}>
            <span className="font-semibold">The Bible</span> says that through him, people
            can be forgiven, have a new life full of meaning, and a hope that goes beyond
            even death — that is{" "}
            <span className="font-semibold">eternal life </span>
            after death.
          </p>
          <p className={cn("leading-relaxed", bodyClassUp)}>
            Faith is not only knowing about God, but{" "}
            <span className="font-semibold">trusting him</span>, following him, and letting
            him lead your life.
          </p>

          <p className={cn("pt-1 leading-relaxed font-semibold", bodyClassUp)}>
            So what are you placing your faith in?
            <br />
            And are you ready to begin trusting in Jesus?
          </p>
        </div>
      </LearnWhyItMatters>

      <LearnWhatIsFaithGlossary
        glossaryTitle="Quick Glossary"
        glossary={EN_GLOSSARY}
        locale="en"
      />
    </article>
  );
}
