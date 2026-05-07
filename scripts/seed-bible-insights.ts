/**
 * Bible Insights Seeder
 *
 * Generates AI insights (context, explanation, reflections) for Bible chapters
 * and upserts them into the BibleInsight table.
 *
 * SAFE: Skips chapters that already have an "ai" insight. Never deletes existing data.
 *
 * Usage:
 *   npx tsx scripts/seed-bible-insights.ts --help
 *   npx tsx scripts/seed-bible-insights.ts --book john --lang en
 *   npx tsx scripts/seed-bible-insights.ts --book john --lang vi
 *   npx tsx scripts/seed-bible-insights.ts --book john --lang both
 *   npx tsx scripts/seed-bible-insights.ts --priority --lang en       # John, Romans, Psalms, Matthew, Genesis
 *   npx tsx scripts/seed-bible-insights.ts --book genesis --dry-run   # preview without writing
 *
 * Requires ANTHROPIC_API_KEY in .env
 */

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Priority books (run these first before doing the full Bible)
const PRIORITY_SLUGS = ["john", "romans", "psalms", "matthew", "genesis"];

type Lang = "en" | "vi";

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function buildPrompt(
  bookName: string,
  chapterNum: number,
  lang: Lang
): string {
  if (lang === "en") {
    return `You are a Bible scholar writing concise study insights for a Bible reading app.

Generate insights for ${bookName} chapter ${chapterNum}.

Respond with ONLY valid JSON matching this exact structure:
{
  "context": "2-3 sentence historical and literary background of this specific chapter. Who wrote it, when, to whom, and what was happening at the time.",
  "explanation": "2-3 sentences on the main theological and practical meaning of this chapter. What God is revealing and why it matters.",
  "reflections": [
    "Reflection question 1 — personal and specific to this chapter",
    "Reflection question 2",
    "Reflection question 3",
    "Reflection question 4"
  ]
}

Rules:
- context and explanation must be plain prose sentences (no markdown, no bullet points)
- reflections must be an array of exactly 4 questions
- All questions should be personal and invite honest self-examination
- Do not include any text outside the JSON object`;
  }

  return `Bạn là một học giả Kinh Thánh viết những bài học ngắn gọn cho ứng dụng đọc Kinh Thánh.

Hãy tạo bài học cho ${bookName} chương ${chapterNum} bằng tiếng Việt.

Chỉ trả lời bằng JSON hợp lệ theo đúng cấu trúc sau:
{
  "context": "2-3 câu về bối cảnh lịch sử và văn học của chương này. Ai viết, khi nào, cho ai, và điều gì đang xảy ra vào thời điểm đó.",
  "explanation": "2-3 câu về ý nghĩa thần học và thực tiễn chính của chương này. Đức Chúa Trời đang bày tỏ điều gì và tại sao điều đó quan trọng.",
  "reflections": [
    "Câu hỏi suy gẫm 1 — cá nhân và cụ thể cho chương này",
    "Câu hỏi suy gẫm 2",
    "Câu hỏi suy gẫm 3",
    "Câu hỏi suy gẫm 4"
  ]
}

Quy tắc:
- context và explanation phải là văn xuôi bình thường (không dùng markdown, không dùng gạch đầu dòng)
- reflections phải là mảng gồm đúng 4 câu hỏi
- Tất cả câu hỏi phải mang tính cá nhân và mời gọi tự kiểm điểm thành thật
- Không viết bất kỳ nội dung nào ngoài đối tượng JSON`;
}

// ---------------------------------------------------------------------------
// Generate one chapter insight via Claude
// ---------------------------------------------------------------------------

interface InsightPayload {
  context: string;
  explanation: string;
  reflections: string[];
}

async function generateInsight(
  bookName: string,
  chapterNum: number,
  lang: Lang
): Promise<InsightPayload> {
  const prompt = buildPrompt(bookName, chapterNum, lang);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  // Strip markdown code fences if Claude wraps JSON in ```json ... ```
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  const parsed = JSON.parse(cleaned) as InsightPayload;

  if (
    typeof parsed.context !== "string" ||
    typeof parsed.explanation !== "string" ||
    !Array.isArray(parsed.reflections)
  ) {
    throw new Error(`Unexpected shape: ${JSON.stringify(parsed).slice(0, 200)}`);
  }

  return {
    context: parsed.context.trim(),
    explanation: parsed.explanation.trim(),
    reflections: parsed.reflections.map((r: string) => r.trim()),
  };
}

