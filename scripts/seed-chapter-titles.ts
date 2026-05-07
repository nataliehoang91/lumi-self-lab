/**
 * Chapter Title Seeder
 *
 * Generates descriptive EN + VI chapter titles for chapters that only have
 * generic placeholders like "John Chapter 1" / "John Chương 1".
 *
 * SAFE: Only updates chapters with generic titles. Never touches real ones.
 *
 * Usage:
 *   npx tsx scripts/seed-chapter-titles.ts --help
 *   npx tsx scripts/seed-chapter-titles.ts --nt              # New Testament only
 *   npx tsx scripts/seed-chapter-titles.ts --ot              # Old Testament only
 *   npx tsx scripts/seed-chapter-titles.ts --all             # All 66 books
 *   npx tsx scripts/seed-chapter-titles.ts --book john       # One book
 *   npx tsx scripts/seed-chapter-titles.ts --all --dry-run   # Preview only
 *
 * Requires ANTHROPIC_API_KEY in .env
 */

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// A title is "generic" if it matches "BookName Chapter N" or "BookName Chương N"
function isGenericTitle(title: string | null): boolean {
  if (!title) return true;
  return /chapter\s+\d+/i.test(title) || /chương\s+\d+/i.test(title);
}

// ---------------------------------------------------------------------------
// Generate titles for a whole book in one API call (much cheaper)
// ---------------------------------------------------------------------------

interface ChapterTitles {
  [chapterNum: number]: { en: string; vi: string };
}

async function generateTitlesForBook(
  bookNameEn: string,
  bookNameVi: string,
  chapters: number[]
): Promise<ChapterTitles> {
  const prompt = `You are a Bible scholar. Generate short, descriptive chapter titles for ${bookNameEn}.

For each chapter listed below, give:
- A concise English title (3-6 words, like "The Creation", "Cain and Abel", "The Lord's Prayer")
- A Vietnamese translation of that title

Chapters needed: ${chapters.join(", ")}

Respond with ONLY valid JSON:
{
  ${chapters.map((n) => `"${n}": { "en": "Title here", "vi": "Tiêu đề ở đây" }`).join(",\n  ")}
}

Rules:
- Titles must be descriptive of the chapter content, not generic (never "Chapter N" or "Chương N")
- Keep English titles 3-6 words
- Vietnamese must be natural, not word-for-word translation
- No markdown, only the JSON object`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: Math.max(2000, chapters.length * 80),
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned) as ChapterTitles;
}

// ---------------------------------------------------------------------------
// Seed one book
// ---------------------------------------------------------------------------

async function seedBook(
  bookId: string,
  bookNameEn: string,
  bookNameVi: string,
  dryRun: boolean
) {
  // Load chapters that still have generic titles
  const chapters = await prisma.bibleChapter.findMany({
    where: { bookId },
    select: { id: true, chapterNumber: true, sectionTitle: true, sectionTitleNIV: true },
    orderBy: { chapterNumber: "asc" },
  });

  const genericChapters = chapters.filter(
    (c) => isGenericTitle(c.sectionTitleNIV) || isGenericTitle(c.sectionTitle)
  );

  if (genericChapters.length === 0) {
    console.log(`  ✓ ${bookNameEn} — all chapters already have real titles`);
    return;
  }

  console.log(
    `  → ${bookNameEn} — generating titles for ${genericChapters.length}/${chapters.length} chapters`
  );

  // Batch all chapters into one API call per book (much cheaper than per-chapter)
  const batchSize = 30; // keep prompt size reasonable
  const batches: number[][] = [];
  for (let i = 0; i < genericChapters.length; i += batchSize) {
    batches.push(genericChapters.slice(i, i + batchSize).map((c) => c.chapterNumber));
  }

  const allTitles: ChapterTitles = {};
  for (const batch of batches) {
    try {
      const titles = await generateTitlesForBook(bookNameEn, bookNameVi, batch);
      Object.assign(allTitles, titles);
    } catch (err) {
      console.log(`  ✗ ERROR generating batch [${batch[0]}-${batch[batch.length - 1]}]: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Update DB
  let updated = 0;
  for (const ch of genericChapters) {
    const titles = allTitles[ch.chapterNumber];
    if (!titles) {
      console.log(`    ch ${ch.chapterNumber}: no title generated, skipping`);
      continue;
    }

    if (dryRun) {
      console.log(`    ch ${ch.chapterNumber} [dry-run]: EN="${titles.en}" | VI="${titles.vi}"`);
      updated++;
      continue;
    }

    await prisma.bibleChapter.update({
      where: { id: ch.id },
      data: {
        sectionTitleNIV: titles.en,
        sectionTitle: titles.vi,
        // Also update KJV to EN title if it's generic too
        ...(isGenericTitle(ch.sectionTitle) ? { sectionTitleKJV: titles.en } : {}),
      },
    });
    updated++;
  }

  console.log(`    ✓ ${updated} chapters updated`);
}

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Chapter Title Seeder

Options:
  --book <slugEn>    Seed a specific book (e.g. john, genesis)
  --nt               New Testament only (Matthew–Revelation)
  --ot               Old Testament only (Genesis–Malachi)
  --all              All 66 books
  --dry-run          Preview without writing to DB
  --help             Show this help

Examples:
  npx tsx scripts/seed-chapter-titles.ts --nt
  npx tsx scripts/seed-chapter-titles.ts --all
  npx tsx scripts/seed-chapter-titles.ts --book john --dry-run
`);
    process.exit(0);
  }

  const bookIdx = args.indexOf("--book");
  const bookSlug = bookIdx >= 0 ? args[bookIdx + 1] : null;
  const nt = args.includes("--nt");
  const ot = args.includes("--ot");
  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");

  return { bookSlug, nt, ot, all, dryRun };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { bookSlug, nt, ot, all, dryRun } = parseArgs();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  ANTHROPIC_API_KEY not set in .env");
    process.exit(1);
  }

  if (!bookSlug && !nt && !ot && !all) {
    console.error("❌  Specify --book <slug>, --nt, --ot, or --all. Use --help for usage.");
    process.exit(1);
  }

  if (dryRun) console.log("🔍 DRY RUN — no data will be written\n");

  let books = await prisma.bibleBook.findMany({
    select: { id: true, nameEn: true, nameVi: true, slugEn: true, order: true },
    orderBy: { order: "asc" },
  });

  if (bookSlug) {
    books = books.filter((b) => b.slugEn === bookSlug);
    if (books.length === 0) {
      console.error(`❌  No book with slugEn="${bookSlug}"`);
      process.exit(1);
    }
  } else if (nt) {
    books = books.filter((b) => b.order >= 40);
  } else if (ot) {
    books = books.filter((b) => b.order <= 39);
  }

  console.log(`📖  Seeding chapter titles for ${books.length} book(s)`);
  console.log(`💡  Model: claude-haiku-4-5-20251001 (one API call per book)\n`);

  let booksDone = 0;
  for (const book of books) {
    console.log(`\n📘 ${book.nameEn}`);
    await seedBook(book.id, book.nameEn, book.nameVi, dryRun);
    booksDone++;
    if (booksDone % 10 === 0) {
      console.log(`\n  📊 PROGRESS: ${booksDone}/${books.length} books done\n`);
    }
  }

  console.log(`\n✅ Done. ${booksDone} books processed.`);
}

main()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
