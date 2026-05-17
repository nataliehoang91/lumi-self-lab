/**
 * Generates additional Bible topics and appends them to bible-topics-data.ts
 * Run: npx tsx prisma/seed/add-bible-topics.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type TopicCategory = "faith" | "emotions" | "relationships" | "guidance" | "identity" | "prayer" | "eternity" | "wisdom";

const NEW_TOPICS: {
  slug: string;
  nameEn: string;
  nameVi: string;
  category: TopicCategory;
  icon: string;
}[] = [
  // Family roles
  { slug: "mother",          nameEn: "Mother",               nameVi: "Người mẹ",             category: "relationships", icon: "Heart" },
  { slug: "father",          nameEn: "Father",               nameVi: "Người cha",             category: "relationships", icon: "Shield" },
  { slug: "children",        nameEn: "Children",             nameVi: "Con cái",               category: "relationships", icon: "Baby" },
  { slug: "siblings",        nameEn: "Brothers & Sisters",   nameVi: "Anh chị em",            category: "relationships", icon: "Users" },
  { slug: "elderly",         nameEn: "Honoring the Elderly", nameVi: "Kính trọng người lớn",  category: "relationships", icon: "Star" },

  // Emotions (more)
  { slug: "depression",      nameEn: "Depression",           nameVi: "Trầm cảm",              category: "emotions", icon: "CloudRain" },
  { slug: "shame",           nameEn: "Shame & Guilt",        nameVi: "Xấu hổ & Tội lỗi",      category: "emotions", icon: "Moon" },
  { slug: "gratitude",       nameEn: "Gratitude",            nameVi: "Lòng biết ơn",           category: "emotions", icon: "Gift" },
  { slug: "contentment",     nameEn: "Contentment",          nameVi: "Sự thỏa lòng",           category: "emotions", icon: "Sun" },

  // Guidance (more)
  { slug: "generosity",      nameEn: "Generosity & Giving",  nameVi: "Sự hào phóng",          category: "guidance", icon: "HandHeart" },
  { slug: "rest",            nameEn: "Rest & Sabbath",       nameVi: "Nghỉ ngơi & An nghỉ",   category: "guidance", icon: "Moon" },
  { slug: "leadership",      nameEn: "Leadership",           nameVi: "Lãnh đạo",              category: "guidance", icon: "Crown" },
  { slug: "justice",         nameEn: "Justice & Mercy",      nameVi: "Công lý & Thương xót",  category: "guidance", icon: "Scale" },

  // Wisdom (more)
  { slug: "temptation",      nameEn: "Temptation",           nameVi: "Cám dỗ",                category: "wisdom", icon: "Zap" },
  { slug: "healing",         nameEn: "Healing & Sickness",   nameVi: "Chữa lành & Bệnh tật", category: "wisdom", icon: "Heart" },
  { slug: "perseverance",    nameEn: "Perseverance",         nameVi: "Sự kiên trì",           category: "wisdom", icon: "Flame" },
  { slug: "community",       nameEn: "Community & Church",   nameVi: "Cộng đồng & Hội thánh", category: "wisdom", icon: "Users" },
  { slug: "evangelism",      nameEn: "Sharing Your Faith",   nameVi: "Chia sẻ đức tin",       category: "faith", icon: "Megaphone" },
  { slug: "death-dying",     nameEn: "Death & Dying",        nameVi: "Cái chết",              category: "eternity", icon: "Sunset" },
];

interface TopicVerse {
  ref: string; bookSlug: string; chapter: number; verse: number;
  textEn: string; textVi: string; noteEn: string; noteVi: string;
}
interface TopicData {
  slug: string; nameEn: string; nameVi: string; category: TopicCategory; icon: string;
  introEn: string; introVi: string; verses: TopicVerse[];
}

async function generateTopic(def: (typeof NEW_TOPICS)[0]): Promise<TopicData> {
  const prompt = `You are a biblical scholar. Generate topic study data for the Bible topic "${def.nameEn}" (Vietnamese: ${def.nameVi}).

Return ONLY valid JSON (no markdown, no explanation):
{
  "introEn": "2-3 sentence introduction in English about what the Bible says",
  "introVi": "2-3 sentence introduction in Vietnamese (use Vietnamese Bible names: Đức Chúa Trời, Chúa Giê-xu, etc.)",
  "verses": [
    {
      "ref": "Proverbs 31:25",
      "bookSlug": "proverbs",
      "chapter": 31,
      "verse": 25,
      "textEn": "accurate NIV text",
      "textVi": "accurate Vietnamese Bible text",
      "noteEn": "brief note under 12 words",
      "noteVi": "ghi chú ngắn dưới 12 từ"
    }
  ]
}

Rules:
- Exactly 6 verses, well-known and directly relevant
- bookSlug: lowercase with hyphens (e.g. "1-corinthians", "song-of-solomon")
- Keep verse texts accurate; keep notes under 12 words each`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  const generated = JSON.parse(json);
  return { ...def, introEn: generated.introEn, introVi: generated.introVi, verses: generated.verses };
}

async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  console.log(`Adding ${NEW_TOPICS.length} new topics...`);
  const results: TopicData[] = [];

  for (const def of NEW_TOPICS) {
    process.stdout.write(`  ${def.nameEn}... `);
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const data = await generateTopic(def);
        results.push(data);
        console.log("✓");
        break;
      } catch (err) {
        if (attempt >= 3) {
          console.log(`✗ FAILED: ${(err as Error).message}`);
          results.push({ ...def, introEn: "", introVi: "", verses: [] });
        } else {
          await sleep(1000);
        }
      }
    }
    await sleep(400);
  }

  // Append to existing file
  const filePath = path.resolve(__dirname, "../../src/lib/bible-topics-data.ts");
  let content = fs.readFileSync(filePath, "utf8");

  // Insert new topics before the closing ]; of BIBLE_TOPICS
  const newEntries = results.map((r) => JSON.stringify(r, null, 2)).join(",\n");
  content = content.replace(/\];\s*\nexport const TOPIC_CATEGORIES/, `  ,\n${newEntries}\n];\n\nexport const TOPIC_CATEGORIES`);

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`\nAppended ${results.length} topics to bible-topics-data.ts`);
}

main().catch((e) => { console.error(e); process.exit(1); });