// ---------------------------------------------------------------------------
// Upsert one insight row
// ---------------------------------------------------------------------------

async function upsertInsight(
  bookId: string,
  bookName: string,
  chapterNum: number,
  lang: Lang,
  payload: InsightPayload,
  dryRun: boolean
) {
  if (dryRun) {
    console.log(`  [dry-run] would upsert ${bookName} ${chapterNum} (${lang})`);
    console.log(`    context: ${payload.context.slice(0, 80)}...`);
    return;
  }

  // Prisma upsert can't handle null in composite unique keys — use find + create/update
  const existing = await prisma.bibleInsight.findFirst({
    where: { bookId, chapterNumber: chapterNum, verseNumber: null, language: lang, source: "ai" },
    select: { id: true },
  });

  if (existing) {
    await prisma.bibleInsight.update({
      where: { id: existing.id },
      data: {
        context: payload.context,
        explanation: payload.explanation,
        reflections: payload.reflections,
        status: "published",
      },
    });
  } else {
    await prisma.bibleInsight.create({
      data: {
        bookId,
        scope: "chapter",
        chapterNumber: chapterNum,
        verseNumber: null,
        language: lang,
        source: "ai",
        status: "published",
        context: payload.context,
        explanation: payload.explanation,
        reflections: payload.reflections,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Check existing
// ---------------------------------------------------------------------------

async function existingChapters(bookId: string, lang: Lang): Promise<Set<number>> {
  const rows = await prisma.bibleInsight.findMany({
    where: { bookId, language: lang, source: "ai", scope: "chapter" },
    select: { chapterNumber: true },
  });
  return new Set(rows.map((r) => r.chapterNumber!));
}

// ---------------------------------------------------------------------------
// Seed one book
// ---------------------------------------------------------------------------

async function seedBook(
  bookId: string,
  bookNameEn: string,
  bookNameVi: string,
  chapterCount: number,
  langs: Lang[],
  dryRun: boolean,
  delayMs: number
) {
  for (const lang of langs) {
    const done = await existingChapters(bookId, lang);
    const bookName = lang === "vi" ? bookNameVi : bookNameEn;
    const todo = Array.from({ length: chapterCount }, (_, i) => i + 1).filter(
      (ch) => !done.has(ch)
    );

    if (todo.length === 0) {
      console.log(`  ✓ ${bookNameEn} [${lang}] — all ${chapterCount} chapters already seeded`);
      continue;
    }

    console.log(
      `  → ${bookNameEn} [${lang}] — seeding ${todo.length}/${chapterCount} chapters (${done.size} already done)`
    );

    let doneCount = done.size;
    for (const chapterNum of todo) {
      process.stdout.write(`    ch ${chapterNum}/${chapterCount} [${lang}]...`);
      try {
        const payload = await generateInsight(bookName, chapterNum, lang);
        await upsertInsight(bookId, bookNameEn, chapterNum, lang, payload, dryRun);
        doneCount++;
        console.log(" ✓");
      } catch (err) {
        console.log(` ✗ ERROR: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Progress summary every 30 chapters
      if (doneCount > 0 && doneCount % 30 === 0) {
        console.log(`\n  📊 Progress: ${doneCount} chapters done for ${bookNameEn} [${lang}]\n`);
      }

      if (delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
}

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Bible Insights Seeder

Options:
  --book <slugEn>    Seed a specific book (e.g. john, genesis, psalms)
  --priority         Seed priority books: John, Romans, Psalms, Matthew, Genesis
  --nt               Seed New Testament only (Matthew–Revelation)
  --ot               Seed Old Testament only (Genesis–Malachi)
  --all              Seed all 66 books (skips already-seeded chapters)
  --lang <en|vi|both>  Language to generate (default: en)
  --delay <ms>       Delay between API calls in ms (default: 300)
  --dry-run          Preview what would be seeded without writing to DB
  --help             Show this help

Examples:
  npx tsx scripts/seed-bible-insights.ts --book john --lang en
  npx tsx scripts/seed-bible-insights.ts --book john --lang both
  npx tsx scripts/seed-bible-insights.ts --priority --lang en
  npx tsx scripts/seed-bible-insights.ts --all --lang both
  npx tsx scripts/seed-bible-insights.ts --book genesis --lang vi --dry-run
`);
    process.exit(0);
  }

  const bookIdx = args.indexOf("--book");
  const bookSlug = bookIdx >= 0 ? args[bookIdx + 1] : null;
  const priority = args.includes("--priority");
  const all = args.includes("--all");
  const nt = args.includes("--nt");
  const ot = args.includes("--ot");
  const dryRun = args.includes("--dry-run");

  const langIdx = args.indexOf("--lang");
  const langArg = langIdx >= 0 ? args[langIdx + 1] : "en";
  const langs: Lang[] =
    langArg === "both" ? ["en", "vi"] : langArg === "vi" ? ["vi"] : ["en"];

  const delayIdx = args.indexOf("--delay");
  const delayMs = delayIdx >= 0 ? parseInt(args[delayIdx + 1], 10) : 300;

  return { bookSlug, priority, all, nt, ot, langs, dryRun, delayMs };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { bookSlug, priority, all, nt, ot, langs, dryRun, delayMs } = parseArgs();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  ANTHROPIC_API_KEY not found in environment. Add it to your .env file.");
    process.exit(1);
  }

  if (!bookSlug && !priority && !all && !nt && !ot) {
    console.error(
      "❌  Specify --book <slug>, --priority, --nt, --ot, or --all. Use --help for usage."
    );
    process.exit(1);
  }

  if (dryRun) console.log("🔍 DRY RUN — no data will be written\n");

  // Load matching books from DB
  let books = await prisma.bibleBook.findMany({
    select: { id: true, nameEn: true, nameVi: true, slugEn: true, chapterCount: true, order: true },
    orderBy: { order: "asc" },
  });

  if (bookSlug) {
    books = books.filter((b) => b.slugEn === bookSlug);
    if (books.length === 0) {
      console.error(`❌  No book found with slugEn = "${bookSlug}"`);
      console.log("Available slugs:", (await prisma.bibleBook.findMany({ select: { slugEn: true }, orderBy: { order: "asc" } })).map((b) => b.slugEn).join(", "));
      process.exit(1);
    }
  } else if (priority) {
    const slugSet = new Set(PRIORITY_SLUGS);
    books = books
      .filter((b) => b.slugEn && slugSet.has(b.slugEn))
      .sort((a, b) => PRIORITY_SLUGS.indexOf(a.slugEn!) - PRIORITY_SLUGS.indexOf(b.slugEn!));
  } else if (nt) {
    books = books.filter((b) => b.order >= 40); // Matthew (40) through Revelation (66)
  } else if (ot) {
    books = books.filter((b) => b.order <= 39); // Genesis (1) through Malachi (39)
  }
  // --all: use all books as-is (already ordered by canonical order)

  const totalChapters = books.reduce((s, b) => s + b.chapterCount, 0) * langs.length;
  console.log(
    `📖  Seeding ${books.length} book(s), ~${totalChapters} chapter×lang total, lang=[${langs.join(",")}]`
  );
  console.log(`💡  Model: claude-haiku-4-5-20251001 (cost-efficient)\n`);

  let globalDone = 0;
  let globalErrors = 0;

  for (const book of books) {
    console.log(`\n📘 ${book.nameEn} (${book.chapterCount} chapters)`);
    const before = globalDone;
    await seedBook(
      book.id,
      book.nameEn,
      book.nameVi,
      book.chapterCount,
      langs,
      dryRun,
      delayMs
    );
    globalDone += book.chapterCount * langs.length;

    // Global progress every 30 chapters (across all books)
    if (Math.floor(globalDone / 30) > Math.floor(before / 30)) {
      const pct = Math.round((globalDone / totalChapters) * 100);
      console.log(
        `\n  🌍 GLOBAL PROGRESS: ${globalDone}/${totalChapters} chapter×lang (${pct}%)\n`
      );
    }
  }

  console.log(`\n✅ Done. ${globalDone} seeded, ${globalErrors} errors.`);
}

main()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
