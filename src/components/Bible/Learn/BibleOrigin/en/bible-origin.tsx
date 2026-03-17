"use client";

import { useState } from "react";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";
import { LearnBibleOriginIntro } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginIntro";
import { LearnBibleOriginLanguages } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginLanguages";
import {
  LearnBibleOriginTimeline,
  type TimelineItem,
  type MapLocationInfo,
} from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginTimeline";
import { LearnBibleOriginMapSection } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginMapSection";
import { LearnBibleOriginReliable } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginReliable";
import {
  LearnBibleOriginFaq,
  type FaqItem,
} from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginFaq";
import { cn } from "@/lib/utils";

function getMapLabels(
  loc: Record<MapLocationId, MapLocationInfo>
): Record<MapLocationId, string> {
  return {
    jerusalem: loc.jerusalem.label,
    qumran: loc.qumran.label,
    alexandria: loc.alexandria.label,
    rome: loc.rome.label,
    antioch: loc.antioch.label,
    sinai: loc.sinai.label,
  };
}

const EN_MAP_LOCATIONS: Record<MapLocationId, MapLocationInfo> = {
  jerusalem: {
    label: "Jerusalem",
    desc: "Heart of ancient Israel. Site of the Temple where Scripture was read and preserved for generations.",
  },
  qumran: {
    label: "Qumran",
    desc: "Dead Sea Scrolls found here (1947). Proved Old Testament texts unchanged for 1,000+ years.",
  },
  alexandria: {
    label: "Alexandria",
    desc: "Jewish scholars translated Old Testament to Greek (Septuagint) — Bible's first major translation.",
  },
  rome: {
    label: "Rome",
    desc: "Early churches grew here. Latin Vulgate translation became Western Christianity's standard Bible.",
  },
  antioch: {
    label: "Antioch",
    desc: "First place believers called 'Christians'. Base for Paul's missionary journeys spreading New Testament.",
  },
  sinai: {
    label: "Mount Sinai",
    desc: "Where Moses received the Law — foundation of Israel's Scriptures.",
  },
};

const EN_TIMELINE: readonly TimelineItem[] = [
  {
    year: "~1400 BC",
    event: "Pentateuch Written",
    desc: "Foundation of Israel's faith: Law, history, God's covenant with His people.",
  },
  {
    year: "~450 BC",
    event: "Old Testament Canon Forms",
    desc: "Law & Prophets established in Jewish worship and life.",
  },
  {
    year: "~250 BC",
    event: "Septuagint Translation",
    desc: "Greek Old Testament spreads Scriptures across Hellenistic world.",
  },
  {
    year: "50–95 AD",
    event: "New Testament Written",
    desc: "Gospels & letters circulated among early churches.",
  },
  {
    year: "367 AD",
    event: "27 NT Books Listed",
    desc: "Athanasius records books already widely used in churches.",
  },
  {
    year: "~400 AD",
    event: "Vulgate Completed",
    desc: "Latin Bible becomes Western Christianity's standard for 1,000+ years.",
  },
  {
    year: "1947",
    event: "Dead Sea Scrolls Found",
    desc: "Oldest manuscripts confirm text preserved accurately for centuries.",
  },
];

const EN_FAQ: readonly FaqItem[] = [
  {
    q: "Why do Protestant & Catholic Bibles differ?",
    a: "Catholic Bibles include 7 Deuterocanonical books from intertestamental period. Protestants follow Hebrew canon (66 books total vs 73).",
  },
  {
    q: "What are Dead Sea Scrolls?",
    a: "1947 discovery of oldest Hebrew Bible manuscripts (3rd century BC). Show remarkable consistency with later copies.",
  },
  {
    q: "Bible's original languages?",
    a: "Old Testament: Hebrew (mostly), Aramaic (portions). New Testament: Koine Greek.",
  },
  {
    q: "How was New Testament canon formed?",
    a: "Early churches used apostolic writings consistent with teaching, widely accepted by 4th century. Councils affirmed existing consensus.",
  },
];

export function EnBibleOriginPage() {
  const [mapActiveLocation, setMapActiveLocation] = useState<MapLocationId | null>(null);
  const mapLabels = getMapLabels(EN_MAP_LOCATIONS);
  return (
    <article aria-label="Bible Origin & Books Formation" className="text-foreground">
      <LearnBibleOriginIntro
        locale="en"
        bodyBright
        moduleNum="02 / 05"
        title="How Did We Get the Bible?"
        intro={
          <>
            <p className={cn("mb-6 leading-relaxed")}>
              Many people wonder: The <span className="font-semibold">Bible</span>
              was written thousands of years ago — how do we know today&apos;s version is
              trustworthy?
            </p>
            <p className={cn("mb-10 leading-relaxed")}>
              This lesson traces the <span className="font-semibold">Bible</span>&apos;s
              journey — from when it was first written and copied, to how it reached us
              today.
            </p>
          </>
        }
      />

      <LearnBibleOriginLanguages
        originalLanguages="Original Languages"
        lang={["Hebrew", "Greek", "Aramaic"]}
        langNote={[
          "Most of the Old Testament",
          "Entire New Testament",
          "Small portions of Daniel & Ezra",
        ]}
      />

      <LearnBibleOriginTimeline
        timeline="Manuscript Timeline"
        timelineItems={EN_TIMELINE}
        mapLocations={EN_MAP_LOCATIONS}
        mapLabels={mapLabels}
      />

      <LearnBibleOriginMapSection
        bodyBright
        mapTitle="Bible Manuscript Map"
        mapBody="Key locations where Scripture was written, copied, translated, and preserved through centuries."
        activeId={mapActiveLocation}
        onActiveChange={setMapActiveLocation}
        labels={mapLabels}
        renderPopover={(id) => EN_MAP_LOCATIONS[id]}
      />

      <LearnBibleOriginReliable
        reliableTitle="Why Is the Bible Considered Reliable?"
        reliableP1="The Bible hasn't just survived time — it's been preserved with remarkable accuracy. The New Testament alone has thousands of ancient manuscripts, far more than other ancient works."
        reliableP2="Minor variations exist between copies, but the core message remains consistent. The Dead Sea Scrolls (1947) showed the Old Testament barely changed after thousands of years."
        reliableP3={
          <>
            If the Bible is this reliable, the question isn&apos;t &quot;
            <strong>Is it true?</strong>&quot; anymore. It&apos;s: &quot;
            <strong>What does it say about YOUR future?</strong>&quot;
          </>
        }
      />

      <LearnBibleOriginFaq faqTitle="Common Questions" faq={EN_FAQ} />
    </article>
  );
}
