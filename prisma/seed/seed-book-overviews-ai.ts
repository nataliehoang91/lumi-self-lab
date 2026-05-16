/**
 * Seeds BibleBookOverview for all books missing EN data using Claude.
 * Run: npx tsx prisma/seed/seed-book-overviews-ai.ts
 *
 * - ONLY inserts for books with no existing EN overview (safe to re-run)
 * - Uses upsert so existing data is never clobbered
 * - Production-safe: reads DATABASE_URL from .env
 */

import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface GeneratedOverview {
  author: string | null;
  authorOccupation: string | null;
  date: string;
  audience: string;
  themes: string[];
  bookSummary: string;
  outline: { chapter: string; title: string }[];
  keyVerses: { ref: string; text: string; chapter: number; verse: number }[];
}

async function generateOverview(
  bookName: string,
  chapterCount: number
): Promise<GeneratedOverview> {
  const prompt = `You are a biblical scholar. Generate accurate, concise book overview data for the Bible book "${bookName}" (${chapterCount} chapters) in English.

Return ONLY valid JSON matching this exact schema — no markdown, no explanation:
{
  "author": string or null (human author; null if unknown),
  "authorOccupation": string or null (e.g. "Prophet", "King", "Apostle"),
  "date": string (e.g. "c. 1010–970 BC" or "c. 60 AD"),
  "audience": string (original audience, e.g. "The nation of Israel"),
  "themes": string[] (4–6 key themes, concise, e.g. "Covenant", "Redemption"),
  "bookSummary": string (2–3 sentences summarising the book's content and theological significance),
  "outline": [{ "chapter": string (e.g. "1–3" or "1"), "title": string (one sentence describing that section) }] (6–8 sections covering the whole book),
  "keyVerses": [{ "ref": string (e.g. "1:1"), "text": string (NIV text, accurate), "chapter": number, "verse": number }] (3–4 most well-known verses)
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  // Strip markdown code fences if present
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json) as GeneratedOverview;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const allBooks = await prisma.bibleBook.findMany({
    orderBy: { order: "asc" },
    select: { id: true, nameEn: true, order: true, chapterCount: true },
  });

  const existing = await prisma.bibleBookOverview.findMany({
    where: { language: "en" },
    select: { bookId: true },
  });
  const existingIds = new Set(existing.map((o) => o.bookId));

  const missing = allBooks.filter((b) => !existingIds.has(b.id));
  console.log(`Found ${missing.length} books missing EN overview. Generating...`);

  let success = 0;
  let failed = 0;

  for (const book of missing) {
    process.stdout.write(`  [${book.order}/66] ${book.nameEn}... `);
    try {
      const data = await generateOverview(book.nameEn, book.chapterCount);

      await prisma.bibleBookOverview.upsert({
        where: { bookId_language: { bookId: book.id, language: "en" } },
        create: {
          bookId: book.id,
          language: "en",
          author: data.author,
          authorOccupation: data.authorOccupation,
          date: data.date,
          audience: data.audience,
          themes: data.themes,
          christConnection: data.bookSummary,
          keyVerses: data.keyVerses,
          outline: data.outline,
        },
        update: {
          author: data.author,
          authorOccupation: data.authorOccupation,
          date: data.date,
          audience: data.audience,
          themes: data.themes,
          christConnection: data.bookSummary,
          keyVerses: data.keyVerses,
          outline: data.outline,
        },
      });

      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ ERROR: ${(err as Error).message}`);
      failed++;
    }

    // Avoid rate limits: 500ms between requests
    await sleep(500);
  }

  console.log(`\nDone. ${success} seeded, ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
