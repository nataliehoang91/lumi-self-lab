/**
 * Fetch section titles from API.bible for NIV, Vietnamese (VI), and KJV in one run.
 * Updates BibleChapter.sectionTitle (VI), sectionTitleKJV, and sectionTitleNIV.
 * Does not change verse content.
 *
 * Requires: API_BIBLE_KEY in .env (https://scripture.api.bible)
 *
 * Usage:
 *   npx tsx prisma/seed/fetch-all-section-titles-once.ts
 *
 * Optional: --delay=800  (ms between books per Bible, default 600)
 *
 * The script discovers Bible IDs from API.bible by name/abbreviation (NIV, Vietnamese, KJV).
 * If a Bible has no sections (404), that column is skipped for that Bible.
 */
import path from "node:path";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: path.resolve(process.cwd(), ".env") });

const API_BIBLE_BASE = "https://rest.api.bible/v1";

const NAME_EN_TO_ABBREV: Record<string, string> = {
  "Song of Solomon": "SNG",
  "1 Samuel": "1SA",
  "2 Samuel": "2SA",
  "1 Kings": "1KI",
  "2 Kings": "2KI",
  "1 Chronicles": "1CH",
  "2 Chronicles": "2CH",
  "1 Corinthians": "1CO",
  "2 Corinthians": "2CO",
  "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH",
  "1 Timothy": "1TI",
  "2 Timothy": "2TI",
  "1 Peter": "1PE",
  "2 Peter": "2PE",
  "1 John": "1JN",
  "2 John": "2JN",
  "3 John": "3JN",
};

type Column = "sectionTitle" | "sectionTitleKJV" | "sectionTitleNIV";

type BibleMeta = {
  id: string;
  name: string;
  abbreviation: string;
  abbreviationLocal: string;
  languageId: string;
};

async function fetchBibles(apiKey: string): Promise<BibleMeta[]> {
  const res = await fetch(`${API_BIBLE_BASE}/bibles`, { headers: { "api-key": apiKey } });
  if (!res.ok) throw new Error(`API.bible bibles list failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as {
    data?: Array<{
      id: string;
      name?: string;
      abbreviation?: string;
      abbreviationLocal?: string;
      language?: { id?: string };
    }>;
  };
  return (json.data ?? []).map((b) => ({
    id: b.id,
    name: (b.name ?? "").trim(),
    abbreviation: (b.abbreviation ?? "").trim().toLowerCase(),
    abbreviationLocal: (b.abbreviationLocal ?? "").trim().toLowerCase(),
    languageId: (b.language?.id ?? "").toLowerCase(),
  }));
}

function findBibleId(bibles: BibleMeta[], hints: { abbr?: string; nameContains?: string; lang?: string }): string | null {
  const abbr = hints.abbr?.toLowerCase();
  const nameContains = hints.nameContains?.toLowerCase();
  const lang = hints.lang?.toLowerCase();
  for (const b of bibles) {
    if (abbr && (b.abbreviation.includes(abbr) || b.abbreviationLocal.includes(abbr))) return b.id;
    if (nameContains && b.name.toLowerCase().includes(nameContains)) return b.id;
    if (lang && (b.languageId === lang || b.name.toLowerCase().includes(lang))) return b.id;
  }
  return null;
}

async function fetchBooksFromApi(apiKey: string, bibleId: string): Promise<{ id: string; name: string }[]> {
  const res = await fetch(`${API_BIBLE_BASE}/bibles/${bibleId}/books`, { headers: { "api-key": apiKey } });
  if (!res.ok) throw new Error(`API.bible books failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data?: Array<{ id: string; name?: string }> };
  return (json.data ?? []).map((b) => ({ id: b.id, name: (b.name ?? "").trim() }));
}

/** Build map from our nameEn to API book id. Uses name match, then abbrev, then order index (same canonical order). */
function buildBookIdMap(
  apiBooks: { id: string; name: string }[],
  ourBooksInOrder: { nameEn: string }[]
): (nameEn: string) => string | null {
  const byName = new Map<string, string>();
  for (const b of apiBooks) {
    if (b.name) byName.set(b.name.toLowerCase(), b.id);
  }
  const byOrder = new Map<string, string>();
  ourBooksInOrder.forEach((our, i) => {
    if (apiBooks[i]) byOrder.set(our.nameEn.toLowerCase(), apiBooks[i]!.id);
  });
  return (nameEn: string): string | null => {
    const fromName = byName.get(nameEn.toLowerCase());
    if (fromName) return fromName;
    const abbrev = NAME_EN_TO_ABBREV[nameEn];
    if (abbrev) {
      const found = apiBooks.find((b) => b.id.toUpperCase() === abbrev.toUpperCase());
      if (found) return found.id;
    }
    return byOrder.get(nameEn.toLowerCase()) ?? null;
  };
}

