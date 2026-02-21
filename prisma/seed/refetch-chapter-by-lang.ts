/**
 * Refetch one chapter for a book and language. Fetches the chapter once, then
 * updates the DB verse-by-verse (only rows where that language column is null).
 *
 * Usage:
 *   npx tsx prisma/seed/refetch-chapter-by-lang.ts --bookId=ID --chapter=5 --lang=vie
 *
 * Options:
 *   --bookId   Required. BibleBook id.
 *   --chapter  Required. Chapter number (e.g. 5).
 *   --lang     Required. One of: vie | kjv | niv | zh
 *   --override Optional. Overwrite entire chapter for this lang (default: only fill nulls).
 */
import { PrismaClient } from "@prisma/client";

const VI_JSON_URL =
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/vi_vietnamese.json";
const KJV_JSON_URL =
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json";
const ZH_JSON_URL =
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/zh_cuv.json";
const NIV_BASE = "https://raw.githubusercontent.com/aruljohn/Bible-niv/main";
const BOOKS_JSON = `${NIV_BASE}/Books.json`;

function parseArgs(): {
  bookId: string;
  chapter: number;
  lang: "vie" | "kjv" | "niv" | "zh";
  override: boolean;
} {
  const args = process.argv.slice(2);
  let bookId = "";
  let chapter = 0;
  let lang: "vie" | "kjv" | "niv" | "zh" | undefined;
  let override = false;
  for (const a of args) {
    if (a.startsWith("--bookId=")) bookId = a.slice("--bookId=".length).trim();
    else if (a.startsWith("--chapter=")) chapter = parseInt(a.slice("--chapter=".length), 10);
    else if (a.startsWith("--lang=")) lang = a.slice("--lang=".length).trim().toLowerCase() as "vie" | "kjv" | "niv" | "zh";
    else if (a === "--override") override = true;
  }
  if (!bookId || !Number.isFinite(chapter) || chapter < 1 || !lang) {
    console.error("Usage: npx tsx prisma/seed/refetch-chapter-by-lang.ts --bookId=ID --chapter=N --lang=vie|kjv|niv|zh [--override]");
    process.exit(1);
  }
  if (!["vie", "kjv", "niv", "zh"].includes(lang)) {
    console.error("--lang must be one of: vie, kjv, niv, zh");
    process.exit(1);
  }
  return { bookId, chapter, lang, override };
}

async function main() {
  const { bookId, chapter, lang, override } = parseArgs();
  const prisma = new PrismaClient();
  if (override) console.log("Override mode: overwriting entire chapter for this language.");

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    console.error(`Book not found: ${bookId}`);
    process.exit(1);
  }
  const bookIndex = books.indexOf(book);

  let versesInChapter: string[] = [];

  if (lang === "vie") {
    const res = await fetch(VI_JSON_URL);
    if (!res.ok) throw new Error(`Failed to fetch Vietnamese: ${res.status}`);
    const viBooks = (await res.json()) as { chapters: string[][] }[];
    const ch = viBooks[bookIndex]?.chapters?.[chapter - 1];
    if (!Array.isArray(ch)) throw new Error(`No Vietnamese data for book index ${bookIndex}, chapter ${chapter}`);
    versesInChapter = ch;
  } else if (lang === "kjv") {
    const res = await fetch(KJV_JSON_URL);
    if (!res.ok) throw new Error(`Failed to fetch KJV: ${res.status}`);
    const kjvBooks = (await res.json()) as { chapters: string[][] }[];
    const ch = kjvBooks[bookIndex]?.chapters?.[chapter - 1];
    if (!Array.isArray(ch)) throw new Error(`No KJV data for book index ${bookIndex}, chapter ${chapter}`);
    versesInChapter = ch;
  } else if (lang === "zh") {
    const res = await fetch(ZH_JSON_URL);
    if (!res.ok) throw new Error(`Failed to fetch Chinese: ${res.status}`);
    const zhBooks = (await res.json()) as { chapters: string[][] }[];
    const ch = zhBooks[bookIndex]?.chapters?.[chapter - 1];
    if (!Array.isArray(ch)) throw new Error(`No Chinese data for book index ${bookIndex}, chapter ${chapter}`);
    versesInChapter = ch;
  } else if (lang === "niv") {
    const booksRes = await fetch(BOOKS_JSON);
    if (!booksRes.ok) throw new Error(`Failed to fetch NIV Books.json: ${booksRes.status}`);
    const nivBookNames = (await booksRes.json()) as string[];
    const nivName = nivBookNames[bookIndex];
    if (!nivName) throw new Error(`No NIV book name for index ${bookIndex}`);
    const res = await fetch(`${NIV_BASE}/${encodeURIComponent(nivName)}.json`);
    if (!res.ok) throw new Error(`Failed to fetch NIV ${nivName}: ${res.status}`);
    const niv = (await res.json()) as { chapters: { verses: { text: string }[] }[] };
    const cap = niv?.chapters?.[chapter - 1];
    if (!cap?.verses) throw new Error(`No NIV data for chapter ${chapter}`);
    versesInChapter = cap.verses.map((v) => v?.text ?? "").filter((t) => typeof t === "string");
  }

  const nonEmptyFromSource = versesInChapter.filter(
    (t) => typeof t === "string" && (t as string).trim() !== ""
  ).length;
  console.log(
    `Source: ${versesInChapter.length} verses in chapter, ${nonEmptyFromSource} non-empty.`
  );

  let updated = 0;
  for (let v = 0; v < versesInChapter.length; v++) {
    const verseNum = v + 1;
    const text = typeof versesInChapter[v] === "string" ? (versesInChapter[v] as string).trim() : "";
    if (!text) continue;

    const existing = await prisma.bibleVerseContent.findUnique({
      where: {
        bookId_chapter_verse: { bookId, chapter, verse: verseNum },
      },
      select:
        lang === "vie"
          ? { contentVIE1923: true }
          : lang === "kjv"
            ? { contentKJV: true }
            : lang === "niv"
              ? { contentNIV: true }
              : { contentZH: true },
    });

    const col = lang === "vie" ? "contentVIE1923" : lang === "kjv" ? "contentKJV" : lang === "niv" ? "contentNIV" : "contentZH";
    const current = existing ? (existing as Record<string, string | null>)[col] : null;
    if (!override && current != null && current.trim() !== "") continue;

    await prisma.bibleVerseContent.upsert({
      where: {
        bookId_chapter_verse: { bookId, chapter, verse: verseNum },
      },
      create: {
        bookId,
        chapter,
        verse: verseNum,
        ...(lang === "vie" && { contentVIE1923: text }),
        ...(lang === "kjv" && { contentKJV: text }),
        ...(lang === "niv" && { contentNIV: text }),
        ...(lang === "zh" && { contentZH: text }),
      },
      update:
        lang === "vie"
          ? { contentVIE1923: text }
          : lang === "kjv"
            ? { contentKJV: text }
            : lang === "niv"
              ? { contentNIV: text }
              : { contentZH: text },
    });
    updated++;
    console.log(`  verse ${verseNum}: ${override ? "overwritten" : "filled"}`);
  }

  console.log(`Done. ${updated} verses updated (${lang}, ${book.nameEn} ch.${chapter}).`);
  if (updated === 0 && nonEmptyFromSource > 0 && !override) {
    console.log(
      "  → DB may already have content for this chapter. To confirm nulls, run section 9 in scripts/check-bible-verse-content-null.sql"
    );
  }
  if (updated === 0 && nonEmptyFromSource === 0 && !override) {
    console.log(
      "  → Source returned no text for this chapter. Use fallback API: scripts/refetch-fallback-api.md"
    );
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
