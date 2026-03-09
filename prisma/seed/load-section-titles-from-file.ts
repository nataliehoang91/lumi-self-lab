/**
 * Load section titles from a JSON file into BibleChapter (sectionTitle, sectionTitleKJV, sectionTitleNIV).
 * Does not change any verse content.
 *
 * Usage:
 *   npx tsx prisma/seed/load-section-titles-from-file.ts
 *   npx tsx prisma/seed/load-section-titles-from-file.ts path/to/headings.json
 *
 * JSON format: array of objects with bookNameEn, chapterNumber, and at least one of:
 *   sectionTitle   (fallback / VI)
 *   sectionTitleKJV
 *   sectionTitleNIV
 * If only sectionTitle is provided, it is written to all three columns so KJV and NIV show it too.
 * bookNameEn must match DB exactly (e.g. "1 Corinthians"). See SECTION-TITLES-README.md.
 */
import path from "node:path";
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const DEFAULT_FILE = path.resolve(__dirname, "section-titles-kjv.json");

type Entry = {
  bookNameEn: string;
  chapterNumber: number;
  sectionTitle?: string;
  sectionTitleKJV?: string;
  sectionTitleNIV?: string;
};

async function main() {
  const filePath = process.argv[2]?.trim() || DEFAULT_FILE;
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    console.error("Usage: npx tsx prisma/seed/load-section-titles-from-file.ts [path/to/file.json]");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let entries: Entry[];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      console.error("JSON must be an array of { bookNameEn, chapterNumber, sectionTitle }");
      process.exit(1);
    }
    entries = parsed as Entry[];
  } catch (e) {
    console.error("Invalid JSON:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const books = await prisma.bibleBook.findMany({
    select: { id: true, nameEn: true },
  });
  const bookByName = new Map(books.map((b) => [b.nameEn, b]));

  let updated = 0;
  let skipped = 0;

  for (const row of entries) {
    const bookNameEn = typeof row.bookNameEn === "string" ? row.bookNameEn.trim() : "";
    const chapterNumber = typeof row.chapterNumber === "number" ? row.chapterNumber : parseInt(String(row.chapterNumber), 10);
    const sectionTitle = typeof row.sectionTitle === "string" ? row.sectionTitle.trim() : null;
    const sectionTitleKJV = typeof row.sectionTitleKJV === "string" ? row.sectionTitleKJV.trim() : null;
    const sectionTitleNIV = typeof row.sectionTitleNIV === "string" ? row.sectionTitleNIV.trim() : null;

    if (!bookNameEn || Number.isNaN(chapterNumber) || chapterNumber < 1) {
      skipped++;
      continue;
    }
    const fallback = sectionTitle ?? sectionTitleKJV ?? sectionTitleNIV;
    if (!fallback) {
      skipped++;
      continue;
    }

    const book = bookByName.get(bookNameEn);
    if (!book) {
      console.warn("Unknown book:", bookNameEn);
      skipped++;
      continue;
    }

    const chapter = await prisma.bibleChapter.findUnique({
      where: { bookId_chapterNumber: { bookId: book.id, chapterNumber } },
      select: { id: true },
    });
    if (!chapter) {
      console.warn(`No chapter ${chapterNumber} for ${bookNameEn}`);
      skipped++;
      continue;
    }

    const data: { sectionTitle?: string; sectionTitleKJV?: string; sectionTitleNIV?: string } = {};
    const s = sectionTitle ?? fallback;
    const kjv = sectionTitleKJV ?? fallback;
    const niv = sectionTitleNIV ?? fallback;
    data.sectionTitle = s;
    data.sectionTitleKJV = kjv;
    data.sectionTitleNIV = niv;

    await prisma.bibleChapter.update({
      where: { id: chapter.id },
      data,
    });
    updated++;
  }

  console.log(`Done. Updated ${updated} chapter(s). Skipped ${skipped} row(s). No verse content was changed.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
