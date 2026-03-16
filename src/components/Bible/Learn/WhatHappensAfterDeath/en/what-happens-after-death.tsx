"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

const COMPARISON = [
  {
    title: "Heaven",
    description:
      "Life with God — a place of peace, joy, and restoration where suffering and death are gone.",
    verses: "John 14:2–3 · Revelation 21:4",
  },
  {
    title: "Hell",
    description:
      "Separation from God — the result of rejecting the life and relationship he offers.",
    verses: "Matthew 8:12 · Revelation 20:15",
  },
] as const;

export function EnWhatHappensAfterDeathPage() {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();

  return (
    <article className="text-foreground" aria-label="What Happens After Death?">
      <LearnLessonIntro
        bodyBright
        moduleNum="04 / 05"
        title="What Happens After Death?"
        intro1="Death is not the end. The Bible teaches that after we die, we stand before God and enter eternal life."
        intro1Quote="People are destined to die once, and after that to face judgment."
      >
        <>
          This lesson explains what the Bible says about life after death, the reality of
          judgment, two eternal destinations, and the hope found in Jesus.
        </>
      </LearnLessonIntro>

      {/* Universal Question */}
      <section className="mb-10">
        <p className={cn("text-muted-foreground mb-4 leading-relaxed", bodyClassUp)}>
          Every culture asks the same question:
          <strong> what happens after we die?</strong>
        </p>

        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          Some believe death is the end. Others believe in reincarnation or some form of
          spiritual existence. The Bible gives a clear answer: life after death is real,
          and God reveals what awaits us.
        </p>
      </section>

      {/* Life Continues */}
      <section className="mb-10">
        <h2 className="font-bible-english text-foreground mb-4 text-2xl font-semibold">
          Death Is Not the End
        </h2>
        <p className={cn("text-muted-foreground mb-4 leading-relaxed", bodyClassUp)}>
          The Bible teaches that when a person dies, they do not simply stop existing. Our
          bodies return to the earth, but our souls continue.
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          When Jesus was on the cross, he told the thief beside him, “Today you will be
          with me in paradise” (Luke 23:43). This shows that life continues beyond
          physical death.
        </p>
      </section>

      {/* Accountability */}
      <section className="border-border bg-card mb-10 rounded-2xl border p-6">
        <h2 className="font-bible-english text-foreground mb-3 text-xl font-semibold">
          One Day We Will Stand Before God
        </h2>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          The Bible says, “People are destined to die once, and after that to face
          judgment” (Hebrews 9:27).
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          This means that our lives matter. The way we live, the choices we make, and the
          direction of our hearts are not meaningless. One day we will stand before God,
          who knows everything about us.
        </p>
      </section>

      {/* Two Destinies */}
      <section className="mb-10">
        <h2 className="font-bible-english text-foreground mb-5 text-xl font-semibold">
          Two Eternal Destinations
        </h2>

        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClassUp)}>
          According to the Bible, every person will ultimately experience one of two
          eternal realities.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMPARISON.map((item) => (
            <div
              key={item.title}
              className="border-border bg-card rounded-2xl border p-5"
            >
              <p className="text-foreground mb-2 font-semibold">{item.title}</p>
              <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClass)}>
                {item.description}
              </p>
              <p className="text-muted-foreground/60 font-mono text-xs">{item.verses}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Hope */}
      <section className="border-primary/30 bg-primary/10 mb-10 rounded-2xl border p-6">
        <h2 className="font-bible-english text-foreground mb-3 text-xl font-semibold">
          The Hope the Bible Gives
        </h2>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          The message of the Bible is not meant to frighten people, but to give hope.
        </p>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          Jesus died on the cross and rose again. Through him, people can be forgiven and
          restored to a relationship with God.
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          For those who trust in Jesus, death is no longer the end. It becomes the doorway
          into eternal life with God.
        </p>
      </section>

      {/* Call to action */}
      <section className="bg-foreground text-background mb-10 rounded-2xl p-6">
        <h2 className="font-bible-english mb-3 text-xl font-semibold">What About You?</h2>
        <p className="mb-3 text-sm leading-relaxed opacity-90">
          The question of life after death is not just philosophical. It is about your
          future.
        </p>
        <p className="mb-5 text-sm leading-relaxed opacity-90">
          The Bible says true hope is found in Jesus — the one who reconnects us to God
          and gives eternal life.
        </p>
        <Link
          href="/bible/en/learn/what-is-faith"
          className="inline-flex items-center gap-2 text-sm font-medium opacity-90
            transition-opacity hover:opacity-100"
        >
          Next: What is Faith? <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </article>
  );
}
