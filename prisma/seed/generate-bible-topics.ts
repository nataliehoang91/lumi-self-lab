/**
 * Generates static Bible topic data using Claude and writes to src/lib/bible-topics-data.ts
 * Run: npx tsx prisma/seed/generate-bible-topics.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type TopicCategory =
  | "faith"
  | "emotions"
  | "relationships"
  | "guidance"
  | "identity"
  | "prayer"
  | "eternity"
  | "wisdom";

const TOPIC_DEFINITIONS: {
  slug: string;
  nameEn: string;
  nameVi: string;
  category: TopicCategory;
  icon: string;
}[] = [
  // Faith
  { slug: "faith", nameEn: "Faith", nameVi: "Đức tin", category: "faith", icon: "Flame" },
  { slug: "salvation", nameEn: "Salvation", nameVi: "Sự cứu rỗi", category: "faith", icon: "Cross" },
  { slug: "grace", nameEn: "Grace", nameVi: "Ân điển", category: "faith", icon: "Sparkles" },
  { slug: "repentance", nameEn: "Repentance", nameVi: "Sự ăn năn", category: "faith", icon: "RefreshCcw" },
  { slug: "baptism", nameEn: "Baptism", nameVi: "Báp-têm", category: "faith", icon: "Droplets" },
  { slug: "holy-spirit", nameEn: "Holy Spirit", nameVi: "Đức Thánh Linh", category: "faith", icon: "Wind" },

  // Emotions
  { slug: "anxiety", nameEn: "Anxiety", nameVi: "Lo lắng", category: "emotions", icon: "Heart" },
  { slug: "fear", nameEn: "Fear", nameVi: "Sự sợ hãi", category: "emotions", icon: "Shield" },
  { slug: "grief", nameEn: "Grief", nameVi: "Nỗi đau buồn", category: "emotions", icon: "CloudRain" },
  { slug: "joy", nameEn: "Joy", nameVi: "Niềm vui", category: "emotions", icon: "Sun" },
  { slug: "anger", nameEn: "Anger", nameVi: "Sự tức giận", category: "emotions", icon: "Zap" },
  { slug: "loneliness", nameEn: "Loneliness", nameVi: "Sự cô đơn", category: "emotions", icon: "User" },
  { slug: "hope", nameEn: "Hope", nameVi: "Hy vọng", category: "emotions", icon: "Sunrise" },
  { slug: "peace", nameEn: "Peace", nameVi: "Bình an", category: "emotions", icon: "Anchor" },

  // Relationships
  { slug: "love", nameEn: "Love", nameVi: "Tình yêu thương", category: "relationships", icon: "Heart" },
  { slug: "marriage", nameEn: "Marriage", nameVi: "Hôn nhân", category: "relationships", icon: "Rings" },
  { slug: "family", nameEn: "Family", nameVi: "Gia đình", category: "relationships", icon: "Home" },
  { slug: "friendship", nameEn: "Friendship", nameVi: "Tình bạn", category: "relationships", icon: "Users" },
  { slug: "forgiveness", nameEn: "Forgiveness", nameVi: "Sự tha thứ", category: "relationships", icon: "HeartHandshake" },
  { slug: "conflict", nameEn: "Conflict", nameVi: "Xung đột", category: "relationships", icon: "Swords" },
  { slug: "parenting", nameEn: "Parenting", nameVi: "Làm cha mẹ", category: "relationships", icon: "Baby" },

  // Guidance
  { slug: "gods-will", nameEn: "God's Will", nameVi: "Ý muốn Chúa", category: "guidance", icon: "Compass" },
  { slug: "decision-making", nameEn: "Decision Making", nameVi: "Ra quyết định", category: "guidance", icon: "GitBranch" },
  { slug: "trust", nameEn: "Trust in God", nameVi: "Tin tưởng Chúa", category: "guidance", icon: "Lock" },
  { slug: "obedience", nameEn: "Obedience", nameVi: "Sự vâng lời", category: "guidance", icon: "CheckCircle" },
  { slug: "money", nameEn: "Money & Wealth", nameVi: "Tiền bạc & Tài sản", category: "guidance", icon: "Coins" },
  { slug: "work", nameEn: "Work & Purpose", nameVi: "Công việc & Ý nghĩa", category: "guidance", icon: "Briefcase" },

  // Identity
  { slug: "identity-in-christ", nameEn: "Identity in Christ", nameVi: "Danh tính trong Chúa", category: "identity", icon: "Star" },
  { slug: "worth", nameEn: "Worth & Value", nameVi: "Giá trị bản thân", category: "identity", icon: "Gem" },
  { slug: "calling", nameEn: "Calling & Purpose", nameVi: "Sứ mệnh & Mục đích", category: "identity", icon: "Target" },
  { slug: "humility", nameEn: "Humility", nameVi: "Sự khiêm nhường", category: "identity", icon: "ArrowDown" },
  { slug: "courage", nameEn: "Courage", nameVi: "Sự can đảm", category: "identity", icon: "Shield" },

  // Prayer
  { slug: "prayer", nameEn: "Prayer", nameVi: "Cầu nguyện", category: "prayer", icon: "HandsPraying" },
  { slug: "praise", nameEn: "Praise & Worship", nameVi: "Ngợi khen & Thờ phượng", category: "prayer", icon: "Music" },
  { slug: "fasting", nameEn: "Fasting", nameVi: "Kiêng ăn", category: "prayer", icon: "Moon" },
  { slug: "thanksgiving", nameEn: "Thanksgiving", nameVi: "Tạ ơn", category: "prayer", icon: "Gift" },

  // Wisdom
  { slug: "wisdom", nameEn: "Wisdom", nameVi: "Sự khôn ngoan", category: "wisdom", icon: "BookOpen" },
  { slug: "discernment", nameEn: "Discernment", nameVi: "Sự phân biệt", category: "wisdom", icon: "Eye" },
  { slug: "patience", nameEn: "Patience", nameVi: "Sự kiên nhẫn", category: "wisdom", icon: "Clock" },
  { slug: "integrity", nameEn: "Integrity", nameVi: "Sự liêm chính", category: "wisdom", icon: "Scale" },
  { slug: "suffering", nameEn: "Suffering & Trials", nameVi: "Khổ đau & Thử thách", category: "wisdom", icon: "Flame" },

  // Eternity
  { slug: "heaven", nameEn: "Heaven", nameVi: "Thiên đàng", category: "eternity", icon: "Cloud" },
  { slug: "eternal-life", nameEn: "Eternal Life", nameVi: "Sự sống đời đời", category: "eternity", icon: "Infinity" },
  { slug: "resurrection", nameEn: "Resurrection", nameVi: "Sự phục sinh", category: "eternity", icon: "ArrowUp" },
  { slug: "second-coming", nameEn: "Second Coming", nameVi: "Sự tái lâm", category: "eternity", icon: "Crown" },
];

interface TopicVerse {
  ref: string;
  bookSlug: string;
  chapter: number;
  verse: number;
  textEn: string;
  textVi: string;
  noteEn: string;
  noteVi: string;
}

interface TopicData {
  slug: string;
  nameEn: string;
  nameVi: string;
  category: TopicCategory;
  icon: string;
  introEn: string;
  introVi: string;
  verses: TopicVerse[];
}

async function generateTopic(def: (typeof TOPIC_DEFINITIONS)[0]): Promise<TopicData> {
  const prompt = `You are a biblical scholar. Generate topic study data for the Bible topic "${def.nameEn}" (Vietnamese: ${def.nameVi}).

Return ONLY valid JSON (no markdown, no explanation) matching this exact schema:
{
  "introEn": "2-3 sentence introduction in English about what the Bible says about this topic",
  "introVi": "2-3 sentence introduction in Vietnamese about what the Bible says about this topic (use Vietnamese Bible names like Đức Chúa Trời, Chúa Giê-xu, Đức Thánh Linh)",
  "verses": [
    {
      "ref": "John 3:16",
      "bookSlug": "john",
      "chapter": 3,
      "verse": 16,
      "textEn": "accurate NIV verse text",
      "textVi": "accurate Vietnamese Bible (2011 or traditional) verse text",
      "noteEn": "brief phrase (max 12 words) why this verse matters",
      "noteVi": "cụm từ ngắn (tối đa 12 từ) tại sao câu này quan trọng"
    }
  ]
}

Rules:
- Include exactly 6 verses, well-known and directly relevant to the topic
- bookSlug must be lowercase English book name with hyphens (e.g. "1-corinthians", "song-of-solomon", "revelation")
- Verse texts must be accurate NIV (English) and Vietnamese Bible (Vietnamese)
- Notes must be concise (1 sentence each)`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  const generated = JSON.parse(json);

  return {
    ...def,
    introEn: generated.introEn,
    introVi: generated.introVi,
    verses: generated.verses,
  };
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const results: TopicData[] = [];
  console.log(`Generating ${TOPIC_DEFINITIONS.length} topics...`);

  for (const def of TOPIC_DEFINITIONS) {
    process.stdout.write(`  ${def.nameEn}... `);
    let attempts = 0;
    while (attempts < 3) {
      try {
        const data = await generateTopic(def);
        results.push(data);
        console.log("✓");
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 3) {
          console.log(`✗ FAILED: ${(err as Error).message}`);
          // Push minimal fallback
          results.push({ ...def, introEn: "", introVi: "", verses: [] });
        } else {
          await sleep(1000);
        }
      }
    }
    await sleep(400);
  }

  const outPath = path.resolve(__dirname, "../../src/lib/bible-topics-data.ts");
  const content = `// AUTO-GENERATED by generate-bible-topics.ts — do not edit manually
// Re-run: npx tsx prisma/seed/generate-bible-topics.ts

export type TopicCategory =
  | "faith"
  | "emotions"
  | "relationships"
  | "guidance"
  | "identity"
  | "prayer"
  | "eternity"
  | "wisdom";

export interface TopicVerse {
  ref: string;
  bookSlug: string;
  chapter: number;
  verse: number;
  textEn: string;
  textVi: string;
  noteEn: string;
  noteVi: string;
}

export interface BibleTopic {
  slug: string;
  nameEn: string;
  nameVi: string;
  category: TopicCategory;
  icon: string;
  introEn: string;
  introVi: string;
  verses: TopicVerse[];
}

export const BIBLE_TOPICS: BibleTopic[] = ${JSON.stringify(results, null, 2)};

export const TOPIC_CATEGORIES: Record<TopicCategory, { labelEn: string; labelVi: string }> = {
  faith:         { labelEn: "Faith",         labelVi: "Đức tin" },
  emotions:      { labelEn: "Emotions",      labelVi: "Cảm xúc" },
  relationships: { labelEn: "Relationships", labelVi: "Quan hệ" },
  guidance:      { labelEn: "Guidance",      labelVi: "Hướng dẫn" },
  identity:      { labelEn: "Identity",      labelVi: "Danh tính" },
  prayer:        { labelEn: "Prayer",        labelVi: "Cầu nguyện" },
  wisdom:        { labelEn: "Wisdom",        labelVi: "Sự khôn ngoan" },
  eternity:      { labelEn: "Eternity",      labelVi: "Đời đời" },
};

export function getTopicBySlug(slug: string): BibleTopic | undefined {
  return BIBLE_TOPICS.find((t) => t.slug === slug);
}

export function getTopicsByCategory(category: TopicCategory): BibleTopic[] {
  return BIBLE_TOPICS.filter((t) => t.category === category);
}
`;

  fs.writeFileSync(outPath, content, "utf8");
  console.log(`\nWrote ${results.length} topics to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
