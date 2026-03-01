"use client";

import { LearnPageIntro } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageIntro";
import { LearnPageModuleCard } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageModuleCard";
import { LearnPageVerseCta } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageVerseCta";

const SEGMENTS = ["bible-structure", "bible-origin", "who-is-jesus", "what-is-faith"] as const;

const MODULES = [
  {
    num: "01",
    title: "What Is the Bible?",
    desc: "The Bible is more than a collection of ancient books. It tells one unfolding story — from creation to redemption — woven across centuries.",
    min: 5,
  },
  {
    num: "02",
    title: "How the Bible Came to Be",
    desc: "Written and preserved over thousands of years, the Bible’s journey raises an important question: how do we know what we read today reflects the original message?",
    min: 8,
  },
  {
    num: "03",
    title: "Who Is Jesus?",
    desc: (
      <>
        At the center of the Bible stands <strong>Jesus</strong>. What did He claim about Himself —
        and why have His life, death, and resurrection shaped history ever since?
      </>
    ),
    min: 6,
  },
  {
    num: "04",
    title: "What Is Faith?",
    desc: (
      <>
        Faith is more than believing an idea. What does it mean to trust God — and how might that
        reshape the way you live, think, and hope?
      </>
    ),
    min: 5,
  },
] as const;

export function EnLearnPage() {
  return (
    <article aria-label="Learn - Start here">
      <LearnPageIntro
        eyebrow="Start Here"
        title="Begin with the foundation."
        subtitle={
          <>
            Before reading the Bible in detail, step back and see the bigger picture — what story it
            tells, who <strong>Jesus</strong> is, and why faith has mattered to millions across
            history.
          </>
        }
      />

      <p className="text-sm opacity-70 mb-4">
        Follow the path in order, or begin with the question that feels most urgent to you.
      </p>

      <div className="space-y-6">
        {MODULES.map((m, i) => (
          <LearnPageModuleCard
            key={m.num}
            num={m.num}
            title={m.title}
            desc={m.desc}
            min={m.min}
            minLabel="min read"
            readLabel="Read"
            href={`/bible/en/learn/${SEGMENTS[i]}`}
            ariaLabel={`${m.title}, ${m.min} min read`}
          />
        ))}
      </div>

      <LearnPageVerseCta
        verseText="Your word is a lamp to my feet and a light to my path."
        verseRef="PSALM 119:105"
        ctaTitle="Ready to go further?"
        ctaSubtitle="Don't just learn about the Bible — open it and read for yourself."
        ctaLabel="Open the Bible"
        readHref="/bible/en/read"
      />
    </article>
  );
}