/** Returns section titles by chapter, or empty array if 404 (no sections for this book). */
async function fetchSectionsFromApi(
  apiKey: string,
  bibleId: string,
  bookId: string
): Promise<{ chapterNumber: number; title: string }[]> {
  const url = `${API_BIBLE_BASE}/bibles/${bibleId}/books/${bookId}/sections?include-chapter-numbers=true&include-verse-spans=true`;
  const res = await fetch(url, { headers: { "api-key": apiKey } });
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`Sections failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: Array<{ id: string; title?: string }> };
  const data = json.data ?? [];
  const out: { chapterNumber: number; title: string }[] = [];
  for (let i = 0; i < data.length; i++) {
    const section = data[i]!;
    const title = (section.title ?? "").trim();
    if (!title) continue;
    const parts = section.id.split(".");
    const chNum = parts.length >= 2 ? parseInt(parts[1], 10) : i + 1;
    if (chNum >= 1) out.push({ chapterNumber: chNum, title });
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runOneBible(
  apiKey: string,
  prisma: PrismaClient,
  bibleId: string,
  label: string,
  column: Column,
  books: { id: string; nameEn: string; chapterCount: number }[],
  delayMs: number
): Promise<{ updated: number; failed: number }> {
  let totalUpdated = 0;
  let failed = 0;
  const apiBooks = await fetchBooksFromApi(apiKey, bibleId);
  const getApiBookId = buildBookIdMap(apiBooks, books);

  for (let i = 0; i < books.length; i++) {
    const book = books[i]!;
    const apiBookId = getApiBookId(book.nameEn);
    if (!apiBookId) {
      console.warn(`  [${label}] Skip ${book.nameEn} (no API book id)`);
      continue;
    }
    try {
      const sections = await fetchSectionsFromApi(apiKey, bibleId, apiBookId);
      const byChapter = new Map(sections.map((s) => [s.chapterNumber, s.title]));

      const chapters = await prisma.bibleChapter.findMany({
        where: { bookId: book.id },
        orderBy: { chapterNumber: "asc" },
        select: { id: true, chapterNumber: true },
      });

      let updated = 0;
      for (const ch of chapters) {
        const title = byChapter.get(ch.chapterNumber);
        if (title) {
          await prisma.bibleChapter.update({
            where: { id: ch.id },
            data: { [column]: title },
          });
          updated++;
        }
      }
      totalUpdated += updated;
      console.log(`  [${label}] [${i + 1}/${books.length}] ${book.nameEn}: ${updated} chapter(s)`);
    } catch (e) {
      failed++;
      console.warn(`  [${label}] [${i + 1}/${books.length}] ${book.nameEn}: failed -`, e instanceof Error ? e.message : e);
    }
    if (i < books.length - 1) await sleep(delayMs);
  }
  return { updated: totalUpdated, failed };
}

async function main() {
  const apiKey = process.env.API_BIBLE_KEY?.trim();
  if (!apiKey) {
    console.error("API_BIBLE_KEY is required. Add it to .env in the project root.");
    process.exit(1);
  }

  const testRes = await fetch(`${API_BIBLE_BASE}/bibles`, { headers: { "api-key": apiKey } });
  if (!testRes.ok) {
    console.error("API key rejected:", testRes.status, await testRes.text());
    process.exit(1);
  }
  console.log("API key OK. Discovering NIV, Vietnamese, and KJV Bibles...\n");

  const bibles = await fetchBibles(apiKey);
  const nivId = findBibleId(bibles, { abbr: "niv", nameContains: "NIV" });
  const viId =
    findBibleId(bibles, { lang: "vie" }) ??
    findBibleId(bibles, { nameContains: "vietnamese" }) ??
    findBibleId(bibles, { nameContains: "việt" });
  const kjvId = findBibleId(bibles, { abbr: "kjv", nameContains: "King James" });

  const delayMs = process.argv.some((a) => a.startsWith("--delay="))
    ? parseInt(process.argv.find((a) => a.startsWith("--delay="))!.slice("--delay=".length), 10) || 600
    : 600;

  const prisma = new PrismaClient();
  const books = await prisma.bibleBook.findMany({
    orderBy: { order: "asc" },
    select: { id: true, nameEn: true, chapterCount: true },
  });

  let totalNIV = 0,
    totalVI = 0,
    totalKJV = 0;

  if (nivId) {
    console.log("--- NIV ---");
    const { updated } = await runOneBible(apiKey, prisma, nivId, "NIV", "sectionTitleNIV", books, delayMs);
    totalNIV = updated;
    console.log(`NIV: ${updated} chapter(s) updated.\n`);
  } else {
    console.log("NIV: No Bible found in API.bible (search for NIV). Skipped.\n");
  }

  if (viId) {
    console.log("--- Vietnamese ---");
    const { updated } = await runOneBible(apiKey, prisma, viId, "VI", "sectionTitle", books, delayMs);
    totalVI = updated;
    console.log(`Vietnamese: ${updated} chapter(s) updated.\n`);
  } else {
    console.log("Vietnamese: No Bible found in API.bible. Skipped.\n");
  }

  if (kjvId) {
    console.log("--- KJV ---");
    const { updated } = await runOneBible(apiKey, prisma, kjvId, "KJV", "sectionTitleKJV", books, delayMs);
    totalKJV = updated;
    console.log(`KJV: ${updated} chapter(s) updated.\n`);
  } else {
    console.log("KJV: No Bible found in API.bible. Skipped.\n");
  }

  console.log(
    `Done. NIV: ${totalNIV}, Vietnamese: ${totalVI}, KJV: ${totalKJV} chapter(s). No verse content was changed.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
