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

function getMapLabels(loc: Record<MapLocationId, MapLocationInfo>): Record<MapLocationId, string> {
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
    desc: "The spiritual centre of ancient Israel and the site of the Temple, where the Law was read and preserved.",
  },
  qumran: {
    label: "Qumran",
    desc: "Desert community near the Dead Sea where the Dead Sea Scrolls were discovered in 1947, confirming the reliability of Old Testament manuscripts.",
  },
  alexandria: {
    label: "Alexandria",
    desc: "A major centre of learning in the ancient world, where Jewish scholars produced the Greek translation of the Old Testament (the Septuagint).",
  },
  rome: {
    label: "Rome",
    desc: "Capital of the Roman Empire, where early Christian communities formed and key Latin translations like the Vulgate were produced.",
  },
  antioch: {
    label: "Antioch",
    desc: "One of the first major Gentile churches; a launching point for Paul's missionary journeys and the spread of the New Testament.",
  },
  sinai: {
    label: "Mount Sinai",
    desc: "The traditional site where Moses received the Law — the beginning of Israel's written Scriptures.",
  },
};

const EN_TIMELINE: readonly TimelineItem[] = [
  {
    year: "~1400 BC",
    event: "Earliest Old Testament Books Written (Pentateuch)",
    desc: "The Pentateuch laid the foundation of Israel's faith — including the Law, the primeval history, and the covenant between God and His people.",
  },
  {
    year: "~450 BC",
    event: "Old Testament Canon Largely Established",
    desc: "The Law and the Prophets were firmly established in Jewish worship and community life, forming the core of the Hebrew canon.",
  },
  {
    year: "~250 BC",
    event: "The Septuagint Produced in Alexandria",
    desc: "The first Greek translation of the Old Testament made the Scriptures accessible to the Hellenistic world and was widely used in the early Church.",
  },
  {
    year: "50–95 AD",
    event: "New Testament Books Written",
    desc: "The Gospels and apostolic letters were copied and circulated among churches throughout the Roman Empire, gradually being recognised as carrying spiritual authority.",
  },
  {
    year: "367 AD",
    event: "Athanasius Lists the 27 New Testament Books",
    desc: "For the first time, the full list of the 27 New Testament books was clearly recorded, reflecting the writings already widely used in the Church.",
  },
  {
    year: "~400 AD",
    event: "Jerome Completes the Vulgate",
    desc: "The Latin translation became the standard Bible of Western Christianity for over a millennium.",
  },
  {
    year: "1947",
    event: "Discovery of the Dead Sea Scrolls",
    desc: "Manuscripts dating as early as the third century BC demonstrated the remarkable preservation of the Old Testament text across many centuries of transmission.",
  },
];

const EN_FAQ: readonly FaqItem[] = [
  {
    q: "Why do Protestant and Catholic Bibles differ in length?",
    a: "Catholic Bibles include seven additional books often called the Deuterocanonical books, written during the intertestamental period. Protestant Reformers followed the traditional Hebrew canon, which did not include these writings — resulting in 66 books in most Protestant Bibles and 73 in Catholic editions.",
  },
  {
    q: "What are the Dead Sea Scrolls and why do they matter?",
    a: "Discovered in 1947 near the Dead Sea, the scrolls contain some of the oldest known manuscripts of the Hebrew Bible, dating as early as the third century BC. When compared with later medieval manuscripts, the text shows remarkable consistency, providing strong evidence for careful transmission over time.",
  },
  {
    q: "What languages was the Bible originally written in?",
    a: "The Old Testament was written primarily in Hebrew, with portions in Aramaic. The New Testament was written in Koine Greek, the widely spoken language of the eastern Roman Empire in the first century.",
  },
  {
    q: "How was the New Testament canon recognised?",
    a: "Early Christian communities evaluated writings based on apostolic connection, consistency with established teaching, and widespread usage in churches. By the fourth century, the 27 books of the New Testament were broadly recognised across the Christian world. Church councils later affirmed what had already become widely accepted.",
  },
];

export function EnBibleOriginPage() {
  const [mapActiveLocation, setMapActiveLocation] = useState<MapLocationId | null>(null);
  const mapLabels = getMapLabels(EN_MAP_LOCATIONS);

  return (
    <article aria-label="Bible Origin & Canon Formation">
      <LearnBibleOriginIntro
        moduleNum="02 / 04"
        title="Bible Origin & Canon Formation"
        intro="How did 66 books, written by more than 40 authors across 1,500 years and three continents, come to be recognised as the Bible? The story spans ancient Israel, the early church, manuscript transmission, and archaeological discoveries that continue to shape our understanding today."
      />

      <LearnBibleOriginLanguages
        originalLanguages="Original Languages"
        lang={["Hebrew", "Greek", "Aramaic"]}
        langNote={[
          "The primary language of the Old Testament — the language of Israel's law, poetry, and prophecy.",
          "Koine Greek — the common language of the Roman Empire and the original language of the New Testament.",
          "A related Semitic language used in parts of Daniel and Ezra, and widely spoken in the time of Jesus.",
        ]}
      />

      <LearnBibleOriginTimeline
        timeline="Manuscript Timeline"
        timelineItems={EN_TIMELINE}
        mapLocations={EN_MAP_LOCATIONS}
        mapLabels={mapLabels}
      />

      <LearnBibleOriginMapSection
        mapTitle="Biblical Manuscript Map"
        mapBody="A few of the key locations where Scripture was written, copied, translated, and preserved."
        activeId={mapActiveLocation}
        onActiveChange={setMapActiveLocation}
        labels={mapLabels}
        renderPopover={(id) => EN_MAP_LOCATIONS[id]}
      />

      <LearnBibleOriginReliable
        reliableTitle="Why Is the Bible Considered Reliable?"
        reliableP1="The New Testament is supported by more manuscript evidence than any other work of ancient literature — over 5,800 Greek manuscripts and more than 25,000 in total across ancient languages. The time gap between the original writings and our earliest surviving copies is comparatively short, often within a few generations."
        reliableP2="The discovery of the Dead Sea Scrolls demonstrated that the Hebrew Scriptures had been preserved with extraordinary consistency over centuries of careful copying. Jewish scribal tradition was highly meticulous, contributing to the stability of the biblical text over time."
      />

      <LearnBibleOriginFaq faqTitle="Common Questions" faq={EN_FAQ} />
    </article>
  );
}
