/**
 * Fetch section (chapter) titles from API.bible and update BibleChapter.sectionTitle.
 * Does not touch any verse content.
 *
 * Requires: API_BIBLE_KEY (get one at https://scripture.api.bible)
 * Add it to .env in the project root:  API_BIBLE_KEY=your_key
 *
 * Not all Bible versions on API.bible have section data. If you get 404 "Sections not found
 * for bookId", that Bible has no sections; try another --bible-id (e.g. a study Bible).
 *
 * Usage – one book at a time (safest):
 *   npx tsx prisma/seed/fetch-section-titles-all-books-kjv.ts --book=Genesis
 *
 * Usage – all 66 books in one run:
 *   npx tsx prisma/seed/fetch-section-titles-all-books-kjv.ts
 *
 * Optional: --delay=800  (ms between books when running all, default 600)
 * Optional: --bible-id=OTHER_ID  (default: KJV de4e12af7f28f599-01)
 */
import path from "node:path";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load .env from project root (folder where you run the command, e.g. lumi-self-lab)
config({ path: path.resolve(process.cwd(), ".env") });

const API_BIBLE_BASE = "https://rest.api.bible/v1";
const KJV_BIBLE_ID = "de4e12af7f28f599-01";

/** Fallback when API books list doesn't match our name (e.g. "Song of Songs" vs "Song of Solomon"). */
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

function parseArgs(): {
  delayMs: number;
  onlyBookName: string | null;
  bibleId: string;
} {
  const args = process.argv.slice(2);
  let delayMs = 600;
  let onlyBookName: string | null = null;
  let bibleId = KJV_BIBLE_ID;
  for (const a of args) {
    if (a.startsWith("--delay=")) delayMs = parseInt(a.slice("--delay=".length), 10) || 600;
    else if (a.startsWith("--book=")) onlyBookName = a.slice("--book=".length).trim() || null;
    else if (a.startsWith("--bible-id=")) bibleId = a.slice("--bible-id=".length).trim() || bibleId;
  }
  return { delayMs, onlyBookName, bibleId };
}

