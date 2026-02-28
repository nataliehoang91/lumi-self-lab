"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

const PRAYER_GUIDE = [
  {
    step: "Adoration",
    desc: "Begin by acknowledging who God is — not what you want, just who he is. Praise him.",
  },
  {
    step: "Confession",
    desc: "Be honest about where you have fallen short. God already knows; this is for your freedom.",
  },
  {
    step: "Thanksgiving",
    desc: "Name specific things you are grateful for, however small.",
  },
  {
    step: "Supplication",
    desc: "Bring your requests — for yourself, for others, for the world.",
  },
] as const;

export default function WhatIsFaithPage() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";
  const h1Class =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";

  return (
    <div>
      <div className="mb-12">
        <p className="text-xs font-mono text-second mb-3">{intl.t("learnFaithModuleNum")}</p>
        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {intl.t("learnModule4Title")}
        </h1>
        <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>
          Faith is not blind optimism or religious effort. In the Bible, faith means trusting God —
          specifically, trusting that what he says is true and that Jesus is who he claimed to be.
        </p>
      </div>

      {/* Grace */}
      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-3">
          Salvation by Grace
        </h2>
        <p className={cn("text-muted-foreground leading-relaxed mb-3", bodyClass)}>
          The Christian message is that salvation — being made right with God — is not earned by
          good behaviour. It is received as a gift, through trusting in what Jesus did.
        </p>
        <blockquote className="border-l-2 border-border pl-4 py-2">
          <p className="font-bible-english text-base text-foreground italic leading-relaxed">
            &ldquo;For it is by grace you have been saved, through faith — and this is not from
            yourselves, it is the gift of God.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-mono">Ephesians 2:8</p>
        </blockquote>
      </section>

      {/* Repentance */}
      <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          Repentance
        </h2>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
          Repentance means a genuine change of direction — turning from a self-directed life toward
          God. It is not about feeling guilty, but about choosing a different way. Jesus&apos; first
          recorded words in Mark&apos;s Gospel are: &ldquo;Repent and believe the good news.&rdquo;
        </p>
        <p className="text-xs font-mono text-muted-foreground/60 mt-4">Mark 1:15</p>
      </section>

      {/* Prayer */}
      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          A Beginner&apos;s Prayer Guide
        </h2>
        <p className={cn("text-muted-foreground mb-5", bodyClass)}>
          Prayer is simply talking to God. A simple structure used for centuries is ACTS:
        </p>
        <div className="space-y-2">
          {PRAYER_GUIDE.map((p, i) => (
            <div
              key={p.step}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 font-mono text-xs text-muted-foreground font-semibold">
                {["A", "C", "T", "S"][i]}
              </div>
              <div>
                <p className={cn("font-medium text-foreground", bodyClass)}>{p.step}</p>
                <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Relationship */}
      <section className="mb-12 p-6 bg-foreground text-background rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold mb-3">
          A Relationship, Not a Religion
        </h2>
        <p className={cn("leading-relaxed opacity-80 mb-4", bodyClass)}>
          Christianity at its core is not a set of rules to follow but a person to know. Jesus said
          he came so that people &ldquo;may have life, and have it to the full&rdquo; (John 10:10).
          The goal is not perfect behaviour but an ongoing, honest relationship with God.
        </p>
        <p className={cn("leading-relaxed opacity-80", bodyClass)}>
          Reading Scripture, praying, and gathering with other believers are all ways of growing in
          that relationship — not conditions for earning it.
        </p>
      </section>

      {/* CTA */}
      <section className="p-6 bg-card border border-sage-dark/20 rounded-2xl space-y-3 mb-8">
        <p className="font-semibold text-foreground">Ready to start a 7-day reading plan?</p>
        <p className={cn("text-muted-foreground", bodyClass)}>
          Seven days, one chapter a day, starting with the Gospel of John.
        </p>
        <Link
          href="/bible/plans"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start 7-Day Plan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
