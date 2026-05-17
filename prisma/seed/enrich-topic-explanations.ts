/**
 * Enriches existing Bible topic verses with plain-language explanations for non-Christians.
 * Run: npx tsx prisma/seed/enrich-topic-explanations.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function generateExplanations(topicNameEn: string, topicNameVi: string, verses: { ref: string; textEn: string; textVi: string }[]): Promise<{ explanationEn: string; explanationVi: string }[]> {
  const verseList = verses.map((v, i) => `${i + 1}. ${v.ref}: "${v.textEn}"`).join("\n");

  const prompt = `You are helping non-Christians understand Bible verses about the topic "${topicNameEn}" (Vietnamese: ${topicNameVi}).

For each verse below, write a plain-language explanation (2-3 sentences) that:
- Explains what the verse means in everyday terms
- Shows how it relates to the topic "${topicNameEn}"
- Is accessible to someone with no religious background

Verses:
${verseList}

Return ONLY valid JSON array (no markdown):
[
  {
    "explanationEn": "2-3 sentence plain English explanation",
    "explanationVi": "Giải thích 2-3 câu bằng tiếng Việt dễ hiểu cho người chưa theo đạo"
  }
]

Rules:
- Exactly ${verses.length} objects in array, same order as verses
- Write for a curious non-Christian audience
- Avoid jargon; explain any religious terms used
- Keep each explanation to 2-3 sentences max`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json);
}

async function main() {
  const filePath = path.resolve(__dirname, "../../src/lib/bible-topics-data.ts");
  const content = fs.readFileSync(filePath, "utf8");

  // Extract the BIBLE_TOPICS array
  const match = content.match(/export const BIBLE_TOPICS: BibleTopic\[\] = (\[[\s\S]*?\]);\s*\nexport const TOPIC_CATEGORIES/);
  if (!match) {
    console.error("Could not find BIBLE_TOPICS array");
    process.exit(1);
  }

  const topics = JSON.parse(match[1]);
  console.log(`Found ${topics.length} topics to enrich`);

  for (const topic of topics) {
    if (!topic.verses || topic.verses.length === 0) continue;

    // Skip if already enriched
    if (topic.verses[0]?.explanationEn) {
      console.log(`  ${topic.nameEn} — already enriched, skipping`);
      continue;
    }

    process.stdout.write(`  ${topic.nameEn}... `);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const explanations = await generateExplanations(topic.nameEn, topic.nameVi, topic.verses);
        for (let i = 0; i < topic.verses.length; i++) {
          if (explanations[i]) {
            topic.verses[i].explanationEn = explanations[i].explanationEn;
            topic.verses[i].explanationVi = explanations[i].explanationVi;
          }
        }
        console.log("✓");
        break;
      } catch (err) {
        if (attempt >= 3) {
          console.log(`✗ FAILED: ${(err as Error).message}`);
        } else {
          await sleep(1000);
        }
      }
    }
    await sleep(500);
  }

  // Write back — replace the BIBLE_TOPICS array
  const newArray = JSON.stringify(topics, null, 2);
  const newContent = content.replace(
    /export const BIBLE_TOPICS: BibleTopic\[\] = \[[\s\S]*?\];\s*\nexport const TOPIC_CATEGORIES/,
    `export const BIBLE_TOPICS: BibleTopic[] = ${newArray};\n\nexport const TOPIC_CATEGORIES`
  );

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`\nDone — enriched ${topics.length} topics`);
}

main().catch((e) => { console.error(e); process.exit(1); });
