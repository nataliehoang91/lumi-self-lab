"use client";

import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnFullyGodManSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnFullyGodManSection";
import { LearnCrossSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnCrossSection";
import { LearnProphecySection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";
import { LearnWhyCtaSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnWhyCtaSection";

const PROPHECY_ITEMS = [
  { prophecy: "Born in Bethlehem", ref: "Micah 5:2", fulfilled: "Matthew 2:1" },
  { prophecy: "Born of a virgin", ref: "Isaiah 7:14", fulfilled: "Luke 1:27" },
  {
    prophecy: "Entered Jerusalem on a donkey",
    ref: "Zechariah 9:9",
    fulfilled: "Mark 11:7",
  },
  {
    prophecy: "Betrayed for 30 pieces of silver",
    ref: "Zechariah 11:12",
    fulfilled: "Matthew 26:15",
  },
  {
    prophecy: "Crucified, hands and feet pierced",
    ref: "Psalm 22:16",
    fulfilled: "Luke 24:39",
  },
  { prophecy: "Rose from the dead", ref: "Psalm 16:10", fulfilled: "Acts 2:31" },
];

export function EnWhoIsJesus() {
  return (
    <article aria-label="Who Is Jesus? lesson">
      <LearnLessonIntro
        moduleNum="03 / 04"
        title="Who Is Jesus?"
        intro1={
          <>
            For over two thousand years, people have debated who <strong>Jesus</strong> really
            was.{" "}
          </>
        }
        intro1Quote="A teacher? A prophet? A revolutionary? A myth? A Son of God? Or someone who is far greater than we can imagine?"
      >
        <>
          <strong>Jesus</strong> of Nazareth is the central figure of the entire Bible — not just
          the New Testament. Everything in the Old Testament points toward <strong>Him</strong>;
          everything after <strong>Him</strong> flows from <strong>Him</strong>.
        </>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        sectionTitle="Fully God. Fully Man."
        leftTitle="Fully Human"
        leftBody={
          <>
            Jesus was born, grew up in an ordinary family, felt hunger and exhaustion, experienced
            sorrow, and ultimately faced death. <strong>He</strong> entered the human condition
            fully — not from a distance, but from within.
          </>
        }
        leftRef="John 11:35 · Hebrews 4:15"
        rightTitle="Fully Divine"
        rightBody={
          <>
            Yet <strong>He</strong> also forgave sins, commanded the wind and waves, received
            worship, and rose from the dead. The New Testament presents <strong>Him</strong> not
            merely as a messenger of God, but as God incarnate.
          </>
        }
        rightRef="John 1:1 · Colossians 2:9"
      />

      <LearnCrossSection
        title="The Cross & Resurrection"
        paragraph1={
          <>
            Around 30 AD, Jesus was crucified under the Roman governor Pontius Pilate. Christians
            believe this was not a tragic accident of history, but the center of God&apos;s
            redemptive plan. On the cross, <strong>He</strong> willingly bore the weight of human
            sin — opening the way for forgiveness and reconciliation with God.
          </>
        }
        paragraph2={
          <>
            Three days later, <strong>He</strong> rose bodily from the dead. This resurrection was
            proclaimed from the earliest days of the church, supported by eyewitness testimony and
            multiple independent accounts. For Christians, it is not a symbol, but the decisive
            turning point of history.
          </>
        }
        refText="1 Corinthians 15:3–8"
      />

      <LearnProphecySection
        title="Fulfilment of Prophecy"
        intro={
          <>
            Long before Jesus was born, the Hebrew Scriptures spoke of a coming Messiah — describing{" "}
            <strong>His</strong> birthplace, <strong>His</strong> suffering, and even the manner of{" "}
            <strong>His</strong> death. Christians believe these promises converged in{" "}
            <strong>Him</strong>. Here are six examples.
          </>
        }
        items={PROPHECY_ITEMS}
      />

      <LearnWhyCtaSection
        title="Why Does Jesus Matter Today?"
        paragraph1={
          <>
            If Jesus truly rose from the dead, then <strong>His</strong> life cannot be reduced to a
            moral example or an inspiring story. <strong>He</strong> claimed to be &quot;the way,
            the truth, and the life&quot; (John 14:6) — not simply offering advice, but inviting
            people into reconciliation with God.
          </>
        }
        paragraph2={
          <>
            For Christians, faith in Jesus is not merely belief in a doctrine, but trust in a living
            person — one who offers forgiveness, purpose, and eternal hope.
          </>
        }
        linkHref="/bible/en/read"
        linkLabel="Read the Gospels"
      />
    </article>
  );
}
