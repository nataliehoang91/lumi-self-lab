/**
 * Test script: fetch John chapter 1 from API.Bible (Vietnamese) and print verses.
 * Compare output with current DB data to check accuracy.
 *
 * Run: npx tsx prisma/seed/test-apibible-vietnamese.ts
 * Requires: API_BIBLE_KEY in .env
 */
import path from "node:path";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: path.resolve(process.cwd(), ".env") });

const API_BIBLE_BASE = "https://rest.api.bible/v1";

async function main() {
  const apiKey = process.env.API_BIBLE_KEY?.trim();
  if (!apiKey) {
    console.error("API_BIBLE_KEY not found in .env");
    process.exit(1);
  }

  // 1. List all available Vietnamese bibles
  console.log("Fetching available Vietnamese Bibles from API.Bible...\n");
  const biblesRes = await fetch(`${API_BIBLE_BASE}/bibles?language=vie`, {
    headers: { "api-key": apiKey },
  });
  if (!biblesRes.ok) {
    console.error("Failed:", biblesRes.status, await biblesRes.text());
    process.exit(1);
  }
  const biblesJson = (await biblesRes.json()) as {
    data?: Array<{ id: string; name: string; abbreviation: string; abbreviationLocal: string }>;
  };
  const vieBibles = biblesJson.data ?? [];

  if (vieBibles.length === 0) {
    console.log("No Vietnamese Bibles found for this API key.");
    console.log("Your key may not have Vietnamese licensed. Try signing up at scripture.api.bible");
    process.exit(0);
  }

  console.log(`Found ${vieBibles.length} Vietnamese Bible(s):`);
  vieBibles.forEach((b, i) => {
    console.log(`  [${i}] id=${b.id}  abbr=${b.abbreviationLocal || b.abbreviation}  name=${b.name}`);
  });

  // Use first Vietnamese Bible found (most likely VIE1925)
  const bible = vieBibles[0]!;
  console.log(`\nUsing: "${bible.name}" (${bible.id})\n`);

  // 2. Fetch John chapter 1 verses
  //    API.Bible chapter ID format: "JHN.1"
  const chapterId = "JHN.1";
  const url = `${API_BIBLE_BASE}/bibles/${bible.id}/chapters/${chapterId}/verses?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
  console.log(`Fetching John 1 (${chapterId})...`);
  const chapterRes = await fetch(url, { headers: { "api-key": apiKey } });
  if (!chapterRes.ok) {
    console.error("Failed to fetch chapter:", chapterRes.status, await chapterRes.text());
    process.exit(1);
  }
  const chapterJson = (await chapterRes.json()) as {
    data?: Array<{ id: string; reference: string }>;
  };
  const verseList = chapterJson.data ?? [];
  console.log(`  Found ${verseList.length} verses in John 1\n`);

  // 3. Fetch full text of each verse
  console.log("=== API.Bible — John 1 (Vietnamese) ===\n");
  const apiBibleVerses: { number: number; text: string }[] = [];

  for (const v of verseList.slice(0, 5)) {
    const vRes = await fetch(
      `${API_BIBLE_BASE}/bibles/${bible.id}/verses/${v.id}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`,
      { headers: { "api-key": apiKey } }
    );
    if (!vRes.ok) continue;
    const vJson = (await vRes.json()) as { data?: { id: string; content: string } };
    const text = (vJson.data?.content ?? "").trim();
    const parts = v.id.split(".");
    const verseNum = parseInt(parts[2] ?? "0", 10);
    apiBibleVerses.push({ number: verseNum, text });
    console.log(`  ${verseNum}. ${text}`);
  }

  // 4. Compare with current DB data
  console.log("\n=== Current DB (contentVIE1923) — John 1 verses 1-5 ===\n");
  const prisma = new PrismaClient();
  const johnBook = await prisma.bibleBook.findFirst({ where: { nameEn: "John" } });
  if (!johnBook) {
    console.log("John not found in DB — run seed first.");
    await prisma.$disconnect();
    return;
  }
  const dbVerses = await prisma.bibleVerseContent.findMany({
    where: { bookId: johnBook.id, chapter: 1, verse: { lte: 5 } },
    orderBy: { verse: "asc" },
    select: { verse: true, contentVIE1923: true },
  });
  dbVerses.forEach((v) => {
    console.log(`  ${v.verse}. ${v.contentVIE1923 ?? "(empty)"}`);
  });

  await prisma.$disconnect();
  console.log("\nDone. Compare the two outputs above to verify accuracy.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
