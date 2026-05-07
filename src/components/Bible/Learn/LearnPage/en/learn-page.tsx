"use client";

import { LearnPageIntro } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageIntro";
import { LearnPageModuleCard } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageModuleCard";
import { LearnPageVerseCta } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageVerseCta";

const SEGMENTS = [
  "what-is-bible",
  "bible-origin",
  "who-is-jesus",
  "what-happens-after-death",
  "what-is-faith",
] as const;

const MODULES = [
  {
    num: "01",
    title: "What Is the Bible?",
    desc: "The Bible is more than a collection of ancient books about religion. It tells the story of God, humanity, and the meaning of life.",
    min: 5,
  },
  {
    num: "02",
    title: "Where Did the Bible Come From?",
    desc: "The Bible was written thousands of years ago. How do we know what we read today is still accurate and trustworthy?",
    min: 8,
  },
  {
    num: "03",
    title: "Who Is Jesus?",
    desc: (
      <>
        Jesus is the central figure of the Bible. Who was He, what did He do, and why do
        His death and resurrection matter?
      </>
    ),
    min: 6,
  },
  {
    num: "04",
    title: "What Happens After Death?",
    desc: "What happens after people die? What does the Bible say about what awaits us beyond death?",
    min: 5,
  },
  {
    num: "05",
    title: "What Is Faith?",
    desc: (
      <>
        What is faith? Is believing in God simply following a religion, or something
        deeper?
      </>
    ),
    min: 5,
  },
] as const;

export function EnLearnPage({ verseHref }: { verseHref: string }) {
  return (
    <article aria-label="Learn - Start here">
      <LearnPageIntro
        eyebrow="Start Here"
        title="Begin with the foundation."
        subtitle={
          <>
            Before reading the Bible in detail, step back and see the bigger picture —
            what story it tells, who <strong>Jesus</strong> is, and why faith has mattered
            to millions across history.
          </>
        }
      />

      <p className="mb-4 text-sm opacity-70">
        Follow the path in order, or begin with the question that feels most urgent to
        you.
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
            segmentKey={SEGMENTS[i]}
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
        verseHref={verseHref}
      />
    </article>
  );
}