/** Fetch list of books for a Bible; use each book's id for sections/chapters. */
async function fetchBooksFromApi(
  apiKey: string,
  bibleId: string
): Promise<{ id: string; name: string }[]> {
  const url = `${API_BIBLE_BASE}/bibles/${bibleId}/books`;
  const res = await fetch(url, { headers: { "api-key": apiKey } });
  if (!res.ok) throw new Error(`API.bible books failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data?: Array<{ id: string; name?: string }> };
  const data = json.data ?? [];
  return data.map((b) => ({ id: b.id, name: (b.name ?? "").trim() }));
}

/** Build map from our nameEn to API book id using the list from the API. */
function buildBookIdMap(
  apiBooks: { id: string; name: string }[]
): (nameEn: string) => string | null {
  const byName = new Map<string, string>();
  for (const b of apiBooks) {
    if (b.name) byName.set(b.name.toLowerCase(), b.id);
  }
  return (nameEn: string) => {
    const id = byName.get(nameEn.toLowerCase());
    if (id) return id;
    const abbrev = NAME_EN_TO_ABBREV[nameEn];
    if (abbrev) {
      const byAbbrev = apiBooks.find((b) => b.id.toUpperCase() === abbrev.toUpperCase());
      if (byAbbrev) return byAbbrev.id;
    }
    return null;
  };
}

async function fetchSectionsFromApi(
  apiKey: string,
  bibleId: string,
  bookId: string
): Promise<{ chapterNumber: number; title: string }[]> {
  const url = `${API_BIBLE_BASE}/bibles/${bibleId}/books/${bookId}/sections?include-chapter-numbers=true&include-verse-spans=true`;
  const res = await fetch(url, {
    headers: { "api-key": apiKey },
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error(`Sections not available for this book (404). ${text}`);
    }
    throw new Error(`API.bible sections failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as {
    data?: Array<{ id: string; title?: string; [k: string]: unknown }>;
  };
  const data = json.data ?? [];
  const out: { chapterNumber: number; title: string }[] = [];
  for (let i = 0; i < data.length; i++) {
    const section = data[i];
    const title = (section.title ?? "").trim();
    if (!title) continue;
    const idParts = section.id.split(".");
    const chNum = idParts.length >= 2 ? parseInt(idParts[1], 10) : i + 1;
    if (chNum >= 1) out.push({ chapterNumber: chNum, title });
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const apiKey = process.env.API_BIBLE_KEY?.trim();
  if (!apiKey) {
    console.error("API_BIBLE_KEY is required. Get a key at https://scripture.api.bible");
    console.error("Add it to .env in the project root (same folder as package.json):");
    console.error("  API_BIBLE_KEY=your_key_here");
    console.error("Looking for .env in:", process.cwd());
    process.exit(1);
  }

  // Quick check: verify key works with a simple /bibles call before fetching sections
  const testRes = await fetch(`${API_BIBLE_BASE}/bibles`, {
    headers: { "api-key": apiKey },
  });
  if (!testRes.ok) {
    const body = await testRes.text();
    console.error("API key rejected by API.bible:", testRes.status, body);
    console.error("");
    console.error("Check:");
    console.error("  1. Dashboard: https://scripture.api.bible – is your app/key approved for API access?");
    console.error("  2. .env: no quotes, no spaces. Line should be exactly: API_BIBLE_KEY=your_key");
    console.error("  3. Regenerate the key in the dashboard and update .env if needed.");
    process.exit(1);
  }
  const { delayMs, onlyBookName, bibleId } = parseArgs();
  console.log("API key OK, fetching section titles...");
  if (bibleId !== KJV_BIBLE_ID) console.log(`Using Bible ID: ${bibleId}`);

  const apiBooks = await fetchBooksFromApi(apiKey, bibleId);
  const getApiBookId = buildBookIdMap(apiBooks);

  const prisma = new PrismaClient();

  let books = await prisma.bibleBook.findMany({
    orderBy: { order: "asc" },
    select: { id: true, nameEn: true, chapterCount: true },
  });

  if (onlyBookName) {
    const one = books.find((b) => b.nameEn.toLowerCase() === onlyBookName.toLowerCase());
    if (!one) {
      console.error(`Book not found: ${onlyBookName}`);
      process.exit(1);
    }
    books = [one];
    console.log(`Fetching section titles from API.bible (KJV) for 1 book: ${one.nameEn}`);
  } else {
    console.log(`Fetching section titles from API.bible (KJV) for ${books.length} books...`);
  }
  let totalUpdated = 0;
  let failed = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i]!;
    const apiBookId = getApiBookId(book.nameEn);
    if (!apiBookId) {
      console.warn(`  Skip ${book.nameEn} (no matching book in API)`);
      continue;
    }

    try {
      const sections = await fetchSectionsFromApi(apiKey, bibleId, apiBookId);
      const sectionTitlesByChapter = new Map(sections.map((s) => [s.chapterNumber, s.title]));

      const chapters = await prisma.bibleChapter.findMany({
        where: { bookId: book.id },
        orderBy: { chapterNumber: "asc" },
        select: { id: true, chapterNumber: true },
      });

      let updated = 0;
      for (const ch of chapters) {
        const title = sectionTitlesByChapter.get(ch.chapterNumber);
        if (title) {
          await prisma.bibleChapter.update({
            where: { id: ch.id },
            data: { sectionTitle: title },
          });
          updated++;
        }
      }

      totalUpdated += updated;
      console.log(`  [${i + 1}/${books.length}] ${book.nameEn}: ${updated} chapter(s)`);
    } catch (e) {
      failed++;
      console.warn(`  [${i + 1}/${books.length}] ${book.nameEn}: failed -`, e instanceof Error ? e.message : e);
    }

    if (i < books.length - 1) await sleep(delayMs);
  }

  console.log(`\nDone. Updated ${totalUpdated} chapter(s) total. ${failed} book(s) failed. No verse content was changed.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
